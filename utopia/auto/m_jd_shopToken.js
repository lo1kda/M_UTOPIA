let mode = __dirname.includes("Work");
const { Env } = require("../utopia");
const $ = new Env("M店铺签到");
$.shopToken = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_TOKEN_SHOP_SIGN);
$.concNum = 1;
if (mode) {
    $.maxCookie = 5;
}
const types = { 1: "券", 4: "豆", 6: "分", 10: "E卡" };
class Task extends Env {
    constructor() {
        super();
    }
    async exec() {
        if (!$.data) {
            let data = await this.api(
                `https://api.m.jd.com/api`,
                {
                    appId: "4da33",
                    functionId: "interact_center_shopSign_getActivityInfo",
                    appid: "interCenter_shopSign",
                    clientVersion: "12.2.0",
                    client: "ios",
                    body: { token: $.shopToken, venderId: "" },
                    version: "4.3",
                    ua: this.UA,
                    t: true,
                },
                { h5st: "?", ciphers: true, proxy: true }
            );
            this.log(JSON.stringify(data));
            if (data?.msg?.includes("当前不存在有效的活动")) {
                this.putMsg("无效活动");
                $.exit = true;
                return;
            }
            $.data = data;
            $.concNum = $.masterNum;
        }
        $.venderId = $.data.data.venderId;
        $.id = $.data.data.id;
        let re = await this.api(
            "https://api.m.jd.com/api",
            {
                appId: "4da33",
                functionId: "interact_center_shopSign_signCollectGift",
                appid: "interCenter_shopSign",
                clientVersion: "12.2.0",
                client: "ios",
                body: {
                    token: $.shopToken,
                    venderId: $.venderId,
                    activityId: $.id,
                    type: 56,
                    actionType: 7,
                },
                version: "4.3",
                ua: this.UA,
                t: true,
            },
            { h5st: "?" }
        );
        this.log(re.success ? "签到成功" : re.msg);
        for (let e of re?.data || []) {
            for (let ele of e.prizeList) {
                this.putMsg(ele.discount + types[ele.type]);
            }
        }
    }
}
$.start(Task);
