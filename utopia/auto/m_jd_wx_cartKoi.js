let mode = __dirname.includes("Work");
const { Env } = require("../utopia");
const $ = new Env("M购物车锦鲤");
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_CARTKOI_URL);
$.version = "v1.0.0";
if (mode) {
    $.activityUrl = `https://lzkj-isv.isvjcloud.com/wxCartKoi/cartkoi/activity/699c906df8074041ad7180888bb27e99?activityId=699c906df8074041ad7180888bb27e99&adsource=tg_storePage`;
    $.activityUrl = `https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v1/index?activityType=10036&activityId=1730118002340655106&templateId=2021070590900gwcjl0801&nodeId=101001&prd=crm`;
    $.runMode = "master";
    $.masterNum = 3;
}
$.attrTouXiang = "https://img10.360buyimg.com/imgzone/jfs/t1/21383/2/6633/3879/5c5138d8E0967ccf2/91da57c5e2166005.jpg";
$.concNum = 1;
class Task extends Env {
    constructor() {
        super();
    }
    async getPrizeList() {
        if (this.isV1Act) {
            let data = await this.api("/api/prize/drawPrize", {});
            if (data.resp_code !== 0) {
                this.log(`获取奖品失败`);
                return;
            }
            $.prizeList = data.data?.prizeInfo || [];
        } else {
            let getDrawPrizeInfo = await this.api("wxCartKoi/cartkoi/getDrawPrizeInfo", `activityId=${$.activityId}`);
            $.prizeList = getDrawPrizeInfo?.data;
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
            let myself = await this.api("/api/task/bargain/guest/myself", { shareUserId: $.helpUserId });
            let activity = await this.api("/api/task/addSkuPrice/activity", { shareUserId: $.helpUserId });
            let activity2 = await this.api("/api/task/addSkuPrice/activity2", {});
            if (!$.helpUserId) {
                let getUserId = await this.api("/api/task/share/getUserId", {});
                $.helpUserId = getUserId.data.shareUserId;
            }
            let productIds = [];
            for (let prodectVo of activity2.data.skuInfoList) {
                if (activity2.resp_code == 0) {
                    productIds.push({ skuId: prodectVo.skuId });
                }
            }
            $.actStartTime = activity2.data.addSkuStartTime;
            $.actEndTime = activity2.data.addSkuEndTime;
            $.drawTime = activity2.data.priceTime;
            $.totals = activity2.data.skuNumber;
            $.open = this.timestamp() > $.drawTime;
            $.drawTime = this.formatDate($.drawTime, "yyyy-MM-dd HH:mm:ss");
            if ($.open) {
                let recordData = await this.api("/api/task/addSkuPrice/draw", {});
                this.log(recordData);
                if (recordData?.data) {
                    if (recordData.data?.draw) {
                        this.putMsg(recordData?.data.draw.prizeName);
                        if (recordData?.data.draw.prizeType == 3 && recordData?.data.draw.dayTime == $.now("yyyy-MM-dd")) {
                            this.addressId = recordData?.data.draw.addressId;
                            this.prizeName = recordData?.data.draw.prizeName;
                            await this.saveAddress();
                        }
                    } else {
                        this.putMsg("空气");
                    }
                } else {
                    this.putMsg(recordData.errorMessage);
                }
                return;
            }
            if (activity2.data.addSkuNumber === activity2.data.skuNumber) {
                this.putMsg("已完成加购");
                return;
            }
            let quickAddCart = await this.api("/api/task/addSkuPrice/addSku", { skuId: "999" });
            this.putMsg(quickAddCart.resp_msg || "已完成加购");
            if (this.index == 1 && activity2.data.addSkuNumber < activity2.data.skuNumber) {
                for (let ele of activity2.data.skuInfoList) {
                    await this.api("/api/task/addSkuPrice/addSku", { skuId: ele.skuId });
                }
            }
        } else {
            let activityContent = await this.api(
                "wxCartKoi/cartkoi/activityContent",
                `activityId=${$.activityId}&pin=${this.Pin}&status=1&friendUuid=""&yunMidImageUrl=${$.attrTouXiang}`
            );
            if (!activityContent.result || !activityContent.data) {
                this.putMsg(activityContent.errorMessage);
                return;
            }
            let productIds = [];
            for (let prodectVo of activityContent.data.prodectVos) {
                if (prodectVo.collection === false) {
                    productIds.push(prodectVo.productId);
                }
            }
            let activityVo = activityContent.data?.activityVo || {};
            $.actStartTime = activityVo.cartStartTime;
            $.actEndTime = activityVo.cartEndTime;
            $.rule = activityVo.actRule;
            $.drawTime = activityVo.drawTime + ":00";
            $.open = $.timestamp() > $.parseDate($.drawTime).getTime();
            if ($.open) {
                let recordData = await this.api(
                    "wxCartKoi/cartkoi/drawResult",
                    `activityId=${$.activityId}&pin=${this.Pin}&uuid=${activityContent.data.joinRecord.myUuid}`
                );
                this.log(recordData);
                if (recordData?.result && recordData?.data) {
                    if (recordData?.data.drawOk) {
                        this.addressId = recordData?.data.addressId;
                        this.prizeName = recordData?.data.drawName;
                        this.putMsg(this.prizeName);
                        if (recordData?.data.drawType === 7 && recordData?.data.needWriteAddress === "y") {
                            await this.saveAddress();
                        }
                    } else {
                        this.putMsg("空气");
                    }
                } else {
                    this.putMsg(recordData.errorMessage);
                }
                return;
            }
            if (activityContent.data.addCarts === activityContent.data.totals) {
                this.putMsg("已完成加购");
                return;
            }
            let quickAddCart = await this.api(
                "wxCartKoi/cartkoi/quickAddCart",
                `activityId=${$.activityId}&pin=${this.Pin}&productIds=${encodeURIComponent(JSON.stringify(productIds))}`
            );
            this.putMsg(quickAddCart.errorMessage || "已完成加购");
            await this.carRmv(productIds);
        }
    }
}
$.after = async function () {
    try {
        if ($.actStartTime) {
            $.open ? $.msg.push(`   已经开奖`) : $.msg.push(`开奖时间:${$.drawTime}`);
        }
        for (let ele of $.prizeList || []) {
            $.msg.push(`    ${ele.name || ele.prizeName}`);
        }
    } catch (e) {
        console.log(e);
    }
    $.msg.push(`export M_WX_CARTKOI_URL="${$.activityUrl}"`);
};
$.start(Task);
