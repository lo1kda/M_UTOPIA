let mode = __dirname.includes("Work");
const { Env, getValue, cheerio } = require("../utopia");
const $ = new Env("M加购有礼");
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_ADD_CART_URL);
$.version = "v1.0.0";
if (mode) {
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10024&activityId=1727250072363245570&templateId=7f4116e9-34b2-4f6d-9684-d7ca7c4b3d69&nodeId=101001&prd=cjwx";
    $.activityUrl = "https://jinggeng-isv.isvjcloud.com/ql/front/showCart?id=9e8080bc8a4e3345018a5020d6a427da&user_id=190205";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10024&activityId=1732952656497049602&templateId=c2af9114-85d5-4c31-ab61-201f370f0f2e&nodeId=101001&prd=cjwx";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10024&activityId=1734760293945540610&templateId=c2af9114-85d5-4c31-ab61-201f370f0f2e&nodeId=101001&prd=cjwx";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10024&activityId=1737353655227850754&templateId=c2af9114-85d5-4c31-ab61-201f370f0f2e&nodeId=101001&prd=cjwx";
    $.activityUrl = "https://cjhy-isv.isvjcloud.com/wxCollectionActivity/activity?activityId=e1d30480c8b64be8849a8d711f4066d0";
    $.activityUrl = "https://jingyun-rc.isvjcloud.com/h5/pages/plusGift/plusGift3?id=5c473ab66a4f8b5b74a04d077a5a22f8&userId=1000090824";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v1/index?activityType=10024&activityId=1727564379523313666&templateId=20210518190900jgyl01&nodeId=101001&prd=crm";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/wxCollectionActivity/activity2/5aa3b1a806fe4f978d659c577cc33156?activityId=5aa3b1a806fe4f978d659c577cc33156";
    $.activityUrl = "https://cjhy-isv.isvjcloud.com/wxCollectionActivity/activity?activityId=ae7ff71c331046ddabdc66b1af5e47f6";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v1/index?activityType=10024&templateId=e0fa23cd-9120-47ff-ad44-dde6c92bfbc6&activityId=1734402298685677569&nodeId=101001&prd=crm&shopid=1000002836 ";
    $.activityUrl =
        "https://lorealjdcampaign-rc.isvjcloud.com/interact/index?activityType=10024&activityId=1760252728879730690&templateId=20210518190900jgyl01&nodeId=101001&prd=crm ";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10024&activityId=1764846516851310594&templateId=c2af9114-85d5-4c31-ab61-201f370f0f2e&nodeId=101001&prd=cjwx ";
    $.activityUrl = "https://txzj-isv.isvjcloud.com/cart_item/home?a=ZE1MYmdrckp3ZktRZDdsajJn";
    $.activityUrl = "https://cjhy-isv.isvjcloud.com/wxCollectionActivity/activity?activityId=fc5a86f1fc274d56966fb262de597e76";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v1/index?activityType=10024&templateId=e0fa23cd-9120-47ff-ad44-dde6c92bfbc6&activityId=1762754385111003137&nodeId=101001&prd=crm&shopid=1000003039";
    $.activityUrl = "https://cjhy-isv.isvjcloud.com/wxCollectionActivity/activity?activityId=77da0a08c39347c7ad4e718c3afc78f0";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10024&activityId=1779764425579671554&templateId=c2af9114-85d5-4c31-ab61-201f370f0f2e&nodeId=101001&prd=cjwx";
    $.activityUrl = "https://cjhy-isv.isvjcloud.com/wxCollectionActivity/activity?activityId=9805dbea206e454b8829972de54c1b16";
    $.activityUrl = "https://cjhy-isv.isvjcloud.com/wxCollectionActivity/activity?activityId=06c3c29135ed4d7bad6e1d96e868c2e0";
    $.enableRunCache = false;
    $.maxCookie = 15;
    $.concNum = 5;
    $.cookieTypes = ["merge"];
}
$.limit = 0;
class Task extends Env {
    constructor(data) {
        super();
    }
    async getPrizeList(context) {
        if ($.isJinggengAct) {
            const prizeRule = $.rule.match(/加购(\d+)个宝贝后可以获得(\d+)(.*);/);
            $.needCollectionSize = prizeRule[1];
            let equityType = "JD_BEAN";
            if (/积分/.test(prizeRule[3])) {
                equityType = "JD_POINT";
            } else if (/券/.test(prizeRule[3])) {
                equityType = "JD_COUPON";
            }
            let prizeName = prizeRule[2] + prizeRule[3];
            $.prizeList = [{ equityName: prizeName, equityType: equityType, availableQuantity: 999 }];
        } else if (this.isCommonAct) {
            $.needCollectionSize = context.needCollectionSize;
            $.prizeList = [context.drawInfo.drawInfo];
        } else if (this.isHdbAct) {
            let loadFrontAward = await this.api("/front/activity/loadFrontAward", {});
            if (loadFrontAward.succ) {
                this.super.prizeList = loadFrontAward.result || [];
            } else {
                this.log(loadFrontAward.message);
            }
        } else if (this.isV1Act) {
            let data = await this.api("/api/prize/drawPrize", {});
            if (data.resp_code !== 0) {
                this.log(`获取奖品是失败`);
                return;
            }
            if (!this.super.prizeList) {
                this.log(data.data?.prizeInfo);
            }
            this.super.prizeList = data.data?.prizeInfo || [];
        }
    }
    async exec() {
        if (!$.superVersion) {
            throw new Error("请更新脚本");
        }
        let context = await this.login({ fn: $.isJinggengAct ? `ql/front/showCart` : `wuxian/user/getGoodsGiftActivity/${$.activityId}` });
        if (["txzj-isv.isvjcloud.com"].includes($.domain)) {
            let { code, data, msg } = await this.api("/cart_item/receive_prize", `pid=${$.activityId}`);
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
        if ($.isJinggengAct) {
            let actLog = context("#act_log").text();
            if (actLog) {
                let prize = JSON.parse(actLog);
                if (prize.isHandler) {
                    await this.runCachedForever();
                    this.putMsg(`已领过奖`);
                    $.limit++;
                    return;
                }
            }
            let skuIds = [];
            context('div:contains("加购宝贝")').each((index, element) => {
                const id = context(element).attr("id");
                if (id) {
                    skuIds.push(id);
                }
            });
            if (skuIds.length === 0) {
                this.putMsg(`获取奖励异常`);
                return;
            }
            for (let i = 0; i < skuIds.length; i++) {
                const itemId = skuIds[i];
                if (i + 1 > $.needCollectionSize) {
                    this.log("加购完成");
                    break;
                }
                const addCartObj = await this.api(`ql/front/postAddCart`, `act_id=${$.activityId}&user_id=${$.userId}&itemId=${itemId}`);
                const succMsg = addCartObj.msg;
                if (addCartObj.succ && succMsg.startsWith("{")) {
                    try {
                        let prize = JSON.parse(succMsg);
                        if (prize.isSendSucc && prize.drawAwardDto) {
                            await this.runCachedForever();
                            let award = prize.drawAwardDto;
                            let awardName = await this.getAwardText(prize.drawAwardDto);
                            this.putMsg(awardName);
                            if (award.awardType === "JD_GOODS") {
                                this.addressId = prize.actLogId;
                                this.prizeName = awardName;
                                await this.saveAddress();
                            }
                            break;
                        } else {
                            $.log(succMsg);
                        }
                    } catch (error) {
                        this.putMsg(succMsg);
                    }
                } else {
                    if (succMsg.includes("加购成功但不需要发奖")) {
                        await this.wait(3000, 3000);
                        continue;
                    }
                    this.putMsg(succMsg);
                    if (succMsg.match(/只有部分会员才可以参加活动/)) {
                        break;
                    }
                    if ($.exit) {
                        break;
                    }
                }
            }
            return;
        }
        if (this.isGzslAct) {
            let prizeId = context.activity.id;
            let prize = await this.api(`wuxian/user/getGoodsGiftPrizeAndWare/${prizeId}?wxToken=${this.isvToken}`, {
                token: this.isvToken,
                wxToken: this.isvToken,
                activityId: prizeId,
                source: "01",
            });
            $.needCollectionSize = 1;
            prize.status === "1" ? this.putMsg(`${prize.data}`) : this.putMsg(`${prize.msg}`);
            return;
        }
        if (this.isHdbAct) {
            let items = await this.api("/front/activity/loadFrontItems", {});
            let loadAddCartSetting = await this.api("/front/activity/loadAddCartSetting", {});
            let prizeName = await this.getAwardText($.prizeList[0]);
            $.needCollectionSize = loadAddCartSetting.result.addCartSetting.itemAmount;
            if (loadAddCartSetting.result.hasReceiveAward) {
                await this.runCachedForever();
                this.putMsg("已领过奖");
                $.limit++;
                return;
            }
            for (let i = 0; i < $.needCollectionSize; i++) {
                await this.reportActionLog({ actionType: "addCart", skuId: items.result[i].skuId });
            }
            let data = await this.api("/front/activity/postAddCartFrontAct", {});
            if (data.result?.succ) {
                await this.runCachedForever();
                this.putMsg(prizeName);
            } else {
                this.putMsg(data.message);
            }
            return;
        }
        if (this.isV1Act) {
            this.prizeName = $.prizeList?.[0]?.prizeName;
            let activity = await this.api("/api/task/addSku/activity", {});
            if (activity.resp_code !== 0) {
                this.putMsg(`获取活动失败`);
                return;
            }
            let status = activity.data.addWares.status;
            let taskId = activity.data.addWares.taskId;
            $.needCollectionSize = activity.data.addWares.finishNum;
            if (status === 1) {
                this.putMsg("已领过奖");
                await this.runCachedForever();
                $.limit++;
                return;
            }
            let prizeResultNum = activity.data.prizeResultNum; //还剩
            if (prizeResultNum === 0) {
                this.putMsg("垃圾或领完");
                $.exit = true;
                return;
            }
            let skuIds = $.randomArray(
                activity.data.addWares.skuInfoVO.map((vo) => vo.skuId + ""),
                $.needCollectionSize
            );
            let count = 1;
            for (let i = 0; i < skuIds.length; i++, count++) {
                let todo = await this.api("/api/task/addSku/toDo", {
                    taskId: taskId,
                    skuId: skuIds[i],
                });
                if (todo.resp_msg.includes("任务已做过")) {
                    continue;
                }
                if (todo.resp_code !== 0) {
                    this.putMsg(todo.resp_msg);
                    if ($.exit) {
                        break;
                    }
                }
                if (todo?.data && todo.data.status === 0) {
                    if (todo.data.canSend === 4) {
                        this.putMsg("今日奖品已发完,明日再来吧");
                        $.exit = true;
                        return;
                    }
                    if (todo.data.canSend === 5 || todo.data.canSend === 6) {
                        this.putMsg("活动奖品已发完,垃圾活动");
                        $.exit = true;
                        return;
                    }
                    if (todo.data.canSend === 7) {
                        this.putMsg("奖品与您擦肩而过了哟，关注下其他活动吧~");
                        return;
                    }
                    if (todo.data.canSend === 8 || todo.data.canSend === 9) {
                        if (count < skuIds.length + 10) {
                            i--;
                        }
                        continue;
                    } else {
                        this.log(todo);
                        return;
                    }
                }
                if (todo?.data && todo.data.status === 1) {
                    await this.runCachedForever();
                    $.limit++;
                    this.putMsg(this.prizeName);
                    if (todo.data.prizeType === 3) {
                        this.addressId = todo.data.addressId;
                        await this.saveAddress();
                    }
                    break;
                }
            }
            return;
        }
        let wxCollectionActivity = await this.api("wxCollectionActivity/activityContent", `activityId=${$.activityId}&pin=${this.Pin}`);
        let activity = wxCollectionActivity.data;
        if (!wxCollectionActivity.result || !activity) {
            this.putMsg(wxCollectionActivity.errorMessage);
            return;
        }
        $.rule = activity.rule;
        $.actStartTime = activity.startTime;
        $.actEndTime = activity.endTime;
        await this.checkActivity(activity);
        let drawInfo = activity.drawInfo.drawInfo;
        $.needCollectionSize = activity.needCollectionSize;
        await this.checkActivity(activity);
        if (activity.cpvos.length < $.needCollectionSize) {
            this.putMsg("商品数量异常");
            $.exit = true;
            return;
        }
        let oneKeyAddCart = activity.oneKeyAddCart * 1 === 1;
        let hasCollectionSize = activity.hasCollectionSize;
        const skuIds = $.randomArray(activity.cpvos.filter((o) => !o.collection).map((vo) => vo.skuId + "")).reverse();
        let isAddSuccess = false;
        if (oneKeyAddCart) {
            let carInfo = await this.api(
                "wxCollectionActivity/oneKeyAddCart",
                `activityId=${$.activityId}&pin=${this.Pin}&productIds=${encodeURIComponent(JSON.stringify(skuIds))}`
            );
            if (carInfo.result && carInfo.data) {
                $.limit++;
                this.log(`加购完成，本次加购${carInfo.data.hasAddCartSize}个商品`);
                isAddSuccess = true;
            } else {
                if (carInfo.errorMessage.includes("店铺会员")) {
                    if (drawInfo.type === 6) {
                        await this.openCard();
                        if (!this.isMember) {
                            this.putMsg("开卡失败");
                            return;
                        }
                        carInfo = await this.api(
                            "wxCollectionActivity/oneKeyAddCart",
                            `activityId=${$.activityId}&pin=${this.Pin}&productIds=${encodeURIComponent(JSON.stringify(skuIds))}`
                        );
                        if (carInfo.result) {
                            if (carInfo.data.hasAddCartSize >= $.needCollectionSize) {
                                this.log(`加购完成，本次加购${carInfo.data.hasAddCartSize}个商品`);
                                isAddSuccess = true;
                            }
                        } else {
                            this.putMsg(`${carInfo.errorMessage}`);
                        }
                    } else {
                        this.putMsg(`${carInfo.errorMessage}`);
                        return;
                    }
                } else {
                    this.putMsg(`${carInfo.errorMessage}`);
                }
            }
        } else {
            let tip = "";
            let counter = 0;
            for (let i = 0; i < skuIds.length; i++) {
                let carInfo = await this.api(
                    `wxCollectionActivity/${$.activityType * 1 === 5 ? "collection" : "addCart"}`,
                    `activityId=${$.activityId}&pin=${this.Pin}&productId=${skuIds[i]}`
                );
                if (!carInfo.hasOwnProperty("errorMessage") && counter < 10) {
                    i--;
                    counter++;
                    continue;
                }
                counter = 0;
                if (carInfo.result) {
                    if (carInfo.data.hasAddCartSize >= $.needCollectionSize) {
                        isAddSuccess = true;
                    }
                    if (isAddSuccess) {
                        $.limit++;
                        this.log(`加购完成，本次加购${carInfo.data.hasAddCartSize}个商品`);
                        break;
                    }
                } else {
                    if (carInfo.errorMessage.includes("店铺会员")) {
                        if (drawInfo.type === 6) {
                            await this.openCard();
                            if (!this.isMember) {
                                this.putMsg("开卡失败");
                                break;
                            }
                            i--;
                        }
                        this.putMsg(`${carInfo.errorMessage}`);
                        return;
                    } else {
                        if (tip === carInfo.errorMessage) {
                            continue;
                        }
                        tip = carInfo.errorMessage;
                        this.putMsg(`${carInfo.errorMessage}`);
                        if ($.exit) {
                            break;
                        }
                        if (/(超出关注数量上限)/.test(carInfo.errorMessage)) {
                            break;
                        }
                    }
                }
            }
        }
        if ($.exit) {
            return;
        }
        for (let i = 0; i < 5; i++) {
            try {
                let prize = await this.api("wxCollectionActivity/getPrize", `activityId=${$.activityId}&pin=${this.Pin}`);
                if (prize.result) {
                    if (prize.data?.drawOk) {
                        await this.runCachedForever();
                        this.addressId = prize.data.addressId;
                        this.prizeName = prize.data.name;
                        this.putMsg(this.prizeName);
                        if (prize.data.drawInfoType === 7 && prize.data.needWriteAddress === "y") {
                            await this.saveAddress();
                        }
                    } else {
                        this.putMsg(prize.data.errorMessage);
                        if ($.exit) {
                            break;
                        }
                    }
                    break;
                } else {
                    if (/(您已领过奖了|非法操作|未达到领奖条件|今日奖品全部被领取)/.test(prize.errorMessage)) {
                        this.putMsg(`${prize.errorMessage}`);
                        break;
                    }
                    this.putMsg(`${prize.errorMessage}`);
                    if ($.exit) {
                        break;
                    }
                }
            } catch (e) {
                this.log(e);
            }
        }
    }
}
$.after = async function () {
    try {
        let prizeCount = $.rule.match(/(数量：|共|赠送)(\d+)份/);
        let addNum = $.rule.match(/需要(加购|关注)(\d+)件/);
        for (let ele of $.prizeList) {
            this.msg.push(
                `    加${$.needCollectionSize || addNum?.[2]}件,${ele.name || ele.prizeName || ele.equityName || ele.awardName},共${
                    ele.leftNum || prizeCount?.[2] || "未知"
                }份`
            );
        }
    } catch (e) {
        console.log(e);
    }
    $.msg.push(`export M_WX_ADD_CART_URL="${$.activityUrl}"`);
};
$.start(Task);
