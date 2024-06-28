let mode = __dirname.includes("Work");
const { Env } = require("../utopia");
const $ = new Env("M盖楼领奖");
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_BUILD_DRAW_URL);
if (mode) {
    $.activityUrl = "https://lzkj-isv.isvjcloud.com/wxBuildActivity/activity?activityId=fa038f3ee86e4ec4806942555c1f7ff6";
    $.activityUrl =
        "https://jinggeng-rc.isvjcloud.com/ql/front/floor?id=9e8080358d7a2559018d7d78d8dc3eff&user_id=1000000331&sid=&un_area=1_72_55674_0";
}
class Task extends Env {
    constructor() {
        super();
    }
    async getPrizeList(context) {
        if (/(jinggeng)/.test($.activityUrl)) {
            $.prizeList = [{ equityName: "京豆", equityType: "JD_BEAN", availableQuantity: 999 }];
        } else if (/(activityType)/.test($.activityUrl)) {
            let { data } = await this.api("/api/task/building/prizeList", {});
            $.prizeList = data;
        } else if (/(wxBuildActivity)/.test($.activityUrl)) {
            $.prizeList = context.data.drawInfos || [];
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
        const content = await this.login({ fn: "/ql/front/floor" });
        if (this.isV1Act) {
            const xxxxx = await this.api("/api/task/building/build", { buildText: "参与盖楼赢好礼" });
            return;
        }
        if (this.activityUrl.includes("jinggeng")) {
            for (let i = 0; i < 100; i++) {
                const pinyu = this.randomArray(JSON.parse(content("#comments").val()), 1)[0].pinyu;
                let data = await this.api(
                    "/ql/front/ajaxFloor",
                    `act_id=${$.activityId}&user_id=${$.userId}&buyer_logo=${encodeURIComponent(this.attrTouXiang)}&comment_info=${encodeURIComponent(
                        pinyu
                    )}`
                );
                if (data.succ) {
                    let prize = JSON.parse(data.msg);
                    if (prize.isSendSucc && prize.drawAwardDto) {
                        let award = prize.drawAwardDto;
                        let awardName = await this.getAwardText(prize.drawAwardDto);
                        this.putMsg(awardName);
                        $.prizeList = [{ prizeName: awardName }];
                        if (award.awardType === "JD_GOODS") {
                            this.addressId = prize.actLogId;
                            this.prizeName = awardName;
                            await this.saveAddress();
                        }
                    } else {
                        this.putMsg(data.msg);
                    }
                } else {
                    this.putMsg(data.str2Param);
                }
                await this.wait(6000, 8000);
            }
            return;
        }
        let activityContent = await this.api("wxBuildActivity/activityContent", `pin=${this.Pin}&activityId=${$.activityId}`);
        if (!activityContent.result || !activityContent.data) {
            this.putMsg(activityContent.errorMessage);
            return;
        }
        $.rule = activityContent.data.rule;
        await this.checkActivity(activityContent);
        let words = activityContent.data.words;
        let count = 0;
        while (count < 10) {
            let prize = await this.api(
                "wxBuildActivity/publish",
                `pin=${this.Pin}&activityId=${$.activityId}&content=${encodeURIComponent(this.randomArray(words, 1)[0].content)}`
            );
            if (prize.result && prize.data.drawResult.drawOk) {
                this.putMsg(prize.data.drawResult.name);
                if (prize.data.drawResult.needWriteAddress === "y") {
                    this.prizeName = prize.data.drawResult.name;
                    this.addressId = prize.data.drawResult.addressId;
                    await this.saveAddress();
                }
                break;
            } else {
                this.log(prize.data?.errorMessage || "空气");
            }
        }
    }
}
$.after = async function () {
    try {
        for (let ele of $.prizeList || []) {
            $.msg.push(`    ${ele.name || ele.prizeName} ${ele?.type === 8 ? "专享价" : ""}`);
        }
    } catch (e) {
        console.log(e);
    }
    $.msg.push(`export M_WX_BUILD_DRAW_URL="${$.activityUrl}"`);
};
$.start(Task);
