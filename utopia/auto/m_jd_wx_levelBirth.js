let mode = __dirname.includes("Work");
const { Env } = require("../utopia");
const $ = new Env("M等级/生日礼包");
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_LEVEL_BIRTH_URL);
let beanNum = parseInt(process.env?.M_WX_LEVEL_BIRTH_BEAN_NUM || 10);
if (mode) {
    $.activityUrl = "https://cjhy-isv.isvjcloud.com/mc/wxMcLevelAndBirthGifts/activity?activityId=6ef3ee4648994444bcc5d63510b7f2f0";
}
$.version = "v1.0.0";
class Task extends Env {
    constructor() {
        super();
    }
    async getPrizeList(content) {
        if (this.isV2Act) {
        } else {
            $.prizeList = (content.data.content && JSON.parse(content.data.content)) || [];
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
        if (this.isV2Act) {
            if (this.activityType == "20002") {
                let birthday = await this.api(`/api/${this.activityType}/birthday`, { birthday: this.now("yyyy-MM-dd") });
            }
            let receivePrize = await this.api(`/api/${this.activityType}/receivePrize`, {});
            if (this.activityType == "20001") {
                this.log(receivePrize);
            }
            if (this.activityType == "20002") {
                try {
                    if (receivePrize.code == 200) {
                        let myPrizes = await this.api(`/api/${this.activityType}/myPrizes`, {});
                        this.prizeName = myPrizes.data[0].prizeName || "空气";
                        this.putMsg(this.prizeName);
                    }
                } catch (e) {
                    this.putMsg("已领取");
                }
            }
            return;
        }
        let activityContent = await this.api(`mc/wxMcLevelAndBirthGifts/activityContent`, `activityId=${$.activityId}&pin=${this.Pin}&level=1`);
        $.rule = activityContent.data.actRule;
        $.actStartTime = activityContent.data.startTime;
        $.actEndTime = activityContent.data.endTime;
        $.actName = activityContent.data.activityName || "";
        await this.checkActivity(activityContent);
        let member = await this.api(`mc/wxMcLevelAndBirthGifts/getMemberLevel`, `venderId=${$.venderId}&pin=${this.Pin}`);
        let level = member.data?.level || false;
        let levelName = member.data?.levelName || "非会员";
        if (!level) {
            let filter = $.content.filter((o) => o.drawLevel * 1 === 1 && (o.type === 6 || o.type === 7));
            if (filter.length > 0 && (filter[0].beanNum >= beanNum || filter[0].type === 7)) {
                await this.openCard();
                await this.wait(1500, 2000);
            } else {
                this.putMsg("垃圾或领完");
                $.exit = true;
                return;
            }
            member = await this.api(`mc/wxMcLevelAndBirthGifts/getMemberLevel`, `venderId=${$.venderId}&pin=${this.Pin}`);
            level = member.data?.level || false;
            levelName = member.data?.levelName || "非会员";
        }
        this.putMsg(`${levelName}`);
        let isReceived = activityContent.data.isReceived;
        if (isReceived === 1) {
            this.putMsg("已领过");
            let drawBirthdayRecord = await this.api(
                "mc/wxMcLevelAndBirthGifts/getDrawBirthdayRecord",
                `activityId=${$.activityId}&venderId=${$.venderId}&pin=${this.Pin}`
            );
            for (let i = 0; i < drawBirthdayRecord.data.length; i++) {
                for (let j = 0; j < drawBirthdayRecord.data[i].recordInfoList.length; j++) {
                    for (let k = 0; k < drawBirthdayRecord.data[i].recordInfoList[j]?.birthList?.length; k++) {
                        let brl = drawBirthdayRecord.data[i].recordInfoList[j].birthList[k];
                        if (brl.type === 7) {
                            this.prizeName = drawBirthdayRecord.data[i].recordInfoList[j].birthList[k].name;
                            this.addressId = drawBirthdayRecord.data[i].recordInfoList[j].birthList[k].addressId;
                            await this.saveAddress();
                        }
                    }
                    for (let k = 0; k < drawBirthdayRecord.data[i].recordInfoList[j]?.levelList?.length; k++) {
                        let brl = drawBirthdayRecord.data[i].recordInfoList[j].levelList[k];
                        if (brl.type === 7) {
                            this.prizeName = drawBirthdayRecord.data[i].recordInfoList[j].levelList[k].name;
                            this.addressId = drawBirthdayRecord.data[i].recordInfoList[j].levelList[k].addressId;
                            await this.saveAddress();
                        }
                    }
                }
            }
            return;
        }
        let draw;
        if ($.activityType === 103) {
            let birthInfo = await this.api("mc/wxMcLevelAndBirthGifts/getBirthInfo", `venderId=${$.venderId}&pin=${this.Pin}`);
            if (!birthInfo.result) {
                this.log("去填生日");
                for (let i = 0; i < 5; i++) {
                    var newVar = await this.api(
                        "mc/wxMcLevelAndBirthGifts/saveBirthDay",
                        `venderId=${$.venderId}&pin=${this.Pin}&birthDay=${$.now("yyyy-MM-dd")}`
                    );
                    if (!newVar.result) {
                        await $.wait(1000, 2000);
                    } else {
                        break;
                    }
                }
                level = 1;
            }
            await this.wait(2000, 4000);
            draw = await this.api(
                "mc/wxMcLevelAndBirthGifts/sendBirthGifts",
                `venderId=${$.venderId}&activityId=${$.activityId}&pin=${this.Pin}&level=${level}`
            );
            for (let i = 0; i < draw.data.birthdayData.length; i++) {
                if (draw.data.birthdayData[i].type === 7) {
                    this.addressId = draw.data.birthdayData[i].addressId;
                    this.prizeName = draw.data.birthdayData[i].name;
                    await this.saveAddress();
                }
            }
        } else {
            draw = await this.api(
                `mc/wxMcLevelAndBirthGifts/sendLevelGifts`,
                `venderId=${$.venderId}&activityId=${$.activityId}&pin=${this.Pin}&level=${level}`
            );
            try {
                for (let i = 0; i < draw.data.levelData.length; i++) {
                    if (draw.data.levelData[i].type === 7) {
                        this.addressId = draw.data.levelData[i].addressId;
                        this.prizeName = draw.data.levelData[i].name;
                        await this.saveAddress();
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
        if (draw.result) {
            this.putMsg("领取成功");
        } else {
            this.putMsg(draw.errorMessage || draw.data?.levelError || draw.data?.birthdayError || "未知");
        }
    }
}
$.after = async function () {
    try {
        for (let e of $.prizeList || []) {
            $.msg.push(`    等级:${e.drawLevel || "未知"},${[17].includes(e.type) ? e.discount : e.realvalue || e.value} ${e.name}`);
        }
    } catch (e) {
        this.log(e);
    }
    $.msg.push(`export M_WX_LEVEL_BIRTH_URL="${$.activityUrl}"`);
};
$.start(Task);
