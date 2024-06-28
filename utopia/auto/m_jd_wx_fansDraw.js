let mode = __dirname.includes("Work");
const { Env } = require("../utopia");
const $ = new Env("M粉丝互动");
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_FANS_DRAW_URL);
if (mode) {
    $.activityUrl =
        "https://lzkjdz-isv.isvjcloud.com/wxFansInterActionActivity/activity/d0a4535d3d6e46ed81ebc514aeb6abe1?activityId=d0a4535d3d6e46ed81ebc514aeb6abe1";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10037&activityId=1791103560813043713&templateId=20210621090000fshd001&nodeId=101001&prd=cjwx";
    $.maxCookie = 5;
}
$.version = "v1.0.0";
class Task extends Env {
    constructor() {
        super();
    }
    async getPrizeList(context) {
        if (this.isV1Act) {
        } else if (this.isCommonAct) {
            let prizes = [];
            for (const e of ["giftLevelThree", "giftLevelOne", "giftLevelTwo"]) {
                JSON.parse(context.data.actInfo?.[e] || "[]").forEach((k) => prizes.push(k));
            }
            $.prizeList = prizes;
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
            let activityContent = await this.api("/api/task/fansInteraction/activity", {});
            $.prizeList = activityContent.data.prizeVoList;
            let score = activityContent.data.score;
            let loveScore = activityContent.data.loveScore;
            this.putMsg(`任务前 ${score}|${loveScore}`);
            await this.taskToDo(activityContent.data.taskList);
            activityContent = await this.api("/api/task/fansInteraction/activity", {});
            loveScore = activityContent.data.loveScore;
            score = activityContent.data.score;
            this.putMsg(`任务后 ${score}|${loveScore}`);
            for (let i = 0; i < $.prizeList.length; i++) {
                activityContent.data.ruleList[i].prizeInfoId = $.prizeList[i].prizeInfoId;
            }
            for (let ele of activityContent.data.ruleList.filter((o) => score >= o.score)) {
                let acquire = await this.api("/api/prize/receive/acquire", { prizeInfoId: ele.prizeInfoId, status: 1 });
                if (acquire.resp_code === 0) {
                    this.log(`领取成功 ${acquire.data.prizeName}`);
                    this.putMsg(acquire.data.prizeName);
                    if (acquire.data.prizeType === 3) {
                        this.addressId = acquire.data.addressId;
                        this.prizeName = acquire.data.prizeName;
                        await this.saveAddress();
                    }
                    if (acquire.data.prizeType === 7) {
                        this.putMsg(JSON.parse(acquire.data?.prizeJson || {})?.cardNumber || "");
                    }
                }
            }
            return;
        }
        let activityContent = await this.api("wxFansInterActionActivity/activityContent", `activityId=${$.activityId}&pin=${this.Pin}`);
        if (!activityContent.result || !activityContent.data) {
            this.putMsg(activityContent.errorMessage);
            return;
        }
        $.actStartTime = activityContent.data.actInfo.startTime;
        $.actEndTime = activityContent.data.actInfo.endTime;
        $.rule = activityContent.data.actInfo.actRule;
        await this.checkActivity(activityContent);
        let taskIds = activityContent.data.actInfo.taskIds;
        let actorInfo = activityContent.data.actorInfo;
        if (actorInfo.prizeOneStatus && actorInfo.prizeTwoStatus && actorInfo.prizeThreeStatus) {
            this.putMsg("完成");
            return;
        }
        let uuid = actorInfo.uuid;
        let taskMap = {
            1: "task1Sign",
            2: "task2BrowGoods",
            3: "task3AddCart",
            4: "task4Share",
            5: "task5Remind",
            6: "task6GetCoupon",
            7: "task7MeetPlaceVo",
        };
        for (let ele of taskIds.split(",")) {
            let task = activityContent.data[taskMap[ele]];
            if (task.finishedCount >= task.upLimit) {
                continue;
            }
            await this._algo();
            for (let i = 1; i <= task.upLimit - task.finishedCount; i++) {
                try {
                    if (taskMap[ele] === "task1Sign") {
                        await this.api(`wxFansInterActionActivity/doSign`, `activityId=${$.activityId}&uuid=${uuid}`);
                    }
                    if (taskMap[ele] === "task2BrowGoods" && task.taskGoodList?.length > 0) {
                        let taskGoodList = task.taskGoodList;
                        let skuId = taskGoodList[i].skuId;
                        await this.api(`wxFansInterActionActivity/doBrowGoodsTask`, `activityId=${$.activityId}&uuid=${uuid}&skuId=${skuId}`);
                    }
                    if (taskMap[ele] === "task3AddCart" && task.taskGoodList?.length > 0) {
                        let taskGoodList = task.taskGoodList;
                        let skuId = taskGoodList[i].skuId;
                        await this.api(`wxFansInterActionActivity/doAddGoodsTask`, `activityId=${$.activityId}&uuid=${uuid}&skuId=${skuId}`);
                    }
                    if (taskMap[ele] === "task4Share") {
                        await this.api(`wxFansInterActionActivity/doShareTask`, `activityId=${$.activityId}&uuid=${uuid}`);
                    }
                    if (taskMap[ele] === "task5Remind") {
                        await this.api(`wxFansInterActionActivity/doRemindTask`, `activityId=${$.activityId}&uuid=${uuid}`);
                    }
                    if (taskMap[ele] === "task6GetCoupon" && task.taskCouponInfoList?.length > 0) {
                        let couponInfoList = task.taskCouponInfoList;
                        let couponId = couponInfoList[0].couponInfo.couponId;
                        await this.api(`wxFansInterActionActivity/doGetCouponTask`, `activityId=${$.activityId}&uuid=${uuid}&couponId=${couponId}`);
                    }
                    if (taskMap[ele] === "task7MeetPlaceVo") {
                        await this.api(`wxFansInterActionActivity/doMeetingTask`, `activityId=${$.activityId}&uuid=${uuid}`);
                    }
                } catch (e) {
                    this.log(e);
                } finally {
                }
            }
        }
        let follow = actorInfo.follow;
        if (!follow) {
            await this.api("wxFansInterActionActivity/followShop", `activityId=${$.activityId}&uuid=${uuid}`);
        }
        activityContent = await this.api("wxFansInterActionActivity/activityContent", `activityId=${$.activityId}&pin=${this.Pin}`);
        actorInfo = activityContent?.data.actorInfo || actorInfo;
        let energyValue = actorInfo.energyValue;
        energyValue += actorInfo.fansLoveValue;
        let prizeOneStatus = actorInfo.prizeOneStatus;
        let prizeTwoStatus = actorInfo.prizeTwoStatus;
        let prizeThreeStatus = actorInfo.prizeThreeStatus;
        let actConfig = activityContent.data.actConfig;
        let prizeScoreOne = actConfig.prizeScoreOne;
        let prizeScoreTwo = actConfig.prizeScoreTwo;
        let prizeScoreThree = actConfig.prizeScoreThree;
        let drawType = "";
        if (!prizeOneStatus && energyValue >= prizeScoreOne) {
            drawType = "01";
        }
        if (!prizeTwoStatus && energyValue >= prizeScoreTwo) {
            drawType = "02";
        }
        if (!prizeThreeStatus && energyValue >= prizeScoreThree) {
            drawType = "03";
        }
        if (drawType) {
            let prize = await this.api(`wxFansInterActionActivity/startDraw`, `activityId=${$.activityId}&uuid=${uuid}&drawType=${drawType}`);
            this.log(JSON.stringify(prize));
            if (prize.result) {
                let msg = prize.data.drawOk ? prize.data.name : prize.data.errorMessage || "空气";
                this.putMsg(msg);
                if (prize.data.needWriteAddress === "y") {
                    this.addressId = prize.data.addressId;
                    this.prizeName = prize.data.name;
                    await this.saveAddress();
                }
            } else {
                this.putMsg(`${prize.errorMessage}`);
            }
        } else {
            this.putMsg(`积分${energyValue}，兑1:${prizeOneStatus}，兑2:${prizeTwoStatus}，兑3:${prizeThreeStatus}`);
        }
    }
}
$.after = async function () {
    try {
        for (let ele of $.prizeList || []) {
            $.msg.push(`    ${ele.name || ele.prizeName}${(ele?.type === 8 ? "专享价" : "") || ele.prizeType}`);
        }
    } catch (e) {
        console.log(e);
    }
    $.msg.push(`export M_WX_FANS_DRAW_URL="${$.activityUrl}"`);
};
$.start(Task);
