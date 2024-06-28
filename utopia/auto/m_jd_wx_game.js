let mode = __dirname.includes("Work");
const { Env, CryptoJS } = require("../utopia");
const $ = new Env("M无线游戏");
$.version = "v1.0.0";
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_GAME_URL);
if (mode) {
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10084&activityId=1779714416015704065&templateId=831049284&nodeId=101001&prd=cjwx";
    $.activityUrl = "https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v2/10095/1001/?shopId=1000000174&activityId=1791380013335764994";
    $.maxCookie = 1;
}
class Task extends Env {
    constructor() {
        super();
    }
    async getPrizeList(context) {
        if (this.isV2Act) {
            let prizes = await this.api(`/api/${this.activityType}/getPrizes`, {});
            $.prizeList = prizes.data;
        } else if (this.isV1Act) {
            let data = await this.api("/api/prize/drawPrize", {});
            if (data.resp_code !== 0) {
                this.log(`获取奖品是失败`);
                return;
            }
            $.prizeList = data.data?.prizeInfo || [];
        } else if (this.isCommonAct) {
            $.prizeList = context.data.drawContentVOs;
        }
    }
    async lotteryDraw() {
        let lotteryDraw = await this.api(`/api/${this.activityType}/lotteryDraw`, {});
        this.prizeName = lotteryDraw.data.prizeName || "空气";
        this.putMsg(this.prizeName);
        if (lotteryDraw.data.prizeType === 3) {
            this.log(lotteryDraw.data);
            this.addressId = lotteryDraw.data.result.result;
            this.prizeId = lotteryDraw.data.activityPrizeId;
            await this.saveAddress();
        }
        return true;
    }
    async exec() {
        if (!$.superVersion) {
            throw new Error("请更新脚本");
        }
        if (!$.activityId || !$.activityUrl) {
            $.exit = true;
            this.putMsg(`activityId|activityUrl不存在`);
            return;
        }
        let context = await this.login();
        if (this.isV2Act) {
            let gameInfo = await this.api(`/api/${this.activityType}/getTask`, {});
            await this.taskToDo(gameInfo?.data);
            let gameChanceNum = await this.api(`/api/${this.activityType}/gameChanceNum`, {});
            for (let i = 0; i < gameChanceNum.data; i++) {
                try {
                    const { data } = await this.api(`/api/${this.activityType}/gameStart`, {});
                    await this.api(`/api/${this.activityType}/gameEnd`, { uuid: data.uuid });
                } catch (e) {}
            }
            let chanceNum = await this.api(`/api/${this.activityType}/chanceNum`, {});
            if (parseInt(chanceNum.data) === 0) {
                this.putMsg("无抽奖次数");
                await this.runCached();
                return;
            }
            for (let i = 0; i < parseInt(chanceNum.data); i++) {
                await this.lotteryDraw();
            }
            return;
        }
        if (this.isV1Act) {
            let gameInfo = await this.api("/api/game/getGameInfo", {
                gameUrl: `https://lzkj-yc.isvjd.com/index.html?templateId=${$.templateId}&token=${this.isvToken}`,
                shareUserId: "",
            });
            await this.taskToDo(gameInfo?.data?.taskList);
            gameInfo = await this.api("/api/game/getGameInfo", {
                gameUrl: `https://lzkj-yc.isvjd.com/index.html?templateId=${$.templateId}&token=${this.isvToken}`,
                shareUserId: "",
            });
            let init = await this.api("/api/game/init", { templateId: $.templateId });
            for (let i = 0; i < gameInfo.data.gameChance; i++) {
                try {
                    let start = await this.api("/api/game/start", {});
                    if (!start?.data) {
                        $.log("无游戏次数");
                        break;
                    }
                    const encrypted = this.rsaEncrypt(
                        init.data.publicKey,
                        { encryptionScheme: "pkcs1" },
                        { id: start.data.id, score: `${init.data.ruleScore}` }
                    );
                    await this.api("/api/game/end", { result: encrypted, activityId: $.activityId });
                } catch (e) {
                    this.log(e.message);
                }
            }
            gameInfo = await this.api("/api/game/getGameInfo", {
                gameUrl: `https://lzkj-yc.isvjd.com/index.html?templateId=${$.templateId}&token=${this.isvToken}`,
                shareUserId: "",
            });
            let canDrawTimes = gameInfo.data.canDrawTimes;
            if (canDrawTimes === 0) {
                this.putMsg("无抽奖次数");
                await this.runCached();
                return;
            }
            for (let i = 0; i < canDrawTimes; i++) {
                let prize = await this.api("/api/prize/draw", { consumePoints: 0 });
                if (prize.data) {
                    this.prizeName = prize.data.prizeName;
                    this.putMsg(this.prizeName);
                    if (prize.data.prizeType === 3) {
                        this.addressId = prize.data.addressId;
                        await this.saveAddress();
                    }
                    if (prize.data.prizeType === 7) {
                        this.putMsg(JSON.parse(prize.data?.prizeJson || {})?.cardNumber || "");
                    }
                } else {
                    this.putMsg(prize.resp_msg || "空气");
                    if ($.exit) {
                        break;
                    }
                }
            }
            return;
        }
        let activityContent = await this.api("wxGameActivity/activityContent", `activityId=${$.activityId}&pin=${this.Pin}`);
        if (!activityContent.result || !activityContent.data) {
            return;
        }
        $.actStartTime = activityContent.data.startTime || "";
        $.actEndTime = activityContent.data.endTime || "";
        $.actName = activityContent.data.name;
        $.rule = activityContent.data.rule;
        await this.checkActivity(activityContent);
        await this.getPrizeList(activityContent);
        let prizes = $.prizeList.filter((o) => [6, 7, 9, 13, 14, 15, 16].includes(o.type) && o.prizeNum > o.hasSendPrizeNum);
        if (prizes.length === 0) {
            this.putMsg("垃圾或领完");
            $.exit = true;
            return;
        }
        let drawCount = activityContent.data.todayCanDrawOk || 1;
        await this.api("wxGameActivity/follow", `activityId=${$.activityId}&pin=${this.Pin}`);
        for (let i = 0; i < Math.min(drawCount, 50); i++) {
            let score = $.random(prizes[0].startScore, prizes[0].endScore);
            score = score + "";
            score = (score.substring(0, score.length - 1) + 0) * 1;
            if ($.domain.includes("cjhy")) {
                score = this.encryptCrypto("AES", "ECB", "Pkcs7", score, $.activityId, "00000000");
                score = encodeURIComponent(encodeURIComponent(score));
                await this.api("wxGameActivity/gameStartDeposit", `activityId=${$.activityId}&pin=${this.Pin}`);
            }
            let prize = await this.api("wxGameActivity/gameOverRecord", `activityId=${$.activityId}&pin=${this.Pin}&score=${score}`);
            if (prize.result) {
                this.putMsg(prize.data.name || "空气");
                if (prize.data.needWriteAddress === "y") {
                    this.addressId = prize.data.addressId;
                    this.prizeName = prize.data.name;
                    await this.saveAddress();
                }
            } else {
                this.putMsg(`${prize.errorMessage}`);
            }
        }
    }
    encryptCrypto(method, mode, padding, message, key, iv) {
        return CryptoJS[method]
            .encrypt(CryptoJS.enc.Utf8.parse(message), CryptoJS.enc.Utf8.parse(key), {
                mode: CryptoJS.mode[mode],
                padding: CryptoJS.pad[padding],
                iv: CryptoJS.enc.Utf8.parse(iv),
            })
            .ciphertext.toString(CryptoJS.enc.Base64);
    }
}
$.after = async function () {
    try {
        for (let ele of $.prizeList) {
            if ($.activityUrl.includes("activityType")) {
                $.msg.push(`    ${ele.name || ele.prizeName} 剩${ele?.leftNum}份`);
            } else {
                $.msg.push(`    ${ele.name || ele.prizeName} ${ele?.prizeNum - ele?.hasSendPrizeNum}/${ele?.prizeNum}份`);
            }
        }
    } catch (e) {
        console.log(e);
    }
    $.msg.push(`export M_WX_GAME_URL="${$.activityUrl}"`);
};
$.start(Task);
