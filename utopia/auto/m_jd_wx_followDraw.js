let mode = __dirname.includes("Work");
const { Env, getValue } = require("../utopia");
const $ = new Env("M关注抽奖");
$.version = "v1.0.0";
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_FOLLOW_DRAW_URL);
if (mode) {
    $.activityUrl = "https://cjhy-isv.isvjcloud.com/wxShopFollowActivity/activity?activityId=c00ada80d92645e0b6d73b7a99614a75";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10053&activityId=1784503537852403713&templateId=20210804190900gzspyl011&nodeId=101001053&prd=cjwx";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10069&activityId=1784455243707830273&templateId=100690240314gzdpyl&nodeId=101001&prd=cjwx";
    $.activityUrl = "https://jinggeng-rc.isvjcloud.com/ql/front/showFavoriteShop?id=9e8080c58f22a4fa018f246474f8530f&user_id=1000148905";
    $.activityUrl =
        "https://jingyun-rc.isvjcloud.com/h5/pages/followshop/hitGoldenEgg/hitGoldenEggs?id=856d6a516bcfd30be69915aaa9fe554c&userId=1000085082&actForm=single";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10069&templateId=ac8b6564-aa35-4ba5-aa62-55b0ce61b5d01&activityId=1784832300401143809&nodeId=101001&prd=cjwx";
    $.concNum = 1;
    $.maxCookie = 1;
}
$.limit = 0;
class Task extends Env {
    constructor(data) {
        super();
    }
    async getPrizeList(context) {
        if (this.isV1Act) {
            let data = await this.api("/api/prize/drawPrize", {});
            if (data.resp_code !== 0) {
                this.log(`获取奖品是失败`);
                return;
            }
            if (!this.super.prizeList) {
                this.log(data.data?.prizeInfo);
            }
            this.super.prizeList = data.data?.prizeInfo || [];
        } else if (this.isCommonAct) {
            $.prizeList = context.data.drawContentVOs || [];
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
        let context = await this.login({ fn: "ql/front/showFavoriteShop" });
        if (this.isTxzjAct) {
            let { code, data, msg } = await this.api("/collect_shop/receive_prize", `pid=${$.activityId}`);
            if (code === "success") {
                await this.runCachedForever();
                if (["coupon"].includes(data.prize_title.type)) {
                    this.putMsg(`垃圾活动`);
                    $.exit = true;
                    return;
                } else {
                    this.putMsg(`${msg} ${data?.prize_title?.type}`);
                    $.limit++;
                }
            }
            return;
        }
        if (this.isHdbAct) {
            let dd = await this.api("front/activity/postFavouriteShopFrontAct", {});
            if (dd.succ) {
                $.limit++;
                this.putMsg(dd.result.dmAward.awardName);
                await this.runCachedForever();
            } else {
                this.putMsg(dd.message || "空气");
            }
            return;
        }
        if (this.isJinggengAct) {
            let error = context("#error", "body").attr("value");
            if (error.includes("您已参加过此活动")) {
                this.putMsg(`您已参加过此活动`);
                await this.runCachedForever();
                return;
            }
            if (error) {
                this.putMsg(error);
            }
            let data = await this.api("ql/front/postFavoriteShop", `user_id=${$.userId}&act_id=${$.activityId}`);
            if (data.succ) {
                let prize = JSON.parse(data.msg);
                if (prize.isSendSucc && prize.drawAwardDto) {
                    let award = prize.drawAwardDto;
                    await this.runCachedForever();
                    let awardName = this.getAwardText(prize.drawAwardDto);
                    this.putMsg(awardName);
                    if (award.awardType === "JD_GOODS") {
                        this.addressId = prize.actLogId;
                        this.prizeName = awardName;
                        await this.saveAddress();
                    }
                } else {
                    this.putMsg(data.msg);
                }
            } else {
                this.putMsg(data.msg.includes("您未中奖") ? "空气" : data.msg);
            }
            return;
        }
        if (this.isV1Act) {
            let prize = "已经关注";
            if (["10053"].includes($.activityType)) {
                let goods = await this.api("/api/task/followGoods/getFollowGoods", {});
                for (let ele of goods.data) {
                    if (ele.status === 1) {
                        this.log("已经关注");
                        return;
                    }
                    if ([5].includes(ele.taskType * 1)) {
                        for (let i = ele?.completeCount || 0; i < (ele?.finishNum || 1); i++) {
                            let p = await this.api("/api/task/followGoods/followGoods", { skuId: ele.skuInfoVO[i].skuId });
                            if (p.data?.result) {
                                prize = p;
                                await this.runCachedForever();
                                break;
                            } else {
                                p.resp_msg && this.log(p.resp_msg);
                                if (/(已经领取过)/.test(p.resp_msg)) {
                                    await this.runCachedForever();
                                    return;
                                }
                            }
                        }
                    }
                }
            } else {
                let headers = {
                    Accept: "application/json, text/plain, */*",
                    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    Connection: "keep-alive",
                    "user-agent": this.UA,
                    Referer: $.activityUrl,
                    token: this.Token,
                };
                let url = `https://lzkj-isv.isvjcloud.com/${$.urlPrefix}/api/task/lkFollowShop/saveFollowInfo?actType=10069`;
                prize = await this.api("/api/task/lkFollowShop/saveFollowInfo?actType=10069", "");
            }
            if (JSON.stringify(prize).includes("该用户已经参加过活动") || JSON.stringify(prize).includes("已经关注")) {
                this.putMsg(prize.resp_msg || prize.data);
                await this.runCachedForever();
            } else if (prize.resp_code == 0 && prize.data) {
                $.limit++;
                await this.runCachedForever();
                if (prize.data.prizeName) {
                    this.putMsg(prize.data.prizeName);
                } else {
                    this.putMsg("空气");
                }
            } else {
                this.putMsg(prize?.data || `空气`);
            }
            return;
        }
        let activityContent = await this.api("wxShopFollowActivity/activityContentOnly", `activityId=${$.activityId}&pin=${this.Pin}`);
        if (!activityContent.result || !activityContent.data) {
            this.putMsg(activityContent.errorMessage);
            return;
        }
        $.actStartTime = activityContent.data.startTime;
        $.actEndTime = activityContent.data.endTime;
        $.rule = activityContent.data.rule;
        this.hasFollow = activityContent.data.hasFollow || false;
        this.needFollow = activityContent.data.needFollow || false;
        this.canDrawTimes = activityContent.data?.canDrawTimes || 0;
        this.drawConsume = activityContent.data?.drawConsume || 0;
        await this.checkActivity(activityContent);
        await this["followShop"]($.shopId, false);
        await this.api("wxShopFollowActivity/follow", `activityId=${$.activityId}&pin=${this.Pin}`);
        await this.api("wxShopFollowActivity/follow", `activityId=${$.activityId}&pin=${this.Pin}`);
        for (let i = 0; i < 3 && this.canDrawTimes > 0; i++) {
            let prize = await this.api("wxShopFollowActivity/getPrize", `activityId=${$.activityId}&pin=${this.Pin}`);
            if (prize.result) {
                this.canDrawTimes = prize.data.canDrawTimes;
                if (prize.data.drawOk) {
                    await this.runCachedForever();
                    this.putMsg(prize.data.name);
                    if (prize.data.drawInfoType === 7 && prize.data.needWriteAddress === "y" && prize.data.addressId) {
                        this.addressId = prize.data.addressId;
                        this.prizeName = prize.data.name;
                        await this.saveAddress();
                    }
                    break;
                } else {
                    this.putMsg("空气");
                }
            } else {
                this.putMsg(`${prize.errorMessage}`);
                if (i === 0 && prize.errorMessage.includes("先关注,再抽奖")) {
                    await this.api("wxShopFollowActivity/follow", `activityId=${$.activityId}&pin=${this.Pin}`);
                    i--;
                    continue;
                }
                break;
            }
        }
    }
}
$.after = async function () {
    try {
        for (let ele of $.prizeList || []) {
            if (["10053", "10069"].includes($.activityType)) {
                $.msg.push(`    ${ele.prizeName} ${ele.leftNum}份`);
                continue;
            } else if (ele.name.includes("谢谢") || ele.name.includes("再来")) {
                continue;
            }
            $.msg.push(`    ${ele.name} ${ele?.type === 8 ? "专享价" : ""} ${ele?.prizeNum - ele?.hasSendPrizeNum}/${ele?.prizeNum}份`);
        }
    } catch (e) {
        console.log(e);
    }
    $.msg.push(`export M_WX_FOLLOW_DRAW_URL="${$.activityUrl}"`);
};
$.start(Task);
