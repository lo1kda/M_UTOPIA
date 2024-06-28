let mode = __dirname.includes("magic");
let testMode = process.env.M_TEST_MODE?.includes("on") ? true : mode;
let wxProxyEnable = parseInt(process.env.M_WX_PROXY_ENABLE || "2");
let wxProxySmart = parseInt(process.env.M_WX_PROXY_SMART || "2");
let reRouterEnable = parseInt(process.env.M_RE_ROUTER_ENABLE || "2");
let reRouterMsg = process.env.M_RE_ROUTER_MSG || "重拨";
let openCardMode = process.env.M_OPEN_CARD_MODE || "wh5";
let proxyRegx = process.env.M_WX_PROXY_ENABLE_REGEXP
    ? process.env.M_WX_PROXY_ENABLE_REGEXP
    : "(Request failed with status code 504)|(Request failed with status code 403)|disconnected|(Request failed with status code 493)|certificate|timeout|ECONNREFUSED|ETIMEDOUT|(tunneling socket could not be established)";
let reTryRegx = "(哎呀活动火爆，请稍后再试|活动太火爆了|服务器数据忙|奖品与您擦肩而过了哟)";
let tokenCacheMin = parseInt(process.env?.M_WX_TOKEN_CACHE_MIN || 5);
let tokenCacheMax = parseInt(process.env?.M_WX_TOKEN_CACHE_MAX || 10);
let enableCacheToken = parseInt(process.env?.M_WX_ENABLE_CACHE_TOKEN || 1);
let enableCacheTokenTip = parseInt(process.env?.M_WX_ENABLE_CACHE_TOKEN_TIP || 2);
let isvObfuscatorRetry = parseInt(process.env?.M_WX_ISVOBFUSCATOR_RETRY || 2);
let isvObfuscatorRetryWait = parseInt(process.env?.M_WX_ISVOBFUSCATOR_RETRY_WAIT || 2);
let isvObfuscatorCacheType = parseInt(process.env?.M_WX_ISVOBFUSCATOR_CACHE_TYPE || 1);
let signMode = process.env.M_SIGN_MODE ? process.env.M_SIGN_MODE : "local";
let apiToken = process.env.M_API_TOKEN ? process.env.M_API_TOKEN : "";
let apiSignUrl = process.env.M_API_SIGN_URL ? process.env.M_API_SIGN_URL : "http://api.nolanstore.cc/sign";
let wskeyFile = process.env.M_WSKEY_FILE ? process.env.M_WSKEY_FILE : mode ? "/home/magic/Work/wools/doc/config.sh" : "";
let blackPinConfig = {
    "cjhy-isv.isvjcloud.com": process.env.M_WX_CJ_BLACK_COOKIE_PIN ? process.env.M_WX_CJ_BLACK_COOKIE_PIN : "",
    "cjhydz-isv.isvjcloud.com": process.env.M_WX_CJ_BLACK_COOKIE_PIN ? process.env.M_WX_CJ_BLACK_COOKIE_PIN : "",
    "lzkj-isv.isvjcloud.com": process.env.M_WX_LZ_BLACK_COOKIE_PIN ? process.env.M_WX_LZ_BLACK_COOKIE_PIN : "",
    "lzkjdz-isv.isvjcloud.com": process.env.M_WX_LZ_BLACK_COOKIE_PIN ? process.env.M_WX_LZ_BLACK_COOKIE_PIN : "",
    "*": process.env.M_WX_BLACK_COOKIE_PIN ? process.env.M_WX_BLACK_COOKIE_PIN : "",
};
let stopKeywords = [
    "来晚了",
    "已发完",
    "参数缺失或无效",
    "超出活动计划时间",
    "奖品发送失败",
    "发放完",
    "全部被领取",
    "余额不足",
    "已结束",
    "活动已经结束",
    "未开始",
];
process.env.M_WX_STOP_KEYWORD ? process.env.M_WX_STOP_KEYWORD.split(/[@,&|]/).forEach((item) => stopKeywords.push(item)) : "";
let M_WX_ADDRESS_MODE = process.env?.M_WX_ADDRESS_MODE || "RANDOM";
let M_WX_ADDRESS_RANGE = process.env?.M_WX_ADDRESS_RANGE || "1-9999";
let M_WX_ADDRESS_MODE_LOWER = parseInt(process.env?.M_WX_ADDRESS_MODE_LOWER || 0);
let M_WX_ADDRESS_LOG = parseInt(process.env?.M_WX_ADDRESS_LOG || 0);
let addressStopKeywords = ["京豆", "红包", "券", "再来一次", "客服"];
let addressStopKeywordsRule = ["下单满", "签收后", "收到货后", "成功购买任意", "必须购买店铺内"];
process.env.M_WX_ADDRESS_STOP_KEYWORD ? process.env.M_WX_ADDRESS_STOP_KEYWORD.split(/[@,&|]/).forEach((item) => addressStopKeywords.push(item)) : "";
process.env.M_WX_ADDRESS_STOP_KEYWORD_RULE
    ? process.env.M_WX_ADDRESS_STOP_KEYWORD_RULE.split(/[@,&|]/).forEach((item) => addressStopKeywordsRule.push(item))
    : "";
let wxWhitelist = [];
process.env.M_WX_WHITELIST
    ? process.env.M_WX_WHITELIST.split(/[@,&|]/).forEach((item) => wxWhitelist.push(item.includes("-") ? item : item * 1))
    : [];
let wxWhitelistNotSupportFile = ["Invite", "invite", "collectCard", "unPackDraw", "team", "microDz", "share", "opencard"];
process.env.M_WX_WHITELIST_NOT_SUPPORT_FILE
    ? process.env.M_WX_WHITELIST_NOT_SUPPORT_FILE.split(/[@,&|]/).forEach((item) => wxWhitelistNotSupportFile.push(item))
    : "";
let blockPinRegx = process.env.M_WX_BLOCK_PIN_REGX || "";
let openCardTypes = ["10033", "10043", "10052", "10068"];
process.env.M_WX_OPEN_CARD_TYPES ? process.env.M_WX_OPEN_CARD_TYPES.split(/[@,&|]/).forEach((item) => openCardTypes.push(item)) : "";
let masterNum = parseInt(process.env.M_WX_LEADER_NUM || "9999");
const notInitPinTokenRegex = /(lorealjdcampaign-rc.isvjcloud.com|interaction\/v1)/;
const urlPrefixes = {
    "/prod/cc/interactsaas": /interactsaas/,
    "/crm-proya/apps/interact": /crm-proya/,
    "/apps/interact": /lorealjdcampaign-rc.isvjcloud.com\/prod\/cc/,
    "prod/cc/cjwx": /lorealjdcampaign-rc.isvjcloud.com\/prod\/cc\/cjwx/,
    "/apps/interact": /lorealjdcampaign-rc.isvjcloud.com\/interact/,
    "/prod/cc/interaction/v1": /interaction/,
};
let hdbTypes = ["hdb-isv.isvjcloud.com", "jingyun-rc.isvjcloud.com"];
let jinggengTypes = ["jinggeng-isv.isvjcloud.com", "jinggeng-rc.isvjcloud.com"];
let jinggengcjTypes = ["jinggengjcq-isv.isvjcloud.com", "mpdz-act-dz.isvjcloud.com"];
let keywords = [
    "pps",
    "utm_campaign",
    "utm_term",
    "utm_source",
    "utm_medium",
    "teamId",
    "mpin",
    "shareUuid",
    "signUuid",
    "inviterNick",
    "inviter",
    "InviteUuid",
    "inviterNickName",
    "sharer",
    "inviterImg",
    "nickName",
    "nick",
    "friendUuid",
    "helpUuid",
    "shareuserid4minipg",
    "bizExtString",
    "invitePin",
    "pps",
    "cookie",
    "friendid",
    "bizExtString",
    "bizExtString",
    "koikey",
    "pps",
    "inviter_id",
    "invitePin",
    "portrait",
    "sid",
    "shareUserId",
    "_ts",
    "pps",
    "pps",
    "pps",
    "DEBUG",
    "shareOpenId",
    "jxsid",
    "ad_od",
    "token",
    "pps",
    "encryptOpenId",
    "gx",
    "gxd",
    "accessToken",
];
let _currentTime = Date.now();
let proxies = [];
for (let i = 0; i < 20; i++) {
    try {
        if (!process.env[`M_WX_PROXY_URL${i || ""}`]) {
            continue;
        }
        proxies.push({
            index: i + 1,
            url: process.env[`M_WX_PROXY_URL${i || ""}`],
            close: process.env[`M_WX_PROXY_CLOSE${i || ""}`] || "",
            type: parseInt(process.env[`M_WX_PROXY_TYPE${i || ""}`] || 1),
        });
    } catch (e) {
        console.log("读取代理配置 出错", e);
    }
}
const version = "v3.7.1";
const axios = require("axios");
const fs = require("fs");
const tunnel = require("tunnel");
const { format } = require("date-fns");
const cheerio = require("cheerio");
const notify = require("./sendNotify");
let jdCookieNode = require("./jdCookie.js");
const CryptoJS = require("crypto-js");
let base64 = require("base-64");
try {
    base64 = require("base-64");
} catch (e) {
    console.log("请安装base-64依赖");
}
let NodeRSA;
try {
    NodeRSA = require("node-rsa");
} catch (e) {
    console.log("请安装node-rsa依赖");
}
const h5sts = require("./h5sts.js");
const H5st = require("./getH5st.js");
let cookies = [];
let redis;
if (isvObfuscatorCacheType === 2) {
    const Redis = require("ioredis");
    const redisUrl = process.env.M_REDIS_URL || "redis://:.T]x;M!()G^-0ckrBPoWCNln3@@172.17.0.1:6379/0";
    redis = new Redis(redisUrl, { keyPrefix: "magic:" });
}
if (Object.keys(jdCookieNode).length > 0) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookies.push(jdCookieNode[item]);
    });
}
const JDAPP_USER_AGENTS = [
    `jdapp;android;10.0.2;9;${uuid()};network/wifi;Mozilla/5.0 (Linux; Android 9; MHA-AL00 Build/HUAWEIMHA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36`,
    `jdapp;android;10.0.2;9;${uuid()};network/wifi;Mozilla/5.0 (Linux; Android 9; MI 6 Build/PKQ1.190118.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36`,
    `jdapp;android;10.0.2;9;${uuid()};network/4g;Mozilla/5.0 (Linux; Android 9; Mi Note 3 Build/PKQ1.181007.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045131 Mobile Safari/537.36`,
    `jdapp;android;10.0.2;9;${uuid()};network/wifi;Mozilla/5.0 (Linux; Android 9; 16T Build/PKQ1.190616.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36`,
    `jdapp;android;10.0.2;10;${uuid()};network/wifi;Mozilla/5.0 (Linux; Android 10; ONEPLUS A5010 Build/QKQ1.191014.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36`,
    `jdapp;android;10.0.2;10;${uuid()};network/wifi;Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36`,
    `jdapp;android;10.0.2;10;${uuid()};network/wifi;Mozilla/5.0 (Linux; Android 10; ONEPLUS A6000 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045224 Mobile Safari/537.36`,
    `jdapp;android;10.0.2;10;${uuid()};network/wifi;Mozilla/5.0 (Linux; Android 10; GM1910 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36`,
    `jdapp;android;10.0.2;10;${uuid()};network/wifi;Mozilla/5.0 (Linux; Android 10; LYA-AL00 Build/HUAWEILYA-AL00L; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36`,
    `jdapp;android;10.0.2;10;${uuid()};network/wifi;Mozilla/5.0 (Linux; Android 10; Redmi K20 Pro Premium Edition Build/QKQ1.190825.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36`,
    `jdapp;android;10.0.2;11;${uuid()};network/wifi;Mozilla/5.0 (Linux; Android 11; Redmi K20 Pro Premium Edition Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045513 Mobile Safari/537.36`,
    `jdapp;android;10.0.2;10;${uuid()};network/wifi;Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36`,
    `jdapp;android;10.0.2;11;${uuid()};network/wifi;Mozilla/5.0 (Linux; Android 11; Redmi K30 5G Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045511 Mobile Safari/537.36`,
    `jdapp;iPhone;10.0.2;14.2;${uuid()};network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    `jdapp;iPhone;10.0.2;14.3;${uuid()};network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    `jdapp;iPhone;10.0.2;14.2;${uuid()};network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    `jdapp;iPhone;10.0.2;11.4;${uuid()};network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F79`,
    `jdapp;android;10.0.2;10;;${uuid()};network/wifi;Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36`,
    `jdapp;iPhone;10.0.2;14.3;${uuid()};network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    `jdapp;iPhone;10.0.2;13.6;${uuid()};network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    `jdapp;iPhone;10.0.2;13.6;${uuid()};network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    `jdapp;iPhone;10.0.2;13.5;${uuid()};network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    `jdapp;iPhone;10.0.2;14.1;${uuid()};network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    `jdapp;iPhone;10.0.2;13.3;${uuid()};network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    `jdapp;iPhone;10.0.2;13.7;${uuid()};network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    `jdapp;iPhone;10.0.2;14.1;${uuid()};network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    `jdapp;iPhone;10.0.2;13.3;${uuid()};network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    `jdapp;iPhone;10.0.2;13.4;${uuid()};network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    `jdapp;iPhone;10.0.2;14.3;${uuid()};network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    `jdapp;iPhone;10.0.2;14.3;${uuid()};network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    `jdapp;iPhone;10.0.2;14.3;${uuid()};network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    `jdapp;iPhone;10.0.2;14.1;${uuid()};network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    `jdapp;android;10.0.2;8.1.0;${uuid()};network/wifi;Mozilla/5.0 (Linux; Android 8.1.0; 16 X Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36`,
    `jdapp;android;10.0.2;8.0.0;${uuid()};network/wifi;Mozilla/5.0 (Linux; Android 8.0.0; HTC U-3w Build/OPR6.170623.013; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36`,
    `jdapp;iPhone;10.0.2;14.0.1;${uuid()};network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
    `jdapp;android;10.0.2;8.1.0;${uuid()};network/wifi;Mozilla/5.0 (Linux; Android 8.1.0; MI 8 Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045131 Mobile Safari/537.36`,
];
const $ = axios.create({ timeout: 20000 });
$.defaults.headers["Accept"] = "*/*";
$.defaults.headers["Connection"] = "keep-alive";
$.defaults.headers["Accept-Language"] = "zh-CN,zh-Hans;q=0.9";
$.defaults.headers["Accept-Encoding"] = "gzip, deflate, br";
$.defaults.retry = 2;
$.defaults.retryDelay = 2000;
let resetRouterTimeInterval = process.env.M_WX_RESET_ROUTER_TIME_INTERVAL ? process.env.M_WX_RESET_ROUTER_TIME_INTERVAL * 1 : 60;
let status493 = false;
function uuid(x = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx") {
    return x.replace(/[xy]/g, function (x) {
        const r = (16 * Math.random()) | 0,
            n = "x" === x ? r : (3 & r) | 8;
        return n.toString(36);
    });
}
class Env {
    constructor(name) {
        this.name = name;
        this.username = "";
        this.cookie = "";
        this.wskey = "";
        this.wskeys = new Map();
        this.originCookies = cookies;
        this.cookies = cookies;
        this.index = "";
        this.ext = [];
        this.msg = [];
        this.delimiter = "";
        this.filename = "";
        this.ticket = "";
        this.appId = "";
        this.algo = {};
        this.bot = false;
        this.openCount = 0;
        this.expire = false;
        this.breakBefore = false;
        this.skipNum = 0;
        this.accounts = {};
        this.accountAddressList = [];
        this.domain = "";
        this.activityUrl = "";
        this.activityId = "";
        this.activityType = "";
        this.tickets = new Map();
        this.addressIndex = 1;
        this.shopName = "";
        this.needOpenCard = false;
        this.urlPrefix = "";
        this.proxyEnable = false;
        this.superVersion = version;
        this.version = "";
        this.shopName = "";
        this.venderId = "";
        this.shopId = "";
        this.ownerUuid = "";
        this.exit = true;
        this.rule = "";
        this.masterNum = masterNum;
        this.prizeList = [];
        this.hdbTypes = hdbTypes;
        this.jinggengcjTypes = jinggengcjTypes;
        this.jinggengTypes = jinggengTypes;
        this.defenseUrls = [];
        this.runAll = false;
        this.currAddrUsername = "";
    }
    async run(
        data = {
            wait: [1000, 2000],
            bot: false,
            delimiter: "",
            o2o: false,
            random: false,
            once: false,
            wskey: false,
            mod: 1,
            multCenter: false,
            blacklist: [],
            whitelist: [],
        }
    ) {
        try {
            Promise.resolve().then(() => this.forceQuit());
            this.filename = process.argv[1];
            console.log(`${this.now()} ${this.name} ${this.filename} 开始运行...`);
            console.log(`TG频道:https://t.me/Wall_E_Group`);
            console.log(`当前token:"${this.desensitizeString(apiToken)}"`);
            console.log(`sign地址:${this.desensitizeString(apiSignUrl)}`);
            if (this.activityUrl && !this.version) {
                throw new Error("请更新代码");
            }
            console.log(`当前版本:${this.version || "v1.0.0"},依赖版本:${this.superVersion || "v1.0.0"}`);
            if (process.env.M_SYS_INFO === "1") {
                console.log(`-----------------系统参数-----------------`);
                for (let envKey in process.env) {
                    if (!envKey.startsWith("M_") || envKey.includes("URL") || envKey.includes("TOKEN") || envKey.includes("ARGV")) {
                        continue;
                    }
                    console.log(`${envKey}="${process.env[envKey]}"`);
                }
                console.log(`-----------------系统参数-----------------`);
            }
            this.__start = this.timestamp();
            let accounts = "";
            try {
                if (mode) {
                    accounts = this.readFileSync("/home/magic/Work/wools/doc/account.json");
                } else {
                    if (fs.existsSync("utils/account.json")) {
                        accounts = this.readFileSync("utils/account.json");
                    } else if (fs.existsSync("/jd/config/account.json")) {
                        accounts = this.readFileSync("/jd/config/account.json");
                    } else {
                        accounts = this.readFileSync("account.json");
                    }
                }
                if (accounts) {
                    JSON.parse(accounts).forEach((o) => {
                        this.accounts[o.pt_pin] = o;
                        if (o?.address) {
                            this.accountAddressList.push(o?.address);
                        }
                    });
                }
            } catch (e) {
                console.log("account.json读取异常", e);
                this.msg.push("account.json读取异常");
            }
            await this.config();
            if (data?.delimiter) {
                this.delimiter = data?.delimiter;
            }
            if (data?.bot) {
                this.bot = data.bot;
            }
            console.log("原始ck长度", cookies.length);
            if (data?.blacklist?.length > 0) {
                for (const cki of this.__as(data.blacklist)) {
                    delete cookies[cki - 1];
                }
            }
            this.buildActInfo();
            console.log("排除黑名单后ck长度", cookies.length);
            if (
                wxWhitelist.length > 0 &&
                wxWhitelistNotSupportFile.filter((o) => this.filename.includes(o)).length === 0 &&
                this.filename.includes("_wx_")
            ) {
                console.log(`支持全局无线ck长度:${wxWhitelist}`);
                console.log(`支持全局无线ck长度:${wxWhitelistNotSupportFile}`);
                data.whitelist = wxWhitelist;
            }
            if (data?.whitelist?.length > 0) {
                let cks = [];
                for (const cki of this.__as(data.whitelist)) {
                    if (cki - 1 < cookies.length) {
                        cks.push(cookies[cki - 1]);
                    }
                }
                cookies = cks;
            }
            console.log("设置白名单后ck长度", cookies.length);
            this.delBlackCK();
            console.log("排除PIN黑名单后ck长度", cookies.length);
            if (fs.existsSync("./ck")) {
                for (let filename of fs.readdirSync("./ck")) {
                    if (filename.includes(".txt")) {
                        let cklist = fs.readFileSync("./ck/" + filename, "utf-8");
                        cklist = cklist.replace(/\r/g, "");
                        cklist = cklist.replace(/\n/g, "&");
                        let cksArr = cklist.split("&");
                        for (let k = 0; k < cksArr.length; k++) {
                            cookies.push(cksArr[k]);
                        }
                        console.log("读取" + filename + "后ck长度", cookies.length);
                    }
                }
            }
            if (data?.random) {
                cookies = this.randomArray(cookies);
            }
            if (data?.wskey) {
                try {
                    let lines = fs.existsSync(wskeyFile)
                        ? this.readFileSync(wskeyFile).split(
                              "\
"
                          )
                        : process.env?.JD_WSCK?.split("&") || [];
                    for (let line of lines) {
                        if (!line.endsWith(";")) {
                            line += ";";
                        }
                        if (line.startsWith("pin")) {
                            this.wskeys.set(line.match(/pin=([^; ]+)(?=;?)/)[1], line.match(/(pin=.*?;wskey=.*?;)/)[1]);
                        } else if (line.startsWith("wskey")) {
                            this.wskeys.set(line.match(/pin=([^; ]+)(?=;?)/)[1], line.match(/(pin=.*?;wskey=.*?;)/)[1]);
                        }
                    }
                    console.log(`当前wskey共计${this.wskeys.size}个`);
                } catch (e) {
                    console.log("wkeys读取异常", e);
                    this.msg.push("wkeys读取异常");
                }
            }
            if (wxProxySmart === 2 && !/(M店铺刮奖|M关注有礼)/.test(this.name)) {
                await this.routerProxy();
            }
            await this.verify();
            this.cookies = cookies;
            if (data?.before) {
                for (let i = 0; i < this.cookies.length; i++) {
                    if (!this.cookies[i]) {
                        continue;
                    }
                    if (this.breakBefore) {
                        break;
                    }
                    let cookie = this.cookies[i];
                    this.cookie = cookie;
                    let ptpin = cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1];
                    this.username = decodeURIComponent(ptpin);
                    this.wskey = this.wskeys.get(ptpin);
                    $.defaults.headers["Cookie"] = this.cookie;
                    this.index = i + 1;
                    try {
                        let ext = await this.before();
                        if (ext) {
                            this.ext.push(
                                Object.assign(
                                    {
                                        username: this.username,
                                        index: this.index,
                                        cookie: this.cookie,
                                    },
                                    ext
                                )
                            );
                        }
                    } catch (e) {
                        console.log(e);
                    }
                    if (data?.wait?.length > 0 && this.index !== cookies.length && !this.breakBefore) {
                        await this.wait(data?.wait[0], data?.wait[1]);
                    }
                }
            }
            let once = false;
            a: for (let i = 0; i < this.cookies.length; i++) {
                if (!this.cookies[i]) {
                    continue;
                }
                if (this.expire) {
                    break;
                }
                let cookie = this.cookies[i];
                this.cookie = cookie;
                let ptpin = cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1];
                this.username = decodeURIComponent(ptpin);
                this.index = i + 1;
                if (data?.once && this.index !== data.once) {
                    once = true;
                    continue;
                }
                if (this.skipNum > 0 && this.skipNum-- > 0) {
                    this.log(`跳过当前ck skipNum=${this.skipNum}`);
                    continue;
                }
                this.wskey = this.wskeys.get(ptpin);
                $.defaults.headers["Cookie"] = this.cookie;
                !data?.before ? this.ext.push({ username: this.username, index: this.index, cookie: this.cookie }) : "";
                if (!(this.activityUrl.includes("prod/cc") || this.activityUrl.includes("interact") || this.activityUrl.includes("crm-proya"))) {
                    this.index > 1 ? (this.appId === "wx" ? await this._algo() : "") : "";
                }
                status493 = false;
                for (let j = 0; j < 3; j++) {
                    try {
                        await this.logic();
                        if (data?.o2o && this.msg.length > 5) {
                            await this.send();
                            testMode
                                ? this.log(
                                      this.msg.join(
                                          "\
"
                                      )
                                  )
                                : "";
                            this.msg = [];
                        }
                        if (once) {
                            break a;
                        }
                        break;
                    } catch (e) {
                        this.log("捕获异常", e.message);
                        try {
                            if (this.isProxy(e?.message)) {
                                await this.routerProxy();
                                continue;
                            } else if (e?.response?.status === 493 || e?.message?.includes("493")) {
                                await this.router();
                                continue;
                            }
                            if (e?.response?.status === 403) {
                                this.msg.push("IP 403 403 403");
                                continue;
                            }
                            if (status493) {
                                this.msg.push("beta测试");
                                continue;
                            }
                            break;
                        } catch (e) {
                            this.log(e);
                        }
                    }
                }
                if (data?.wait?.length > 0 && this.index !== cookies.length && !this.expire) {
                    await this.wait(data?.wait[0], data?.wait[1]);
                }
            }
            try {
                if (this.msg.length > 0) {
                    this.msg.push("");
                }
                if (this.actName) {
                    this.msg.push(`活动名称:${this.actName}`);
                }
                if (this.shopName) {
                    this.msg.push(`#${this.shopName}`);
                }
                if (this.shopId && this.venderId && !this.shopName) {
                    this.msg.push(`#${await this.getShopName()}`);
                }
                if (this.shopId && this.venderId) {
                    this.msg.push(`店铺信息:${this.shopId}_${this.venderId}`);
                }
                if (this.actStartTime || this.actEndTime) {
                    if (this.actStartTime && !`${this.actStartTime}`.includes("-")) {
                        this.actStartTime = this.formatDate(this.actStartTime, "yyyy-MM-dd HH:mm:ss");
                    }
                    if (this.actEndTime && !`${this.actEndTime}`.includes("-")) {
                        this.actEndTime = this.formatDate(this.actEndTime, "yyyy-MM-dd HH:mm:ss");
                    }
                    this.msg.push(`活动时间:${this.actStartTime || ""}至${this.actEndTime || ""}`);
                }
                await this.after();
                if (this.shopId || this.userId || this.venderId) {
                    this.msg.push("");
                    this.msg.push(`https://shop.m.jd.com/shop/home?shopId=${this.shopId || this.userId || this.venderId || ""}`);
                }
            } catch (e) {
                this.log("after error" + e.message);
            }
            console.log(`${this.now()} ${this.name} 运行结束,耗时 ${this.timestamp() - this.__start}ms\
`);
            testMode && this.msg.length > 0
                ? console.log(
                      this.msg.join(
                          "\
"
                      )
                  )
                : "";
            if (!this.notSend && !data?.o2o) {
                await this.send();
            }
        } finally {
            if (isvObfuscatorCacheType === 2) {
                try {
                    await redis.quit();
                } catch (e) {}
            }
            process.exit(0);
        }
    }
    async forceQuit(t = 3) {
        if (process.env?.M_TIMEOUT_QUIT) {
            while ((Date.now() - _currentTime) / 1000 / 60 < t) {
                console.log(`进程监控中...`);
                await this.wait(30 * 1000);
            }
            this.log(`进程超时，强制退出`);
            if (isvObfuscatorCacheType === 2) {
                try {
                    await redis.quit();
                } catch (e) {}
            }
            process.exit(0);
        }
    }
    async config() {}
    isProxy(str = "493") {
        if (wxProxyEnable === 1 && this.index === 1) {
            return;
        }
        return this.isNeedRouter(str);
    }
    isNeedRouter(str) {
        const regex = new RegExp(proxyRegx);
        return regex.test(str) && (this.domain.includes("isvjcloud") || this.proxyEnable);
    }
    delBlackCK() {
        let strArrTemp = [];
        let blockPins = [];
        a: for (let i = 0; i < cookies.length; i++) {
            if (cookies[i]) {
                let cookie = cookies[i];
                let pt_pin = cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1];
                if (this.activityUrl.includes("isvjcloud") && blockPinRegx) {
                    for (let regxLine of blockPinRegx.split(";")) {
                        let pattern = regxLine.split("@");
                        let match = this.activityUrl.match(new RegExp(pattern[0]));
                        if (match && pattern[1].split("|").includes(pt_pin)) {
                            blockPins.push(pt_pin);
                            continue a;
                        }
                    }
                }
                if (blackPinConfig[this.domain]?.includes(pt_pin)) {
                    continue;
                }
                if (blackPinConfig["*"]?.includes(pt_pin)) {
                    continue;
                }
                strArrTemp.push(cookie);
            }
        }
        cookies = strArrTemp;
        if (blockPins.length > 0) {
            this.log("匹配到黑名单 " + blockPins.join("|"));
        }
    }
    me() {
        return this.ext[this.index - 1];
    }
    __as(es) {
        let b = [];
        for (let e of es) {
            if (typeof e !== "string") {
                b.push(e);
                continue;
            }
            for (let c of e.split(",")) {
                if (typeof c === "string") {
                    if (c.includes("-")) {
                        let start = c.split("-")[0] * 1;
                        let end = c.split("-")[1] * 1;
                        if (end - start === 1) {
                            b.push(start);
                            b.push(end);
                        } else {
                            for (let i = start; i <= end; i++) {
                                b.push(i);
                            }
                        }
                    } else {
                        b.push(c * 1);
                    }
                } else {
                    b.push(c);
                }
            }
        }
        return b;
    }
    deleteCookie() {
        delete this.cookies[this.index - 1];
        return {};
    }
    groupBy(arr, fn) {
        const data = {};
        arr.forEach(function (o) {
            const k = fn(o);
            data[k] = data[k] || [];
            data[k].push(o);
        });
        return data;
    }
    async send() {
        if (this.msg?.length > 0) {
            this.msg.push(`\
时间：${this.now()} 时长：${((this.timestamp() - this.__start) / 1000).toFixed(2)}s`);
            if (this.bot) {
                await notify.sendNotify("/" + this.name, this.msg.join(this.delimiter || ""));
            } else {
                await notify.sendNotify(
                    this.name,
                    this.msg.join(
                        "\
"
                    )
                );
            }
        }
    }
    async verify() {
        let fn = this.filename;
        function av(s) {
            return s.trim().match(/([a-z_])*$/)[0];
        }
        let x = "109M95O106F120V95B",
            y = "99M102F100O",
            z = "109H99V",
            j = "102N97I99D116T111G114A121B",
            k = "112C112U",
            l = "109N95G106B100K95U",
            m = "119V120M";
        let reg = /[A-Z]/;
        x.concat(y)
            .split(reg)
            .map((o) => +o)
            .filter((o) => o > 0)
            .forEach((o) => (y += String.fromCharCode(o)));
        x.concat(z)
            .split(reg)
            .map((o) => +o)
            .filter((o) => o > 0)
            .forEach((o) => (z += String.fromCharCode(o)));
        x.concat(j)
            .split(reg)
            .map((o) => +o)
            .filter((o) => o > 0)
            .forEach((o) => (j += String.fromCharCode(o)));
        x.concat(k)
            .split(reg)
            .map((o) => +o)
            .filter((o) => o > 0)
            .forEach((o) => (k += String.fromCharCode(o)));
        l.concat(m)
            .split(reg)
            .map((o) => +o)
            .filter((o) => o > 0)
            .forEach((o) => (m += String.fromCharCode(o)));
        this.appId = fn
            ? this.name.slice(0, 1) === String.fromCharCode(77)
                ? fn.includes(av(y))
                    ? "10032"
                    : fn.includes(av(z))
                    ? "10028"
                    : fn.includes(av(j))
                    ? "10001"
                    : fn.includes(av(k))
                    ? "10038"
                    : fn.includes(av(m))
                    ? "wx"
                    : ""
                : ""
            : "";
        this.appId ? (this.algo = await this._algo()) : "";
    }
    async wait(min, max) {
        if (min <= 0) {
            return;
        }
        if (max) {
            return new Promise((resolve) => setTimeout(resolve, this.random(min, max)));
        } else {
            return new Promise((resolve) => setTimeout(resolve, min));
        }
    }
    putMsg(msg) {
        _currentTime = Date.now();
        msg += "";
        this.log(msg);
        let r = [
            [" ", ""],
            ["优惠券", "券"],
            ["东券", "券"],
            ["元京东E卡", "元E卡"],
            ["店铺", ""],
            ["恭喜", ""],
            ["获得", ""],
        ];
        for (let ele of r) {
            msg = msg.replace(ele[0], ele[1]);
        }
        if (msg?.includes("期间下单")) {
            this.expire = true;
        }
        if (this.bot) {
            this.msg.push(msg);
        } else {
            let username = (this.accounts[this.username]?.remarks || this.username) + this.index;
            if (this.msg.length > 0 && this.msg.filter((o) => o.includes(username)).length > 0) {
                for (let i = 0; i < this.msg.length; i++) {
                    if (this.msg[i].includes(username)) {
                        this.msg[i] = this.msg[i].split(" ")[0] + "" + [this.msg[i].split(" ")[1], msg].join(",");
                        break;
                    }
                }
            } else {
                this.msg.push(`【${username}】${msg}`);
            }
        }
    }
    getRemarks(username) {
        return this.accounts[username]?.remarks || username;
    }
    md5(str) {
        return CryptoJS.MD5(str).toString();
    }
    hmacSHA256(param, key) {
        return CryptoJS.HmacSHA256(param, key).toString();
    }
    encryptCrypto(method, mode, padding, message, key, iv, messageEncode = "Utf8", toStringEncode = "Hex") {
        return CryptoJS[method]
            .encrypt(CryptoJS.enc[messageEncode].parse(message), CryptoJS.enc.Utf8.parse(key), {
                mode: CryptoJS.mode[mode],
                padding: CryptoJS.pad[padding],
                iv: CryptoJS.enc.Utf8.parse(iv),
            })
            .ciphertext.toString(CryptoJS.enc[toStringEncode]);
    }
    decryptCrypto(method, mode, padding, message, key, iv, messageEncode = "Base64", toStringEncode = "Utf8") {
        return CryptoJS[method]
            .decrypt({ ciphertext: CryptoJS.enc[messageEncode].parse(message) }, CryptoJS.enc.Utf8.parse(key), {
                mode: CryptoJS.mode[mode],
                padding: CryptoJS.pad[padding],
                iv: CryptoJS.enc.Utf8.parse(iv),
            })
            .toString(CryptoJS.enc[toStringEncode]);
    }
    rsaEncrypt(publicKey, opt, data) {
        publicKey = `-----BEGIN PUBLIC KEY-----\
${publicKey}\
-----END PUBLIC KEY-----`;
        let key = new NodeRSA(publicKey);
        key.setOptions(opt);
        return key.encrypt(data, "base64");
    }
    log(...msg) {
        _currentTime = Date.now();
        this.s
            ? console.log(...msg)
            : console.log(
                  `${this.now("HH:mm:ss.SSS")} cookie${this.index} ${this.accounts[this.username]?.remarks || this.desensitizeString(this.username)}`,
                  ...msg
              );
    }
    desensitizeString(str) {
        if (process.env?.M_LOG_DESENSITIZE) {
            return str || "";
        }
        if (!str) {
            return "";
        }
        if (str.length <= 4) {
            return str;
        }
        const processedStr = str;
        const prefix = processedStr.substring(0, 2);
        const suffix = processedStr.substring(processedStr.length - 2);
        const middleLength = Math.max(0, 8 - prefix.length - suffix.length);
        const middle = "*".repeat(middleLength);
        return (prefix + middle + suffix).padEnd(6, "*");
    }
    union(a, b) {
        return Array.from(new Set([...a.map((o) => o + ""), ...b.map((o) => o + "")]));
    }
    intersection(a, b) {
        const intersection1 = a.map((o) => o + "").filter((x) => b.map((o) => o + "").includes(x));
        const intersection2 = b.map((o) => o + "").filter((x) => a.map((o) => o + "").includes(x));
        return intersection1.concat(intersection2);
    }
    different(a, b) {
        const diff1 = a.map((o) => o + "").filter((x) => !b.map((o) => o + "").includes(x));
        const diff2 = b.map((o) => o + "").filter((x) => !a.map((o) => o + "").includes(x));
        return diff1.concat(diff2);
    }
    build(url) {
        if (url.match(/&callback=(jsonpCBK(.*))&/)) {
            let cb = url.match(/&callback=(jsonpCBK(.*))&/);
            url = url.replace(cb[1], this.randomCallback(cb[2].length || 0));
        }
        let stk = decodeURIComponent(this.getQueryString(url, "_stk") || "");
        if (stk) {
            let ens,
                hash,
                st = "",
                ts = this.now("yyyyMMddHHmmssSSS").toString(),
                tk = this.algo.tk,
                fp = this.algo.fp,
                em = this.algo.em;
            if (tk && fp && em) {
                hash = em(tk, fp, ts, this.appId, CryptoJS).toString(CryptoJS.enc.Hex);
            } else {
                const random = "5gkjB6SpmC9s";
                tk = "tk01wcdf61cb3a8nYUtHcmhSUFFCfddDPRvKvYaMjHkxo6Aj7dhzO+GXGFa9nPXfcgT+mULoF1b1YIS1ghvSlbwhE0Xc";
                fp = "9686767825751161";
                hash = CryptoJS.SHA512(`${tk}${fp}${ts}${this.appId}${random}`, tk).toString(CryptoJS.enc.Hex);
            }
            stk.split(",").map((item, index) => {
                st += `${item}:${this.getQueryString(url, item)}${index === stk.split(",").length - 1 ? "" : "&"}`;
            });
            ens = encodeURIComponent(
                [
                    "".concat(ts),
                    "".concat(fp),
                    "".concat(this.appId),
                    "".concat(tk),
                    "".concat(CryptoJS.HmacSHA256(st, hash.toString()).toString(CryptoJS.enc.Hex)),
                ].join(";")
            );
            if (url.match(/[?|&]h5st=(.*?)&/)) {
                url = url.replace(url.match(/[?|&]h5st=(.*?)&/)[1], "H5ST").replace(/H5ST/, ens);
            }
            let matchArr = [/[?|&]_time=(\d+)/, /[?|&]__t=(\d+)/, /[?|&]_ts=(\d+)/, /[?|&]_=(\d+)/, /[?|&]t=(\d+)/, /[?|&]_cfd_t=(\d+)/];
            for (let ms of matchArr) {
                if (url.match(ms)) {
                    url = url.replace(url.match(ms)[1], Date.now());
                }
            }
            let t = this._tk();
            if (url.match(/strPgUUNum=(.*?)&/)) {
                url = url.replace(url.match(/strPgUUNum=(.*?)&/)[1], t.tk);
                if (url.match(/strPhoneID=(.*?)&/)) {
                    url = url.replace(url.match(/strPhoneID=(.*?)&/)[1], t.id);
                }
                if (url.match(/strPgtimestamp=(.*?)&/)) {
                    url = url.replace(url.match(/strPgtimestamp=(.*?)&/)[1], t.ts);
                }
            }
            if (url.match(/jxmc_jstoken=(.*?)&/)) {
                url = url.replace(url.match(/jxmc_jstoken=(.*?)&/)[1], t.tk);
                if (url.match(/phoneid=(.*?)&/)) {
                    url = url.replace(url.match(/phoneid=(.*?)&/)[1], t.id);
                }
                if (url.match(/timestamp=(.*?)&/)) {
                    url = url.replace(url.match(/timestamp=(.*?)&/)[1], t.ts);
                }
            }
        }
        return url;
    }
    getQueryString(url, name) {
        let reg = new RegExp("(^|[&?])" + name + "=([^&]*)(&|$)");
        let r = url.match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return "";
    }
    unique(arr) {
        return Array.from(new Set(arr));
    }
    async logic() {
        console.log("default logic");
    }
    async before() {
        return -1;
    }
    async after() {
        return -1;
    }
    tryLock(username, key) {
        try {
            fs.accessSync(`/jd/log/lock/${key}_${username}`);
            return false;
        } catch (e) {
            return true;
        }
    }
    setLock(username, key) {
        try {
            try {
                fs.accessSync(`/jd/log/lock`);
            } catch (e) {
                fs.mkdirSync(`/jd/log/lock`);
            }
            fs.mkdirSync(`/jd/log/lock/${key}_${username}`);
            return false;
        } catch (e) {
            return true;
        }
    }
    match(pattern, string) {
        pattern = pattern instanceof Array ? pattern : [pattern];
        for (let pat of pattern) {
            const match = pat.exec(string);
            if (match) {
                const len = match.length;
                if (len === 1) {
                    return match;
                } else if (len === 2) {
                    return match[1];
                } else {
                    const r = [];
                    for (let i = 1; i < len; i++) {
                        r.push(match[i]);
                    }
                    return r;
                }
            }
        }
        return "";
    }
    matchAll(pattern, string) {
        pattern = pattern instanceof Array ? pattern : [pattern];
        let match;
        let result = [];
        for (let p of pattern) {
            while ((match = p.exec(string)) != null) {
                let len = match.length;
                if (len === 1) {
                    result.push(match);
                } else if (len === 2) {
                    result.push(match[1]);
                } else {
                    let r = [];
                    for (let i = 1; i < len; i++) {
                        r.push(match[i]);
                    }
                    result.push(r);
                }
            }
        }
        return result;
    }
    async countdown(mode = 1, s = 200) {
        let d = new Date();
        if (
            (mode === 1 && d.getMinutes() < 50) ||
            (mode === 2 && d.getMinutes() < 25) ||
            (mode === 3 && d.getMinutes() < 10) ||
            (mode === 4 && d.getMinutes() < 5)
        ) {
            return;
        }
        let st = s;
        if (mode !== 9) {
            switch (mode) {
                case 1:
                    d.setHours(d.getHours() + 1);
                    d.setMinutes(0);
                    break;
                case 2:
                    d.setMinutes(30);
                    break;
                case 3:
                    d.setMinutes(15);
                    break;
                case 4:
                    d.setMinutes(10);
                    break;
                default:
                    console.log("不支持");
            }
            d.setSeconds(0);
            d.setMilliseconds(0);
            st = d.getTime() - Date.now() - s;
        }
        if (st > 0) {
            console.log(`需要等待时间${st / 1000} 秒`);
            await this.wait(st);
        }
    }
    readFileSync(path) {
        try {
            return fs.readFileSync(path).toString();
        } catch (e) {
            console.log(path, "文件不存在进行创建");
            this.writeFileSync(path, "");
            return "";
        }
    }
    writeFileSync(path, data) {
        fs.writeFileSync(path, data);
    }
    random(min, max) {
        return Math.min(Math.floor(min + Math.random() * (max - min)), max);
    }
    async taskToDo(activity) {
        if (activity.data.taskList.filter((o) => ![8, 15, 13].includes(o.taskType * 1)).length === 0) {
            this.log("没有任务");
        }
        let taskList = activity.data.taskList;
        for (let ele of taskList.filter((o) => o.status === 0 && (o.completeCount < o.finishNum || o.completeCount < o.maxNum)) || []) {
            try {
                /*
            关注店铺    1
            浏览店铺    2
            浏览商品    3
            浏览会场/直播    4
            关注商品    5
            预约商品    6
            加购任务    7
            购买商品    8
            分享商品    9
            分享店铺    10
            分享活动    12
            会员开卡    13
            每日签到    14
            邀请助力    15
            */
                if ([1, 2, 4, 10, 12, 14].includes(ele.taskType)) {
                    await this.api("/api/basic/task/toDo", { skuId: "", taskId: ele.taskId });
                } else if ([3, 5, 6, 7, 9].includes(ele.taskType)) {
                    let skuIds = ele.skuInfoVO.filter((o) => o.status === 0);
                    for (let i = 0; i < skuIds.length && (i < ele.finishNum || i < ele.maxNum); i++) {
                        await this.api("/api/basic/task/toDo", { skuId: skuIds[i].skuId, taskId: ele.taskId });
                    }
                }
            } catch (e) {
                this.log(e.message, JSON.stringify(ele));
            }
        }
    }
    async notify(text, desc) {
        return notify.sendNotify(text, desc);
    }
    async get(url, headers) {
        url = this.appId ? this.build(url) : url;
        return new Promise((resolve, reject) => {
            $.get(url, { headers: headers })
                .then((data) => resolve(this.handler(data) || data))
                .catch((e) => reject(e));
        });
    }
    async post(url, body, headers) {
        url = this.appId ? this.build(url) : url;
        return new Promise((resolve, reject) => {
            $.post(url, body, { headers: headers })
                .then((data) => resolve(this.handler(data) || data))
                .catch((e) => reject(e));
        });
    }
    async request(url, headers, body) {
        return new Promise((resolve, reject) => {
            let timeoutId = setTimeout(() => {
                console.log("超时异常进行重试");
                reject(new Error("Request timeout"));
            }, 50000);
            let __config = headers?.headers ? headers : { headers: headers };
            (body ? $.post(url, body, __config) : $.get(url, __config))
                .then((data) => {
                    clearTimeout(timeoutId);
                    this.__lt(data);
                    resolve(data);
                })
                .catch((e) => {
                    clearTimeout(timeoutId);
                    reject(e);
                });
        });
    }
    __lt(data) {
        let scs = data?.headers["set-cookie"] || data?.headers["Set-Cookie"] || [];
        let sc = typeof scs != "object" ? scs.split(",") : scs;
        for (let ck of sc) {
            let kv = ck.split(";")[0].trim().split("=");
            this.tickets.set(kv[0], kv[1]);
        }
        this.ticket = "";
        for (let [k, v] of this.tickets.entries()) {
            this.ticket += `${k}=${v};`;
        }
    }
    handler(res) {
        let data = res?.data || res?.body || res;
        if (!data) {
            return;
        }
        if (typeof data === "string") {
            if (data.startsWith("<") || data.startsWith("(function")) {
                return data;
            } else {
                data = data.replace(/[\n\r| ]/g, "");
                if (data.includes("try{jsonpCB")) {
                    data = data.replace(/try{jsonpCB.*\({/, "{").replace(/}\)([;])?}catch\(e\){}/, "}");
                } else if (data.includes("jsonpCB")) {
                    let st = data.replace(/[\n\r]/g, "").replace(/jsonpCB.*\({/, "{");
                    data = st.substring(0, st.length - 1);
                } else if (data.match(/try{.*\({/)) {
                    data = data.replace(/try{.*\({/, "{").replace(/}\)([;])?}catch\(e\){}/, "}");
                } else {
                    data = /.*?({.*}).*/g.exec(data)?.[1] || "{}";
                }
                return JSON.parse(data);
            }
        }
        return data;
    }
    randomNum(length) {
        length = length || 32;
        let t = "0123456789",
            a = t.length,
            n = "";
        for (let i = 0; i < length; i++) {
            n += t.charAt(Math.floor(Math.random() * a));
        }
        return n;
    }
    randomString(e) {
        return this.uuid();
    }
    randomPattern(pattern, charset = "abcdef0123456789") {
        let str = "";
        for (let chars of pattern) {
            if (chars == "x") {
                str += charset.charAt(Math.floor(Math.random() * charset.length));
            } else if (chars == "X") {
                str += charset.charAt(Math.floor(Math.random() * charset.length)).toUpperCase();
            } else {
                str += chars;
            }
        }
        return str;
    }
    randomCallback(e = 1) {
        let t = "abcdefghigklmnopqrstuvwsyz",
            a = t.length,
            n = "";
        for (let i = 0; i < e; i++) {
            n += t.charAt(Math.floor(Math.random() * a));
        }
        return "jsonpCBK" + n.toUpperCase();
    }
    randomArray(arr, count) {
        count = count || arr.length;
        let shuffled = arr.slice(0),
            i = arr.length,
            min = i - count,
            temp,
            index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    }
    now(fmt) {
        return format(Date.now(), fmt || "yyyy-MM-dd HH:mm:ss.SSS");
    }
    formatDate(date, fmt) {
        return format(typeof date === "object" ? date : new Date(typeof date === "string" ? date * 1 : date), fmt || "yyyy-MM-dd");
    }
    formatDateTime(date, fmt) {
        return format(typeof date === "object" ? date : new Date(typeof date === "string" ? date * 1 : date), fmt || "yyyy-MM-dd HH:mm:ss");
    }
    parseDate(date) {
        return new Date(Date.parse(date.replace(/-/g, "/")));
    }
    timestamp() {
        return new Date().getTime();
    }
    uuid(x = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx") {
        return x.replace(/[xy]/g, function (x) {
            const r = (16 * Math.random()) | 0,
                n = "x" === x ? r : (3 & r) | 8;
            return n.toString(36);
        });
    }
    async unfollow(shopId = this.shopId) {
        let headers = {
            authority: "api.m.jd.com",
            accept: "*/*",
            origin: "https://shop.m.jd.com",
            referer: "https://shop.m.jd.com/",
            "user-agent": this.UA,
            Cookie: this.cookie,
        };
        let body = { shopId: shopId, follow: false };
        let url = `https://api.m.jd.com/client.action?functionId=whx_followShop&appid=shop_m_jd_com&body=${encodeURIComponent(JSON.stringify(body))}`;
        let data = await this.get(url, headers);
        return data;
    }
    async getShopInfo(venderId = this.venderId, shopId = this.shopId) {
        try {
            if (openCardMode.includes("wh5")) {
                let headers = {
                    authority: "api.m.jd.com",
                    accept: "*/*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    origin: "https://shop.m.jd.com",
                    referer: "https://shop.m.jd.com/",
                    "user-agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.42",
                };
                let url = `https://api.m.jd.com/client.action?functionId=whx_getMShopOutlineInfo&appid=shop_view&clientVersion=11.0.0&client=wh5&body=${encodeURIComponent(
                    JSON.stringify({ shopId: shopId })
                )}`;
                let { status, data } = await this.request(url, headers);
                return data.data?.shopInfo;
            } else {
                let newVar = await this.sign("getShopHomeBaseInfo", {
                    source: "app-shop",
                    latWs: "0",
                    lngWs: "0",
                    displayWidth: "1098.000000",
                    sourceRpc: "shop_app_home_home",
                    lng: "0",
                    lat: "0",
                    venderId: venderId,
                    navigationAbTest: "1",
                });
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
                let url = `https://api.m.jd.com/client.action?functionId=` + newVar.fn;
                let { status, data } = await this.request(url, headers, newVar.sign);
                return data.result?.shopInfo;
            }
        } catch (e) {
            console.log(e);
            return {};
        }
    }
    async getShopBaseInfo(venderId = this.venderId, shopId = this.shopId) {
        let url = "";
        if (venderId) {
            url = `https://chat1.jd.com/api/checkChat?callback=jQuery7749929&venderId=${venderId}&_=${this.timestamp()}`;
        } else if (shopId) {
            url = `https://chat1.jd.com/api/checkChat?callback=jQuery7749929&shopId=${shopId}&_=${this.timestamp()}`;
        }
        let dddd = await this.request(url, {
            authority: "chat1.jd.com",
            Accept: "*/*",
            Connection: "keep-alive",
            Cookie: this.cookie,
            "User-Agent": this.ua(),
            "Accept-Language": "zh-cn",
            "Accept-Encoding": "gzip, deflate",
            referer: `https://mall.jd.com/shopBrandMember-${venderId || shopId}.html`,
        });
        const data = JSON.parse(dddd?.data?.replace(/^jQuery\d+\(/, "")?.replace(/\);$/, "") || "{}");
        return { shopId: data.shopId, venderId: data.venderId, shopName: data.seller };
    }
    async getShopName(venderId = this.venderId, shopId = this.shopId) {
        this.shopName = (await this.getShopBaseInfo())?.shopName;
        if (!this.shopName) {
            let newVar = await this.getShopInfo(venderId, shopId);
            this.shopName = newVar?.shopName;
        }
        return this.shopName || "未知";
    }
    async sendTGMsg(text) {
        await this.sendMessage(process.env.TG_USER_ID, text);
    }
    async sendMessage(chat_id = process.env.TG_USER_ID, text, count = 1, token = process.env.TG_BOT_TOKEN) {
        if (mode) {
            return;
        }
        let url = `https://api.telegram.org/bot${token}/sendMessage`;
        let body = {
            chat_id: chat_id,
            text: text,
            disable_web_page_preview: true,
        };
        let headers = {
            "Content-Type": "application/json",
            Cookie: "10089",
        };
        if (process.env.TG_PROXY_HOST && process.env.TG_PROXY_PORT) {
            $.defaults.proxy = false;
            $.defaults.httpsAgent = tunnel.httpsOverHttp({
                proxy: {
                    host: process.env.TG_PROXY_HOST,
                    port: process.env.TG_PROXY_PORT * 1,
                },
            });
        }
        let { data } = await this.request(url, headers, body);
        if (data?.description?.includes("long")) {
            await this.sendMessage(chat_id, text.substring(0, 300), ++count);
            return;
        }
        if (!data?.ok && count < 5) {
            $.log("重试中", text);
            await $.wait(1000, 2000);
            await this.sendMessage(chat_id, text, ++count);
        }
    }
    ua(type = "jd") {
        return JDAPP_USER_AGENTS[this.random(0, JDAPP_USER_AGENTS.length)];
    }
    async wxStop(err) {
        let flag = false;
        for (let e of stopKeywords) {
            if (e && err?.includes(e)) {
                flag = true;
                this.expire = true;
                break;
            }
        }
        return flag;
    }
    async wxAddressStop(err) {
        return err && err.match(new RegExp(`(${addressStopKeywords.join("|")})`)) != null;
    }
    async wxAddressStopRule(act = this.rule) {
        try {
            if (!act && this.urlPrefix) {
                let ruleData = await this.api("/api/active/getRule", {});
                if (ruleData?.resp_code === 0) {
                    act = ruleData?.data;
                }
            }
        } catch (e) {
            console.log(e);
        }
        return act && act.match(new RegExp(`(${addressStopKeywordsRule.join("|")})`)) != null;
    }
    _tk() {
        let id = (function (n) {
                let src = "abcdefghijklmnopqrstuvwxyz1234567890",
                    res = "";
                for (let i = 0; i < n; i++) {
                    res += src[Math.floor(src.length * Math.random())];
                }
                return res;
            })(40),
            ts = Date.now().toString(),
            tk = this.md5("" + decodeURIComponent(this.username) + ts + id + "tPOamqCuk9NLgVPAljUyIHcPRmKlVxDy");
        return { ts: ts, id: id, tk: tk };
    }
    async _algo(retries = 0) {
        if (this.appId === "wx") {
            this.tickets = new Map();
            let headers = {
                "Accept-Encoding": "gzip, deflate, br",
                Connection: "keep-alive",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "User-Agent":
                    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1",
                "Accept-Language": "zh-cn",
                Cookie: this.cookie,
            };
            try {
                if (this.domain.includes("lzkj") || this.domain.includes("lzdz") || this.domain.includes("cjhy")) {
                    await this.request(`https://${this.domain}/wxTeam/activity?activityId=${this.activityId}`, headers);
                } else {
                    await this.request(this.activityUrl, headers);
                }
            } catch (e) {
                if (retries < 3) {
                    if (this.isProxy(e.message)) {
                        await this.routerProxy(retries);
                        this.msg.push("493启用代理重试" + retries);
                        this.log(`493去重试，第${retries}次重试...`);
                    } else if (e.message?.includes("493")) {
                        await this.router();
                    }
                    return await this._algo(++retries);
                }
            }
            return "";
        } else {
            let fp = (function () {
                let e = "0123456789",
                    a = 13,
                    i = "";
                for (; a--; ) {
                    i += e[(Math.random() * e.length) | 0];
                }
                return (i + Date.now()).slice(0, 16);
            })();
            let data = await this.post(
                "https://cactus.jd.com/request_algo?g_ty=ajax",
                JSON.stringify({
                    version: "1.0",
                    fp: fp,
                    appId: this.appId,
                    timestamp: this.timestamp(),
                    platform: "web",
                    expandParams: "",
                }),
                {
                    Authority: "cactus.jd.com",
                    "User-Agent":
                        "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
                    "Content-Type": "application/json",
                    Origin: "https://st.jingxi.com",
                    Referer: "https://st.jingxi.com/",
                }
            );
            return {
                fp: fp.toString(),
                tk: data?.data?.result?.tk || data?.result?.tk,
                em: new Function(`return ${data?.data?.result?.algo || data?.result?.algo}`)(),
            };
        }
    }
    async routerProxy(count = 0) {
        if (wxProxyEnable === 1) {
            return;
        }
        if (!proxies.find((o) => !o.close)) {
            this.log("所有代理已关闭");
            this.expire = true;
            this.proxy = null;
            return;
        }
        this.proxy = proxies.filter((o) => !o.close)[0];
        this.log(`开始从M_WX_PROXY_URL${this.proxy.index - 1 || ""}获取代理`);
        let ok = await this.getProxyByUrl(this.proxy);
        if (!ok) {
            await this.routerProxy();
        }
    }
    async getProxyByUrl(proxy) {
        let strProxyUrl = proxy.url;
        var isgetProxy = false;
        try {
            $.defaults.proxy = false;
            $.defaults.httpsAgent = false;
            $.defaults.httpAgent = false;
            let http = await $.get(strProxyUrl);
            if (strProxyUrl.includes("=json")) {
                let strtemp = JSON.stringify(http.data);
                let httplist = http.data.data;
                if (http.data.data?.list) {
                    httplist = http.data.data.list;
                }
                if (httplist) {
                    if (httplist[0]?.port) {
                        isgetProxy = true;
                        this.log("获取到的IP:" + httplist[0].ip + ":" + httplist[0].port);
                        await this.setProxy(httplist[0].ip + ":" + httplist[0].port);
                    } else {
                        const regex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+|[a-zA-Z0-9.-]+:\d+)/;
                        const match = strtemp.match(regex);
                        if (match) {
                            this.log("获取到的IP:" + match[0]);
                            isgetProxy = true;
                            await this.setProxy(match[0]);
                        } else {
                            proxies.filter((o) => (o.index = proxy.index))[0].close = true;
                            this.log(JSON.stringify(strtemp));
                        }
                    }
                } else {
                    proxies.filter((o) => (o.index = proxy.index))[0].close = true;
                    this.log(JSON.stringify(strtemp));
                }
            } else {
                let strtemp = http.data
                    .toString()
                    .replace(
                        "\r\
",
                        ""
                    )
                    .replace(
                        "\
",
                        ""
                    );
                let pw = strtemp?.includes("@") ? strtemp.split("@")[0] : "";
                const regex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+|[a-zA-Z0-9.-]+:\d+)/;
                const match = strtemp.match(regex);
                if (match) {
                    this.log(`获取到的IP:${match[0]}`);
                    isgetProxy = true;
                    await this.setProxy(match[0], pw);
                } else {
                    proxies.filter((o) => (o.index = proxy.index))[0].close = true;
                    this.log(JSON.stringify(strtemp));
                }
            }
        } catch (e) {
            this.log(`M_WX_PROXY_URL${proxy.index - 1 || ""}代理获取异常，切换下一个`);
            proxies.filter((o) => (o.index = proxy.index))[0].close = true;
        }
        return isgetProxy;
    }
    async setProxy(ipPort, pw = "") {
        let p = ipPort.split(":");
        $.defaults.proxy = false;
        let proxyOptions = {
            host: p[0],
            port: p[1],
        };
        if (pw) {
            proxyOptions.proxyAuth = pw;
        }
        $.defaults.httpsAgent = tunnel.httpsOverHttp({
            proxy: proxyOptions,
        });
        $.defaults.httpAgent = tunnel.httpsOverHttp({
            proxy: proxyOptions,
        });
    }
    async router() {
        if (reRouterEnable === 1) {
            return;
        }
        if (!fs.existsSync(`magic.lock`)) {
            fs.writeFileSync("magic.lock", Date.now().toString());
        }
        let timestamp = fs.readFileSync("magic.lock").toString() * 1;
        if ((Date.now() - timestamp) / 1000 > resetRouterTimeInterval) {
            fs.writeFileSync("magic.lock", Date.now().toString());
            await notify.sendNotify("M自动重新拨号", this.filename);
            await notify.sendNotify(reRouterMsg, "");
            await this.wait(3 * 1000, 5 * 1000);
        }
    }
    async isvObfuscator(cache = enableCacheToken, retries = isvObfuscatorRetry, cookie = this.cookie, cacheType = isvObfuscatorCacheType) {
        let username = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1]);
        if (cache === 1) {
            this.log(`缓存获取 isvToken`);
            if (cacheType === 2) {
                let token = await this.rget(`isvObfuscator:${username}`);
                if (token) {
                    this.Token = token;
                    this.isvToken = token;
                    return { code: "0", token: token };
                }
            } else {
                if (!fs.existsSync("tokens")) {
                    fs.mkdirSync("tokens");
                }
                let tk = JSON.parse(this.readFileSync(`tokens/${username}.json`) || "{}");
                if (tk && tk.token && tk?.expireTime > this.timestamp()) {
                    this.Token = tk.token;
                    this.isvToken = tk.token;
                    return { code: "0", token: tk.token };
                }
            }
        }
        let body =
            "body=%7B%22url%22%3A%22https%3A%2F%2Fcjhy-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&uuid=b024526b380d35c9e3&client=apple&clientVersion=10.0.10&st=1646999134786&sv=111&sign=fd9417f9d8e872da6c55102bd69da99f";
        try {
            let newVar = await this.sign("isvObfuscator", { id: "", url: `https://${this.domain}` });
            if (newVar.sign) {
                body = newVar.sign;
            }
            let url = `https://api.m.jd.com/client.action?functionId=isvObfuscator`;
            let headers = {
                Accept: "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                Connection: "keep-alive",
                "Content-Type": "application/x-www-form-urlencoded",
                Host: "api.m.jd.com",
                Cookie: cookie,
                "User-Agent": "JD4iPhone/168069 (iPhone; iOS 13.7; Scale/3.00)",
            };
            this.log(`实时获取 isvToken`);
            let { data } = await this.request(url, headers, body);
            if (cache && data?.code === "0" && data.token) {
                if (cache) {
                    if (cacheType === 2) {
                        await this.rcache(`isvObfuscator:${username}`, data.token, this.random(tokenCacheMin, tokenCacheMax) * 60 * 1000);
                    } else {
                        let tk = {
                            expireTime: this.timestamp() + this.random(tokenCacheMin, tokenCacheMax) * 60 * 1000,
                            token: data.token,
                        };
                        this.writeFileSync(`tokens/${username}.json`, JSON.stringify(tk));
                    }
                }
            } else if (data?.code === "3" && data?.errcode === 264) {
                this.putMsg(`CK已失效`);
                throw new Error(`CK已失效`);
            }
            this.isvToken = data.token;
            this.Token = data.token;
            return data;
        } catch (e) {
            this.log(e.message);
            if (retries > 0 && this.isProxy(e.message)) {
                this.log(`第${isvObfuscatorRetry - retries}去重试isvObfuscator接口,等待${isvObfuscatorRetryWait}秒`);
                await this.routerProxy();
                return await this.isvObfuscator(cache, --retries);
            }
        }
        this.Token = "";
        throw new Error(`获取Token失败`);
        return { code: "1", token: "" };
    }
    async getSimpleActInfoVo(fn = "customer/getSimpleActInfoVo", body = 1) {
        if (this.venderId && this.shopId && this.activityType) {
            await this.initPinToken();
            return;
        }
        let actInfo = await this.api(fn, body === 1 ? `activityId=${this.activityId}` : body);
        if (!actInfo?.result || !actInfo?.data) {
            this.putMsg("手动确认");
            this.expire = true;
            throw new Error("活动已结束");
        }
        this.venderId = actInfo.data?.venderId || this.venderId;
        this.shopId = actInfo.data?.shopId || this.shopId;
        this.activityType = actInfo.data?.activityType || this.activityType;
        await this.initPinToken();
    }
    async initPinToken() {
        try {
            if (this.activityUrl.includes("activityType")) {
                if (!notInitPinTokenRegex.test(this.activityUrl)) {
                    if (this.defenseUrls && this.defenseUrls.length === 0) {
                        let defenseUrls = await this.api("api/user-info/getDefenseUrls", "");
                        this.defenseUrls = defenseUrls.data.map((o) => o.interfaceName);
                    }
                    await this.api(
                        `api/user-info/initPinToken?source=01&status=1&activityId=${this.activityId}&uuid=${this.uuid()}&jdToken=${
                            this.isvToken
                        }&shopId=${this.shopId}&clientTime=${Date.now()}&shareUserId=${this.shareUserId || ""}`,
                        ""
                    );
                }
            } else {
                if (this.defenseUrls && this.defenseUrls.length === 0) {
                    let defenseUrls = await this.api("customer/getDefenseUrls", "");
                    this.defenseUrls = defenseUrls.data;
                }
                await this.api(
                    `customer/initPinToken?source=01&status=1&activityId=${this.activityId}&uuid=${this.uuid()}&jdToken=${this.isvToken}&venderId=${
                        this.venderId
                    }&shopId=${this.shopId}&clientTime=${Date.now()}&shareUserId=${this.shareUserId || ""}`,
                    ""
                );
            }
        } catch (e) {
            console.log(e);
        }
    }
    async getMyPing(fn = "customer/getMyPing", count = 0) {
        try {
            let data = await this.api(fn, `userId=${this.venderId}&token=${this.Token}&pin=&fromType=APP&riskType=0`);
            this.Pin = "";
            if (!data.result) {
                if (data.errorMessage.includes("请联系商家")) {
                    this.expire = true;
                    this.putMsg("商家token过期");
                    throw new Error(data.errorMessage);
                }
                if (count < 3 && !data.errorMessage?.includes("活动太火爆")) {
                    this.putMsg(`重试pin获取`);
                    await this.getMyPing(fn, ++count);
                } else {
                    this.putMsg(data.result.errorMessage);
                    return;
                }
            }
            let secretPin = data.data.secretPin;
            this.nickname = data.data.nickname;
            this.Pin = this.domain.includes("cjhy") ? encodeURIComponent(encodeURIComponent(secretPin)) : encodeURIComponent(secretPin);
        } catch (e) {
            this.putMsg(e?.message);
            this.nickname = this.username;
            let secretPin = this.tickets.get("AUTH_C_USER");
            this.Pin =
                secretPin || encodeURIComponent(secretPin) || this.domain.includes("cjhy")
                    ? encodeURIComponent(encodeURIComponent(secretPin))
                    : encodeURIComponent(secretPin);
        }
    }
    async accessLog(fn = `${this.domain.includes("cjhy") ? "common/accessLog" : "common/accessLogWithAD"}`) {
        await this.api(
            fn,
            `venderId=${this.venderId}&code=${this.activityType}&pin=${this.Pin}&activityId=${this.activityId}&pageUrl=${encodeURIComponent(
                this.activityUrl
            )}&subType=app&adSource=`
        );
    }
    async sign(fn, body = {}) {
        let ret = {};
        let b = { fn: fn, body: body };
        let h = { token: apiToken, Cookie: 123 };
        const httpsAgent = $.defaults.httpsAgent;
        const httpAgent = $.defaults.httpsAgent;
        $.defaults.httpsAgent = false;
        $.defaults.httpAgent = false;
        try {
            let { data } = await this.request(signMode.includes("server") ? "http://172.17.0.1:17840/sign" : apiSignUrl, h, b);
            return { fn: data.fn, sign: data.body };
        } catch (e) {
            console.log(`sign解析接口失效: ${e.message}`);
        } finally {
            $.defaults.httpsAgent = httpsAgent;
            $.defaults.httpAgent = httpAgent;
        }
        return ret;
    }
    async login(token = this.Token) {
        if (/lzdz\d+-isv/.test(this.activityUrl)) {
            await this.lzdz4Login();
        } else if (hdbTypes.includes(this.domain)) {
            let data = await this.api("/front/fans/login", { source: "01", token: token });
            if (data.code == "200") {
                this.log(`登录成功 ${data.result.grade}`);
                this.aesBuyerNick = data.result.aesBuyerNick;
                if (data.result.grade < 0 && /partitionTeam/.test(this.activityUrl)) {
                    await this.openCard();
                }
                if (this.index > this.masterNum && data.result.grade > 0 && /inviteJoin/.test(this.activityUrl)) {
                    throw new Error(`已经是会员无法助力`);
                }
                await this.api("/front/activity/reportPVUV", { nonce: "01", token: token });
                await this.loadFrontAct();
            } else {
                this.putMsg("登录失败");
                throw new Error(data.message);
            }
        } else if (/hzbz-isv.isvjcloud.com|hdds-isv.isvjcloud.com/.test(this.activityUrl)) {
            const LoadUserData = await this.api("bigdraw/LoadUserData.json", `id=${this.activityId}&token=${token}&buyerFrom=01`);
            this.log(LoadUserData);
            const { code, txt, drawChances } = LoadUserData;
            if (code === 1) {
                this.log(`登录成功，${txt}`);
            } else if (code === 0) {
                this.putMsg(`登录成功，初始抽奖机会${drawChances}次`);
            } else {
                this.log(JSON.stringify(LoadUserData));
                throw new Error();
            }
        } else {
            let actInfo = await this.api("/api/user-info/login", {
                status: "0",
                activityId: this.activityId,
                tokenPin: token,
                source: "01",
                shareUserId: "",
                uuid: this.uuid(),
            });
            if (actInfo.resp_code !== 0) {
                this.putMsg(`登录失败`);
                throw new Error(actInfo.message);
            }
            this.isvToken = token;
            this.Token = actInfo.data.token;
            try {
                this.venderId = actInfo.data.venderId || actInfo.data.joinInfo.openCardUrl.split(`venderId=`)[1].split("&")[0];
            } catch (e) {
                this.venderId = actInfo.data.venderId || actInfo.data.shopId;
            }
            this.shopId = actInfo.data.shopId;
            this.shopName = actInfo.data.shopName;
            this.joinCode = actInfo.data.joinInfo.joinCodeInfo.joinCode;
            this.joinDes = actInfo.data.joinInfo.joinCodeInfo.joinDes;
            this.log(`登录成功 ${this.joinCode} ${this.joinDes}`);
            let basicInfo = await this.api("/api/active/basicInfo", { activityId: this.activityId });
            this.actStartTime = basicInfo.data.startTime;
            this.actEndTime = basicInfo.data.endTime;
            this.actName = basicInfo.data.actName;
            if (!this.prizeList || this.prizeList.length <= 0) {
                await this.getPrizeList();
            }
            if (
                this.prizeList &&
                this.prizeList.length > 0 &&
                this.prizeList.filter((o) => ![2].includes(o.prizeType) && o.leftNum !== 0).length === 0
            ) {
                this.putMsg(`垃圾活动`);
                this.expire = true;
            }
            if (this.actStartTime > this.timestamp()) {
                this.putMsg("活动未开始");
                this.expire = true;
                throw new Error("活动未开始");
            }
            if (this.timestamp() > this.actEndTime) {
                this.putMsg("活动已结束");
                this.expire = true;
                throw new Error("活动已结束");
            }
            if (this.expire) {
                throw new Error("垃圾活动");
            }
            this.isMember = ["1001", "1004"].includes(this.joinCode);
            try {
                await this.api("/api/task/followShop/follow", {});
            } catch (e) {}
            await this.initPinToken();
            if (!this.isMember && openCardTypes.includes(this.activityType)) {
                await this.openCard();
                this.isMember = true;
                return;
            }
            if (!this.isMember) {
                if (
                    this.prizeList &&
                    this.prizeList.length > 0 &&
                    this.prizeList.filter((o) => [1, 3].includes(o.prizeType) && o.leftNum !== 0).length > 0 &&
                    ["10023", "10024", "10040", "10036", "10068", "10002"].includes(this.activityType)
                ) {
                    await this.openCard();
                    this.isMember = true;
                }
            }
            if (!this.isMember) {
                this.putMsg(`${this.joinDes}`);
                throw new Error(this.joinDes);
            }
        }
    }
    async getPrizeList() {
        let data = await this.api("/api/prize/drawPrize", {});
        if (data.resp_code !== 0) {
            this.log(`获取奖品是失败`);
            return;
        }
        this.prizeList = data.data?.prizeInfo || [];
    }
    async loadFrontAct() {
        let activity = await this.api("/front/activity/loadFrontAct", {});
        if (activity.code == "200") {
            this.actStartTime = activity.result.activity.startTime;
            this.actEndTime = activity.result.activity.endTime;
            this.rule = activity.result.activity.remark;
            this.shopName = activity.result.activity.shopTitle;
            this.useGrade = activity.result.activity.useGrade;
            this.shopId = activity.result.user.shopId;
            this.venderId = activity.result.user.venderId;
            this.memberStatus = activity.result.user.memberStatus;
            this.actName = activity.result.activity.actName;
            if (this.actStartTime > this.timestamp()) {
                this.putMsg("活动未开始");
                this.expire = true;
                throw new Error("活动未开始");
            }
            if (this.actEndTime < this.timestamp()) {
                this.putMsg("活动已结束");
                this.expire = true;
                throw new Error("活动已结束");
            }
            if (activity.result.activity.isNeedFavourite && !activity.result.isFavouriteShop) {
                await this.reportActionLog({ actionType: "favouriteShop" });
            }
        } else {
            this.putMsg("loadFrontAct失败");
            throw new Error(activity.message);
        }
        if (!this.prizeList || this.prizeList.length <= 0) {
            let loadFrontAward = await this.api("/front/activity/loadFrontAward", {});
            if (loadFrontAward.succ) {
                this.prizeList = loadFrontAward.result || [];
                this.activity = activity.result;
                if (
                    this.prizeList &&
                    this.prizeList.length > 0 &&
                    this.prizeList.filter((o) => !["JD_D_COUPON"].includes(o.awardType)).length === 0
                ) {
                    this.expire = true;
                    this.putMsg("垃圾活动");
                    throw new Error("垃圾活动");
                }
            }
        }
    }
    async reportActionLog(body) {
        await this.wait(3000, 5000);
        let data = await this.api("/front/activity/reportActionLog", body);
        if (data.code == "200") {
            this.log(`${body?.actionType}操作成功`);
        } else {
            this.putMsg(data.message);
        }
    }
    v(e) {
        let b = [
            "B6dB3QqGZP1lKNICTaiAeNJSHKNepO5GGgtL6FUceqSlpFZCdx2SZ5MPPbzrgy91HeR0dnJazcMrvMgPF7bhFrfsGaApJKk4JohEEhoJ4kKJpAaGsfrFhb7FPgMvrMczaJnd0ReH19ygrzbPPM5ZS2xdCZFplSqecUF6LtgGG5OpeNKHSJNeAiaTCINKl1PZGqQ3Bd6B",
            "EUhzJoyKP7VydtpyBwNUGU2tqzI0QB0LIpQ10Fk3hX2ZcPoGRpACqmzcTQbKd98i3U7raFz2rMl2kys0ODgtAh22E3i57wmh38RbbR83hmw75i3E22hAtgDO0syk2lMr2zFar7U3i89dKbQTczmqCApRGoPcZ2Xh3kF01QpIL0BQ0Izqt2UGUNwByptdyV7PKyoJzhUE",
            "xexcHoyVwOs5TYTQVvU0iXn56ryKVdWedLTpq3KEKmbUHfwzuZjIpZOPVXMEappFhjdqwtp1bBrWaRBCfPFwCq2W8SsyvwqZ6sIGGIs6ZqwvysS8W2qCwFPfCBRaWrBb1ptwqdjhFppaEMXVPOZpIjZuzwfHUbmKEK3qpTLdeWdVKyr65nXi0UvVQTYT5sOwVyoHcxex",
            "2Llnegc5i4flqd4HZPFK210yh61boBxRSdnNVMeudKimx92Qi4aPuHP12HmEImbWrXjLgBGqy1bSnKvLhqMqhknyuse4nFoeLTkJJkTLeoFn4esuynkhqMqhLvKnSb1yqGBgLjXrWbmIEmH21PHuPa4iQ29xmiKdueMVNndSRxBob16hy012KFPZH4dqlf4i5cgenlL2",
            "dZzoMZF6xtt3voTFDbPzEZ7GeM8t7uY05d4K4xfhtdxELh96dDRB4oRYA2smET5dy1dafGkXOz2V7tNOVi0vSqfuhI99IKprVK6QQ6KVrpKI99IhufqSv0iVONt7V2zOXkGfad1yd5TEms2AYRo4BRDd69hLExdthfx4K4d50Yu7t8MeG7ZEzPbDFTov3ttx6FZMozZd",
            "SNYr3bWMtQulWZO2FEwuhSFp3EXPR1TujPRJwUFlxBh9Pvf2MeTEpR7a3dU6e9rNUMyBh2osDdK4Vdm4gZ0XcRCoHZPi2jiXT2dCCd2TXij2iPZHoCRcX0Zg4mdV4KdDso2hByMUNr9e6Ud3a7RpETeM2fvP9hBxlFUwJRPjuT1RPXE3pFShuwEF2OZWluQtMWb3rYNS",
            "4viQ2FrYHcrH44gqvPLo6KtiFu56AW1eXbDBZrBepzdLKE33Ey4TwFERnkVLnbHAXbKqAi0HFP9Eu7yg8WNlI7q2dvXGGiPaMbrBBrbMaPiGGXvd2q7IlNW8gy7uE9PFH0iAqKbXAHbnLVknREFwT4yE33EKLdzpeBrZBDbXe1WA65uFitK6oLPvqg44HrcHYrF2Qiv4",
            "0VIoSHBNVAW8De7NquFyEUm0o9xNnQJGn2OR1yOK9djWALhyP3a1XoQEwTnXuzypRuwsaLPUlertksOY6LYmnbQmPgdDQRXXKdKooKdKXXRQDdgPmQbnmYL6YOsktrelUPLaswuRpyzuXnTwEQoX1a3PyhLAWjd9KOy1RO2nGJQnNx9o0mUEyFuqN7eD8WAVNBHSoIV0",
            "fdJPBiTra9E0qg2HJrobeEC2SkOfSzbw6nG5J5ACx42GQDBsCyGfxNlHHYhl7EmkdvYaKAXUVXSKcTT1KhyYaj9Q4YtyhnOA7cLrrLc7AOnhytY4Q9jaYyhK1TTcKSXVUXAKaYvdkmE7lhYHHlNxfGyCsBDQG24xCA5J5Gn6wbzSfOkS2CEeborJH2gq0E9arTiBPJdf",
            "kLOA93PyUOX3QdlLuZ9JgNq1peyIITAQSnKzuLBZ2NthOSseAJMGCecvSLVKAww61Y31hJ4l7kAOcjLmtqQNJlNyJb5yu9d9vqWUUWqv9d9uy5bJyNlJNQqtmLjcOAk7l4Jh13Y16wwAKVLSvceCGMJAesSOhtN2ZBLuzKnSQATIIyep1qNgJ9ZuLldQ3XOUyP39AOLk",
        ];
        var t = e.nowTime + parseInt(this.tickets.get("te"));
        e.nowTime = t;
        debugger;
        for (var i = this.tickets.get("pToken") + t, o = i.substring(0, i.length - 5), a = "", n = 0; n < o.length; n++) {
            var s = o.charCodeAt(n);
            a += b[s % 10][n];
        }
        for (var c = a.length, l = Math.floor(c / 24), d = "", g = 0; g < 24; g++) {
            var f = (g + 1) * l;
            23 === g && (f = c);
            for (var p = a.substring(g * l, f), u = [], h = 0; h < p.length; h++) {
                u.push(p.charCodeAt(h));
            }
            var v = u.reduce(function (e, t) {
                    return e + t;
                }, 0),
                y = Math.floor(v / u.length);
            d += String.fromCharCode(y);
        }
        var k = (function (e) {
                e = e.split("").reverse().join("");
                for (var t = new Uint8Array(12), i = new TextEncoder().encode(e), o = 0; o < i.length; o += 2) {
                    var a = (i[o] << 5) | (255 & i[o + 1]);
                    (a %= 63), (t[o >> 1] = a);
                }
                for (var n = "", r = 0; r < t.length; r++) {
                    n += (t[r] + 256).toString(2).slice(1);
                }
                for (var s = "", m = "", c = 0; c < 16; c++) {
                    if (0 !== c) {
                        for (var l = 6 * c, d = n.substring(l, l + 6), g = parseInt(d, 2), f = m.split(""), p = 0; p < f.length; p++) {
                            "1" === f[p] && (g = 63 & ((g >> (6 - p)) | (g << p)));
                        }
                        m = (63 & g).toString(2).padStart(6, "0");
                    } else {
                        m = n.substring(0, 6);
                    }
                    s += m;
                }
                for (var u = 0; u < 12; u++) {
                    var b = 8 * u;
                    t[u] = parseInt(s.substring(b, b + 8), 2);
                }
                return base64.encode(String.fromCharCode.apply(null, t));
            })((a = d)),
            w = CryptoJS.enc.Utf8.parse(k),
            B = CryptoJS.enc.Utf8.parse("");
        return CryptoJS.AES.encrypt(JSON.stringify(e), w, { iv: B, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString();
    }
    async api(fn, body, token = this.Token, ticket = this.ticket, count = 0) {
        let originBody = body;
        try {
            fn = ("/" + fn).replace("//", "/");
            this.urlPrefix = this.urlPrefix ? ("/" + this.urlPrefix).replace("//", "/") : "";
            let url = `https://${this.domain}${this.urlPrefix}${fn}`;
            let headers = {
                Host: this.domain,
                Accept: "application/json, text/plain, text/javascript, */*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                Connection: "keep-alive",
                "Content-Type": body
                    ? typeof body == "string"
                        ? "application/x-www-form-urlencoded;charset=utf-8"
                        : "application/json;charset=utf-8"
                    : "application/x-www-form-urlencoded;charset=utf-8",
                Origin: `https://${this.domain}`,
                Cookie: this.activityUrl.match(new RegExp(["prod/cc", "interact", "crm-proya", ...hdbTypes, ...jinggengcjTypes].join("|")))
                    ? ""
                    : `IsvToken=${token};${ticket}`,
                Referer: `${this.activityUrl}&sid=${this.randomString()}&un_area=${this.randomPattern("xx_xxxx_xxxx_xxxxx")}`,
                "User-Agent": this.UA,
            };
            if (token?.startsWith("ey")) {
                headers["token"] = token;
            }
            if (this.domain.includes("szxyun-rc.isvjcloud.com")) {
                headers["jd-fast-token"] = token;
            }
            if (hdbTypes.includes(this.domain)) {
                body = this.hdbBody(fn, body, headers);
                headers["ts"] = this._ts || "";
                headers["s"] = this._s || "";
                headers["nonce"] = this._nonce || "";
            }
            if (jinggengcjTypes.includes(this.domain)) {
                body = this.jinggengjcqBody(fn, body);
            }
            if (this.defenseUrls && this.defenseUrls.includes(fn)) {
                if (this.activityUrl.includes("interactsaas")) {
                    body.nowTime = this.timestamp();
                    body.actId = this.activityId;
                    body.consumePoints = body.consumePoints || 0;
                } else {
                    const params = new URLSearchParams(body);
                    body = {};
                    for (const [key, value] of params.entries()) {
                        body[key] = value;
                    }
                    body.nowTime = this.timestamp();
                    body.actId = this.activityId;
                    debugger;
                }
                headers["Cookie"] = "IsvToken=" + this.isvToken + ";" + this.ticket + "isBasicJson=true;";
                let ecyText = this.v(body);
                body = { ecyText };
            }
            let { headers: respHeader, data: data } = await this.request(url, headers, body);
            if (this.defenseUrls && this.defenseUrls.includes(fn) && (!data || data.length === 0) && count < 5) {
                await this.initPinToken();
                return await this.api(fn, originBody, token, ticket, ++count);
            }
            if (!data) {
                return data;
            }
            if (hdbTypes.includes(this.domain) && respHeader) {
                this._ts = respHeader["_ts"];
                this._s = respHeader["_s"];
                this._nonce = respHeader["_nonce"];
            }
            let resStr = JSON.stringify(data);
            if (/还是去买买买吧/.test(resStr)) {
                this.putMsg(`火爆账号[${this.username}]`);
                throw new Error("还是去买买买吧");
            }
            if (resStr?.includes("AUTH.FAILED.BLACK")) {
                this.putMsg("AUTH BLACK");
                return data;
            }
            if (resStr?.includes("请稍后重试") && jinggengcjTypes.includes(this.domain)) {
                return data;
            }
            if (new RegExp(reTryRegx).test(resStr) && count < 5) {
                this.log("重试" + count);
                return await this.api(fn, originBody, token, ticket, ++count);
            }
            if ((resStr.includes("您点的太快了") || resStr.includes("操作过于频繁")) && count < 5) {
                this.log("重试" + count);
                await this.wait(3000, 5000);
                return await this.api(fn, originBody, token, ticket, ++count);
            }
            if (resStr.includes("请求的数字签名不匹配")) {
                this.log("签名错误");
                await this.login(this.isvToken);
                return await this.api(fn, originBody, token, ticket, ++count);
            }
            if (resStr.includes("会员等级不")) {
                if (token?.startsWith("ey") && count < 3) {
                    this.log("等级不足重试" + count);
                    await this.login(this.isvToken);
                    await this.wait(3000, 5000);
                    return await this.api(fn, originBody, this.Token, ticket, ++count);
                } else {
                    this.putMsg("等级不足");
                    throw new Error("等级不足");
                }
            }
            if (resStr.includes("商家token过期") || resStr.includes("商家订购过期")) {
                this.putMsg(`商家token过期`);
                this.expire = true;
            }
            return data;
        } catch (e) {
            if (count > 3) {
                throw new Error(e.message);
            }
            if (this.defenseUrls && this.defenseUrls.includes(fn) && [500].includes(e.response?.status)) {
                this.log("重试");
                await this.initPinToken();
                return await this.api(fn, originBody, token, ticket, ++count);
            }
            if (this.isProxy(e.message)) {
                await this.routerProxy(count);
                return await this.api(fn, originBody, token, ticket, ++count);
            } else {
                throw new Error(e.message);
            }
        }
    }
    jinggengjcqBody(fn, body) {
        let method = fn.match(/dm\/front(.+)\?/)[1];
        delete body.method;
        let data = {
            actId: this.activityId,
            ...body,
            method: method,
            userId: this.userId,
            buyerNick: this.buyerNick || "",
        };
        let signData = this.mpdzSign(data);
        let appkey = "94854284";
        const result = {
            jsonRpc: "2.0",
            params: {
                commonParameter: {
                    appkey: appkey,
                    m: "POST",
                    oba: signData.sign,
                    timestamp: signData.timeStamp,
                    userId: this.userId,
                },
                admJson: {
                    actId: this.activityId,
                    ...body,
                    method: method,
                    userId: this.userId,
                    buyerNick: this.buyerNick || "",
                },
            },
        };
        method?.indexOf("missionInviteList") > -1 && delete result.params.admJson.actId;
        return JSON.stringify(result);
    }
    mpdzSign(data) {
        let AppSecret = "6cc5dbd8900e434b94c4bdb0c16348ed";
        let key = "c1614da9ac68";
        let time2 = new Date().valueOf();
        let s2 = encodeURIComponent(JSON.stringify(data));
        let c = new RegExp("'", "g");
        let A = new RegExp("~", "g");
        s2 = s2.replace(c, "%27");
        s2 = s2.replace(A, "%7E");
        let signBody = "f" + key + "D" + s2 + "c" + time2 + AppSecret;
        let sign = CryptoJS.MD5(signBody.toLowerCase()).toString();
        return {
            sign: sign,
            timeStamp: time2,
        };
    }
    hdbBody(fn, body, headers) {
        let buyerNick = this.aesBuyerNick;
        let t = Date.now();
        let bd = {
            appJsonParams: {
                id: this.activityId,
                userId: this.venderId,
                shopId: this.shopId || this.venderId,
                ...body,
                buyerNick: buyerNick,
                method: fn,
            },
            sysParams: {
                sysmethod: JSON.stringify(fn).replace(/[^\u4e00-\u9fa5\w]/g, ""),
                timestamp: t,
                actid: this.activityId,
            },
        };
        if (body) {
            body = bd;
        }
        if (!buyerNick) {
            delete body.appJsonParams.buyerNick;
            delete body.sysParams.buyernick;
        }
        this.tickets.get("_sk") ? (headers._sk = this.tickets.get("_sk")) : "";
        this.tickets.get("zxhd_aes_buyer_nick") ? (headers._dzf = this.tickets.get("zxhd_aes_buyer_nick")) : "";
        let signStr = `actid${this.activityId}buyernick${buyerNick || "undefined"}sysmethod${JSON.stringify(fn).replace(
            /[^\u4e00-\u9fa5\w]/g,
            ""
        )}timestamp${t}`;
        let key = headers._sk || "1111";
        body.sysParams.sign = CryptoJS.HmacSHA256(signStr, key).toString(CryptoJS.enc.Hex);
        return body;
    }
    async selectAddress(username) {
        let address;
        let addrMode = M_WX_ADDRESS_MODE.toUpperCase();
        this.log("当前填地址模式: " + M_WX_ADDRESS_MODE.toUpperCase());
        if (["PIN"].includes(addrMode)) {
            address = this.accounts[username]?.address || this.accounts[encodeURIComponent(username)]?.address;
        }
        if (address) {
            return address;
        }
        if (["CC", "CCWAV"].includes(addrMode)) {
            address = this.accounts["默认地址" + this.addressIndex]?.address;
        }
        if (address) {
            return address;
        }
        let list = [];
        for (let key in this.accounts) {
            if (this.accounts[key]?.address) {
                list.push(this.accounts[key].address);
            }
        }
        if (["RANGE"].includes(addrMode)) {
            let rs = parseInt(M_WX_ADDRESS_RANGE?.split("-")?.[0] || 1);
            let re = Math.min(parseInt(M_WX_ADDRESS_RANGE?.split("-")?.[1] || list.length), list.length);
            if (this.addressIndex > re) {
                this.addressIndex = 1;
            }
            address = list[this.addressIndex - 1];
        }
        if (address) {
            return address;
        }
        if (M_WX_ADDRESS_MODE_LOWER || ["RANDOM"].includes(addrMode)) {
            debugger;
            return list[this.random(1, list.length) - 1];
        }
    }
    async saveAddress(addressId = this.addressId, prizeName = this.prizeName, pin = this.Pin, username = this.username, addr = "") {
        if (await this.wxAddressStop(prizeName)) {
            this.putMsg("命中关键词，不填写地址！");
            return;
        }
        if (await this.wxAddressStopRule()) {
            this.putMsg("命中规则，不填地址beta！");
            return;
        }
        if (this.currAddrUsername && this.currAddrUsername !== username) {
            this.addressIndex++;
        }
        this.currAddrUsername = username;
        let addrInfo = await this.selectAddress(username);
        if (!addrInfo) {
            this.putMsg("没有找到地址信息");
            return;
        }
        if (M_WX_ADDRESS_LOG || mode) {
            this.log("当前地址详情" + JSON.stringify(addrInfo));
        }
        let shopName = this.shopName;
        if (!shopName) {
            try {
                shopName = await this.getShopName();
            } catch (e) {
                console.log("addr" + e);
            }
        }
        try {
            if (jinggengcjTypes.includes(this.domain)) {
                let saveData = await this.api(
                    `/dm/front/jdBigAlliance/awards/updateAddress?open_id=&mix_nick=${this.buyerNick || ""}&user_id=10299171`,
                    {
                        receiverName: addrInfo.receiver,
                        receiverMobile: addrInfo.phone,
                        receiverProvince: addrInfo.province,
                        receiverCity: addrInfo.city,
                        receiverDistrict: addrInfo.county,
                        receiverAddress: addrInfo.address,
                        logId: addressId,
                    }
                );
                console.log(saveData);
            } else if (this.domain.includes("jinggeng")) {
                let address = `${addrInfo.province.replace("市", "").replace("省", "")} ${addrInfo.city.replace("市", "")} ${addrInfo.county}${
                    addrInfo.address
                }`;
                let saveData = await this.api(
                    "/ql/front/postBuyerInfo",
                    `receiverName=${encodeURIComponent(addrInfo.receiver)}&mobile=${addrInfo.phone}&address=${encodeURIComponent(
                        address
                    )}&log_id=${addressId}&user_id=${this.userId}`
                );
                console.log(saveData);
                if (saveData.succ) {
                    this.putMsg(`已填地址`);
                    await fs.appendFileSync(
                        "gifts.csv",
                        `${this.now()},${prizeName},${username},${addrInfo.phone},${addrInfo.address},${this.name},${shopName},${this.activityUrl}\
`
                    );
                } else {
                    this.putMsg(saveData.msg);
                }
            } else if (this.activityUrl.includes("interact") || this.activityUrl.includes("prod/cc") || this.activityUrl.includes("crm-proya")) {
                let saveData = await this.api("/api/my/prize/update", {
                    realName: addrInfo.receiver,
                    mobile: addrInfo.phone,
                    address: addrInfo.address,
                    orderCode: this.addressId,
                    province: addrInfo.province,
                    city: addrInfo.city,
                    county: addrInfo.county,
                });
                console.log(saveData);
                if (saveData?.data !== "2") {
                    this.putMsg(`已填地址`);
                    await fs.appendFileSync(
                        "gifts.csv",
                        `${this.now()},${prizeName},${username},${addrInfo.phone},${addrInfo.address},${this.name},${shopName},${this.activityUrl}\
`
                    );
                } else {
                    this.putMsg(`超一小时或其他报错，请手动进活动确认`);
                }
            } else {
                let saveData = await this.api(
                    "wxAddress/save",
                    `venderId=${this.venderId}&pin=${pin}&activityId=${this.activityId}&actType=${this.activityType}&prizeName=${encodeURIComponent(
                        prizeName
                    )}&receiver=${encodeURIComponent(addrInfo.receiver)}&phone=${addrInfo.phone}&province=${encodeURIComponent(
                        addrInfo.province
                    )}&city=${encodeURIComponent(addrInfo.city)}&address=${encodeURIComponent(addrInfo.address)}&generateId=${addressId}&postalCode=${
                        addrInfo.postalCode
                    }&areaCode=${encodeURIComponent(addrInfo.areaCode)}&county=${encodeURIComponent(addrInfo.county)}`
                );
                if (!saveData?.result) {
                    if (saveData.errorMessage.includes("您必须在中奖一小时内填写中奖地址")) {
                        return;
                    }
                }
                if (saveData?.result) {
                    this.putMsg(`已填地址`);
                    await fs.appendFileSync(
                        "gifts.csv",
                        `${this.now()},${prizeName},${username},${addrInfo.phone},${addrInfo.address},${this.name},${shopName},${this.activityUrl}\
`
                    );
                } else {
                    saveData = await this.api(
                        "wxAddress/save",
                        `venderId=${this.shopId}&pin=${pin}&activityId=${this.activityId}&actType=${this.activityType}&prizeName=${encodeURIComponent(
                            prizeName
                        )}&receiver=${encodeURIComponent(addrInfo.receiver)}&phone=${addrInfo.phone}&province=${encodeURIComponent(
                            addrInfo.province
                        )}&city=${encodeURIComponent(addrInfo.city)}&address=${encodeURIComponent(
                            addrInfo.address
                        )}&generateId=${addressId}&postalCode=${addrInfo.postalCode}&areaCode=${encodeURIComponent(
                            addrInfo.areaCode
                        )}&county=${encodeURIComponent(addrInfo.county)}`
                    );
                    if (saveData?.result) {
                        this.putMsg(`已填地址`);
                        await fs.appendFileSync(
                            "gifts.csv",
                            `${this.now()},${prizeName},${username},${addrInfo.phone},${addrInfo.address},${this.name},${shopName},${
                                this.activityUrl
                            }\
`
                        );
                    } else {
                        this.putMsg(`${saveData?.errorMessage}`);
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
    async carData() {
        let url = `https://wq.jd.com/deal/mshopcart/uncheckcmdy?sceneval=2&g_login_type=1&g_ty=ajax`;
        let body = "commlist=&pingouchannel=0&all=1&scene=0&locationid=&type=0&templete=1&reg=1&version=20190418&traceid=&tabMenuType=4&sceneval=2";
        let headers = {
            Accept: `application/json`,
            Origin: `https://p.m.jd.com`,
            Cookie: this.cookie,
            "Accept-Encoding": "gzip, deflate, br",
            "Content-Type": `application/x-www-form-urlencoded`,
            Host: `wq.jd.com`,
            "User-Agent": `jdpingou;5.5.2;;session/9;brand/apple`,
            Referer: `https://p.m.jd.com/`,
            "Accept-Language": `zh-CN,zh-Hans;q=0.9`,
        };
        let { data } = await this.request(url, headers, body);
        return data.errId === "0" ? data : "";
    }
    async carRmv(skuIds = []) {
        let goods = [];
        let cartData = await this.carData();
        if (cartData) {
            for (let i of cartData.cart.venderCart) {
                for (let items of i.sortedItems) {
                    for (let products of items.polyItem.products) {
                        if ((skuIds.length > 0 && skuIds.includes(products.mainSku.id.toString())) || skuIds.length === 0) {
                            const pid = items.polyItem?.promotion?.pid;
                            if (pid) {
                                goods.push(
                                    `${products.mainSku.id},,1,${products.mainSku.id},11,${items.polyItem.promotion.pid},0,skuUuid:${products.skuUuid}@@useUuid:0`
                                );
                            } else {
                                goods.push(`${products.mainSku.id},,1,${products.mainSku.id},1,,0,skuUuid:${products.skuUuid}@@useUuid:0`);
                            }
                        }
                    }
                }
            }
        }
        if (goods.length === 0) {
            return;
        }
        this.log(`即将删除${goods.length}件商品`);
        let url = `https://wq.jd.com/deal/mshopcart/rmvCmdy?sceneval=2&g_login_type=1&g_ty=ajax`;
        let body = `pingouchannel=0&commlist=${encodeURIComponent(
            goods.join("$")
        )}&type=0&checked=0&locationid=&templete=1&reg=1&scene=0&version=20190418&traceid=&tabMenuType=4&sceneval=2`;
        let headers = {
            Accept: `application/json`,
            Origin: `https://p.m.jd.com`,
            Cookie: this.cookie,
            "Accept-Encoding": "gzip, deflate, br",
            "Content-Type": `application/x-www-form-urlencoded`,
            Host: `wq.jd.com`,
            "User-Agent": `jdpingou;5.5.2;;session/9;brand/apple`,
            Referer: `https://p.m.jd.com/`,
            "Accept-Language": `zh-CN,zh-Hans;q=0.9`,
        };
        let { data } = await this.request(url, headers, body);
        return data.errId === "0" ? data : {};
    }
    async openCardInfo(venderId = this.venderId, cookie = this.cookie, count = 0) {
        try {
            if (openCardMode.includes("wh5")) {
                let body = { venderId: venderId, payUpShop: true, channel: 406 };
                let url = `https://api.m.jd.com/getShopOpenCardInfo?appid=jd_shop_member&functionId=getShopOpenCardInfo&body=${encodeURIComponent(
                    JSON.stringify(body)
                )}&uuid=88888&clientVersion=9.2.0&client=wh5&${await this.h5st()}`;
                return await this.get(url, {
                    authority: "api.m.jd.com",
                    accept: "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    "content-type": "application/x-www-form-urlencoded",
                    origin: "https://shopmember.m.jd.com",
                    referer: "https://shopmember.m.jd.com/",
                    "user-agent": this.UA,
                    Cookie: this.cookie,
                });
            } else {
                let url = `https://api.m.jd.com/client.action?appid=jd_shop_member&${await this.h5st(
                    {
                        venderId: venderId,
                        channel: 401,
                    },
                    "getShopOpenCardInfo"
                )}`;
                return await this.get(url, {
                    Accept: "*/*",
                    Connection: "close",
                    Referer: "https://shopmember.m.jd.com/shopcard/?",
                    "Accept-Encoding": "gzip, deflate, br",
                    Host: "api.m.jd.com",
                    "User-Agent":
                        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
                    "Accept-Language": "zh-cn",
                    Cookie: cookie,
                });
            }
        } catch (e) {
            this.log(e.message);
            if (count < 3 && e.message.includes("status code 403")) {
                if (this.isProxy(e.message)) {
                    await this.routerProxy(count);
                    await this.wait(1000, 2000);
                } else {
                    await this.router();
                }
                return await this.openCardInfo(venderId, cookie, ++count);
            }
            return {};
        }
    }
    async getShopOpenCardInfo(venderId = this.venderId, cookie = this.cookie, count = 0) {
        try {
            let body = { venderId: venderId, payUpShop: true, channel: 406 };
            const data = await H5st.getH5st({
                appId: "27004",
                appid: "shopmember_m_jd_com",
                body: body,
                cookie: this.cookie,
                clientVersion: "9.2.0",
                client: "H5",
                functionId: "getShopOpenCardInfo",
                ua: this.UA,
                version: "3.1",
                t: true,
            });
            let url = "https://api.m.jd.com/client.action?" + data.params;
            return await this.get(url, {
                authority: "api.m.jd.com",
                accept: "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/json;charset=utf-8",
                origin: "https://shopmember.m.jd.com",
                referer: "https://shopmember.m.jd.com/",
                "user-agent": this.UA,
                Cookie: this.cookie,
            });
        } catch (e) {
            this.log(e.message);
            if (count < 3 && e.message.includes("status code 403")) {
                if (this.isProxy(e.message)) {
                    await this.routerProxy(count);
                    await this.wait(1000, 2000);
                } else {
                    await this.router();
                }
                return await this.openCardInfo(venderId, cookie, ++count);
            }
            return {};
        }
    }
    async isOpenCard(venderId = this.venderId, cookie = this.cookie, count = 0) {
        try {
            let url = "https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo";
            let params = { venderId: venderId };
            let body = `body=${encodeURIComponent(JSON.stringify(params))}&uuid=2be5d035ec2c47e682c883a13e02cdb6&client=apple&clientVersion=9.4.0`;
            let { data } = await this.request(
                url,
                {
                    Host: "api.m.jd.com",
                    "User-Agent": "User-Agent: JD4iPhone/167814 (iPhone; iOS 14.4; Scale/3.00)",
                    "Content-Type": "application/x-www-form-urlencoded",
                    Origin: "https://api.m.jd.com",
                    Cookie: cookie,
                },
                body
            );
            if (data?.result?.userInfo?.openCardStatus === 1) {
                this.log(venderId + " 已经是会员");
            }
            await this.wait(1000);
            return data?.result?.userInfo?.openCardStatus === 1;
        } catch (e) {
            this.log(e.message);
            if (count < 3 && e.message.includes("status code 403")) {
                if (this.isProxy(e.message)) {
                    await this.routerProxy(count);
                    await this.wait(1000, 2000);
                } else {
                    await this.router();
                }
                return await this.isOpenCard(venderId, cookie, ++count);
            }
            return false;
        }
    }
    async openCard(venderId = this.venderId, channel = 406, activityId = "", count = 0) {
        try {
            if (count > 3) {
                return;
            }
            let body = {
                venderId: venderId,
                shopId: this.shopId || venderId,
                bindByVerifyCodeFlag: 1,
                registerExtend: {},
                writeChildFlag: 0,
                channel: channel,
            };
            if (activityId) {
                Object.assign(body, { activityId: activityId });
            }
            let url = `https://api.m.jd.com/client.action`;
            let headers = {
                authority: "api.m.jd.com",
                accept: "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/x-www-form-urlencoded",
                origin: "https://shopmember.m.jd.com",
                referer: "https://shopmember.m.jd.com/",
                "user-agent": this.UA,
                Cookie: this.cookie,
            };
            this.openCount++;
            body = `appid=shopmember_m_jd_com&functionId=bindWithVender&body=${encodeURIComponent(
                JSON.stringify(body)
            )}&client=H5&clientVersion=9.2.0&${await this.h5st()}`;
            let data = await this.post(url, body, headers);
            this.log("开卡结果:" + data?.message);
            if ([0, 9003].includes(data?.busiCode * 1)) {
                return data;
            }
            if ([508, 510, 201, 9002].includes(data?.busiCode * 1)) {
                throw new Error(data?.message);
            }
            if ((data?.message?.includes("火爆") || data?.message?.includes("失败")) && count < 3) {
                return await this.openCard(venderId, channel, activityId, ++count);
            }
            return data;
        } catch (e) {
            ++count;
            if (count < 3 && e.message.includes("status code 403")) {
                if (this.isProxy(e.message)) {
                    await this.routerProxy(count);
                    await this.wait(1000, 2000);
                } else {
                    await this.router();
                }
                return await this.openCard(venderId, channel, activityId, count);
            } else {
                throw new Error(e?.message);
            }
        }
    }
    async getShopMemberInfo(cookie = this.cookie, shopId = this.shopId, venderId = this.venderId) {
        try {
            let newVar = await this.sign("getFansFuseMemberDetail", {
                shopId: shopId,
                venderId: venderId,
                channel: 102,
                queryVersion: "10.5.2",
            });
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
                Cookie: cookie,
            };
            let url = `https://api.m.jd.com/client.action?functionId=` + newVar.fn;
            let { status, data } = await this.request(url, headers, newVar.sign);
            return data.data[0].memberInfo;
        } catch (e) {
            console.log(e);
            return {};
        }
    }
    async h5st(body, fn = "bindWithVender", count = 0) {
        return h5sts.random();
    }
    getAwardText(drawAwardDto) {
        let awardText = "";
        if (drawAwardDto.awardType == "JD_GOODS") {
            awardText = drawAwardDto.awardName + " " + drawAwardDto.awardDenomination * 1 + "元";
        } else if (drawAwardDto.awardType == "JD_POINT") {
            awardText = drawAwardDto.awardDenomination * 1 + "积分";
        } else if (drawAwardDto.awardType == "JD_COUPON" || drawAwardDto.awardType == "JD_D_COUPON") {
            awardText = drawAwardDto.awardDenomination * 1 + "元券";
        } else if (drawAwardDto.awardType == "JD_BEAN" || drawAwardDto.awardType == "JD_MARKET") {
            awardText = drawAwardDto.awardDenomination * 1 + "豆";
        } else if (drawAwardDto.awardType == "JD_E_CARD") {
            awardText = drawAwardDto.assetsName;
        } else if (drawAwardDto.awardType == "JD_AIQIYI") {
            awardText = drawAwardDto.assetsName;
        } else if (drawAwardDto.awardType == "JD_REDBAG" || drawAwardDto.awardType == "JD_RED_BAG") {
            awardText = drawAwardDto.awardDenomination * 1 + "元红包";
        } else {
            awardText = drawAwardDto.awardName;
            debugger;
        }
        return awardText;
    }
    async getOpenCardPath(url = this.activityUrl) {
        let doc = await this.get(url, {});
        const $2 = cheerio.load(cheerio.load(doc).html());
        let jsFileUrl = "";
        $2("script[src]").each((i, elem) => {
            const scriptSrc = $2(elem).attr("src");
            let result = scriptSrc.match(/\/\/.*\/js\/index\.\w+\.js/);
            if (result && result.length > 0) {
                jsFileUrl = result[0];
            }
        });
        doc = await this.get("https:" + jsFileUrl, {});
        let result = doc.match(/dingzhi\/([a-zA-Z]+)\/union\/saveTask/);
        return result[1];
    }
    async apiBatch(tasks, opt = {}) {
        let batchSize = opt?.batchSize || 2,
            execCount = opt?.execCount || 0,
            filterFunc = opt?.filterFunc || null,
            processFunc = opt?.processFunc || null;
        const batchResults = [];
        for (let i = 0; i < execCount; i++) {
            for (let i = 0; i < tasks.length; i += batchSize) {
                const batchTasks = tasks.slice(i, i + batchSize);
                const batchResultsPromise = Promise.all(
                    batchTasks.map(async (task) => {
                        try {
                            const result = await task();
                            if (result !== null && (!filterFunc || filterFunc(result))) {
                                return processFunc ? processFunc(result) : result;
                            }
                            return null;
                        } catch (e) {
                            console.error(`任务 ${task} 执行出错：${e}`);
                            return null;
                        }
                    })
                );
                batchResults.push(batchResultsPromise);
            }
        }
        const flattenResults = (await Promise.all(batchResults)).flat();
        let results = flattenResults.filter((r) => r !== null);
        if (processFunc) {
            results = results
                .map((result) => {
                    try {
                        return processFunc(result);
                    } catch (e) {
                        console.error(`处理结果 ${result} 出错：${e}`);
                        return null;
                    }
                })
                .filter((r) => r !== null);
        }
        return results;
    }
    getActivityId(url = this.activityUrl) {
        const params = new URLSearchParams(new URL(url).search);
        const idRule = ["activityId", "giftId", "actId", "token", "code", "a", "id"];
        let actId = "";
        for (let key of idRule) {
            actId = params.get(key);
            if (actId) {
                break;
            }
        }
        if (!actId) {
            actId = this.match(/\/(dz[a-zA-Z0-9]{28,32})/, url);
        }
        this.activityId = actId;
        return this.activityId;
    }
    filterUrl(url) {
        if (url === null) {
            return null;
        }
        const params = new URLSearchParams(new URL(url).search);
        const newP = [];
        for (const [k, v] of params.entries()) {
            if (keywords.includes(k)) {
                continue;
            }
            newP.push(`${k}=${v}`);
        }
        if (newP.length > 0) {
            return url.split("?")[0] + "?" + newP.join("&");
        }
        return url;
    }
    buildActInfo() {
        if (!this.activityUrl) {
            return;
        }
        this.activityUrl = this.filterUrl(this.activityUrl);
        this.activityUrl = this.match(/(https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/, this.activityUrl);
        this.activityUrl =
            this?.activityUrl?.replace(/(isvjd|lzkjdz|cjhydz|lzkjdzisv|cjhydzisv)/g, (match) => {
                switch (match) {
                    case "isvjd":
                        return "isvjcloud";
                    case "lzkjdz":
                        return "lzkj";
                    case "cjhydz":
                        return "cjhy";
                    case "lzkjdzisv":
                        return "lzkj-isv";
                    case "cjhydzisv":
                        return "cjhy-isv";
                    default:
                        return match;
                }
            }) || "";
        this.domain = this.match(/https?:\/\/([^/]+)/, this.activityUrl);
        this.activityId = this.getActivityId(this.activityUrl);
        while (this.activityId.startsWith("https")) {
            this.activityUrl = this.activityId;
            this.activityId = this.getActivityId(this.activityUrl);
        }
        this.activityType = this.getQueryString(this.activityUrl, "activityType");
        this.venderId =
            this.getQueryString(this.activityUrl, "user_id") ||
            this.getQueryString(this.activityUrl, "userId") ||
            this.match(/\/m\/(\d+)\//, this.activityUrl) ||
            this.getQueryString(this.activityUrl, "venderId");
        this.userId = this.venderId;
        if (this?.activityUrl) {
            this.urlPrefix = Object.keys(urlPrefixes).find((prefix) => this.activityUrl.match(urlPrefixes[prefix])) || "";
        }
        console.log(`活动链接 ${this.activityUrl} ${this.activityType} ${this.venderId}`);
    }
    async complete() {
        if (!this.runAll && this.index >= this.masterNum) {
            this.putMsg("全部完成");
            this.expire = true;
        }
    }
    async rcache(key, value, expire) {
        expire ? (await redis.del(key), await redis.set(key, value, "NX", "PX", expire)) : await redis.set(key, value);
    }
    async rdel(key) {
        await redis.del(key);
    }
    async rget(key) {
        return await redis.get(key);
    }
    getAwardPrizeInfo(drawAwardDto) {
        const isBean = drawAwardDto.awardType === "JD_BEAN" || drawAwardDto.awardType === "JD_MARKET";
        const prizeNum = parseInt(drawAwardDto.awardDenomination);
        return { isBean, prizeNum };
    }
    formatDateString(dateString) {
        if (dateString.match(/\d{4}年\d{1,2}月\d{1,2}日\d{2}:\d{2}:\d{2}/)) {
            return dateString.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日(\d{2}:\d{2}:\d{2})/, "$1-$2-$3 $4");
        }
        return dateString;
    }
    async getRuleSETime(rule = this.rule) {
        debugger;
        if (this.actStartTime) {
            return;
        }
        const regex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}|\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}|\d{4}年\d{1,2}月\d{1,2}日\d{2}:\d{2}:\d{2})/g;
        const matches = rule.match(regex);
        if (matches) {
            const startDateString = this.formatDateString(matches[0]);
            const endDateString = this.formatDateString(matches[1]);
            this.actStartTime = new Date(startDateString).getTime();
            this.actEndTime = new Date(endDateString).getTime();
        } else {
            debugger;
            console.log("未找到活动时间！");
        }
    }
    generateJdaCookie() {
        const userId = Math.floor(Math.random() * 100000000) + "." + Math.floor(Math.random() * 10000000000000000000000);
        const firstVisitTimestamp = Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 31536000);
        const lastVisitTimestamp = Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 604800);
        const previousVisitTimestamp = lastVisitTimestamp - Math.floor(Math.random() * 604800);
        const visitCount = Math.floor(Math.random() * 100) + 1;
        const jdaCookie = `__jda=${userId}.${firstVisitTimestamp}.${previousVisitTimestamp}.${lastVisitTimestamp}.${visitCount}`;
        return jdaCookie;
    }
}
module.exports = { http: $, Env, CryptoJS, notify, fs, cheerio, NodeRSA };
