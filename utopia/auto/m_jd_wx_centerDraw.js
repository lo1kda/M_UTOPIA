let mode = __dirname.includes("Work");
const { Env } = require("../utopia");
const $ = new Env("M老虎机抽奖");
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_CENTER_DRAW_URL);
$.uid = ""; 
$.version = "v1.0.0";
if (mode) {
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10054&activityId=1780190943865262082&templateId=20210804190900ssq011&nodeId=101001054&prd=cjwx&adsource=tg_storePage";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/drawCenter/activity/042762ab91a74b0d83745a8a2b0ce85d?activityId=042762ab91a74b0d83745a8a2b0ce85d&adsource=tg_storePage";
    $.maxCookie = 5;
}
class Task extends Env {
    constructor(data) {
        super();
    }
    async getPrizeList(context) {
        if (this.isCommonAct) {
            let prizeList = await this.api(
                "drawCenter/getPrizeList",
                `activityId=${$.activityId}&activityType=${$.activityType}&venderId=${$.venderId}`
            );
            if (prizeList.result) {
                $.prizeList = prizeList.data;
            }
            $.prizeList = [];
        }
        if (this.isV1Act) {
            let data = await this.api("/api/prize/drawPrize", {});
            if (data.resp_code !== 0) {
                this.log(`获取奖品是失败`);
                return;
            }
            this.super.prizeList = data.data?.prizeInfo || [];
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
        if (this.isV1Act) {
            let getTask = await this.api("/api/task/upperSign/getTask", { shareUserId: "" });
            await this.taskToDo(getTask?.data?.taskList);
            let drawPrize = await this.api("/api/prize/drawPrize", {});
            this.canDrawTimes = drawPrize.data.drawNumber || 0;
            if (this.canDrawTimes === 0) {
                this.putMsg("无抽奖次数");
                return;
            }
            for (let m = 0; this.canDrawTimes--; m++) {
                let prize = await this.api("/api/prize/draw", { consumePoints: $.integral });
                if (prize.data == "1") {
                    this.putMsg("积分不足");
                    break;
                }
                if (prize.resp_code == "0") {
                    if (prize.data.dayTime == $.now("yyyy-MM-dd")) {
                        this.putMsg(prize.data.prizeName);
                        if (prize.data.prizeType == 3) {
                            this.addressId = prize.data.addressId;
                            this.prizeName = prize.data.prizeName;
                            await this.saveAddress();
                        }
                    } else {
                        this.putMsg("空气");
                    }
                } else {
                    this.putMsg(prize.resp_msg);
                }
            }
            return;
        }
        this.nickname = this.ptpin;
        let activityContent = await this.api(
            "drawCenter/activityContent",
            `activityId=${$.activityId}&pin=${this.Pin}&nick=${this.nickname}&pinImg=${encodeURIComponent($.attrTouXiang)}&shareUuid=${$.uid || ""}`
        );
        if (!activityContent.result || !activityContent.data) {
            this.putMsg(activityContent.errorMessage);
            return;
        }
        $.rule = activityContent.data.actRule;
        if (!$.uid) {
            $.uid = activityContent.data.uid; 
        }
        await this.checkActivity(activityContent, false);
        let myInfo = await this.api("drawCenter/myInfo", `activityId=${$.activityId}&pin=${this.Pin}`);
        if (!myInfo.result) {
            this.putMsg("获取任务列表失败");
            return;
        }
        $.skuList = [];
        for (let ele of myInfo?.data?.taskList.filter((o) => !["share2help"].includes(o.taskId) && o.curNum < o.maxNeed) || []) {
            let count = ele.maxNeed - ele.curNum;
            if (ele.taskId === "ordersku") {
                let products = await this.api("drawCenter/getProduct", `activityId=${$.activityId}&pin=${this.Pin}&type=2`);
                for (let pd of products?.data.filter((o) => !o.taskDone)) {
                    if (count <= 0) {
                        break;
                    }
                    await this.api("drawCenter/doTask", `activityId=${$.activityId}&pin=${this.Pin}&taskId=ordersku&param=${pd.skuId}`);
                    count--;
                }
            } else if (ele.taskId === "followsku") {
                let products = await this.api("drawCenter/getProduct", `activityId=${$.activityId}&pin=${this.Pin}&type=3`);
                for (let pd of products?.data.filter((o) => !o.taskDone)) {
                    if (count <= 0) {
                        break;
                    }
                    await this.api("drawCenter/doTask", `activityId=${$.activityId}&pin=${this.Pin}&taskId=followsku&param=${pd.skuId}`);
                    count--;
                }
            } else if (ele.taskId === "add2cart") {
                let products = await this.api("drawCenter/getProduct", `activityId=${$.activityId}&pin=${this.Pin}&type=1`);
                for (let pd of products?.data.filter((o) => !o.taskDone)) {
                    if (count <= 0) {
                        break;
                    }
                    $.skuList.push(pd.skuId);
                    await this.api("drawCenter/doTask", `activityId=${$.activityId}&pin=${this.Pin}&taskId=add2cart&param=${pd.skuId}`);
                    count--;
                }
            } else if (ele.taskId === "scansku") {
                let products = await this.api("drawCenter/getProduct", `activityId=${$.activityId}&pin=${this.Pin}&type=4`);
                for (let pd of products?.data.filter((o) => !o.taskDone)) {
                    if (count <= 0) {
                        break;
                    }
                    await this.api("drawCenter/doTask", `activityId=${$.activityId}&pin=${this.Pin}&taskId=scansku&param=${pd.skuId}`);
                    count--;
                }
            } else {
                this.log(ele.taskId);
                await this.api("drawCenter/doTask", `activityId=${$.activityId}&pin=${this.Pin}&taskId=${ele.taskId}&param=`);
            }
        }
        activityContent = await this.api(
            "drawCenter/activityContent",
            `activityId=${$.activityId}&pin=${this.Pin}&nick=${this.nickname}&pinImg=${encodeURIComponent(
                "https://img10.360buyimg.com/imgzone/jfs/t1/21383/2/6633/3879/5c5138d8E0967ccf2/91da57c5e2166005.jpg"
            )}&shareUuid=${$.uid}`
        );
        this.canDrawTimes = activityContent.data.chance || 0;
        if (this.canDrawTimes === 0) {
            this.putMsg(`无抽奖次数`);
            return;
        }
        for (let i = 0; i < Math.min(this.canDrawTimes, 7); i++) {
            let prize = await this.api("/drawCenter/draw/luckyDraw", `activityId=${$.activityId}&pin=${this.Pin}`);
            if (prize.result) {
                if (prize.data.drawOk) {
                    this.putMsg(prize.data.name);
                    if (prize.data.needWriteAddress === "y") {
                        this.addressId = prize.data.addressId;
                        this.prizeName = prize.data.name;
                        await this.saveAddress();
                    }
                } else {
                    this.putMsg("空气");
                }
            } else {
                this.putMsg(`${prize.errorMessage}`);
                break;
            }
        }
    }
}
$.after = async function () {
    try {
        for (let ele of $.prizeList || []) {
            if (ele?.name?.includes("谢谢") || ele?.name?.includes("再来")) {
                continue;
            }
            if ($.activityUrl.includes("activityType")) {
                $.msg.push(`    ${ele?.prizeName} ${ele?.prizeType} ${ele.leftNum}/${ele.allNum || "未知"}份`);
            } else {
                $.msg.push(`    ${ele?.name || ele?.prizeName}${ele?.type === 8 ? "专享价" : ""}`);
            }
        }
    } catch (e) {
        console.log(e);
    }
    $.msg.push(`export M_WX_CENTER_DRAW_URL="${$.activityUrl}"`);
};
$.start(Task);
