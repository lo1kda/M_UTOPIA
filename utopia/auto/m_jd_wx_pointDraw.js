let mode = __dirname.includes("Work");
const { Env, fs, cheerio } = require("../utopia");
const $ = new Env("M积分兑换");
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_POINT_DRAW_URL);
if (mode) {
    $.activityUrl =
        "https://cjhy-isv.isvjcloud.com/mc/wxPointShopView/pointExgShiWu?venderId=1000002984&giftId=f4db0acf4bec427ca1bd66308b4fd67f&giftType=3";
    $.activityUrl = "https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v2/30002/1001/?activityId=1749277032527667201&shopId=1000107627";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10079&activityId=1752946530495176706&templateId=202209051007jfdh&nodeId=101001&prd=cjwx";
    $.activityUrl = "https://jinggeng-isv.isvjcloud.com/ql/front/exchangeActDetail?id=9e8080948db9aac0018dbb4aa0d32f17&user_id=10197980";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10079&activityId=1760541959408373762&templateId=202209051007jfdh&nodeId=101001&prd=cjwx";
    $.activityUrl = "https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v2/30002/1001/?activityId=1742496838898024449&shopId=1000386186";
    $.activityUrl = "https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v2/30002/1001/?shopId=1000337499&activityId=1773173263156711426";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10079&activityId=1763115019875713025&templateId=202209051007jfdh&nodeId=101001&prd=cjwx";
    $.runMode = "master";
    $.cookieTypes = ["master"];
}
$.notPointDrawList = process.env?.M_WX_NOT_POINT_DRAW_LIST?.split(/[@,&|]/).join("|") || "";
$.notPointDrawBeanList = process.env?.M_WX_NOT_POINT_DRAW_BEAN_LIST?.split(/[@,&|]/).join("|") || "";
$.notPointDrawGiftNameList = process.env?.M_WX_NOT_POINT_DRAW_GIFT_NAMES?.split(/[@,&|]/).join("|") || "雨x伞";
$.limit = 0;
$.version = "v1.0.0";
class Task extends Env {
    constructor() {
        super();
    }
    async getPrizeList() {}
    async exec() {
        if (!$.superVersion) {
            throw new Error("请更新脚本");
        }
        if (!$.activityId || !$.activityUrl) {
            $.exit = true;
            this.putMsg(`activityId|activityUrl不存在`);
            return;
        }
        const content = await this.login({ fn: "ql/front/exchangeActDetail", body: `actId=${$.activityId}&userId=${$.userId}` });
        if (this.isHdbAct) {
            let fn = "";
            if ($.activityType === "pointLimitedTimeExchange") {
                fn = "PointLimitedTimeExchange";
            }
            if ($.activityType === "pointExchange") {
                fn = "PointExchange";
            }
            let activity = await this.api(`/front/activity/load${fn}FrontAct`, {});
            if ($.activityType === "pointLimitedTimeExchange") {
                let startTime = activity.result.pointExchangeSettings[0].exchangeStartTime;
                let date = new Date();
                let hour = parseInt(startTime.split(":")[0]);
                let minutes = parseInt(startTime.split(":")[1]);
                date.setHours(hour);
                date.setMinutes(minutes);
                date.setSeconds(0);
                let start = Math.floor(date.getTime() / 1000);
                let now = Math.floor(new Date().getTime() / 1000);
                if (start - now > 15 * 60) {
                    this.putMsg(`距活动时间超15分钟`);
                    $.exit = true;
                    return;
                }
                var sleeptime = 0;
                start = Math.floor(date.getTime() / 1000);
                now = Math.floor(new Date().getTime() / 1000);
                if (start - now < 60 && start - now > 0) {
                    this.log(`脚本时间 ${new Date().Format("yyyy-MM-dd hh:mm:ss")}`);
                    this.log(`等待 ${sleeptime} 秒`);
                    await this.wait(sleeptime * 1000);
                }
            }
            for (let ele of activity.result.pointExchangeSettings) {
                let prize = await this.api(`/front/activity/post${fn}FrontAct`, { awardId: ele.awardId });
                if (prize.succ && prize.result.succ) {
                    prize = prize.result;
                    this.prizeName = await this.getAwardText(prize.dmAward);
                    this.putMsg(this.prizeName);
                    if ("JD_GOODS" === prize.dmAward.awardType) {
                        this.addressId = prize.dmActivityLog.id;
                        await this.saveAddress();
                    }
                }
            }
            return;
        }
        if (this.isV2Act) {
            let result = await this.api(`/api/${this.activityType}/getActivityInfo`, {});
            let { detail, rightsName, rightsType, rightsNum, rules, exchangeCycleStartTime, exchangeCycleEndTime, exchangePointNum } = result?.data;
            $.prizeList = [{ prizeName: rightsName, prizeType: rightsType, leftNum: rightsNum }];
            if (/(券|权益已兑完)/.test(rightsName)) {
                this.putMsg("垃圾活动");
                return;
            }
            if (detail) {
                $.limit++;
                this.putMsg(detail);
                return;
            } else {
                if (rightsType === 3) {
                    let addr = await this.selectAddress();
                    let saveAddress = await this.api(`/api/${this.activityType}/saveAddress`, {
                        name: addr.receiver,
                        tel: addr.phone,
                        province: addr.province,
                        city: addr.city,
                        county: addr.county,
                        addressDetail: addr.address,
                        isDefault: false,
                    });
                    this.putMsg(saveAddress.data?.msg || saveAddress.data);
                    let result = await this.api(`/api/${this.activityType}/getAddressList`, {});
                    for (let item of result?.data || []) {
                        try {
                            if (item.tel.includes(addr.phone)) {
                                let receivePrize = await this.api(`/api/${this.activityType}/receivePrize`, {
                                    addressId: item.id,
                                    prizeNum: 1,
                                    mobile: "",
                                });
                                this.putMsg(receivePrize.data?.msg || receivePrize.data);
                                if (receivePrize?.data?.successNum > 0) {
                                    await fs.appendFileSync(
                                        "gifts.csv",
                                        `${$.now()},${rightsName},${this.ptpin},${addr.phone},${addr.address},${$.name},${
                                            this.super?.shopName || "未知"
                                        },${$.activityUrl}\n`
                                    );
                                }
                            }
                        } catch (e) {}
                        let delAddress = await this.api(`/api/${this.activityType}/delAddress`, { id: item.id });
                        this.putMsg(delAddress.data?.msg || delAddress.data);
                    }
                } else {
                    let receivePrize = await this.api(`/api/${this.activityType}/receivePrize`, {
                        prizeNum: 1,
                        mobile: "",
                    });
                    this.putMsg(receivePrize.data?.msg || receivePrize.data);
                }
            }
            return;
        }
        if (this.isV1Act) {
            let drawPrize = await this.api("/api/pointsExchange/activity");
            if (drawPrize.resp_code !== 0) {
                this.putMsg(`获取奖品失败`);
                return;
            }
            $.prizeList = drawPrize.pointsExchangePrizeVos || [];
            let ts = $.prizeList.filter((o) => o.stock !== 0);
            if (ts.length === 0) {
                this.putMsg("垃圾或领完");
                $.exit = true;
                return;
            }
            let myPoints = drawPrize.data.myPoints;
            this.putMsg(`${myPoints}积分`);
            let exchangeList = $.prizeList.filter((o) => myPoints >= o.num && !o.prizeName.includes("券"));
            if (myPoints < $.prizeList[0].num) {
                this.putMsg("积分不足");
                $.limit++;
                return;
            }
            for (let ele of exchangeList.reverse()) {
                if ($.notPointDrawGiftNameList && new RegExp(`(${$.notPointDrawGiftNameList})`).test(ele.prizeName)) {
                    $.exit = true;
                    this.putMsg("屏蔽兑换" + ele.prizeName);
                    continue;
                }
                let prize = await this.api("/api/pointsExchange/exchange", { prizeInfoId: ele.prizeInfoId, status: 1 });
                if (prize.data?.result) {
                    this.prizeName = prize.data.prizeName;
                    myPoints -= ele.num;
                    exchangeList = $.prizeList.filter((o) => myPoints >= o.num);
                    this.putMsg(this.prizeName);
                    if (prize.data.prizeType === 3) {
                        this.addressId = prize.data.addressId;
                        await this.saveAddress();
                    }
                    if (prize.data.prizeType === 7) {
                        this.putMsg(JSON.parse(prize?.data?.prizeJson || {})?.cardNumber || "");
                    }
                }
            }
            return;
        }
        if (this.isJinggengAct) {
            const content = await this.login({ fn: "ql/front/exchangeActDetail", body: `actId=${$.activityId}&userId=${$.userId}` });
            $.activityType = content("#actType", "body").attr("value");
            let count = $.rule.match(/(?<=每人可兑换)\d{1,2}/)[0] || "1";
            for (let i = 0; i < count; i++) {
                try {
                    let data = await this.api("ql/front/postQlExchange", `act_id=${$.activityId}&user_id=${$.userId}`);
                    if (data.succ) {
                        let prize = JSON.parse(data.msg);
                        if (prize.isSendSucc && prize.drawAwardDto) {
                            let awardText = await this.getAwardText(prize.drawAwardDto);
                            this.putMsg(awardText);
                            if ($.activityType === "JD_GOODS") {
                                this.prizeName = awardText;
                                this.addressId = prize.actLogId;
                                await this.saveAddress();
                            }
                        } else {
                            this.putMsg(data.msg);
                            break;
                        }
                    } else {
                        if (data.msg.includes("点的太快")) {
                            count++;
                            continue;
                        }
                        if (data.msg.includes("奖品已经兑完了")) {
                            this.putMsg(data.msg);
                            $.exit = true;
                            return;
                        } else {
                            this.putMsg(data.msg);
                            break;
                        }
                    }
                } catch (e) {
                    this.log(e);
                }
            }
            return;
        }
        let member = await this.api(`mc/wxPointShop/getBuyerPoints`, `venderId=${$.venderId}&buyerPin=${this.Pin}`);
        this.beansLevel = parseInt(member.data?.grade || "1");
        this.buyerPoints = parseInt(member.data?.buyerPoints || "0");
        this.putMsg(`等级${this.beansLevel},${this.buyerPoints}积分`);
        if (this.buyerPoints <= 0) {
            this.putMsg(`没有积分`);
            $.limit++;
            return;
        }
        if (this.beansLevel === 1 && $.needPoint && this.buyerPoints < $.needPoint) {
            this.putMsg(`需要${$.needPoint}积分`);
            $.limit++;
            return;
        }
        let activityContent;
        if ($.activityUrl.includes("pointExgECard")) {
            activityContent = await this.api("mc/equity/selectEquityForC", `giftId=${$.activityId}&venderId=${$.venderId}&buyerPin=${this.Pin}`);
        } else if ($.activityUrl.includes("pointExgHb")) {
            activityContent = await this.api("mc/hb/selectHbForC", `giftId=${$.activityId}&venderId=${$.venderId}&buyerPin=${this.Pin}`);
        } else if ($.activityUrl.includes("pointExgShiWu")) {
            if ($.notPointDrawList && new RegExp(`(${$.notPointDrawList})`).test($.shopName)) {
                $.exit = true;
                this.putMsg("屏蔽兑换");
                return;
            }
            activityContent = await this.api("mc/shiWu/selectShiWu", `giftId=${$.activityId}&venderId=${$.venderId}`);
        } else if ($.activityUrl.includes("pointExgBeans")) {
            if ($.notPointDrawBeanList && new RegExp(`(${$.notPointDrawBeanList})`).test($.shopName)) {
                $.exit = true;
                this.putMsg("屏蔽兑换");
                return;
            }
            activityContent = await this.api(
                "mc/beans/selectBeansForC",
                `giftId=${$.activityId}&venderId=${$.venderId}&buyerPin=${this.Pin}&beansLevel=${this.beansLevel}`
            );
        }
        if (!activityContent.result) {
            this.putMsg(activityContent?.errorMessage);
            return;
        }
        $.rule = activityContent.data?.mcGiftBaseInfo?.actrule || activityContent.data.actrule;
        await this.checkActivity(activityContent);
        $.timeLimit = JSON.parse(activityContent.data?.mcConfig?.timeLimitJson || "[]");
        $.giftName = "";
        if ($.activityUrl.includes("pointExgShiWu")) {
            $.upTime = activityContent.data.mcGiftBaseInfo.upTime;
            $.downTime = activityContent.data.mcGiftBaseInfo.downTime;
            $.giftName = activityContent.data.mcGiftBaseInfo.giftName;
            $.mcShiWu = activityContent.data.mcShiWu;
            $.num = activityContent.data.mcGiftBaseInfo.num === activityContent.data.mcGiftBaseInfo.usedNum;
            $.needPoint = activityContent.data.mcGiftBaseInfo["point" + this.beansLevel];
            if ($.needPoint === null) {
                $.limit++;
                this.putMsg(`等级不符`);
                return;
            }
        } else {
            $.upTime = activityContent.data.upTime;
            $.downTime = activityContent.data.downTime;
            $.num = activityContent.data.num === activityContent.data.usedNum;
            $.needPoint = activityContent.data["point" + this.beansLevel];
            $.giftName = activityContent.data.giftName;
            if ($.needPoint === null) {
                this.putMsg(`等级不符`);
                $.limit++;
                return;
            }
            if (activityContent.data.beansLevelCount > 0) {
                $.needPoint = activityContent.data["point" + this.beansLevel] * activityContent.data.beansLevelCount;
            }
        }
        if ($.needPoint > this.buyerPoints) {
            this.putMsg(`需要${$.needPoint}积分`);
            $.limit++;
            return;
        }
        if ($.exit) {
            return;
        }
        if ($.num) {
            $.exit = true;
            this.putMsg("今日无库存");
            return;
        }
        if ($.notPointDrawGiftNameList && new RegExp(`(${$.notPointDrawGiftNameList})`).test($.giftName)) {
            $.exit = true;
            this.putMsg("屏蔽兑换");
            return;
        }
        if ($.timestamp() >= $.downTime) {
            $.exit = true;
            this.putMsg("活动已结束");
            return;
        }
        if ($.timestamp() < $.upTime) {
            $.exit = true;
            this.putMsg("活动未开始");
            return;
        }
        if ($.activityUrl.includes("pointExgHb")) {
            let prize = await this.api("mc/wxPointShop/exgHB", `giftId=${$.activityId}&venderId=${$.venderId}&buyerPin=${this.Pin}`);
            this.putMsg(`${prize.errorMessage || "兑换成功"}`);
            return;
        }
        if ($.activityUrl.includes("pointExgECard")) {
            for (let i = 0; i < 10; i++) {
                let prize = await this.api(
                    "/mc/wxPointShop/exgECard",
                    `giftId=${$.activityId}&venderId=${$.venderId}&buyerPin=${this.Pin}&buyerNick=${encodeURIComponent($.nickname)}`
                );
                if (prize?.result) {
                    this.putMsg(`${prize.errorMessage || "兑换成功"}`);
                    break;
                }
            }
            return;
        }
        if ($.activityUrl.includes("pointExgShiWu")) {
            let selectAddressList = await this.api("mc/wxPointShop/selectAddressList", `venderId=${$.venderId}&buyerPin=${this.Pin}`);
            if (selectAddressList.ok && selectAddressList.count >= 1) {
                for (let ele of selectAddressList.data) {
                    let kk = await this.api("mc/wxPointShop/deleteAddress", `venderId=${$.venderId}&buyerPin=${this.Pin}&addressId=${ele.addressId}`);
                    console.log(kk);
                }
            }
            let addrInfo = await this.selectAddress();
            this.log("当前地址详情" + JSON.stringify(addrInfo));
            if ($.giftName.includes("储值卡")) {
                addrInfo.address = "京东账号:" + $.username;
            }
            let saveAddress = await this.api(
                "/mc/wxPointShop/saveAddress",
                `buyerPin=${this.Pin}&venderId=${$.venderId}&receiver=${encodeURIComponent(addrInfo.receiver)}&receiverPhone=${
                    addrInfo.phone
                }&province=${encodeURIComponent(addrInfo.province)}&city=${encodeURIComponent(addrInfo.city)}&county=${encodeURIComponent(
                    addrInfo.county
                )}&address=${encodeURIComponent(addrInfo.address)}`
            );
            if (saveAddress.result && saveAddress.data) {
                this.addressId = saveAddress.data.addressId;
                this.putMsg(`已填地址`);
            } else {
                this.putMsg(`${saveAddress.errorMessage || "未知原因"}`);
            }
            console.log(saveAddress);
            if (Array.isArray($.mcShiWu) && $.mcShiWu.length) {
                date = new Date();
                var hours = $.mcShiWu.takeBeginTime.substring(0, 2);
                var minutes = $.mcShiWu.takeBeginTime.substring(3, 5);
                date.setHours(hours);
                date.setMinutes(minutes);
                date.setSeconds(0);
                start = Math.floor(date.getTime() / 1000);
                now = Math.floor(new Date().getTime() / 1000);
                if (start - now > 15 * 60) {
                    this.putMsg(`距活动时间超15分钟`);
                    $.exit = true;
                    return;
                }
                var sleeptime = 0;
                if (start - now < 15 * 60 && start - now > 0) {
                    sleeptime = start - now - 55;
                    if (sleeptime > 0) {
                        this.log(`等待 ${sleeptime} 秒至倒数1分钟`);
                        await this.wait(sleeptime * 1000);
                        now = Math.floor(new Date().getTime() / 1000);
                    }
                }
                if (start - now < 60 && start - now > 0) {
                    sleeptime = start - now - 1.5;
                    this.log(`等待 ${sleeptime} 秒`);
                    await this.wait(sleeptime * 1000);
                }
            }
            let count = 0;
            while (count < 10) {
                count++;
                let prize = await this.api(
                    "/mc/wxPointShop/exgShiWu",
                    `buyerPin=${this.Pin}&buyerNick=${encodeURIComponent($.nickname)}&giftId=${$.activityId}&venderId=${$.venderId}&addressId=${
                        this.addressId
                    }`
                );
                if (prize.result) {
                    this.putMsg(`兑换成功`);
                    await fs.appendFileSync(
                        "gifts.csv",
                        `${$.now()},${$.giftName},${$.username},${addrInfo.phone},${addrInfo.address},${$.name},${$.shopName},${$.activityUrl}\n`
                    );
                    let selectAddressList = await this.api("mc/wxPointShop/selectAddressList", `venderId=${$.venderId}&buyerPin=${this.Pin}`);
                    if (selectAddressList.ok && selectAddressList.count >= 1) {
                        for (let ele of selectAddressList.data) {
                            let kk = await this.api(
                                "mc/wxPointShop/deleteAddress",
                                `venderId=${$.venderId}&buyerPin=${this.Pin}&addressId=${ele.addressId}`
                            );
                            console.log(kk);
                        }
                    }
                    break;
                }
                if (prize.errorMessage.includes("火爆")) {
                    continue;
                }
                if (prize.errorMessage.includes("未到每天兑换时间")) {
                    this.putMsg(`未到每天兑换时间`);
                    let selectAddressList = await this.api("mc/wxPointShop/selectAddressList", `venderId=${$.venderId}&buyerPin=${this.Pin}`);
                    if (selectAddressList.ok && selectAddressList.count >= 1) {
                        for (let ele of selectAddressList.data) {
                            let kk = await this.api(
                                "mc/wxPointShop/deleteAddress",
                                `venderId=${$.venderId}&buyerPin=${this.Pin}&addressId=${ele.addressId}`
                            );
                            console.log(kk);
                        }
                    }
                    $.exit = true;
                    break;
                }
                if (prize.errorMessage.includes("请明日再来") || prize.errorMessage.includes("请明天再来")) {
                    this.putMsg(`请明日再来`);
                    let selectAddressList = await this.api("mc/wxPointShop/selectAddressList", `venderId=${$.venderId}&buyerPin=${this.Pin}`);
                    if (selectAddressList.ok && selectAddressList.count >= 1) {
                        for (let ele of selectAddressList.data) {
                            let kk = await this.api(
                                "mc/wxPointShop/deleteAddress",
                                `venderId=${$.venderId}&buyerPin=${this.Pin}&addressId=${ele.addressId}`
                            );
                            console.log(kk);
                        }
                    }
                    $.exit = true;
                    break;
                }
                if (prize.errorMessage.includes("积分不足") || prize.errorMessage.includes("等级不符")) {
                    let selectAddressList = await this.api("mc/wxPointShop/selectAddressList", `venderId=${$.venderId}&buyerPin=${this.Pin}`);
                    if (selectAddressList.ok && selectAddressList.count >= 1) {
                        for (let ele of selectAddressList.data) {
                            let kk = await this.api(
                                "mc/wxPointShop/deleteAddress",
                                `venderId=${$.venderId}&buyerPin=${this.Pin}&addressId=${ele.addressId}`
                            );
                            console.log(kk);
                        }
                    }
                    this.putMsg(`${prize.errorMessage}`);
                    break;
                }
            }
            let selectAddressList2 = await this.api("mc/wxPointShop/selectAddressList", `venderId=${$.venderId}&buyerPin=${this.Pin}`);
            if (selectAddressList2.ok && selectAddressList2.count >= 1) {
                for (let ele of selectAddressList2.data) {
                    let kk = await this.api("mc/wxPointShop/deleteAddress", `venderId=${$.venderId}&buyerPin=${this.Pin}&addressId=${ele.addressId}`);
                    console.log(kk);
                }
            }
            return;
        }
        $.exgBeanNum = parseInt(this.buyerPoints / activityContent.data[`point${this.beansLevel}`]);
        $.mcConfig = activityContent.data.mcConfig;
        if (activityContent.data.canExgByPeopDay && $.exgBeanNum > activityContent.data.canExgByPeopDay) {
            $.exgBeanNum = activityContent.data.canExgByPeopDay;
        } else {
            if (!this.beansLevelCount) {
                this.beansLevelCount = activityContent.data.beansLevelCount;
                if ($.exgBeanNum < this.beansLevelCount) {
                    this.putMsg("积分不足0");
                    this.index === 2 ? ($.exit = true) : "";
                    return;
                }
                $.exgBeanNum = activityContent.data.beansLevelCount === 0 ? $.exgBeanNum : activityContent.data.beansLevelCount;
            }
        }
        if ($.exgBeanNum <= 0) {
            this.putMsg("积分不足1");
            this.index === 2 ? ($.exit = true) : "";
            return;
        }
        if ($.mcConfig.timeLimitJson != null) {
            startTime = JSON.parse($.mcConfig.timeLimitJson);
            date = new Date();
            var hours = startTime[0].timeLimitStartTime.substring(0, 2);
            var minutes = startTime[0].timeLimitStartTime.substring(3, 5);
            date.setHours(hours);
            date.setMinutes(minutes);
            date.setSeconds(0);
            start = Math.floor(date.getTime() / 1000);
            now = Math.floor(new Date().getTime() / 1000);
            if (start - now > 15 * 60) {
                this.putMsg(`距活动时间超15分钟`);
                $.exit = true;
                return;
            }
            var sleeptime = 0;
            if (start - now < 15 * 60 && start - now > 0) {
                sleeptime = start - now - 55;
                if (sleeptime > 0) {
                    this.log(`等待 ${sleeptime} 秒至倒数1分钟`);
                    await this.wait(sleeptime * 1000);
                    now = Math.floor(new Date().getTime() / 1000);
                }
            }
            if (start - now < 60 && start - now > 0) {
                sleeptime = start - now - 0.5;
                this.log(`等待 ${sleeptime} 秒`);
                await this.wait(sleeptime * 1000);
            }
        }
        let count = 0;
        while (count < 10) {
            count++;
            let prize = await this.api(
                "mc/wxPointShop/exgBeans",
                `buyerPin=${this.Pin}&buyerNick=&giftId=${$.activityId}&venderId=${$.venderId}&beansLevel=${this.beansLevel}&exgBeanNum=${$.exgBeanNum}`
            );
            if (prize.result) {
                this.putMsg(`${$.exgBeanNum}京豆`);
                break;
            }
            if (prize.errorMessage.includes("火爆")) {
                continue;
            }
            if (
                prize.errorMessage.includes("积分不足") ||
                prize.errorMessage.includes("每人每日兑换最大上限") ||
                prize.errorMessage.includes("等级不符")
            ) {
                this.putMsg(`${prize.errorMessage}`);
                break;
            }
        }
    }
}
$.after = async function () {
    try {
        if ($.masterNum > 0 && $.limit >= $.masterNum) {
            $.msg.push("    全部完成");
        }
        if (this.isJinggengAct) {
            $.msg.push(`\n${$.rule || "\n未知"}`);
        } else if ($.activityUrl.includes("pointExgShiWu")) {
            $.mcShiWu?.takeBeginTime ? $.msg.push(`    兑换时间:${$.mcShiWu?.takeBeginTime || ""}，每天:${$.mcShiWu?.dayNum || ""}件`) : "";
        }
        for (let ele of $.timeLimit || []) {
            if (ele.timeLimitStartDay === $.formatDateTime(new Date(), "yyyy-MM-dd")) {
                $.msg.push(`    兑换时间:${ele.timeLimitStartTime || ""}`);
            }
        }
        for (let ele of $.timeLimit || []) {
            $.msg.push(`    ${ele.timeLimitStartDay}至${ele.timeLimitEndDay}`);
            $.msg.push(`    ${ele.timeLimitStartTime}至${ele.timeLimitEndTime}  ${ele.timeLimitNum}份`);
        }
        if ($.giftName) {
            $.msg.push(`    ${$.giftName || ""} 库存:${$.num}`);
        } else {
            for (let ele of $.prizeList) {
                $.msg.push(`    ${ele.prizeName} 库存:${ele.stock} 需要:${ele.num}`);
            }
        }
    } catch (e) {
        console.log(e);
    }
    $.msg.push(`export M_WX_POINT_DRAW_URL="${$.activityUrl}"`);
};
$.start(Task);
