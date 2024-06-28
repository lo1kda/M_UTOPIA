let mode = __dirname.includes("Work");
const { Env, getValue } = require("../utopia");
const $ = new Env("M无线关注");
$.version = "v1.0.0";
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_SHOP_GIFT_URL);
if (mode) {
    $.activityUrl = `https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v1/index?activityType=10058&templateId=7498bc9d-0be3-480d-ae9d-59b8a074566a&activityId=1769540777157701633&nodeId=101001&giftType=1&isGiftTrue=true&prd=crm `;
    $.activityUrl = `https://txzj-isv.isvjcloud.com/shop_gift?code=OWgwMHFoVVVidEl6c3dzbmF3`;
    $.activityUrl = `https://txzj-isv.isvjcloud.com/shop_gift?code=OHh0ZzlrWkFZOUl3dWdnamFB`;
    $.concNum = 1;
    $.maxCookie = 5;
    $.cookieTypes = ["tck"];
    $.enableRunCache = false;
}
$.limit = 0;
class Task extends Env {
    constructor(data) {
        super();
    }
    async getPrizeList(context) {
        if (this.isYqhdrcAct) {
            let data = await this.api(`/jd-hd-h5/giftBag/detail/${this.activityId}`);
            $.prizeList = data.data.prizes;
        } else if (this.isGzslAct) {
            $.prizeList = context.data.activity.prizes;
        } else if (this.isV1Act) {
            let shopGiftMain = await this.api("/api/shopGift/shopGiftMain", {});
            $.prizeList = shopGiftMain.data?.prizeInfoList || [];
            $.giftNum = shopGiftMain.data?.shopGiftRule?.giftNum;
            if ($.prizeList.length === 0) {
                this.putMsg(`垃圾活动`);
                $.exit = true;
                return;
            }
            debugger;
        } else if (this.isCommonAct) {
            $.prizeList = [];
            for (let ele of context.data.list) {
                $.prizeList.push({
                    type: ele.type === "jf" ? 9 : ele.type === "jd" ? 6 : 2,
                    discount: ele.discount,
                    takeNum: ele.takeNum,
                    name: ele.type === "jf" ? "积分" : ele.type === "jd" ? "京豆" : "其他",
                });
            }
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
        let context = await this.login({ fn: `wuxian/user/getShopGiftActivity/${$.activityId}` });
        if (this.isHdbAct) {
            let fn = "";
            if ($.activityType === "shopGift") {
                fn = "postShopGift";
            }
            if ($.activityType === "favouriteShop") {
                fn = "postFavouriteShopFrontAct";
            }
            let prize = await this.api(`/front/activity/${fn}`, {});
            if (prize.succ) {
                this.log(prize);
                await this.runCached();
                if ($.activityType === "shopGift") {
                    this.putMsg(`领取成功`);
                    return;
                }
            }
            return;
        }
        if (this.isTxzjAct) {
            let activityId = context("body").attr("data-code");
            if (!activityId) {
                this.putMsg(`活动已结束`);
                $.exit = true;
                return;
            }
            let { code, data, msg } = await this.api("/shop_gift/send_prize", `code=${activityId}&pid=${$.activityId}`);
            if (code === "success") {
                await this.runCached();
                if (["coupon"].includes(data?.prize_title?.type)) {
                    this.putMsg(`垃圾活动`);
                    $.exit = true;
                    return;
                } else {
                    this.putMsg(`${msg} ${data?.prize_title?.type || ""}`);
                    $.limit++;
                }
            }
            return;
        }
        if (this.isV1Act) {
            let prize = await this.api("/api/shopGift/drawShopGift", { flag: true, memberUser: 0, name: "", visitor: "", position: "" });
            if (prize.data) {
                this.putMsg(`领取成功`);
                await this.runCached();
            } else {
                this.putMsg(prize.resp_msg || "空气");
            }
            return;
        }
        if (this.isGzslAct) {
            let prizeId = context.activity.id;
            let prize = await this.api(`wuxian/user/getShopGiftPrize/${prizeId}?wxToken=${this.isvToken}`, {
                token: this.isvToken,
                wxToken: this.isvToken,
                activityId: prizeId,
                source: "01",
            });
            if (prize.status === "1") {
                this.putMsg(`${prize.data}`);
                await this.runCached();
            }
            return;
        }
        if (this.isYqhdrcAct) {
            while (true) {
                let prize = await this.api(`/jd-hd-h5/giftBag/accept?id=${$.activityId}`, {});
                this.log(prize);
                if (prize.code === 1) {
                    this.putMsg(`${prize.message}`);
                    await this.wait(10 * 3000, 10 * 3300);
                }
                if ([0].includes(prize.code)) {
                    await this.wait(1 * 3000, 2 * 3300);
                }
                if ([10005].includes(prize.code)) {
                    await this.runCachedForever();
                    break;
                }
                if (prize.message.includes("找不到该活动")) {
                    this.putMsg(`找不到该活动`);
                    $.exit = true;
                    return;
                }
            }
            return;
        }
        let activityContent = await this.api("wxShopGift/activityContent", `activityId=${$.activityId}&buyerPin=${this.Pin}`);
        if (!activityContent.result || !activityContent.data) {
            this.putMsg(activityContent.errorMessage);
            $.exit = true;
            await this.wxStop(activityContent.errorMessage);
            throw new Error("礼包不存在退出");
        }
        await this.checkActivity(activityContent);
        let prize = await this.api("wxShopGift/draw", `activityId=${$.activityId}&buyerPin=${this.Pin}&hasFollow=false&accessType=app`);
        if (prize.result) {
            this.putMsg("领取成功");
            await this.runCached();
        }
    }
}
let kv = { jd: "京豆", jf: "积分", dq: "券", jq: "券" };
let kv2 = { 1: "京豆", 2: "券" };
let kv3 = { 4: "京豆", 6: "积分" };
$.after = async function () {
    try {
        if ($.masterNum > 0 && $.limit >= $.masterNum) {
            $.msg.push("    全部完成");
        }
        for (let ele of $.prizeList || []) {
            if (this.isV1Act) {
                $.msg.push(`    ${ele.prizeName} ${$.giftNum}份`);
            } else if (this.isCommonAct) {
                $.msg.push(`    ${ele.takeNum || ele.discount} ${kv[ele?.type] || ele?.type}`);
            } else if (this.isYqhdrcAct) {
                $.msg.push(`    ${ele.price} ${kv3[ele.prizeType]}`);
            } else {
                $.msg.push(`    ${ele.unit} ${kv2[ele?.source] || ele?.source}`);
            }
        }
    } catch (e) {
        console.log(e);
    }
    $.msg.push(`export M_WX_SHOP_GIFT_URL="${$.activityUrl}"`);
};
$.start(Task);
