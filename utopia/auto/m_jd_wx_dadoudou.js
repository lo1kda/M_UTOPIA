let mode = __dirname.includes("Work");
const { Env, CryptoJS } = require("../utopia");
const $ = new Env("M打豆豆");
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_DADOUDOU_URL);
if (mode) {
    $.activityUrl = "https://lzkj-isv.isvjcloud.com/wxgame/activity/bf6af094dcc140a382f402408ac4f8c7?activityId=bf6af094dcc140a382f402408ac4f8c7";
    $.maxCookie = 1;
}
class Task extends Env {
    constructor() {
        super();
    }
    async getPrizeList(content) {
        $.prizeList = content.data.drawContentList;
    }
    async exec() {
        if (!$.activityId || !$.activityUrl) {
            $.exit = true;
            this.putMsg(`activityId|activityUrl不存在`);
            return;
        }
        await this.login();
        let activityContent = await this.api(
            "wxgame/activityContent",
            `activityId=${$.activityId}&pin=${this.Pin}&pinImg=${encodeURIComponent($.attrTouXiang)}&nick=${this.ptpin}&cjyxPin=&cjhyPin=&shareUuid=${
                $.shareId || ""
            }`
        );
        if (!activityContent.result || !activityContent.data) {
            this.putMsg("明日再来，还未开始");
            $.exit = true;
            return;
        }
        $.rule = activityContent.data.actRule;
        await this.checkActivity(activityContent);
        $.actName = activityContent.data.activityName;
        $.drawMiniScore = activityContent.data.drawMiniScore;
        if (activityContent.data.isGameEnd) {
            this.putMsg("活动已结束");
            $.exit = true;
            return;
        }
        let tasks = await this.api("wxgame/myInfo", `activityId=${$.activityId}&pin=${this.Pin}`);
        if (tasks.result && tasks.data.taskList.filter((o) => o.taskId !== "share2help")) {
            for (let ele of tasks.data.taskList.filter((o) => o.curNum < o.maxNeed)) {
                try {
                    if (ele.taskId === "followsku") {
                        let followskuData = await this.api("wxgame/getProduct", `type=3&activityId=${$.activityId}&pin=${this.Pin}`);
                        for (let i = 0; i < followskuData.data.length && i < ele.maxNeed; i++) {
                            let fsku = followskuData.data[i];
                            await this.api("wxgame/doTask", `activityId=${$.activityId}&pin=${this.Pin}&taskId=${ele.taskId}&param=${fsku.skuId}`);
                        }
                    } else if (ele.taskId === "add2cart") {
                        let add2cartData = await this.api("wxgame/getProduct", `type=1&activityId=${$.activityId}&pin=${this.Pin}`);
                        for (let i = 0; i < add2cartData.data.length && i < ele.maxNeed; i++) {
                            let asku = add2cartData.data[i];
                            await this.api("wxgame/doTask", `activityId=${$.activityId}&pin=${this.Pin}&taskId=${ele.taskId}&param=${asku.skuId}`);
                        }
                    } else {
                        let result = await this.api("wxgame/doTask", `activityId=${$.activityId}&pin=${this.Pin}&taskId=${ele.taskId}&param=`);
                    }
                } catch (e) {
                    this.log(e);
                }
            }
        }
        tasks = await this.api("wxgame/myInfo", `activityId=${$.activityId}&pin=${this.Pin}`);
        if (tasks?.data?.chance === 0) {
            await this.runCached();
            this.putMsg(`无抽奖次数`);
            return;
        }
        for (let i = 0; i < Math.min(tasks?.data?.chance, 7); i++) {
            try {
                let startGame = await this.api("wxgame/game/start", `activityId=${$.activityId}&pin=${this.Pin}`);
                let gameId = startGame.data;
                let gameScore = $.drawMiniScore + this.random(100, 200);
                let reqtime = Date.now();
                let gamesign = CryptoJS.MD5(`${gameId},${reqtime},${gameScore},0eed6538f6e84b754ad2ab95b45c54f8`).toString();
                await this.api(
                    "wxgame/game/end",
                    `activityId=${$.activityId}&pin=${this.Pin}&score=${gameScore}&gameId=${gameId}&reqtime=${reqtime}&sign=${gamesign}&getRank=true&getScoreRank=true&getPlayerNum=true`
                );
                let reqTime = Date.now();
                let luckyDraw = await this.api(
                    "wxgame/game/luckyDraw",
                    `activityId=${$.activityId}&pin=${this.Pin}&score=${gameScore}&gameId=${gameId}&reqtime=${reqTime}&sign=${CryptoJS.MD5(
                        `${gameId},${reqTime},0eed6538f6e84b754ad2ab95b45c54f8`
                    ).toString()}`
                );
                if (luckyDraw.result) {
                    this.putMsg(luckyDraw.data.name || "空气");
                    if (luckyDraw.data?.needWriteAddress === "y") {
                        this.addressId = luckyDraw.data.addressId;
                        this.prizeName = luckyDraw.data.name;
                        await this.saveAddress();
                    }
                } else {
                    this.putMsg(`${luckyDraw.errorMessage}`);
                    if ($.exit) {
                        break;
                    }
                }
            } catch (e) {
                this.log(e);
            }
        }
    }
}
$.after = async function () {
    for (let ele of $.prizeList || []) {
        $.msg.push(`    ${ele.name}`);
    }
    $.msg.push(`export M_WX_DADOUDOU_URL="${$.activityUrl}"`);
};
$.start(Task);
