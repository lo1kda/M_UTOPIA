const iIiilI = require("fs"),
    iIiiil = require("jsdom");
class iIiiii {
    constructor() {
        this.domWindow3_1 = null;
        this.domWindow3_1_UA = null;
        this.domWindow4_1 = null;
        this.domWindow4_1_UA = null;
        this.domWindow4_2 = null;
        this.domWindow4_2_UA = null;
        this.domWindow4_3 = null;
        this.domWindow4_3_UA = null;
        this.domWindow4_4 = null;
        this.domWindow4_4_UA = null;
        this.domWindow4_7 = null;
        this.domWindow4_7_UA = null;
    }
    async _sleep(l1lI1I) {
        return new Promise((lilil1, lIilli) => {
            setTimeout(() => {
                lilil1(l1lI1I);
            }, l1lI1I);
        });
    }
    async _loadH5Sdk(Illll1, lI1iil) {
        const { JSDOM: iIiiiI } = iIiiil;
        let ilI11i = new iIiiil.ResourceLoader({
                userAgent: lI1iil,
            }),
            ilI11l = new iIiiil.VirtualConsole(),
            li1I = {
                url: "http://localhost",
                userAgent: lI1iil,
                runScripts: "dangerously",
                resources: ilI11i,
                includeNodeLocations: true,
                storageQuota: 1000000000,
                pretendToBeVisual: true,
                virtualConsole: ilI11l,
            },
            IIliil = "";
        switch (Illll1) {
            case "3.1":
                IIliil = "<script>" + iIiilI.readFileSync(__dirname + "/assets/h5_3_1_src.js", "utf-8") + "</script>";
                break;
            case "4.1":
                IIliil = "<script>" + iIiilI.readFileSync(__dirname + "/assets/h5_4_1_src.js", "utf-8") + "</script>";
                break;
            case "4.2":
                IIliil = "<script>" + iIiilI.readFileSync(__dirname + "/assets/h5_4_2_src.js", "utf-8") + "</script>";
                break;
            case "4.3":
                IIliil = "<script>" + iIiilI.readFileSync(__dirname + "/assets/h5_4_3_src.js", "utf-8") + "</script>";
                break;
            case "4.4":
                IIliil = "<script>" + iIiilI.readFileSync(__dirname + "/assets/h5_4_4_src.js", "utf-8") + "</script>";
                break;
            case "4.7":
                IIliil = "<script>" + iIiilI.readFileSync(__dirname + "/assets/h5_4_7_src.js", "utf-8") + "</script>";
                break;
        }
        const ll1liI = new iIiiiI("<body>\n    " + IIliil + "\n</body>", li1I);
        do {
            await this._sleep(100);
        } while (!ll1liI.window.ParamsSign);
        switch (Illll1) {
            case "3.1":
                this.domWindow3_1 = ll1liI.window;
                break;
            case "4.1":
                this.domWindow4_1 = ll1liI.window;
                break;
            case "4.2":
                this.domWindow4_2 = ll1liI.window;
                break;
            case "4.3":
                this.domWindow4_3 = ll1liI.window;
                break;
            case "4.4":
                this.domWindow4_4 = ll1liI.window;
                break;
            case "4.7":
                this.domWindow4_7 = ll1liI.window;
                break;
        }
    }
    async _signWaap(iIIlli, ll1li1, iIIlll) {
        const iiI1il = new iIIlll.ParamsSign({
            appId: iIIlli,
            preRequest: false,
            debug: false,
            onSign({ code: I1Illl, message: ll1lii, data: li11 }) {},
            onRequestTokenRemotely({ code: ilIlI1, message: I1Illi }) {},
            onRequestToken({ code: IIlilI, message: Illlll }) {},
        });
        let iiI1ii = {
            appid: ll1li1.appid,
            body: this._SHA256(JSON.stringify(ll1li1.body)).toString(),
            client: ll1li1.client,
            clientVersion: ll1li1.clientVersion,
            functionId: ll1li1.functionId,
        };
        ll1li1?.["t"] && (iiI1ii.t = ll1li1.t);
        let I1iii1 = await iiI1il.sign(iiI1ii);
        (!I1iii1?.["h5st"] || I1iii1.h5st === "null") && (console.log("❌ getH5st 签名生成失败"), (I1iii1.h5st = ""));
        return I1iii1?.["h5st"] || "";
    }
    async getH5st(llli1l) {
        let llli1i = {
            ...llli1l,
            h5st: "",
            params: "",
        };
        try {
            if (!(typeof llli1l === "object" && llli1l !== null)) {
                console.log("❌ getH5st 传入参数有误");
                return llli1i;
            } else {
                const lIilii = ["appId", "appid", "body", "client", "clientVersion", "functionId"],
                    lIilil = lIilii.filter((lIl1ll) => !llli1l[lIl1ll]);
                if (lIilil.length > 0) {
                    console.log("❌ getH5st 传入参数有误，缺少必要参数：" + lIilil.join(", "));
                    return llli1i;
                }
            }
            switch (llli1l?.["version"]) {
                case "3.1":
                case "4.1":
                case "4.2":
                case "4.3":
                case "4.4":
                case "4.7":
                    break;
                default:
                    llli1l.version = "4.1";
                    break;
            }
            const { appId: lililI, appid: lI1ill, body: Illlii, client: lI1ili, clientVersion: Il1II, functionId: i1lll, version: Ii11I } = llli1l,
                I1iill = Math.floor(Date.now() / 1000),
                i1lli =
                    "jdapp;iPhone;12.2.0;;rn/a5e53b61-94a0-da77-7e2f-fda45564911e;M/5.0;appBuild/168919;jdSupportDarkMode/0;ef/1;ep/%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22ud%22%3A%22DG%3D%3D%22%2C%22sv%22%3A%22CG%3D%3D%22%2C%22iad%22%3A%22%22%7D%2C%22ts%22%3A" +
                    I1iill +
                    "%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D;Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;",
                i11111 = llli1l?.["ua"] || i1lli;
            switch (Ii11I) {
                case "3.1":
                    (!this.domWindow3_1 || (this.domWindow3_1_UA && this.domWindow3_1_UA !== i11111)) &&
                        (await this._loadH5Sdk(Ii11I, i11111), (this.domWindow3_1_UA = i11111));
                    break;
                case "4.1":
                    (!this.domWindow4_1 || (this.domWindow4_1_UA && this.domWindow4_1_UA !== i11111)) &&
                        (await this._loadH5Sdk(Ii11I, i11111), (this.domWindow4_1_UA = i11111));
                    break;
                case "4.2":
                    (!this.domWindow4_2 || (this.domWindow4_2_UA && this.domWindow4_2_UA !== i11111)) &&
                        (await this._loadH5Sdk(Ii11I, i11111), (this.domWindow4_2_UA = i11111));
                    break;
                case "4.3":
                    (!this.domWindow4_3 || (this.domWindow4_3_UA && this.domWindow4_3_UA !== i11111)) &&
                        (await this._loadH5Sdk(Ii11I, i11111), (this.domWindow4_3_UA = i11111));
                    break;
                case "4.4":
                    (!this.domWindow4_4 || (this.domWindow4_4_UA && this.domWindow4_4_UA !== i11111)) &&
                        (await this._loadH5Sdk(Ii11I, i11111), (this.domWindow4_4_UA = i11111));
                    break;
                case "4.7":
                    (!this.domWindow4_7 || (this.domWindow4_7_UA && this.domWindow4_7_UA !== i11111)) &&
                        (await this._loadH5Sdk(Ii11I, i11111), (this.domWindow4_7_UA = i11111));
                    break;
            }
            llli1l?.["t"] && typeof llli1l.t === "boolean" ? ((llli1l.t = Date.now()), (llli1i.t = llli1l.t)) : (llli1l.t = "");
            llli1i.params =
                "functionId=" +
                i1lll +
                "&body=" +
                encodeURIComponent(JSON.stringify(Illlii)) +
                (llli1l?.["t"] ? "&t=" + llli1l.t : "") +
                "&appid=" +
                lI1ill +
                "&client=" +
                lI1ili +
                "&clientVersion=" +
                Il1II +
                "&h5st=";
            let lIl1li = "";
            switch (Ii11I) {
                case "3.1":
                    lIl1li = await this._signWaap(lililI, llli1l, this.domWindow3_1);
                    break;
                case "4.1":
                    lIl1li = await this._signWaap(lililI, llli1l, this.domWindow4_1);
                    break;
                case "4.2":
                    lIl1li = await this._signWaap(lililI, llli1l, this.domWindow4_2);
                    break;
                case "4.3":
                    lIl1li = await this._signWaap(lililI, llli1l, this.domWindow4_3);
                    break;
                case "4.4":
                    lIl1li = await this._signWaap(lililI, llli1l, this.domWindow4_4);
                    break;
                case "4.7":
                    lIl1li = await this._signWaap(lililI, llli1l, this.domWindow4_7);
                    break;
            }
            llli1i.h5st = lIl1li || "";
            llli1i.params += lIl1li || "";
            return llli1i;
        } catch (l111l) {
            console.log("❌ getH5st 遇到了错误 " + (l111l.message || l111l));
        }
        return llli1i;
    }
    _SHA256(Ii1II1) {
        var IliIli = 8,
            lI1ilI = 0;
        function IllliI(Ili111, Il11) {
            var iiil11 = (Ili111 & 65535) + (Il11 & 65535),
                llII1I = (Ili111 >> 16) + (Il11 >> 16) + (iiil11 >> 16);
            return (llII1I << 16) | (iiil11 & 65535);
        }
        function IliIll(ilI1II, iillI1) {
            return (ilI1II >>> iillI1) | (ilI1II << (32 - iillI1));
        }
        function iIiili(ll11II, liIlII) {
            return ll11II >>> liIlII;
        }
        function lilill(ii1i1I, liIlI1, iillIl) {
            return (ii1i1I & liIlI1) ^ (~ii1i1I & iillIl);
        }
        function IilI1(IiIi1I, iillIi, iii11) {
            return (IiIi1I & iillIi) ^ (IiIi1I & iii11) ^ (iillIi & iii11);
        }
        function l1lI1(iliI1) {
            return IliIll(iliI1, 2) ^ IliIll(iliI1, 13) ^ IliIll(iliI1, 22);
        }
        function Ili1I1(i11iI) {
            return IliIll(i11iI, 6) ^ IliIll(i11iI, 11) ^ IliIll(i11iI, 25);
        }
        function lI1I1i(ii1i1l) {
            return IliIll(ii1i1l, 7) ^ IliIll(ii1i1l, 18) ^ iIiili(ii1i1l, 3);
        }
        function liI1II(liIlIi) {
            return IliIll(liIlIi, 17) ^ IliIll(liIlIi, 19) ^ iIiili(liIlIi, 10);
        }
        function i1Iii1(I1lI1l, i11ii) {
            var lIiIi = new Array(
                    1116352408,
                    1899447441,
                    3049323471,
                    3921009573,
                    961987163,
                    1508970993,
                    2453635748,
                    2870763221,
                    3624381080,
                    310598401,
                    607225278,
                    1426881987,
                    1925078388,
                    2162078206,
                    2614888103,
                    3248222580,
                    3835390401,
                    4022224774,
                    264347078,
                    604807628,
                    770255983,
                    1249150122,
                    1555081692,
                    1996064986,
                    2554220882,
                    2821834349,
                    2952996808,
                    3210313671,
                    3336571891,
                    3584528711,
                    113926993,
                    338241895,
                    666307205,
                    773529912,
                    1294757372,
                    1396182291,
                    1695183700,
                    1986661051,
                    2177026350,
                    2456956037,
                    2730485921,
                    2820302411,
                    3259730800,
                    3345764771,
                    3516065817,
                    3600352804,
                    4094571909,
                    275423344,
                    430227734,
                    506948616,
                    659060556,
                    883997877,
                    958139571,
                    1322822218,
                    1537002063,
                    1747873779,
                    1955562222,
                    2024104815,
                    2227730452,
                    2361852424,
                    2428436474,
                    2756734187,
                    3204031479,
                    3329325298
                ),
                Il1i = new Array(1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225),
                lIiIl = new Array(64),
                iiil1l,
                Il1l,
                ll11I1,
                Illll,
                iiil1i,
                ilIIli,
                ilIIll,
                iIliil,
                IIiill,
                liIIii,
                Iii1lI,
                I1liii;
            I1lI1l[i11ii >> 5] |= 128 << (24 - (i11ii % 32));
            I1lI1l[(((i11ii + 64) >> 9) << 4) + 15] = i11ii;
            for (var IIiill = 0; IIiill < I1lI1l.length; IIiill += 16) {
                iiil1l = Il1i[0];
                Il1l = Il1i[1];
                ll11I1 = Il1i[2];
                Illll = Il1i[3];
                iiil1i = Il1i[4];
                ilIIli = Il1i[5];
                ilIIll = Il1i[6];
                iIliil = Il1i[7];
                for (var liIIii = 0; liIIii < 64; liIIii++) {
                    if (liIIii < 16) {
                        lIiIl[liIIii] = I1lI1l[liIIii + IIiill];
                    } else {
                        lIiIl[liIIii] = IllliI(
                            IllliI(IllliI(liI1II(lIiIl[liIIii - 2]), lIiIl[liIIii - 7]), lI1I1i(lIiIl[liIIii - 15])),
                            lIiIl[liIIii - 16]
                        );
                    }
                    Iii1lI = IllliI(IllliI(IllliI(IllliI(iIliil, Ili1I1(iiil1i)), lilill(iiil1i, ilIIli, ilIIll)), lIiIi[liIIii]), lIiIl[liIIii]);
                    I1liii = IllliI(l1lI1(iiil1l), IilI1(iiil1l, Il1l, ll11I1));
                    iIliil = ilIIll;
                    ilIIll = ilIIli;
                    ilIIli = iiil1i;
                    iiil1i = IllliI(Illll, Iii1lI);
                    Illll = ll11I1;
                    ll11I1 = Il1l;
                    Il1l = iiil1l;
                    iiil1l = IllliI(Iii1lI, I1liii);
                }
                Il1i[0] = IllliI(iiil1l, Il1i[0]);
                Il1i[1] = IllliI(Il1l, Il1i[1]);
                Il1i[2] = IllliI(ll11I1, Il1i[2]);
                Il1i[3] = IllliI(Illll, Il1i[3]);
                Il1i[4] = IllliI(iiil1i, Il1i[4]);
                Il1i[5] = IllliI(ilIIli, Il1i[5]);
                Il1i[6] = IllliI(ilIIll, Il1i[6]);
                Il1i[7] = IllliI(iIliil, Il1i[7]);
            }
            return Il1i;
        }
        function l1liii(IliIi1) {
            var liiiIl = Array(),
                liIIiI = (1 << IliIli) - 1;
            for (var Iii1li = 0; Iii1li < IliIi1.length * IliIli; Iii1li += IliIli) {
                liiiIl[Iii1li >> 5] |= (IliIi1.charCodeAt(Iii1li / IliIli) & liIIiI) << (24 - (Iii1li % 32));
            }
            return liiiIl;
        }
        function I1Ili1(IIiilI) {
            IIiilI = IIiilI.replace(/\r\n/g, "\n");
            var ilIIlI = "";
            for (var liiiI1 = 0; liiiI1 < IIiilI.length; liiiI1++) {
                var iIl11 = IIiilI.charCodeAt(liiiI1);
                if (iIl11 < 128) {
                    ilIIlI += String.fromCharCode(iIl11);
                } else {
                    iIl11 > 127 && iIl11 < 2048
                        ? ((ilIIlI += String.fromCharCode((iIl11 >> 6) | 192)), (ilIIlI += String.fromCharCode((iIl11 & 63) | 128)))
                        : ((ilIIlI += String.fromCharCode((iIl11 >> 12) | 224)),
                          (ilIIlI += String.fromCharCode(((iIl11 >> 6) & 63) | 128)),
                          (ilIIlI += String.fromCharCode((iIl11 & 63) | 128)));
                }
            }
            return ilIIlI;
        }
        function l1liil(ii11) {
            var liIIil = lI1ilI ? "0123456789ABCDEF" : "0123456789abcdef",
                liI1 = "";
            for (var IliIiI = 0; IliIiI < ii11.length * 4; IliIiI++) {
                liI1 +=
                    liIIil.charAt((ii11[IliIiI >> 2] >> ((3 - (IliIiI % 4)) * 8 + 4)) & 15) +
                    liIIil.charAt((ii11[IliIiI >> 2] >> ((3 - (IliIiI % 4)) * 8)) & 15);
            }
            return liI1;
        }
        Ii1II1 = I1Ili1(Ii1II1);
        return l1liil(i1Iii1(l1liii(Ii1II1), Ii1II1.length * IliIli));
    }
}
module.exports = new iIiiii();
