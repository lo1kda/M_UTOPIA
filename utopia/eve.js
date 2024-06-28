let mode = __dirname.includes("Work");
let testMode = process.env.M_TEST_MODE?.includes("on") ? true : mode;
const axios = require("axios"),
    Redis = require("ioredis"),
    cheerio = require("cheerio"),
    notify = require("./sendNotify");
let jdCookieNode = require("./jdCookie.js");
const CryptoJS = require("crypto-js");
let base64 = require("base-64");
try {
    base64 = require("base-64");
} catch (e) {
    console.error("请安装base-64依赖");
}
let NodeRSA;
try {
    NodeRSA = require("node-rsa");
} catch (e) {
    console.error("请安装node-rsa依赖");
}
const v2_key = "Hd5W5ONsYKmGm9QA",
    v2_iv = "2JjUvJEAsA2Yog==",
    machineId = require("node-machine-id"),
    h5sts = require("./h5sts.js"),
    fs = require("fs");
let wxJcTypes = [0, 1, 8, 17],
    wx100JcTypes = [2, 102],
    jinggengJcTypes = ["COUPON", "JD_D_COUPON", "JD_COUPON"],
    blackLuckDrawRule = (process.env.M_WX_BLACK_LUCK_DRAW_RULE || "FITURE|FITURE").split(/[@,&|]/).join("|"),
    openCardTypes = ["10033", "10006", "10043", "10052", "10068"];
process.env.M_WX_OPEN_CARD_TYPES ? process.env.M_WX_OPEN_CARD_TYPES.split(/[@,&|]/).forEach((item) => openCardTypes.push(item)) : "";
const redisUrl = process.env.M_REDIS_URL || "redis://:.T]x;M!()G^-0ckrBPoWCNln3@@172.17.0.1:6379/0",
    redis = new Redis(redisUrl, { keyPrefix: "magic:" });
let proxyRegx = process.env.M_WX_PROXY_ENABLE_REGEXP
    ? process.env.M_WX_PROXY_ENABLE_REGEXP
    : "(EAI_AGAIN|Request failed with status code 504)|(Request failed with status code 403)|disconnected|(Request failed with status code 493)|certificate|timeout|ECONNREFUSED|ETIMEDOUT|(tunneling socket could not be established)";
const hdbTypes = ["hdb-isv.isvjcloud.com", "jingyun-rc.isvjcloud.com"],
    jinggengTypes = ["jinggeng-isv.isvjcloud.com", "jinggeng-rc.isvjcloud.com"],
    jinggengcjTypes = ["jinggengjcq-isv.isvjcloud.com", "mpdz-act-dz.isvjcloud.com"],
    keywords = [
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
        "token",
        "pps",
        "encryptOpenId",
        "gx",
        "gxd",
        "accessToken",
    ];
let ckms = new Map();
Object.keys(jdCookieNode).length > 0 &&
    Object.keys(jdCookieNode).forEach((item) => {
        let node = jdCookieNode[item]?.["match"](/pt_pin=([\w\-\%]+)/)[1];
        ckms.set(node, jdCookieNode[item]);
    });
try {
    let paths = process.env?.["M_COOKIE_FILE_PATHS"]?.["split"](/[@,&|]/) || "/home/magic/Work/wools/magic/cks.txt".split(/[@,&|]/);
    for (let path of paths) {
        if (!fs.existsSync(path)) continue;
        let cks = fs.readFileSync(path).toString().split(
            "\
"
        );
        for (let ck of cks) {
            try {
                if (ck.includes("pt_key")) {
                    ck = ck.trim().replace(
                        "\
",
                        ""
                    );
                    let _pt_key = ck.match(/pt_key=([\w\-]+)/)?.[1],
                        _pt_pin = ck.match(/pt_pin=([\w\-\%]+)/)?.[1];
                    if (!_pt_key || !_pt_pin) continue;
                    ckms.set(_pt_pin, "pt_key=" + _pt_key + ";pt_pin=" + _pt_pin + ";");
                }
            } catch (e) {}
        }
    }
    console.log("files " + ckms.size);
} catch (e) {}
let cookies = Array.from(ckms.values()).filter((item) => item.includes("pt_pin") && item.includes("pt_key")),
    proxies = [];
for (let i = 0; i < 20; i++) {
    try {
        if (!process.env["M_WX_PROXY_POOL_URL" + (i || "")]) continue;
        proxies.push({
            index: i + 1,
            url: process.env["M_WX_PROXY_POOL_URL" + (i || "")],
            type: process.env["M_WX_PROXY_POOL_TYPE" + (i || "")],
            close: process.env["M_WX_PROXY_POOL_CLOSE" + (i || "")] || "",
        });
    } catch (e) {
        console.log("读取代理配置 出错", e);
    }
}
const { format } = require("date-fns"),
    tunnel = require("tunnel");
let disableActivityType = ["10999", "10101", "10102", "10100", "10099", "10098", "10097", "10088", "10083", "10077", "10048", "10030", "10015"];
const urlPrefixes = {
        "/prod/cc/interactsaas": /interactsaas/,
        "/crm-proya/apps/interact": /crm-proya/,
        "/apps/interact": /lorealjdcampaign-rc.isvjcloud.com\/prod\/cc/,
        "prod/cc/cjwx": /lorealjdcampaign-rc.isvjcloud.com\/prod\/cc\/cjwx/,
        "/apps/interact": /lorealjdcampaign-rc.isvjcloud.com\/interact/,
        "/prod/cc/interaction/v1": /interaction\/v1/,
        "/prod/cc/interaction/v2": /interaction\/v2/,
    },
    isvTokenRetryCount = parseInt(process.env?.["M_WX_TOKEN_RETRY_COUNT"] || 2),
    isvObfuscatorRetryWait = parseInt(process.env?.["M_WX_ISVOBFUSCATOR_RETRY_WAIT"] || 2);
let wxTeamInitUrl = "(lzdz1|showPartition|/lzclient/|/wxTeam/|wxAssemblePage|wxUnPackingActivity|microDz)",
    apiSignUrl = process.env.M_API_SIGN_URL ? process.env.M_API_SIGN_URL : "http://api.nolanstore.cc/sign",
    tokenCacheMin = parseInt(process.env?.["M_WX_TOKEN_CACHE_MIN"] || 10),
    tokenCacheMax = parseInt(process.env?.["M_WX_TOKEN_CACHE_MAX"] || 15);
class CustomError extends Error {
    constructor(message, ptpin) {
        super(message);
        this.name = this.constructor.name;
        this.ptpin = ptpin;
        Error.captureStackTrace(this, this.constructor);
    }
}
let wxProxySmart = parseInt(process.env.M_WX_PROXY_SMART || "2");
let reTryRegx = "(哎呀活动火爆，请稍后再试|活动太火爆了|服务器数据忙|奖品与您擦肩而过了哟)",
    blockPinRegx = process.env.M_WX_BLOCK_PIN_REGX || "";
const notInitPinTokenRegex = /lorealjdcampaign-rc.isvjcloud.com|interaction\/v1/;
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
let M_WX_ADDRESS_RANGE = process.env?.["M_WX_ADDRESS_RANGE"] || "1-7",
    M_WX_ADDRESS_MODE = process.env?.["M_WX_ADDRESS_MODE"] || "RANDOM",
    M_WX_ADDRESS_MODE_LOWER = parseInt(process.env?.["M_WX_ADDRESS_MODE_LOWER"] || 0),
    addressStopKeywords = ["京豆", "红包", "券", "再来一次", "客服"],
    addressStopKeywordsRule = ["下单满", "签收后", "收到货后", "成功购买任意", "必须购买店铺内"];
process.env.M_WX_ADDRESS_STOP_KEYWORD ? process.env.M_WX_ADDRESS_STOP_KEYWORD.split(/[@,&|]/).forEach((item) => addressStopKeywords.push(item)) : "";
process.env.M_WX_ADDRESS_STOP_KEYWORD_RULE
    ? process.env.M_WX_ADDRESS_STOP_KEYWORD_RULE.split(/[@,&|]/).forEach((item) => addressStopKeywordsRule.push(item))
    : "";
let apiToken = process.env.M_API_TOKEN ? process.env.M_API_TOKEN : "",
    leaders = [],
    blackPinConfig = {
        "cjhy-isv.isvjcloud.com": process.env.M_WX_CJ_BLACK_COOKIE_PIN ? process.env.M_WX_CJ_BLACK_COOKIE_PIN : "",
        "cjhydz-isv.isvjcloud.com": process.env.M_WX_CJ_BLACK_COOKIE_PIN ? process.env.M_WX_CJ_BLACK_COOKIE_PIN : "",
        "lzkj-isv.isvjcloud.com": process.env.M_WX_LZ_BLACK_COOKIE_PIN ? process.env.M_WX_LZ_BLACK_COOKIE_PIN : "",
        "lzkjdz-isv.isvjcloud.com": process.env.M_WX_LZ_BLACK_COOKIE_PIN ? process.env.M_WX_LZ_BLACK_COOKIE_PIN : "",
        "*": process.env.M_WX_BLACK_COOKIE_PIN ? process.env.M_WX_BLACK_COOKIE_PIN : "",
    },
    _currentTime = Date.now();
class Env {
    constructor(name) {
        this.buildAxios();
        if (this.constructor === Env) {
            this.name = name;
            this.desensitize = false;
            this.filename = process.argv[1];
            this.log(this.name + " " + this.filename);
            this.concurrencyLimit = process.env.M_CONC_LIMIT || 10;
            this.currentRunning = 0;
            this.taskQueue = [];
            this.exit = false;
            this.domain = "";
            this.runMode = "default";
            this.activityId = "";
            this.activityUrl = "";
            this.activityType = "99";
            this.templateId = "";
            this.templateCode = "";
            this.is100V2Type = false;
            this.defenseUrls = "";
            this.urlPrefix = "";
            this.shopName = "";
            this.venderId = "";
            this.shopId = "";
            this.userEnv = new Map();
            this.superVersion = "v1.0.0";
            this.superVersionNum = this.superVersion.replace(/\D/g, "");
            this.hdbTypes = hdbTypes;
            this.jinggengcjTypes = jinggengcjTypes;
            this.jinggengTypes = jinggengTypes;
            this.prizeList = [];
            this.accounts = [];
            this.currAddressPtpin = "";
            this.shareUserId = "";
            this.currentLeader = {};
            this.leaders = [];
            this.addressIndex = 1;
            this.masterPins = (process.env.M_MASTER_PIN || "").split(/[@,&|]/) || [];
            this.masterNum = 0;
            this.msg = [];
            return;
        }
        this.isMember = false;
        this.isNewMember = false;
        this.isAuthFailed = false;
        this.forBreak = false;
        this.cookie = "";
        this.ptpin = "";
        this.version = "";
        this.ticket = "";
        this.isvToken = "";
        this.tickets = new Map();
        this.message = [];
    }
    async ["pushLeader"](leader) {
        Object.assign(leader, {
            ptpin: this.ptpin,
            teamId: this.teamId,
            Token: this.Token,
            isvToken: this.isvToken,
        });
        leaders.push(leader);
    }
    async ["successLeader"](leader) {
        leaders.filter((item) => item.shareUserId === leader.shareUserId)[0].finish = true;
    }
    async ["selectLeader"]() {
        while (
            leaders.filter((item) => !item.finish).length === 0 &&
            leaders.filter((item) => item.finish).length !== this.super.masterNum &&
            !this.isMaster() &&
            !this.super.exit
        ) {
            await this.wait(200, 300);
        }
        !this.isMaster() &&
            leaders.filter((item) => item.finish === true).length === this.super.masterNum &&
            (this.putMsg("全部完成"), (this.super.exit = true));
        this.super.currentLeader = leaders.filter((item) => item.finish === false)?.[0] || {};
        this.super.shareUserId = this.super.currentLeader?.["shareUserId"] || "";
        !this.super.shareUserId && (this.putMsg("已无车头"), (this.super.exit = true));
        if (this.super.exit) throw new CustomError("逻辑退出");
    }
    async ["countdown"](mode = 1, s = 200) {
        let t = new Date();
        if (
            (mode === 1 && t.getMinutes() < 50) ||
            (mode === 2 && t.getMinutes() < 25) ||
            (mode === 3 && t.getMinutes() < 10) ||
            (mode === 4 && t.getMinutes() < 5)
        )
            return;
        let st = s;
        if (mode !== 9) {
            switch (mode) {
                case 1:
                    t.setHours(t.getHours() + 1), t.setMinutes(0);
                    break;
                case 2:
                    t.setMinutes(30);
                    break;
                case 3:
                    t.setMinutes(15);
                    break;
                case 4:
                    t.setMinutes(10);
                    break;
                default:
                    console.log("不支持");
            }
            t.setSeconds(0);
            t.setMilliseconds(0);
            st = t.getTime() - Date.now() - s;
        }
        st > 0 && (console.log("需要等待时间" + st / 1000 + " 秒"), await this.wait(st));
    }
    ["buildAxios"]() {
        this.axios = axios.create({
            timeout: 10000,
        });
        this.axios.defaults.retry = 1;
        this.axios.defaults.retryDelay = 0;
        this.axios.defaults.proxy = false;
        this.axios.defaults.shouldRetry = async (liii1Iil) => {
            let II1ilIIl = liii1Iil.response?.["status"];
            if ([403, 404, 407].includes(II1ilIIl)) return false;
            return false;
        };
        this.axios.interceptors.response.use(
            function (lliI1iii) {
                return lliI1iii;
            },
            function (Ii1liIIi) {
                let iiIIllIl = Ii1liIIi.config;
                if (!iiIIllIl || !iiIIllIl.retry) return Promise.reject(Ii1liIIi);
                if (!iiIIllIl.shouldRetry || typeof iiIIllIl.shouldRetry != "function") return Promise.reject(Ii1liIIi);
                if (!iiIIllIl.shouldRetry(Ii1liIIi)) {
                    return Promise.reject(Ii1liIIi);
                }
                iiIIllIl.__retryCount = iiIIllIl.__retryCount || 0;
                if (iiIIllIl.__retryCount >= iiIIllIl.retry) return Promise.reject(Ii1liIIi);
                iiIIllIl.__retryCount += 1;
                let lil1iIlI = new Promise(function (ll1iIlI) {
                    setTimeout(function () {
                        ll1iIlI();
                    }, iiIIllIl.retryDelay || 1);
                });
                return lil1iIlI.then(function () {
                    return axios(iiIIllIl);
                });
            }
        );
        this.axios.defaults.headers.tk = machineId.machineIdSync();
    }
    async ["rcache"](key, value, expire) {
        expire ? (await redis.del(key), await redis.set(key, value, "NX", "PX", expire)) : await redis.set(key, value);
    }
    async ["rdel"](key) {
        await redis.del(key);
    }
    async ["rget"](key) {
        return await redis.get(key);
    }
    async ["filterCookie"]() {
        try {
            let strArrTemp = [];
            let blockPins = [];
            this.log(blockPinRegx);
            a: for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i],
                    ptpin = cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1];
                if (this.activityUrl.includes("isvjcloud") && blockPinRegx) {
                    for (let regxLine of blockPinRegx.split(";")) {
                        let pattern = regxLine.split("@"),
                            match = this.activityUrl.match(new RegExp(pattern[0]));
                        if (match && pattern[1].split("|").includes(ptpin)) {
                            blockPins.push(ptpin);
                            continue a;
                        }
                    }
                }
                if (this.activityUrl.includes("isvjcloud")) {
                    if (blackPinConfig[this.domain]?.["includes"](ptpin)) continue;
                    if (blackPinConfig["*"]?.["includes"](ptpin)) continue;
                }
                this.masterPins.includes(ptpin) && this.masterNum++;
                strArrTemp.push(cookie);
            }
            cookies = strArrTemp;
            if (blockPins.length > 0) {
                this.log("匹配到黑名单 " + blockPins.join("|"));
            }
        } catch (e) {
            console.log("ck过滤异常");
            console.log(e);
        }
    }
    async ["acquireLock"](key, value, expire) {
        const result = await redis.set(key, value, "NX", "PX", expire);
        return result === "OK";
    }
    async ["releaseLock"](key, value) {
        const result = await redis.get(key);
        return result === value ? (await redis.del(key), true) : false;
    }
    ["putMsg"](msg) {
        this.log(msg);
        this.message.push(msg);
    }
    ["addTask"](task) {
        this.taskQueue.push(task);
        this.runTasks();
    }
    ["uuid"](x = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx") {
        return x.replace(/[xy]/g, function (x) {
            const r = (16 * Math.random()) | 0,
                n = "x" === x ? r : (3 & r) | 8;
            return n.toString(36);
        });
    }
    ["now"](fmt) {
        return format(Date.now(), fmt || "yyyy-MM-dd HH:mm:ss.SSS");
    }
    ["formatDate"](date, fmt) {
        return format(typeof date === "object" ? date : new Date(typeof date === "string" ? date * 1 : date), fmt || "yyyy-MM-dd");
    }
    ["formatDateTime"](date, fmt) {
        return format(typeof date === "object" ? date : new Date(typeof date === "string" ? date * 1 : date), fmt || "yyyy-MM-dd HH:mm:ss");
    }
    ["parseDate"](Ii1il1II) {
        return new Date(Date.parse(Ii1il1II.replace(/-/g, "/")));
    }
    ["timestamp"]() {
        return new Date().getTime();
    }
    ["__lt"](data) {
        if (this.is100V2Type) return;
        let scs = data?.["headers"]["set-cookie"] || data?.["headers"]["Set-Cookie"] || [],
            sc = typeof scs != "object" ? scs.split(",") : scs;
        sc.forEach((ck) => {
            let kv = ck.split(";")[0].match(/^(.*?)=(.*)$/);
            kv && this.tickets.set(kv[1].trim(), kv[2].trim());
        });
        this.tickets && (this.ticket = Array.from(this.tickets, ([k, v]) => k + "=" + v).join(";") + ";");
    }
    async ["request"](url, headers, body) {
        return new Promise((resolve, reject) => {
            const __config = headers?.["headers"]
                ? headers
                : {
                      headers: headers,
                  };
            (body ? this.axios.post(url, body, __config) : this.axios.get(url, __config))
                .then((data) => {
                    this.__lt(data);
                    resolve(data);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }
    async ["sign"](fn, body = {}) {
        let b = {
            fn: fn,
            body: body,
        };
        const httpsAgent = this.axios.defaults.httpsAgent;
        try {
            this.axios.defaults.httpsAgent = false;
            let { data } = await this.request(
                apiSignUrl,
                {
                    "Content-Type": "application/json",
                    Cookie: "-",
                },
                b
            );
            if (data.fn && data.body) {
                return {
                    fn: data.fn,
                    sign: data.body,
                };
            }
        } catch (e) {
            e.message.includes("timeout") ? console.log("sign 超时") : console.log("sign" + e);
        } finally {
            this.axios.defaults.httpsAgent = httpsAgent;
        }
        return {};
    }
    async ["carRmv"]() {}
    async ["initPinToken"]() {
        try {
            if (this.activityUrl.includes("activityType")) {
                if (!notInitPinTokenRegex.test(this.activityUrl)) {
                    if (!this.super.defenseUrls && this.super?.["defenseUrls"]?.["length"] === 0) {
                        const { data } = await this.api("api/user-info/getDefenseUrls", "");
                        this.super.defenseUrls = data.map((o) => o.interfaceName);
                    }
                    await this.api(
                        "api/user-info/initPinToken?source=01&status=1&activityId=" +
                            this.activityId +
                            "&uuid=" +
                            this.uuid() +
                            "&jdToken=" +
                            this.isvToken +
                            "&shopId=" +
                            this.super.shopId +
                            "&clientTime=" +
                            Date.now() +
                            "&shareUserId=" +
                            (this.shareUserId || ""),
                        ""
                    );
                }
            } else {
                if (!this.super.defenseUrls && this.super?.["defenseUrls"]?.["length"] === 0) {
                    const { data } = await this.api("customer/getDefenseUrls", "");
                    this.super.defenseUrls = data;
                }
                await this.api(
                    "customer/initPinToken?source=01&status=1&activityId=" +
                        this.activityId +
                        "&uuid=" +
                        this.uuid() +
                        "&jdToken=" +
                        this.isvToken +
                        "&venderId=" +
                        this.super.venderId +
                        "&shopId=" +
                        this.super.shopId +
                        "&clientTime=" +
                        Date.now() +
                        "&shareUserId=" +
                        (this.shareUserId || ""),
                    ""
                );
            }
        } catch (e) {
            this.log("initPinToken" + e);
        }
    }
    async ["wx100V2Login"]() {
        let login = await this.api("/api/user/login", {
            token: this.isvToken,
            source: "01",
            activityType: this.activityType,
            templateCode: this.templateCode,
            activityId: this.activityId,
            shopId: this.shopId,
            uuid: this.uuid(),
            timestamp: Date.now(),
        });
        if (login.code != 200) {
            this.putMsg("登录失败");
            throw new CustomError(login.message);
        }
        this.pinToken = login.data.pinToken;
        this.log("登录成功 " + login.data.level);
        let getActivityBase = await this.api("/api/common/getActivityBase", {});
        this.super.actStartTime = getActivityBase.data.startTime;
        this.super.actEndTime = getActivityBase.data.endTime;
        this.super.actName = getActivityBase.data.actName;
        this.super.venderId = this.shopId;
        this.super.shopName = getActivityBase.data.shopName;
        await this.isBlackShop();
        if (!this.super.rule) {
            let getRule = await this.api("/api/common/getRule");
            this.super.rule = getRule.data || "";
        }
        this.super.prizeList.length === 0 && (await this.getPrizeList());
        let timeDiff = this.super.actStartTime - Date.now();
        if (timeDiff > 0 && timeDiff < 1000 * 60 * 3) await this.wait(timeDiff + 10);
        else {
            if (this.super.actStartTime > this.timestamp()) {
                this.putMsg("活动未开始");
                this.super.exit = true;
            }
        }
        if (this.timestamp() > this.super.actEndTime) {
            this.putMsg("活动已结束");
            this.super.exit = true;
        }
        if (this.super.exit) {
            throw new CustomError("逻辑退出");
        }
        if (getActivityBase.data.followQualify === false) {
            await this.api("/api/common/followShop", {});
        }
    }
    async ["txzjLogin"]() {
        const login = await this.api("front/jd_store_user_info", `token=${this.isvToken}`);
        if (login.code !== "success") {
            this.putMsg("登录失败");
            throw new Error(login.msg);
        }
        let fn = this.activityUrl.split("/")[3];
        let html = await this.api(`${fn}/home?a=${this.activityId}`);
        if (/很遗憾，活动已结束/.test(html)) {
            this.putMsg("活动已结束");
            this.super.exit = true;
            return html;
        }
        this.log("登录成功");
        const doc = cheerio.load(cheerio.load(html).html());
        this.super.shopName = doc(".title.go_to_shop").text();
        this.super.rule = doc(".activity-prize").text();
        if (!this.super.rule) {
            this.super.rule = await this.api(`${fn}/rule?a=${this.activityId}`);
        }
        let actTime = this.match(/活动时间(\d{4}-\d{2}-\d{2}) - (\d{4}-\d{2}-\d{2})/, this.super.rule);
        if (actTime) {
            this.super.actStartTime = new Date(actTime[0]).getTime();
            this.super.actEndTime = new Date(actTime[1]).getTime();
            let st = this.super.actStartTime - Date.now();
            if (st > 0 && st < 1000 * 60 * 3) {
                await this.wait(st + 10);
            } else {
                if (this.super.actStartTime > this.timestamp()) {
                    this.putMsg("活动未开始");
                    this.super.exit = true;
                    throw new CustomError("活动未开始");
                }
            }
            if (this.super.actEndTime < this.timestamp()) {
                this.putMsg("活动已结束");
                this.super.exit = true;
                throw new CustomError("活动已结束");
            }
        }
        if (this.super.prizeList.length == 0) {
            await this.getPrizeList();
        }
        return doc;
    }
    async ["login"](fn = {}) {
        if (this.super.exit) return;
        if (wxProxySmart == "2") {
            await this.routerProxy();
        }
        await this.isvObfuscator();
        if (this.is100V2Type) {
            await this.wx100V2Login();
        } else if (hdbTypes.includes(this.domain)) {
            await this.hdbLogin();
        } else if (/activityType=[\d]+/.test(this.activityUrl)) {
            await this.wx100Login();
        } else if (this.domain.includes("gzsl-isv.isvjcloud.com")) {
            return await this.gzslLogin(fn);
        } else if (jinggengTypes.includes(this.domain)) {
            return await this.jinggengLogin(fn);
        } else if (this.domain.includes("txzj-isv.isvjcloud.com")) {
            return await this.txzjLogin();
        } else if (/lzkj|cjhy/.test(this.activityUrl)) {
            await this.wxLogin();
        } else if (/lzdz4-isv/.test(this.activityUrl)) {
            await this.lzdz4Login();
        } else {
            this.log("传统无线");
        }
    }
    async ["lzdz4Login"]() {
        await this.api("wxCommonInfo/token?t=" + Date.now(), "");
        await this.getMyPing("customer/getMyCidPing");
        this.tickets.set("AUTH_CUSER", this.Pin);
        await this.accessLog();
    }
    async ["wxLogin"]() {
        await this.wxJC();
        await this._algo();
        await this.getSimpleActInfoVo();
        await this.getShopInfo();
        await this.isBlackShop();
        await this.getMyPing();
        await this.accessLog();
    }
    async ["wxJC"]() {
        let prizeCount = (this.super.prizeList || []).length;
        if (this.isTeamRunMode() || this.isMaster() || prizeCount === 0) return;
        let expire = false;
        if (hdbTypes.includes(this.domain)) {
        } else {
            if (new RegExp("activityType=").test(this.activityUrl)) {
                expire = this.super.prizeList?.["filter"]((o) => wx100JcTypes.includes(o.prizeType))["length"] === prizeCount;
            } else {
                if (new RegExp("(lzkj|cjhy)").test(this.activityUrl)) {
                    expire = this.super.prizeList?.["filter"]((o) => wxJcTypes.includes((o.type || o.giftType) * 1))["length"] === prizeCount;
                } else {
                    if (this.activityUrl.includes("gzsl-isv.isvjcloud.com")) {
                    } else {
                        jinggengTypes.includes(this.domain)
                            ? (expire =
                                  this.super.prizeList?.["filter"]((l1i1li11) => jinggengJcTypes.includes(l1i1li11.equityType))["length"] ===
                                  prizeCount)
                            : this.log("传统无线");
                    }
                }
            }
        }
        if (expire) {
            this.putMsg("韭菜不跑");
            this.super.exit = true;
            throw new CustomError("韭菜不跑");
        }
    }
    ["randomPattern"](pattern, charset = "abcdef0123456789") {
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
    async ["jinggengLogin"](data) {
        let setMixNick = await this.api("front/setMixNick", "strTMMixNick=" + this.isvToken + "&userId=" + this.super.userId + "&source=01");
        if (!setMixNick.succ) {
            this.log(setMixNick);
            this.putMsg("setMixNick失败");
            throw new CustomError("登录失败");
        }
        this.log("登录成功 ");
        const html = await this.api(
            data.fn,
            "id=" + this.activityId + "&user_id=" + this.super.userId + "&sid=" + this.uuid() + "&un_area=" + this.randomPattern("xx_xxxx_xxxx_xxxxx")
        );
        if (html.includes("<title>活动已结束</title>") || html.includes("<title>请稍后重试</title>")) {
            this.putMsg("活动已结束");
            this.super.exit = true;
            throw new CustomError("活动已结束");
        }
        const doc = cheerio.load(cheerio.load(html).html());
        this.super.shopId = doc("#shop_sid").val();
        this.super.venderId = doc("#vender_id").val();
        this.super.actName = doc("#actName").val();
        this.super.shopName = doc("#shop_title").val();
        this.super.rule = doc("#description").text();
        this.super.activityType = doc("#actType").val();
        let error = doc("#error", "body").attr("value");
        this.log(error);
        await this.isBlackShop(this.super.shopName);
        await this.actTimeParser(this.super.rule);
        this.super.prizeList.length === 0 && (await this.getPrizeList(doc));
        this.super.actStartTime > this.timestamp() && (this.putMsg("活动未开始"), (this.super.exit = true));
        this.super.actEndTime < this.timestamp() && (this.putMsg("活动已结束"), (this.super.exit = true));
        const prizes = this.super.prizeList.filter((o) => !["JD_COUPON", "JD_D_COUPON", "COUPON"].includes(o.equityType) && o.availableQuantity > 0);
        prizes.length === 0 && (this.putMsg("垃圾或领完"), (this.super.exit = true));
        this.super.blackLuckDrawRule &&
            new RegExp("(" + this.blackLuckDrawRule + ")").test(this.super.shopName) &&
            ((this.super.exit = true), this.putMsg("垃圾或领完"));
        await this.wxJC();
        if (this.super.exit) throw new CustomError("垃圾或领完");
        return doc;
    }
    async ["gzslLogin"](data) {
        let result = await this.api(data.fn, {
            id: this.activityId,
            token: this.isvToken,
            source: "01",
        });
        if (result.status !== "1") {
            this.putMsg("活动已结束" + result.msg);
            this.super.exit = true;
            await this.wxStop(result.msg);
            throw new CustomError("；逻辑退出");
        }
        this.super.shopName = result.activity.shopName;
        this.super.venderId = result.activity.venderId || result.activity.shopId;
        this.super.shopId = result.activity.shopId;
        this.super.activityType = result.activity.activityType;
        this.super.prizeList = result.activity.prizes || result.activity.prizeSettings;
        this.super.actStartTime = result.activity.startTime;
        this.super.actEndTime = result.activity.endTime;
        await this.isBlackShop(this.super.shopName);
        this.super.actStartTime > this.timestamp() && (this.putMsg("活动未开始"), (this.super.exit = true));
        this.super.actEndTime < this.timestamp() && (this.putMsg("活动已结束"), (this.super.exit = true));
        let prizes = this.super.prizeList.filter((o) => ["2"].includes(o.source));
        prizes.length === 0 && (this.putMsg("垃圾或领完"), (this.super.exit = true));
        if (this.super.exit) {
            throw new CustomError("逻辑退出");
        }
        return result;
    }
    async ["getAwardText"](drawAwardDto) {
        let awardText = "";
        if (drawAwardDto.awardType == "JD_GOODS") awardText = drawAwardDto.awardName + " " + drawAwardDto.awardDenomination * 1 + "元";
        else {
            if (drawAwardDto.awardType == "JD_POINT") awardText = drawAwardDto.awardDenomination * 1 + "积分";
            else {
                if (drawAwardDto.awardType == "JD_COUPON" || drawAwardDto.awardType == "JD_D_COUPON")
                    awardText = drawAwardDto.awardDenomination * 1 + "元券";
                else {
                    if (drawAwardDto.awardType == "JD_BEAN" || drawAwardDto.awardType == "JD_MARKET")
                        awardText = drawAwardDto.awardDenomination * 1 + "豆";
                    else {
                        if (drawAwardDto.awardType == "JD_E_CARD") awardText = drawAwardDto.assetsName;
                        else {
                            if (drawAwardDto.awardType == "JD_AIQIYI") awardText = drawAwardDto.assetsName;
                            else {
                                if (drawAwardDto.awardType == "JD_REDBAG" || drawAwardDto.awardType == "JD_RED_BAG")
                                    awardText = drawAwardDto.awardDenomination * 1 + "元红包";
                                else {
                                    awardText = drawAwardDto.awardName;
                                    debugger;
                                }
                            }
                        }
                    }
                }
            }
        }
        return awardText;
    }
    async ["isBlackShop"](shopName = this.super.shopName) {
        if (!shopName) return;
        if (shopName && blackLuckDrawRule && new RegExp("(" + blackLuckDrawRule + ")").test(shopName)) {
            this.super.exit = true;
            this.putMsg("命中店铺黑名单,垃圾或领完");
            throw new CustomError("命中店铺黑名单");
        }
    }
    async ["getSimpleActInfoVo"](fn = "customer/getSimpleActInfoVo", body = 1) {
        if (this.super.venderId && this.super.shopId && this.activityType) {
            await this.initPinToken();
            return;
        }
        let actInfo = await this.api(fn, body === 1 ? "activityId=" + this.activityId : body);
        if (!actInfo?.["result"] || !actInfo?.["data"]) {
            this.putMsg("手动确认");
            this.super.exit = true;
            throw new CustomError("手动确认");
        }
        this.super.venderId = actInfo.data?.["venderId"] || this.venderId;
        this.super.shopId = actInfo.data?.["shopId"] || this.shopId;
        this.super.activityType = actInfo.data?.["activityType"] || this.activityType;
        await this.initPinToken();
    }
    async ["complete"]() {}
    formatDateString(dateString) {
        if (dateString.match(/\d{4}年\d{1,2}月\d{1,2}日\d{2}:\d{2}:\d{2}/)) {
            return dateString.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日(\d{2}:\d{2}:\d{2})/, "$1-$2-$3 $4");
        }
        return dateString;
    }
    async ["checkActivity"](activityContent) {
        this.super.prizeList.length === 0 && (await this.getPrizeList(activityContent));
        await this.actTimeParser(this.super.rule);
        this.super.prizeList.filter((o) => [6, 7, 9, 13, 14, 15, 16].includes((o.type || o.giftType) * 1)).length === 0 &&
            (this.putMsg("垃圾或领完"), (this.super.exit = true));
        if (this.super.actStartTime && this.super.actStartTime > this.timestamp()) {
            this.super.exit = true;
            this.putMsg("活动未开始");
        }
        this.super.actEndTime && this.super.actEndTime < this.timestamp() && ((this.super.exit = true), this.putMsg("活动已结束"));
        if (this.super.exit) throw new CustomError("垃圾或领完");
        await this.wxJC();
        if (this.isMaster() && this.super.prizeList.filter((o) => [6, 7, 13, 14, 15, 16].includes((o.type || o.giftType) * 1)).length >= 1) {
            let isOpen = await this.openCard();
            !isOpen && this.log("开卡失败");
        }
        debugger;
    }
    async ["actTimeParser"](rule = this.super.rule) {
        try {
            if (!rule) return;
            if (this.super.actStartTime) {
                return;
            }
            const regex = /(\d{4}[-/年]\d{1,2}[-/月]\d{1,2}(日)?(\s\d{2}:\d{2}(:\d{2})?)?|即日起至\s\d{4}-\d{2}-\d{2}\s\d{2}:\d{2})/g,
                matchs = rule.match(regex);
            if (matchs) {
                let startTime, endTime;
                matchs.length === 1 && /即日起至/.test(matchs[0])
                    ? ((startTime = this.now("yyyy-MM-dd HH:mm:ss")),
                      (endTime = this.formatDateString(matchs[0].replace(/即日起至\s/, ""))),
                      endTime.length === 16 && (endTime += ":59"))
                    : ((startTime = this.formatDateString(matchs[0])), (endTime = this.formatDateString(matchs[1])));
                this.super.actStartTime = new Date(startTime).getTime();
                this.super.actEndTime = new Date(endTime).getTime();
            } else {
                debugger;
                this.log("未找到活动时间！");
            }
        } catch (e) {
            this.putMsg("时间格式解析出错");
        }
    }
    async ["wxStop"](err) {
        this.super.exit = err && new RegExp("(" + stopKeywords.join("|") + ")").test(err);
        if (this.super.exit) {
            this.putMsg(err);
            throw new CustomError("关键字逻辑退出");
        }
        return this.super.exit;
    }
    async ["wxAddressStop"](err) {
        return err && new RegExp("(" + addressStopKeywords.join("|") + ")").test(err);
    }
    async ["wxAddressStopRule"](act = this.super.rule) {
        return act && new RegExp("(" + addressStopKeywordsRule.join("|") + ")").test(act);
    }
    async ["selectAddress"](username) {
        let address,
            addrMode = M_WX_ADDRESS_MODE.toUpperCase();
        this.log("当前填地址模式: " + M_WX_ADDRESS_MODE.toUpperCase());
        ["PIN"].includes(addrMode) &&
            (address = this.super.accounts[username]?.["address"] || this.super.accounts[encodeURIComponent(username)]?.["address"]);
        if (address) {
            return address;
        }
        if (["CC", "CCWAV"].includes(addrMode)) {
            address = this.super.accounts["默认地址" + this.super.addressIndex]?.["address"];
        }
        if (address) return address;
        let list = [];
        for (let key in this.super.accounts) {
            if (this.super.accounts[key]?.["address"]) {
                list.push(this.super.accounts[key].address);
            }
        }
        if (["RANGE"].includes(addrMode)) {
            let re = Math.min(parseInt(M_WX_ADDRESS_RANGE?.["split"]("-")?.[1] || list.length), list.length);
            this.super.addressIndex > re && (this.super.addressIndex = 1);
            address = list[this.super.addressIndex - 1];
        }
        if (address) return address;
        if (M_WX_ADDRESS_MODE_LOWER || ["RANDOM"].includes(addrMode)) {
            return list[this.random(1, list.length) - 1];
        }
    }
    async ["saveAddress"](addressId = this.addressId, prizeName = this.prizeName, Pin = this.Pin, ptpin = this.ptpin, addr = "") {
        this.log("addressId=" + addressId + " prizeName=" + prizeName);
        if (!this.super.filename.includes("m_jd_wx_address") && (await this.wxAddressStop(prizeName))) {
            this.putMsg("命中关键词，不填写地址！");
            return;
        }
        let shopName = this.super.shopName;
        if (shopName?.["includes"]("专卖店")) {
            this.putMsg("专卖店，不填写地址！");
            return;
        }
        if (!this.super.filename.includes("m_jd_wx_address") && (await this.wxAddressStopRule())) {
            this.putMsg("命中规则，不填地址beta！");
            this.super.exit = true;
            return;
        }
        this.super.currAddressPtpin && this.super.currAddressPtpin !== ptpin && this.super.addressIndex++;
        this.super.currAddressPtpin = ptpin;
        let addrInfo = addr || (await this.selectAddress(ptpin));
        if (!addrInfo) {
            this.putMsg("没有找到地址信息");
            return;
        }
        this.log("当前地址详情" + JSON.stringify(addrInfo));
        let isSave = false;
        try {
            if (this.is100V2Type) {
                let saveDate = await this.api(`/api/${this.activityType}/userAddressInfo`, {
                    addressId: addressId,
                    activityPrizeId: prizeName,
                    realName: addrInfo.receiver,
                    mobile: addrInfo.phone,
                    province: addrInfo.province,
                    city: addrInfo.city,
                    county: addrInfo.county,
                    address: addrInfo.address,
                });
                if (saveDate?.code == 200) {
                    this.putMsg("已填地址");
                } else {
                    this.putMsg(saveDate.message);
                }
            } else if (this.domain.includes("txzj-isv.isvjcloud.com")) {
                let fn = this.activityUrl.split("/")[3];
                let saveData = await this.api(`${fn}/set_address`, {
                    id: addressId,
                    info: {
                        name: addrInfo.receiver,
                        phone: addrInfo.phone,
                        region: addrInfo.province.replace("市", "").replace("省", "") + " " + addrInfo.city.replace("市", "") + addrInfo.county,
                        address: addrInfo.address,
                    },
                });
                console.log(saveData);
            } else if (jinggengcjTypes.includes(this.domain)) {
                let saveData = await this.api(
                    "/dm/front/jdBigAlliance/awards/updateAddress?open_id=&mix_nick=" + (this.buyerNick || "") + "&user_id=10299171",
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
            } else {
                if (hdbTypes.includes(this.domain)) {
                    let saveData = await this.api("/front/activity/postDeliveryInfo", {
                        mobile: addrInfo.phone,
                        province: addrInfo.province,
                        area: addrInfo.county,
                        receiveName: addrInfo.receiver,
                        detailAddress: addrInfo.address,
                        activityLogId: addressId,
                        city: addrInfo.city,
                    });
                    if (saveData.succ) this.putMsg("已填地址"), (isSave = true);
                    else {
                        this.putMsg(saveData.message);
                    }
                } else {
                    if (jinggengTypes.includes(this.domain)) {
                        let address =
                            addrInfo.province.replace("市", "").replace("省", "") +
                            " " +
                            addrInfo.city.replace("市", "") +
                            " " +
                            addrInfo.county +
                            addrInfo.address;
                        let saveData = await this.api(
                            "/ql/front/postBuyerInfo",
                            "receiverName=" +
                                encodeURIComponent(addrInfo.receiver) +
                                "&mobile=" +
                                addrInfo.phone +
                                "&address=" +
                                encodeURIComponent(address) +
                                "&log_id=" +
                                addressId +
                                "&user_id=" +
                                this.super.userId
                        );
                        console.log(saveData);
                        if (saveData.succ) {
                            this.putMsg("已填地址");
                            isSave = true;
                        } else {
                            this.putMsg(saveData.msg);
                        }
                    } else {
                        if (this.activityUrl.includes("activityType")) {
                            let saveData = await this.api("/api/my/prize/update", {
                                realName: addrInfo.receiver,
                                mobile: addrInfo.phone,
                                address: addrInfo.address,
                                orderCode: addressId,
                                province: addrInfo.province,
                                city: addrInfo.city,
                                county: addrInfo.county,
                            });
                            console.log(saveData);
                            if (saveData?.["data"] !== "2") {
                                this.putMsg("已填地址");
                                isSave = true;
                            }
                        } else {
                            let saveData = await this.api(
                                "wxAddress/save",
                                "venderId=" +
                                    this.super.venderId +
                                    "&pin=" +
                                    Pin +
                                    "&activityId=" +
                                    this.activityId +
                                    "&actType=" +
                                    this.activityType +
                                    "&prizeName=" +
                                    encodeURIComponent(prizeName) +
                                    "&receiver=" +
                                    encodeURIComponent(addrInfo.receiver) +
                                    "&phone=" +
                                    addrInfo.phone +
                                    "&province=" +
                                    encodeURIComponent(addrInfo.province) +
                                    "&city=" +
                                    encodeURIComponent(addrInfo.city) +
                                    "&address=" +
                                    encodeURIComponent(addrInfo.address) +
                                    "&generateId=" +
                                    addressId +
                                    "&postalCode=" +
                                    addrInfo.postalCode +
                                    "&areaCode=" +
                                    encodeURIComponent(addrInfo.areaCode) +
                                    "&county=" +
                                    encodeURIComponent(addrInfo.county)
                            );
                            if (!saveData?.["result"]) {
                                if (saveData.errorMessage.includes("您必须在中奖一小时内填写中奖地址")) {
                                    return;
                                }
                                this.putMsg(saveData.errorMessage);
                            }
                            if (saveData?.["result"]) this.putMsg("已填地址"), (isSave = true);
                            else {
                                this.putMsg("venderId填地址失败");
                                saveData = await this.api(
                                    "wxAddress/save",
                                    "venderId=" +
                                        this.super.shopId +
                                        "&pin=" +
                                        Pin +
                                        "&activityId=" +
                                        this.activityId +
                                        "&actType=" +
                                        this.activityType +
                                        "&prizeName=" +
                                        encodeURIComponent(prizeName) +
                                        "&receiver=" +
                                        encodeURIComponent(addrInfo.receiver) +
                                        "&phone=" +
                                        addrInfo.phone +
                                        "&province=" +
                                        encodeURIComponent(addrInfo.province) +
                                        "&city=" +
                                        encodeURIComponent(addrInfo.city) +
                                        "&address=" +
                                        encodeURIComponent(addrInfo.address) +
                                        "&generateId=" +
                                        addressId +
                                        "&postalCode=" +
                                        addrInfo.postalCode +
                                        "&areaCode=" +
                                        encodeURIComponent(addrInfo.areaCode) +
                                        "&county=" +
                                        encodeURIComponent(addrInfo.county)
                                );
                                if (saveData?.["result"]) {
                                    this.putMsg("已填地址");
                                    isSave = true;
                                } else this.putMsg("" + saveData?.["errorMessage"]);
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
        return (
            isSave &&
                (await fs.appendFileSync(
                    "gifts.csv",
                    this.now() +
                        "," +
                        prizeName +
                        "," +
                        ptpin +
                        "," +
                        addrInfo.phone +
                        "," +
                        addrInfo.address +
                        "," +
                        this.super.name +
                        "," +
                        shopName +
                        "," +
                        this.activityUrl +
                        "\
"
                )),
            isSave
        );
    }
    async ["getMyPing"](fn = "customer/getMyPing", count = 0) {
        try {
            let data = await this.api(fn, "userId=" + this.super.venderId + "&token=" + this.isvToken + "&pin=&fromType=APP&riskType=0");
            this.Pin = "";
            if (!data.result) {
                if (data.errorMessage.includes("请联系商家")) {
                    this.super.exit = true;
                    this.putMsg("商家token过期");
                    throw new CustomError(data.errorMessage);
                }
                if (count < 3 && !data.errorMessage?.["includes"]("活动太火爆")) this.log("重试pin获取"), await this.getMyPing(fn, ++count);
                else {
                    this.putMsg(data.result.errorMessage);
                    return;
                }
            }
            let ilIiI11 = data.data.secretPin;
            this.nickname = data.data.nickname;
            this.Pin = this.domain.includes("cjhy") ? encodeURIComponent(encodeURIComponent(ilIiI11)) : encodeURIComponent(ilIiI11);
        } catch (e) {
            if (e instanceof CustomError) {
                throw new CustomError(e.message);
            }
            this.putMsg(e?.["message"]);
            this.nickname = this.ptpin;
            let secretPin = this.tickets.get("AUTH_C_USER");
            this.Pin =
                secretPin || encodeURIComponent(secretPin) || this.domain.includes("cjhy")
                    ? encodeURIComponent(encodeURIComponent(secretPin))
                    : encodeURIComponent(secretPin);
        }
    }
    async ["accessLog"](fn = "" + (this.domain.includes("cjhy") ? "common/accessLog" : "common/accessLogWithAD")) {
        await this.api(
            fn,
            "venderId=" +
                this.super.venderId +
                "&code=" +
                this.activityType +
                "&pin=" +
                this.Pin +
                "&activityId=" +
                this.activityId +
                "&pageUrl=" +
                encodeURIComponent(this.activityUrl) +
                "&subType=app&adSource="
        );
    }
    ["log"](...msg) {
        _currentTime = Date.now();
        console.log(this.now("HH:mm:ss.SSS") + "|" + this.desensitizeString(this.ptpin) + "|" + (this.index || "") + "|", ...msg);
    }
    async ["isOpenCard"](venderId = this.super.venderId) {
        return await redis.sismember("M_OPEN:" + venderId, this.ptpin);
    }
    async ["setOpenCardCache"](venderId = this.super.venderId) {
        await redis.sadd("M_OPEN:" + venderId, this.ptpin);
    }
    async ["openCard"](venderId = this.super.venderId, channel = 406, activityId = "", count = 0) {
        try {
            let isOpen = await this.isOpenCard(venderId);
            if (isOpen) return this.log("已经开过卡了"), isOpen;
            if (count > 3) {
                return false;
            }
            let body = {
                venderId: venderId,
                shopId: this.super.shopId || venderId,
                bindByVerifyCodeFlag: 1,
                registerExtend: {},
                writeChildFlag: 0,
                channel: channel,
                appid: "27004",
                needSecurity: true,
                bizId: "shopmember_m_jd_com",
            };
            if (activityId) {
                Object.assign(body, {
                    activityId: activityId,
                });
            }
            let url = "https://api.m.jd.com/client.action",
                headers = {
                    authority: "api.m.jd.com",
                    accept: "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    "content-type": "application/x-www-form-urlencoded",
                    origin: "https://shopmember.m.jd.com",
                    referer: "https://shopmember.m.jd.com/",
                    "user-agent": this.UA,
                    Cookie: this.cookie,
                };
            body =
                "appid=shopmember_m_jd_com&functionId=bindWithVender&body=" +
                encodeURIComponent(JSON.stringify(body)) +
                "&client=H5&clientVersion=9.2.0&" +
                (await this.h5st());
            let { data } = await this.request(url, headers, body);
            this.log("开卡结果: " + data.message);
            if (["508", "510", "201", "9002"].includes(data.busiCode)) return await this.setOpenCardCache(venderId), false;
            if ((data?.["message"]?.["includes"]("火爆") || data?.["message"]?.["includes"]("失败")) && count < 3) {
                return await this.openCard(venderId, channel, activityId, ++count);
            }
            return data?.["code"] * 1 === 0 && data?.["busiCode"] * 1 === 0 && (await this.setOpenCardCache(venderId)), true;
        } catch (e) {
            if ([403].includes(e.response?.["status"]) && count < 3)
                return await this.routerProxy(0), await this.wait(1000, 2000), await this.openCard(venderId, channel, activityId, ++count);
        }
    }
    ["isProxy"](str = "493") {
        const regex = new RegExp(proxyRegx);
        return regex.test(str) && this.domain.includes("isvjcloud");
    }
    async ["h5st"](body, fn = "bindWithVender", count = 0) {
        return h5sts.random();
    }
    async ["getProxyByUrl"](proxy) {
        let strProxyUrl = proxy.url;
        var isgetProxy = false;
        try {
            this.axios.defaults.httpsAgent = false;
            let http = await this.axios.get(strProxyUrl);
            if (strProxyUrl.includes("=json")) {
                let strtemp = JSON.stringify(http.data),
                    httplist = http.data.data;
                http.data.data?.["list"] && (httplist = http.data.data.list);
                if (httplist) {
                    if (httplist[0]?.["port"])
                        (isgetProxy = true),
                            this.log("获取到的IP:" + httplist[0].ip + ":" + httplist[0].port),
                            await this.setProxy(httplist[0].ip + ":" + httplist[0].port);
                    else {
                        const regex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+|[a-zA-Z0-9.-]+:\d+)/,
                            match = strtemp.match(regex);
                        match
                            ? (this.log("获取到的IP:" + match[0]), (isgetProxy = true), await this.setProxy(match[0]))
                            : ((proxies.filter((o) => (o.index = proxy.index))[0].close = true), this.log(JSON.stringify(strtemp)));
                    }
                } else
                    this.log("M_WX_PROXY_URL" + (proxy.index - 1 || "") + "代理获取异常，切换下一个"),
                        (proxies.filter((o) => (o.index = proxy.index))[0].close = true),
                        this.log(JSON.stringify(strtemp));
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
                        ),
                    pw = strtemp?.["includes"]("@") ? strtemp.split("@")[0] : "";
                const regex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+|[a-zA-Z0-9.-]+:\d+)/,
                    match = strtemp.match(regex);
                match
                    ? (this.log("获取到的IP:" + match[0]), (isgetProxy = true), await this.setProxy(match[0], pw))
                    : (this.log("M_WX_PROXY_URL" + (proxy.index - 1 || "") + "代理获取异常，切换下一个"),
                      (proxies.filter((o) => (o.index = proxy.index))[0].close = true),
                      this.log(JSON.stringify(strtemp)));
            }
        } catch (e) {
            this.log("M_WX_PROXY_URL" + (proxy.index - 1 || "") + "代理获取异常，切换下一个");
            proxies.filter((o) => (o.index = proxy.index))[0].close = true;
        }
        return isgetProxy;
    }
    async ["setProxy"](ipPort, pw = "") {
        this.curProxyIP = ipPort;
        let p = ipPort.split(":"),
            proxyOptions = {
                host: p[0],
                port: p[1],
            };
        if (pw) {
            proxyOptions.proxyAuth = pw;
        }
        this.axios.defaults.httpsAgent = tunnel.httpsOverHttp({
            proxy: proxyOptions,
            rejectUnauthorized: false,
        });
    }
    async ["routerProxy"](count = 0) {
        if (!proxies.find((o) => !o.close)) {
            this.log("所有代理已关闭");
            this.exit = true;
            this.proxy = null;
            return;
        }
        this.proxy = proxies.filter((o) => !o.close)[0];
        if (this.proxy.type && this.proxy.type * 1 === 2) {
            let awardText = this.getQueryString(this.proxy.url, "username"),
                Ii111i1 = this.getQueryString(this.proxy.url, "password"),
                token = awardText + ":" + Ii111i1;
            await this.setProxy(this.match(/https?:\/\/([^/]+)/, this.proxy.url), token);
            return;
        }
        if (this.proxy.type && this.proxy.type * 1 === 3) {
            let key = "IPS:GET",
                v = "X";
            try {
                let isLock = await this.acquireLock(key, v, 10 * 1000);
                if (isLock) {
                    let num = await redis.llen("IPS");
                    this.log("开始提取IP " + num);
                    try {
                        this.proxy = proxies.filter((o) => !o.close)[0];
                        let { data } = await this.axios.get(this.proxy.url);
                        const regex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+)/g;
                        let ipPort,
                            ips = [];
                        while ((ipPort = regex.exec(data)) !== null) {
                            ips.push(ipPort[1]);
                        }
                        if (ips.length > 0) {
                            await redis.lpush("IPS", ips);
                            await redis.expire("IPS", 60 * 60);
                        }
                    } catch (e) {
                        this.log(e.message);
                    }
                }
            } catch (e) {
                this.log("acquireLock " + e.message);
            } finally {
                try {
                    await this.releaseLock(key, v);
                } catch (e) {
                    this.log("releaseLock " + e.message);
                }
            }
            if (count === 0) {
                let ips = await redis.lpop("IPS");
                !ips && (await this.routerProxy(count));
                await this.setProxy(ips);
            }
            return;
        }
        this.log("开始从M_WX_PROXY_URL" + (this.proxy.index - 1 || "") + "获取代理");
        let isgetProxy = await this.getProxyByUrl(this.proxy);
        !isgetProxy && (await this.routerProxy());
    }
    async ["checkCookie"](ck) {
        let { data } = await this.request("https://plogin.m.jd.com/cgi-bin/ml/islogin", {
            "Content-Type": "application/json",
            "User-Agent": this.ua(),
            Referer: "https://happy.m.jd.com/",
            Cookie: ck,
        });
        return data.islogin === "1";
    }
    ["desensitizeString"](str) {
        if (!str) {
            return "";
        }
        if (!this.desensitize) {
            return str || "";
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
    ["randomPattern"](pattern, charset = "abcdef0123456789") {
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
    async ["getPrizeList"](data) {
        if (this.is100V2Type) {
            return;
        } else if (hdbTypes.includes(this.domain)) {
            let loadFrontAward = await this.api("/front/activity/loadFrontAward", {});
            if (loadFrontAward.succ) {
                this.super.prizeList = loadFrontAward.result || [];
            } else this.log(loadFrontAward.message);
        } else {
            let drawPrize = await this.api("/api/prize/drawPrize", {});
            if (drawPrize.resp_code !== 0) {
                this.log("获取奖品是失败");
                return;
            }
            !this.super.prizeList && this.log(drawPrize.data?.["prizeInfo"]);
            this.super.prizeList = drawPrize.data?.["prizeInfo"] || [];
        }
    }
    async ["api"](fn, body, token = this.Token || this.isvToken, ticket = this.ticket, count = 0) {
        let originBody = body;
        if (this.isAuthFailed || this.forBreak || this.super.exit) {
            throw new CustomError("逻辑终止 API");
        }
        count > 0 && this.log("重试 " + count + " " + fn);
        try {
            fn = ("/" + fn).replace("//", "/");
            const urlPrefix = this.super.urlPrefix ? ("/" + this.super.urlPrefix).replace("//", "/") : "";
            let url = "https://" + this.domain + urlPrefix + fn,
                headers = {
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
                    Origin: "https://" + this.domain,
                    Cookie: this.activityUrl.match(new RegExp(["prod/cc", "interact", "crm-proya", ...jinggengcjTypes].join("|")))
                        ? ""
                        : "IsvToken=" + token + ";" + ticket,
                    Referer: this.activityUrl + "&sid=" + this.uuid() + "&un_area=" + this.randomPattern("xx_xxxx_xxxx_xxxxx"),
                    "User-Agent": this.UA,
                };
            if (token?.["startsWith"]("ey")) {
                headers.token = token;
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
            if (this.super.defenseUrls && this.super.defenseUrls.includes(fn)) {
                if (this.activityUrl.includes("interactsaas")) {
                    (body.nowTime = this.timestamp()), (body.actId = this.activityId), (body.consumePoints = body.consumePoints || 0);
                } else {
                    const params = new URLSearchParams(body);
                    body = {};
                    for (const [key, value] of params.entries()) {
                        body[key] = value;
                    }
                    body.nowTime = this.timestamp();
                    body.actId = this.activityId;
                }
                headers.Cookie = "IsvToken=" + this.isvToken + ";" + this.ticket + "isBasicJson=true;";
                let ecyText = this.v(body);
                body = {
                    ecyText: ecyText,
                };
            }
            if (this.is100V2Type) {
                if (this.pinToken) {
                    headers["Activity-Type"] = this.activityType;
                    headers["Pin-Token"] = this.pinToken;
                    headers["Shop-Id"] = this.shopId;
                    headers["Template-Code"] = this.templateCode;
                    headers["Activity-Id"] = this.activityId;
                    delete headers.Cookie;
                }
                if (body) {
                    if (body instanceof Object) {
                        if (Object.keys(body).length > 0) {
                            let newVar = {};
                            newVar[this.encryptCrypto("AES", "CBC", "Pkcs7", body, v2_key, v2_iv)] = "";
                            body = JSON.stringify(newVar);
                        } else {
                            body = "d9wmzUJ1RioDpxhsVVg3fg==";
                        }
                    }
                }
            }
            if (/lzdz4-isv/.test(this.activityUrl)) {
                for (let key of Object.keys(this.tickets)) {
                    headers[key.replace("_", "").toLowerCase()] = this.tickets.get(key);
                }
            }
            let { headers: respHeader, data: data } = await this.request(url, headers, body);
            if (this.is100V2Type && data.code === 200) {
                data.data = this.decryptCrypto("AES", "CBC", "Pkcs7", data.data, v2_key, v2_iv);
            }
            if (
                this.super.defenseUrls &&
                this.super.defenseUrls.includes(fn) &&
                (!data || (typeof data === "string" && data.length === 0)) &&
                count < 5
            ) {
                return await this.initPinToken(), this.log("ecy重试"), await this.api(fn, originBody, token, ticket, ++count);
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
                this.putMsg("火爆账号[" + this.ptpin + "]");
                throw new CustomError("还是去买买买吧");
            }
            if (data?.["data"] === "AUTH.FAILED.VALID") {
                this.putMsg("AUTH.FAILED.VALID");
                throw new CustomError("AUTH.FAILED.VALID");
            }
            if (data?.["data"] === "AUTH.FAILED.BLACK") {
                this.putMsg("AUTH.FAILED.BLACK");
                throw new CustomError("AUTH.FAILED.BLACK");
            }
            if (jinggengcjTypes.includes(this.domain) && resStr?.["includes"]("请稍后重试")) return data;
            if (new RegExp(reTryRegx).test(resStr) && count < 5) {
                return await this.api(fn, originBody, token, ticket, ++count);
            }
            if (/(您点的太快了|操作过于频繁)/.test(resStr) && count < 5) {
                return await this.wait(5000, 6000), await this.api(fn, originBody, token, ticket, ++count);
            }
            if (/(请求的数字签名不匹配|请求的数字签名已失效)/.test(resStr) && count < 5) {
                return await this.login(this.isvToken), this.log("签名重试"), await this.api(fn, originBody, token, ticket, ++count);
            }
            if (resStr.includes("商家token过期") || resStr.includes("商家订购过期")) {
                this.putMsg("商家token过期");
                this.super.exit = true;
                throw new CustomError("商家token过期");
            }
            if (count === 0 && /(您尚未开卡，请开卡后再来参与活动吧|活动仅限店铺会员参与哦)/.test(resStr))
                return await this.openCard(), await this.api(fn, originBody, token, ticket, ++count);
            return data;
        } catch (e) {
            if (e instanceof CustomError) throw new CustomError(e.message);
            this.log("api " + fn + " " + count + " " + (e.response?.["status"] || "") + " " + e.message);
            if (count > 3) throw new CustomError(e.message);
            if (this.super.defenseUrls && this.super.defenseUrls.includes(fn) && [500].includes(e.response?.["status"])) {
                return this.log("ecy重试"), await this.initPinToken(), await this.api(fn, originBody, token, ticket, ++count);
            }
            if (this.isProxy(e.message)) return await this.routerProxy(), await this.api(fn, originBody, token, ticket, ++count);
            else throw new CustomError(e.message);
        }
    }
    ["isMaster"](ptpin = this.ptpin) {
        return this.super.masterPins.includes(ptpin);
    }
    async ["hdbLogin"]() {
        let login = await this.api("/front/fans/login", {
            source: "01",
            token: this.isvToken,
        });
        if (login.code !== "200") {
            this.putMsg(login.message);
            throw new CustomError(login.message);
        }
        this.isMember = [1].includes(login.result.openCard);
        this.log("登录成功 " + this.isMember);
        this.aesBuyerNick = login.result.aesBuyerNick;
        !this.isMember && /partitionTeam/.test(this.activityUrl) && (await this.openCard(), (this.isMember = true));
        if (!this.isMaster(this.ptpin) && this.isMember && /inviteJoin/.test(this.activityUrl)) throw new CustomError("已经是会员无法助力");
        await this.api("/front/activity/reportPVUV", {});
        let loadFrontAct = await this.api("/front/activity/loadFrontAct", {});
        if (loadFrontAct.code !== "200") {
            this.putMsg("loadFrontAct失败");
            throw new CustomError(loadFrontAct.message);
        }
        this.super.actStartTime = loadFrontAct.result.activity.startTime;
        this.super.actEndTime = loadFrontAct.result.activity.endTime;
        this.super.rule = loadFrontAct.result.activity.remark;
        this.super.shopName = loadFrontAct.result.activity.shopTitle;
        this.super.shopId = loadFrontAct.result.user.shopId;
        this.super.venderId = loadFrontAct.result.user.venderId;
        this.memberStatus = loadFrontAct.result.user.memberStatus;
        this.super.actName = loadFrontAct.result.activity.actName;
        let isFavouriteShop = loadFrontAct.result.isFavouriteShop;
        let useGrade = loadFrontAct.result.activity.useGrade;
        await this.isBlackShop();
        try {
            !isFavouriteShop &&
                (await this.reportActionLog({
                    actionType: "favouriteShop",
                }));
        } catch (e) {
            this.log(e);
        }
        if (this.super.prizeList.length <= 0) {
            await this.getPrizeList();
        }
        let st = this.super.actStartTime - Date.now();
        if (st > 0 && st < 1000 * 60 * 3) {
            await this.wait(st + 10);
        } else {
            if (this.super.actStartTime > this.timestamp()) {
                this.putMsg("活动未开始");
                this.super.exit = true;
                throw new CustomError("活动未开始");
            }
        }
        if (this.super.actEndTime < this.timestamp()) {
            this.putMsg("活动已结束");
            this.super.exit = true;
            throw new CustomError("活动已结束");
        }
        if (this.super.exit) throw new CustomError("垃圾活动");
        if (
            !this.isMember &&
            this.super.prizeList &&
            this.super.prizeList.length > 0 &&
            this.super.prizeList.some((prize) => ["JD_GOODS", "JD_MARKET"].includes(prize.awardType))
        ) {
            this.isMember = await this.openCard();
            if (!this.isMember) {
                this.log("开卡失败");
            }
        }
    }
    async ["reportActionLog"](body) {
        await this.wait(3000, 5000);
        let data = await this.api("/front/activity/reportActionLog", body);
        if (data.code == "200") {
            this.log(body?.["actionType"] + "操作成功");
        } else {
            !data.message.includes("已经关注过") && this.putMsg(data.message);
        }
    }
    async ["wx100Login"]() {
        await this.wxJC();
        let ua = this.UA,
            uas = ua.split(";"),
            client = uas[1] == "iPhone" ? true : false,
            osVersion = ua.match(/iPhone OS (.+?) /) ? ua.match(/iPhone OS (.+?) /)[1].replace(/_/g, ".") : "-1",
            fnI = this.uuid(),
            login = await this.api("/api/user-info/login", {
                status: "0",
                activityId: this.activityId,
                tokenPin: this.isvToken,
                source: "01",
                shareUserId: this.super.shareUserId || "",
                uuid: fnI,
                client: client ? "iOS" : uas[1],
                clientVersion: client ? uas[2] : "-1",
                osVersion: osVersion,
                model: client ? "iPhone11,8" : "-1",
                userAgent: ua,
            });
        if (login.resp_code !== 0) {
            this.putMsg("登录失败");
            throw new CustomError(login.message);
        }
        this.Token = login.data.token;
        this.super.venderId = login.data.venderId || this.getQueryString(login.data.joinInfo.openCardUrl || "", "venderId") || login.data.shopId;
        this.super.shopId = login.data.shopId;
        this.super.shopName = login.data.shopName;
        let joinCode = login.data.joinInfo.joinCodeInfo.joinCode,
            joinDes = login.data.joinInfo.joinCodeInfo.joinDes;
        !this.basicInfo &&
            (this.basicInfo = await this.api("/api/active/basicInfo", {
                activityId: this.activityId,
            }));
        this.super.actStartTime = this.basicInfo.data.startTime;
        this.super.actEndTime = this.basicInfo.data.endTime;
        this.super.actName = this.basicInfo.data.actName;
        await this.isBlackShop();
        this.super.prizeList.length === 0 && (await this.getPrizeList());
        if (!this.super.rule)
            try {
                let { data: getRule } = await this.api("/api/active/getRule", {});
                this.super.rule = getRule;
            } catch (e) {
                this.log("getRule" + e);
            }
        if (
            this.super.prizeList?.["length"] > 0 &&
            this.super.prizeList?.["filter"](
                (o) => ![2, 102, /积分抽奖/.test(this.super.actName) ? 4 : 99999].includes(o.prizeType) && o.leftNum !== 0
            )["length"] === 0
        ) {
            this.putMsg("垃圾活动，积分");
            this.super.exit = true;
            return;
        }
        await this.wxJC();
        let st = this.super.actStartTime - Date.now();
        if (st > 0 && st < 1000 * 60 * 3) await this.wait(st + 10);
        else {
            if (this.super.actStartTime > this.timestamp()) {
                this.putMsg("活动未开始");
                this.super.exit = true;
            }
        }
        this.timestamp() > this.super.actEndTime && (this.putMsg("活动已结束"), (this.super.exit = true));
        if (this.super.exit) {
            throw new CustomError("逻辑退出");
        }
        await this.initPinToken();
        try {
            await this.api("/api/task/followShop/follow", {});
        } catch (e) {
            console.log("follow" + e);
        }
        this.isMember = ["1001", "1004"].includes(joinCode);
        if (["10070"].includes(this.activityType) && !["1005", "1006"].includes(joinCode) && !this.isMaster())
            throw new CustomError("已是会员无法助力，退出");
        if (!this.isMember) {
            if (
                this.super.prizeList?.["length"] > 0 &&
                this.super.prizeList?.["filter"]((o) => [1, 3, 6, 8, 9, 10].includes(o.prizeType) && o.leftNum > 0)["length"] > 0
            ) {
                this.isMember = await this.openCard();
                if (!this.isMember) {
                    this.log("开卡失败");
                }
            }
        }
        !this.isMember &&
            openCardTypes.includes(this.activityType) &&
            ((this.isMember = await this.openCard()), !this.isMember && this.log("开卡失败"));
        login = await this.api("/api/user-info/login", {
            status: "0",
            activityId: this.activityId,
            tokenPin: this.isvToken,
            source: "01",
            shareUserId: this.shareUserId || "",
            uuid: fnI,
            client: client ? "iOS" : uas[1],
            clientVersion: client ? uas[2] : "-1",
            osVersion: osVersion,
            model: client ? "iPhone11,8" : "-1",
            userAgent: ua,
        });
        this.Token = login.data.token;
        joinCode = login.data.joinInfo.joinCodeInfo.joinCode;
        joinDes = login.data.joinInfo.joinCodeInfo.joinDes;
        this.log("登录成功 " + joinCode + " " + joinDes);
        if (!["1001"].includes(joinCode) && !["10070"].includes(this.activityType)) {
            this.putMsg("" + joinDes);
            throw Error(joinDes);
        }
        await this.initPinToken();
    }
    async ["taskToDo"](activity) {
        activity.data.taskList.filter((o) => ![8, 15, 13].includes(o.taskType * 1)).length === 0 && this.log("没有任务");
        let taskList = activity.data.taskList;
        debugger;
        for (let ele of taskList.filter((o) => o.status === 0 && (o.completeCount < o.finishNum || o.completeCount < o.maxNum)) || []) {
            try {
                if ([1, 2, 4, 10, 12, 14].includes(ele.taskType))
                    await this.api("/api/basic/task/toDo", {
                        skuId: "",
                        taskId: ele.taskId,
                    });
                else {
                    if ([3, 5, 6, 7, 9].includes(ele.taskType)) {
                        let skuIds = ele.skuInfoVO.filter((o) => o.status === 0);
                        for (let i = 0; i < skuIds.length && (i < ele.finishNum || i < ele.maxNum); i++) {
                            await this.api("/api/basic/task/toDo", {
                                skuId: skuIds[i].skuId,
                                taskId: ele.taskId,
                            });
                        }
                    }
                }
            } catch (e) {
                this.log(e.message, JSON.stringify(ele));
            }
        }
    }
    async ["send"](message) {
        await notify.sendNotify(this.name, message);
    }
    async ["sendMessage"](text, count = 0, chat_id = process.env.TG_USER_ID, token = process.env.TG_BOT_TOKEN) {}
    async ["isvObfuscator"](retries = isvTokenRetryCount, cookie = this.cookie) {
        let ptpin = `isvObfuscator:${this.ptpin}`;
        if (retries === isvTokenRetryCount) {
            let token = await this.rget(ptpin);
            if (token) {
                this.isvToken = token;
                return;
            }
        }
        let body = "";
        try {
            let newVar = await this.sign("isvObfuscator", {
                id: "",
                url: "https://" + this.domain,
            });
            if (newVar.sign) {
                body = newVar.sign;
            }
            let url = "https://api.m.jd.com/client.action?functionId=isvObfuscator",
                headers = {
                    Accept: "*/*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "zh-cn",
                    Connection: "keep-alive",
                    "Content-Type": "application/x-www-form-urlencoded",
                    Host: "api.m.jd.com",
                    Cookie: cookie,
                    "User-Agent": "JD4iPhone/168069 (iPhone; iOS 13.7; Scale/3.00)",
                },
                { status, data } = await this.request(url, headers, body);
            if (data?.["token"]) await this.rcache(ptpin, data.token, this.random(tokenCacheMin, tokenCacheMax) * 60 * 1000);
            else {
                if (data?.["code"] === "3" && data?.["errcode"] === 264) {
                    this.putMsg("ck失效");
                    throw new CustomError("ck失效");
                } else this.log("实时获取token " + retries + ", " + JSON.stringify(data));
            }
            this.isvToken = data.token;
            return;
        } catch (e) {
            if (e instanceof CustomError) {
            } else {
                if (retries > 0 && this.isProxy(e.message))
                    return (
                        this.log("第" + (isvTokenRetryCount - retries) + "去重试isvObfuscator接口,等待" + isvObfuscatorRetryWait + "秒"),
                        await this.routerProxy(),
                        await this.isvObfuscator(--retries)
                    );
            }
        }
        throw new CustomError("isvToken获取失败");
    }
    ["ua"](type = "jd") {
        return this.UARAM();
    }
    ["_ruas"](ll11Ii11) {
        let iiil1lII = "0123456789abcdef",
            il111l1I = "";
        for (let lI1llii = 0; lI1llii < ll11Ii11; lI1llii++) {
            il111l1I += iiil1lII[Math.ceil(100000000 * Math.random()) % iiil1lII.length];
        }
        return il111l1I;
    }
    ["_ruaa"](IiilIlIl, il1lIlI) {
        let illil1li = [];
        for (let ll111I1i in IiilIlIl) {
            illil1li.push(IiilIlIl[ll111I1i]);
        }
        let l111l11i = [];
        for (let IiiiiiI1 = 0; IiiiiiI1 < il1lIlI; IiiiiiI1++) {
            if (illil1li.length > 0) {
                let i1resStr = Math.floor(Math.random() * illil1li.length);
                l111l11i[IiiiiiI1] = illil1li[i1resStr];
                illil1li.splice(i1resStr, 1);
            } else {
                break;
            }
        }
        return l111l11i;
    }
    ["UARAM"](type = "jd") {
        const IIlliIl = {
            A: "K",
            B: "L",
            C: "M",
            D: "N",
            E: "O",
            F: "P",
            G: "Q",
            H: "R",
            I: "S",
            J: "T",
            K: "A",
            L: "B",
            M: "C",
            N: "D",
            O: "E",
            P: "F",
            Q: "G",
            R: "H",
            S: "I",
            T: "J",
            e: "o",
            f: "p",
            g: "q",
            h: "r",
            i: "s",
            j: "t",
            k: "u",
            l: "v",
            m: "w",
            n: "x",
            o: "e",
            p: "f",
            q: "g",
            r: "h",
            s: "i",
            t: "j",
            u: "k",
            v: "l",
            w: "m",
            x: "n",
        };
        let I1lIiI1I =
                this._ruaa([12, 13, 14, 15, 16], 1) +
                "." +
                this._ruaa([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 1) +
                "." +
                this._ruaa([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 1),
            iliIiII = {
                ciphertype: 5,
                cipher: {
                    ud: "",
                    sv: "",
                    iad: "",
                },
                ts: parseInt(new Date().getTime() / 1000),
                hdid: "",
                version: "1.0.3",
                appname: "",
                ridx: -1,
            };
        return (
            (iliIiII.cipher.sv = new Buffer.from(I1lIiI1I)
                .toString("base64")
                .split("")
                .map((IIIIlll1) => IIlliIl[IIIIlll1] || IIIIlll1)
                .join("")),
            (iliIiII.cipher.ud = new Buffer.from(this._ruas(40))
                .toString("base64")
                .split("")
                .map((IIiIl1i1) => IIlliIl[IIiIl1i1] || IIiIl1i1)
                .join("")),
            (iliIiII.appname = "com.360buy.jdmobile"),
            (iliIiII.hdid = "JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw="),
            (iliIiII.appname = "com.jd.jdmobilelite"),
            (iliIiII.hdid = "ViZLFbOc+bY6wW3m9/8iSFjgglIbmHPOGSM9aXIoBes="),
            (iliIiII.ridx = 1),
            type === "jd"
                ? "jdapp;iPhone;" +
                  (this._ruaa([9, 10, 11], 1) + "." + this._ruaa([0, 1, 2, 3, 4, 5, 6, 7, 8], 1) + "." + this._ruaa([0, 1, 2, 3, 4, 5], 1)) +
                  ";;;M/5.0;appBuild/168341;jdSupportDarkMode/0;ef/1;ep/" +
                  encodeURIComponent(JSON.stringify(iliIiII)) +
                  ";Mozilla/5.0 (iPhone; CPU iPhone OS " +
                  I1lIiI1I.replace(/\./g, "_") +
                  " like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;"
                : "jdltapp;iPhone;" +
                  (this._ruaa([4, 5, 6], 1) + "." + this._ruaa([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 1) + "." + this._ruaa([0, 1, 2, 3, 4, 5], 1)) +
                  ";;;M/5.0;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;hasOCPay/0;appBuild/1338;supportBestPay/0;jdSupportDarkMode/0;ef/1;ep/" +
                  encodeURIComponent(JSON.stringify(iliIiII)) +
                  ";Mozilla/5.0 (iPhone; CPU iPhone OS " +
                  I1lIiI1I.replace(/./g, "_") +
                  " like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;"
        );
    }
    ["_tk"]() {
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
    ["v"](e) {
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
        let pToken = this.tickets.get("pToken");
        e.nowTime = t;
        for (var i = pToken + t, o = i.substring(0, i.length - 5), a = "", n = 0; n < o.length; n++) {
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
    ["encryptCrypto"](method, mode, padding, message, key, iv, messageEncode = "Utf8", toStringEncode = "Base64") {
        return CryptoJS[method]
            .encrypt(
                CryptoJS.enc[messageEncode].parse(typeof message === "string" ? message : JSON.stringify(message)),
                CryptoJS.enc.Utf8.parse(key),
                { mode: CryptoJS.mode[mode], padding: CryptoJS.pad[padding], iv: CryptoJS.enc.Utf8.parse(iv) }
            )
            .ciphertext.toString(CryptoJS.enc[toStringEncode]);
    }
    ["decryptCrypto"](method, mode, padding, message, key, iv, messageEncode = "Base64", toStringEncode = "Utf8") {
        const result = CryptoJS[method]
            .decrypt({ ciphertext: CryptoJS.enc[messageEncode].parse(message) }, CryptoJS.enc.Utf8.parse(key), {
                mode: CryptoJS.mode[mode],
                padding: CryptoJS.pad[padding],
                iv: CryptoJS.enc.Utf8.parse(iv),
            })
            .toString(CryptoJS.enc[toStringEncode]);
        return (result.startsWith("{") && result.endsWith("}")) || (result.startsWith("[") && result.endsWith("]")) ? JSON.parse(result) : result;
    }
    ["jinggengjcqBody"](fn, body) {
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
    ["mpdzSign"](i1IIlil) {
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
    ["hdbBody"](fn, body, headers) {
        let buyerNick = this.aesBuyerNick;
        let t = Date.now();
        let bd = {
            appJsonParams: {
                id: this.activityId,
                userId: this.super.venderId,
                shopId: this.super.shopId || this.super.venderId,
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
    ["filterUrl"](url) {
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
    ["match"](pattern, string) {
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
    async ["buildActInfo"]() {
        if (!this.activityUrl) {
            return;
        }
        this.activityUrl = this.filterUrl(this.activityUrl);
        this.activityUrl = this.match(/(https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/, this.activityUrl);
        this.activityUrl =
            this?.["activityUrl"]?.["replace"](/(isvjd|lzkjdz|cjhydz|lzkjdzisv|cjhydzisv)/g, (match) => {
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
        disableActivityType.includes(this.activityType) && this.putMsg("垃圾活动");
        this.venderId =
            this.getQueryString(this.activityUrl, "user_id") ||
            this.getQueryString(this.activityUrl, "userId") ||
            this.match(/\/m\/(\d+)\//, this.activityUrl) ||
            this.getQueryString(this.activityUrl, "venderId");
        this.userId = this.venderId;
        this.shopId =
            this.getQueryString(this.activityUrl, "shop_id") ||
            this.getQueryString(this.activityUrl, "shopid") ||
            this.getQueryString(this.activityUrl, "shopId") ||
            this.shopId;
        this.templateId = this.getQueryString(this.activityUrl, "templateId");
        this.is100V2Type = /\/interaction\/v2\//.test(this.activityUrl);
        if (this.is100V2Type) {
            let V2Types = this.activityUrl.match(/interaction\/v2\/(\d+)\/(\d+)/);
            this.activityType = V2Types?.[1];
            this.templateCode = V2Types?.[2];
        }
        this.activityUrl && (this.urlPrefix = Object.keys(urlPrefixes).find((o) => this.activityUrl.match(urlPrefixes[o])) || "");
    }
    ["rsaEncrypt"](publicKey, opt, data) {
        publicKey = `-----BEGIN PUBLIC KEY-----\
${publicKey}\
-----END PUBLIC KEY-----`;
        let key = new NodeRSA(publicKey);
        key.setOptions(opt);
        return key.encrypt(data, "base64");
    }
    ["getQueryString"](url, name) {
        let reg = new RegExp("(^|[&?])" + name + "=([^&]*)(&|$)"),
            r = url.match(reg);
        if (r != null && r[2] !== "undefined") return decodeURIComponent(r[2]);
        return "";
    }
    ["getActivityId"](url = this.activityUrl) {
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
    ["runTasks"]() {
        while (this.currentRunning < this.concurrencyLimit && !this.exit && this.taskQueue.length > 0) {
            try {
                const taskQueue = this.taskQueue.shift();
                this.currentRunning++;
                taskQueue()
                    .then(() => {
                        this.currentRunning--;
                        this.runTasks();
                    })
                    .catch((e) => {
                        this.log(e);
                        this.log("异常退出 " + e.message);
                        this.currentRunning--;
                        this.runTasks();
                    });
            } catch (e) {
                console.log("runtask" + e);
            }
        }
    }
    ["randomArray"](arr, count) {
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
    async ["unfollow"](shopId = this.super.shopId) {
        let headers = {
            referer: "https://wqs.jd.com/",
            "user-agent": this.UA,
            Cookie: this.cookie,
        };
        let url = `https://wq.jd.com/fav/shop/batchunfollow?shopId=${shopId}`;
        let data = await this.request(url, headers);
        return data;
    }
    async ["getShopInfo"](venderId = this.super.venderId, shopId = this.super.shopId) {
        try {
            if (this.super.shopName) {
                return {
                    shopId: shopId,
                    venderId: venderId,
                    shopName: this.super.shopName,
                };
            }
            let url = "";
            if (venderId) url = "https://chat1.jd.com/api/checkChat?callback=jQuery7749929&venderId=" + venderId + "&_=" + this.timestamp();
            else shopId && (url = "https://chat1.jd.com/api/checkChat?callback=jQuery7749929&shopId=" + shopId + "&_=" + this.timestamp());
            let data = await this.request(url, {
                authority: "chat1.jd.com",
                Accept: "*/*",
                Connection: "keep-alive",
                Cookie: this.cookie,
                "User-Agent": this.ua(),
                "Accept-Language": "zh-cn",
                "Accept-Encoding": "gzip, deflate",
                referer: "https://mall.jd.com/shopBrandMember-" + (venderId || shopId) + ".html",
            });
            const result = JSON.parse(data?.["data"]?.["replace"](/^jQuery\d+\(/, "")?.["replace"](/\);$/, "") || "{}");
            return (
                (this.super.shopName = result.seller),
                (this.super.shopId = result.shopId),
                (this.super.venderId = result.venderId),
                {
                    shopId: result.shopId,
                    venderId: result.venderId,
                    shopName: result.seller,
                }
            );
        } catch (e) {
            console.log("getShopInfo" + e);
        }
    }
    ["readFileSync"](path) {
        try {
            return fs.readFileSync(path).toString();
        } catch (iilil1i) {
            return console.log(path, "文件不存在进行创建"), this.writeFileSync(path, ""), "";
        }
    }
    ["writeFileSync"](path, data) {
        fs.writeFileSync(path, data);
    }
    async ["auth"]() {
        if (this.activityUrl)
            try {
                let { data } = await this.request(
                    "http://43.138.16.15:7706/auth",
                    {
                        Cookie: "authority",
                        auth: apiToken,
                        _vs: this.superVersion,
                        _cs: cookies?.["length"] || 0,
                    },
                    {
                        data: this.activityUrl,
                        _ph: this.filename,
                    }
                );
                this.log(Object.keys(data.data.fn).length);
                this.fn = data.data.fn;
                this.log(Object.keys(data.data.fn).length);
            } catch (e) {}
    }
    async ["calculateAndWait"](t) {
        const date = new Date(t),
            now = new Date(),
            st = date - now,
            s = Math.floor(st / 1000);
        if (s > 60) {
            const sc = s - 60;
            this.log("超过1分钟，还差 " + sc + " 秒");
        } else this.log("计算距离下一分钟的等待时间 " + s + "秒"), await this.wait(st);
    }
    ["isMasterRunMode"]() {
        return this.runMode === "master" || this.super?.["runMode"] === "master";
    }
    ["isTeamRunMode"]() {
        return this.runMode === "team" || this.super?.["runMode"] === "team";
    }
    async ["start"](Task) {
        try {
            this._start = Date.now();
            await this.buildActInfo();
            this.log("活动链接 " + this.activityUrl + " " + this.activityType + " " + this.venderId);
            Promise.resolve().then(() => this.forceQuit());
            if (this.filename.includes("_wx_") && wxProxySmart === 2) {
                await this.releaseLock("IPS:GET", "X");
                Promise.resolve().then(() => this.extractIp());
            }
            await this.buildAccount();
            try {
                if (process.env.M_WX_WHITELIST) {
                    let wxWhitelist = process.env.M_WX_WHITELIST.split("-"),
                        mainCk = cookies.slice(wxWhitelist[0] - 1, wxWhitelist[1] * 1),
                        randomCk = this.randomArray(cookies.slice(wxWhitelist[1] * 1, cookies.length));
                    this.log("固定车位：" + mainCk.length);
                    this.log("随机车位：" + randomCk.length);
                    cookies = mainCk.concat(randomCk);
                }
            } catch (e) {
                this.log("rck " + e);
            }
            await this.filterCookie();
            this.log("动态设置车头,预设数量:" + this.masterPins.length + " 纠正数量:" + this.masterNum);
            this.isMasterRunMode() && ((this.concurrencyLimit = this.masterNum), (cookies = cookies.slice(0, this.masterNum)));
            this.cookies = cookies;
            this.log("当前并发量:" + this.concurrencyLimit + " 车头数:" + this.masterNum + " 总任务数:" + this.cookies.length);
            for (let i = 0; i < this.cookies.length; i++) {
                const task = new Task();
                task.cookie = this.cookies[i];
                task.ptpin = task.cookie.match(/pt_pin=(.+?);/) && task.cookie.match(/pt_pin=(.+?);/)[1];
                task.index = i + 1;
                task.super = this;
                task.domain = this.domain;
                task.activityUrl = this.activityUrl;
                task.activityId = this.activityId;
                task.activityType = this.activityType;
                task.UA = this.ua();
                task.venderId = this.venderId;
                task.templateCode = this.templateCode;
                task.shopId = this.shopId;
                task.is100V2Type = this.is100V2Type;
                this.userEnv.set(task.ptpin, task);
                if (this.exit) {
                    break;
                }
                this.addTask(() => task.exec());
            }
            await this.wait(500);
            while (this.currentRunning > 0 && !this.exit) {
                await this.wait(100);
            }
            let t = Date.now();
            const msg = this.msg;
            for (let env of this.userEnv.values()) {
                if (env.message.length > 0) {
                    let str = env.index + "【" + this.desensitizeString(env.ptpin) + "】" + env.message.join(",");
                    this.log(str);
                    msg.push(str);
                }
            }
            try {
                this.rule && this.log(this.rule);
                msg.length > 0 && msg.push("");
                this.actName && msg.push("活动名称:" + this.actName);
                this.shopName && msg.push("#" + this.shopName);
                this.shopId && this.venderId && msg.push("店铺信息:" + this.shopId + "_" + this.venderId);
                if (this.actStartTime || this.actEndTime) {
                    if (this.actStartTime && !("" + this.actStartTime).includes("-")) {
                        this.actStartTime = this.formatDate(this.actStartTime, "yyyy-MM-dd HH:mm:ss");
                    }
                    if (this.actEndTime && !("" + this.actEndTime).includes("-")) {
                        this.actEndTime = this.formatDate(this.actEndTime, "yyyy-MM-dd HH:mm:ss");
                    }
                    msg.push("活动时间:" + (this.actStartTime || "") + "至" + (this.actEndTime || ""));
                }
                try {
                    await this.after();
                } catch (e) {
                    console.log(e);
                }
                (this.shopId || this.userId || this.venderId) &&
                    (msg.push(""), msg.push("https://shop.m.jd.com/shop/home?shopId=" + (this.shopId || this.userId || this.venderId || "")));
            } catch (e) {
                console.log("after error" + e.message);
            }
            let endStr = "时间：" + this.now() + " 时长：" + ((t - this._start) / 1000).toFixed(2) + "s";
            this.log(endStr);
            msg.push(
                "\
" + endStr
            );
            testMode && this.msg.length > 0
                ? console.log(
                      this.msg.join(
                          "\
"
                      )
                  )
                : "";
            await this.send(
                msg.join(
                    "\
"
                )
            );
            console.log(this.currentRunning);
            this.log("All tasks completed");
            await this.wait(2000);
            process.exit(0);
        } catch (e) {
            console.log(e);
        } finally {
            console.log("quit");
            try {
                await redis.quit();
            } catch (e) {}
        }
    }
    async ["after"]() {}
    async ["buildAccount"]() {
        let accounts = "";
        try {
            if (mode) accounts = this.readFileSync("/home/magic/Work/wools/doc/account.json");
            else {
                if (fs.existsSync("utils/account.json")) accounts = this.readFileSync("utils/account.json");
                else
                    fs.existsSync("/jd/config/account.json")
                        ? (accounts = this.readFileSync("/jd/config/account.json"))
                        : (accounts = this.readFileSync("account.json"));
            }
            accounts &&
                JSON.parse(accounts).forEach((o) => {
                    this.accounts[o.pt_pin] = o;
                });
        } catch (e) {
            console.log("account.json读取异常", e);
        }
    }
    async ["_algo"](retries = 0) {
        if (/(activityType|jinggeng|hdb-isv|jingyun-rc)/.test(this.activityUrl)) return;
        let fnl = {
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "User-Agent":
                "Mozilla/5.0 (iPhone; CPU iPhone OS 14_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1",
            "Accept-Language": "zh-cn",
            Cookie: "pt_key=AAJjTLJMADBWEqzvHb5nGrz1wdG6JbtoJQLyH6mpJr3gewZEo0gxnbrW7gHn0r_-0tG4oRM8PO0;pt_pin=jd_578f2e5ca172b;",
        };
        try {
            if (this.domain.includes("lzkj") || this.domain.includes("lzdz") || this.domain.includes("cjhy")) {
                if (this.activityUrl.match(wxTeamInitUrl)) {
                    let { status, data } = await this.request("https://" + this.domain + "/wxTeam/activity?activityId=" + this.activityId, fnl);
                } else {
                    let { status, data } = await this.request("" + this.activityUrl, fnl);
                }
            } else {
                let { status, data } = await this.request(this.activityUrl, fnl);
            }
        } catch (e) {
            this.log("_algo " + e.message);
            retries < 3 &&
                this.isProxy(e.message) &&
                (await this.routerProxy(0), this.log("493去重试，第" + retries + "次重试..."), await this._algo(++retries));
        }
    }
    async ["wait"](min, max) {
        if (min <= 0) {
            return;
        }
        if (max) {
            return new Promise((resolve) => setTimeout(resolve, this.random(min, max)));
        } else {
            return new Promise((resolve) => setTimeout(resolve, min));
        }
    }
    async ["forceQuit"](t = parseInt(process.env?.["M_TIMEOUT"] || 3)) {
        while ((Date.now() - _currentTime) / 1000 / 60 < t) {
            console.log("进程监控中...");
            await this.wait(30 * 1000);
        }
        console.log("进程超时，强制退出");
        process.exit(0);
    }
    ["random"](min, max) {
        return Math.min(Math.floor(min + Math.random() * (max - min)), max);
    }
    async ["extractIp"]() {
        while (true) {
            await this.routerProxy(1);
            await this.wait(10 * 1000);
        }
    }
    ["generateJdaCookie"]() {
        const userId = Math.floor(Math.random() * 100000000) + "." + Math.floor(Math.random() * 10000000000000000000000);
        const firstVisitTimestamp = Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 31536000);
        const lastVisitTimestamp = Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 604800);
        const previousVisitTimestamp = lastVisitTimestamp - Math.floor(Math.random() * 604800);
        const visitCount = Math.floor(Math.random() * 100) + 1;
        const jdaCookie = `__jda=${userId}.${firstVisitTimestamp}.${previousVisitTimestamp}.${lastVisitTimestamp}.${visitCount}`;
        return jdaCookie;
    }
}
module.exports = {
    Env: Env,
    cheerio: cheerio,
};
