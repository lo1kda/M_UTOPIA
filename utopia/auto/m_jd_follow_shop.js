let mode = __dirname.includes("Work");
const { Env } = require("../utopia");
const $ = new Env("M关注有礼");
$.followShopArgv = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_FOLLOW_SHOP_ARGV);
if (mode) {
    $.followShopArgv = "https://shop.m.jd.com/?shopId=1000000142";
    $.followShopArgv = "https://shop.m.jd.com/?shopId=1000000142";
    $.followShopArgv = "https://shop.m.jd.com/?venderId=1000000142";
    $.followShopArgv = "https://shop.m.jd.com/?shopId=1000000142&venderId=1000000142";
    $.followShopArgv = "https://shop.m.jd.com/?shopId=46937";
    $.followShopArgv = "https://shop.m.jd.com/?shopId=827547&venderId=undefined";
    $.followShopArgv = "694345_698519_12532352";
    $.concNum = 1;
    $.maxCookie = 10;
    $.cookieTypes = ["hot"];
}
$.version = "v1.0.0";
let limit = 0;
$.enableRunCache = false;
console.log($.followShopArgv);
class Task extends Env {
    constructor() {
        super();
    }
    async exec() {
        if (!$.superVersion) {
            throw new Error("请更新脚本");
        }
        if (!$.shopId && /\d+_\d+_\d+/.test($.followShopArgv)) {
            let argv = $.followShopArgv.split("_");
            $.shopId = argv?.[0];
            $.venderId = argv?.[1];
            $.activityId = argv?.[2];
        }
        let isgotShopHomeActivityInfo = false;
        let actInfo;
        if (!$.shopId || !$.venderId) {
            if ($.followShopArgv.startsWith("http")) {
                $.shopId = this.getQueryString($.followShopArgv, "shopId") || "";
                $.venderId = this.getQueryString($.followShopArgv, "venderId") || "";
            } else {
                let argv = $.followShopArgv.split("_");
                $.shopId = argv?.[0];
                $.venderId = argv?.[1];
            }
            let newshopid = $.shopId;
            let newvenderID = $.venderId;
            await this.getShopInfo();
            if (typeof $.shopId == "undefined" || typeof $.venderId == "undefined") {
                $.shopId = newshopid;
                $.venderId = newvenderID;
                actInfo = await this.getShopHomeActivityInfo();
                if (actInfo?.code !== "0") {
                    $.log(JSON.stringify(actInfo));
                    $.putMsg(JSON.stringify(actInfo));
                    $.expire = true;
                    return;
                } else {
                    if (!isgotShopHomeActivityInfo) {
                        isgotShopHomeActivityInfo = true;
                        $.log(actInfo);
                        newvenderID = this.getQueryString(actInfo?.result.levelZeroMenuUrl, "venderId") || "";
                        if (newvenderID != "") {
                            $.venderId = newvenderID;
                        }
                        $.shopId = newshopid;
                    }
                }
            }
            $.activityUrl = `https://shop.m.jd.com/?shopId=${$.shopId}&venderId=${$.venderId}`;
            this.log($.activityUrl);
        }
        if (!$.activityId) {
            actInfo = await this.getShopHomeActivityInfo();
            if (actInfo.code !== "0" || (actInfo.code === "0" && Object.keys(actInfo.result).length === 0)) {
                this.log(JSON.stringify(actInfo));
                this.putMsg("exit");
                limit++ > 20 ? ($.exit = true) : "";
                return;
            }
            let actInfoData = actInfo.result;
            if (actInfoData?.followed) {
                limit++ > 20 ? ($.exit = true) : "";
                this.putMsg("已经关注过啦");
            }
            if (actInfoData.giftBagDataResult?.shopGifts?.filter((o) => /(京豆|红包|积分)/.test(o.rearWord)).length > 0) {
                $.activityId = actInfoData.giftBagDataResult?.activityId?.toString();
            }
            if (actInfoData.giftBagDataResult?.shopGifts?.length && !$.activityId && this.index > $.masterNum) {
                this.putMsg("垃圾奖励");
                $.exit = true;
                return;
            }
            if (actInfoData.IsvRedUrl && !actInfoData.IsvRedUrl?.includes("txzj")) {
                $.activityUrl = actInfoData.IsvRedUrl;
                $.activityId = $.getQueryString($.activityUrl, "activityId");
                $.domain = $.match(/https?:\/\/([^/]+)/, $.activityUrl);
            }
        }
        if ($.activityId && !$.activityUrl.includes("cloud")) {
            $.concNum = 10;
            let gift = await this.drawShopGift();
            if (gift?.code !== "0") {
                this.log(JSON.stringify(gift));
                this.putMsg(JSON.stringify(gift));
                return;
            }
            this.log(gift?.result?.giftDesc);
            if (/礼包已抢完/.test(gift?.result?.giftDesc)) {
                limit++ > 20 ? ($.exit = true) : "";
            }
            let giftData = gift?.result;
            for (let ele of giftData?.alreadyReceivedGifts || []) {
                limit = 0;
                this.putMsg(`${ele.redWord}${ele.rearWord}`);
            }
        }
        if ($.activityUrl && $.activityUrl.includes("cjhy")) {
            await this.login();
            let activityContent = await this.api("wxShopGift/activityContent", `activityId=${$.activityId}&buyerPin=${this.Pin}`);
            if (!activityContent.result || !activityContent.data) {
                this.putMsg(activityContent.errorMessage);
                return;
            }
            $.prizeList = activityContent.data.list;
            let ts = $.content.filter((o) => ["jd", "jf"].includes(o.type));
            if (ts.length === 0 || (ts.length === 1 && ts[0].type === "jf" && ts[0].takeNum === 1)) {
                this.putMsg(`垃圾或领完`);
                $.exit = true;
                return;
            }
            let prize = await this.api("wxShopGift/draw", `activityId=${$.activityId}&buyerPin=${this.Pin}&hasFollow=false&accessType=app`);
            if (prize.result) {
                this.putMsg("WX领取成功");
            } else {
                await this.wxStop(prize.errorMessage);
                this.putMsg(`${prize.errorMessage}`);
            }
        }
    }
}
let kv = { jd: "京豆", jf: "积分", dq: "q券" };
$.after = async function () {
    if ($.prizeList.length > 0) {
        let message = `\n`;
        for (let ele of $.content || []) {
            message += `    ${ele.takeNum || ele.discount} ${kv[ele?.type]}\n`;
        }
        $.msg.push(message);
        $.msg.push(`export M_WX_SHOP_GIFT_URL="${$.activityUrl}"`);
    } else {
        $.msg.push(`export M_FOLLOW_SHOP_ARGV="${$.followShopArgv}"`);
    }
};
$.start(Task);
