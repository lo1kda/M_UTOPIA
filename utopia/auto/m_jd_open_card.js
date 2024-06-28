let mode = __dirname.includes("Work");
const { Env } = require("../utopia");
const $ = new Env("M入会有礼");
$.openCardArgv = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_OPEN_CARD_ARGV);
if (mode) {
    $.openCardArgv = "https://shopmember.m.jd.com/shopcard/?shopId=123";
    $.openCardArgv = "https://shopmember.m.jd.com/shopcard/?venderId=123";
    $.openCardArgv = "https://shopmember.m.jd.com/shopcard/?shopId=123&venderId=123";
    $.openCardArgv = "1000101952_1000101952_4544341";
    $.concNum = 1;
    $.maxCookie = 10;
    $.cookieTypes = ["hot"];
}
$.version = "v1.0.0";
let beanCount = $.getEnv("M_OPEN_CARD_BEAN_LIMIT", 1);
console.log($.openCardArgv);
$.enableRunCache = false;
class Task extends Env {
    constructor() {
        super();
    }
    async exec() {
        if (!$.superVersion) {
            throw new Error("请更新脚本");
        }
        if (/\d+_\d+_\d+/.test($.openCardArgv)) {
            let argv = $.openCardArgv.split("_");
            $.shopId = argv?.[0];
            $.venderId = argv?.[1];
            $.activityId = argv?.[2];
            await this.openCard($.venderId, 406, $.activityId);
            return;
        }
        if (!$.shopId || !$.venderId) {
            if ($.openCardArgv.startsWith("http")) {
                $.shopId = this.getQueryString($.openCardArgv, "shopId") || "";
                $.venderId = this.getQueryString($.openCardArgv, "venderId") || "";
            } else {
                let argv = $.openCardArgv.split("_");
                $.shopId = argv?.[0];
                $.venderId = argv?.[1];
            }
            await this.getShopInfo();
            $.activityUrl = `shopmember.m.jd.com/shopcard/?shopId=${$.shopId}&venderId=${$.venderId}`;
        }
        await this.isOpenCard();
        if (this.isMember) {
            this.putMsg("已开过卡");
            let { newGiftList } = await this.getFansFuseMemberDetail();
            if (!newGiftList || newGiftList.length === 0) {
                return;
            }
            for (let newGift of newGiftList) {
                $.activityId = newGift.activityId;
                $.activityType = newGift.activityType;
                if ($.activityId && $.activityType && newGift.status * 1 !== 2) {
                    let newVar = await this.collectGift();
                    if (newVar.busiCode === "200") {
                        for (let e of newGiftList) {
                            this.putMsg(`${e.discount}${e.prizeTypeName}`);
                        }
                    } else {
                        this.putMsg(`${newVar.message}`);
                    }
                }
            }
            return;
        }
        let rule = $.prizeList.filter((o) => [4, 14].includes(o.prizeType) || /(京豆|卡|红包)/.test(o?.prizeName))?.[0] || "";
        if (!rule) {
            this.putMsg("无奖励退出");
            return;
        }
        let bean = ($.prizeList.filter((o) => [4].includes(o.prizeType) || /(京豆)/.test(o.prizeName))?.[0]?.discountString || 0) * 1;
        if (bean < beanCount) {
            $.putMsg(`少于${beanCount}豆，不开卡`);
            $.exit = true;
            return;
        }
        this.openActId = rule.interestsInfo?.activityId || "";
        if (this.openActId) {
            await this.openCard($.venderId, 208, this.openActId);
        }
        if (this.index >= $.masterNum) {
            $.concNum = 20;
        }
    }
}
$.after = async function () {
    for (let ele of $.prizeList || []) {
        $.msg.push(`    ${ele?.discountString}${ele?.prizeName} ${ele?.prizeType} `);
    }
    $.msg.push(`export M_OPEN_CARD_ARGV="${$.openCardArgv}"`);
};
$.start(Task);
