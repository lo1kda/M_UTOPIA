let mode = __dirname.includes("Work");
const fs = require("fs");
const axios = require("axios");
const { format, addDays } = require("date-fns");
const path = require("path");
const machineId = require("node-machine-id");
const tunnel = require("tunnel");
const Redis = require("ioredis");
const util = require("util");
const CryptoJS = require("crypto-js");
const { jsToken } = require("./assets/jsToken");
const { prizeTypesDic } = require("./assets/prizeTypesDic");
const notify = require("./sendNotify");
const cheerio = require("cheerio");
const base64 = require("base-64");
const jdCookieNode = require("./jdCookie.js");
let NodeRSA = require("node-rsa");
let cookiesArr = [];
Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item]);
});
let h5stVersions = {};
let basePath = process.env.M_CONF_BASE_PATH || `${__dirname}/../conf`;
const conf = JSON.parse(fs.readFileSync(basePath + `/utopia${mode ? "-work" : ""}.json`).toString());
function getValue(key, defaultValue = "") {
    return conf[key] || process.env[key] || defaultValue;
}
const redis = new Redis(getValue("M_REDIS_URL"), { keyPrefix: "magic:" });
let accountPath = basePath + `/account.json`;
const $ = axios.create({ timeout: getValue("M_TIMEOUT", 5000) });
$.defaults.headers["Accept"] = "*/*";
$.defaults.headers["Connection"] = "keep-alive";
$.defaults.headers["Accept-Language"] = "zh-CN,zh-Hans;q=0.9";
($.defaults.headers["Accept-Encoding"] = "gzip, deflate, br"), ($.defaults.headers.common["Cookie"] = machineId.machineIdSync());
const redisHotKey = `HOT_KEY:%s:%s`;
class CustomError extends Error {
    constructor(message) {
        super(message);
    }
}
const proxyUrl = new URL(getValue("M_WX_PROXY_POOL_URL"));
const proxyMode = getValue("M_WX_PROXY_POOL_MODE");
const proxyDomain = proxyUrl.hostname;
const proxyPort = proxyUrl.port;
const clientVersion = getValue("M_SIGN_CLIENT_VERSION", "12.4.4");
const users = new Map();
const cookies = [];
const taskQueue = [];
let osver = ["16.1.2", "15.1.1", "14.5.1", "14.4", "14.3", "14.2", "14.1", "14.0.1", "13.2"],
    clients = {
        jd: {
            app: "jdapp",
            appBuild: "169031",
            client: "android",
            clientVersion: "10.4.0",
        },
        lite: {
            app: "jdltapp",
            appBuild: "1247",
            client: "ios",
            clientVersion: "12.2.2",
        },
    };
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
    "jd_env_info",
    "inviter_id",
    "invitePin",
    "portrait",
    "sid",
    "shareUserId",
    "_ts",
    "tttparams",
    "pps",
    "pps",
    "DEBUG",
    "shareOpenId",
    "jxsid",
    "ad_od",
    "un_area",
    "encryptOpenId",
    "gx",
    "gxd",
    "accessToken",
];
let activityIdRegx = [
    "/(dz[a-zA-Z0-9]{28,32})",
    "pagec/(unionOpen\\w+)/index",
    "activityId=(\\w+)",
    "exchange_id=(\\w+)",
    "giftId=(\\w+)",
    "actId=(\\w+)",
    "tplId=(\\w+)",
    "token=(\\w+)",
    "code=(\\w+)",
    "a=(\\w+)",
    "id=(\\w+)",
];
let urlPrefixes = {
    "/prod/cc/interactsaas": /interactsaas/,
    "/crm-proya/apps/interact": /crm-proya/,
    "/apps/interact": /lorealjdcampaign-rc.isvjcloud.com/,
    "prod/cc/cjwx": /lorealjdcampaign-rc.isvjcloud.com\/prod\/cc\/cjwx/,
    "/prod/cc/interaction/v1": /interaction\/v1/,
    "/prod/cc/interaction/v2": /interaction\/v2/,
};
let notInitPinTokenRegex = /(lorealjdcampaign-rc.isvjcloud.com|lzdz\\d+|interaction\/v1)/;
let tokenCacheMin = getValue("M_WX_TOKEN_CACHE_MIN"),
    tokenCacheMax = getValue("M_WX_TOKEN_CACHE_MAX");
let addressStopRegx = new RegExp(`(${getValue("M_WX_ADDRESS_STOP_KEYWORD").split("@").join("|")})`);
let invalidPrizeRegx = new RegExp(`(${getValue("M_WX_INVALID_PRIZE_KEYWORD").split("@").join("|")})`);
let notOpenCardFilenameRegx = new RegExp(`(${getValue("M_WX_NOT_OPEN_FILENAME", "xxx@xxx").split("@").join("|")})`);
let exitKeywordRegx = /""/,
    disableLogUrlRegx = /""/,
    exitRuleKeywordRegx = /""/,
    exitActNameKeywordRegx = /""/,
    ruleSimplifyKeywordRegx = /""/,
    exitShopKeywordRegx = /""/,
    autoCachedRegx = /""/,
    autoCachedForeverRegx = /""/,
    autoCachedForeverHotRegx = /""/,
    successMessageRegx = /""/,
    breakKeywordRegx = /""/,
    retryApiKeywordRegx = /""/,
    getJdabcv,
    utopia = {};
let M_WX_ADDRESS_MODE = getValue("M_WX_ADDRESS_MODE");
let M_WX_ADDRESS_MODE_LOWER = getValue("M_WX_ADDRESS_MODE_LOWER", 1);
let prizeTypes = {};
class Env {
    constructor(name) {
        if (this.constructor === Env) {
            this.name = `${name}乌托邦`;
            this.desensitize = false;
            this.concNum = 0;
            this.runningNum = 0;
            this.exit = false;
            this.domain = "";
            this.baseActivityId = "";
            this.actName = "";
            this.activityId = "";
            this.activityUrl = "";
            this.activityType = "";
            this.templateId = "";
            this.templateCode = "";
            this.rule = "";
            this.defenseUrls = [];
            this.urlPrefix = "";
            this.shopName = "";
            this.venderId = "";
            this.shopId = "";
            this.superVersion = "v1.0.0";
            this.superVersionNum = this.superVersion.replace(/\D/g, "");
            $.defaults.headers.common["Cookie"] = machineId.machineIdSync();
            this.prizeList = [];
            this.accounts = [];
            this.currAddressPtpin = "";
            this.addressIndex = 1;
            this.enableCookieFilter = true;
            this.cookieTypes = "";
            this.forceCookieTypes = "";
            this.enableMasterPtpins = "";
            this.disablePtpins = "";
            this.masterPins = [];
            this.maxCookie = getValue("M_MAX_COOKIE");
            this.enableMasterSort = false;
            this.enableRunCache = true;
            this.hotKey = "common";
            this.masterNum = 0;
            this.filename = path.parse(process.argv[1]).name;
            this.currentTime = Date.now();
            this.__st = Date.now();
            this.log(`${this.name} ${this.filename}`);
            this.retryRegx = "timeout@socket";
            this.retryCount = 2;
            this.retryInterval = 0;
            this.isvjcloud = false;
            this.referer = "";
            this.origin = "";
            this.helpUserId = "";
            this.proxy = false;
            this.protocol = "https";
            this.msg = [];
            this.isHdbAct = false;
            this.isTxzjAct = false;
            this.isHzbzAct = false;
            this.isLzdzAct = false;
            this.isJinggengjcqAct = false;
            this.isJinggengAct = false;
            this.isGzslAct = false;
            this.isV2Act = false;
            this.isV1Act = false;
            this.isCommonAct = false;
            this.isSzxyunAct = false;
            this.commandLineArgs();
            return;
        }
        this.index = 0;
        this.isMember = false;
        this.isNewMember = false;
        this.isNotOpenCard = false;
        this.cookie = "";
        this.ptpin = "";
        this.ptkey = "";
        this.version = "";
        this.ticket = "";
        this.tickets = new Map();
        this.Token = "";
        this.isvToken = "";
        this.Pin = "";
        this.nickname = "";
        this.secretPin = "";
        this.message = [];
    }
    different(a, b) {
        const diff1 = a.map((o) => o + "").filter((x) => !b.map((o) => o + "").includes(x));
        const diff2 = b.map((o) => o + "").filter((x) => !a.map((o) => o + "").includes(x));
        return diff1.concat(diff2);
    }
    commandLineArgs() {
        const args = process.argv.slice(2);
        const parsedArgs = {};
        for (let i = 0; i < args.length; i++) {
            const currentArg = args[i];
            if (currentArg.startsWith("--")) {
                const [argName, value] = currentArg.slice(2).split("=");
                if (argName && value) {
                    if (
                        ["disablePtpins", "enableMasterPtpins", "ptpins", "forceCookieTypes", "cookieTypes"].includes(argName) &&
                        !value.includes(",")
                    ) {
                        parsedArgs[argName] = [value];
                    } else {
                        parsedArgs[argName] = this.parseValue(value);
                    }
                }
            }
        }
        Object.assign(this, parsedArgs);
    }
    textToVector(text) {
        let words = text.split(/[^\w]+/).filter(Boolean);
        let vector = {};
        for (let word of words) {
            vector[word] = (vector[word] || 0) + 1;
        }
        return vector;
    }
    cosineSimilarity(vec1, vec2) {
        let dotProduct = 0;
        let magnitude1 = 0;
        let magnitude2 = 0;
        for (let key in vec1) {
            if (vec2.hasOwnProperty(key)) {
                dotProduct += vec1[key] * vec2[key];
            }
            magnitude1 += Math.pow(vec1[key], 2);
        }
        for (let key in vec2) {
            magnitude2 += Math.pow(vec2[key], 2);
        }
        magnitude1 = Math.sqrt(magnitude1);
        magnitude2 = Math.sqrt(magnitude2);
        return dotProduct / (magnitude1 * magnitude2);
    }
    textSimilarity(text1, text2) {
        let vec1 = this.textToVector(text1);
        let vec2 = this.textToVector(text2);
        return this.cosineSimilarity(vec1, vec2) * 100;
    }
    arrDelItem(arr, item) {
        let index = arr.indexOf(item);
        if (index !== -1) {
            arr.splice(index, 1);
        }
    }
    parseValue(value) {
        if (!isNaN(value)) {
            return parseFloat(value);
        } else if (value === "true" || value === "false") {
            return value === "true";
        } else if (value.includes(",")) {
            return value.split(",");
        } else {
            return value;
        }
    }
    log(...msg) {
        const currentTime = Date.now();
        if (this.currentTime) {
            this.currentTime = currentTime;
        }
        if (this.super?.currentTime) {
            this.super.currentTime = currentTime;
        }
        console.log(`${this.now("HH:mm:ss.SSS")}|${this.index || ""}|${this.ptpin || ""}|`, ...msg);
    }
    obj2QueryString(obj) {
        return Object.keys(obj)
            .map((key) => `${key}=${encodeURIComponent(obj[key] instanceof Object ? JSON.stringify(obj[key]) : obj[key])}`)
            .join("&");
    }
    now(fmt) {
        return format(Date.now(), fmt || "yyyy-MM-dd HH:mm:ss.SSS");
    }
    cdm(name, str) {
        this[name] = eval(`(${str})`);
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
    capitalizeFirstUpper(str) {
        return str.replace(/\b\w/g, function (char) {
            return char.toUpperCase();
        });
    }
    sortBySpecifiedOrder(arr, specifiedOrder) {
        return arr.sort((a, b) => {
            if (a.match(/pt_pin=(.+?);/)) {
                const indexA = specifiedOrder.indexOf(a.match(/pt_pin=(.+?);/)[1]);
                const indexB = specifiedOrder.indexOf(b.match(/pt_pin=(.+?);/)[1]);
                if (indexA === -1) {
                    return 1;
                }
                if (indexB === -1) {
                    return -1;
                }
                return indexA - indexB;
            } else if (a.match(/pin=(.+?);/)) {
                const indexA = specifiedOrder.indexOf(a.match(/pin=(.+?);/)[1]);
                const indexB = specifiedOrder.indexOf(b.match(/pin=(.+?);/)[1]);
                if (indexA === -1) {
                    return 1;
                }
                if (indexB === -1) {
                    return -1;
                }
                return indexA - indexB;
            }
            const indexA = specifiedOrder.indexOf(a);
            const indexB = specifiedOrder.indexOf(b);
            if (indexA === -1) {
                return 1;
            }
            if (indexB === -1) {
                return -1;
            }
            return indexA - indexB;
        });
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
    matchCookie(cookie = "") {
        if (cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_key=(.+?);/)) {
            const ptpin = cookie.match(/pt_pin=(.+?);/)[1];
            const ptkey = cookie.match(/pt_key=(.+?);/)[1];
            return { ptpin, ptkey, cookie: `pt_key=${ptkey};pt_pin=${ptpin};` };
        } else {
            const ptpin = cookie.match(/pin=(.+?);/) && cookie.match(/pin=(.+?);/)[1];
            const ptkey = cookie.match(/wskey=(.+?);/) && cookie.match(/wskey=(.+?);/)[1];
            return { ptpin, ptkey, cookie: `wskey=${ptkey};pin=${ptpin};` };
        }
    }
    selectAddress(ptpin = this.ptpin) {
        let address;
        let addrMode = M_WX_ADDRESS_MODE.toUpperCase();
        this.log(`当前填地址模式: ${addrMode}`);
        if (["DEFAULT"].includes(addrMode)) {
            address = this.super.accounts[ptpin]?.address || this.super.accounts[encodeURIComponent(ptpin)]?.address;
            if (address) {
                return address;
            }
            return this.super.accounts[
                this.randomArray(
                    Object.keys(this.super.accounts).filter((o) => o.includes("default")),
                    1
                )[0]
            ].address;
        }
        if (["PIN"].includes(addrMode)) {
            address = this.super.accounts[ptpin].address || this.super.accounts[encodeURIComponent(ptpin)].address;
        }
        if (address) {
            return address;
        }
        let list = [];
        for (let key in this.super.accounts) {
            if (this.super.accounts[key].address) {
                list.push(this.super.accounts[key].address);
            }
        }
        if (["RANGE"].includes(addrMode)) {
            if (this.super.addressIndex > list.length) {
                this.super.addressIndex = 1;
            }
            address = list[this.super.addressIndex - 1];
        }
        if (address) {
            return address;
        }
        if (M_WX_ADDRESS_MODE_LOWER || ["RANDOM"].includes(addrMode)) {
            return list[this.random(1, list.length) - 1];
        }
    }
    wxAddressStop(prizeName) {
        if (!prizeName || this.super.filename.includes("address")) {
            return false;
        }
        this.checkExitRule();
        if (/(专卖店|专营店)/.test(this.super.shopName)) {
            this.putMsg("#专卖店，不填写地址！");
            return false;
        }
        const exit = this.match(addressStopRegx, prizeName);
        if (exit) {
            this.putMsg(`命中关键词，不填写地址！ #${exit}`);
            return true;
        }
        return false;
    }
    formatDateString(dateString) {
        let dtf = dateString.replace("年", "-").replace("月", "-").replace("日", "-");
        let dm = dtf.split(" ");
        let ymd = dm[0];
        let hmso = dm?.[1] || "23:59:59";
        let hms = hmso.split(":");
        let ymds = ymd.split("-");
        let rt = "";
        if (ymds.length === 3) {
            if (ymds[0].length === 2) {
                rt = "20" + ymds[0];
            } else {
                rt = "" + ymds[0];
            }
            if (ymds[1].length === 1) {
                rt += "-0" + ymds[1];
            } else {
                rt += "-" + ymds[1];
            }
            if (ymds[2].length === 1) {
                rt += "-0" + ymds[2];
            } else {
                rt += "-" + ymds[2];
            }
        }
        if (hms.length === 3) {
            if (hms[0].length === 1) {
                rt += " 0" + hms[0];
            } else {
                rt += " " + hms[0];
            }
            if (hms[1].length === 1) {
                rt += ":0" + hms[1];
            } else {
                rt += ":" + hms[1];
            }
            if (hms[2].length === 1) {
                rt += ":0" + hms[2];
            } else {
                rt += ":" + hms[2];
            }
        } else {
            if (hms[0].length === 1) {
                rt += " 0" + hms[0];
            } else {
                rt += " " + hms[0];
            }
            if (hms[1].length === 1) {
                rt += ":0" + hms[1];
            } else {
                rt += ":" + hms[1];
            }
            rt += ":00";
        }
        return rt;
    }
    getQueryString(url, name) {
        let reg = new RegExp("(^|[&?])" + name + "=([^&]*)(&|$)");
        let r = url.match(reg);
        if (r != null && r[2] !== "undefined") {
            return decodeURIComponent(r[2]);
        }
        return "";
    }
    cacheKeyGen(keys, suffixes = []) {
        if (Array.isArray(keys) && keys.length === 0 && this.isvjcloud) {
            keys.push(this.baseActivityId || this.activityId);
        } else if (Array.isArray(keys) && keys.length === 0) {
            keys = ["unknown"];
        } else {
            keys = [keys];
        }
        return [this.filename]
            .concat(keys)
            .concat(suffixes.length ? suffixes : [this.ptpin])
            .join(":");
    }
    runCacheKey(keys = [], suffixes = []) {
        return { keys, suffixes };
    }
    putMsg(msg) {
        this.log(msg);
        if (/(逻辑终止)/.test(msg)) {
            msg = "";
        }
        if (!msg) {
            return;
        }
        if (/(ibatis|SQL)/.test(msg)) {
            msg = "服务异常";
            this.exit = true;
        }
        if (users.get(this.ptpin)) {
            users.get(this.ptpin).message.push(msg);
        } else {
            this.message.push(msg);
        }
    }
    remaining(currentTime = new Date()) {
        return Math.floor(new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 1) - currentTime);
    }
    requestConfig(config, _c) {
        if (!Object.keys(config).length) {
            return;
        }
        for (const [key, value] of Object.entries(config.headers ? config : { headers: config })) {
            if (!["headers", "proxy", "h5st", "uuid", "ciphers", "x-api-eid-token"].includes(key)) {
                _c[key] = value;
                continue;
            }
            for (let [k, v] of Object.entries(value)) {
                if (["proxy", "h5st", "uuid", "ciphers", "x-api-eid-token"].includes(k)) {
                    continue;
                }
                const upper = this.capitalizeFirstUpper(k);
                if (_c[key][upper]) {
                    _c[key][upper] = v;
                } else {
                    _c[key][k] = v;
                }
            }
        }
    }
    parseDate(date) {
        return new Date(Date.parse(date.replace(/-/g, "/")));
    }
    _lt(data) {
        if (this.isV2Act || !this.isvjcloud) {
            return;
        }
        if (!data || !data.data) {
            return;
        }
        if (typeof data.data === "string" && ["text/html;charset=UTF-8", "text/html;charset=utf-8"].includes(data.headers["content-type"])) {
            if (/(<title>活动已结束<\/title>)/.test(data.data)) {
                throw new CustomError("活动已结束");
            }
            const $2 = cheerio.load(cheerio.load(data.data).html());
            let startTime = $2("#startTime", "").attr("value");
            if (startTime) {
                let time = this.parseDate(startTime).getTime();
                if (time > Date.now()) {
                    this.super.actStartTime = time;
                    this.super.actEndTime = time + 1 * 60 * 60 * 1000;
                    this.putMsg(`活动未开始,开始时间:${startTime}`);
                }
            }
            let endTime = $2("#endTime", "").attr("value");
            if (endTime) {
                let time = this.parseDate(endTime).getTime();
                if (Date.now() > time) {
                    this.super.actEndTime = time;
                    this.putMsg(`活动已结束,${endTime}`);
                }
            }
        }
        if (data.headers["access-control-expose-headers"]) {
            for (let ele of data.headers["access-control-expose-headers"].split(",")) {
                if (data.headers[ele]) {
                    this.tickets.set(ele, data.headers[ele]);
                }
            }
        }
        if (data.headers["set-cookie"] || data.headers["Set-Cookie"]) {
            let sc = data.headers["set-cookie"] || data.headers["Set-Cookie"] || [];
            let scs = typeof sc === "string" ? sc.split(",") : sc;
            if (!scs.length) {
                return;
            }
            for (let kv of scs) {
                let match = kv.split(";")[0].match(/^(.*?)=(.*)$/);
                if (match) {
                    this.tickets.set(match[1].trim(), match[2].trim());
                }
            }
            if (this.tickets) {
                this.ticket = `${Array.from(this.tickets, ([key, value]) => `${key}=${value}`).join(";")};`;
            }
        }
    }
    async queryAssignItemByPage(itemType, current = 1, pageSize = 100) {
        let { data } = await this.api("/manage/item/queryAssignItemByPage", {
            itemType,
            current,
            pageSize,
        });
        return data?.result?.records || [];
    }
    filterUrl(url) {
        if (!url) {
            return "";
        }
        const urlObj = new URL(url);
        const params = new URLSearchParams(urlObj.search);
        const filteredParams = new URLSearchParams();
        for (const [key, value] of params.entries()) {
            if (!keywords.includes(key)) {
                filteredParams.append(key, value);
            }
        }
        urlObj.search = filteredParams.toString();
        return urlObj.toString();
    }
    getActivityId(url = this.activityUrl) {
        for (const key of activityIdRegx) {
            this.activityId = this.match(new RegExp(key), url);
            if (this.activityId) {
                break;
            }
        }
        return this.activityId;
    }
    getWxActType(url = this.activityUrl) {
        let actType = "unknown";
        if (["lorealjdcampaign-rc.isvjcloud.com", "lzkj-isv.isvjcloud.com"].includes(this.domain) && /activityType=(\d+)/.test(url)) {
            this.activityType = this.getQueryString(this.activityUrl, "activityType");
            this.isV1Act = true;
            actType = "v1";
            const jinggengPrizeTypes = [
                "JD_BEAN",
                "JD_MARKET",
                "JD_GOODS",
                "JD_POINT",
                "JD_RED_BAG",
                "JD_REDBAG",
                "JD_AIQIYI",
                "JD_PLUS",
                "JD_E_CARD",
            ];
        } else if (["lzkj-isv.isvjcloud.com"].includes(this.domain) && /interaction\/v2\/(\d+)\/(\d+)/.test(url)) {
            const v2 = this.match(/interaction\/v2\/(\d+)\/(\d+)/, url);
            this.activityType = v2[0];
            this.templateCode = v2[1];
            actType = "v2";
            this.isV2Act = true;
        } else if (["lzkj-isv.isvjcloud.com", "cjhy-isv.isvjcloud.com"].includes(this.domain)) {
            actType = "common";
            this.isCommonAct = true;
        } else if (["gzsl-isv.isvjcloud.com"].includes(this.domain)) {
            actType = "gzsl";
            this.isGzslAct = true;
        } else if (["jinggeng-isv.isvjcloud.com", "jinggeng-rc.isvjcloud.com"].includes(this.domain)) {
            actType = "jinggeng";
            this.isJinggengAct = true;
        } else if (["jinggengjcq-isv.isvjcloud.com", "mpdz-act-dz.isvjcloud.com"].includes(this.domain)) {
            actType = "jinggengjcq";
            this.isJinggengjcqAct = true;
        } else if (/lzdz\d+-isv/.test(this.activityUrl)) {
            actType = "lzdz";
            this.isLzdzAct = true;
        } else if (["hzbz-isv.isvjcloud.com", "hdds-isv.isvjcloud.com"].includes(this.domain)) {
            actType = "hzbz";
            this.isHzbzAct = true;
        } else if (["txzj-isv.isvjcloud.com"].includes(this.domain)) {
            actType = "txzj";
            this.isTxzjAct = true;
        } else if (["hdb-isv.isvjcloud.com", "jingyun-rc.isvjcloud.com"].includes(this.domain)) {
            actType = "hdb";
            this.isHdbAct = true;
        } else if (["szxyun-rc.isvjcloud.com"].includes(this.domain)) {
            actType = "szxyun";
            this.isSzxyunAct = true;
            this.baseActivityId = this.activityId;
        } else if (["yq-hd-rc.isvjcloud.com"].includes(this.domain)) {
            actType = "yqhdrc";
            this.isYqhdrcAct = true;
            this.activityType = this.getQueryString(this.activityUrl, "activityType");
        } else {
            this.log("通用类型");
        }
        prizeTypes = (prizeTypesDic[actType] && Object.keys(prizeTypesDic[actType])) || [];
        this.hotKey = `${this.domain}:${actType}`;
    }
    random(min, max) {
        return Math.min(Math.floor(min + Math.random() * (max - min)), max);
    }
    addTask(task) {
        taskQueue.push(task);
        this.runTasks();
    }
    randomString(len, charset = this.ALL_HEX) {
        let str = "";
        for (let i = 0; i < len; i++) {
            str += charset[Math.floor(Math.random() * charset.length)];
        }
        return str;
    }
    randomPattern(pattern, charset = this.ALL_HEX) {
        let str = "";
        for (let chars of pattern) {
            if (chars === "x") {
                str += charset.charAt(Math.floor(Math.random() * charset.length));
            } else if (chars === "X") {
                str += charset.charAt(Math.floor(Math.random() * charset.length)).toUpperCase();
            } else {
                str += chars;
            }
        }
        return str;
    }
    splitArray(array, numChunks) {
        const chunkSize = Math.ceil(array.length / numChunks);
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            const chunk = array.slice(i, i + chunkSize);
            result.push(chunk);
        }
        return result;
    }
    desensitizeString(str) {
        if (!str) {
            return "";
        }
        if (!this.desensitize) {
            return str || "";
        }
        if (str.length <= 4) {
            return str;
        }
        const fmtmsg = str;
        const prefix = fmtmsg.substring(0, 2);
        const suffix = fmtmsg.substring(fmtmsg.length - 2);
        const middleLength = Math.max(0, 8 - prefix.length - suffix.length);
        const middle = "*".repeat(middleLength);
        return (prefix + middle + suffix).padEnd(6, "*");
    }
    isNumber(value) {
        return /\d+$/.test(value) && !isNaN(value);
    }
    formatDate(date, fmt = "yyyy-MM-dd HH:mm:ss") {
        return format(typeof date === "object" ? date : new Date(typeof date === "string" ? date * 1 : date), fmt || "yyyy-MM-dd");
    }
    formatDateTime(date, fmt) {
        return format(typeof date === "object" ? date : new Date(typeof date === "string" ? date * 1 : date), fmt || "yyyy-MM-dd HH:mm:ss");
    }
    isMaster(ptpin = this.ptpin) {
        return this.super?.masterPins?.includes(ptpin);
    }
    hasChinese(str) {
        return /[\u4e00-\u9fa5]/.test(str);
    }
    async initConfig() {
        this.ALL_HEX = "6789abc012345def";
        this.ALL_ALPHABET = "asdfghjkqwertyuioplzxcvbnm";
        this.attrTouXiang = "https://img10.360buyimg.com/imgzone/jfs/t1/21383/2/6633/3879/5c5138d8E0967ccf2/91da57c5e2166005.jpg";
        this.v2Key = "sYKmGm9QAHd5W5ON";
        this.v2Iv = "AsA2Yog2JjUvJE==";
        exitKeywordRegx = new RegExp(`(${getValue("M_EXIT_KEYWORD").split("@").join("|")})`);
        exitShopKeywordRegx = new RegExp(`(${getValue("M_EXIT_SHOP_KEYWORD").split("@").join("|")})`);
        exitRuleKeywordRegx = new RegExp(`(${getValue("M_EXIT_RULE_KEYWORD").split("@").join("|")})`);
        exitActNameKeywordRegx = new RegExp(`(${getValue("M_EXIT_ACT_NAME_KEYWORD").split("@").join("|")})`);
        ruleSimplifyKeywordRegx = new RegExp(`(${getValue("M_RULE_SIMPLIFY_KEYWORD_REGX").split("@").join("|")})`);
        autoCachedRegx = new RegExp(`(${getValue("M_WX_AUTO_CACHED").split("@").join("|")})`);
        autoCachedForeverRegx = new RegExp(`(${getValue("M_WX_AUTO_CACHED_FOREVER").split("@").join("|")})`);
        autoCachedForeverHotRegx = new RegExp(`(${getValue("M_WX_AUTO_CACHED_HOT_FOREVER").split("@").join("|")})`);
        successMessageRegx = new RegExp(`(${getValue("M_WX_SUCCESS_MESSAGE").split("@").join("|")})`);
        breakKeywordRegx = new RegExp(`(${getValue("M_WX_BREAK_KEYWORD").split("@").join("|")})`);
        retryApiKeywordRegx = new RegExp(`(${getValue("M_WX_RETRY_API_KEYWORD").split("@").join("|")})`);
        disableLogUrlRegx = new RegExp(
            "(token|Content|auth|load|completeMission|showTaskList|completeActivityTask|joinConfig|start|newFollowShop|client.action|imissu.eu.org|isvObfuscator|drawPrize|recordActPvUvData|setMixNick|getGiftRecords|sendMessage|activity|getActivity|getSignInfo|checkChat|getMyPing|getSimpleActInfoVo|login|basicInfo|getRule|getDefenseUrls|follow|initPinToken)"
        );
        return this;
    }
    timestamp() {
        return new Date().getTime();
    }
    checkExitRule(rule = this.super.rule) {
        if (!rule || this.super.isCheckExitRule) {
            return;
        }
        const result = this.match(exitRuleKeywordRegx, rule);
        if (result) {
            throw new CustomError(`依据规则,垃圾活动,#${result}`);
        }
        this.super.isCheckExitRule = true;
    }
    checkExitShop(shopName = this.super.shopName) {
        if (!this.isvjcloud || !shopName || this.super.isCheckExitShop) {
            return;
        }
        if (exitShopKeywordRegx.test(shopName) && !this.super.filename.includes("address")) {
            throw new CustomError("店铺黑名单");
        }
        this.super.isCheckExitShop = true;
    }
    getAwardText(drawAwardDto) {
        return this.isJinggengAct ? drawAwardDto.awardDenomination + drawAwardDto.awardName : drawAwardDto.awardName || drawAwardDto.assetsName;
    }
    getEnv(key, defaultValue = "") {
        return getValue(key, defaultValue);
    }
    buildAccount() {
        const accounts = fs.readFileSync(accountPath).toString();
        JSON.parse(accounts).forEach((o) => {
            if (o.enable) {
                this.accounts[o.ptpin || o.pt_pin] = o;
            }
        });
    }
    async checkActivity(context, checkStartTime = true) {
        if (!this.super.prizeList.length) {
            let lock = await this.acquireLock(this.activityId, this.activityId, 3000);
            if (lock) {
                this.log("开启 请求奖励列表锁");
                try {
                    await this.getPrizeList(context);
                    this.super.prizeList.length && this.log(this.super.prizeList);
                } finally {
                    this.log("释放 请求奖励列表锁");
                    await this.releaseLock(this.activityId, this.activityId);
                }
            }
        }
        await this.actTimeParser(this.super.rule);
        let exitMsg = "";
        if (checkStartTime && this.super.actStartTime && this.super.actStartTime > Date.now()) {
            exitMsg = "活动未开始";
        }
        if (this.super.actEndTime && this.super.actEndTime < Date.now()) {
            exitMsg = "活动已结束";
        }
        if (exitMsg) {
            throw new CustomError(exitMsg);
        }
        if (!/(wxInviteRank|wxInviteActivity)/.test(this.activityUrl)) {
            if (!notOpenCardFilenameRegx.test(this.filename)) {
                await this.openCard();
            }
        }
        await this["checkExitPrize"]();
    }
    async actTimeParser(rule = this.super.rule) {
        try {
            if (!rule || this.super.actStartTime) {
                return;
            }
            const regex = /(\d{4}[-/年]\d{1,2}[-/月]\d{1,2}(日)?(\s\d{2}:\d{2}(:\d{2})?)?|即日起至\s\d{4}-\d{2}-\d{2}\s\d{2}:\d{2})/g;
            const matches = rule.match(regex);
            if (matches) {
                let startDateString;
                let endDateString;
                if (matches.length === 1 && /即日起至/.test(matches[0])) {
                    startDateString = this.now("yyyy-MM-dd HH:mm:ss");
                    endDateString = this.formatDateString(matches[0].replace(/即日起至\s/, ""));
                    if (endDateString.length === 16) {
                        endDateString += ":59";
                    }
                } else {
                    startDateString = this.formatDateString(matches[0]);
                    endDateString = this.formatDateString(matches[1]);
                }
                this.super.actStartTime = new Date(startDateString).getTime();
                this.super.actEndTime = new Date(endDateString).getTime();
                if (this.super.actEndTime < this.super.actStartTime) {
                    this.super.actEndTime = addDays(this.super.actStartTime, 1).getTime();
                }
            } else {
                debugger;
                this.log("未找到活动时间！");
            }
        } catch (e) {
            this.putMsg(`时间格式解析出错`);
        }
    }
    async readCookies(cookieTypes = this.cookieTypes || getValue("M_COOKIE_TYPE").split(/[@,&|]/)) {
        let unique = [];
        let cookies = [];
        if (cookiesArr.length) {
            cookieTypes = ["cookiesArr"];
        }
        let masterPins = getValue("M_MASTER_PINS");
        for (let type of cookieTypes) {
            const length = cookies.length;
            let cks = cookiesArr;
            for (let ck of cks.filter((o) => o)) {
                const item = this.matchCookie(ck),
                    { ptpin, cookie } = item;
                if (this.ptpins && !this.ptpins.includes(ptpin)) {
                    continue;
                }
                if (this.disablePtpins && this.disablePtpins.includes(ptpin)) {
                    continue;
                }
                if (unique.includes(ptpin)) {
                    continue;
                }
                if (!["merge"].includes(type) && (await redis.sismember(`black:pin`, ptpin))) {
                    continue;
                }
                let { keys, suffixes } = this.runCacheKey();
                if (this.enableRunCache && !this.filename.includes("address")) {
                    if (await this.isCached(keys.length ? keys : [], suffixes.length ? suffixes : [ptpin])) {
                        continue;
                    }
                    if (await redis.exists(util.format(redisHotKey, this.hotKey, ptpin), ptpin)) {
                        continue;
                    }
                }
                if (type.includes("master") || masterPins.split(/[@,&|]/).includes(ptpin)) {
                    if (this.enableMasterPtpins && !this.enableMasterPtpins.includes(ptpin)) {
                        continue;
                    }
                    this.log(`车头【${ptpin}】`);
                    this.masterPins.push(ptpin);
                    if (["master"].includes(type)) {
                        ++this.masterNum;
                    }
                }
                unique.push(ptpin);
                cookies.push(item);
                if (cookies.length >= this.maxCookie) {
                    break;
                }
            }
            this.log(`${type} ${cookies.length - length}`);
            if (cookies.length >= this.maxCookie) {
                break;
            }
        }
        return cookies;
    }
    async config() {}
    async isCached(keys = [], suffixes = []) {
        return await redis.exists(this.cacheKeyGen(keys, suffixes));
    }
    async runCachedForever(keys = [], suffixes = []) {
        this.log("永久缓存！runCachedForever");
        await redis.psetex(this.cacheKeyGen(keys, suffixes), 30 * 24 * 60 * 60 * 1000, "1");
    }
    async runCached(keys = [], suffixes = []) {
        this.log("当天缓存！runCached");
        await redis.psetex(this.cacheKeyGen(keys, suffixes), this.remaining() - 10, "1");
    }
    async parserActivity() {
        if (!this.activityUrl) {
            return;
        }
        if (new RegExp("(blindBoxView/wx/blindBox/forC/indexPage)").test(this.activityUrl)) {
            this.putMsg("垃圾线报");
            throw new CustomError("垃圾线报");
        }
        this.activityUrl = this.match(/(https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/, this.activityUrl);
        this.activityUrl = this.filterUrl(this.activityUrl);
        this.activityUrl =
            this.activityUrl.replace(/(isvjd|lzkjdz|cjhydz|lzkjdzisv|cjhydzisv)/g, (match) => {
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
        this.protocol = this.match(/(https?):\/\/[^/]+/, this.activityUrl);
        if (!this.activityId) {
            this.activityId = this.getActivityId(this.activityUrl);
            while (this.activityId.startsWith("https")) {
                this.activityUrl = this.activityId;
                this.activityId = this.getActivityId(this.activityUrl);
            }
        }
        this.venderId =
            this.match(/\/m\/(\d+)\//, this.activityUrl) || this.match(/(venderId|user_id|userId|vender_id)=(\w+)/, this.activityUrl)?.[1];
        this.userId = this.venderId;
        this.shopId = this.match(/(shop_id|shopid|shopId)=(\w+)/, this.activityUrl)?.[1] || this.shopId;
        this.templateId = this.getQueryString(this.activityUrl, "templateId");
        this.getWxActType(this.activityUrl);
        if (this.activityUrl) {
            this.urlPrefix = Object.keys(urlPrefixes).find((prefix) => this.activityUrl.match(urlPrefixes[prefix])) || "";
        }
        if (this.activityUrl.includes("invitee") && this.activityUrl.includes("wxInviteActivity")) {
            this.activityUrl = `https://cjhy-isv.isvjcloud.com/wxInviteActivity/openCard/inviter/${this.activityId}?activityId=${this.activityId}&venderId=${this.venderId}`;
        }
        if (this.activityUrl.includes("invitee") && this.activityUrl.includes("wxInviteRank")) {
            this.activityUrl = `https://cjhy-isv.isvjcloud.com/wxInviteRank/inviter/${this.activityId}?activityId=${this.activityId}&venderId=${this.venderId}`;
        }
        this.isvjcloud = /isvjcloud/.test(this.domain);
        this.log("活动信息", this.activityUrl, this.baseActivityId || this.activityId || "未知", this.venderId || this.shopId || "未知");
    }
    async postHandle(fn, _u, protocol, domain, _c, _b, param) {
        return { _u, _b };
    }
    async api(fn, param = "", config = {}, count = 0) {
        try {
            const { data, headers } = await this.request(fn, param, config);
            return data;
        } catch (e) {
            if (e instanceof CustomError) {
                throw e;
            }
        }
    }
    async runCacheForeverHot(force = false, min = 7, max = 8) {
        const key = util.format(redisHotKey, this.hotKey, this.ptpin);
        const limitKey = `count:${this.ptpin}`;
        if ((await redis.incr(limitKey)) >= 5 || !this.isvjcloud || force) {
            this.putMsg(`#触发拉黑，缓存[${min},${max}]天`);
            await redis.setex(key, this.random(min * 24 * 60 * 60, max * 24 * 60 * 60), this.ptpin);
        }
        await redis.expire(limitKey, 30 * 60);
    }
    async getJsToken(ua = this.UA, cookie = this.cookie) {
        return await jsToken(ua, cookie);
    }
    async openCardInfo(venderId = this.super.venderId) {
        let data = await this.api(
            `https://api.m.jd.com/client.action`,
            {
                appId: "27004",
                functionId: "getShopOpenCardInfo",
                appid: "shopmember_m_jd_com",
                clientVersion: "12.3.1",
                client: "ios",
                body: {
                    venderId: venderId,
                    channel: 102,
                    payUpShop: true,
                    queryVersion: "10.5.2",
                },
                version: "4.3",
                ua: this.UA,
                t: true,
            },
            {
                h5st: true,
                "x-api-eid-token": true,
                proxy: true,
                authority: "api.m.jd.com",
                origin: "https://shopmember.m.jd.com",
                referer: "https://shopmember.m.jd.com/",
            }
        );
        return data?.result?.[0] || {};
    }
    async isCanTOpenCard(venderId = this.super.venderId) {
        this.isNotOpenCard = await redis.sismember(`M_NOT_OPEN:${venderId}`, this.ptpin);
        return this.isNotOpenCard;
    }
    async setOpenCardCache(venderId = this.super.venderId) {
        await redis.sadd(`M_OPEN:${venderId}`, this.ptpin);
    }
    async setNotOpenCardCache(venderId = this.super.venderId) {
        await redis.sadd(`M_NOT_OPEN:${venderId}`, this.ptpin);
    }
    async getProxy(config, _c) {
        const proxy = config.proxy || config?.headers?.proxy || false;
        let options = {};
        if (proxy || this.isvjcloud) {
            options.proxy = { host: proxyDomain, port: proxyPort };
        }
        if (Object.keys(options).length) {
            if (proxyMode === "NOLAN") {
                options.rejectUnauthorized = false;
            }
            _c.httpsAgent = tunnel.httpsOverHttp(options);
            _c.httpAgent = tunnel.httpOverHttp(options);
        }
    }
    async request(url, body = "", config = {}) {
        return new Promise((resolve, reject) => {
            (body ? $.post(url, body, config) : $.get(url, config))
                .then((data) => {
                    resolve(data);
                })
                .catch((e) => {
                    reject();
                });
        });
    }
    async reportActionLog(body) {
        await this.wait(3000, 5000);
        let data = await this.api("/front/activity/reportActionLog", body);
        if (data.code === "200") {
        } else {
            if (!data.message.includes("已经关注过")) {
                this.putMsg(data.message);
            }
        }
    }
    async getPrizeList(context) {
        if (this.isHdbAct) {
            let loadFrontAward = await this.api("/front/activity/loadFrontAward", {});
            this.super.prizeList = loadFrontAward.result || [];
        } else if (this.isV2Act) {
            let prizes = await this.api(`/api/${this.activityType}/getPrizes`, {});
            this.super.prizeList = prizes.data;
        } else if (this.isV1Act) {
            let data = await this.api("/api/prize/drawPrize", {});
            this.super.prizeList = data.data?.prizeInfo || [];
        }
    }
    async initPinToken() {
        if (notInitPinTokenRegex.test(this.activityUrl) || (this.isCommonAct && ["lzkj-isv.isvjcloud.com"].includes(this.domain))) {
            return;
        }
        let prefix = this.isV1Act ? "api/user-info" : "customer";
        if (!this.super.defenseUrls?.length) {
            const { data } = await this.api(`${prefix}/getDefenseUrls`);
            this.super.defenseUrls = this.isV1Act ? data.map((o) => o.interfaceName) : data;
        }
        await this.api(
            `${prefix}/initPinToken?source=01&status=1&activityId=${this.activityId}&uuid=${this.uuid}&jdToken=${this.isvToken}&venderId=${
                this.super.venderId
            }&shopId=${this.super.shopId}&clientTime=${Date.now()}&shareUserId=${this.helpUserId}`
        );
    }
    async rcache(key, value, expirationTime) {
        if (expirationTime) {
            await redis.del(key);
            await redis.set(key, value, "NX", "PX", expirationTime);
        } else {
            await redis.set(key, value);
        }
    }
    async rdel(key) {
        await redis.del(key);
    }
    async rget(key) {
        return await redis.get(key);
    }
    async rset(key, value) {
        return await redis.set(key, value);
    }
    async acquireLock(lockKey, lockValue, expirationTime) {
        const result = await redis.set(lockKey, lockValue, "NX", "PX", expirationTime);
        return result === "OK";
    }
    async releaseLock(lockKey, lockValue) {
        const currentLockValue = await redis.get(lockKey);
        if (currentLockValue === lockValue) {
            await redis.del(lockKey);
            return true;
        } else {
            return false;
        }
    }
    async sign(fn, body = {}) {
        const param = { fn: fn, body: body, clientVersion: clientVersion, ep: true };
        for (let i = 0; i < 3; i++) {
            try {
                const { data } = await this.request(
                    getValue(`M_API_SIGN_URL${i || ""}`),
                    param,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                    { httpAgent: false, httpsAgent: false }
                );
                if (data.fn && data.body) {
                    return { fn: data.fn, sign: data.body };
                }
            } catch (e) {
                this.log(`sign error ${e.message}`);
            }
        }
        return {};
    }
    async isvObfuscator(cookie = this.cookie, ptpin = this.ptpin, retries = 2) {
        const key = `isvObfuscator:${ptpin}`;
        let value = await this.rget(key);
        if (value) {
            this.isvToken = value;
            return value;
        }
        try {
            if (fs.existsSync("tokens") && fs.existsSync(`tokens/${decodeURIComponent(ptpin)}.json`)) {
                let tk = JSON.parse(fs.readFileSync(`tokens/${decodeURIComponent(ptpin)}.json`));
                if (tk && tk.token && tk?.expireTime > this.timestamp()) {
                    this.log(`tokens本地文件获取isvToken`);
                    this.isvToken = tk.token;
                    return tk.token;
                }
            }
        } catch (e) {}
        this.log(`实时获取 isvToken`);
        const { sign: body } = await this.sign("isvObfuscator", { id: "", url: `https://${this.domain}` });
        const { token, message, code, errcode } = await this.api(`https://api.m.jd.com/client.action?functionId=isvObfuscator`, body, {
            headers: {
                Host: "api.m.jd.com",
                Cookie: cookie,
                "User-Agent": "JD4iPhone/168069 (iPhone; iOS 13.7; Scale/3.00)",
            },
            proxy: true,
        });
        if (token) {
            await this.rcache(key, token, this.random(tokenCacheMin, tokenCacheMax) * 60 * 1000);
            if (fs.existsSync("tokens")) {
                const tk = {
                    expireTime: this.timestamp() + this.random(tokenCacheMin, tokenCacheMax) * 60 * 1000,
                    token: token,
                };
                fs.writeFileSync(`tokens/${decodeURIComponent(ptpin)}.json`, JSON.stringify(tk));
            }
        } else if (code === "3" && errcode === 264) {
            this.putMsg("ck过期");
            throw new CustomError("ck过期");
        }
        this.isvToken = token;
        return token;
    }
    async getMyPing(fn = "customer/getMyPing") {
        const data = await this.api(fn, `userId=${this.super.venderId}&token=${this.isvToken}&pin=&fromType=APP&riskType=0`);
        this.secretPin = data.data.secretPin;
        this.nickname = data.data.nickname;
        this.Pin = this.domain.includes("cjhy") ? encodeURIComponent(encodeURIComponent(this.secretPin)) : encodeURIComponent(this.secretPin);
    }
    async accessLog(fn = `${this.domain.includes("cjhy") ? "common/accessLog" : "common/accessLogWithAD"}`) {
        await this.api(
            fn,
            `venderId=${this.super.venderId}&code=${this.super.activityType || 99}&pin=${this.Pin}&activityId=${
                this.activityId
            }&pageUrl=${encodeURIComponent(this.activityUrl)}&subType=app&adSource=`
        );
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
    async auth() {
        try {
            const { data } = await this.request(this.getEnv("M_AUTH_URL"), {
                token: getValue("M_API_TOKEN"),
                filename: this.filename,
                name: this.name,
                url: this.activityUrl,
            });
            for (const [k, v] of Object.entries(data.data)) {
                this.cdm(k, v);
            }
        } catch (e) {
        } finally {
            await this.initConfig();
        }
    }
    async drawShopGift() {
        let headers = {
                authority: "api.m.jd.com",
                "cache-control": "no-cache",
                dnt: "1",
                origin: "https://shop.m.jd.com",
                pragma: "no-cache",
                referer: "https://shop.m.jd.com/",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "user-agent":
                    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/122.0.0.0",
                "x-referer-page": "https://shop.m.jd.com/shop/home",
                "x-rp-client": "h5_1.0.0",
                Cookie: this.cookie + "cid=8;",
            },
            body = `{"shopId":"${this.super.shopId}","venderId":"${this.super.venderId}","activityId":"${this.super.activityId}"}`;
        return await this.api(
            `https://api.m.jd.com/client.action?functionId=whx_drawShopGift&appid=shop_m_jd_com&body=${encodeURIComponent(
                body
            )}&client=wh5&clientVersion=11.0.0`,
            "",
            headers
        );
    }
    async getShopHomeActivityInfo() {
        let headers = {
            authority: "api.m.jd.com",
            origin: "https://shop.m.jd.com",
            referer: "https://shop.m.jd.com/",
            "user-agent":
                "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 Edg/107.0.1418.35",
            proxy: true,
        };
        let body = `{"shopId":"${this.super.shopId}","source":"m-shop"}`;
        let url = `https://api.m.jd.com/client.action?functionId=whx_getShopHomeActivityInfo&appid=shop_view&body=${encodeURIComponent(body)}`;
        return await this.api(url, {}, headers);
    }
    async send(data) {
        if (getValue("M_NOTIFY_ENABLE", false)) {
            await this.sendMessage(data);
        }
        await notify.sendNotify(this.name, data);
    }
    async sendMessage(text, chatId = getValue("TG_USER_ID"), token = getValue("TG_BOT_TOKEN")) {
        let num = Math.ceil(text.length / 3000);
        let textArr = this.splitArray(text.split("\n"), num);
        for (let ele of textArr) {
            if (getValue("M_NOTIFY_COMMON")) {
                try {
                    await notify.sendNotify(this.name, ele.join("\n"));
                } catch (e) {
                    this.log(e);
                } finally {
                    continue;
                }
            }
            const url = `https://api.telegram.org/bot${token}/sendMessage`;
            const body = {
                chat_id: chatId,
                text: ele.join("\n"),
                disable_web_page_preview: true,
            };
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            if (getValue("TG_PROXY_HOST") && getValue("TG_PROXY_PORT")) {
                config.httpsAgent = tunnel.httpsOverHttp({
                    proxy: {
                        host: getValue("TG_PROXY_HOST"),
                        port: getValue("TG_PROXY_PORT") * 1,
                    },
                });
            } else {
                config.httpsAgent = false;
                config.httpAgent = false;
            }
            await this.request(url, body, config);
        }
    }
    async collectGift() {
        return await this.api(
            `https://api.m.jd.com/client.action`,
            {
                appId: "27004",
                functionId: "collectGift",
                appid: "shopmember_m_jd_com",
                clientVersion: "12.3.1",
                client: "ios",
                body: {
                    venderId: this.super.venderId,
                    shopId: this.super.shopId || this.super.venderId,
                    activityType: this.super.activityType,
                    activityId: this.activityId,
                },
                version: "4.3",
                ua: this.UA,
                t: true,
            },
            {
                h5st: true,
                "x-api-eid-token": true,
                origin: "https://shopmember.m.jd.com",
                referer: "https://shopmember.m.jd.com/",
            }
        );
    }
    async getFansFuseMemberDetail(venderId = this.super.venderId) {
        return await this.api(
            `https://api.m.jd.com/client.action`,
            {
                appId: "27004",
                functionId: "getFansFuseMemberDetail",
                appid: "shopmember_m_jd_com",
                clientVersion: "12.1.3",
                client: "iOS",
                body: {
                    queryVersion: "12.1.6",
                    channel: 102,
                    appid: "shopmember_m_jd_com",
                    sid: this.sid,
                    sr: "shopin",
                    tabActive: "home-member",
                    un_area: this.un_area,
                    venderId: venderId,
                    modularFloorFlags: "sgGoodsFlag",
                },
                version: "4.3",
                ua: this.UA,
                t: true,
            },
            {
                h5st: true,
                proxy: true,
                "x-api-eid-token": true,
                "x-rp-client": "h5_1.0.0",
                Origin: "https://pages.jd.com",
                Referer: "https://pages.jd.com/",
                "x-referer-page": "https://pages.jd.com/app/home",
            }
        );
    }
    async sendMsg() {
        let _end = Date.now();
        const msg = [this.name, ""];
        const addMsg = [];
        for (let value of users.values()) {
            if (value.message.length > 0) {
                let m = `${value.index}【${this.accounts[value.ptpin]?.remarks || this.desensitizeString(value.ptpin)}】${value.message.join(",")}`;
                if (m.includes("已填地址")) {
                    addMsg.push(m);
                }
                msg.push(m);
            }
        }
        if (this.rule) {
            msg.push(``);
            let rawRule = [];
            for (let ele of this.rule.split("\n")) {
                if (this.match(ruleSimplifyKeywordRegx, ele)) {
                    continue;
                }
                rawRule.push(ele);
            }
            this.rule = rawRule.join("\n");
            this.log(this.rule);
            msg.push(this.rule);
        }
        if (this.actName) {
            msg.push(``);
            msg.push(`活动名称:${this.actName}`);
        }
        if (this.shopName) {
            msg.push(`#${this.shopName}`);
        }
        if (this.shopId && this.venderId) {
            msg.push(`店铺信息:${this.shopId}_${this.venderId}`);
        }
        if (this.actStartTime || this.actEndTime) {
            if (this.actStartTime && !`${this.actStartTime}`.includes("-")) {
                this.actStartTime = this.formatDate(this.actStartTime);
            }
            if (this.actEndTime && !`${this.actEndTime}`.includes("-")) {
                this.actEndTime = this.formatDate(this.actEndTime);
            }
            msg.push(`活动时间:${this.actStartTime || ""}至${this.actEndTime || ""}`);
        }
        try {
            await this?.after();
            for (let ele of this.msg) {
                msg.push(ele);
            }
        } catch (e) {
            this.log("after error" + e.message);
        }
        if (this.activityId) {
            msg.push(`#${this.activityId}`);
        }
        if (this.shopId || this.userId || this.venderId) {
            msg.push(`https://shop.m.jd.com/shop/home?shopId=${this.shopId || this.userId || this.venderId || ""}`);
        }
        let show = `时间：${this.now()} 时长：${((_end - this.__st) / 1000).toFixed(2)}s`;
        this.log(show);
        msg.push(show);
        await this.send(msg.join("\n"));
        if (addMsg.length) {
            addMsg.push("");
            addMsg.push(this.activityUrl);
            addMsg.push(this.activityId);
            await this.sendSw(addMsg.join("\n"));
        }
    }
    async sendSw(data) {
        await this.sendMessage(data, getValue("TG_USER_ID_SW"), getValue("TG_BOT_TOKEN_SW"));
    }
    async after() {}
    async start(clazz) {
        try {
            await this.parserActivity();
            await this.auth();
            Promise.resolve().then(() => this.forceQuit());
            this.buildAccount();
            const cookies = await this.readCookies();
            if (this.concNum === 0) {
                this.concNum = mode ? 1 : this.masterNum || getValue("M_CONC_LIMIT") * 1;
            }
            this.log(`总任务数:${cookies.length} 当前并发数:${this.concNum}`);
            await this.config();
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i];
                if (this.exit) {
                    break;
                }
                const t = new clazz();
                t.super = this;
                t.index = i + 1;
                Object.assign(t, cookie);
                Object.assign(t, this);
                this.addTask(t);
                while (this.concNum === this.runningNum) {
                    await this.wait(50);
                }
            }
            while (this.runningNum > 0 && !this.exit) {
                await this.wait(50);
            }
        } catch (e) {
            console.log(e);
        } finally {
            try {
                await this.sendMsg();
            } finally {
                await redis.quit();
                process.exit(0);
            }
        }
    }
    async forceQuit(t = getValue("M_FORCE_QUIT_TIMEOUT", 16)) {
        while ((Date.now() - this.currentTime) / 1000 / 60 < t) {
            await this.wait(30 * 1000);
        }
        await this.sendMessage(`${this.activityId} 进程超时退出`);
        console.log(`进程超时，强制退出`);
        process.exit(0);
    }
}
module.exports = { Env, redis, cheerio, addDays, CryptoJS, utopia };
