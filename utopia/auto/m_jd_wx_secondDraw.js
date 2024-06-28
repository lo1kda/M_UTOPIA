let mode = __dirname.includes("Work");
const { Env } = require("../utopia");
const $ = new Env("M读秒手速");
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_SECOND_DRAW_URL);
if (mode) {
    $.activityUrl = "https://lzkj-isv.isvjcloud.com/wxSecond/activity/1eac10bdea024ff88e56a1f9ec0a2f11?activityId=1eac10bdea024ff88e56a1f9ec0a2f11";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10035&templateId=2021062190900dmpss011&activityId=1729812465189593089&nodeId=101001&prd=cjwx&shopid=1000015502";
}
$.version = "v1.0.0";
class Task extends Env {
    constructor() {
        super();
    }
    async getPrizeList(context) {
        if (this.isHdbAct) {
            let loadFrontAward = await this.api("/front/activity/loadFrontAward", {});
            if (loadFrontAward.succ) {
                $.prizeList = loadFrontAward.result || [];
            } else {
                this.log(loadFrontAward.message);
            }
        } else if (/(activityType)/.test($.activityUrl)) {
            let data = await this.api("/api/prize/drawPrize", {});
            if (data.resp_code !== 0) {
                this.log(`获取奖品是失败`);
                return;
            }
            $.prizeList = data.data?.prizeInfo || [];
        } else {
            $.prizeList = context.data.prizeList;
        }
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
        await this.login();
        $.concurrencyLimit = $.getEnv("M_CONC_LIMIT");
        if (this.isV1Act) {
            let gameInfo = await this.api("/api/task/dmpss/activity", { shareUserId: "" });
            await this.taskToDo(gameInfo?.data?.taskActivityInfoVO?.taskList);
            gameInfo = await this.api("/api/task/dmpss/activity", { shareUserId: "" });
            let challengeSecond = gameInfo.data.challengeSecond;
            let challengeMilliSecond = gameInfo.data.challengeMilliSecond;
            let challengeTime = `${challengeSecond}.${challengeMilliSecond}`;
            let gameChance = gameInfo.data.dayChance || 0;
            let publicKey = gameInfo.data.pubKey;
            let roomId = gameInfo.data.roomId;
            let tpIndex = $.addressIndex;
            if (gameChance === 0) {
                this.putMsg("无游戏次数");
                return;
            }
            for (let i = 0; i < gameChance; i++) {
                let start = await this.api("/api/task/dmpss/startGame", { roomId: roomId });
                let buttonId = start.data;
                let newgameId = `${roomId},${buttonId}`;
                const encrypted = this.rsaEncrypt(publicKey, { encryptionScheme: "pkcs1" }, { id: newgameId, score: challengeTime });
                await this.api("/api/task/dmpss/draw", { canDrawFlag: "true", differenceTime: "0", challengeTime: challengeTime });
                let prize = await this.api("/api/task/dmpss/draw", { result: encrypted });
                if (prize.data.isDraw) {
                    this.putMsg(prize.data.prizeName);
                    if (prize.data.prizeType == 3) {
                        this.addressId = prize.data.addressId;
                        this.prizeName = prize.data.prizeName;
                        await this.saveAddress();
                    }
                    if (prize.data.prizeType == 7) {
                        this.putMsg(JSON.parse(prize.data?.prizeJson || {})?.cardNumber || "");
                    }
                } else {
                    this.putMsg("空气");
                }
                gameInfo = await this.api("/api/task/dmpss/activity", { shareUserId: "" });
                roomId = gameInfo.data.roomId;
            }
            return;
        }
        let activityContent = await this.api("wxSecond/getData", `activityId=${$.activityId}&pin=${this.Pin}&shareUuid=&activityStatus=`);
        if (!activityContent.result || !activityContent.data) {
            this.putMsg(activityContent.errorMessage);
            await this.wxStop(activityContent.errorMessage);
            return;
        }
        let count = activityContent.data.score;
        let active = activityContent.data.secondActive;
        let brushBane = encodeURIComponent(activityContent.data.brushBane);
        let bid = activityContent.data.bid;
        $.actStartTime = active.startTime;
        let targetTime = active.targetTime;
        $.actEndTime = active.endTime;
        let uuid = activityContent.data.uuid;
        this.skuList = [];
        await this.checkActivity(activityContent);
        let game = await this.api("wxSecond/getTaskDay", `activityId=${$.activityId}&pin=${this.Pin}&uuid=${uuid}`);
        if (game.result) {
            for (const ele of game.data || []) {
                let taskType = ele.taskType;
                for (let i = 0; i < ele.dayMaxNumber && ele.finishNumber === 0; i++) {
                    if ([2, 5].includes(taskType)) {
                        let goods = ele.activityTaskGoods.slice(i * ele.commodity, i * ele.commodity + ele.commodity).filter((o) => o.complete === 0);
                        for (let good of goods) {
                            this.skuList.push(good.skuId);
                            let t = await this.api(
                                "wxSecond/finishTask",
                                `activityId=${$.activityId}&uuid=${uuid}&taskType=${taskType}&skuId=${good.skuId}`
                            );
                            if (t.result) {
                                count += t.data.score;
                            }
                        }
                    }
                }
            }
        }
        game = await this.api("wxSecond/getTask", `activityId=${$.activityId}&pin=${this.Pin}&uuid=${uuid}`);
        if (game.result) {
            for (const ele of game.data || []) {
                let taskType = ele.taskType;
                for (let i = 0; i < ele.dayMaxNumber && ele.finishNumber === 0; i++) {
                    if ([3].includes(taskType)) {
                        let goods = ele.activityTaskGoods.slice(i * ele.commodity, i * ele.commodity + ele.commodity).filter((o) => o.complete === 0);
                        for (let good of goods) {
                            this.skuList.push(good.skuId);
                            let t = await this.api(
                                "wxSecond/finishTask",
                                `activityId=${$.activityId}&uuid=${uuid}&taskType=${taskType}&skuId=${good.skuId}`
                            );
                            if (t.result) {
                                count += t.data.score;
                            }
                        }
                    }
                    if ([12].includes(taskType)) {
                        let t = await this.api("wxSecond/finishTask", `activityId=${$.activityId}&uuid=${uuid}&taskType=${taskType}&skuId=`);
                        if (t.result) {
                            count += t.data.score;
                        }
                    }
                }
            }
        }
        if (count === 0) {
            this.putMsg(`游戏次数0，不跑了`);
            return;
        }
        for (let i = 0; i < Math.min(count, 10); i++) {
            let auth = await this.api("/wxSecond/checkAuth", `activityId=${$.activityId}&brushBane=${brushBane}&bid=${bid}&pin=${this.Pin}`);
            let brushResult = encodeURIComponent(auth.data.data.brushResult);
            let prize = await this.api(
                "wxSecond/start",
                `activityId=${$.activityId}&uuid=${uuid}&seconds=${targetTime}&brushBane=${brushResult}&bid=${encodeURIComponent(auth.data.data.bid)}`
            );
            if (prize.result) {
                let msg = prize.data.draw.drawOk ? prize.data.draw.name : prize.data.errorMessage || "空气";
                this.putMsg(msg);
            } else {
                if (prize.errorMessage) {
                    this.putMsg(`${prize.errorMessage}`);
                    if (prize.errorMessage.includes("来晚了") || prize.errorMessage.includes("已发完") || prize.errorMessage.includes("活动已结束")) {
                        $.exit = true;
                        break;
                    }
                }
            }
        }
        let records = await this.api("wxSecond/myPrize", `activityId=${$.activityId}&uuid=${uuid}`);
        if (records.result) {
            for (let record of records?.data?.filter((o) => o.type === 7 && o.needWriteAddress === "y" && o.drawTime === $.now("yyyy-MM-dd")) || []) {
                this.addressId = record.addressId;
                this.prizeName = record.name;
                await this.saveAddress();
            }
        }
        this.skuList?.length > 0 ? await this.carRmv(this.skuList) : "";
    }
}
$.after = async function () {
    try {
        for (let ele of $.prizeList || []) {
            if (ele.hasOwnProperty("leftNum")) {
                $.msg.push(`    ${ele.name || ele.prizeName} 剩${ele?.leftNum}份`);
            } else {
                $.msg.push(`    ${ele.name || ele.prizeName}`);
            }
        }
    } catch (e) {
        console.log(e);
    }
    $.msg.push(`export M_WX_SECOND_DRAW_URL="${$.activityUrl}"`);
};
$.start(Task);
