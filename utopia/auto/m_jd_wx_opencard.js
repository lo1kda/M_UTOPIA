let mode = __dirname.includes("Work");
const { Env, cheerio, redis } = require("../utopia");
const $ = new Env("M开卡邀请");
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_OPENCARD_M_URL);
$.maxCookie = 99999;
let type = "";
let init;
let labName = "";
let shareCodes = [];
$.version = "v1.1.0";
$.concNum = 1;
if (mode) {
    $.activityUrl =
        "https://lzdz1-isv.isvjcloud.com/m/unite/8252676/dzlh0001/?activityId=a20d800cb00c44f6b8b60e4f8f5827d9&venderId=12160232&shareUuid=a3c74c906e194ffc90bf2a89cbb7deae&adsource=null";
}
let jinggengcjqPathType = `jdBigAlliance`;
jinggengcjqPathType = `jdJoinCardtf`;
let codes = [];
let notRunPins = ["x"];
let shareUuid = "";
class Task extends Env {
    constructor() {
        super();
    }
    async job(key, task) {
        let msg = task?.details?.pop()?.config;
        let data = await this.api("/webc/unionOpen/job", {
            activeId: $.activityId,
            joinId: this.joinId,
            jobForm: task.jobForm,
            jobDetail: 1,
        });
    }
    async exec() {
        if (!this.isMaster() && (shareUuid || shareCodes.length)) {
            $.concNum = this.getEnv("M_CONC_LIMIT");
        }
        if (notRunPins.includes(this.ptpin)) {
            return;
        }
        if (!$.superVersion) {
            throw new Error("请更新脚本");
        }
        if (!$.activityUrl) {
            $.exit = true;
            this.putMsg(`activityId|activityUrl不存在`);
            return;
        }
        this.shareUuid = shareUuid || $.randomArray(shareCodes, 1)[0]?.shareUuid || "";
        await this.login();
        if ($.isSzxyunAct) {
            await $.getOpenCardSzxyunPath();
            if (this.isMaster()) {
                await this.api("/webc/log/save", {
                    vId: "1000100710",
                    activeId: $.activityId,
                    type: "oppo",
                    sType: "App",
                    origin: "qj",
                    refer: `rc.isvjcloud.com/pagec/${$.baseActivityId}/index.html`,
                });
            }
            let {
                code,
                message,
                data: active,
            } = await this.api("/webc/unionOpen/active", {
                activeId: $.activityId,
                shareId: this.shareUuid || null,
            });
            if (this.shareUuid && active.userVO.helpStatus === 1) {
                this.log("关系绑定" + active.userVO.shareNick);
            }
            this.activeTitle = active.activeVO.activeTitle;
            this.joinId = active.userVO.joinId;
            if (this.isMaster()) {
                this.log("当前助力码：" + this.joinId);
                shareCodes.push({
                    index: this.index,
                    cookie: this.cookie,
                    username: this.ptpin,
                    count: 0,
                    shareUuid: shareUuid || this.joinId,
                });
            }
            this.showBeanList = active.showBeanList || [];
            for (let key in active.jobMap) {
                let { done, jobForm } = active.jobMap[key];
                if (done) {
                    continue;
                }
                const job = await this.api(`webc/unionOpen/job`, {
                    activeId: $.activityId,
                    joinId: this.joinId,
                    jobForm: jobForm,
                    jobDetail: 1,
                });
                this.log(`${key}奖励 ${job.data?.awardName || "空气"}`);
            }
            let unopen = active?.bindCardInfo?.filter((x) => !x.isBindCard) || [];
            for (let shop of unopen) {
                await this.openCard(shop.val2);
                let activex = await this.api("webc/unionOpen/active", {
                    activeId: $.activityId,
                    shareId: this.shareUuid,
                });
                if (activex.data?.showBeanList?.length > 0) {
                    let showBean = activex.data.showBeanList[0].sendNum + (activex.data.showBeanList[0].type === 8 ? "京豆" : "积分");
                    this.log(`${shop.val2} 开卡：${showBean || "空气"}`);
                }
            }
            if (this.shareUuid) {
                await this.helpShare();
            }
            if (false) {
                let { data } = await this.api("/webc/unionOpen/active", {
                    activeId: $.activityId,
                    shareId: this.shareUuid || null,
                });
                let points = data.userVO.points;
                let points2 = data.userVO.points2;
                this.log(`积分${points}可抽奖${points2}次`);
                let x = Math.min(10, points2);
                while (x-- > 0) {
                    try {
                        let { data: lottery } = await this.api("/webc/unionOpen/lottery", {
                            lotteryForm: 1,
                            activeId: $.activityId,
                            joinId: this.joinId,
                        });
                        lottery && this.log(`抽奖：${lottery.awardName}`);
                    } catch (e) {
                        this.log(e);
                    }
                }
            }
            let tmp = this.shareUuid;
            for (let ele of shareCodes.filter((o) => o.shareUuid !== tmp)) {
                this.shareUuid = ele.shareUuid;
                if (this.shareUuid) {
                    await this.api("/webc/unionOpen/active", {
                        activeId: $.activityId,
                        shareId: this.shareUuid || null,
                    });
                    await this.helpShare();
                }
            }
            return;
        }
        if ($.isJinggengjcqAct) {
            $.userId = "10299171";
            let load = await this.api(`dm/front/${jinggengcjqPathType}/activity/load?open_id=&mix_nick=${this.isvToken}&user_id=10299171`, {
                jdToken: this.isvToken,
                source: "01",
                inviteNick: this.shareUuid || "",
            });
            this.buyerNick = load.data.data.missionCustomer.buyerNick;
            if (this.isMaster()) {
                this.log(`当前助力码：${shareUuid || this.buyerNick}`);
                shareCodes.push({
                    index: this.index,
                    cookie: this.cookie,
                    username: this.ptpin,
                    count: 0,
                    shareUuid: shareUuid || this.buyerNick,
                });
            }
            if (this.shareUuid) {
                let inviteRelation = await this.api(
                    `/dm/front/${jinggengcjqPathType}/customer/inviteRelation?open_id=&mix_nick=${this.buyerNick || ""}&user_id=10299171`,
                    { method: `/${jinggengcjqPathType}/customer/inviteRelation`, pushWay: 1, inviterNick: this.shareUuid || "" }
                );
                if (inviteRelation.errorMessage.includes("关系绑定成功")) {
                    shareCodes
                        .filter((o) => o.shareUuid === this.shareUuid)
                        .forEach((o) => {
                            o.count++;
                        });
                } else {
                    if (!this.isMaster()) {
                        await this.runCachedForever();
                    }
                    return;
                }
            } else if (!this.shareUuid && !this.isMaster()) {
                this.log("未找到车头退出");
                return;
            }
            try {
                if (!load.data.data.missionCustomer.hasCollectShop) {
                    await this.api(
                        `/dm/front/${jinggengcjqPathType}/mission/completeMission?open_id=&mix_nick=${this.buyerNick || ""}&user_id=10299171`,
                        { method: `/${jinggengcjqPathType}/mission/completeMission`, missionType: "uniteCollectShop" }
                    );
                }
            } catch (e) {
                this.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" + e.message);
            }
            let shopList = await this.api(
                `dm/front/${jinggengcjqPathType}/shop/shopList?open_id=&mix_nick=${this.buyerNick || ""}&user_id=10299171`,
                { method: `/${jinggengcjqPathType}/shop/shopList` }
            );
            let shops = shopList.data.data.filter((o) => !o.open);
            for (let i = 0; i < shops.length; i++) {
                this.isMember = false;
                let shop = shops[i];
                let venderId = shop.userId;
                await this.api(
                    `/dm/front/${jinggengcjqPathType}/mission/completeMission?open_id=&mix_nick=${this.buyerNick || ""}&user_id=10299171`,
                    { method: `/${jinggengcjqPathType}/mission/completeMission`, missionType: "openCard", shopId: venderId }
                );
                await this.openCard(venderId);
                if (!this.isMember) {
                    continue;
                }
                await this.api(`dm/front/${jinggengcjqPathType}/activity/load?open_id=&mix_nick=${this.isvToken}&user_id=10299171`, {
                    jdToken: this.isvToken,
                    source: "01",
                    inviteNick: this.shareUuid || "",
                    shopId: venderId,
                });
            }
            if (!this.isMaster()) {
                await this.runCachedForever();
            }
            return;
        } else if ($.activityUrl.includes("joinCommon")) {
            let doc = await this.api("dingzhi/joinCommon/activity/5929859", `activityId=${$.activityId}`);
            const $2 = cheerio.load(cheerio.load(doc).html());
            $.venderId = $2("#userId", "body").attr("value");
            await this.getMyPing();
        } else {
            await this.getMyPing("customer/getMyCidPing");
        }
        await this.getSimpleActInfoVo("dz/common/getSimpleActInfoVo");
        if ($.exit) {
            return;
        }
        $.attrTouXiang = "https://img10.360buyimg.com/imgzone/jfs/t1/21383/2/6633/3879/5c5138d8E0967ccf2/91da57c5e2166005.jpg";
        await this.api(
            `common/${$.domain.includes("cjhy") ? "accessLog" : "accessLogWithAD"}`,
            `venderId=${$.venderId}&code=99&pin=${this.Pin}&activityId=${$.activityId}&pageUrl=${encodeURIComponent(
                $.activityUrl
            )}&subType=app&adSource=`
        );
        let data;
        let encNick = encodeURIComponent(this.nickname);
        try {
            if (!init && shareCodes.length < $.masterNum) {
                init = await this.api("dingzhi/taskact/common/init", `activityId=${$.activityId}&dzActivityType=1&pin=`);
                $.actStartTime = init.data.startTime;
                $.actEndTime = init.data.endTime;
                if (init.data.startTime && init.data.startTime > $.timestamp()) {
                    this.putMsg(`活动还未开始`);
                    $.exit = true;
                    return;
                }
            }
        } catch (e) {
            console.log(e);
        }
        if ($.activityUrl.includes("/m/unite/") || $.activityUrl.includes("joinCommon")) {
            data = await this.api(
                "dingzhi/joinCommon/activityContent",
                `activityId=${$.activityId}&pin=${this.Pin}&pinImg=${$.attrTouXiang}&nick=${encNick}&shareUuid=${this.shareUuid || ""}`
            );
            if (data === "") {
                this.log("黑号了");
                await this.runCacheForeverHot(true);
                return;
            }
            this.actorUuid = data.data.actorUuid || data.data.actorInfo?.uuid;
        } else if ($.activityId.includes("shop")) {
            data = await this.api(
                "dingzhi/shop/league/activityContent",
                `activityId=${$.activityId}&pin=${this.Pin}&pinImg=${$.attrTouXiang}&nick=${encNick}&shareUuid=${this.shareUuid || ""}`
            );
        } else {
            if (this.isMaster() && !type) {
                type = await this.getOpenCardPath();
            }
            data = await this.api(
                `dingzhi/${type}/union/activityContent`,
                `activityId=${$.activityId}&pin=${this.Pin}&pinImg=${$.attrTouXiang}&nick=${encNick}&shareUuid=${this.shareUuid || ""}`
            );
        }
        if (data.errorMessage) {
            this.putMsg(data.errorMessage);
            await this.wxStop(data.errorMessage);
            return;
        }
        data = data.data;
        $.actStartTime = init?.data?.startTime || data.startTime;
        $.actEndTime = init?.data?.endTime || data.endTime;
        if (data.startTime && data.startTime > $.timestamp()) {
            this.putMsg(`活动还未开始`);
            $.exit = true;
            return;
        }
        if (data.hasEnd) {
            this.putMsg(`活动已结束`);
            $.exit = true;
            return;
        }
        this.actorUuid = data.actorUuid || data.actorInfo.uuid;
        if (this.isMaster()) {
            this.log(data.shareContent || data.activityName);
            labName = data.shareContent || data.activityName;
            if ($.activityId.includes("shop")) {
                try {
                    let { data: getShareRecord } = await this.api(
                        "/dingzhi/taskact/common/getShareRecord",
                        `activityId=${$.activityId}&pin=${this.Pin}&actorUuid=${this.actorUuid}&num=20&sortStaus=0`
                    );
                    this.currentCount = getShareRecord.filter((o) => o.date === this.formatDate(Date.now(), "yyyyMMdd")).length;
                } catch (e) {
                    this.log(e);
                }
            }
            shareCodes.push({
                index: this.index,
                cookie: this.cookie,
                token: this.isvToken,
                pin: this.Pin,
                username: this.ptpin,
                count: this.currentCount || 0,
                shareUuid: shareUuid || this.actorUuid,
            });
            this.log("助力码：" + this.actorUuid);
        }
        if ($.activityId.includes("shop")) {
            this.shareUuid =
                shareCodes
                    .sort(function (a, b) {
                        return a.count - b.count;
                    })
                    .filter((o) => o.count < 20)?.[0]?.shareUuid || "";
            if (!this.isMaster() && !this.shareUuid) {
                this.putMsg(`已无车头`);
                $.exit = true;
                return;
            }
        } else {
            this.shareUuid =
                shareCodes.sort(function (a, b) {
                    return a.count - b.count;
                })?.[0]?.shareUuid || "";
        }
        if ($.activityUrl.includes("/m/unite/") || $.activityUrl.includes("joinCommon")) {
            await this.api(
                "dingzhi/joinCommon/doTask",
                `activityId=${$.activityId}&pin=${this.Pin}&uuid=${this.actorUuid}&shareUuid=${this.shareUuid}&taskType=20&taskValue=`
            );
            let taskInfo = await this.api(
                "dingzhi/joinCommon/taskInfo",
                `activityId=${$.activityId}&pin=${this.Pin}&uuid=${this.actorUuid}&shareUuid=${this.shareUuid}`
            );
            let opens = (taskInfo.data["1"]?.["settingInfo"] || taskInfo.data["10"]?.["settingInfo"]).map((item) => item.value);
            let newVar = await this.assist(1);
            let openList = opens;
            if (newVar) {
                openList = this.different(opens, newVar);
            }
            for (let i = 0; i < openList.length; i++) {
                await this.openCard(openList[i]);
            }
            await this.assist(2);
        } else if ($.activityId.includes("shop")) {
            if (!data.followShop?.allStatus) {
                await this.api(
                    "dingzhi/shop/league/saveTask",
                    `activityId=${$.activityId}&pin=${this.Pin}&actorUuid=${this.actorUuid}&shareUuid=${this.shareUuid || ""}&taskType=1&taskValue=1`
                );
            }
            let openList = await this.initOpenCard1(1);
            for (let i = 0; i < openList.length; i++) {
                await this.openCard(openList[i].value);
            }
            await this.initOpenCard1(2);
        } else {
            await this.api(
                `dingzhi/${type}/union/saveTask`,
                `activityId=${$.activityId}&pin=${this.Pin}&actorUuid=${this.actorUuid}&shareUuid=${this.shareUuid || ""}&taskType=23&taskValue=23`
            );
            let openList = await this.initOpenCard2(1);
            for (let i = 0; i < openList.length; i++) {
                await this.openCard(openList[i].venderId);
            }
            await this.initOpenCard2(2);
        }
    }
    async assist(status) {
        let data = await this.api(
            "dingzhi/joinCommon/assist",
            `activityId=${$.activityId}&pin=${this.Pin}&uuid=${this.actorUuid}&shareUuid=${this.shareUuid}`
        );
        if (!data.data) {
            data = await this.api(
                "dingzhi/joinCommon/assist",
                `activityId=${$.activityId}&pin=${this.Pin}&uuid=${this.actorUuid}&shareUuid=${this.shareUuid}`
            );
        }
        if (!data.data) {
            data = await this.api(
                "dingzhi/joinCommon/assist",
                `activityId=${$.activityId}&pin=${this.Pin}&uuid=${this.actorUuid}&shareUuid=${this.shareUuid}`
            );
        }
        if (!data.data) {
            data = await this.api(
                "dingzhi/joinCommon/assist",
                `activityId=${$.activityId}&pin=${this.Pin}&uuid=${this.actorUuid}&shareUuid=${this.shareUuid}`
            );
        }
        if (!data.data) {
            data = await this.api(
                "dingzhi/joinCommon/assist",
                `activityId=${$.activityId}&pin=${this.Pin}&uuid=${this.actorUuid}&shareUuid=${this.shareUuid}`
            );
        }
        data = data.data;
        let assistState = data.assistState;
        let allOpenCard = data.openCardInfo.openAll;
        if (allOpenCard) {
            this.log("已完成全部开卡");
        }
        let sendStatus = data.openCardInfo.sendStatus;
        if (status === 2) {
            let leader = shareCodes.filter((o) => o.shareUuid === this.shareUuid)[0];
            this.log(`助力状态-->${assistState},${allOpenCard},${sendStatus}`);
            if (!this.isMaster()) {
                await this.runCachedForever();
            }
            switch (assistState) {
                case 0:
                    this.log("无法助力自己");
                    break;
                case 1:
                    leader.count++;
                    this.log(`助力[${leader.username}]成功，已邀请${leader.count}人`);
                    break;
                case 2:
                    this.log(`已经助力过了`);
                    break;
                case 3:
                    this.log(`没有助力次数了`);
                    break;
                case 10:
                    this.log(`您已为好友助力过了哦`);
                    break;
                case 11:
                    this.log(`您已成功为好友助力了，不能再为其他好友助力了`);
                    break;
                case 20:
                    this.log(`您需注册会员,才能为好友助力！`);
                    break;
                case 21:
                    this.log(`您需注册会员并关注店铺,才能为好友助力！`);
                    break;
                case 22:
                    this.log(`您需注关注店铺,才能为好友助力！`);
                    break;
                case 77:
                    this.log(`未全部开卡和关注，不能助力`);
                    break;
                case 78:
                    this.log(`已经是老会员，不能助力`);
                    break;
                default:
                    this.log("未知状态");
                    break;
            }
        }
        return data.openCardInfo.openVenderId;
    }
    async initOpenCard1(status) {
        let { data } = await this.api(
            "dingzhi/shop/league/checkOpenCard",
            `activityId=${$.activityId}&pin=${this.Pin}&actorUuid=${this.actorUuid}&shareUuid=${this.shareUuid || ""}`
        );
        let allOpenCard = data.allOpenCard;
        let assistStatus = data.assistStatus;
        let openCardBeans = data.sendBeanNum;
        if (openCardBeans > 0) {
            this.log(`开卡获得${openCardBeans}豆`);
        }
        if (allOpenCard) {
            this.log(status + "已完成全部开卡");
            if (status === 1 && !this.isMaster()) {
                await this.runCachedForever();
            }
            this.exit = true;
        }
        if (status === 2) {
            let leader = shareCodes.filter((o) => o.shareUuid === this.shareUuid)[0];
            this.log(`助力状态-->${assistStatus}`);
            if (!this.isMaster()) {
                await this.runCachedForever();
            }
            switch (assistStatus) {
                case 0:
                    break;
                case 1:
                    leader.count++;
                    this.log(`助力[${leader.username}]成功，已邀请${leader.count}人`);
                    this.log("恭喜您为好友助力成功！");
                    break;
                case 2:
                    this.log("您已经为该好友助力过了！");
                    break;
                case 3:
                    this.log("您已经为其他好友助力过了！");
                    break;
                case 11:
                    this.log("今日助力次数已达上限，无法继续为他助力！");
                    break;
                case 12:
                    this.log("您活动期间助力次数已达上限，无法继续助力！");
                    break;
                case 21:
                    this.log("您还不是会员，无法为好友助力！");
                    break;
                case 22:
                    this.log("需要关注店铺及成为全部品牌会员并且有新会员，才能助力成功哦~");
                    break;
                case 88:
                    this.log("需要关注店铺及成为全部品牌会员并且有新会员，才能助力成功哦~");
                    break;
                case 66:
                    break;
                case 99:
                    switch (data.shareType) {
                        case 2:
                            this.log("您需要完成全部开卡才能为好友助力");
                            break;
                        case 5:
                            this.log("您需要完成任意一组开卡，并关注店铺才能为好友助力");
                            break;
                        case 6:
                            this.log("您的好友邀请您为TA助力，您关注店铺和品牌全部开卡后，即为好友助力成功");
                            break;
                        default:
                            break;
                    }
                    break;
            }
        }
        return data.cardList.filter((o) => !o.status);
    }
    async helpShare() {
        let { data } = await this.api("/webc/unionOpen/share", {
            activeId: $.activityId,
            joinId: this.joinId,
            shareId: this.shareUuid || null,
        });
        let helpStatus = data?.helpStatus;
        switch (helpStatus) {
            case 1:
                this.log("助力成功");
                if (!this.isMaster()) {
                    await this.runCachedForever();
                }
                break;
            case 2:
                this.log("已助力过");
                break;
            case 3:
            case 12:
                this.log("没有助力次数了");
                if (!this.isMaster()) {
                    await this.runCachedForever();
                    this.exit = true;
                }
                break;
            case 4:
                this.log("对方助力已达到限制");
                break;
            case 5:
                this.log("对方助力已满");
                break;
            case 7:
                this.log("未全部开卡");
                break;
            case 36:
                this.log("未浏览商品");
                break;
            case 37:
                this.log("对方未浏览商品");
                break;
            default:
                this.log("未知");
                break;
        }
    }
    async initOpenCard2(status) {
        let { data } = await this.api(
            `dingzhi/${type}/union/initOpenCard`,
            `activityId=${$.activityId}&pin=${this.Pin}&actorUuid=${this.actorUuid}&shareUuid=${this.shareUuid || ""}`
        );
        let allOpenCard = data.allOpenCard;
        let isAssist = data.openCardAndSendJd;
        let assistStatus = data.assistStatus;
        let openCardBeans = data.openCardBeans;
        if (openCardBeans > 0) {
            this.log(`开卡获得${openCardBeans}豆`);
        }
        if (allOpenCard) {
            this.log("已完成全部开卡");
        }
        if (status === 2) {
            this.log(`助力状态-->${isAssist},${assistStatus}`);
            if (!this.isMaster()) {
                await this.runCachedForever();
            }
            let leader = shareCodes.filter((o) => o.shareUuid === this.shareUuid)[0];
            switch (assistStatus) {
                case 0:
                    this.log("无法助力自己");
                    break;
                case 1:
                    leader.count++;
                    this.log(`助力[${leader.username}]成功，已邀请${leader.count}人`);
                    break;
                case 2:
                    this.log(`已经助力过了`);
                    break;
                case 3:
                    this.log(`没有助力次数了`);
                    break;
                case 10:
                    this.log(`您已为好友助力过了哦`);
                    break;
                case 11:
                    this.log(`您已成功为好友助力了，不能再为其他好友助力了`);
                    break;
                case 20:
                    this.log(`您需注册会员,才能为好友助力！`);
                    break;
                case 21:
                    this.log(`您需注册会员并关注店铺,才能为好友助力！`);
                    break;
                case 22:
                    this.log(`您需注关注店铺,才能为好友助力！`);
                    break;
                case 77:
                    this.log(`未全部开卡和关注，不能助力`);
                    break;
                case 78:
                    this.log(`已经是老会员，不能助力`);
                    break;
                default:
                    this.log("未知状态");
                    break;
            }
        }
        return data.openInfo.filter((o) => !o.openStatus);
    }
}
$.after = async function () {
    $.msg.push(labName);
    $.msg.push(`export M_WX_OPENCARD_M_URL="${$.activityUrl}"`);
};
$.start(Task);
