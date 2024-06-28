let mode = __dirname.includes("Work");
const { Env } = require("../utopia");
const $ = new Env("M幸运抽奖");
$.version = "v1.0.0";
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_LUCK_DRAW_URL);
if (mode) {
    $.activityUrl = "https://hzbz-isv.isvjcloud.com/bigdraw/draw.h4?id=f12fc1601u7x";
    $.activityUrl = "https://jingyun-rc.isvjcloud.com/h5/pages/turntable/turntableNewyear?id=52819136d47dd60ecd06c6b70d2034b7&userId=13091436";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v1/index?activityType=10041&activityId=1760596946454425601&templateId=20210714190900ysz01&nodeId=101001&prd=crm";
    $.activityUrl =
        "https://jingyun-rc.isvjcloud.com/h5/pages/bestTicket/default?id=caf6fb4bbad5d0fbcf67fba745da3fec&userId=139755&sid=&un_area=1_72_55674_0";
    $.activityUrl = "https://cjhy-isv.isvjcloud.com/wxDrawActivity/activity?activityId=7c08681e9f9946729df0fb6023afb223";
    $.activityUrl =
        "https://lorealjdcampaign-rc.isvjcloud.com/interact/index?activityType=10021&activityId=1778698973209247746&templateId=20210527190900dazhuanpan01&nodeId=101001&prd=crm";
    $.activityUrl =
        "https://jingyun-rc.isvjcloud.com/h5/pages/turntable/turntable?id=7d089ffc2d54fa0a29459b662972d547&userId=1000000289&actForm=single";
    $.activityUrl = "https://cjhy-isv.isvjcloud.com/wxDrawActivity/activity/activity?activityId=2e92b6a3afb4490fb48c922b1780150a";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10021&activityId=1792456979906080770&templateId=33ed5a4c-5aae-4b99-8b92-85c1c2e5a785&nodeId=101001&prd=cjwx";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10021&activityId=1790722771933700098&templateId=33ed5a4c-5aae-4b99-8b92-85c1c2e5a785&nodeId=101001&prd=cjwx";
    $.activityUrl = "https://gzsl-isv.isvjcloud.com/wuxian/mobileForApp/dist/views/pages/gameGGL_16.html?activityId=fdf67247754c4b76a3cb59bfb9ece88a";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10021&activityId=1788766433527828482&templateId=2023120710021dzpcj01&nodeId=101001&prd=cjwx";
    $.activityUrl = "https://cjhy-isv.isvjcloud.com/wxDrawActivity/activity?activityId=00c253633f0f4cfd870fad4381bcdd25";
    $.activityUrl = "https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v1/index?shareKey=f3a21af508c870405d624d398f1502ba";
    $.enableRunCache = false;
    $.concNum = 1;
    $.maxCookie = 10;
    $.cookieTypes = ["redis"];
}
let maxLimit = "";
let everyLimit = "";
let luckLimitRule = "";
class Task extends Env {
    constructor(data) {
        super();
    }
    async getPrizeList(context) {
        if (this.isV2Act) {
            let prizes = await this.api(`/api/${this.activityType}/getPrizes`, {});
            $.prizeList = prizes.data;
        } else if (this.isJinggengAct) {
            if ($.activityUrl.includes("loadBlindBox")) {
                $.prizeList = JSON.parse(context("#jdEquityList").attr("value"));
            } else {
                $.prizeList = JSON.parse(context("#awards", "body").text());
            }
        } else if (this.isCommonAct) {
            $.prizeList = context.data.content;
        } else if (this.isHdbAct) {
            let loadFrontAward = await this.api("/front/activity/loadFrontAward", {});
            if (loadFrontAward.succ) {
                $.prizeList = loadFrontAward.result || [];
            } else {
                this.log(loadFrontAward.message);
            }
        } else if (this.isV1Act) {
            let data = await this.api("/api/prize/drawPrize", {});
            if (data.resp_code !== 0) {
                this.log(`获取奖品是失败`);
                return;
            }
            $.prizeList = data.data?.prizeInfo || [];
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
            this.putMsg(`activityId|activityUrl不存在`, $.activityUrl, $.activityId);
            return;
        }
        let jinggengFn = "showTaskDraw";
        if ($.activityUrl.includes("showDrawOne")) {
            jinggengFn = "showDrawOne";
        } else if ($.activityUrl.includes("loadBlindBox")) {
            jinggengFn = "loadBlindBox";
        }
        let context = await this.login({ fn: this.isJinggengAct ? `ql/front/${jinggengFn}` : `wuxian/user/getLottery/${$.activityId}` });
        if (this.isHzbzAct) {
            const drawInfoval = context("#draw_info").val();
            const drawInfo = JSON.parse(drawInfoval);
            const { prizeStockOutNotice, preheatCanNotGetChanceTips, prizes, condtions } = drawInfo;
            this.log(drawInfo);
            for (const iterator of condtions) {
                const { type, id } = iterator;
                if (type === "sc_shop") {
                    const CollectShopToDrawData = await this.api("bigdraw/CollectShopToDraw.json", `conditionid=${id}`);
                    this.log(CollectShopToDrawData);
                    this.log(CollectShopToDrawData.txt);
                }
            }
            const DoDrawData = await this.api("bigdraw/DoDraw.json", `needCollectShop=false`);
            this.log(DoDrawData);
            const { code, prizeName, canNotDraw, txt } = DoDrawData;
            if (code === 3) {
                this.putMsg("空气");
                return;
            } else if (code === 2) {
                this.putMsg(prizeName);
                return;
            } else if (code === 1) {
                this.putMsg(txt);
                return;
            }
            return;
        }
        if (this.isV2Act) {
            if (["30003"].includes(this.activityType)) {
                if (!$.drawConsume) {
                    let getPoints = await this.api(`/api/${this.activityType}/getPoints`, {});
                    $.drawConsume = getPoints.data * 1;
                }
                let getMyPoints = await this.api(`/api/${this.activityType}/getMyPoints`, {});
                let number = Math.min(getMyPoints.data.drawCanDayTimes, Math.floor(getMyPoints.data.points / $.drawConsume)) || 1;
                for (let i = 0; i < number; i++) {
                    await this.lotteryDraw();
                }
            } else {
                let task = await this.api(`/api/${this.activityType}/getTask`, {});
                await this.taskToDo(task.data);
                let chanceNum = await this.api(`/api/${this.activityType}/chanceNum`, {});
                for (let i = 0; i < parseInt(chanceNum.data); i++) {
                    await this.lotteryDraw();
                }
            }
            return;
        }
        if (this.isHdbAct) {
            let fn = "";
            let drawTimes = 5;
            if ($.activityUrl.includes("pointDraw")) {
                fn = "postPointDraw";
            } else {
                fn = "postDraw";
                let xxxx = await this.api("/front/task/showTaskList", {});
                await this.taskToDo(xxxx?.result?.taskList);
                let newVar = await this.api("/front/activity/getDrawTimes", {});
                if (newVar?.succ) {
                    drawTimes = newVar?.result?.giveTimes || 1;
                }
            }
            await this.wait(1000, 2000);
            for (let m = 0; m < drawTimes; m++) {
                let data = await this.api(`/front/activity/${fn}`, { drawTimes: 1 });
                if (data.succ) {
                    let prize = data.result;
                    if (prize.succ) {
                        let award = prize.dmAward.awardType;
                        this.prizeName = await this.getAwardText(prize.dmAward);
                        this.putMsg(this.prizeName);
                        if ("JD_GOODS" === prize.dmAward.awardType) {
                            this.addressId = prize.dmActivityLog.id;
                            await this.saveAddress();
                        }
                    } else {
                        this.putMsg(data.message);
                    }
                    break;
                }
                await this.wait(2000, 4000);
            }
            return;
        }
        if (this.isJinggengAct) {
            if ($.activityUrl.includes("loadBlindBox")) {
                this.lotteryCount = context("#times").text();
                const blindTaskJson = context("#blindTask").attr("value");
                if (!blindTaskJson) {
                    this.putMsg(`未知异常，请联系开发者`);
                    $.exit = true;
                    return;
                }
                const blindTask = JSON.parse(blindTaskJson);
                const tasks = blindTask.filter((element) => {
                    const isFinish = element.isFinish;
                    const taskType = element.taskType;
                    if (["everyDay", "buy", "cartItem"].includes(taskType) || isFinish === "1") {
                        return false;
                    }
                    return true;
                });
                if (tasks.length > 0) {
                    for (let i = 0; i < tasks.length; i++) {
                        await this.wait(2000, 4000);
                        const element = tasks[i];
                        const taskType = element.taskType;
                        const data = await this.api(
                            `ql/front/postDrawTimes`,
                            `userId=${$.userId}&actId=${$.activityId}&taskType=${taskType}&drawCountNumFlag=true`
                        );
                        if (data.succ) {
                            const giveNum = data.giveNum;
                            this.lotteryCount += giveNum;
                        } else {
                            this.putMsg(data.msg);
                        }
                    }
                }
            }
            let fn = "postFrontTaskDraw";
            if ($.activityUrl.includes("showDrawOne")) {
                fn = "postFrontCheckDrawOne";
            } else if ($.activityUrl.includes("loadBlindBox")) {
                fn = "postBlindBox";
            }
            let retryCount = 1;
            if (this.lotteryCount > 0) {
                retryCount = this.lotteryCount;
            }
            while (retryCount-- > 0) {
                let data = await this.api(`ql/front/${fn}`, `user_id=${$.userId}&act_id=${$.activityId}`);
                if (data.succ) {
                    let prize = JSON.parse(data.msg);
                    if (prize.isSendSucc && prize.drawAwardDto) {
                        let award = prize.drawAwardDto;
                        this.prizeName = await this.getAwardText(prize.drawAwardDto);
                        this.putMsg(this.prizeName);
                        if (award.awardType === "JD_GOODS") {
                            this.addressId = prize.actLogId;
                            await this.saveAddress();
                        }
                    }
                }
            }
            return;
        }
        if (this.isV1Act) {
            let fn = this.activityType === "10031" ? "niudanji" : "jiugongge";
            if (this.activityType === "10041") {
                fn = "lotteryCenter";
            }
            let activity = await this.api(`/api/task/${fn}/activity`, {});
            await this.taskToDo(activity?.data?.taskList);
            if (["10026", "10080"].includes($.activityType)) {
                this.canDrawTimes = 2;
                let consumePoints = await this.api("/api/task/points/consumePoints", {});
                $.drawConsume = consumePoints.data.integral;
            } else {
                let drawPrize = await this.api("/api/prize/drawPrize", {});
                this.canDrawTimes = drawPrize.data?.drawNumber || 1;
            }
            for (let m = 1; this.canDrawTimes--; m++) {
                let prize = await this.api("/api/prize/draw", { consumePoints: $.drawConsume || 0 });
                if (prize.data == "1") {
                    this.putMsg("积分不足");
                    await this.runCached();
                    break;
                }
                if (prize.resp_code == "0") {
                    if (prize.data.dayTime == $.now("yyyy-MM-dd")) {
                        this.prizeName = prize.data.prizeName;
                        this.putMsg(this.prizeName);
                        if (prize.data.prizeType == 3) {
                            this.addressId = prize.data.addressId;
                            await this.saveAddress();
                        }
                        if (prize.data.prizeType == 7) {
                            this.putMsg(JSON.parse(prize.data?.prizeJson || {})?.cardNumber || "");
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
        if (this.isGzslAct) {
            this.canDrawTimes = context.leftTime || 1;
            for (let m = 1; this.canDrawTimes--; m++) {
                await this.wait(5000, 5000);
                let data = await this.api(`wuxian/user/draw/${$.activityId}`, { id: $.activityId, token: this.isvToken, source: "01" });
                if (data.status !== "1") {
                    if (["-2", "-8"].includes(data.status)) {
                        this.putMsg(data.msg);
                        break;
                    }
                    if (data.status === "-14") {
                        if (m === 1) {
                            this.log(data.msg);
                            await this.openCard();
                            if (!this.isMember) {
                                break;
                            }
                            continue;
                        }
                    }
                    if (m === 1 && data.status === "-3") {
                        this.log("去关注");
                        await this.api(`wuxian/user/flowShop/${$.shopId}/${$.venderId}`, {
                            shopId: $.shopId,
                            source: "01",
                            token: this.isvToken,
                            venderId: $.venderId,
                        });
                        continue;
                    }
                }
                if (data?.winId) {
                    if (data.data.source === "0") {
                        this.canDrawTimes++;
                    }
                    this.putMsg(/(自定义奖品|1份)/.test(data.data.detail) ? data.data.name : data.data.detail);
                } else {
                    this.putMsg("空气");
                }
            }
            return;
        }
        let fn = "wxDrawActivity";
        if ($.activityType === 26) {
            fn = "wxPointDrawActivity";
        }
        if ($.activityType === 124) {
            fn = "wxScratchActive";
        }
        if ($.activityType === 128) {
            fn = "wxGashaponActive";
        }
        if ($.activityType === 125) {
            fn = "wxPointBlindBox";
        }
        if ($.activityType === 129) {
            fn = "wxDollGrabbing";
        }
        let activityContent = await this.api(`${fn}/activityContent`, `activityId=${$.activityId}&pin=${this.Pin}`);
        if (!activityContent.result || !activityContent.data) {
            this.putMsg(activityContent?.errorMessage);
            return;
        }
        let needFollow = activityContent.data.needFollow;
        let hasFollow = activityContent.data.hasFollow;
        if (needFollow && !hasFollow) {
            await this.api(
                "wxActionCommon/newFollowShop",
                `venderId=${$.venderId}&buyerPin=${this.Pin}&activityType=${$.activityType}&activityId=${$.activityId}`
            );
        }
        $.rule = activityContent.data.rule;
        let eles = $.rule.split("\n");
        if (!luckLimitRule) {
            let eleIndex = 0;
            for (let ele of eles) {
                if (ele.includes("抽奖机会") || ele.includes("每人每天")) {
                    eleIndex = 1;
                }
                if (eleIndex > 0 && eleIndex < 3) {
                    luckLimitRule += `${ele}\n`;
                    eleIndex++;
                }
            }
            maxLimit = $.match(/累计抽奖(不超过)?(\d+)次/, $.rule)?.[1];
            everyLimit = $.match(/每天最多抽奖(\d+)次/, $.rule);
        }
        $.actName = activityContent.data.drawConsume ? "积分抽奖" : "幸运抽奖";
        $.drawConsume = activityContent.data.drawConsume || 0;
        $.actStartTime = activityContent.data?.startTime;
        $.actEndTime = activityContent.data?.endTime;
        await this.checkActivity(activityContent);
        if (![26, 124, 125, 128, 129].includes($.activityType)) {
            let myInfo = await this.api("wxDrawActivity/getGiveContent", `activityId=${$.activityId}&pin=${this.Pin}`);
            let follow = myInfo.data.follow;
            let share = myInfo.data.share;
            if (myInfo?.result) {
                try {
                    if (follow && myInfo.data.follow.hasFollowTimes < myInfo.data.follow.followTimes) {
                        this.log("做关注任务");
                        let count = myInfo.data.follow.followTimes - myInfo.data.follow.hasFollowTimes;
                        for (let i = 0; i < count; i++) {
                            let skuId = myInfo.data.follow.skuIdsList[i];
                            let follow = await this.api("wxDrawActivity/follow", `activityId=${$.activityId}&pin=${this.Pin}&skuId=${skuId}`);
                            if (!follow.result) {
                                break;
                            }
                        }
                    }
                    if (share && myInfo.data.share.hasShareTimes < myInfo.data.share.shareTimes) {
                        this.log("做分享任务");
                        let count = myInfo.data.share.shareTimes - myInfo.data.share.hasShareTimes;
                        for (let i = 0; i < count; i++) {
                            let share = await this.api("wxDrawActivity/shareSuccess", `activityId=${$.activityId}&pin=${this.Pin}`);
                            if (share?.result) {
                                break;
                            }
                        }
                    }
                    if (follow || share) {
                        activityContent = await this.api(`${fn}/activityContent`, `activityId=${$.activityId}&pin=${this.Pin}`);
                    }
                } catch (e) {
                    this.log(e);
                }
            } else {
                this.putMsg("获取任务列表失败");
            }
        }
        let canDrawTimes = activityContent.data.canDrawTimes || 0;
        $.canDrawTimes = canDrawTimes;
        if ($.exit) {
            return;
        }
        if ([26, 124, 125, 128, 129].includes($.activityType)) {
            let check = await this.api(
                "common/joinConfig/check",
                `venderId=${$.venderId}&pin=${this.Pin}&activityType=${$.activityType}&activityId=${$.activityId}`
            );
            if (check?.data?.follow === 0) {
                await this.api(
                    "wxActionCommon/newFollowShop",
                    `venderId=${$.venderId}&buyerPin=${this.Pin}&activityType=${$.activityType}&activityId=${$.activityId}`
                );
            }
        }
        if ($.exit) {
            return;
        }
        canDrawTimes = Math.min(canDrawTimes || 1, 5);
        for (let m = 0; canDrawTimes--; m++) {
            let prize = await this.api(`${fn}/start`, `activityId=${$.activityId}&pin=${this.Pin}`);
            if (prize.result) {
                canDrawTimes = prize.data.canDrawTimes;
                if (prize.data.drawOk) {
                    this.prizeName = prize.data.name;
                    this.putMsg(this.prizeName);
                    if (prize.data.drawInfoType === 7 && prize.data.needWriteAddress === "y" && prize.data.addressId) {
                        this.addressId = prize.data.addressId;
                        await this.saveAddress();
                    }
                } else {
                    this.putMsg("空气");
                }
            }
        }
    }
}
let kv = {
    3: "幸运九宫格",
    4: "转盘抽奖",
    11: "扭蛋抽奖",
    12: "九宫格抽奖",
    13: "转盘抽奖",
    26: "积分抽奖",
    124: "积分刮刮乐",
    125: "积分抽盲盒",
    128: "积分扭蛋机",
    129: "积分娃娃机",
    10020: "九宫格抽奖",
    10021: "转盘抽奖",
    10031: "扭蛋机抽奖",
    10046: "加购抽奖",
    10026: "积分抽奖",
    10063: "抽清空购物车",
    10080: "积分刮刮乐",
    Draw: "互动抽奖",
};
$.after = async function () {
    try {
        if ([26, 124, 125, 128, 129, 30003].includes($.activityType)) {
            $.msg.push(`    花费${$.drawConsume}积分/次`);
        }
        if (this.isHdbAct) {
            for (let ele of $.prizeList || []) {
                $.msg.push(`    ${await $.getAwardText(ele)}`);
            }
        }
        for (let ele of $.prizeList) {
            if ($.domain.includes("loreal") || $.domain.includes("lzbk") || $.domain.includes("lzkj") || $.domain.includes("cjhy")) {
                if ($.activityUrl.includes("activityType") || this.isV2Act) {
                    $.msg.push(`    ${ele.prizeName} ${ele.hasOwnProperty("leftNum") ? "剩" + ele.leftNum + "份" : ""}`);
                } else {
                    if (ele.name.includes("谢谢") || ele.name.includes("再来")) {
                        continue;
                    }
                    $.msg.push(`    ${ele.name}    ${ele.priceInfo}元  ${ele?.type === 8 ? "专享价" : ""}`);
                }
            } else {
                if (this.isJinggengAct) {
                    if (ele.equityName?.includes("谢谢") || ele.equityName?.includes("再来")) {
                        continue;
                    }
                    $.msg.push(`    ${ele.equityName} 共${ele.availableQuantity}/${ele.freezeQuantity}份`);
                }
                if (this.isGzslAct) {
                    $.msg.push(`    ${/(自定义奖品|1份)/.test(ele.detail) ? ele.name : ele.detail}`);
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
    $.msg.push(`export M_WX_LUCK_DRAW_URL="${$.activityUrl}"`);
};
$.start(Task);
