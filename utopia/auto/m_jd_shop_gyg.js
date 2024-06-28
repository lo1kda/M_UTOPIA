let mode = __dirname.includes("Work");
const { Env, getValue } = require("../utopia");
const $ = new Env("M店铺刮奖");
$.gygShopArgv = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_GYG_SHOP_ARGV);
if (mode) {
    $.gygShopArgv = "https://shop.m.jd.com/shop/lottery?shopId=11880198&venderId=12174141";
    $.gygShopArgv = "https://pages.jd.com/shop/lottery?shopId=11880198&venderId=12174141";
    $.gygShopArgv = "https://wq.jd.com/mshop/shopdraw?shopId=11880198";
    $.gygShopArgv = "https://shop.m.jd.com/shop/lottery?shopId=1000356549&venderId=1000356549";
    $.gygShopArgv = "12382245_12785186";
    $.maxCookie = 20;
}
let signInfoSignMap = new Map();
$.version = "v1.0.0";
console.log($.gygShopArgv);
$.enableRunCache = false;
class Task extends Env {
    constructor(data) {
        super();
    }
    async exec() {
        if (!$.superVersion) {
            throw new Error("请更新脚本");
        }
        let isgotShopHomeActivityInfo = false;
        let actInfo;
        if (!$.shopId || !$.venderId) {
            if ($.gygShopArgv.startsWith("http")) {
                $.shopId = this.getQueryString($.gygShopArgv, "shopId") || "";
                $.venderId = this.getQueryString($.gygShopArgv, "venderId") || "";
            } else {
                let argv = $.gygShopArgv.split("_");
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
                    $.exit = true;
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
        }
        if (!$.venderId) {
            this.log(`无效的参数`);
            return;
        }
        let signInfo = await this.mySign();
        if (signInfo?.code === "0") {
            if (signInfo?.result?.isSign === 2) {
                this.log("已刮过奖");
            } else if (signInfo?.result?.isSign === 1) {
                if (signInfo?.result.isWin) {
                    this.putMsg(signInfo.result?.signReward?.name);
                } else {
                    this.log("未中奖");
                }
            } else {
            }
        } else {
        }
    }
    async mySign() {
        let sb = {
            vendorId: $.venderId,
            sourceRpc: "shop_app_sign_home",
        };
        let newVar = signInfoSignMap.get($.venderId);
        if (!newVar) {
            newVar = await this.sign("sign", sb);
            signInfoSignMap.set($.venderId, newVar);
        }
        let headers = {
            "J-E-H": "",
            Connection: "keep-alive",
            "Accept-Encoding": "gzip, deflate, br",
            "Content-Type": "application/x-www-form-urlencoded",
            Host: "api.m.jd.com",
            Referer: "",
            "J-E-C": "",
            "Accept-Language": "zh-Hans-CN;q=1, en-CN;q=0.9",
            Accept: "*/*",
            "User-Agent": "JD4iPhone/167841 (iPhone; iOS; Scale/3.00)",
        };
        headers["Cookie"] = this.cookie;
        let url = `https://api.m.jd.com/client.action?functionId=` + newVar.fn;
        return await this.api(url, newVar.sign, headers);
    }
}
let kv = { jd: "京豆", jf: "积分", dq: "q券" };
$.after = async function () {
    $.msg.push(`export M_GYG_SHOP_ARGV="${$.gygShopArgv}"`);
};
$.start(Task);
