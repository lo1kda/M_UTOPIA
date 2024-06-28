let mode = __dirname.includes("Work");
const { Env, cheerio } = require("../utopia");
const $ = new Env("M开卡浏览");
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_OPENCARD_M_URL);
if (mode) {
    $.activityUrl = "https://lzdz1-isv.isvjcloud.com/m/1000006644/dz288f6a084de7ba829963a36bc4ff";
    $.activityUrl = "https://lzdz1-isv.isvjd.com/m/1000003571/dz70bf6a3a481a93b6f993b474shop";
    $.activityUrl = "https://lzdz1-isv.isvjd.com/dingzhi/joinCommon/activity/5929859?activityId=683b57c668cf4df09854a6caad3660df";
    $.activityUrl =
        "https://lzdz1-isv.isvjcloud.com/m/unite/dzlh0001?activityId=3334ac58ef344431a624932ab0b185b9&venderId=1000000725&adSource=LifeSpaceHW4";
    $.activityUrl = "https://lzdz1-isv.isvjcloud.com/m/1000376290/dzdc0e8a1e42fc877dfb4de8961650";
    $.activityUrl = "https://lzdz1-isv.isvjcloud.com/m/1000001285/dz9f923270d7fd4d199e672f531813/";
    $.activityUrl = "https://lzdz1-isv.isvjcloud.com/m/1000003005/8735837/dz98d6d00d9093435380b02a0fc668/?adsource=null";
    $.activityUrl = "https://jinggengjcq-isv.isvjcloud.com/jdbeverage/pages/oC20230627def/oC20230627def?actId=226ea09788b44abc919942e21_230627";
    $.activityUrl = "https://lzdz1-isv.isvjcloud.com/m/unite/dzlh0001?activityId=6ec36e7d11c9477a9439e8bd23f60bde&venderId=1000104146&adSource=JKQS";
    $.activityUrl = "https://lzdz1-isv.isvjcloud.com/m/1000431041/dz3104b0f44090a7b850ed2ab36d4d";
    $.activityUrl = "https://jinggengjcq-isv.isvjcloud.com/jdbeverage/pages/oC20230816def/oC20230816def?actId=edb27bbb5b7544a5_230816";
    $.activityUrl = "https://jinggengjcq-isv.isvjcloud.com/jdbeverage/pages/oC20240203aslw/oC20240203aslw?actId=2189f9c615d4431f8e7ce7_240203";
    $.activityUrl = "https://lzdz1-isv.isvjcloud.com/m/1000282702/dz282c2bfa404bbc4632ff00deshop";
    $.activityUrl = "https://jinggengjcq-isv.isvjcloud.com/jdbeverage/pages/oC20240515cxc/oC20240515cxc?actId=5f4d63b233744b1_240515";
    $.cookieTypes = ["master"];
    $.enableRunCache = false;
}
$.maxCookie = 999999;
let type = "";
let init;
let labName = "";
let shareCodes = [];
$.version = "v1.1.0";
let drawCount = 0;
let jinggengcjqPathType = `jdBigAlliance`;
jinggengcjqPathType = `jdJoinCardtf`;
let hasBean = false;
class Task extends Env {
    constructor() {
        super();
    }
    async exec() {
        if (!this.isMaster() && hasBean) {
            $.concNum = this.getEnv("M_CONC_LIMIT");
        }
        if (!$.superVersion) {
            throw new Error("请更新脚本");
        }
        if (!$.activityId || !$.activityUrl) {
            $.exit = true;
            this.putMsg(`activityId|activityUrl不存在`);
            return;
        }
        await this.login();
        this.shareUuid = $.randomArray(shareCodes, 1)[0]?.shareUuid || "";
        if (this.isJinggengjcqAct) {
            let load = await this.api(`dm/front/${jinggengcjqPathType}/activity/load?open_id=&mix_nick=${this.isvToken}&user_id=10299171`, {
                jdToken: this.isvToken,
                source: "01",
                inviteNick: this.shareUuid || "",
            });
            this.buyerNick = load.data.data.missionCustomer.buyerNick;
            if (!$.shopList) {
                $.shopList = await this.api(
                    `dm/front/${jinggengcjqPathType}/shop/shopList?open_id=&mix_nick=${this.buyerNick || ""}&user_id=10299171`,
                    { method: `/${jinggengcjqPathType}/shop/shopList` }
                );
            }
            for (let shop of $.shopList?.data?.data) {
                let viewShop = await this.api(
                    `/dm/front/${jinggengcjqPathType}/mission/completeMission?open_id=&mix_nick=${this.buyerNick || ""}&user_id=10299171`,
                    {
                        method: `/${jinggengcjqPathType}/mission/completeMission`,
                        missionType: "viewShop",
                        goodsNumId: shop.userId,
                    }
                );
                if (/(京豆)/.test(viewShop.data.data.remark)) {
                    hasBean = true;
                }
                this.log(viewShop.data.data.remark);
                await this.wait(1000);
            }
            await this.runCached();
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
            debugger;
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
        $.rule = data.rule;
        this.actorUuid = data.actorUuid || data.actorInfo.uuid;
        if (this.isMaster()) {
            this.log(data.shareContent || data.activityName);
            labName = data.shareContent || data.activityName;
            shareCodes.push({
                index: this.index,
                cookie: this.cookie,
                token: this.isvToken,
                pin: this.Pin,
                username: this.ptpin,
                count: 0, //todo pepole num https://lzdz1-isv.isvjcloud.com/dingzhi/taskact/common/getShareRecord
                shareUuid: this.actorUuid,
            });
        }
        if ($.activityId.includes("shop")) {
            this.shareUuid =
                this.randomArray(
                    shareCodes.filter((o) => o.count < 20),
                    1
                )[0]?.shareUuid || "";
        } else {
            this.shareUuid = this.randomArray(shareCodes, 1)[0]?.shareUuid || "";
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
            let opens = taskInfo.data["1"]["settingInfo"].map((item) => item.value);
            let newVar = await this.assist(1);
            let openList = this.different(opens, newVar);
            for (let i = 0; i < openList.length; i++) {
                await this.openCard(openList[i]);
            }
            await this.assist(2);
        } else if ($.activityId.includes("shop")) {
            if (data.mainActive?.allStatus) {
                await this.runCached();
                return;
            }
            for (let ele of data.mainActive?.settings || []) {
                const startVisitTask = await this.api(
                    "dingzhi/common/visitTask/startVisitTask",
                    `activityId=${$.activityId}&pin=${this.Pin}&actorUuid=${this.actorUuid}&taskType=${ele.type}&taskValue=${ele.value}`
                );
                const taskUuid = startVisitTask.data.taskUuid;
                await this.wait(5000, 5100);
                const saveTask = await this.api(
                    "dingzhi/shop/league/saveTask",
                    `activityId=${$.activityId}&pin=${this.Pin}&actorUuid=${this.actorUuid}&taskUuid=${taskUuid}&shareUuid=${
                        this.shareUuid || ""
                    }&taskType=${ele.type}&taskValue=${ele.value}`
                );
                saveTask.errorMessage && this.log(saveTask.errorMessage);
                if (saveTask.data.addBeanNum) {
                    await this.runCached();
                    this.log(`🎉浏览完成 ${saveTask.data.addBeanNum}豆 ${saveTask.data.sendStatus}`);
                }
            }
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
            console.log(`助力状态-->${assistState},${allOpenCard},${sendStatus}`);
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
        this.log(`助力状态-->${assistStatus}`);
        if (allOpenCard) {
            this.log("已完成全部开卡");
        }
        if (status === 2) {
            let leader = shareCodes.filter((o) => o.shareUuid === this.shareUuid)[0];
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
        this.log(`助力状态-->${isAssist},${assistStatus}`);
        if (allOpenCard) {
            this.log("已完成全部开卡");
        }
        if (status === 2) {
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
    $.msg.push(`export M_WX_OPENCARD_M_URL="${$.activityUrl}"`);
};
$.start(Task);
