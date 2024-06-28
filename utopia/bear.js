let wxProxyEnable = parseInt(process.env.B_WX_PROXY_ENABLE || "2");
let wxProxyUrl = process.env.B_WX_PROXY_URL || "";
let wxProxySmart = parseInt(process.env.B_WX_PROXY_SMART || "2");
let wxProxyInterval = parseInt(process.env.B_WX_PROXY_INTERVAL || 120);
let wxProxyMode = parseInt(process.env.B_WX_PROXY_MODE || "1");
let wxProxyCheck = parseInt(process.env.B_WX_PROXY_CHECK || "1");
let proxyRegx = process.env.B_WX_PROXY_ENABLE_REGEXP
    ? process.env.B_WX_PROXY_ENABLE_REGEXP
    : "(Request failed with status code (403|407|493|429|500|502|503|504))|certificate|timeout|ECONNRESET|ECONNREFUSED|ETIMEDOUT|(tunneling socket could not be established)|(socket hang up)|(CONNECT response)";
let reTryRegx = "(哎呀活动火爆，请稍后再试|活动太火爆了|活动过于火爆|服务器数据忙|奖品与您擦肩而过了哟)";
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
    "此京豆计划已经结束",
];
process.env.B_WX_STOP_KEYWORD ? process.env.B_WX_STOP_KEYWORD.split(/[@,&|]/).forEach((item) => stopKeywords.push(item)) : "";
let addressStopKeywords = ["京豆", "红包", "券", "再来一次", "客服"];
let addressStopKeywordsRule = ["下单满", "签收后", "收到货后", "成功购买任意", "必须购买店铺内"];
process.env.B_WX_ADDRESS_STOP_KEYWORD ? process.env.B_WX_ADDRESS_STOP_KEYWORD.split(/[@,&|]/).forEach((item) => addressStopKeywords.push(item)) : "";
process.env.B_WX_ADDRESS_STOP_KEYWORD_RULE
    ? process.env.B_WX_ADDRESS_STOP_KEYWORD_RULE.split(/[@,&|]/).forEach((item) => addressStopKeywordsRule.push(item))
    : "";
let isvObfuscatorRetry = parseInt(process.env?.B_WX_ISVOBFUSCATOR_RETRY || 1);
let isvObfuscatorRetryWait = parseInt(process.env?.B_WX_ISVOBFUSCATOR_RETRY_WAIT || 2);
let wxWhitelist = [];
process.env.B_WX_WHITELIST
    ? process.env.B_WX_WHITELIST.split(/[@,&|]/).forEach((item) => wxWhitelist.push(item.includes("-") ? item : item * 1))
    : [];
const notInitPinTokenRegx = /lorealjdcampaign-rc.isvjcloud.com|interaction/;
let messageMasked = parseInt(process.env.B_WX_MESSAGE_MASKED || "2");
let wxEnableOtherEnv = parseInt(process.env.B_WX_ENABLE_OTHER_ENV || "1");
let messageSingle = parseInt(process.env.B_WX_MESSAGE_SINGLE || "2");
let addressUseNum = parseInt(process.env.B_WX_ADDRESS_USE_NUM || "0");
const il1I11ii = require("axios"),
    I1iIllIl = require("qs"),
    liIiI11 = require("crypto-js"),
    ilIIilil = require("base-64"),
    iIll1IiI = require("node-rsa"),
    llii1iii = require("fs"),
    iIIIiiil = require("path"),
    { format: i11Ii1I1 } = require("date-fns"),
    Iil11II1 = require("./jdCookie.js"),
    { HttpsProxyAgent: lII11lli } = require("https-proxy-agent"),
    llIl1Ili = require("cheerio"),
    II1l11Ii = require("yaml"),
    i1liIIII = require("./sendNotify"),
    I11ilIl = {
        "/prod/cc/interactsaas": /interactsaas/,
        "/crm-proya/apps/interact": /crm-proya/,
        "/apps/interac": /lorealjdcampaign-rc.isvjcloud.com\/prod\/cc/,
        "/prod/cc/cjwx": /lorealjdcampaign-rc.isvjcloud.com\/prod\/cc\/cjwx/,
        "/apps/interact": /lorealjdcampaign-rc.isvjcloud.com\/interact/,
        "/prod/cc/interaction/v1": /interaction\/v1/,
        "/prod/cc/interaction/v2": /interaction\/v2/,
    };
let Ili1II1i = parseInt(process.env.B_WX_RUN_MODE || "1"),
    lIi11IIl = parseInt(process.env.B_WX_SCHEDULE || "1"),
    ll1Ilili = parseInt(process.env.B_WX_TIMEOUT_DURATION || "30"),
    i1lillli = ["10052"];
process.env.B_WX_OPEN_CARD_TYPES ? process.env.B_WX_OPEN_CARD_TYPES.split(/[@,&|]/).forEach((l1II1111) => i1lillli.push(l1II1111)) : "";
let iiIli1l1 = process.env.B_API_TOKEN ? process.env.B_API_TOKEN : "",
    Iil1l11l = parseInt(process.env.B_WX_SHOW_DEBUG_INFO || "2"),
    IiIiii11 = ["hdb-isv.isvjcloud.com", "jingyun-rc.isvjcloud.com"];
class II1i1l1I extends Error {
    constructor(lilliIi1) {
        super(lilliIi1);
        this.name = "customAssert";
    }
}
class il1iii1I extends Error {
    constructor(II1Iili1) {
        super(II1Iili1);
        this.name = "customStop";
    }
}
function ilI(...IliIlIil) {
    const i11 = new Date(),
        IlliiiIl = i11Ii1I1(i11, "yyyy-MM-dd HH:mm:ss.SSS"),
        IllI1IlI = IliIlIil.map((il1liII) => {
            if (il1liII && il1liII.constructor === Object) {
                return JSON.stringify(il1liII);
            }
            return il1liII;
        });
    console.log(IlliiiIl, ...IllI1IlI);
}
function llliIlii() {
    try {
        throw new Error();
    } catch (IIli11ii) {
        const IIIIiII =
            IIli11ii.stack.split(
                "\
"
            );
        for (let iIll11I = 2; iIll11I < IIIIiII.length; iIll11I++) {
            if (!IIIIiII[iIll11I].includes("process.processTicksAndRejections")) {
                const iIilIII = IIIIiII[iIll11I].trim();
                return console.log("Called by: " + iIilIII), iIilIII;
            }
        }
    }
    return "Unknown caller";
}
class llii11i1 {
    static ["ivs"] = [
        "13.2",
        "13.5",
        "14.4",
        "15.1",
        "15.1.1",
        "15.2",
        "15.2.1",
        "15.3",
        "15.3.1",
        "15.4",
        "15.4.1",
        "15.5",
        "16.0",
        "16.1",
        "16.6",
        "16.6.1",
        "16.7",
        "17.0",
        "17.1",
        "17.1.2",
        "17.2",
        "17.3",
        "17.4",
    ];
    static ["phones"] = [
        {
            model: "X",
            screen: "1125*2436",
            tf: "10,3",
            ivsRange: [0, 17],
        },
        {
            model: "XS",
            screen: "1125*2436",
            tf: "11,2",
            ivsRange: [0, 23],
        },
        {
            model: "XsMax",
            screen: "1242*2688",
            tf: "11,4",
            ivsRange: [0, 23],
        },
        {
            model: "XR",
            screen: "828*1792",
            tf: "11,8",
            ivsRange: [0, 23],
        },
        {
            model: "11",
            screen: "828*1792",
            tf: "12,1",
            ivsRange: [0, 23],
        },
        {
            model: "11Pro",
            screen: "1125*2436",
            tf: "12,3",
            ivsRange: [0, 23],
        },
        {
            model: "11ProMax",
            screen: "1242*2688",
            tf: "12,5",
            ivsRange: [0, 23],
        },
        {
            model: "12",
            screen: "1170*2532",
            tf: "13,2",
            ivsRange: [2, 23],
        },
        {
            model: "12Pro",
            screen: "1170*2532",
            tf: "13,3",
            ivsRange: [2, 23],
        },
        {
            model: "12ProMax",
            screen: "1284*2778",
            tf: "13,4",
            ivsRange: [2, 23],
        },
        {
            model: "13",
            screen: "1170*2532",
            tf: "14,5",
            ivsRange: [3, 23],
        },
        {
            model: "13Pro",
            screen: "1170*2532",
            tf: "14,2",
            ivsRange: [3, 23],
        },
        {
            model: "13ProMax",
            screen: "1284*2778",
            tf: "14,3",
            ivsRange: [3, 23],
        },
        {
            model: "14",
            screen: "1170*2532",
            tf: "14,7",
            ivsRange: [12, 23],
        },
        {
            model: "14Plus",
            screen: "1284*2778",
            tf: "14,8",
            ivsRange: [12, 23],
        },
        {
            model: "14Pro",
            screen: "1179*2556",
            tf: "15,2",
            ivsRange: [12, 23],
        },
        {
            model: "14ProMax",
            screen: "1290*2796",
            tf: "15,3",
            ivsRange: [12, 23],
        },
        {
            model: "15",
            screen: "1170*2532",
            tf: "15,4",
            ivsRange: [17, 23],
        },
        {
            model: "15Plus",
            screen: "1179*2556",
            tf: "15,5",
            ivsRange: [17, 23],
        },
        {
            model: "15Pro",
            screen: "1179*2556",
            tf: "16,1",
            ivsRange: [17, 23],
        },
        {
            model: "15ProMax",
            screen: "1290*2796",
            tf: "16,2",
            ivsRange: [17, 23],
        },
    ];
    static ["generatePhoneInfo"]() {
        const Ii1l1I = this.phones[Math.floor(Math.random() * this.phones.length)],
            I1Iiilil = this.ivs.slice(Ii1l1I.ivsRange[0], Ii1l1I.ivsRange[1]),
            IIi1i1I = I1Iiilil[Math.floor(Math.random() * I1Iiilil.length)],
            Iilil1l1 = {
                "12.1.3": "168893",
                "12.1.4": "168898",
                "12.2.5": "168943",
                "12.3.1": "168960",
                "12.3.2": "169031",
                "12.3.4": "169063",
                "12.3.5": "169076",
                "12.4.0": "169088",
            },
            lIiIiI11 = Object.keys(Iilil1l1),
            ill1ill1 = lIiIiI11[Math.floor(Math.random() * lIiIiI11.length)];
        return {
            phone: Ii1l1I.model,
            screen: Ii1l1I.screen,
            tf: Ii1l1I.tf,
            iv: IIi1i1I,
            clientVersion: ill1ill1,
            build: Iilil1l1[ill1ill1],
            uuid: ill1IiII(),
        };
    }
}
function ill1IiII(I11iII1 = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx") {
    return I11iII1.replace(/[xy]/g, function (lIiIIllI) {
        const Il1llIl = (16 * Math.random()) | 0,
            liI1IIlI = "x" === lIiIIllI ? Il1llIl : (3 & Il1llIl) | 8;
        return liI1IIlI.toString(36);
    });
}
function iiiiIill(II1Iiil1, liIlIIiI, iIiili1I) {
    const IllIIIli = [
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
    function lIlI1(I1I1li1l) {
        I1I1li1l = I1I1li1l.split("").reverse().join("");
        const iiliIiI = new Uint8Array(12),
            ilIlIlI = new TextEncoder().encode(I1I1li1l);
        for (let ll1I11Il = 0; ll1I11Il < ilIlIlI.length; ll1I11Il += 2) {
            let i11lIl1i = (ilIlIlI[ll1I11Il] << 5) | (ilIlIlI[ll1I11Il + 1] & 255);
            i11lIl1i %= 63;
            iiliIiI[ll1I11Il >> 1] = i11lIl1i;
        }
        let lIIiIll1 = "";
        for (let IIiliI = 0; IIiliI < iiliIiI.length; IIiliI++) {
            lIIiIll1 += (iiliIiI[IIiliI] + 256).toString(2).slice(1);
        }
        let ii1i1iil = "",
            il1Iii11 = "";
        for (let liliIliI = 0; liliIliI < 16; liliIliI++) {
            if (liliIliI !== 0) {
                const l1l1l11I = liliIliI * 6,
                    il1IiI = lIIiIll1.substring(l1l1l11I, l1l1l11I + 6);
                let iiliil1I = parseInt(il1IiI, 2);
                const llii111I = il1Iii11.split("");
                for (let iiil1lII = 0; iiil1lII < llii111I.length; iiil1lII++) {
                    if (llii111I[iiil1lII] === "1") {
                        iiliil1I = ((iiliil1I >> (6 - iiil1lII)) | (iiliil1I << iiil1lII)) & 63;
                    }
                }
                il1Iii11 = (iiliil1I & 63).toString(2).padStart(6, "0");
            } else il1Iii11 = lIIiIll1.substring(0, 6);
            ii1i1iil += il1Iii11;
        }
        for (let llilI1li = 0; llilI1li < 12; llilI1li++) {
            const i1IiIIll = llilI1li * 8;
            iiliIiI[llilI1li] = parseInt(ii1i1iil.substring(i1IiIIll, i1IiIIll + 8), 2);
        }
        const ill1lili = btoa(String.fromCharCode.apply(null, iiliIiI));
        return ill1lili;
    }
    let I11iliI = Date.now() + parseInt(iIiili1I);
    if (typeof II1Iiil1 != "object") {
        II1Iiil1 = JSON.parse(II1Iiil1);
    }
    II1Iiil1.nowTime = I11iliI;
    let lIIll = liIlIIiI + I11iliI;
    const Ii1i1ll1 = lIIll.substring(0, lIIll.length - 5);
    let iiii1ill = "";
    for (let lililIil = 0; lililIil < Ii1i1ll1.length; lililIil++) {
        let lii1l1I1 = Ii1i1ll1.charCodeAt(lililIil),
            lIiiiIli = lii1l1I1 % 10,
            iliII11l = IllIIIli[lIiiiIli][lililIil];
        iiii1ill += iliII11l;
    }
    var l11I111l = iiii1ill.length,
        iIiIIliI = Math.floor(l11I111l / 24),
        iiili1iI = "";
    for (var liiiilll = 0; liiiilll < 24; liiiilll++) {
        var ill1il11 = (liiiilll + 1) * iIiIIliI;
        liiiilll === 23 && (ill1il11 = l11I111l);
        var ili11lI1 = iiii1ill.substring(liiiilll * iIiIIliI, ill1il11),
            illIiiiI = [];
        for (var lliI1lI1 = 0; lliI1lI1 < ili11lI1.length; lliI1lI1++) {
            illIiiiI.push(ili11lI1.charCodeAt(lliI1lI1));
        }
        var i11Il1l = illIiiiI.reduce(function (IlI111Ii, l1iiIiII) {
                return IlI111Ii + l1iiIiII;
            }, 0),
            Iliill = Math.floor(i11Il1l / illIiiiI.length);
        iiili1iI += String.fromCharCode(Iliill);
    }
    iiii1ill = iiili1iI;
    const lI1IIilI = lIlI1(iiii1ill),
        ilIlIii = liIiI11.enc.Utf8.parse(lI1IIilI),
        illiIliI = liIiI11.enc.Utf8.parse(""),
        il11ll1 = liIiI11.AES.encrypt(JSON.stringify(II1Iiil1), ilIlIii, {
            iv: illiIliI,
            mode: liIiI11.mode.ECB,
            padding: liIiI11.pad.Pkcs7,
        });
    return il11ll1.toString();
}
function ll11i1l1(Ill11iII, iII1IIl1, lIli11i) {
    const ll1i11Il = [
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
    var i1IlIiI1 = Date.now() + parseInt(lIli11i);
    "object" != (void 0 === Ill11iII ? "undefined" : typeof Ill11iII) && (Ill11iII = JSON.parse(Ill11iII));
    Ill11iII.nowTime = i1IlIiI1;
    for (
        var i1I1I1i = "" + iII1IIl1 + i1IlIiI1, iil1l11i = i1I1I1i.substring(0, i1I1I1i.length - 5), iliIIi1 = "", IiIiiiII = 0;
        IiIiiiII < iil1l11i.length;
        IiIiiiII++
    ) {
        var liliiliI = iil1l11i.charCodeAt(IiIiiiII);
        iliIIi1 += ll1i11Il[liliiliI % 10][IiIiiiII];
    }
    for (var lIliIIl = iliIIi1.length, li1Ill11 = Math.floor(lIliIIl / 24), li1l1Il1 = "", IliiIl1 = 0; IliiIl1 < 24; IliiIl1++) {
        var i1Iliili = (IliiIl1 + 1) * li1Ill11;
        23 === IliiIl1 && (i1Iliili = lIliIIl);
        for (var iiiiii11 = iliIIi1.substring(IliiIl1 * li1Ill11, i1Iliili), IiIIii1i = [], iiliIII = 0; iiliIII < iiiiii11.length; iiliIII++) {
            IiIIii1i.push(iiiiii11.charCodeAt(iiliIII));
        }
        var liiilII1 = IiIIii1i.reduce(function (IlIllIIi, I1iliIl1) {
                return IlIllIIi + I1iliIl1;
            }, 0),
            IIliIII1 = Math.floor(liiilII1 / IiIIii1i.length);
        li1l1Il1 += String.fromCharCode(IIliIII1);
    }
    var I111llI1 = (function (IIl11I1l) {
            IIl11I1l = IIl11I1l.split("").reverse().join("");
            for (
                var IIilIllI = new Uint8Array(12), IIl11lii = new TextEncoder().encode(IIl11I1l), l1IiillI = 0;
                l1IiillI < IIl11lii.length;
                l1IiillI += 2
            ) {
                var I1IIliiI = (IIl11lii[l1IiillI] << 5) | (255 & IIl11lii[l1IiillI + 1]);
                I1IIliiI %= 63;
                IIilIllI[l1IiillI >> 1] = I1IIliiI;
            }
            for (var ilI1l11l = "", lIlIlIIi = 0; lIlIlIIi < IIilIllI.length; lIlIlIIi++) {
                ilI1l11l += (IIilIllI[lIlIlIIi] + 256).toString(2).slice(1);
            }
            for (var IIlIili = "", I1il1il1 = "", Iill1iIl = 0; Iill1iIl < 16; Iill1iIl++) {
                if (0 !== Iill1iIl) {
                    for (
                        var ll11iIi = 6 * Iill1iIl,
                            lIii11i1 = ilI1l11l.substring(ll11iIi, ll11iIi + 6),
                            IiII111 = parseInt(lIii11i1, 2),
                            I1illi1l = I1il1il1.split(""),
                            ilIlIl = 0;
                        ilIlIl < I1illi1l.length;
                        ilIlIl++
                    ) {
                        "1" === I1illi1l[ilIlIl] && (IiII111 = 63 & ((IiII111 >> (6 - ilIlIl)) | (IiII111 << ilIlIl)));
                    }
                    I1il1il1 = (63 & IiII111).toString(2).padStart(6, "0");
                } else I1il1il1 = ilI1l11l.substring(0, 6);
                IIlIili += I1il1il1;
            }
            for (var IIl1lIll = 0; IIl1lIll < 12; IIl1lIll++) {
                var I1iiiiI = 8 * IIl1lIll;
                IIilIllI[IIl1lIll] = parseInt(IIlIili.substring(I1iiiiI, I1iiiiI + 8), 2);
            }
            return Buffer.from(IIilIllI).toString("base64");
        })((iliIIi1 = li1l1Il1)),
        iliillI = liIiI11.enc.Utf8.parse(I111llI1),
        IlilI = liIiI11.enc.Utf8.parse("");
    return liIiI11.AES.encrypt(JSON.stringify(Ill11iII), iliillI, {
        iv: IlilI,
        mode: liIiI11.mode.ECB,
        padding: liIiI11.pad.Pkcs7,
    }).toString();
}
let IIi11l1I = __dirname.includes("bear");
IIi11l1I && (wxEnableOtherEnv = 2);
function ll11lli1(iI11I1Ii = {}) {
    const l11II11i = {
            method: "get",
            timeout: 30000,
        },
        I1Ii1IiI = Object.assign({}, l11II11i, iI11I1Ii),
        iii1l1li = il1I11ii.CancelToken.source(),
        iiIiill1 = I1Ii1IiI.timeout || 20000,
        lilili1l = setTimeout(() => {
            iii1l1li.cancel("Request canceled due to timeout (" + iiIiill1 + " ms)");
        }, iiIiill1);
    return il1I11ii({
        ...I1Ii1IiI,
        cancelToken: iii1l1li.token,
    })
        .then((llIIilI) => {
            return clearTimeout(lilili1l), llIIilI;
        })
        .catch((l11lliI) => {
            clearTimeout(lilili1l);
            throw l11lliI;
        });
}
class lIi1Iii1 {
    constructor(IIiiiI1I, l1iIIiii) {
        this.ua = IIiiiI1I;
        this.pin = l1iIIiii;
        this.av = IIiiiI1I.slice(IIiiiI1I.indexOf("/") + 1);
        this.sua = IIiiiI1I.substring(IIiiiI1I.indexOf("(") + 1, IIiiiI1I.indexOf(")"));
        this.random = this.#randomString(10, true);
        this.cacheInfo = {};
    }
    #getRandomString(lIi1lIll, I1I1I1II) {
        let lI1I11ii = "",
            II1l1iIl = lIi1lIll.split("");
        for (let lllIil1 = 0; lllIil1 < I1I1I1II; lllIil1++) {
            let l1lillIi = Math.floor(Math.random() * II1l1iIl.length);
            lI1I11ii += II1l1iIl[l1lillIi];
        }
        return lI1I11ii;
    }
    #randomString(illiIll1, l11lli11) {
        var I1lIilII = "",
            iI1lllil = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (var ii1l1l1I = 0; ii1l1l1I < illiIll1; ii1l1l1I++) {
            var lI1llIll = iI1lllil;
            ii1l1l1I === 0 && l11lli11 && (lI1llIll = iI1lllil.slice(1));
            var iIlIilI = Math.round(Math.random() * (lI1llIll.length - 1));
            I1lIilII += lI1llIll.substring(iIlIilI, iIlIilI + 1);
        }
        return I1lIilII;
    }
    #generateFp(llilIiIl) {
        let l1I11II1 = 3,
            I1li1il = "0123456789",
            ilIIIIIi = 12;
        if (llilIiIl === "4.3") (l1I11II1 = 3), (I1li1il = "kl9i1uct6d"), (ilIIIIIi = 12);
        else {
            if (llilIiIl == "4.2") (l1I11II1 = 4), (I1li1il = "6d0jhqw3pa"), (ilIIIIIi = 11);
            else llilIiIl == "4.1" && ((l1I11II1 = 6), (I1li1il = "uct6d0jhqw"), (ilIIIIIi = 9));
        }
        let lIliillI,
            iiIiiII1 = "";
        do {
            lIliillI = this.#getRandomString(I1li1il, 1);
            iiIiiII1.indexOf(lIliillI) == -1 && (iiIiiII1 += lIliillI);
        } while (iiIiiII1.length < l1I11II1);
        for (let IIIIlil1 of iiIiiII1.slice()) {
            I1li1il = I1li1il.replace(IIIIlil1, "");
        }
        let ilII1IIl = Math.floor(Math.random() * 10),
            iIili11l = this.#getRandomString(I1li1il, ilII1IIl) + iiIiiII1 + this.#getRandomString(I1li1il, ilIIIIIi - ilII1IIl) + ilII1IIl,
            iill1il1 = iIili11l.split(""),
            iI1II1I1;
        if (llilIiIl === "4.3") {
            let lIll1lI1 = iill1il1.slice(0, 10),
                iI1iIiii = iill1il1.slice(10),
                i1ilIii1 = lIll1lI1.reverse();
            iI1II1I1 = i1ilIii1.map((ilI11ii1) => (35 - parseInt(ilI11ii1, 36)).toString(36));
            iI1II1I1.push(...iI1iIiii);
        } else {
            if (llilIiIl === "4.1" || llilIiIl === "4.2") {
                let II1l11i1 = iill1il1.slice(0, 14),
                    iiIlII1i = iill1il1.slice(14),
                    lllIliI1 = II1l11i1.reverse();
                iI1II1I1 = lllIliI1.map((IiIll11l) => (35 - parseInt(IiIll11l, 36)).toString(36));
                iI1II1I1.push(...iiIlII1i);
            } else iI1II1I1 = iill1il1.reverse().map((IlI1lIl1) => 9 - parseInt(IlI1lIl1));
        }
        let lI1Iiii1 = iI1II1I1.join("");
        return lI1Iiii1;
    }
    #generateExpandParams(lllliill, lilii1l, iI11111i) {
        let IlIiI1Il = {};
        if (iI11111i === "4.3")
            IlIiI1Il = {
                wc: 0,
                wd: 0,
                l: "zh-CN",
                ls: "zh-CN,zh,zh-TW,en-US,en",
                ml: 0,
                pl: 0,
                av: this.av,
                ua: this.ua,
                sua: this.sua,
                pp: {
                    p2: this.pin,
                },
                extend: {
                    wd: 0,
                    l: 0,
                    ls: 0,
                    wk: 0,
                    bu1: "0.1.7",
                    bu2: 0,
                    bu3: 35,
                },
                pp1: "",
                w: 400,
                h: 700,
                ow: 400,
                oh: 700,
                url: "",
                og: "",
                pr: 1.25,
                re: "",
                random: this.random,
                referer: "",
                v: "h5_file_v4.3.1",
                ai: lllliill,
                fp: lilii1l,
            };
        else {
            if (iI11111i === "4.2")
                IlIiI1Il = {
                    wc: 0,
                    wd: 0,
                    l: "zh-CN",
                    ls: "zh-CN",
                    ml: 0,
                    pl: 0,
                    av: this.av,
                    ua: this.ua,
                    sua: this.sua,
                    pp: {},
                    extend: {
                        pm: 0,
                        wd: 0,
                        l: 0,
                        ls: 0,
                        wk: 0,
                        bu1: "0.1.9",
                    },
                    pp1: "",
                    pm: {
                        ps: "prompt",
                        np: "default",
                    },
                    w: 390,
                    h: 844,
                    ow: 390,
                    oh: 844,
                    url: "",
                    og: "",
                    pr: 1.25,
                    re: "",
                    random: this.random,
                    referer: "",
                    v: "h5_file_v4.2.0",
                    ai: lllliill,
                    fp: lilii1l,
                };
            else {
                if (iI11111i === "4.1") {
                    IlIiI1Il = {
                        wc: 0,
                        wd: 0,
                        l: "zh-CN",
                        ls: "zh-CN,zh,zh-TW,en-US,en",
                        ml: 0,
                        pl: 0,
                        av: this.av,
                        ua: this.ua,
                        sua: this.sua,
                        pp: {
                            p2: this.pin,
                        },
                        pp1: "",
                        pm: {
                            ps: "prompt",
                            np: "default",
                        },
                        w: 360,
                        h: 740,
                        ow: 360,
                        oh: 740,
                        url: "",
                        og: "",
                        pr: 4,
                        re: "",
                        random: this.random,
                        referer: "",
                        v: "v0.1.6",
                        ai: lllliill,
                        fp: lilii1l,
                    };
                } else
                    IlIiI1Il = {
                        wc: 0,
                        wd: 0,
                        l: "zh-CN",
                        ls: "zh-CN,zh,zh-TW,en-US,en",
                        ml: 0,
                        pl: 0,
                        av: this.av,
                        ua: this.ua,
                        sua: this.sua,
                        pp: {
                            p2: this.pin,
                        },
                        pp1: "",
                        pm: {
                            ps: "prompt",
                            np: "default",
                        },
                        w: 360,
                        h: 740,
                        ow: 360,
                        oh: 740,
                        url: "",
                        og: "",
                        pr: 4,
                        re: "",
                        ai: lllliill,
                        fp: lilii1l,
                    };
            }
        }
        return liIiI11.AES.encrypt(JSON.stringify(IlIiI1Il, null, 2), liIiI11.enc.Utf8.parse("wm0!@w-s#ll1flo("), {
            iv: liIiI11.enc.Utf8.parse("0102030405060708"),
            mode: liIiI11.mode.CBC,
            padding: liIiI11.pad.Pkcs7,
        }).ciphertext.toString(liIiI11.enc.Hex);
    }
    async #getAlgo(lili1iiI, liIiIi1I, i1ll1, li1I1lIl) {
        let lill1lli = "",
            Illll11 = {
                version: li1I1lIl,
                fp: liIiIi1I,
                fv: "v3.2.0",
                appId: lili1iiI,
                timestamp: Date.now(),
                platform: "web",
                expandParams: i1ll1,
            };
        if (li1I1lIl === "4.3") {
            Illll11.fv = "h5_file_v4.3.1";
        } else {
            if (li1I1lIl === "4.2") Illll11.fv = "h5_file_v4.2.0";
            else li1I1lIl === "4.1" && (Illll11.fv = "v1.6.1");
        }
        return new Promise((IilI1Ii1) => {
            il1I11ii({
                url: "https://cactus.jd.com/request_algo?g_ty=ajax",
                method: "post",
                data: Illll11,
            })
                .then((lliiIlll) => {
                    if (lliiIlll.status == 200) {
                        let iiiiI11l = lliiIlll.data.data.result;
                        lill1lli = {
                            tk: iiiiI11l.tk,
                            fp: iiiiI11l.fp,
                            rd: /(?<=rd=')[^']*/.exec(iiiiI11l.algo)[0],
                            algo: /(?<=algo\.)[^(]*/.exec(iiiiI11l.algo)[0],
                        };
                    }
                })
                .catch()
                .finally(() => {
                    IilI1Ii1(lill1lli);
                });
        });
    }
    #test(li1ll1il, I1iIIi1i, i1lii1iI, liillIii, il1iI1l1, ilIIliIi, IIi1ili1) {
        let i1liil11 = IIi1ili1 === "4.3" ? "22" : IIi1ili1 === "4.2" ? "74" : IIi1ili1 === "4.1" ? "04" : "",
            IiIIiliI = "" + I1iIIi1i + li1ll1il + i1lii1iI + i1liil11 + liillIii + il1iI1l1;
        return liIiI11[ilIIliIi](IiIIiliI, I1iIIi1i).toString(liIiI11.enc.Hex);
    }
    async ["encrypt"](liIli1I1, ilill1i, il1iIlI1, Il11i11i, ll1IiI1I, iiIiI1I1, iII1lI1i, Il11III1) {
        if (!(liIli1I1 in this.cacheInfo)) {
            let ll11Ili1 = this.#generateFp(Il11III1);
            const ill1illI = this.#generateExpandParams(liIli1I1, ll11Ili1, Il11III1);
            let iIli1ll1 = 0,
                ll1iliIl;
            while (iIli1ll1 < 3) {
                ll1iliIl = await this.#getAlgo(liIli1I1, ll11Ili1, ill1illI, Il11III1);
                if (ll1iliIl !== "") {
                    break;
                }
                iIli1ll1++;
            }
            this.cacheInfo[liIli1I1] = ll1iliIl;
        }
        const { tk: lIi1iI, rd: i1Ill1Ii, fp: IiiiIliI, algo: i11Illi1 } = this.cacheInfo[liIli1I1],
            Iiil11l = new Date(),
            IIlIl1Il = i11Ii1I1(Iiil11l, "yyyyMMddHHmmssSSS"),
            iIi11ii = this.#test(IiiiIliI, lIi1iI, IIlIl1Il, liIli1I1, i1Ill1Ii, i11Illi1, Il11III1),
            llIilIiI = typeof il1iIlI1 == "object" ? JSON.stringify(il1iIlI1) : il1iIlI1,
            IliillI = liIiI11.SHA256(llIilIiI).toString(liIiI11.enc.Hex);
        let lI1llllI = "appid:" + Il11i11i + "&body:" + IliillI;
        ll1IiI1I != null && (lI1llllI += "&client:" + ll1IiI1I);
        if (iiIiI1I1 != null) {
            lI1llllI += "&clientVersion:" + iiIiI1I1;
        }
        lI1llllI += "&functionId:" + ilill1i;
        iII1lI1i != null && (lI1llllI += "&t:" + iII1lI1i);
        let i1II1lil, il1ilIli, i1liIiil;
        if (Il11III1 === "4.3")
            (i1II1lil = liIiI11.HmacSHA256(lI1llllI, iIi11ii).toString(liIiI11.enc.Hex)),
                (il1ilIli = {
                    sua: this.sua,
                    pp: {
                        p2: this.pin,
                    },
                    extend: {
                        wd: 0,
                        l: 0,
                        ls: 0,
                        wk: 0,
                        bu1: "0.1.7",
                        bu2: 0,
                        bu3: 33,
                    },
                    random: this.random,
                    referer: "",
                    v: "h5_file_v4.3.1",
                    fp: IiiiIliI,
                }),
                (i1liIiil = "&d74&yWoV.EYbWbZ");
        else {
            if (Il11III1 === "4.2") {
                i1II1lil = liIiI11.SHA256("" + iIi11ii + lI1llllI + iIi11ii).toString(liIiI11.enc.Hex);
                il1ilIli = {
                    sua: this.sua,
                    pp: {
                        p2: this.pin,
                    },
                    extend: {
                        pm: 0,
                        wd: 0,
                        l: 0,
                        ls: 0,
                        wk: 0,
                        bu1: "0.1.9",
                    },
                    random: this.random,
                    referer: "",
                    v: "h5_file_v4.2.0",
                    fp: IiiiIliI,
                };
                i1liIiil = "DNiHi703B0&17hh1";
            } else {
                if (Il11III1 === "4.1") {
                    i1II1lil = liIiI11.MD5("" + iIi11ii + lI1llllI + iIi11ii).toString(liIiI11.enc.Hex);
                    il1ilIli = {
                        sua: this.sua,
                        pp: {
                            p2: this.pin,
                        },
                        random: this.random,
                        referer: "",
                        v: "v0.1.6",
                        fp: IiiiIliI,
                    };
                    i1liIiil = "HL4|FW#Chc3#q?0)";
                } else
                    (i1II1lil = liIiI11.HmacSHA256(lI1llllI, iIi11ii).toString(liIiI11.enc.Hex)),
                        (il1ilIli = {
                            sua: this.sua,
                            pp: {
                                p1: this.pin,
                            },
                            fp: IiiiIliI,
                        }),
                        (i1liIiil = "wm0!@w_s#ll1flo(");
            }
        }
        const Ii1lIii = liIiI11.AES.encrypt(JSON.stringify(il1ilIli, null, 2), liIiI11.enc.Utf8.parse(i1liIiil), {
                iv: liIiI11.enc.Utf8.parse("0102030405060708"),
                mode: liIiI11.mode.CBC,
                padding: liIiI11.pad.Pkcs7,
            }).ciphertext.toString(liIiI11.enc.Hex),
            illll1Ii =
                IIlIl1Il + ";" + IiiiIliI + ";" + liIli1I1 + ";" + lIi1iI + ";" + i1II1lil + ";" + Il11III1 + ";" + Iiil11l.getTime() + ";" + Ii1lIii;
        let i1iIllI1 = {
            functionId: ilill1i,
            body: llIilIiI,
            appid: Il11i11i,
            client: ll1IiI1I,
            clientVersion: iiIiI1I1,
            h5st: illll1Ii,
            t: iII1lI1i,
        };
        iII1lI1i == null && delete i1iIllI1.t;
        if (ll1IiI1I == null) {
            delete i1iIllI1.client;
        }
        return iiIiI1I1 == null && delete i1iIllI1.clientVersion, i1iIllI1;
    }
}
class l11i1Ii {
    constructor() {}
    static #get_uuid(lIl1I1l = 40) {
        if (lIl1I1l === 0) return "0";
        else {
            const lIii1I = this.#get_uuid(lIl1I1l - 1).replace(/^0+/, ""),
                llI1lilI = "0123456789abcdef";
            return lIii1I + llI1lilI[Math.floor(Math.random() * (llI1lilI.length - 6))];
        }
    }
    static #_md5(lIlllIIi) {
        const I1llIIIi = liIiI11.MD5(lIlllIIi);
        return I1llIIIi.toString(liIiI11.enc.Hex);
    }
    static #sub_v2(l11llIi) {
        const i11liiI = [55, 146, 68, 104, 165, 61, 204, 127, 187, 15, 217, 136, 238, 154, 233, 90],
            IiII111l = Buffer.from("80306f4370b39fd5630ad0529f77adb6", "utf-8");
        let Ii1I1l1I = new Array(IiII111l.length).fill(0);
        for (let IIlIIil in l11llIi) {
            let l1Il1lll = Number(l11llIi[IIlIIil]),
                i11I1li = i11liiI[IIlIIil & 15],
                iI1l1lI = Number(IiII111l[IIlIIil & 7]);
            l1Il1lll = i11I1li ^ l1Il1lll;
            l1Il1lll = l1Il1lll ^ iI1l1lI;
            l1Il1lll = l1Il1lll + i11I1li;
            i11I1li = i11I1li ^ l1Il1lll;
            let i1il1iI = Number(IiII111l[IIlIIil & 7]);
            i11I1li = i11I1li ^ i1il1iI;
            Ii1I1l1I[IIlIIil] = i11I1li & 255;
        }
        return Ii1I1l1I;
    }
    static #getSign(IIlIliil, Iiii1l, iI11ii1I, llll11i, lI1Il11I) {
        let i1llIiil = Date.now().toString(),
            Illi1II = [
                [0, 2],
                [1, 1],
                [2, 0],
            ],
            I1liIl11 = Illi1II[Math.floor(Math.random() * Illi1II.length)],
            llilillI = "1" + I1liIl11[0] + I1liIl11[1],
            I11ili1 =
                "functionId=" +
                IIlIliil +
                "&body=" +
                Iiii1l +
                "&openudid=" +
                iI11ii1I +
                "&client=" +
                llll11i +
                "&clientVersion=" +
                lI1Il11I +
                "&st=" +
                i1llIiil +
                "&sv=" +
                llilillI,
            il1I1lII = this.#sub_v2(Buffer.from(I11ili1, "utf-8")),
            ii1lil11 = this.#_md5(Buffer.from(il1I1lII).toString("base64"));
        return [i1llIiil, llilillI, ii1lil11];
    }
    static ["getSignData"](ilIiII1i, ii1lIiii, llllIlll) {
        ii1lIiii = JSON.stringify(ii1lIiii);
        const { screen: I11ll1Ii, tf: l1Ii1IiI, iv: iIiIiIii, clientVersion: iIl11I1l, build: IlllIl1l, uuid: i1liIiI } = llllIlll;
        let ll1l1 = "apple",
            II1i1Iil = this.#getSign(ilIiII1i, ii1lIiii, i1liIiI, ll1l1, iIl11I1l),
            IIil1Il1 = II1i1Iil[0],
            liIIlI1 = II1i1Iil[1],
            I1Il1i = II1i1Iil[2];
        const l1lil1i1 = {
                hdid: "JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw=",
                ts: Math.floor(Date.now() / 1000),
                ridx: -1,
                cipher: {
                    screen: this.#base64Encode(I11ll1Ii),
                    uuid: this.#base64Encode(i1liIiI),
                    osVersion: this.#base64Encode(iIiIiIii),
                    openudid: this.#base64Encode(i1liIiI),
                    area: this.#base64Encode(
                        this.#generateRandomString(2, "123456789") +
                            "_" +
                            this.#generateRandomString(4, "123456789") +
                            "_" +
                            this.#generateRandomString(4, "123456789") +
                            "_" +
                            this.#generateRandomString(4, "123456789")
                    ),
                },
                ciphertype: 5,
                version: "1.0.3",
                appname: "com.360buy.jdmobile",
            },
            i1ll1i1I =
                "eidAd71c8121f9s8+" +
                this.#generateRandomString(20) +
                "fqJmY9A07YRSnQkMEOU2Z7Jq3GnZeeGG0FqhUU0MoA1PiifL5yWcPJxtp1Cb/b/GsK0GqxuDyDfYZx6";
        return {
            functionId: ilIiII1i,
            body: ii1lIiii,
            build: IlllIl1l,
            client: ll1l1,
            clientVersion: iIl11I1l,
            d_brand: "apple",
            d_model: "iPhone" + l1Ii1IiI,
            st: IIil1Il1,
            sv: liIIlI1,
            sign: I1Il1i,
            ef: 1,
            ep: JSON.stringify(l1lil1i1),
            eid: i1ll1i1I,
            joycious: 73,
            partner: "apple",
            lang: "zh_CN",
            networkType: "wifi",
            networklibtype: "JDNetworkBaseAF",
            ext: JSON.stringify({
                prstate: "0",
                pvcStu: "1",
            }),
            uemps: "0-0-2",
        };
    }
    static #generateRandomString(iiI1llIl, lIIIli1I = null) {
        const i1i1ll = lIIIli1I == null ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" : lIIIli1I;
        let l11ilIli = "";
        for (let i1iIiill = 0; i1iIiill < iiI1llIl; i1iIiill++) {
            const Il11lii = Math.floor(Math.random() * i1i1ll.length);
            l11ilIli += i1i1ll.charAt(Il11lii);
        }
        return l11ilIli;
    }
    static #base64Encode(iIillllI) {
        const liIlii1I = "KLMNOPQRSTABCDEFGHIJUVWXYZabcdopqrstuvwxefghijklmnyz0123456789+/",
            lIIIlill = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            lI1Il1I = ilIIilil.encode(iIillllI),
            l11I1Il = lI1Il1I
                .split("")
                .map((IlIlIi1i) => {
                    const iI11lIil = liIlii1I.indexOf(IlIlIi1i);
                    return iI11lIil !== -1 ? lIIIlill[iI11lIil] : IlIlIi1i;
                })
                .join("");
        return l11I1Il;
    }
}
class i1lI1lIi {
    static ["activity"] = {};
    static ["msg"] = [];
    static ["proxyIp"] = null;
    static ["proxyIpTime"] = null;
    static ["accounts"] = [];
    static ["addressList"] = [];
    constructor(ii1IIii1, Il1iI11) {
        Object.assign(this, iilIiI1.activity);
        this.debugMode = IIi11l1I;
        this.cookie = Il1iI11;
        this.savedCookies = {};
        this.ticket = "";
        this.index = ii1IIii1;
        this.pin = this.userPin(Il1iI11);
        this.remarks = "";
        this.tg_id = "";
        this.address = null;
        this.phoneInfo = llii11i1.generatePhoneInfo();
        this.ua = this.userAgent();
        this.headers = {
            Cookie: Il1iI11,
            "User-Agent": this.ua.app,
        };
        this.retryCount = 20;
        this.proxyRetryCount = 10;
        this.proxyIp = "";
        this.proxyIpTime = null;
        this.lzkjOpenCard = false;
        this.addressInit();
        this.defenseUrls = [];
        this.sendMsg = [];
        this.prizeList = [];
        this.canNotOpenCard = false;
        this.needHelp = true;
        this.canHelp = true;
        this.isUse = false;
        this.isInviter = false;
        this.onlyInvite = false;
        this.openCardTypes = i1lillli;
        this.otherHeaders = {};
        this.h5st = new lIi1Iii1(this.headers["User-Agent"], this.pin);
    }
    ["reseInviteStatus"]() {
        this.isUse = false;
        this.canHelp = true;
    }
    ["reseCookieStatus"]() {
        this.canHelp = false;
        this.needHelp = false;
        this.isUse = true;
    }
    ["actInfoInit"]() {
        if (this.activityUrl) {
            this.domain = this.activityUrl.match(/^(?:https?:\/\/)?([^/]+)\//)[1];
            this.activityId = this.getQueryString(this.activityUrl, "activityId");
            this.prefix = Object.keys(I11ilIl).find((llIillIi) => this.activityUrl.match(I11ilIl[llIillIi])) || "";
            if (/activityType=\d+/.test(this.activityUrl))
                (this.mode = "100"), (this.activityType = this.activityUrl.match(/activityType=([^&]+)/)[1]);
            else {
                if (/(hdb|jingyun)/.test(this.activityUrl))
                    (this.mode = "hdb"),
                        (this.activityId = this.getQueryString(this.activityUrl, "id")),
                        (this.userId = this.getQueryString(this.activityUrl, "userId"));
                else {
                    if (/jinggeng/.test(this.activityUrl))
                        (this.mode = "jinggeng"),
                            (this.activityId = this.getQueryString(this.activityUrl, "id")),
                            (this.userId = this.getQueryString(this.activityUrl, "user_id"));
                    else {
                        if (/gzsl/.test(this.activityUrl)) {
                            this.mode = "gzsl";
                            this.activityId = this.getQueryString(this.activityUrl, "activityId");
                        } else {
                            if (/hzbz-isv|hdds-isv/.test(this.activityUrl))
                                (this.mode = "hzbz"), (this.activityId = this.getQueryString(this.activityUrl, "id"));
                            else {
                                this.mode = "wx";
                            }
                        }
                    }
                }
            }
            this.needPinToken = !notInitPinTokenRegx.test(this.activityUrl);
            this.activityId = this.getActivityId();
        }
    }
    ["getActivityId"](lI1Ii1il = this.activityUrl) {
        const i1iIiii1 = new URLSearchParams(new URL(lI1Ii1il).search),
            l1Ilii1i = ["activityId", "giftId", "actId", "token", "code", "a", "id"];
        let i1I1llil = "";
        for (let I1IIIi1l of l1Ilii1i) {
            i1I1llil = i1iIiii1.get(I1IIIi1l);
            if (i1I1llil) break;
        }
        return !i1I1llil && (i1I1llil = this.match(/\/(dz[a-zA-Z0-9]{28,32})/, lI1Ii1il)), (this.activityId = i1I1llil), this.activityId;
    }
    ["log"](...IIIll1i1) {
        ilI(("cookie" + (this.index + 1)).padEnd(iilIiI1.paddedStringEndCount, " "), this.remarks || this.pin, ...IIIll1i1);
    }
    ["debug"](...li1Iiill) {
        if (this.debugMode) {
            ilI(("cookie" + (this.index + 1)).padEnd(iilIiI1.paddedStringEndCount, " "), this.pin, "[Debug]", ...li1Iiill);
        }
    }
    ["putMsg"](l1lil11i, llIilili = false) {
        if (!l1lil11i) return;
        l1lil11i += "";
        this.log(l1lil11i);
        let lIi1ii1i = [
            [" ", ""],
            ["优惠券", "券"],
            ["东券", "券"],
            ["店铺", ""],
            ["恭喜", ""],
            ["获得", ""],
        ];
        for (let i1IIIlI1 of lIi1ii1i) {
            l1lil11i = l1lil11i.replace(i1IIIlI1[0], i1IIIlI1[1]);
        }
        if (!l1lil11i) return;
        this.sendMsg.push(l1lil11i);
    }
    ["union"](I1Iili1I, lilII) {
        return I1Iili1I.concat(lilII.filter((iiIlI11l) => !I1Iili1I.includes(iiIlI11l)));
    }
    ["intersection"](I1i1iIIl, l11iiIil) {
        return I1i1iIIl.filter((iIilIl1l) => l11iiIil.includes(iIilIl1l));
    }
    ["different"](iiIi, ii1llIil) {
        return iiIi.concat(ii1llIil).filter((i11ii1i1) => iiIi.includes(i11ii1i1) && !ii1llIil.includes(i11ii1i1));
    }
    ["unique"](ll1lIlIi) {
        return Array.from(new Set(ll1lIlIi));
    }
    ["formatDate"](l1llIi1, iIIi1li1) {
        return i11Ii1I1(
            typeof l1llIi1 === "object" ? l1llIi1 : new Date(typeof l1llIi1 === "string" ? l1llIi1 * 1 : l1llIi1),
            iIIi1li1 || "yyyy-MM-dd"
        );
    }
    ["dateStringToTimestamp"](ii11IIIi, Ii11iIIl) {
        const i1iiliii = parse(ii11IIIi, Ii11iIIl || "yyyy-MM-dd HH:mm", new Date()),
            I1Ii11l1 = i1iiliii.getTime();
        return I1Ii11l1;
    }
    ["match"](l1ilIlli, lii1li11) {
        l1ilIlli = l1ilIlli instanceof Array ? l1ilIlli : [l1ilIlli];
        for (let iIIilil of l1ilIlli) {
            const lI1lIi11 = iIIilil.exec(lii1li11);
            if (lI1lIi11) {
                const liIi1111 = lI1lIi11.length;
                if (liIi1111 === 1) {
                    return lI1lIi11;
                } else {
                    if (liIi1111 === 2) {
                        return lI1lIi11[1];
                    } else {
                        const i1iI1lIi = [];
                        for (let I1I1I1li = 1; I1I1I1li < liIi1111; I1I1I1li++) {
                            i1iI1lIi.push(lI1lIi11[I1I1I1li]);
                        }
                        return i1iI1lIi;
                    }
                }
            }
        }
        return "";
    }
    ["matchAll"](ii1ill, lIlIIil) {
        ii1ill = ii1ill instanceof Array ? ii1ill : [ii1ill];
        let li1i1i,
            lIIi1iIl = [];
        for (let ili1Iii1 of ii1ill) {
            while ((li1i1i = ili1Iii1.exec(lIlIIil)) != null) {
                let Ii1i1ill = li1i1i.length;
                if (Ii1i1ill === 1) {
                    lIIi1iIl.push(li1i1i);
                } else {
                    if (Ii1i1ill === 2) lIIi1iIl.push(li1i1i[1]);
                    else {
                        let l1I1Ilii = [];
                        for (let i1Il1l11 = 1; i1Il1l11 < Ii1i1ill; i1Il1l11++) {
                            l1I1Ilii.push(li1i1i[i1Il1l11]);
                        }
                        lIIi1iIl.push(l1I1Ilii);
                    }
                }
            }
        }
        return lIIi1iIl;
    }
    ["haskey"](iili1Il, III1iI1i) {
        const iiIiilii = III1iI1i.split(".");
        let IIiI1il = iili1Il;
        for (const liilIiIl of iiIiilii) {
            if (IIiI1il && IIiI1il.hasOwnProperty(liilIiIl)) IIiI1il = IIiI1il[liilIiIl];
            else {
                return undefined;
            }
        }
        return IIiI1il;
    }
    ["parseJSON"](l1lllIIi) {
        try {
            const liIIIII1 = JSON.parse(l1lllIIi);
            return liIIIII1;
        } catch (lilIiiI) {
            return false;
        }
    }
    ["json2Str"](iiiIi1lI) {
        try {
            return JSON.stringify(iiiIi1lI);
        } catch (Ill11liI) {
            return "";
        }
    }
    ["str2Json"](lI11lIi1) {
        try {
            return JSON.parse(lI11lIi1);
        } catch (Iili1I1l) {
            return lI11lIi1;
        }
    }
    ["textToHtml"](i1liil1i) {
        return llIl1Ili.load(i1liil1i);
    }
    ["sleep"](Il11II1, llI1iliI) {
        let I1II1lIi = Il11II1;
        return (
            llI1iliI !== undefined && (I1II1lIi = Math.floor(Math.random() * (llI1iliI - Il11II1 + 1)) + Il11II1),
            new Promise((liII1Iii) => setTimeout(liII1Iii, I1II1lIi))
        );
    }
    ["wait"](l11IIl1I, Il1iIiil) {
        if (l11IIl1I < 0) return;
        if (Il1iIiil) {
            return new Promise((iilili1) => setTimeout(iilili1, this.random(l11IIl1I, Il1iIiil)));
        } else return new Promise((lI111iIi) => setTimeout(lI111iIi, l11IIl1I));
    }
    ["stop"]() {
        throw new il1iii1I();
    }
    ["exit"]() {
        throw new II1i1l1I();
    }
    ["random"](lil1iIlI, i1liI1i1) {
        return Math.min(Math.floor(lil1iIlI + Math.random() * (i1liI1i1 - lil1iIlI)), i1liI1i1);
    }
    ["randomNum"](iI11Il1) {
        iI11Il1 = iI11Il1 || 32;
        let IlI1lII = "0123456789",
            lII1iI1I = IlI1lII.length,
            lIlIl11I = "";
        for (let liI1lIi1 = 0; liI1lIi1 < iI11Il1; liI1lIi1++) {
            lIlIl11I += IlI1lII.charAt(Math.floor(Math.random() * lII1iI1I));
        }
        return lIlIl11I;
    }
    ["randomArray"](i11l1I, IlI11i) {
        IlI11i = IlI11i || i11l1I.length;
        let liII1li = i11l1I.slice(0),
            iIi1i1l = i11l1I.length,
            IIIiI1l1 = iIi1i1l - IlI11i,
            l1ii1I1I,
            IiII1iiI;
        while (iIi1i1l-- > IIIiI1l1) {
            IiII1iiI = Math.floor((iIi1i1l + 1) * Math.random());
            l1ii1I1I = liII1li[IiII1iiI];
            liII1li[IiII1iiI] = liII1li[iIi1i1l];
            liII1li[iIi1i1l] = l1ii1I1I;
        }
        return liII1li.slice(IIIiI1l1);
    }
    ["timestamp"]() {
        return Date.now();
    }
    ["getQueryString"](iIlIli, IIiIllI) {
        let il1I1liI = new RegExp("(^|[&?])" + IIiIllI + "=([^&]*)(&|$)"),
            lII111Il = iIlIli.match(il1I1liI);
        if (lII111Il != null) return unescape(lII111Il[2]);
        return "";
    }
    ["readFileSync"](IIli1lIi) {
        try {
            return llii1iii.readFileSync(IIli1lIi, "utf-8").toString();
        } catch (ilil1Ill) {
            return "";
        }
    }
    ["writeFileSync"](i11III1i, lIli1iIl, Il1i1Il) {
        const iiIlI11 = iIIIiiil.join(__dirname, i11III1i);
        !llii1iii.existsSync(iiIlI11) && llii1iii.mkdirSync(iiIlI11);
        const il1iill = iIIIiiil.join(iiIlI11, lIli1iIl);
        try {
            llii1iii.writeFileSync(il1iill, Il1i1Il, "utf-8");
        } catch (il1lIl1) {
            this.log("写入文件时出错：", il1lIl1);
        }
    }
    ["readYamlSync"](IiI1I11I) {
        try {
            return II1l11Ii.parse(this.readFileSync(IiI1I11I)) ?? {};
        } catch (I1liI1iI) {
            return {};
        }
    }
    ["writeYamlSync"](illi1Ii, I1ililIi, IIIIll1i) {
        try {
            this.writeFileSync(illi1Ii, I1ililIi, II1l11Ii.stringify(IIIIll1i));
        } catch (iliilIl1) {
            this.log("写入文件时出错：", iliilIl1);
        }
    }
    ["appendFileSync"](lIIIIIi1, lili1l1l, II1i1iil) {
        const iIlIIi11 = iIIIiiil.join(__dirname, lIIIIIi1);
        !llii1iii.existsSync(iIlIIi11) && llii1iii.mkdirSync(iIlIIi11);
        const IllIli11 = iIIIiiil.join(iIlIIi11, lili1l1l);
        try {
            llii1iii.appendFileSync(IllIli11, II1i1iil, "utf-8");
        } catch (lIlllIl1) {
            this.log("写入文件时出错：", lIlllIl1);
        }
    }
    ["md5"](iilii11i) {
        const iI1Ii1l = liIiI11.MD5(iilii11i);
        return iI1Ii1l.toString(liIiI11.enc.Hex);
    }
    ["hmacSHA256"](il11iilI, il1ll1Il) {
        const I1iliIl = liIiI11.HmacSHA256(il1ll1Il, il11iilI);
        return I1iliIl.toString(liIiI11.enc.Hex);
    }
    ["hmacMD5"](I1IiiliI, llIIllll) {
        const Iliillil = liIiI11.HmacMD5(llIIllll, I1IiiliI);
        return Iliillil.toString(liIiI11.enc.Hex);
    }
    ["rsaEncrypt"](iiliiIii, IilllllI, i11lII1l) {
        iiliiIii =
            "-----BEGIN PUBLIC KEY-----\
" +
            iiliiIii +
            "\
-----END PUBLIC KEY-----";
        const IIlIlil1 = new iIll1IiI(iiliiIii);
        IIlIlil1.setOptions(IilllllI);
        const ll1l11il = IIlIlil1.encrypt(i11lII1l, "base64");
        return ll1l11il;
    }
    ["encryptCrypto"](lllIIIII, liI1I1l, l1i1Ili1, iIIIi, l1Il1l1, illl1l1I, I1IlIIi1 = false) {
        return liIiI11[lllIIIII]
            .encrypt(liIiI11.enc.Utf8.parse(l1Il1l1), liIiI11.enc.Utf8.parse(illl1l1I), {
                mode: liIiI11.mode[liI1I1l],
                padding: liIiI11.pad[l1i1Ili1],
                iv: liIiI11.enc.Utf8.parse(iIIIi),
            })
            .ciphertext.toString(I1IlIIi1 ? liIiI11.enc.Hex : liIiI11.enc.Base64);
    }
    ["decryptCrypto"](IIIiiiIi, l1iiIiIi, IIiiI11I, l1Ill1l1, II1i1IiI, II1IliIi, lllI1i1I = false) {
        const I1111ili = liIiI11[IIIiiiIi].decrypt(
            {
                ciphertext: lllI1i1I ? liIiI11.enc.Hex.parse(II1i1IiI) : liIiI11.enc.Base64.parse(II1i1IiI),
            },
            liIiI11.enc.Utf8.parse(II1IliIi),
            {
                iv: liIiI11.enc.Utf8.parse(l1Ill1l1),
                mode: liIiI11.mode[l1iiIiIi],
                padding: liIiI11.pad[IIiiI11I],
            }
        ).toString(liIiI11.enc.Utf8);
        return I1111ili;
    }
    #base64Encode(lI11liII) {
        const iiIIllI1 = "KLMNOPQRSTABCDEFGHIJUVWXYZabcdopqrstuvwxefghijklmnyz0123456789+/",
            l11i1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            IIiiII = liIiI11.enc.Utf8.parse(lI11liII),
            IIliill = liIiI11.enc.Base64.stringify(IIiiII),
            I1lii11 = IIliill.split("")
                .map((lIlIli) => {
                    const iiI111lI = iiIIllI1.indexOf(lIlIli);
                    return iiI111lI !== -1 ? l11i1[iiI111lI] : lIlIli;
                })
                .join("");
        return I1lii11;
    }
    ["generateStringArray"](IllIiiiI, i1liI1l1) {
        const IIi1111i = Array(IllIiiiI).fill(i1liI1l1),
            II1IIli = IIi1111i.join("");
        return II1IIli;
    }
    ["uuid"](I1lI1III = 40) {
        return ill1IiII(this.generateStringArray(I1lI1III, "x"));
    }
    ["userAgent"]() {
        const { screen: IlIiII1, tf: l1i1iIII, iv: IlIIIi1, clientVersion: li1i1il1, build: I1lIIlI1, uuid: iI1IIlII } = this.phoneInfo,
            iil1iIi1 = {
                ciphertype: 5,
                cipher: {
                    ud: this.#base64Encode(iI1IIlII),
                    sv: this.#base64Encode(l1i1iIII),
                    iad: "",
                },
                ts: Date.now(),
                hdid: "JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw=",
                version: "1.0.3",
                appname: "com.360buy.jdmobile",
                ridx: -1,
            };
        return {
            jd4:
                "JD4iPhone/" +
                I1lIIlI1 +
                "%20(iPhone;%20iOS;%20Scale/3.00);jdmall;iphone;version/" +
                li1i1il1 +
                ";build/" +
                I1lIIlI1 +
                ";network/wifi;screen/" +
                IlIiII1.replace("*", "x") +
                ";os/" +
                IlIIIi1,
            app:
                "jdapp;iPhone;" +
                li1i1il1 +
                ";;;M/5.0;appBuild/" +
                I1lIIlI1 +
                ";jdSupportDarkMode/1;ef/1;ep/" +
                encodeURIComponent(JSON.stringify(iil1iIi1)) +
                ";Mozilla/5.0 (iPhone; CPU iPhone OS " +
                IlIIIi1.replaceAll(".", "_") +
                " like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;",
        };
    }
    ["userPin"](liIl1ll1 = this.cookie) {
        if (!liIl1ll1) return;
        const l1lIilii = liIl1ll1.split(";");
        for (const l1i1iIi of l1lIilii) {
            const [IlIli1lI, lll1I1li] = l1i1iIi.split("=");
            if (IlIli1lI === "pt_pin") {
                return lll1I1li;
            }
        }
        return null;
    }
    ["getCookieByName"](lllI11iI) {
        return this.savedCookies[lllI11iI];
    }
    ["handleSetCookieHeaders"](iIlIlI) {
        let lililIl1 = {};
        const liil1I11 = iIlIlI["set-cookie"];
        liil1I11 &&
            liil1I11.forEach((I1lI1I1i) => {
                const l1ll1i1I = I1lI1I1i.match(/([^=]+)(?:=([^;]*))?/);
                if (l1ll1i1I) {
                    const Ili11Iil = l1ll1i1I[1].trim(),
                        lIl1Illl = l1ll1i1I[2] ? l1ll1i1I[2].trim() : "";
                    lililIl1[Ili11Iil] = lIl1Illl;
                }
            });
        this.savedCookies = {
            ...this.savedCookies,
            ...lililIl1,
        };
        this.ticket = "";
        Object.entries(this.savedCookies).forEach(([Ii1i1li1, iiII1i1l]) => {
            this.ticket += Ii1i1li1 + "=" + iiII1i1l + ";";
        });
    }
    #handleHeaders(li11i1i) {
        if (this.mode === "hdb") {
            if (!li11i1i._s) return;
            let i11lIIiI = {
                nonce: li11i1i._nonce,
                s: li11i1i._s,
                ts: li11i1i._ts,
            };
            this.otherHeaders = {
                ...this.otherHeaders,
                ...i11lIIiI,
            };
        }
    }
    ["request"](lII1iIlI) {
        const li11iili = {
                method: "get",
                timeout: 20000,
            },
            Ii1iIi = Object.assign({}, li11iili, lII1iIlI);
        return new Promise((IIil1I1I, l1iI1lI1) => {
            ll11lli1(Ii1iIi)
                .then((Il1i1II1) => {
                    const I11Ii1II = Il1i1II1.data,
                        Il11I1Ii = Il1i1II1.headers;
                    IIil1I1I({
                        data: I11Ii1II,
                        headers: Il11I1Ii,
                    });
                })
                .catch((I1I11iI) => {
                    l1iI1lI1(I1I11iI);
                });
        });
    }
    async #checkProxy(li1lliI1) {
        try {
            return (
                await ll11lli1({
                    url: this.activityUrl || "https://www.jd.com",
                    headers: {
                        "User-Agent": this.ua.app,
                    },
                    httpsAgent: li1lliI1,
                    timeout: 4000,
                }),
                true
            );
        } catch (lIil1llI) {
            return false;
        }
    }
    async #getProxyIp(IlIil = 10) {
        if (!iilIiI1.proxy.proxyState) return null;
        if (wxProxyMode === 1) {
            if (i1lI1lIi.proxyIp && i1lI1lIi.proxyIpTime + wxProxyInterval * 1000 > this.timestamp()) {
                return new lII11lli("http://" + i1lI1lIi.proxyIp);
            }
            let lI1l1111 = await iilIiI1.proxy.getCurrentProxy();
            if (!lI1l1111) return null;
            return (i1lI1lIi.proxyIp = lI1l1111), (i1lI1lIi.proxyIpTime = this.timestamp()), new lII11lli("http://" + lI1l1111);
        } else {
            if (wxProxyMode === 2) {
                if (this.proxyIp && this.proxyIpTime + wxProxyInterval * 1000 > this.timestamp()) return new lII11lli("http://" + this.proxyIp);
                let I1iiili = await iilIiI1.proxy.getCurrentProxy();
                if (!I1iiili) return null;
                return (
                    this.log("获取到的ip:" + I1iiili),
                    (this.proxyIp = I1iiili),
                    (this.proxyIpTime = this.timestamp()),
                    new lII11lli("http://" + I1iiili)
                );
            } else {
                this.log("代理模式错误");
            }
        }
    }
    async #handleRequestParams(Iliiii) {
        const lIIlilIi = {
            ...this.headers,
        };
        !Iliiii?.["noReferer"] && this.activityUrl && (lIIlilIi.Referer = this.activityUrl);
        const i1lI1il = {
            url: "https://api.m.jd.com/",
            method: "get",
            headers: {
                ...lIIlilIi,
                ...Iliiii?.["headers"],
                ...this.otherHeaders,
            },
            timeout: ll1Ilili * 1000,
        };
        delete Iliiii.headers;
        Iliiii = Object.assign({}, i1lI1il, Iliiii);
        this.haskey(Iliiii, "api") && (Iliiii.url += Iliiii.api);
        if (this.haskey(Iliiii, "json")) {
            Iliiii.data = Iliiii.json;
            Iliiii.headers = {
                ...Iliiii.headers,
                "Content-Type": "application/json;charset=UTF-8",
            };
            Iliiii.method = "post";
        } else
            this.haskey(Iliiii, "data") &&
                ((Iliiii.headers = {
                    ...Iliiii.headers,
                    "Content-Type": "application/x-www-form-urlencoded",
                }),
                (Iliiii.method = "post"));
        const iil1II11 = Iliiii?.["functionId"] || "",
            iIllIIIl = Iliiii?.["body"] || "";
        if (this.haskey(Iliiii, "sign")) {
            let I1iilI1 = l11i1Ii.getSignData(iil1II11, iIllIIIl, this.phoneInfo);
            Iliiii.method == "get"
                ? (Iliiii.params = Object.assign({}, Iliiii.params, I1iilI1))
                : (Iliiii.data = Object.assign({}, Iliiii.data, I1iilI1));
        }
        let l11i111l = false,
            l11II11;
        if (this.haskey(Iliiii, "h5st31")) (l11i111l = true), (l11II11 = "3.1");
        else {
            if (this.haskey(Iliiii, "h5st41")) {
                l11i111l = true;
                l11II11 = "4.1";
            } else {
                if (this.haskey(Iliiii, "h5st42")) (l11i111l = true), (l11II11 = "4.2");
                else {
                    if (this.haskey(Iliiii, "h5st43")) (l11i111l = true), (l11II11 = "4.3");
                    else {
                        if (this.haskey(Iliiii, "h5st44")) {
                            l11i111l = true;
                            l11II11 = "4.4";
                        }
                    }
                }
            }
        }
        if (l11i111l) {
            let lI1lIiIl = await this.h5st.encrypt(
                Iliiii.appId,
                Iliiii.functionId,
                Iliiii.body,
                Iliiii.appid,
                Iliiii.client,
                Iliiii.clientVersion,
                Iliiii.t,
                l11II11
            );
            Iliiii.method == "get"
                ? (Iliiii.params = Object.assign({}, Iliiii.params, lI1lIiIl))
                : (Iliiii.data = Object.assign({}, Iliiii.data, lI1lIiIl));
        }
        Iliiii = this.#checkAndEncryptParameters(Iliiii);
        Iliiii?.["headers"]["Content-Type"] === "application/x-www-form-urlencoded" && (Iliiii.data = I1iIllIl.stringify(Iliiii.data));
        let IilII11l = {
            url: Iliiii.url,
            method: Iliiii.method,
            params: Iliiii?.["params"] || {},
            data: Iliiii?.["data"] || {},
            headers: Iliiii?.["headers"] || {},
            timeout: Iliiii?.["timeout"] || 30000,
            maxRedirects: Iliiii?.["maxRedirects"] || 5,
        };
        return !Iliiii?.["noUseProxy"] && (IilII11l.httpsAgent = await this.#getProxyIp()), IilII11l;
    }
    #checkAndEncryptParameters(IIiIlIlI) {
        if (this.defenseUrls.some((llllIl1) => IIiIlIlI.url.includes(llllIl1))) {
            if (this.mode === "wx")
                (IIiIlIlI.data = {
                    ecyText: iiiiIill(
                        {
                            ...IIiIlIlI.data,
                            actId: this.activityId,
                        },
                        this.getCookieByName("pToken"),
                        this.getCookieByName("te")
                    ),
                }),
                    (IIiIlIlI.headers["Content-Type"] = "application/json;charset=UTF-8");
            else
                this.mode === "100" &&
                    ((IIiIlIlI.data.actId = this.activityId),
                    (IIiIlIlI.data = {
                        ecyText: ll11i1l1(IIiIlIlI.data, this.getCookieByName("pToken"), this.getCookieByName("te")),
                    }));
        }
        if (this.mode == "hdb" && IIiIlIlI.method === "post" && IiIiii11.some((iIlIIIll) => IIiIlIlI.url.includes(iIlIIIll))) {
            IIiIlIlI.data.sysParams = {
                sysmethod: IIiIlIlI.data.appJsonParams.method,
                sign: "111111",
                timestamp: 123456,
            };
        }
        return IIiIlIlI;
    }
    async #proxyRequiredCheck(IIIIllI1, Illl11) {
        if (wxProxyEnable === 2 && wxProxyUrl && IIIIllI1.match(proxyRegx)) {
            if (wxProxyMode === 1 && i1lI1lIi.proxyIp && i1lI1lIi.proxyIpTime && Illl11 && Illl11 < i1lI1lIi.proxyIpTime) return true;
            this.proxyIp = null;
            i1lI1lIi.proxyIp = null;
            if (wxProxySmart === 1) {
                iilIiI1.proxy.updateProxyEnable(true);
            }
            if (await iilIiI1.proxy.setCurrentProxy()) {
                return true;
            }
        }
        return false;
    }
    #handleMatchingResponse(Ii1l1II) {
        if (Ii1l1II && Ii1l1II.constructor === Object) {
            Ii1l1II = JSON.stringify(Ii1l1II);
            Ii1l1II.includes("AUTH.FAILED.BLACK") && ((this.black = true), this.putMsg("AUTH BLACK"), this.reseCookieStatus(), this.exit());
            if (Ii1l1II.match(reTryRegx) && !Ii1l1II.includes("AUTH.FAILED.BLACK")) return true;
        }
        return false;
    }
    #retryOnEmptyStringResponse(ilIi1Iil, Iii11lil) {
        if (!Iii11lil && this.defenseUrls.some((lI1I1Ii1) => ilIi1Iil.url.includes(lI1I1Ii1))) return true;
        return false;
    }
    async ["jd_api"](ii11iiI1, iii1lii = true, IlIiIl1I = 0, iI1Iil = 0) {
        let llliiiiI = Object.assign({}, ii11iiI1),
            IlI111II = ii11iiI1?.["functionId"],
            I111Ilii = await this.#handleRequestParams(ii11iiI1),
            I1illl1i = this.timestamp();
        console.log(I111Ilii);
        try {
            let { data: l1I1I1li, headers: II111il1 } = await this.request(I111Ilii);
            iii1lii && this.handleSetCookieHeaders(II111il1);
            this.#handleHeaders(II111il1);
            if (IlIiIl1I < this.retryCount && this.#retryOnEmptyStringResponse(I111Ilii, l1I1I1li))
                return this.log("空数据重试" + IlIiIl1I), await this.initPinToken(), await this.jd_api(llliiiiI, true, IlIiIl1I + 1, iI1Iil);
            if (IlIiIl1I < this.retryCount && this.#handleMatchingResponse(l1I1I1li))
                return this.debug(l1I1I1li), this.log("重试" + IlIiIl1I), await this.jd_api(llliiiiI, true, IlIiIl1I + 1, iI1Iil);
            let i1ilIIiI = this.json2Str(l1I1I1li);
            if (IlIiIl1I < this.retryCount && l1I1I1li && i1ilIIiI && /您点的太快了|操作过于频繁/.exec(i1ilIIiI))
                return (
                    this.debug(l1I1I1li),
                    this.log("等待重试" + IlIiIl1I),
                    await this.sleep(1500),
                    await this.jd_api(llliiiiI, true, IlIiIl1I + 1, iI1Iil)
                );
            return l1I1I1li;
        } catch (iI1i1l1I) {
            this.debug(iI1i1l1I.response?.["data"]);
            const ll1lIill = iI1i1l1I.message;
            if (iI1i1l1I?.["response"]?.["status"] === 404 && ii11iiI1?.["url"]?.["includes"]("getDefenseUrls")) return [];
            if (
                iI1i1l1I?.["response"]?.["status"] === 500 &&
                this.defenseUrls.some((il11Iill) => I111Ilii.url.includes(il11Iill)) &&
                IlIiIl1I < this.retryCount
            )
                return (
                    await this.initPinToken(),
                    this.log(
                        "500重试" + IlIiIl1I,
                        Iil1l11l === 1 ? ii11iiI1.url : "",
                        Iil1l11l === 1 ? iI1i1l1I.response?.["data"] : "",
                        Iil1l11l === 1 ? I111Ilii?.["httpsAgent"] : ""
                    ),
                    await this.jd_api(llliiiiI, true, IlIiIl1I + 1, iI1Iil)
                );
            let iIiilli = IlI111II?.["includes"]("isvObfuscator");
            if (iIiilli && iI1Iil > isvObfuscatorRetry) return undefined;
            if (iI1Iil < this.proxyRetryCount && (await this.#proxyRequiredCheck(ll1lIill, I1illl1i))) {
                return (
                    this.log(
                        "" + (iIiilli ? "isvObfuscator " : "") + (iI1i1l1I?.["response"]?.["status"] ?? "") + "代理重试" + iI1Iil,
                        Iil1l11l === 1 ? ii11iiI1.url : "",
                        Iil1l11l === 1 ? iI1i1l1I.response?.["data"] : "",
                        Iil1l11l === 1 ? I111Ilii?.["httpsAgent"] : ""
                    ),
                    iIiilli && (await this.sleep(isvObfuscatorRetryWait * 1000)),
                    await this.jd_api(llliiiiI, true, IlIiIl1I, iI1Iil + 1)
                );
            }
            return this.log("捕获异常 " + ll1lIill), undefined;
        }
    }
    async ["taskGet"](iI1IiIl1, IilIIlIi = {}) {
        let iI1il1ii = iI1IiIl1.startsWith("http")
                ? iI1IiIl1
                : "https://" + this.domain + (this.prefix ? ("/" + this.prefix).replace(/\/\//g, "/") : "") + ("/" + iI1IiIl1).replace(/\/\//g, "/"),
            i1iill1 = {
                url: iI1il1ii,
                method: "get",
                params: IilIIlIi,
                headers: {
                    Referer: this.activityUrl,
                    Cookie: this.isvToken ? "IsvToken=" + this.isvToken + ";" + this.ticket : this.cookie,
                },
            };
        return await this.jd_api(i1iill1);
    }
    async ["taskPost"](il1illli, I1liIlll = {}, iii1i111 = {}, llII1ili = false) {
        let IIIIll1l = this.prefix
                ? (this.domain + "/" + this.prefix + "/" + il1illli).replace(/\/\//g, "/")
                : (this.domain + "/" + il1illli).replace(/\/\//g, "/"),
            li11ll1l = "https://" + IIIIll1l,
            lll1IIil = {
                url: li11ll1l,
                method: "post",
                headers: {
                    Referer: this.activityUrl,
                    Cookie: this.isvToken ? "IsvToken=" + this.isvToken + ";" + this.ticket : this.cookie,
                    ...iii1i111,
                },
            };
        return llII1ili ? (lll1IIil.json = I1liIlll) : (lll1IIil.data = I1liIlll), await this.jd_api(lll1IIil);
    }
    async ["taskPostByJson"](Ill1lil1, li1i11ii = {}, liiiiI1l = {}) {
        return await this.taskPost(Ill1lil1, li1i11ii, liiiiI1l, true);
    }
    ["wxStop"](l1iIi1il) {
        if (!l1iIi1il) return;
        for (let i1lii1II of stopKeywords) {
            if (l1iIi1il.includes(i1lii1II)) throw new il1iii1I("退出");
        }
    }
    async ["wxCommonInfo"](iIilliII = true) {
        let IiliIiIl = await this.taskGet(this.activityUrl);
        if (IiliIiIl && IiliIiIl.includes("活动已经结束") && iIilliII) {
            this.putMsg("活动已经结束,手动确认");
            this.stop();
            return;
        }
        (this.domain.includes("lzkj") || this.domain.includes("lzdz1")) && (await this.taskGet("/wxCommonInfo/token"));
    }
    ["addressInit"]() {
        let IIII11li = i1lI1lIi.accounts;
        if (!IIII11li) return;
        IIII11li = JSON.parse(IIII11li);
        if (IIII11li.length === 0) return;
        i1lI1lIi.addressList = IIII11li;
        for (let li1IIIIl of IIII11li) {
            if (li1IIIIl.pt_pin === this.pin) {
                this.address = li1IIIIl.address;
                this.remarks = li1IIIIl.remarks;
                this.tg_id = li1IIIIl.tg_id;
                return;
            }
        }
    }
    ["getAddress"]() {
        if (this.address) return;
        if (i1lI1lIi.addressList.length === 0) {
            this.address = "";
            return;
        }
        const i1ilIi1i = (Ii1IlIi) => Ii1IlIi.pt_pin.includes("默认地址"),
            i1I1lIli = (ll1li1Il) => !ll1li1Il.useNum || ll1li1Il.useNum < addressUseNum || addressUseNum === 0,
            I1llI1lI = i1lI1lIi.addressList.filter((I1iI1Ill) => i1ilIi1i(I1iI1Ill) && i1I1lIli(I1iI1Ill)),
            Ii1Ii1ll = i1lI1lIi.addressList.filter((l1I11ll1) => !i1ilIi1i(l1I11ll1) && i1I1lIli(l1I11ll1));
        if (I1llI1lI.length > 0) {
            const II1IliI1 = Math.floor(Math.random() * I1llI1lI.length),
                I1IilI1I = I1llI1lI[II1IliI1];
            this.address = I1IilI1I.address;
            I1IilI1I.useNum ? (I1IilI1I.useNum += 1) : (I1IilI1I.useNum = 1);
        } else {
            if (Ii1Ii1ll.length > 0) {
                const lI1iIlI = Math.floor(Math.random() * Ii1Ii1ll.length),
                    Ili11IIl = Ii1Ii1ll[lI1iIlI];
                this.address = Ili11IIl.address;
                Ili11IIl.useNum ? (Ili11IIl.useNum += 1) : (Ili11IIl.useNum = 1);
            }
        }
    }
    async ["getShopOpenCardInfo"](IIli1li = this.venderId || this.shopId) {
        let i1I1lIl = {
                venderId: IIli1li,
                payUpShop: true,
                queryVersion: "10.5.2",
                appid: "27004",
                needSecurity: true,
                bizId: "shopmember_m_jd_com",
                channel: "8018006",
            },
            iili11ii = await this.jd_api(
                {
                    url: "https://api.m.jd.com/client.action",
                    method: "post",
                    body: i1I1lIl,
                    data: {
                        functionId: "getShopOpenCardInfo",
                        body: i1I1lIl,
                        uuid: "88888",
                    },
                    functionId: "getShopOpenCardInfo",
                    headers: {
                        Referer: "https://shop.m.jd.com/",
                    },
                    appid: "shopmember_m_jd_com",
                    appId: "27004",
                    clientVersion: "9.2.0",
                    client: "H5",
                    t: Date.now(),
                    h5st41: true,
                },
                false
            );
        if (iili11ii && iili11ii.success) {
            let i1l1IiII = iili11ii?.["result"][0],
                lIi1IIii = i1l1IiII?.["interestsRuleList"] ?? [];
            this.openCardStatus = i1l1IiII?.["userInfo"]?.["openCardStatus"] ?? 0;
            this.giftList = lIi1IIii;
            if (lIi1IIii.length > 0) {
                this.giftActId = lIi1IIii?.[0]?.["interestsInfo"]["activityId"] ?? "";
            }
        }
        return iili11ii;
    }
    async ["bindWithVender"](llli1ili = this.venderId || this.shopId) {
        let l11i1llI = {
                venderId: llli1ili,
                bindByVerifyCodeFlag: 1,
                registerExtend: {},
                writeChildFlag: 0,
                channel: "8018006",
                activityId: this.giftActId,
                appid: "27004",
                needSecurity: true,
                bizId: "shopmember_m_jd_com",
            },
            II1iiiil = await this.jd_api(
                {
                    url: "https://api.m.jd.com/client.action",
                    method: "post",
                    body: l11i1llI,
                    data: {
                        functionId: "bindWithVender",
                        appid: "shopmember_m_jd_com",
                        body: l11i1llI,
                        uuid: "88888",
                    },
                    appid: "shopmember_m_jd_com",
                    appId: "27004",
                    functionId: "bindWithVender",
                    headers: {
                        Referer: "https://shop.m.jd.com/",
                    },
                    clientVersion: "9.2.0",
                    client: "H5",
                    t: Date.now(),
                    h5st41: true,
                },
                false
            );
        this.debug(II1iiiil);
        if (II1iiiil && II1iiiil.code === 0) {
            if (II1iiiil.busiCode === "0") {
                if (II1iiiil.result?.["giftInfo"]?.["giftList"]) {
                    let Ii11lIlI = II1iiiil.result.giftInfo.giftList.map((IilI1Iil) => "" + IilI1Iil.discountString + IilI1Iil.prizeName).join(",");
                    this.log("加入店铺[" + llli1ili + "]会员成功,获得" + Ii11lIlI);
                } else {
                    this.log("加入店铺[" + llli1ili + "]会员成功");
                }
            } else {
                this.log(II1iiiil?.["message"]);
                if (II1iiiil?.["message"]?.["includes"]("已经是本店会员")) {
                } else {
                    this.canNotOpenCard = true;
                }
            }
        } else {
            this.log("加入店铺[" + llli1ili + "]会员失败", II1iiiil?.["message"]);
            this.canNotOpenCard = true;
        }
        return II1iiiil;
    }
    async ["isvObfuscator"]() {
        let i1l1l11 = this.readFileSync("./tokens/" + this.pin),
            iiII1ill = i1l1l11 ? JSON.parse(i1l1l11) : {};
        if (iiII1ill && iiII1ill?.["expireTime"] > Date.now()) {
            return (
                (this.isvToken = iiII1ill.token),
                {
                    code: "0",
                    token: iiII1ill.token,
                }
            );
        }
        const iIiiIl1I = {
                url: "https://" + this.domain,
                id: "",
            },
            lIi1lIii = await this.jd_api(
                {
                    url: "https://api.m.jd.com/client.action",
                    method: "post",
                    functionId: "isvObfuscator",
                    body: iIiiIl1I,
                    data: {},
                    headers: {
                        ...this.headers,
                        "User-Agent": this.ua.jd4,
                    },
                    sign: true,
                    noReferer: true,
                },
                false
            );
        if (lIi1lIii && lIi1lIii?.["code"] === "0") {
            let ll1llllI = lIi1lIii.token;
            this.isvToken = ll1llllI;
            this.writeFileSync(
                "tokens",
                this.pin,
                JSON.stringify({
                    expireTime: Date.now() + this.random(20, 26) * 60 * 1000,
                    token: ll1llllI,
                })
            );
        } else
            lIi1lIii?.["code"] === "3" && lIi1lIii?.["errcode"] === 264
                ? (this.putMsg("ck过期"), this.reseCookieStatus(), this.exit())
                : this.log(lIi1lIii);
        return !this.isvToken && (this.putMsg("获取Token失败"), this.reseCookieStatus(), this.exit()), lIi1lIii;
    }
    async ["getShopInfo"](llIli1I1 = this.venderId, li1i1lIi = this.shopId) {
        let I1111l1l = await this.jd_api(
            {
                url:
                    'https://api.m.jd.com/?functionId=lite_getShopHomeBaseInfo&body={"shopId":"' +
                    li1i1lIi +
                    '","venderId":"' +
                    llIli1I1 +
                    '","source":"appshop"}&t=1646398923902&appid=jdlite-shop-app&client=H5',
                headers: {
                    Referer: "https://shop.m.jd.com/",
                    "User-Agent": this.ua.jd4,
                },
            },
            false
        );
        return (
            this.haskey(I1111l1l, "result.shopInfo.shopName") &&
                ((this.shopName = I1111l1l.result.shopInfo.shopName),
                (i1lI1lIi.activity = Object.assign(i1lI1lIi.activity, {
                    shopName: this.shopName,
                }))),
            I1111l1l
        );
    }
    async ["follow"](IIlIl1il = this.shopId) {
        let iIlIIIII = await this.jd_api(
            {
                url:
                    'https://api.m.jd.com/client.action?functionId=whx_followShop&body={"shopId":"' +
                    IIlIl1il +
                    '","follow": "true"}&t=1691927731605&appid=shop_m_jd_com&clientVersion=11.0.0&client=wh5',
                headers: {
                    Cookie: this.cookie,
                    Referer: "https://shop.m.jd.com/",
                    "User-Agent": this.ua.jd4,
                },
            },
            false
        );
        return this.haskey(iIlIIIII, "isSuccess") && iIlIIIII?.["result"]?.["follow"]
            ? (this.log("关注成功"), true)
            : (this.log(iIlIIIII), this.log(this.haskey(iIlIIIII, "result.msg") || "关注失败"), false);
    }
    async ["unfollow"](iIlliIii = this.shopId || this.venderId) {
        let iII1l11I = await this.jd_api(
            {
                url:
                    'https://api.m.jd.com/client.action?functionId=whx_followShop&body={"shopId":"' +
                    iIlliIii +
                    '","follow": "false"}&t=1691927731605&appid=shop_m_jd_com&clientVersion=11.0.0&client=wh5',
                headers: {
                    Cookie: this.cookie,
                    Referer: "https://shop.m.jd.com/",
                    "User-Agent": this.ua.jd4,
                },
            },
            false
        );
        return this.haskey(iII1l11I, "isSuccess")
            ? (this.log("取消关注成功"), true)
            : (this.log(this.haskey(iII1l11I, "result.msg") || "取消关注失败"), false);
    }
    async ["wxApi"](llli1i, l1iIIl1I = {}) {
        return await this.taskPost(llli1i, {
            activityId: this.activityId,
            ...l1iIIl1I,
        });
    }
    async ["getSimpleActInfoVo"](Iil1iiiI = "customer/getSimpleActInfoVo") {
        if (i1lI1lIi.activity.activityType) {
            this.type = i1lI1lIi.activity.type;
            this.venderId = i1lI1lIi.activity?.["venderId"];
            this.shopId = i1lI1lIi.activity?.["shopId"];
            this.activityType = i1lI1lIi.activity?.["activityType"];
            return;
        }
        let IIIilIii = await this.wxApi(Iil1iiiI);
        if (IIIilIii && IIIilIii?.["result"] && IIIilIii?.["data"]) {
            i1lI1lIi.activity = Object.assign(i1lI1lIi.activity, IIIilIii?.["data"]);
            this.venderId = IIIilIii?.["data"]?.["venderId"];
            this.shopId = IIIilIii?.["data"]?.["shopId"];
            this.activityType = IIIilIii?.["data"]?.["activityType"];
            const i1Iii1II = {
                5: "wxCollectionActivity",
                6: "wxCollectionActivity",
                7: "wxGameActivity",
                11: "wxDrawActivity",
                12: "wxDrawActivity",
                13: "wxDrawActivity",
                15: "sign",
                16: "daily",
                17: "wxShopFollowActivity",
                18: "sevenDay",
                20: "wxKnowledgeActivity",
                24: "wxShopGift",
                25: "wxShareActivity",
                26: "wxPointDrawActivity",
                42: "wxCollectCard",
                46: "wxTeam",
                65: "wxBuildActivity",
                69: "wxFansInterActionActivity",
                70: "wxCartKoi/cartkoi",
                71: "wxSecond",
                73: "wxShopGift",
                100: "wxTeam",
                102: "wxTeam",
                103: "mc/wxMcLevelAndBirthGifts",
                104: "mc/wxMcLevelAndBirthGifts",
                119: "mc/wxMcLevelAndBirthGifts",
                124: "wxScratchActive",
                125: "wxPointBlindBox",
                128: "wxGashaponActive",
                129: "wxDollGrabbing",
                204: "wxPointShop",
                1001: "wxgame",
                1002: "wxgame",
                2001: "drawCenter",
                2002: "drawCenter",
                2003: "drawCenter",
                2004: "drawCenter",
                2006: "drawCenter",
            };
            i1Iii1II[this.activityType] ? (this.type = i1Iii1II[this.activityType]) : (this.type = "wxDrawActivity");
            i1lI1lIi.activity.type = this.type;
        } else this.putMsg("手动确认,活动不存在或者已结束"), this.stop();
        return IIIilIii;
    }
    async ["activityContent"](Il1i1III = {}, lII11IIi = "") {
        let liIII11l = await this.wxApi(this.type + "/activityContent", {
            activityId: this.activityId,
            pin: this.secretPin,
            ...Il1i1III,
        });
        if (liIII11l && liIII11l?.["data"]) {
            let l1Ii1llI = lII11IIi ? liIII11l.data[lII11IIi] : liIII11l.data,
                ii1lI1I1 = l1Ii1llI?.["startTime"],
                liiIlI1l = l1Ii1llI?.["endTime"];
            const IiilIiI = l1Ii1llI?.["rule"] || l1Ii1llI?.["actRule"] || "";
            try {
                if (!ii1lI1I1 || !liiIlI1l) {
                    const llil1Ili = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/g,
                        lI1illi1 = IiilIiI.match(llil1Ili);
                    lI1illi1 && ((ii1lI1I1 = new Date(lI1illi1[0]).getTime()), (liiIlI1l = new Date(lI1illi1[1]).getTime()));
                }
                this.rule = IiilIiI;
                i1lI1lIi.activity.timeStr =
                    this.formatDate(ii1lI1I1, "yyyy-MM-dd HH:mm:ss") + "至" + this.formatDate(liiIlI1l, "yyyy-MM-dd HH:mm:ss");
                i1lI1lIi.activity.startTime = ii1lI1I1;
                i1lI1lIi.activity.endTime = liiIlI1l;
            } catch (Ilii11I1) {}
            if (ii1lI1I1 && ii1lI1I1 > Date.now()) {
                this.putMsg("活动未开始");
                i1lI1lIi.activity.noStart = true;
                this.stop();
            }
            liiIlI1l && liiIlI1l < Date.now() && (this.putMsg("活动已结束"), this.stop());
        }
        return liIII11l;
    }
    async ["getGiveContent"]() {
        let i1iIi1II = await this.wxApi("wxDrawActivity/getGiveContent", {
            pin: this.secretPin,
        });
        if (i1iIi1II && i1iIi1II?.["data"]) {
        }
        return i1iIi1II;
    }
    async ["initPinToken"](Ill11l = this.venderId, i1IlIllI = this.shopId) {
        let llII1lii = {
                activityId: this.activityId,
                jdToken: this.isvToken,
                source: "01",
                uuid: this.phoneInfo.uuid,
                clientTime: Date.now(),
            },
            l1iiI1lI = "";
        if (this.mode === "100") {
            llII1lii = {
                ...llII1lii,
                shareUserId: "",
                shopId: i1IlIllI,
                status: 1,
            };
            l1iiI1lI = "https://" + this.domain + this.prefix + "/api/user-info/initPinToken";
        } else
            (llII1lii = {
                ...llII1lii,
                venderId: Ill11l,
                fromType: "APP",
                riskType: 1,
                client: "iOS",
                clientVersion: this.phoneInfo.clientVersion,
                osVersion: this.phoneInfo.iv,
                model: this.phoneInfo.tf,
                userAgent: this.ua.app,
            }),
                (l1iiI1lI = "https://" + this.domain + "/customer/initPinToken");
        let lilI1liI = await this.taskGet(this.mode === "wx" ? "customer/initPinToken" : "api/user-info/initPinToken", llII1lii);
        if (this.mode === "wx" && lilI1liI && lilI1liI.result)
            (this.secretPin = encodeURIComponent(lilI1liI.data?.["secretPin"])), (this.nickname = lilI1liI.data?.["nickname"]);
        else
            this.mode === "100" && lilI1liI && lilI1liI.resp_code === 0
                ? (this.pinToken = JSON.parse(lilI1liI.data)?.["data"]?.["pinToken"])
                : (this.putMsg(lilI1liI?.["errorMessage"] || lilI1liI?.["data"]),
                  this.wxStop(lilI1liI?.["errorMessage"] || lilI1liI?.["data"]),
                  this.reseCookieStatus(),
                  this.exit());
        return lilI1liI;
    }
    async ["getMyPing"](Iii1ilIl = "customer/getMyPing", iIliiii = this.isvToken, llii1Iii = this.venderId) {
        let IiII1ll = await this.wxApi(Iii1ilIl, {
            userId: llii1Iii,
            token: iIliiii,
            fromType: "APP",
        });
        if (IiII1ll && IiII1ll?.["result"]) (this.secretPin = IiII1ll.data?.["secretPin"]), (this.nickname = IiII1ll.data?.["nickname"]);
        else {
            let I1iIIlil = IiII1ll?.["errorMessage"] || "获取pin失败";
            this.putMsg(I1iIIlil);
            this.wxStop(I1iIIlil);
            I1iIIlil.includes("请联系商家") && this.stop();
            this.reseCookieStatus();
            this.exit();
        }
        return IiII1ll;
    }
    async ["accessLog"](ilIll11I = this.secretPin) {
        let IiiIli11 = this.domain.includes("lzkj") ? "accessLogWithAD" : "accessLog";
        await this.wxApi("common/" + IiiIli11, {
            venderId: this.venderId,
            code: this.activityType,
            pin: ilIll11I,
            activityId: this.activityId,
            pageUrl: this.activityUrl,
            subType: "app",
            uuid: this.phoneInfo.uuid,
        });
    }
    async ["saveAddress"](lIIIl1l1 = this.addressId, lIiiillI = this.prizeName) {
        this.getAddress();
        if (!this.address) {
            this.putMsg("未配置地址或所有地址已达使用上限,退出填地址");
            return;
        }
        if (
            addressStopKeywords &&
            addressStopKeywords.some((IiI1iIl1) => {
                return lIiiillI?.["includes"](IiI1iIl1);
            })
        ) {
            this.putMsg("触发关键词不填地址");
            return;
        }
        if (
            addressStopKeywordsRule &&
            addressStopKeywordsRule.some((lI1ilIIl) => {
                return this.rule?.["includes"](lI1ilIIl);
            })
        ) {
            this.putMsg("触发规则不填地址");
            return;
        }
        this.log("使用地址", this.address);
        let i1ill1l = false;
        if (this.mode == "wx") {
            this.address.generateId = lIIIl1l1;
            let IliIIil1 = await this.wxApi("wxAddress/save", {
                ...this.address,
                venderId: this.venderId,
                pin: this.secretPin,
                activityId: this.activityId,
                actType: this.activityType,
                prizeName: lIiiillI,
                personalEmail: "",
            });
            this.log(IliIIil1);
            IliIIil1 && IliIIil1.result
                ? (this.putMsg("已填地址"), (i1ill1l = true))
                : (this.putMsg("填地址失败"), this.putMsg(IliIIil1.errorMessage));
        } else {
            if (this.mode === "100") {
                const { phone: l11ilIl1, address: lllliI1l, receiver: I1iIl11I, city: ll1il1l1, county: lI1i1lI1, province: Il1i1llI } = this.address;
                let lI1iIIll = {
                        mobile: l11ilIl1,
                        address: lllliI1l,
                        realName: I1iIl11I,
                        city: ll1il1l1,
                        county: lI1i1lI1,
                        orderCode: lIIIl1l1,
                        province: Il1i1llI,
                    },
                    l111iiI1 = await this.lzkjApi("api/my/prize/update", lI1iIIll);
                if (l111iiI1.resp_code === 0) {
                    this.putMsg("已填地址");
                    i1ill1l = true;
                } else this.putMsg("填地址失败"), this.putMsg(l111iiI1.resp_msg);
            } else {
                if (this.mode === "hdb") {
                    const {
                        phone: lll1Iil1,
                        address: Ii11liil,
                        receiver: Il11llI,
                        city: I1iIIi11,
                        county: IliIi1I,
                        province: i1I11II,
                    } = this.address;
                    let ii1I1111 = {
                            province: i1I11II,
                            city: I1iIIi11,
                            area: IliIi1I,
                            detailAddress: Ii11liil,
                            address: "" + i1I11II + I1iIIi11 + IliIi1I + Ii11liil,
                            mobile: lll1Iil1,
                            receiveName: Il11llI,
                            activityLogId: lIIIl1l1,
                        },
                        ll1iiil = await this.hdbApi("postDeliveryInfo", ii1I1111);
                    this.log(ll1iiil);
                    if (ll1iiil && ll1iiil.succ) {
                        this.putMsg("已填地址");
                        i1ill1l = true;
                    } else this.putMsg("填地址失败"), this.putMsg(ll1iiil?.["message"]);
                } else {
                    if (this.mode === "hzbz") {
                        const {
                            phone: lI11iIli,
                            address: I1I1il1,
                            receiver: iIiIIiII,
                            city: I111111i,
                            county: I1iIi1ii,
                            province: i1liI1ll,
                        } = this.address;
                        let IIIIlli1 = {
                                addressRegion: i1liI1ll + "-" + I111111i + "-" + I1iIi1ii,
                                address: I1I1il1,
                                mobile: lI11iIli,
                                name: iIiIIiII,
                                condtionId: "",
                            },
                            Ii1lIi1i = await this.hzbzApi("SaveUserInfo.json", IIIIlli1);
                        this.log(Ii1lIi1i);
                        if (Ii1lIi1i && Ii1lIi1i.code === 0) this.putMsg("已填地址"), (i1ill1l = true);
                        else {
                            this.putMsg("填地址失败");
                            this.putMsg(Ii1lIi1i?.["txt"]);
                        }
                    } else {
                        if (this.mode === "jinggeng") {
                            const {
                                phone: illiIl11,
                                address: IlIllllI,
                                receiver: l1111iiI,
                                city: iililili,
                                county: iiI1III,
                                province: l1illiI1,
                            } = this.address;
                            let l11iiliI = await this.jinggengApi("postBuyerInfo", {
                                receiverName: l1111iiI,
                                mobile: illiIl11,
                                address: l1illiI1.replace("省", "").replace("市", "") + " " + iililili.replace("市", "") + " " + iiI1III + IlIllllI,
                                log_id: lIIIl1l1,
                            });
                            this.log(l11iiliI);
                            if (l11iiliI && l11iiliI.succ) {
                                this.putMsg("已填地址");
                                i1ill1l = true;
                            } else this.putMsg("填地址失败"), this.putMsg(l11iiliI?.["msg"]);
                        }
                    }
                }
            }
        }
        if (i1ill1l) {
            let liil1lil =
                this.formatDate(Date.now(), "yyyy-MM-dd HH:mm:ss") +
                "," +
                lIiiillI +
                "," +
                this.pin +
                "," +
                this.address?.["phone"] +
                "," +
                this.address?.["address"] +
                "," +
                iilIiI1.envInfo.name +
                "," +
                (this.shopId ?? this.venderId) +
                "," +
                this.activityUrl +
                "\
";
            this.appendFileSync("", "gifts.csv", liil1lil);
        }
    }
    async ["getPrize"]() {
        let iI1l1ii = await this.wxApi(this.type + "/getPrize", {
            activityId: this.activityId,
            pin: this.secretPin,
        });
        this.debug(iI1l1ii);
        if (iI1l1ii && iI1l1ii.result && iI1l1ii.data?.["drawOk"]) {
            this.putMsg(iI1l1ii.data.name || "空气");
            return;
        }
        let Ii1iiiiI = iI1l1ii?.["errorMessage"] || iI1l1ii?.["data"]?.["errorMessage"];
        if (!Ii1iiiiI) return;
        return this.putMsg(Ii1iiiiI), this.wxStop(Ii1iiiiI), iI1l1ii;
    }
    async ["login"](iiliilll = true, IIII1liI = this.isvToken) {
        if (this.mode === "100") {
            let lliiiil = {
                activityId: this.activityId,
                tokenPin: IIII1liI,
                status: 1,
                source: "01",
                shareUserId: "",
                uuid: this.phoneInfo.uuid,
                client: "iOS",
                clientVersion: this.phoneInfo.clientVersion,
                osVersion: this.phoneInfo.iv,
                model: this.phoneInfo.tf,
                userAgent: this.ua.app,
            };
            if (this.domain.includes("lzkj")) {
            }
            let IIi1I111 = await this.taskPostByJson("api/user-info/login", lliiiil);
            if (this.haskey(IIi1I111, "data.token")) {
                this.token = IIi1I111.data.token;
                this.headers.token = IIi1I111.data.token;
                let IilI1I11 = this.haskey(IIi1I111, "data.joinInfo.joinCodeInfo.joinCode");
                this.joinDes = IIi1I111.data.joinInfo.joinCodeInfo.joinDes;
                this.log("登录成功|" + IilI1I11 + "|" + this.joinDes);
                i1lI1lIi.activity.shopId = IIi1I111.data.shopId;
                this.shopId = IIi1I111.data.shopId;
                this.joinCode = IilI1I11;
                const ili1I1i1 = /venderId=(\d+)/,
                    llll1iII = IIi1I111.data.joinInfo?.["openCardUrl"];
                this.venderId = llll1iII ? llll1iII.match(ili1I1i1)[1] : this.shopId;
                i1lI1lIi.activity = {
                    ...i1lI1lIi.activity,
                    shopId: this.shopId,
                    venderId: this.venderId,
                };
                this.lzkjOpenCard &&
                    ["1005", "1002", "1006"].includes(IilI1I11) &&
                    !this.openCardTypes.includes(this.activityType) &&
                    (this.putMsg(this.joinDes), this.exit());
                await this.lzkjApi("api/task/followShop/follow");
                iiliilll && (await this.lzkjBaseInfo());
            } else this.putMsg(IIi1I111?.["resp_msg"] || "登录失败"), this.wxStop(IIi1I111?.["resp_msg"]), this.exit();
            return IIi1I111;
        } else {
            if (["hdb"].includes(this.mode)) {
                let iil1ill = await this.taskPostByJson("front/fans/login", {
                    appJsonParams: {
                        id: this.activityId,
                        source: "01",
                        userId: this.userId,
                        token: IIII1liI,
                        method: "/front/fans/login",
                    },
                    sysParams: {
                        sign: "111111",
                        timestamp: 123456,
                        sysmethod: "/front/fans/login",
                    },
                });
                if (iil1ill && iil1ill?.["code"] == 200) {
                    this.buyerNick = iil1ill?.["result"]?.["buyerNick"];
                    this.aesBuyerNick = iil1ill?.["result"]?.["aesBuyerNick"];
                    this.userId = iil1ill?.["result"]?.["userId"];
                    this.openCard = iil1ill?.["result"]?.["openCard"];
                    i1lI1lIi.activity.shopId = this.userId;
                    i1lI1lIi.activity.venderId = this.userId;
                } else {
                    if (iil1ill?.["message"]?.["includes"]("商家订购过期")) {
                        this.putMsg("商家订购过期");
                        this.stop();
                    } else this.putMsg(iil1ill?.["message"] || "登录失败"), this.exit();
                }
                return iil1ill;
            } else {
                if (this.mode === "v2") {
                    let llI1ilIl = await this.v2Api("api/user/login", {
                        token: IIII1liI,
                        source: "01",
                        activityType: this.activityType,
                        templateCode: this.templateCode,
                        activityId: this.activityId,
                        shopId: this.shopId,
                        uuid: this.phoneInfo.uuid,
                        timestamp: this.timestamp(),
                    });
                    if (llI1ilIl && llI1ilIl?.["code"] === 200) {
                        this.headers["Pin-Token"] = llI1ilIl?.["data"]?.["pinToken"];
                        this.headers["Activity-Id"] = this.activityId;
                        this.headers["Shop-Id"] = this.shopId;
                        this.headers["Activity-Type"] = this.activityType;
                        this.headers["Template-Code"] = this.templateCode;
                        this.secretPin = llI1ilIl?.["data"]?.["encryptPin"];
                        await this.getActivityBase();
                    } else this.putMsg(llI1ilIl?.["message"] || "登录失败"), this.exit();
                    return llI1ilIl;
                }
            }
        }
    }
    async ["lzkjBaseInfo"]() {
        this.needPinToken && (await this.initPinToken());
        await this.basicInfo();
        await this.getPrizeList();
        this.prizeList &&
            this.prizeList.length > 0 &&
            this.prizeList.filter((l1IliIi) => ![2].includes(l1IliIi.prizeType) && l1IliIi.leftNum !== 0).length === 0 &&
            (this.putMsg("垃圾活动"), this.stop());
        if (!["1001", "1004"].includes(this.joinCode) && this.openCardTypes.includes(this.activityType))
            return await this.bindWithVender(), await this.login(false);
        if (this.joinCode === "1004") await this.login(false);
    }
    async ["basicInfo"]() {
        let liIl1Il = await this.taskPostByJson("api/active/basicInfo", {
            activityId: this.activityId,
        });
        if (liIl1Il && liIl1Il.resp_code === 0) {
            const lIiIIii = {
                    10001: {
                        name: "签到抽奖",
                        api: "sign",
                    },
                    10002: {
                        name: "签到抽奖",
                        api: "sign",
                    },
                    10004: {
                        name: "签到抽奖",
                        api: "sign",
                    },
                    10006: {
                        name: "邀好友",
                        api: "member",
                    },
                    10011: {
                        name: "答题有礼",
                        api: "knowledge",
                    },
                    10020: {
                        name: "幸运抽奖",
                        api: "jiugongge",
                    },
                    10021: {
                        name: "幸运抽奖",
                        api: "jiugongge",
                    },
                    10023: {
                        name: "签到有礼",
                        api: "daySign",
                    },
                    10024: {
                        name: "加购有礼",
                        api: "addSku",
                    },
                    10025: {
                        name: "关注店铺",
                        api: "followShop",
                    },
                    10026: {
                        name: "积分抽奖",
                        api: "points",
                    },
                    10027: {
                        name: "积分PK",
                        api: "integralPk",
                    },
                    10030: {
                        name: "下单有礼",
                        api: "orderGift",
                    },
                    10031: {
                        name: "幸运抽奖",
                        api: "niudanji",
                    },
                    10032: {
                        name: "集卡有礼",
                        api: "collectCard",
                    },
                    10033: {
                        name: "组队瓜分",
                        api: "organizeTeam",
                    },
                    10034: {
                        name: "神券裂变",
                        api: "fissionCoupon",
                    },
                    10035: {
                        name: "秒读手速",
                        api: "dmpss",
                    },
                    10036: {
                        name: "购物车锦鲤",
                        api: "addSkuPrice",
                    },
                    10040: {
                        name: "签到有礼",
                        api: "daySign",
                    },
                    10041: {
                        name: "幸运抽奖",
                        api: "lotteryCenter",
                    },
                    10042: {
                        name: "幸运抽奖",
                        api: "lotteryCenter",
                    },
                    10043: {
                        name: "分享有礼",
                        api: "sharePolitely",
                    },
                    10044: {
                        name: "投票抽奖",
                        api: "votePolitely",
                    },
                    10045: {
                        name: "买家秀",
                        api: "buyersShow",
                    },
                    10046: {
                        name: "幸运抽奖",
                        api: "lotteryCenter",
                    },
                    10047: {
                        name: "盖楼有礼",
                        api: "building",
                    },
                    10048: {
                        name: "限时抢券",
                        api: "robCoupon",
                    },
                    10049: {
                        name: "完善信息",
                        api: "perfectInfo",
                    },
                    10053: {
                        name: "关注商品",
                        api: "followGoods",
                    },
                    10054: {
                        name: "上上签抽奖",
                        api: "upperSign",
                    },
                    10058: {
                        name: "店铺礼包",
                        api: "shopGift",
                    },
                    10059: {
                        name: "合成大赢家",
                        api: "bigwinner",
                    },
                    10060: {
                        name: "新人优惠券",
                        api: "couponMarketing",
                    },
                    10063: {
                        name: "翻牌抽奖",
                        api: "lotteryCenter",
                    },
                    10062: {
                        name: "翻牌抽奖",
                        api: "lotteryCenter",
                    },
                    10068: {
                        name: "邀请关注",
                        api: "inviteFollowShop",
                    },
                    10069: {
                        name: "关注有礼",
                        api: "lkFollowShop",
                    },
                    10070: {
                        name: "邀请入会",
                        api: "member",
                    },
                    10073: {
                        name: "幸运抽奖",
                        api: "lotteryCenter",
                    },
                    10077: {
                        name: "首购有礼",
                        api: "first/buy",
                    },
                    10078: {
                        name: "满额有礼",
                        api: "consumptionGift",
                    },
                    10079: {
                        name: "积分兑换",
                        api: "pointsExchange",
                    },
                    10080: {
                        name: "积分刮刮乐",
                        api: "points",
                    },
                    10081: {
                        name: "答题有礼",
                        api: "questionnaire",
                    },
                    10082: {
                        name: "互动游戏",
                        api: "game",
                    },
                    10084: {
                        name: "互动游戏",
                        api: "game",
                    },
                    10086: {
                        name: "互动游戏",
                        api: "game",
                    },
                    10089: {
                        name: "互动游戏",
                        api: "game",
                    },
                    10091: {
                        name: "互动游戏",
                        api: "game",
                    },
                    10092: {
                        name: "互动游戏",
                        api: "game",
                    },
                    10093: {
                        name: "互动游戏",
                        api: "game",
                    },
                    10094: {
                        name: "互动游戏",
                        api: "game",
                    },
                    10095: {
                        name: "互动游戏",
                        api: "game",
                    },
                    335: {
                        name: "入会有礼",
                        api: "rights",
                    },
                },
                { shopName: I1i1i11I, startTime: ili1llIl, endTime: l1lillii, actType: I1IIii1i } = liIl1Il.data;
            this.actType = I1IIii1i;
            this.type = lIiIIii[I1IIii1i]?.["api"];
            this.shopName = I1i1i11I;
            const IlIil1lI = this.formatDate(ili1llIl, "yyyy-MM-dd HH:mm:ss") + "至" + this.formatDate(l1lillii, "yyyy-MM-dd HH:mm:ss");
            i1lI1lIi.activity = {
                ...i1lI1lIi.activity,
                shopName: I1i1i11I,
                actType: I1IIii1i,
                startTime: ili1llIl,
                endTime: l1lillii,
                timeStr: IlIil1lI,
            };
            ili1llIl && ili1llIl > Date.now() && (this.putMsg("活动未开始"), (i1lI1lIi.activity.noStart = true), this.stop());
            l1lillii && l1lillii < Date.now() && (this.putMsg("活动已结束"), this.stop());
            if (!this.type) {
                this.putMsg("未知类型");
                this.exit();
                return;
            }
        }
        return liIl1Il;
    }
    async ["getDefenseUrls"]() {
        if (i1lI1lIi.activity.defenseUrls) return (this.defenseUrls = i1lI1lIi.activity.defenseUrls);
        const { domain: l11iiI1l, mode: ll1iI1I } = this;
        let l1ii;
        if (ll1iI1I === "wx") {
            l1ii = "https://" + l11iiI1l + "/customer/getDefenseUrls";
        } else {
            if (ll1iI1I === "100") l1ii = "https://" + this.domain + this.prefix + "/api/user-info/getDefenseUrls";
            else {
                this.defenseUrls = [];
                return;
            }
        }
        let lilIl1 = await this.jd_api({
            url: l1ii,
            maxRedirects: 0,
        });
        this.haskey(lilIl1, "data")
            ? (this.defenseUrls = ll1iI1I === "wx" ? lilIl1.data : lilIl1.data.map((Iilli1li) => Iilli1li.interfaceName))
            : (this.defenseUrls = []);
        i1lI1lIi.activity.defenseUrls = this.defenseUrls;
    }
    async ["getPrizeList"]() {
        if (i1lI1lIi.activity.prizeList) {
            this.prizeList = i1lI1lIi.activity.prizeList;
            return;
        }
        let li111iII = await this.lzkjApi("api/prize/drawPrize");
        li111iII &&
            li111iII.resp_code === 0 &&
            ((this.prizeList = li111iII.data?.["prizeInfo"] ?? []), (i1lI1lIi.activity.prizeList = this.prizeList));
    }
    async ["getUserId"]() {
        let l111il11 = await this.lzkjApi("api/task/share/getUserId");
        return l111il11 && l111il11.resp_code === 0 && (this.shareUserId = l111il11.data?.["shareUserId"]), l111il11;
    }
    async ["lzkjToDo"](i1liilll, Ii1111ii = "") {
        let IlIiIili = await this.lzkjApi("api/basic/task/toDo", {
            taskId: i1liilll,
            skuId: Ii1111ii,
        });
        if (IlIiIili && IlIiIili.resp_code === 0) {
            return true;
        }
        return false;
    }
    async ["lzkjTask"](I11I1i1I = []) {
        try {
            I11I1i1I = I11I1i1I.filter((Ill1I1) => Ill1I1?.["status"] === 0);
            if (I11I1i1I.length > 0) {
                for (let IIi1IIII of I11I1i1I) {
                    const { taskType: IiiIIll, taskId: ii1iI11 } = IIi1IIII,
                        {
                            completeCount: ilI1ii11,
                            oneClickPurchase: iIli1llI,
                            finishNum: iIilIi1,
                            maxNum: iiIiIl,
                            oneClickFollowPurchase: l1iiiill,
                        } = IIi1IIII;
                    if ((IiiIIll === 7 && iIli1llI === 0) || (IiiIIll === 5 && l1iiiill === 0)) {
                        this.log(IiiIIll === 7 ? "一键加购" : "一键关注");
                        if (await this.lzkjToDo(ii1iI11)) {
                        }
                    } else {
                        if ([7, 3, 5].includes(IiiIIll)) {
                            this.log(IiiIIll === 7 ? "加购" : IiiIIll === 5 ? "关注" : "浏览");
                            const III11Iii = IIi1IIII.skuInfoVO;
                            let liIi11I1 = 0;
                            for (let lIlliIIi of III11Iii) {
                                const { skuId: illIliiI, status: li1ll1 } = lIlliIIi;
                                if (li1ll1 === 0) {
                                    if (await this.lzkjToDo(ii1iI11, illIliiI)) {
                                        liIi11I1++;
                                        if (liIi11I1 >= iIilIi1) break;
                                    }
                                }
                            }
                        } else {
                            if (IiiIIll === 14) {
                                this.log("签到");
                                if (await this.lzkjToDo(ii1iI11)) {
                                }
                            }
                        }
                    }
                }
            }
        } catch (IIilill1) {}
    }
    async ["acquire"](Iil1lii1) {
        let lI1ilIli = await this.lzkjApi("api/prize/receive/acquire", {
            prizeInfoId: Iil1lii1,
            status: 1,
        });
        if (lI1ilIli && lI1ilIli.resp_code === 0) {
            this.putMsg(lI1ilIli.data?.["prizeName"]);
            lI1ilIli.data.prizeType === 3 &&
                ((this.addressId = lI1ilIli.data?.["addressId"]), (this.prizeName = lI1ilIli.data?.["prizeName"]), await this.saveAddress());
            return;
        }
        this.putMsg(lI1ilIli?.["resp_msg"]);
        this.wxStop(lI1ilIli?.["resp_msg"]);
    }
    async ["lzkjApi"](IIilii1, iliiI1iI = {}) {
        return await this.taskPostByJson(IIilii1, iliiI1iI, {
            token: this.token,
        });
    }
    ["getHmacSha256Sign"](iIiiIi1l, ll11II1) {
        const IiI1iIlI = "actid" + this.activityId + "buyernick" + this.aesBuyerNick + "sysmethod" + iIiiIi1l + "timestamp" + ll11II1;
        return this.hmacSHA256(this.getCookieByName("_sk") || "1111", IiI1iIlI);
    }
    async ["hdbApi"](iiiII1iI, iIli1liI = {}, IIi1ilI = false, Ii1il1I1 = true) {
        let ililll1I = IIi1ilI ? "/front/task/" + iiiII1iI : "/front/activity/" + iiiII1iI,
            iIll1iil = await this.taskPostByJson(ililll1I, {
                appJsonParams: {
                    id: this.activityId,
                    userId: this.userId,
                    method: ililll1I,
                    buyerNick: this.aesBuyerNick,
                    ...iIli1liI,
                },
            });
        if (iIll1iil && /数字签名不匹配|数字签名已失效|用户未登录/.exec(iIll1iil?.["message"]) && Ii1il1I1)
            return await this.login(), await this.hdbApi(iiiII1iI, iIli1liI, IIi1ilI, false);
        return iIll1iil;
    }
    async ["loadFrontAct"]() {
        let il1iI11I = await this.hdbApi("loadFrontAct");
        if (il1iI11I && il1iI11I?.["succ"]) {
            i1lI1lIi.activity.shopName = il1iI11I?.["result"]?.["activity"]?.["shopTitle"];
            let iliiillI = il1iI11I.result?.["activity"]?.["startTime"],
                Il1lll1i = il1iI11I.result?.["activity"]?.["endTime"],
                IllIi1il = il1iI11I.result?.["user"]?.["shopId"],
                Ill11ii = il1iI11I.result?.["user"]?.["venderId"];
            this.shopId = IllIi1il;
            this.venderId = Ill11ii;
            this.actType = il1iI11I.result?.["activity"]?.["actType"];
            i1lI1lIi.activity = {
                ...i1lI1lIi.activity,
                shopId: IllIi1il,
                venderId: Ill11ii,
                startTime: iliiillI,
                endTime: Il1lll1i,
            };
            iliiillI && iliiillI > Date.now() && (this.putMsg("活动未开始"), (i1lI1lIi.activity.noStart = true), this.stop());
            Il1lll1i && Il1lll1i < Date.now() && (this.putMsg("活动已结束"), this.stop());
        }
    }
    async ["reportPVUV"]() {
        await this.hdbApi("reportPVUV");
    }
    async ["loadFrontAward"]() {
        let ilIiilil = await this.hdbApi("loadFrontAward");
        return (
            ilIiilil &&
                ilIiilil.succ &&
                ((this.prizeList = ilIiilil.result ?? []),
                this.prefix.length > 0 &&
                    this.prizeList.filter((iil1li1) => !["JD_D_COUPON"].includes(iil1li1.awardType)).length === 0 &&
                    (this.putMsg("垃圾活动"), this.stop())),
            ilIiilil
        );
    }
    ["formatDateString"](IiIl111i) {
        if (IiIl111i?.["match"](/\d{4}年\d{1,2}月\d{1,2}日\d{2}:\d{2}:\d{2}/))
            return IiIl111i.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日(\d{2}:\d{2}:\d{2})/, "$1-$2-$3 $4");
        return IiIl111i;
    }
    ["getRuleSETime"](iIliI11 = this.rule) {
        const iilIIli = /(\d{4}-\d{1,2}-\d{1,2} \d{2}:\d{2}|\d{4}-\d{1,2}-\d{1,2}\s\d{2}:\d{2}:\d{2}|\d{4}年\d{1,2}月\d{1,2}日\d{2}:\d{2}:\d{2})/g,
            iiiilili = iIliI11.match(iilIIli);
        if (iiiilili) {
            const lIi1IIl = this.formatDateString(iiiilili[0]),
                l1Iiii1I = this.formatDateString(iiiilili[1]);
            this.startTime = new Date(lIi1IIl).getTime();
            this.endTime = new Date(l1Iiii1I).getTime();
            i1lI1lIi.activity.startTime = this.startTime;
            i1lI1lIi.activity.endTime = this.endTime;
            if (this.startTime && this.startTime > Date.now()) {
                this.putMsg("活动未开始");
                i1lI1lIi.activity.noStart = true;
                this.stop();
            }
            this.endTime && this.endTime < Date.now() && (this.putMsg("活动已结束"), this.stop());
        }
    }
    async ["jinggengShopInfo"]() {
        let l11lIlII = await this.taskGet(this.activityUrl);
        if (l11lIlII) {
            let IiiIiI1l = llIl1Ili.load(l11lIlII);
            const lIi11li1 = IiiIiI1l("#shop_sid").attr("value"),
                i1IIIl1i = IiiIiI1l("#shop_title").attr("value"),
                iili1llI = IiiIiI1l("#description").text();
            this.debug("shop_sid", lIi11li1);
            this.shopId = lIi11li1;
            this.venderId = this.userId;
            this.shopName = i1IIIl1i;
            const llliii1 = IiiIiI1l("title").text();
            return (
                (i1lI1lIi.activity.shopName = this.shopName),
                (i1lI1lIi.activity.shopId = this.shopId),
                (i1lI1lIi.activity.venderId = this.venderId),
                this.getRuleSETime(iili1llI),
                llliii1?.["includes"]("已结束") && (this.putMsg("活动已结束"), this.stop()),
                IiiIiI1l
            );
        }
        return undefined;
    }
    async ["setMixNick"](ilIlIli1 = this.isvToken) {
        let iiiIll = await this.taskPost("front/setMixNick", {
            strTMMixNick: ilIlIli1,
            userId: this.userId,
            source: "01",
        });
        return (
            this.debug(iiiIll),
            iiiIll && iiiIll.succ && (this.mixNick = iiiIll?.["msg"]),
            iiiIll && iiiIll?.["msg"]?.["includes"]("商家token过期") && (this.putMsg("商家token过期"), this.stop()),
            !this.mixNick && (this.putMsg("获取mixNick失败"), this.exit()),
            iiiIll
        );
    }
    async ["jinggengApi"](il11i1il, ilillii1 = {}) {
        let I1ll111 = await this.taskPost("ql/front/" + il11i1il, {
            act_id: this.activityId,
            user_id: this.userId,
            ...ilillii1,
        });
        return I1ll111;
    }
    async ["gzslApi"](l1Illil, lll11l1I = {}, Ill1il1i = false) {
        let i1il1Iil = {
            token: this.isvToken,
            source: "01",
            activityId: this.activityId,
            ...lll11l1I,
        };
        Ill1il1i && (i1il1Iil.wxToken = this.isvToken);
        let iiI1l1l1 = await this.taskPostByJson(
            "wuxian/user/" + l1Illil + "/" + this.activityId + (Ill1il1i ? "?wxToken=" + encodeURIComponent(this.isvToken) : ""),
            i1il1Iil
        );
        return iiI1l1l1;
    }
    async ["hzbzInfo"]() {
        let ilII1l = await this.taskGet(this.activityUrl);
        if (!ilII1l) {
            return;
        }
        let lil1lii1 = this.textToHtml(ilII1l),
            li1iliii = lil1lii1("#draw_info").text();
        li1iliii = this.parseJSON(li1iliii);
        let IllilI1l = li1iliii?.["stime"] || 0,
            Ii1Il1ii = li1iliii?.["etime"] || 0;
        this.shopName = li1iliii?.["shopName"];
        this.shopId = li1iliii?.["shopId"];
        this.rule = li1iliii?.["drawRule"];
        i1lI1lIi.activity.shopId = this.shopId;
        i1lI1lIi.activity.venderId = this.shopId;
        i1lI1lIi.activity.shopName = this.shopName;
        i1lI1lIi.activity.startTime = IllilI1l;
        i1lI1lIi.activity.endTime = Ii1Il1ii;
        if (IllilI1l && IllilI1l > this.timestamp()) {
            this.putMsg("活动未开始");
            this.stop();
            return;
        }
        if (Ii1Il1ii && Ii1Il1ii < this.timestamp()) {
            this.putMsg("活动已结束");
            this.stop();
            return;
        }
        return lil1lii1;
    }
    async ["hzbzApi"](lI1IIIi1, ilillli = {}) {
        let ilillIii = await this.taskPost("bigdraw/" + lI1IIIi1, ilillli);
        return ilillIii;
    }
    async ["v2Api"](liili1ii, III1IiI = undefined) {
        let IiliIIII = await this.taskPostByJson(
            liili1ii,
            this.encryptCrypto("AES", "CBC", "Pkcs7", "2JjUvJEAsA2Yog==", JSON.stringify(III1IiI, null, 2), "Hd5W5ONsYKmGm9QA")
        );
        return (
            IiliIIII &&
                IiliIIII.data &&
                (IiliIIII.data = IiliIIII?.["data"]
                    ? this.str2Json(this.decryptCrypto("AES", "CBC", "Pkcs7", "2JjUvJEAsA2Yog==", IiliIIII.data, "Hd5W5ONsYKmGm9QA"))
                    : IiliIIII.data),
            IiliIIII
        );
    }
    async ["getActivityBase"]() {
        let IIllI1II = await this.v2Api("api/common/getActivityBase");
        this.debug(IIllI1II);
        if (IIllI1II && IIllI1II.code === 200) {
            this.shopName = IIllI1II.data.shopName;
            let IlIiIIil = IIllI1II.data.startTime,
                IIi1lIl1 = IIllI1II.data.endTime,
                i1lIlil1 = IIllI1II.data.openCardLink ?? "";
            this.venderId = this.getQueryString(i1lIlil1, "venderId") ?? this.shopId;
            IlIiIIil && IlIiIIil > this.timestamp() && (this.putMsg("活动未开始"), (i1lI1lIi.activity.noStart = true), this.stop());
            if (IIi1lIl1 && IIi1lIl1 < this.timestamp()) {
                this.putMsg("活动已结束");
                this.stop();
            }
            let ii11Illl = IIllI1II.data.thresholdResponseList ?? [];
            for (let l1il1I1 of ii11Illl) {
                if (l1il1I1?.["type"] === 2) {
                    await this.v2Api("api/common/followShop");
                    continue;
                }
            }
            i1lI1lIi.activity.shopName = this.shopName;
            i1lI1lIi.activity.startTime = IlIiIIil;
            i1lI1lIi.activity.endTime = IIi1lIl1;
            i1lI1lIi.activity.shopId = this.shopId;
            i1lI1lIi.activity.venderId = this.venderId;
        }
    }
}
class i11ilIi1 {
    constructor(iillliI1) {
        this.activityUrl = iillliI1;
        this.switchInterval = wxProxyInterval;
        this.proxyEnable = false;
        this.proxyState = true;
        this.wxProxyMode = wxProxyMode;
        this.subscriptionUrls = wxProxyUrl.split("@");
        this.proxie = null;
        this.currentIndex = 0;
        this.isLocked = false;
        this.wxProxyCheck = wxProxyCheck;
    }
    ["log"](...IliII1I1) {
        ilI("proxy".padEnd(iilIiI1.paddedStringEndCount, " "), ...IliII1I1);
    }
    ["updateProxyEnable"](ii1lI11i) {
        !this.proxyEnable && ii1lI11i && this.startSwitching();
        !ii1lI11i && (this.stopSwitching(), (this.proxie = null), (this.proxyState = false));
        this.proxyEnable = ii1lI11i;
    }
    ["acquireLock"]() {
        if (!this.isLocked) {
            return (this.isLocked = true), Promise.resolve();
        } else {
            return new Promise((Iii1l1iI) => {
                const lIi1l11I = () => {
                        !this.isLocked && (clearInterval(II111Il), Iii1l1iI());
                    },
                    II111Il = setInterval(lIi1l11I, 50);
            });
        }
    }
    ["releaseLock"]() {
        this.isLocked = false;
    }
    async ["fetchProxies"](lil1IIli = 10) {
        try {
            this.currentIndex = Math.floor(Math.random() * this.subscriptionUrls.length);
            const iil1I1 = this.subscriptionUrls[this.currentIndex],
                iii1III1 = await il1I11ii.get(iil1I1),
                il1il = typeof iii1III1.data === "object" && iii1III1.data !== null ? JSON.stringify(iii1III1.data) : iii1III1.data,
                IilliIil = /^(?:(?:\d{1,3}\.){3}\d{1,3}|[a-zA-Z0-9.-]+)(?::\d+)(?=\/n|$)/gm,
                ilIiliil = il1il.match(IilliIil);
            if (ilIiliil) {
                this.log("已成功提取[" + ilIiliil.length + "]ip");
                if (this.wxProxyMode === 2) this.proxie = ilIiliil;
                else {
                    this.proxie = [ilIiliil[0]];
                    this.log("获取到的ip:" + this.proxie[0]);
                    if (this.wxProxyCheck === 1 && !(await this.checkPing(this.proxie[0])))
                        return lil1IIli > 0
                            ? (this.log(this.proxie[0] + "不通,正在重新获取..."),
                              await new Promise((Iilii1l1) => setTimeout(Iilii1l1, 2000)),
                              await this.fetchProxies(lil1IIli - 1))
                            : false;
                }
                return true;
            } else {
                this.log(il1il);
                this.subscriptionUrls.splice(this.currentIndex, 1);
                if (this.subscriptionUrls.length === 0) return false;
                return await this.fetchProxies(lil1IIli - 1);
            }
        } catch (Ii1) {
            this.log("Failed to fetch proxies:", Ii1.message);
        }
    }
    async ["setCurrentProxy"](l1IilIi1 = false) {
        if (!this.proxyState) return false;
        if (!l1IilIi1 && this.wxProxyMode === 2 && this.proxie?.["length"] > 0) return true;
        if (!this.isLocked) {
            this.lock = await this.acquireLock();
            try {
                if (this.subscriptionUrls.length === 0) return false;
                if (!(await this.fetchProxies())) {
                    return this.log("获取代理ip失败,退出代理"), this.updateProxyEnable(false), false;
                }
                return this.manualSwitch(), true;
            } finally {
                this.releaseLock();
            }
        } else {
            return await this.acquireLock(), true;
        }
    }
    async ["getProxy"](llliIIli = 10) {
        let il1I1I1 = this.proxie.shift();
        if (!il1I1I1 && llliIIli <= 0) return null;
        if (!il1I1I1) return await this.setCurrentProxy(), await this.getProxy(llliIIli - 1);
        if (this.wxProxyCheck === 1 && !(await this.checkPing(il1I1I1))) {
            if (llliIIli > 0) return this.log(il1I1I1 + "不通,正在重新获取..."), await this.getProxy(llliIIli - 1);
            else {
                return null;
            }
        }
        return il1I1I1;
    }
    async ["getCurrentProxy"]() {
        if (!this.proxyEnable) {
            return null;
        }
        return (
            (!this.proxie || this.proxie?.["length"] === 0) && (await this.setCurrentProxy()),
            this.proxie ? (this.proxie.length === 1 && this.wxProxyMode === 1 ? this.proxie[0] : await this.getProxy()) : null
        );
    }
    async ["startSwitching"]() {
        if (this.timer) {
            this.log("已经启动定时切换。");
            return;
        }
        this.timer = setInterval(async () => {
            await this.setCurrentProxy(true);
        }, this.switchInterval * 1000);
    }
    ["stopSwitching"]() {
        this.timer && (clearInterval(this.timer), (this.timer = null));
    }
    ["manualSwitch"]() {
        this.stopSwitching();
        this.startSwitching();
    }
    async ["checkPing"](liI11li1) {
        try {
            return (
                await ll11lli1({
                    url: this.activityUrl || "https://www.jd.com",
                    headers: {
                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
                    },
                    httpsAgent: new lII11lli("http://" + liI11li1),
                    timeout: 4000,
                }),
                true
            );
        } catch (i1i1IIIi) {
            return false;
        }
    }
}
class iilIiI1 {
    static ["activity"] = {};
    static ["msg"] = [];
    static ["proxy"];
    static ["running"] = true;
    static ["cookies"] = [];
    static ["paddedStringEndCount"] = 0;
    static ["concurrencyLimit"] = 0;
    static ["version"] = "1.1.3";
    static ["envInfo"] = {};
    static ["cookieInit"]() {
        let lII111I = [],
            il1i1l1i = [];
        Object.keys(Iil11II1).forEach((Il1l1llI) => {
            lII111I.push(Iil11II1[Il1l1llI]);
        });
        if (wxEnableOtherEnv === 2) {
            let IIIliIil = this.readFileSync("./env/ck.txt");
            il1i1l1i = IIIliIil.split(
                "\
"
            )
                .map((lI1lll1i) => lI1lll1i.trim())
                .filter((ili1i1ii) => ili1i1ii !== "");
            console.log("已启用加载额外ck模式");
            lII111I = lII111I.concat(il1i1l1i.filter((i11IlllI) => !lII111I.includes(i11IlllI)));
        }
        let iI1111I = this.readFileSync("./env/invite_ck.txt"),
            lli1llIi = iI1111I
                .split(
                    "\
"
                )
                .map((II1llI1I) => II1llI1I.trim())
                .filter((IiIillii) => IiIillii !== "");
        return [lII111I, lli1llIi];
    }
    static ["log"](...ili1IilI) {
        ilI("run".padEnd(this.paddedStringEndCount, " "), ...ili1IilI);
    }
    static ["readFileSync"](lilill11) {
        try {
            return llii1iii.readFileSync(lilill11, "utf-8").toString();
        } catch (li11lli) {
            return "";
        }
    }
    static async ["runTasksConcurrentlyWithDelay"](lI1I11li, III11I1, l1I11iiI, lI1IIi1i = false, lIi1IilI = true) {
        const III1IiIl = [],
            i11II11l = [];
        let li1Ill1 = this;
        async function l11Illli(il1ii1) {
            try {
                await new Promise((lIll11li) => setTimeout(lIll11li, l1I11iiI));
                const l1llI1ll = await il1ii1();
                III1IiIl.push(l1llI1ll);
            } catch (iIlliiI) {
                if (iIlliiI instanceof il1iii1I) (li1Ill1.running = false), li1Ill1.centralReject(new il1iii1I());
                else {
                    if (iIlliiI instanceof II1i1l1I) {
                    } else li1Ill1.log(iIlliiI?.["message"] || iIlliiI);
                }
            }
        }
        for (const iiIiI1Ii of lI1I11li) {
            if (!this.running && lIi1IilI) break;
            const IIIli1Il = lI1IIi1i ? this.concurrencyLimit : III11I1;
            if (i11II11l.length >= IIIli1Il) {
                await Promise.race(i11II11l);
            }
            const I1li11i = l11Illli(iiIiI1Ii);
            i11II11l.push(I1li11i);
            I1li11i.then(() => {
                i11II11l.splice(i11II11l.indexOf(I1li11i), 1);
            });
        }
        const l1II11li = new Promise((il1I1lIl, li11iI1I) => {
            li1Ill1.centralResolve = il1I1lIl;
            li1Ill1.centralReject = li11iI1I;
        });
        return (
            l1II11li
                .then(() => {
                    i11II11l.forEach((ll1illiI) => ll1illiI.catch(() => {}));
                })
                .catch(() => {}),
            await Promise.all(i11II11l),
            III1IiIl
        );
    }
    static ["get_mains_obj"]() {
        try {
            let Il11ilIl = this.cookie_all_obj.filter((Il1l1lil) => Il1l1lil.needHelp && !Il1l1lil.isInviter && !Il1l1lil.onlyInvite);
            return (Il11ilIl[0].isInviter = true), Il11ilIl[0];
        } catch (iliiili) {
            return null;
        }
    }
    static ["get_Invite_obj"](lilil1li = null, Iiilllll = []) {
        try {
            if (!(lilil1li?.["inviteMode"] === 1)) {
                let iIIiIIi = this.cookie_all_obj.filter((I1lll1i1) => !I1lll1i1.isUse && I1lll1i1.canHelp && !I1lll1i1.isInviter);
                return (iIIiIIi[0].isUse = true), iIIiIIi[0];
            } else {
                const ill1iiii = Iiilllll.map((lil1lII1) => lil1lII1.pin);
                let I1iIllli = this.cookie_all_obj.filter(
                    (lIIlI1i) => lilil1li.pin != lIIlI1i.pin && lIIlI1i.canHelp && !ill1iiii.includes(lIIlI1i.pin)
                );
                return I1iIllli[0];
            }
        } catch (I1IIl1ll) {
            return null;
        }
    }
    static async ["async_thread"](l1ill1i1, ll1i11i1) {
        while (this.running) {
            let IIIilii1 = this.get_mains_obj();
            if (!IIIilii1) return;
            try {
                await IIIilii1.userTask();
                if (ll1i11i1?.["inviteTask"]) {
                    if (!IIIilii1.isBlack) {
                        if (IIIilii1.needHelp) {
                            IIIilii1.log("开始邀请");
                            let II1l1iII = [];
                            while (IIIilii1.needHelp) {
                                let li1l111 = [];
                                if (IIIilii1.helpedCount >= this.activity.maxHelpCount) {
                                    IIIilii1.needHelp = False;
                                    IIIilii1.log("助力已满");
                                    break;
                                }
                                for (
                                    let ili11iiI = 0;
                                    ili11iiI <
                                    Math.abs(
                                        Math.min(
                                            ...[
                                                i1lI1lIi.activity.maxHelpCount - IIIilii1.helpedCount,
                                                ll1i11i1?.["thread"] || 1,
                                                i1lI1lIi.activity.customThread,
                                            ].filter((IiliII1) => typeof IiliII1 === "number")
                                        )
                                    );
                                    ili11iiI++
                                ) {
                                    let illii1iI = this.get_Invite_obj(IIIilii1, II1l1iII);
                                    illii1iI && (li1l111.push(illii1iI), II1l1iII.push(illii1iI));
                                }
                                if (li1l111.length === 0) {
                                    IIIilii1.log("已无助力号,退出线程 threads[" + l1ill1i1 + "]");
                                    return;
                                }
                                let iIiiIi11 = [];
                                for (let IIi1i11I of li1l111) {
                                    iIiiIi11.push(() => IIi1i11I.inviteTask(IIIilii1));
                                }
                                await this.runTasksConcurrentlyWithDelay(iIiiIi11, iIiiIi11.length, 10);
                            }
                        }
                    }
                }
            } catch (llIiI1I1) {
                if (llIiI1I1 instanceof il1iii1I) {
                    this.running = false;
                    return;
                } else {
                    if (llIiI1I1 instanceof II1i1l1I) {
                    } else this.log(llIiI1I1?.["message"] || llIiI1I1);
                }
            }
        }
    }
    static ["formatDate"](iil111i1, iIlIi1iI) {
        return i11Ii1I1(
            typeof iil111i1 === "object" ? iil111i1 : new Date(typeof iil111i1 === "string" ? iil111i1 * 1 : iil111i1),
            iIlIi1iI || "yyyy-MM-dd"
        );
    }
    static ["maskString"](i1l11l1I, I1I1lIIi, IiIIIiI1, IiiIiIIi = 4) {
        if (i1l11l1I.length <= I1I1lIIi + IiIIIiI1) return i1l11l1I;
        const I1ii1lI1 = i1l11l1I.slice(0, I1I1lIIi),
            llIilIi = i1l11l1I.slice(-IiIIIiI1),
            lIIiI111 = "*".repeat(IiiIiIIi);
        return I1ii1lI1 + lIIiI111 + llIilIi;
    }
    static async ["notify"](lII1Ilil, Iii1III1 = {}) {
        if (Iii1III1?.["noPush"]) return;
        const ii11ill1 = iilIiI1.envInfo.name;
        let lliliIi =
            this.cookie_all_obj
                .filter((liiiii1I) => liiiii1I.sendMsg?.["length"] > 0 && !liiiii1I.onlyInvite)
                .map(
                    (ililIIl) =>
                        ililIIl.index +
                        1 +
                        "【" +
                        (messageMasked === 1 && !ililIIl.remarks ? this.maskString(ililIIl.pin, 2, 3, 4) : ililIIl.remarks || ililIIl.pin) +
                        "】" +
                        ililIIl.sendMsg.join(",")
                )
                .join(
                    "\
"
                ) +
            "\
\
";
        if (i1lI1lIi.activity.shopName) {
            lliliIi +=
                "#" +
                i1lI1lIi.activity.shopName +
                "\
";
        }
        (i1lI1lIi.activity.shopId || i1lI1lIi.activity.venderId) &&
            (lliliIi +=
                "店铺信息:" +
                i1lI1lIi.activity.shopId +
                "_" +
                i1lI1lIi.activity.venderId +
                "\
");
        if (i1lI1lIi.activity.timeStr) {
            lliliIi +=
                "活动时间:" +
                i1lI1lIi.activity.timeStr +
                "\
";
        }
        return (
            !i1lI1lIi.activity.timeStr &&
                i1lI1lIi.activity.startTime &&
                i1lI1lIi.activity.endTime &&
                (lliliIi +=
                    "活动时间:" +
                    this.formatDate(i1lI1lIi.activity.startTime, "yyyy-MM-dd HH:mm:ss") +
                    "至" +
                    this.formatDate(i1lI1lIi.activity.endTime, "yyyy-MM-dd HH:mm:ss") +
                    "\
"),
            i1lI1lIi.activity.drawTimeStr &&
                (lliliIi +=
                    "开奖时间:" +
                    i1lI1lIi.activity.drawTimeStr +
                    "\
"),
            this.activity.activityUrl &&
                !Iii1III1?.["noPushUrl"] &&
                (lliliIi +=
                    "活动地址:" +
                    this.activity.activityUrl +
                    "\
\
"),
            i1lI1lIi.activity.shopId &&
                (lliliIi +=
                    "https://shop.m.jd.com/shop/home?shopId=" +
                    i1lI1lIi.activity.shopId +
                    "\
\
"),
            (lliliIi += "时间:" + i11Ii1I1(Date.now(), "yyyy-MM-dd HH:mm:ss.SSS") + " 时长:" + lII1Ilil + "s"),
            await i1liIIII.sendNotify(ii11ill1, lliliIi),
            lliliIi
        );
    }
    static async ["sendMessage"](IIlI1liI, IiI1111i, l1iII11i, iliilII1 = 1) {
        let IlIlIlii = {
                url: "https://" + (process.env.TG_API_HOST ?? "api.telegram.org") + "/bot" + IIlI1liI + "/sendMessage",
                data: {
                    chat_id: IiI1111i,
                    text: l1iII11i,
                    disable_web_page_preview: true,
                },
                headers: {
                    "Content-Type": "application/json",
                    Cookie: "10089",
                },
                timeout: 15000,
            },
            { data: l1li1Ili } = await il1I11ii(IlIlIlii);
        this.log("发送数据", l1iII11i);
        !l1li1Ili?.["ok"] && iliilII1 === 1 && (this.log("重试中", l1iII11i), await this.sendMessage(IiI1111i, l1iII11i, iliilII1++));
    }
    static #universalCaesarCipher(iIliIill, iIIiIiIi) {
        return iIliIill
            .split("")
            .map((IlI1iI1l) => this.#shiftCharUniversal(IlI1iI1l, iIIiIiIi))
            .join("");
    }
    static #shiftCharUniversal(i1I1i1iI, li1Ii111) {
        const lIl1111i = i1I1i1iI.charCodeAt(0);
        if (lIl1111i >= 32 && lIl1111i <= 126) return String.fromCharCode(((lIl1111i - 32 + li1Ii111) % 95) + 32);
        return i1I1i1iI;
    }
    static ["timestampToCron"](iIiillii) {
        const I1Il1i1 = new Date(iIiillii),
            lI1iIili = I1Il1i1.getSeconds(),
            iil1iI11 = I1Il1i1.getMinutes(),
            lI1ll1II = I1Il1i1.getHours(),
            IliIi1II = I1Il1i1.getDate(),
            I11iil1 = I1Il1i1.getMonth() + 1,
            IIiIlIl = lI1iIili + " " + iil1iI11 + " " + lI1ll1II + " " + IliIi1II + " " + I11iil1 + " *";
        return IIiIlIl;
    }
    static async ["sendTimeNotify"]() {
        lIi11IIl === 2 &&
            i1lI1lIi.activity.noStart &&
            process.env.SCHEDULE_TG_BOT_TOKEN &&
            process.env.SCHEDULE_TG_USER_ID &&
            i1lI1lIi.activity.startTime &&
            (await this.sendMessage(
                process.env.SCHEDULE_TG_BOT_TOKEN,
                process.env.SCHEDULE_TG_USER_ID,
                "spy定时插队 " + this.timestampToCron(i1lI1lIi.activity.startTime - 3000) + " " + this.activity.activityUrl
            ));
    }
    static ["sendNotifyToUser"]() {
        let Ii1lIlll = [];
        if (messageSingle === 1 && process.env.PUSH_TG_BOT_TOKEN) {
            const I1llIi1 = /计划余额不足|无法发放/,
                Iill11Il = iilIiI1.envInfo.name,
                lIl11ll = this.activity.activityUrl
                    ? "活动链接:" +
                      this.activity.activityUrl +
                      "\
\
"
                    : "",
                i1lIlIii =
                    "通知时间: " +
                    i11Ii1I1(Date.now(), "yyyy-MM-dd HH:mm:ss.SSS") +
                    "\
By: 小熊私人小助理✨";
            for (let I1lil1i1 of this.cookie_all_obj) {
                if (
                    I1lil1i1.tg_id &&
                    I1lil1i1.sendMsg.length > 0 &&
                    I1lil1i1.sendMsg.some((l111IIl) => /京豆|E卡|e卡|已填地址/.test(l111IIl) && !I1llIi1.test(l111IIl))
                ) {
                    let iI11II1 =
                            "【" +
                            I1lil1i1.pin +
                            "】" +
                            I1lil1i1.sendMsg.join(",") +
                            "\
\
",
                        I1I1IiI = process.env.PUSH_USER_DETAIL?.["split"]("|")?.["includes"](I1lil1i1.pin)
                            ? Iill11Il +
                              "\
\
" +
                              iI11II1 +
                              lIl11ll
                            : iI11II1;
                    I1I1IiI += i1lIlIii;
                    Ii1lIlll.push(() => this.sendMessage(process.env.PUSH_TG_BOT_TOKEN, I1lil1i1.tg_id, I1I1IiI));
                }
            }
        }
        return Ii1lIlll;
    }
    static ["__as"](iIiiI1I) {
        let il1lii1i = [];
        for (let IilI1llI of iIiiI1I) {
            if (typeof IilI1llI === "string") {
                let l1I111 = IilI1llI.split("-")[0] * 1,
                    il1il1Il = IilI1llI.split("-")[1] * 1;
                if (il1il1Il - l1I111 === 1) il1lii1i.push(l1I111), il1lii1i.push(il1il1Il);
                else {
                    for (let IillIl1i = l1I111; IillIl1i <= il1il1Il; IillIl1i++) {
                        il1lii1i.push(IillIl1i);
                    }
                }
            } else il1lii1i.push(IilI1llI);
        }
        return il1lii1i;
    }
    static async #au() {
        try {
            let iiII11ll = await il1I11ii({
                url: this.#universalCaesarCipher("kwws=227:143<14661;7=:<:<2dxwk0ehdu", -3),
                method: "POST",
                data: {
                    fn: this.envInfo.runName,
                },
                headers: {
                    "Content-Type": "application/json",
                    token: iiIli1l1,
                    _ts: Date.now(),
                    _vs: this.version,
                },
            });
            if (iiII11ll && iiII11ll.data && iiII11ll.data.success) {
            } else this.log(iiII11ll?.["data"]?.["msg"] || "鉴权失败"), process.exit(0);
        } catch (IlIllIil) {
            this.log("鉴权失败,请联系作者");
            process.exit(0);
        }
    }
    static ["envCheck"](lili1II1 = {}) {
        console.log("当前版本:v" + this.envInfo.version + ",依赖版本:v" + this.version);
        const lliIiIli = require.main.filename,
            li1IiI1l = lliIiIli.match(/[^\\\/]+(?=\.\w+$)/)[0],
            il1lll1i = II1l11Ii.parse(this.readFileSync("./config/config.yaml")) ?? {};
        iiIli1l1 = il1lll1i.B_API_TOKEN ?? iiIli1l1;
        let IIiIilii = il1lll1i[li1IiI1l + "_B_WX_WHITELIST"] ?? il1lll1i.B_WX_WHITELIST ?? process.env[li1IiI1l + "_B_WX_WHITELIST"];
        wxWhitelist = IIiIilii?.["split"](/[@,&|]/)["map"]((ii111lli) => (ii111lli.includes("-") ? ii111lli : ii111lli * 1)) ?? wxWhitelist;
        wxProxyEnable = parseInt(
            il1lll1i[li1IiI1l + "_B_WX_PROXY_ENABLE"] ?? il1lll1i.B_WX_PROXY_ENABLE ?? process.env[li1IiI1l + "_B_WX_PROXY_ENABLE"] ?? wxProxyEnable
        );
        wxProxySmart = parseInt(
            il1lll1i[li1IiI1l + "_B_WX_PROXY_SMART"] ?? il1lll1i.B_WX_PROXY_SMART ?? process.env[li1IiI1l + "_B_WX_PROXY_SMART"] ?? wxProxySmart
        );
        wxProxyInterval = parseInt(
            il1lll1i[li1IiI1l + "_B_WX_PROXY_INTERVAL"] ??
                il1lll1i.B_WX_PROXY_INTERVAL ??
                process.env[li1IiI1l + "_B_WX_PROXY_INTERVAL"] ??
                wxProxyInterval
        );
        wxProxyMode = parseInt(
            il1lll1i[li1IiI1l + "_B_WX_PROXY_MODE"] ?? il1lll1i.B_WX_PROXY_MODE ?? process.env[li1IiI1l + "_B_WX_PROXY_MODE"] ?? wxProxyMode
        );
        wxProxyUrl = il1lll1i[li1IiI1l + "_B_WX_PROXY_URL"] ?? il1lll1i.B_WX_PROXY_URL ?? process.env[li1IiI1l + "_B_WX_PROXY_URL"] ?? wxProxyUrl;
        Ili1II1i = parseInt(il1lll1i[li1IiI1l + "_B_WX_RUN_MODE"] ?? il1lll1i.B_WX_RUN_MODE ?? process.env[li1IiI1l + "_B_WX_RUN_MODE"] ?? Ili1II1i);
        lIi11IIl = il1lll1i[li1IiI1l + "_B_WX_SCHEDULE"] ?? il1lll1i.B_WX_SCHEDULE ?? process.env[li1IiI1l + "_B_WX_SCHEDULE"] ?? lIi11IIl;
        wxProxyCheck = parseInt(
            il1lll1i[li1IiI1l + "_B_WX_PROXY_CHECK"] ?? il1lll1i.B_WX_PROXY_CHECK ?? process.env[li1IiI1l + "_B_WX_PROXY_CHECK"] ?? wxProxyCheck
        );
        wxEnableOtherEnv = parseInt(
            il1lll1i[li1IiI1l + "_B_WX_ENABLE_OTHER_ENV"] ??
                il1lll1i.B_WX_ENABLE_OTHER_ENV ??
                process.env[li1IiI1l + "_B_WX_ENABLE_OTHER_ENV"] ??
                wxEnableOtherEnv
        );
        ll1Ilili = parseInt(
            il1lll1i[li1IiI1l + "_B_WX_TIMEOUT_DURATION"] ??
                il1lll1i.B_WX_TIMEOUT_DURATION ??
                process.env[li1IiI1l + "_B_WX_TIMEOUT_DURATION"] ??
                ll1Ilili
        );
        messageMasked = parseInt(
            il1lll1i[li1IiI1l + "_B_WX_MESSAGE_MASKED"] ??
                il1lll1i.B_WX_MESSAGE_MASKED ??
                process.env[li1IiI1l + "_B_WX_MESSAGE_MASKED"] ??
                messageMasked
        );
        messageSingle = parseInt(
            il1lll1i[li1IiI1l + "_B_WX_MESSAGE_SINGLE"] ??
                il1lll1i.B_WX_MESSAGE_SINGLE ??
                process.env[li1IiI1l + "_B_WX_MESSAGE_SINGLE"] ??
                messageSingle
        );
        proxyRegx =
            il1lll1i[li1IiI1l + "_B_WX_PROXY_ENABLE_REGEXP"] ??
            il1lll1i.B_WX_PROXY_ENABLE_REGEXP ??
            process.env[li1IiI1l + "_B_WX_PROXY_ENABLE_REGEXP"] ??
            proxyRegx;
        let IlliII1l =
            il1lll1i[li1IiI1l + "_B_WX_ADDRESS_STOP_KEYWORD"] ??
            il1lll1i.B_WX_ADDRESS_STOP_KEYWORD ??
            process.env[li1IiI1l + "_B_WX_ADDRESS_STOP_KEYWORD"];
        IlliII1l?.["split"](/[@,&|]/)?.["forEach"]((iIiilIll) => addressStopKeywords.push(iIiilIll));
        let iiIIliI =
            il1lll1i[li1IiI1l + "_B_WX_ADDRESS_STOP_KEYWORD_RULE"] ??
            il1lll1i.B_WX_ADDRESS_STOP_KEYWORD_RULE ??
            process.env[li1IiI1l + "_B_WX_ADDRESS_STOP_KEYWORD_RULE"];
        iiIIliI?.["split"](/[@,&|]/)?.["forEach"]((I1II1ill) => addressStopKeywordsRule.push(I1II1ill));
        let ii11IIIl =
            il1lll1i[li1IiI1l + "_B_WX_OPEN_CARD_TYPES"] ?? il1lll1i.B_WX_OPEN_CARD_TYPES ?? process.env[li1IiI1l + "_B_WX_OPEN_CARD_TYPES"];
        ii11IIIl?.["split"](/[@,&|]/)["forEach"]((IlIi1l1l) => i1lillli.push(IlIi1l1l));
        addressUseNum = parseInt(
            il1lll1i[li1IiI1l + "_B_WX_ADDRESS_USE_NUM"] ??
                il1lll1i.B_WX_ADDRESS_USE_NUM ??
                process.env[li1IiI1l + "_B_WX_ADDRESS_USE_NUM"] ??
                addressUseNum
        );
        lili1II1.thread = parseInt(
            il1lll1i[li1IiI1l + "_B_THREAD"] ??
                il1lll1i.B_THREAD ??
                process.env[li1IiI1l + "_B_THREAD"] ??
                process.env.B_THREAD ??
                lili1II1?.["thread"] ??
                1
        );
        lili1II1.main_thread = parseInt(
            il1lll1i[li1IiI1l + "_B_MAIN_THREAD"] ??
                il1lll1i.B_MAIN_THREAD ??
                process.env[li1IiI1l + "_B_MAIN_THREAD"] ??
                process.env.B_MAIN_THREAD ??
                lili1II1?.["main_thread"] ??
                1
        );
        lili1II1.inviteTask && (lili1II1.main_thread = 1);
        wxProxyCheck = lili1II1?.["wxProxyCheck"] ?? wxProxyCheck;
        wxProxySmart = lili1II1?.["wxProxySmart"] ?? wxProxySmart;
        console.log('当前token B_API_TOKEN="' + iiIli1l1 + '"');
        console.log("运行参数：", lili1II1);
        console.log(iilIiI1.envInfo.name, lliIiIli, "开始运行...");
        i1lI1lIi.accounts = this.readFileSync("./account.json");
    }
    static ["match"](iiiliIli, il1l1Il1) {
        iiiliIli = iiiliIli instanceof Array ? iiiliIli : [iiiliIli];
        for (let illi1I1l of iiiliIli) {
            const l1iiliI1 = illi1I1l.exec(il1l1Il1);
            if (l1iiliI1) {
                const ii1lIIli = l1iiliI1.length;
                if (ii1lIIli === 1) {
                    return l1iiliI1;
                } else {
                    if (ii1lIIli === 2) {
                        return l1iiliI1[1];
                    } else {
                        const Iiil1l1l = [];
                        for (let l1l1IiIl = 1; l1l1IiIl < ii1lIIli; l1l1IiIl++) {
                            Iiil1l1l.push(l1iiliI1[l1l1IiIl]);
                        }
                        return Iiil1l1l;
                    }
                }
            }
        }
        return "";
    }
    static ["getActivityId"](iIllI1Il = this.activity.activityUrl) {
        const Iii1lIll = new URLSearchParams(new URL(iIllI1Il).search),
            lIilIili = ["activityId", "giftId", "actId", "token", "code", "a", "id"];
        let IIII1lii = "";
        for (let i1ii1il1 of lIilIili) {
            IIII1lii = Iii1lIll.get(i1ii1il1);
            if (IIII1lii) break;
        }
        return (
            !IIII1lii && (IIII1lii = this.match(/\/(dz[a-zA-Z0-9]{28,32})/, iIllI1Il)),
            (this.activity.activityId = IIII1lii),
            this.activity.activityId
        );
    }
    static ["getQueryString"](II1iIll1, iI1illi1) {
        let li1Ii = new RegExp("(^|[&?])" + iI1illi1 + "=([^&]*)(&|$)"),
            lil1lili = II1iIll1.match(li1Ii);
        if (lil1lili != null) return unescape(lil1lili[2]);
        return "";
    }
    static ["runActInfo"]() {
        let illI1Ili = {};
        if (this.activity.activityUrl) {
            illI1Ili.domain = this.activity.activityUrl.match(/^(?:https?:\/\/)?([^/]+)\//)[1];
            illI1Ili.activityId = this.getQueryString(this.activity.activityUrl, "activityId");
            illI1Ili.prefix = Object.keys(I11ilIl).find((lII1l1il) => this.activity.activityUrl.match(I11ilIl[lII1l1il])) || "";
            if (/interaction\/v2/.test(this.activity.activityUrl)) {
                illI1Ili.mode = "v2";
                let liil1lII = this.activity.activityUrl.match(/\/v2\/(\d+)\/(\d+)\//);
                illI1Ili.activityType = liil1lII[1];
                illI1Ili.shopId = this.activity.activityUrl.match(/shopId=(\d+)/)[1];
                illI1Ili.templateCode = liil1lII[2];
            } else {
                if (/activityType=\d+/.test(this.activity.activityUrl)) {
                    illI1Ili.mode = "100";
                    illI1Ili.activityType = this.activity.activityUrl.match(/activityType=([^&]+)/)[1];
                } else {
                    if (/(hdb|jingyun)/.test(this.activity.activityUrl))
                        (illI1Ili.mode = "hdb"),
                            (illI1Ili.activityId = this.getQueryString(this.activity.activityUrl, "id")),
                            (illI1Ili.userId = this.getQueryString(this.activity.activityUrl, "userId"));
                    else {
                        if (/jinggeng/.test(this.activity.activityUrl)) {
                            illI1Ili.mode = "jinggeng";
                            illI1Ili.activityId = this.getQueryString(this.activity.activityUrl, "id");
                            illI1Ili.userId = this.getQueryString(this.activity.activityUrl, "user_id");
                        } else {
                            if (/gzsl/.test(this.activity.activityUrl))
                                (illI1Ili.mode = "gzsl"), (illI1Ili.activityId = this.getQueryString(this.activity.activityUrl, "activityId"));
                            else
                                /hzbz-isv|hdds-isv/.test(this.activity.activityUrl)
                                    ? ((illI1Ili.mode = "hzbz"), (illI1Ili.activityId = this.getQueryString(this.activity.activityUrl, "id")))
                                    : (illI1Ili.mode = "wx");
                        }
                    }
                }
            }
            illI1Ili.needPinToken = !notInitPinTokenRegx.test(this.activity.activityUrl);
            illI1Ili.activityId = this.getActivityId();
            illI1Ili.activityUrl = this.activity.activityUrl;
        }
        this.activity = Object.assign(this.activity, illI1Ili);
    }
    static async ["processCookies"]() {
        this.cookie_all_obj = [];
        const l1ll1lIl = this.cookies.map((l11llI1I, lIi1lil1) => {
                return new Promise((llll1Il1) => {
                    setTimeout(() => {
                        const I1lI1ll1 = new this.TaskClass(lIi1lil1, l11llI1I);
                        llll1Il1({
                            index: lIi1lil1,
                            result: I1lI1ll1,
                        });
                    }, 0);
                });
            }),
            il1iIiil = await Promise.all(l1ll1lIl);
        il1iIiil.sort((Ii1IlIII, liIiI1II) => Ii1IlIII.index - liIiI1II.index);
        this.cookie_all_obj = il1iIiil.map((l1IiiI) => l1IiiI.result);
    }
    static async ["run"](lilIiIii) {
        this.envCheck(lilIiIii);
        this.activity.activityUrl && console.log("活动链接：", this.activity.activityUrl);
        let lIlll1 = this.cookieInit(),
            Il1IiiII = lIlll1[0],
            Ii11Iii = lIlll1[1];
        console.log("原始ck长度", Il1IiiII.length);
        const Il1lIli1 = wxWhitelist?.["length"] > 0 ? wxWhitelist : lilIiIii?.["whitelist"];
        if (Il1lIli1?.["length"] > 0) {
            let lIiliIll = [];
            for (const iiiIil11 of this.__as(Il1lIli1)) {
                iiiIil11 - 1 < Il1IiiII.length && lIiliIll.push(Il1IiiII[iiiIil11 - 1]);
            }
            Il1IiiII = lIiliIll;
        }
        console.log("设置白名单后ck长度", Il1IiiII.length);
        try {
            if (process.env.B_WX_BLOCK_PIN_REGX) {
                const I1lIiIli = process.env.B_WX_BLOCK_PIN_REGX.split(";");
                for (let IIl1IIIl of I1lIiIli) {
                    const Ii1IIll = IIl1IIIl.split("@"),
                        II1IlI11 = Ii1IIll[0],
                        I1I1llI = Ii1IIll[1].split("|"),
                        l1Ii1Ili = this.activity?.["activityUrl"]?.["match"](II1IlI11);
                    l1Ii1Ili &&
                        (Il1IiiII = Il1IiiII.filter((l1iiIi1I) => {
                            if (I1I1llI.some((i1i1111) => l1iiIi1I.includes(i1i1111))) return false;
                            return true;
                        }));
                }
            }
        } catch (liiil11) {
            this.log("排除黑名单Error", liiil11);
        }
        console.log("排除PIN黑名单后ck长度", Il1IiiII.length);
        this.cookies = Il1IiiII;
        this.cookieLength = Il1IiiII.length;
        this.inviteCookieLength = Ii11Iii.length;
        this.paddedStringEndCount = "cookie".length + String(this.cookieLength).length;
        if (this.cookieLength === 0) return this.log("没有可运行的ck");
        this.runActInfo();
        this.proxy = new i11ilIi1(this.activity.activityUrl);
        wxProxyEnable === 2 && wxProxySmart === 2 && this.proxy.updateProxyEnable(true);
        this.cookie_all_obj = this.cookies.map((lI1IlIi, iIi1IIl1) => {
            return new this.TaskClass(iIi1IIl1, lI1IlIi);
        });
        let iIIili11 = Ii11Iii.map((lIIIIIiI, il1iIiI) => {
            let lIIIIil = new this.TaskClass(il1iIiI + this.cookie_all_obj.length, lIIIIIiI);
            return (lIIIIil.onlyInvite = true), lIIIIil;
        });
        this.cookie_all_obj.push(...iIIili11);
        const lllIII1l = Date.now();
        try {
            if (Ili1II1i === 1 && !lilIiIii?.["inviteTask"])
                try {
                    await this.get_mains_obj().userTask();
                } catch (l111i1Ii) {
                    if (l111i1Ii instanceof il1iii1I) this.running = false;
                    else {
                        if (l111i1Ii instanceof II1i1l1I) {
                        } else this.log(l111i1Ii.message || l111i1Ii);
                    }
                }
            const il1l11ii = [];
            for (let ii1lilll = 0; ii1lilll < Math.min(this.cookie_all_obj.length, lilIiIii?.["main_thread"] || 1); ii1lilll++) {
                il1l11ii.push(() => this.async_thread(ii1lilll, lilIiIii));
            }
            let I111iil = lilIiIii?.["enableDynamic"] || false;
            I111iil && (this.concurrencyLimit = lilIiIii?.["main_thread"] || 1);
            await this.runTasksConcurrentlyWithDelay(il1l11ii, lilIiIii?.["main_thread"] || 1, 20, I111iil);
        } catch (iiiil11i) {
            iiiil11i instanceof il1iii1I && (this.running = false);
        }
        this.proxy.stopSwitching();
        const I1i1iIiI = Date.now(),
            ii1I1li = (Math.abs(I1i1iIiI - lllIII1l) / 1000).toFixed(2);
        console.log("" + iilIiI1.envInfo.name, "运行结束,耗时" + (I1i1iIiI - lllIII1l) + "ms");
        const il1ilII1 = [() => this.notify(ii1I1li, lilIiIii), () => this.sendTimeNotify(), ...this.sendNotifyToUser()];
        await this.runTasksConcurrentlyWithDelay(il1ilII1, il1ilII1.length, 10, false, false);
        process.exit(0);
    }
}
module.exports = {
    UserMode: i1lI1lIi,
    RunMode: iilIiI1,
    CryptoJS: liIiI11,
};
