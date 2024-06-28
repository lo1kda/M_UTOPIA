let mode = __dirname.includes("Work");
const { Env, addDays } = require("../utopia");
const $ = new Env("M签到有礼");
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_SHOP_SIGN_URL);
if (mode) {
    $.activityUrl = "https://jinggeng-isv.isvjcloud.com/ql/front/showSign?id=9e8080488bef79d6018befe26ed44e89&user_id=1000085082";
    $.activityUrl = "https://cjhy-isv.isvjcloud.com/sign/signActivity?activityId=7c42a26b9d7d4719be86aebeb4885305&venderId=1000076645";
    $.activityUrl = "https://txzj-isv.isvjcloud.com/sign_in/home?a=UDJLY1JqSVhmNzRGZ2MyZUhR";
    $.activityUrl = "https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v2/10003/1001/?activityId=1774612283314921473&shopId=703279";
    $.activityUrl = "https://jingyun-rc.isvjcloud.com/h5/pages/SignIn/SignIn?id=8f7e63d733f6875577dcfa708bcf4796&userId=12591473";
    $.activityUrl = "https://lzkj-isv.isvjcloud.com/sign/signActivity2?activityId=0cf4b1dfe2154d14a14b72c8b7c2e95b&venderId=1000001196";
    $.activityUrl = "https://cjhy-isv.isvjcloud.com/sign/signActivity?activityId=07ddc504a141475a8b0b3a34e5cc24a5&venderId=1000428722";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10002&activityId=1773625195793281026&templateId=20201228083300lxqdsl011&nodeId=101001003&prd=cjwx&day=25";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10040&activityId=1773274338878369794&templateId=20210518190900qrqd011&nodeId=101001&prd=cjwx";
    $.activityUrl =
        "https://lorealjdcampaign-rc.isvjcloud.com/interact/index?activityType=10023&activityId=1770900388381171714&templateId=20210518190900rlqd01&nodeId=101001&prd=crm";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10003&activityId=1775459909728444418&templateId=8c7bb445-deab-42cf-922a-b585065f298f&nodeId=101001001&prd=cjwx";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v2/10001/1001/?shopId=1000310642&activityId=1787146044937420802&shareId=1787372228120666113";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10023&activityId=1773666244126314498&templateId=2023110801rlqd&nodeId=101001&prd=cjwx&adsource=tg_storePage";
    $.activityUrl = "https://jingyun-rc.isvjcloud.com/h5/pages/SignIn/SignIn?id=c0bd4d5a4742f566590e86e424843853&userId=13854617";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v2/10023/1001/?shopId=1000002688&activityId=1784832768771424258&shareId=1785589438736211969";
    $.activityUrl = "https://jinggeng-rc.isvjcloud.com/ql/front/showSign?id=9e8080fa8f18067e018f18f85851282c&user_id=1000425607";
    $.activityUrl = "https://cjhy-isv.isvjcloud.com/sign/sevenDay/signActivity?activityId=2443d71636c24b68adf4d30fd41ccf4a&venderId=1000406785";
    $.activityUrl =
        "https://lorealjdcampaign-rc.isvjcloud.com/interact/index?activityType=10023&activityId=1789973002922020865&templateId=20210518190900rlqd01&nodeId=101001&prd=crm";
    $.activityUrl = "https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v2/landing/share/?shareId=1785303739801772033";
    $.enableRunCache = false;
    $.concNum = 1;
    $.maxCookie = 2;
}
let retryCount = 5;
let beanLimit = 20;
let countSignArr = [];
$.version = "v1.0.0";
class Task extends Env {
    async getPrizeList(context) {
        if (this.isJinggengAct) {
            try {
                let description = $.rule.replace(/;/g, "\n");
                for (const item of description.split("\n")) {
                    let everyDay = $.match(/每日签到赠送(\d+)([\u4e00-\u9fa5]{2})/, item);
                    if (everyDay && everyDay.length > 0) {
                        $.prizeList.push({
                            everyDay: true,
                            equityType: "BEAN",
                            availableQuantity: 1,
                            giftName: everyDay.join(""),
                            giftType: everyDay[1].includes("积分") ? 9 : everyDay[1].includes("京豆") ? 6 : everyDay[1].includes("优惠券") ? 1 : 7,
                            giftTotal: 99,
                        });
                    } else {
                        let days = $.match(/连续签到(\d+)天,赠送(\d+)([\u4e00-\u9fa5]{2})/g, item);
                        if (days && days.length > 0) {
                            $.prizeList.push({
                                equityType: "BEAN",
                                availableQuantity: 1,
                                dayNum: days[0] * 1,
                                giftName: days[1] + days[2],
                                giftType: days[2],
                                giftTotal: 99,
                            });
                        }
                    }
                }
            } catch (e) {
                this.log(e);
            }
        } else if (this.isHdbAct) {
            let loadFrontAward = await this.api("/front/activity/loadFrontAward", {});
            let prizes = loadFrontAward.result || [];
            for (let ele of prizes) {
                Object.assign(ele, {
                    giftName: ele.awardName,
                    giftType: ele.prizeType || ele.awardType,
                    awardType: ele.prizeType || ele.awardType,
                    giftTotal: ele.awardTotalQuantity,
                });
            }
            let awards = [];
            for (const days of $.rule.matchAll(/每日签到有机会领取(.+?);/g)) {
                awards.push({ everyDay: true, dayNum: "", giftName: days[1] });
            }
            for (const days of $.rule.matchAll(/连续签到(\d+)天有机会领取(.+?);/g)) {
                awards.push({ everyDay: false, dayNum: days[1] * 1, giftName: days[2] });
            }
            if (prizes.length === awards.length) {
                a: for (let t of prizes) {
                    if (/(券)/.test(t.giftName)) {
                        t.dayNum = 1;
                        continue;
                    }
                    if (awards.length === 1) {
                        t.dayNum = awards[0].dayNum;
                        t.everyDay = awards[0].everyDay;
                        break;
                    }
                    for (const item of awards) {
                        if (/(券)/.test(item.giftName)) {
                            this.arrDelItem(awards, item);
                            continue;
                        }
                        if (this.textSimilarity(t.giftName, item.giftName.replace("京东", "")) > 40) {
                            t.dayNum = item.dayNum;
                            t.everyDay = item.everyDay;
                            this.arrDelItem(awards, item);
                            continue a;
                        }
                    }
                }
                $.prizeList = prizes;
            }
        } else if (this.isV1Act) {
            if ($.prizeList.length === 0 && ["10023"].includes($.activityType)) {
                let gf = [];
                if (/(lorealjdcampaign)/.test($.activityUrl)) {
                    for (let ele of $.rule.split("\n")) {
                        let days = 1,
                            reward = "";
                        if (ele.includes("每日")) {
                            reward = this.match(/签到.*\[(.*?)]/g, ele);
                        } else if (/签到(\d+)天.*\[(.*?)]/.test(ele)) {
                            let x = this.match(/签到(\d+)天.*\[(.*?)]/g, ele);
                            if (x && x.length === 2) {
                                days = x[0];
                                reward = x[1];
                            }
                        }
                        if (reward) {
                            gf.push({
                                insufficient: false,
                                everyDay: ele.includes("每日"),
                                prizeType: ele.includes("积分") ? 4 : 1,
                                dayNum: days,
                                giftName: reward,
                                giftType: reward.includes("京豆") ? 1 : 4,
                                giftTotal: 99,
                                leftNum: 999,
                                giftNum: 999,
                            });
                        }
                    }
                } else {
                    let activityContent = await this.api(`/api/task/daySign/activity`, {});
                    let drawPrize = await this.api("/api/prize/drawPrize", {});
                    $.prizeList = drawPrize.data.prizeInfo || [];
                    for (let i = 0; i < activityContent.data?.signPiize?.length || 0; i++) {
                        let prize = activityContent.data?.signPiize[i];
                        let prize2 = $.prizeList[i];
                        let gift = "";
                        Object.assign(prize2, {
                            insufficient: prize2.leftNum === 0,
                            everyDay: prize.signType === 0,
                            dayNum: prize.signNumber || 1,
                            giftName: prize2.prizeName,
                            giftType: prize2.prizeType === 1 ? 6 : prize2.prizeType === 3 ? 7 : prize2.prizeType,
                            giftTotal: prize2.leftNum,
                            giftNum: prize2.leftNum,
                        });
                        gf.push(prize2);
                    }
                }
                $.prizeList = gf;
                return;
            }
            let fn = "";
            if (["10001", "10040", "10004"].includes($.activityType)) {
                fn = "/api/prize/drawPrize";
                if (["10001"].includes($.activityType)) {
                    let activity = await this.api(`/api/task/sign/activity`, {});
                    $.__signPlus = activity.data.signPlus;
                }
            }
            if (["10002", "10003"].includes($.activityType)) {
                fn = "/api/task/sign/prizeList";
            }
            let drawPrize = await this.api(fn, {});
            let prizeList = drawPrize.data.prizeInfo || [];
            for (let ele of prizeList) {
                Object.assign(ele, {
                    insufficient: ele.leftNum === 0,
                    dayNum: $.__signPlus || ele.days || ele.position,
                    giftName: ele.prizeName,
                    giftType: ele.prizeType === 3 ? 7 : ele.prizeType === 1 ? 6 : 9,
                    giftTotal: ele.leftNum,
                    giftNum: ele.beanNum,
                });
            }
            $.prizeList = prizeList;
        } else if (this.isV2Act) {
            let { data: prizes } = await this.api(`/api/${this.activityType}/getPrizeList`, {});
            for (let ele of prizes) {
                Object.assign(ele, {
                    dayNum: 1,
                    giftName: ele.prizeName,
                    giftType: 7,
                    giftTotal: 999,
                    giftNum: 999,
                });
            }
            $.prizeList = prizes;
        } else if (this.isCommonAct) {
            let gf = [];
            if ($.sevenDay) {
                for (let giftCondition of context.act?.giftBean?.giftConditions || []) {
                    if (giftCondition.gift) {
                        giftCondition.gift.dayNum = giftCondition.dayNum;
                        giftCondition.gift.giftTotal = giftCondition.insufficient ? 0 : giftCondition.gift.giftTotal;
                        gf.push(giftCondition.gift);
                    }
                }
            } else {
                if (context.act.wxSignActivityGiftBean.hasGiftEveryDay === "y") {
                    context.act.wxSignActivityGiftBean.gift.everyDay = true;
                    context.act.wxSignActivityGiftBean.gift.giftTotal = context.act.wxSignActivityGiftBean.gift.insufficient
                        ? 0
                        : context.act.wxSignActivityGiftBean.gift.giftTotal;
                    gf.push(context.act.wxSignActivityGiftBean.gift);
                }
                if (context.act.wxSignActivityGiftBean.giftConditions.length > 0) {
                    for (let giftCondition of context.act.wxSignActivityGiftBean.giftConditions) {
                        if (giftCondition.gift) {
                            giftCondition.gift.dayNum = giftCondition.dayNum;
                            giftCondition.gift.giftTotal = giftCondition.gift.insufficient ? 0 : giftCondition.gift.giftTotal;
                            gf.push(giftCondition.gift);
                        }
                    }
                }
            }
            $.prizeList = gf;
        }
    }
    async exec() {
        if (!$.superVersion) {
            throw new Error("请更新脚本");
        }
        $.sevenDay = $.activityUrl.includes("sevenDay") || ["10040"].includes($.activityType);
        if (!$.activityId || !$.activityUrl) {
            $.exit = true;
            this.putMsg(`activityId|activityUrl不存在`);
            return;
        }
        let context = await this.login({ fn: this.isJinggengAct ? "ql/front/showSign" : "" });
        if (this.isTxzjAct) {
            let { code, data } = await this.api("/sign_in/receive_prize", `pid=${$.activityId}`);
            if (code === "success") {
                await this.runCached();
                countSignArr.push(data.continuity);
                this.putMsg(`已签${data.continuity}天`);
            }
            return;
        }
        if (this.isV2Act) {
            if (["10003", "10002", "10001"].includes($.activityType)) {
                let calendar = await this.api(`/api/${$.activityType}/sign`, {});
                this.log(calendar);
                this.putMsg(calendar.message || "已签到");
                if (["10001"].includes($.activityType)) {
                    let chanceNum = await this.api(`/api/${$.activityType}/chanceNum`, {});
                    console.log("抽奖次数", chanceNum.data);
                    for (let m = 0; m < chanceNum.data; m++) {
                        let lotteryDraw = await this.api(`/api/${$.activityType}/lotteryDraw`, {});
                        this.prizeName = lotteryDraw.data.prizeName || "空气";
                        this.putMsg(this.prizeName);
                        if (lotteryDraw.data.prizeType === 3) {
                            this.log(lotteryDraw.data);
                            this.addressId = lotteryDraw.data.result.result;
                            this.prizeId = lotteryDraw.data.activityPrizeId;
                            await this.saveAddress();
                        }
                    }
                    return;
                }
                if (["10002", "10003"].includes($.activityType) && Date.now() >= signInfo.receiveStartTime) {
                    let prizeList = await this.api(`/api/${$.activityType}/getPrizeList`, {});
                    for (let ele of prizeList.filter((o) => countSign >= o.signDays).reverse()) {
                        let acquire = await this.api(`/api/${$.activityType}/acquire`, { prizeInfoId: ele.prizeId });
                        this.putMsg(acquire.data.prizeName);
                        if (acquire.data.prizeType === 3) {
                            this.log(acquire.data);
                            this.addressId = acquire.data.result.result;
                            this.prizeId = acquire.data.activityPrizeId;
                            await this.saveAddress();
                        }
                    }
                    return;
                }
                return;
            }
            let calendar = await this.api(`/api/${$.activityType}/calendar`, {});
            let calendarData = calendar.data;
            let countSign = calendarData.continuousSignDays;
            if (!calendarData.sign) {
                let sign = await this.api(`/api/${$.activityType}/sign`, {});
                if (sign.code === 200) {
                    await this.runCached();
                    this.putMsg(`${sign.data.prizeName}${sign.data.prizeType}`);
                    this.log(sign.data);
                    countSign++;
                } else {
                    this.putMsg(sign.message);
                }
            }
            countSignArr.push(countSign);
            this.putMsg(`已签${countSign}天`);
            return;
        } else if (this.isHdbAct) {
            let countSign = 0;
            if ($.activityUrl.includes("BudweiserSignIn")) {
                let data = await this.api("/front/cusActivity/cusSignLoad", {});
                let tmp = [];
                if (tmp.length === 0) {
                    for (let ele of result.awardList || []) {
                        tmp.push({
                            dayNum: ele.uniteSignDays,
                            giftName: ele.awardName,
                            giftType: "JD_MARKET",
                            awardType: "JD_MARKET",
                            giftTotal: ele.awardSurplusQuantity,
                        });
                    }
                    $.prizeList = tmp;
                }
                for (let ele of result.shopEntranceDataList) {
                    await this.openCard(ele.id);
                }
                try {
                    await this.api("/front/cusTask/cusCompleteActivityTask", { actionType: "uniteFavouriteShop" });
                } catch (e) {}
                await this.wait(2000, 3000);
                if (result?.signLog?.lastSignTime && this.formatDate(result.signLog.lastSignTime, "yyyy-MM-dd") === this.now("yyyy-MM-dd")) {
                    countSign = result?.signLog?.continueCount;
                    await this.runCached();
                } else {
                    let newVar = await this.api("/front/activity/cusSignPost", {});
                    if (newVar.succ && newVar.result.awardRes.succ) {
                        await this.runCached();
                        countSign = newVar.result?.signLog?.continueCount;
                        if (newVar.result.awardRes.needSend) {
                            this.prizeName = await this.getAwardText(newVar.result.awardRes.dmAward);
                            this.putMsg(this.prizeName);
                            if ("JD_GOODS" === newVar.result.awardRes.dmAward.awardType) {
                                this.addressId = newVar.result.awardRes.dmActivityLog.id;
                                await this.saveAddress();
                            }
                        } else {
                            this.putMsg(`空气`);
                        }
                    } else {
                        this.putMsg(newVar.message);
                    }
                }
                countSignArr.push(countSign);
                this.putMsg(`已签${countSign}天`);
                return;
            }
            let signLoad = await this.api("front/activity/signLoad", {});
            if (
                signLoad.result?.signLog?.lastSignTime &&
                this.formatDate(signLoad.result.signLog.lastSignTime, "yyyy-MM-dd") === this.now("yyyy-MM-dd")
            ) {
                countSign = signLoad.result?.signLog?.continueCount;
                await this.runCached();
            } else {
                let newVar = await this.api("front/activity/signPost", {});
                if (newVar.succ && newVar.result.awardRes.succ) {
                    await this.runCached();
                    countSign = newVar.result?.signLog?.continueCount;
                    if (newVar.result.awardRes.needSend) {
                        this.prizeName = this.getAwardText(newVar.result.awardRes.dmAward);
                        this.putMsg(this.prizeName);
                        this.log(newVar.result);
                        if ("JD_GOODS" === newVar.result.awardRes.dmAward.awardType) {
                            this.addressId = newVar.result.awardRes.dmActivityLog.id;
                            await this.saveAddress();
                        }
                    } else {
                        this.putMsg(`空气`);
                    }
                } else {
                    this.putMsg(newVar.message);
                }
            }
            countSignArr.push(countSign);
            this.putMsg(`已签${countSign}天`);
            return;
        }
        if (this.isJinggengAct) {
            let isSign = context("#isSign", "body").attr("value") === "1";
            let countSign = context("#continueCount", "body").attr("value") || 0;
            let totalCount = context("#totalCount", "body").attr("value");
            await this.api("/ql/front/reportActivity/recordActPvUvData", `userId=${$.userId}&actId=${$.activityId}`);
            let followShop = await this.api("front/followShop", `userId=${$.userId}`);
            let saveSignIn = await this.api("ql/front/saveSignIn", `user_id=${$.userId}&act_id=${$.activityId}`);
            if (saveSignIn.succ) {
                await this.runCached();
                if (saveSignIn.msg.includes("签到成功但不需要发奖")) {
                    this.putMsg(`空气`);
                } else {
                    let data = JSON.parse(saveSignIn.msg);
                    if (data.isSendSucc) {
                        this.putMsg(data.actLogDto.remark);
                    } else {
                        this.putMsg(`空气`);
                    }
                }
                this.putMsg(`已签${++countSign}天`);
            }
            countSignArr.push(countSign);
            return;
        }
        if (this.isV1Act) {
            let fn, countField, signFn;
            switch ($.activityType) {
                case "10001":
                case "10002":
                case "10003":
                case "10004":
                    fn = "sign";
                    countField = "signNum";
                    signFn = "add";
                    break;
                case "10023":
                    fn = "daySign";
                    countField = ["lorealjdcampaign-rc.isvjcloud.com"].includes(this.domain) ? "continuityNum" : "signContinuityNum";
                    countField = "continuityNum";
                    signFn = "getSignClick";
                    break;
                case "10040":
                    fn = "daySign";
                    countField = "continuityNum";
                    signFn = "getSignClick";
                    break;
                default:
                    throw new Error("未支持");
            }
            let signInfo = await this.api(`/api/task/${fn}/activity`, {});
            let countSign = signInfo.data[countField];
            if (signInfo.data.sign) {
                let { resp_code, data } = await this.api(`/api/task/${fn}/${signFn}`, {});
                if (resp_code === 0) {
                    if (["10002", "10003"].includes($.activityType) && Date.now() < signInfo.data.signEndTime) {
                    } else if (["10001", "10004"].includes($.activityType) && Date.now() < signInfo.data.activityEndTime) {
                    } else {
                        await this.runCached();
                    }
                    countSign++;
                    if (data && data.prizeType === 3 && data.addressId) {
                        this.addressId = data.addressId;
                        this.prizeName = data.prizeName;
                        await this.saveAddress();
                    }
                }
            } else {
                if (["10002", "10003"].includes($.activityType) && Date.now() < signInfo.data.signEndTime) {
                } else if (["10001", "10004"].includes($.activityType) && Date.now() < signInfo.data.activityEndTime) {
                } else {
                    await this.runCached();
                }
            }
            if (
                ["10002", "10003"].includes($.activityType) &&
                Date.now() >= signInfo.data.signEndTime &&
                Date.now() <= signInfo.data.activityEndTime
            ) {
                let prizeList = await this.api("/api/task/sign/prizeList", {});
                for (let ele of prizeList.data.prizeInfo.filter((o) => countSign >= o.days).reverse()) {
                    let acquire = await this.api("/api/prize/receive/acquire", { prizeInfoId: ele.id });
                    if (acquire.resp_code === 0) {
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
            }
            if (["10001", "10004"].includes($.activityType) && Date.now() < signInfo.data.activityEndTime) {
                let drawNumber = signInfo.data.drawNumber;
                console.log("抽奖次数", drawNumber);
                for (let m = 0; m < drawNumber; m++) {
                    let prize = await this.api("/api/prize/draw", { consumePoints: 0 });
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
            }
            countSignArr.push(countSign);
            this.putMsg(`已签${countSign}天`);
            return;
        }
        if (!$.__activityContent) {
            let activityContent = await this.api(
                `sign/${$.sevenDay ? "sevenDay/" : ""}wx/getActivity`,
                `actId=${$.activityId}&venderId=${$.venderId}`
            );
            $.__activityContent = activityContent;
            $.rule = activityContent.act.actRule;
            $.actStartTime = activityContent.act.startTime;
            $.actEndTime = activityContent.act.endTime;
            await this.checkActivity(activityContent);
        }
        let signInfo = await this.api(
            `sign/${$.sevenDay ? "sevenDay/" : ""}wx/getSignInfo`,
            `venderId=${$.venderId}&pin=${this.Pin}&actId=${$.activityId}`
        );
        let countSign = $.sevenDay ? signInfo?.contiSignDays || 0 : signInfo?.signRecord?.contiSignNum || 0;
        if (($.sevenDay && signInfo.isSign === "n") || (!$.sevenDay && signInfo.signRecord.lastSignDate !== this.now("yyyyMMdd") * 1)) {
            let signUp = await this.api(`/sign/${$.sevenDay ? "sevenDay/" : ""}wx/signUp`, `actId=${$.activityId}&pin=${this.Pin}`);
            if (signUp.isOk) {
                await this.runCached();
                this.__null = true;
                countSign++;
                if (!signUp.signResult?.send) {
                    this.putMsg("空气");
                    this.__null = true;
                } else {
                    this.putMsg(`${signUp.gift?.giftName || signUp.signResult?.gift?.giftName}`);
                    if (signUp.needWriteAddress === "y") {
                        this.addressId = signUp.addressId;
                        this.prizeName = signUp.gift?.giftName || signUp.signResult?.gift?.giftName;
                        await this.saveAddress();
                    }
                }
            } else {
                this.putMsg(signUp.msg);
            }
        }
        countSignArr.push(countSign);
        this.putMsg(`已签${countSign}天`);
        if (!this.__null) {
            let prize = await this.api(
                `sign/${$.sevenDay ? "sevenDay/" : ""}wx/getGiftRecords`,
                `venderId=${$.venderId}&pin=${this.Pin}&actId=${$.activityId}`
            );
            if (prize.isOk) {
                for (let record of prize?.records?.filter((o) => `${o.giftDate}` === this.now("yyyyMMdd"))) {
                    this.putMsg(record.giftName);
                    if (record.gift.giftType === "7") {
                        this.addressId = record.addressId;
                        this.prizeName = record.giftName;
                        await this.saveAddress();
                    }
                }
            } else {
                this.putMsg(prize.msg);
            }
        }
    }
}
let kv = {
    1: "券",
    6: "京豆",
    7: "实物",
    9: "积分",
    10: "券",
    17: "券",
};
$.after = async function () {
    try {
        let max = Math.max.apply(null, countSignArr);
        let min = Math.min.apply(null, countSignArr);
        let currentDate = this.now("yyyy-MM-dd");
        let signDate;
        if (countSignArr.length) {
            signDate = this.formatDate(
                addDays(typeof $.actStartTime === "string" ? $.parseDate($.actStartTime).getTime() : $.actStartTime, max - 1),
                "yyyy-MM-dd"
            );
            if (currentDate === signDate) {
                $.msg.push("首日签到 ");
            }
        }
        for (let ele of $.prizeList) {
            if (ele.insufficient) {
                $.msg.push(
                    `    ${ele.everyDay ? "每" : ele.dayNum}天 ${ele.giftName} ${!kv[ele?.giftType] ? ele?.giftType : ""} ${ele.giftTotal}份 已发完`
                );
                continue;
            }
            if (ele?.dayNum) {
                let taskDate = this.formatDate(addDays(new Date($.actStartTime), ele?.dayNum * 1 - 1), "yyyy-MM-dd");
                if (
                    currentDate === signDate &&
                    ele?.dayNum * 1 - max === 1 &&
                    (ele?.giftType * 1 === 6 ||
                        ele?.giftType * 1 === 7 ||
                        ele?.giftType * 1 === 13 ||
                        ["JD_E_CARD", "JD_GOODS", "JD_REDBAG", "JD_RED_BAG", "JD_MARKET"].includes(ele?.giftType))
                ) {
                    if (
                        ele?.giftType * 1 === 13 ||
                        ele?.giftType * 1 === 7 ||
                        ["JD_E_CARD", "JD_GOODS", "JD_REDBAG", "JD_RED_BAG", "JD_MARKET"].includes(ele?.giftType)
                    ) {
                        $.msg.push(`    ${ele?.dayNum}天 ${ele.giftName} ${!kv[ele?.giftType] ? ele?.giftType : ""} ${ele?.giftTotal}份 添加定时`);
                    } else if (ele?.giftNum * 1 >= beanLimit) {
                        $.msg.push(`    ${ele?.dayNum}天 ${ele.giftName} ${!kv[ele?.giftType] ? ele?.giftType : ""} ${ele?.giftTotal}份 添加定时`);
                    } else {
                        $.msg.push(`    ${ele?.dayNum}天 ${ele.giftName} ${!kv[ele?.giftType] ? ele?.giftType : ""} ${ele?.giftTotal}份 明日开抢`);
                    }
                } else if (max + 1 === ele?.dayNum * 1 && ele?.giftType * 1 === 6) {
                    $.msg.push(`    ${ele?.dayNum}天 ${ele.giftName} ${!kv[ele?.giftType] ? ele?.giftType : ""} ${ele?.giftTotal}份 明日开抢`);
                } else {
                    $.msg.push(
                        `    ${ele.everyDay ? "每" : ele.dayNum}天 ${ele.giftName} ${!kv[ele?.giftType] ? ele?.giftType : ""} ${ele?.giftTotal}份`
                    );
                }
            } else {
                $.msg.push(
                    `    ${ele.everyDay ? "每" : ele.dayNum}天 ${ele.giftName} ${!kv[ele?.giftType] ? ele?.giftType : ""} ${ele?.giftTotal || "-"}份`
                );
            }
        }
    } catch (e) {
        console.log(e);
    }
    $.msg.push(`export M_WX_SHOP_SIGN_URL="${$.activityUrl}"`);
};
$.start(Task);
