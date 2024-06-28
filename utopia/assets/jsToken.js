const axios = require("axios");
const querystring = require("querystring");
function encrypt(msg) {
    const charset = "23IL<N01c7KvwZO56RSTAfghiFyzWJqVabGH4PQdopUrsCuX*xeBjkltDEmn89.-";
    let r = encodeURIComponent(JSON.stringify(msg));
    var t = "",
        a = 0;
    do {
        var c = r.charCodeAt(a++),
            e = r.charCodeAt(a++),
            h = r.charCodeAt(a++),
            n = c >> 2;
        c = ((3 & c) << 4) | (e >> 4);
        var o = ((15 & e) << 2) | (h >> 6),
            A = 63 & h;
        isNaN(e) ? (o = A = 64) : isNaN(h) && (A = 64), (t = t + charset.charAt(n) + charset.charAt(c) + charset.charAt(o) + charset.charAt(A));
    } while (a < r.length);
    return t + "/";
}
function x64Add(j, k) {
    j = [j[0] >>> 16, 65535 & j[0], j[1] >>> 16, 65535 & j[1]];
    k = [k[0] >>> 16, 65535 & k[0], k[1] >>> 16, 65535 & k[1]];
    var g = [0, 0, 0, 0];
    g[3] += j[3] + k[3];
    g[2] += g[3] >>> 16;
    g[3] &= 65535;
    g[2] += j[2] + k[2];
    g[1] += g[2] >>> 16;
    g[2] &= 65535;
    g[1] += j[1] + k[1];
    g[0] += g[1] >>> 16;
    g[1] &= 65535;
    g[0] += j[0] + k[0];
    g[0] &= 65535;
    return [(g[0] << 16) | g[1], (g[2] << 16) | g[3]];
}
function x64Multiply(j, k) {
    j = [j[0] >>> 16, 65535 & j[0], j[1] >>> 16, 65535 & j[1]];
    k = [k[0] >>> 16, 65535 & k[0], k[1] >>> 16, 65535 & k[1]];
    var g = [0, 0, 0, 0];
    g[3] += j[3] * k[3];
    g[2] += g[3] >>> 16;
    g[3] &= 65535;
    g[2] += j[2] * k[3];
    g[1] += g[2] >>> 16;
    g[2] &= 65535;
    g[2] += j[3] * k[2];
    g[1] += g[2] >>> 16;
    g[2] &= 65535;
    g[1] += j[1] * k[3];
    g[0] += g[1] >>> 16;
    g[1] &= 65535;
    g[1] += j[2] * k[2];
    g[0] += g[1] >>> 16;
    g[1] &= 65535;
    g[1] += j[3] * k[1];
    g[0] += g[1] >>> 16;
    g[1] &= 65535;
    g[0] += j[0] * k[3] + j[1] * k[2] + j[2] * k[1] + j[3] * k[0];
    g[0] &= 65535;
    return [(g[0] << 16) | g[1], (g[2] << 16) | g[3]];
}
function x64Rotl(g, i) {
    return 32 == (i %= 64)
        ? [g[1], g[0]]
        : i < 32
        ? [(g[0] << i) | (g[1] >>> (32 - i)), (g[1] << i) | (g[0] >>> (32 - i))]
        : ((i -= 32), [(g[1] << i) | (g[0] >>> (32 - i)), (g[0] << i) | (g[1] >>> (32 - i))]);
}
function x64LeftShift(g, i) {
    return 0 == (i %= 64) ? g : i < 32 ? [(g[0] << i) | (g[1] >>> (32 - i)), g[1] << i] : [g[1] << (i - 32), 0];
}
function x64Xor(g, i) {
    return [g[0] ^ i[0], g[1] ^ i[1]];
}
function x64Fmix(g) {
    g = x64Xor(g, [0, g[0] >>> 1]);
    g = x64Multiply(g, [4283543511, 3981806797]);
    g = x64Xor(g, [0, g[0] >>> 1]);
    g = x64Multiply(g, [3301882366, 444984403]);
    return (g = x64Xor(g, [0, g[0] >>> 1]));
}
function x64hash128(v, l) {
    v = v || "";
    l = l || 0;
    for (
        var k = v.length % 16,
            w = v.length - k,
            g = [0, l],
            j = [0, l],
            m = [0, 0],
            u = [0, 0],
            p = [2277735313, 289559509],
            q = [1291169091, 658871167],
            n = 0;
        n < w;
        n += 16
    ) {
        m = [
            (255 & v.charCodeAt(n + 4)) |
                ((255 & v.charCodeAt(n + 5)) << 8) |
                ((255 & v.charCodeAt(n + 6)) << 16) |
                ((255 & v.charCodeAt(n + 7)) << 24),
            (255 & v.charCodeAt(n)) | ((255 & v.charCodeAt(n + 1)) << 8) | ((255 & v.charCodeAt(n + 2)) << 16) | ((255 & v.charCodeAt(n + 3)) << 24),
        ];
        u = [
            (255 & v.charCodeAt(n + 12)) |
                ((255 & v.charCodeAt(n + 13)) << 8) |
                ((255 & v.charCodeAt(n + 14)) << 16) |
                ((255 & v.charCodeAt(n + 15)) << 24),
            (255 & v.charCodeAt(n + 8)) |
                ((255 & v.charCodeAt(n + 9)) << 8) |
                ((255 & v.charCodeAt(n + 10)) << 16) |
                ((255 & v.charCodeAt(n + 11)) << 24),
        ];
        m = x64Multiply(m, p);
        m = x64Rotl(m, 31);
        m = x64Multiply(m, q);
        g = x64Xor(g, m);
        g = x64Rotl(g, 27);
        g = x64Add(g, j);
        g = x64Add(x64Multiply(g, [0, 5]), [0, 1390208809]);
        u = x64Multiply(u, q);
        u = x64Rotl(u, 33);
        u = x64Multiply(u, p);
        j = x64Xor(j, u);
        j = x64Rotl(j, 31);
        j = x64Add(j, g);
        j = x64Add(x64Multiply(j, [0, 5]), [0, 944331445]);
    }
    switch (((m = [0, 0]), (u = [0, 0]), k)) {
        case 15:
            u = x64Xor(u, x64LeftShift([0, v.charCodeAt(n + 14)], 48));
        case 14:
            u = x64Xor(u, x64LeftShift([0, v.charCodeAt(n + 13)], 40));
        case 13:
            u = x64Xor(u, x64LeftShift([0, v.charCodeAt(n + 12)], 32));
        case 12:
            u = x64Xor(u, x64LeftShift([0, v.charCodeAt(n + 11)], 24));
        case 11:
            u = x64Xor(u, x64LeftShift([0, v.charCodeAt(n + 10)], 16));
        case 10:
            u = x64Xor(u, x64LeftShift([0, v.charCodeAt(n + 9)], 8));
        case 9:
            u = x64Xor(u, [0, v.charCodeAt(n + 8)]);
            u = x64Multiply(u, q);
            u = x64Rotl(u, 33);
            u = x64Multiply(u, p);
            j = x64Xor(j, u);
        case 8:
            m = x64Xor(m, x64LeftShift([0, v.charCodeAt(n + 7)], 56));
        case 7:
            m = x64Xor(m, x64LeftShift([0, v.charCodeAt(n + 6)], 48));
        case 6:
            m = x64Xor(m, x64LeftShift([0, v.charCodeAt(n + 5)], 40));
        case 5:
            m = x64Xor(m, x64LeftShift([0, v.charCodeAt(n + 4)], 32));
        case 4:
            m = x64Xor(m, x64LeftShift([0, v.charCodeAt(n + 3)], 24));
        case 3:
            m = x64Xor(m, x64LeftShift([0, v.charCodeAt(n + 2)], 16));
        case 2:
            m = x64Xor(m, x64LeftShift([0, v.charCodeAt(n + 1)], 8));
        case 1:
            m = x64Xor(m, [0, v.charCodeAt(n)]);
            m = x64Multiply(m, p);
            m = x64Rotl(m, 31);
            m = x64Multiply(m, q);
            g = x64Xor(g, m);
    }
    g = x64Xor(g, [0, v.length]);
    j = x64Xor(j, [0, v.length]);
    g = x64Add(g, j);
    j = x64Add(j, g);
    g = x64Fmix(g);
    j = x64Fmix(j);
    g = x64Add(g, j);
    j = x64Add(j, g);
    return (
        (g[0] >>> 0).toString(16).padStart(8, "0") +
        (g[1] >>> 0).toString(16).padStart(8, "0") +
        (j[0] >>> 0).toString(16).padStart(8, "0") +
        (j[1] >>> 0).toString(16).padStart(8, "0")
    );
}
async function jsToken(UA, cookie) {
    let fp_param = [
        UA.slice(0, Math.min(UA.length, 90)),
        "zh-CN",
        "applewebkit_chrome",
        "605.1.15",
        "NA",
        "NA",
        32,
        "896x414",
        -480,
        "sessionStorageKey",
        "localStorageKey",
        "indexedDbKey",
        "openDatabase",
        "NA",
        "iPhone",
        10,
        "NA",
        "",
        null,
        null,
    ];
    let s1_param = {
        pin: "",
        oid: "",
        bizId: "JD-DCHD",
        fc: "",
        mode: "strict",
        p: "s",
        fp: x64hash128(fp_param.join("~~~"), 31),
        ctype: 1,
        v: "3.1.1.0",
        f: "3",
        o: "wbbny.m.jd.com/pb/014710620/mTPLZGkAcayB5UvZ6uZCtL3M6ca/index.html#/pages/home/index/index",
        qs: "",
        jsTk: "",
        qi: "",
    };
    let s2_param = {
        ts: {
            deviceTime: Date.now(),
            deviceEndTime: Date.now() + Math.floor(Math.random() * 10) + 2,
        },
        ca: {
            tdHash: null,
        },
        m: {
            compatMode: "CSS1Compat",
        },
        fo: ["Arial Black", "Bauhaus 93", "Chalkduster", "GungSeo", "Hiragino Sans GB", "Impact", "Menlo", "Papyrus", "Rockwell"],
        n: {
            vendorSub: "",
            productSub: "20030107",
            vendor: "Apple Computer, Inc.",
            maxTouchPoints: 1,
            pdfViewerEnabled: !1,
            hardwareConcurrency: 10,
            cookieEnabled: !0,
            appCodeName: "Mozilla",
            appName: "Netscape",
            appVersion: (/\/(.+)/g.exec(UA) && /\/(.+)/g.exec(UA)[1]) || UA,
            platform: "iPhone",
            product: "Gecko",
            userAgent: UA,
            language: "zh-CN",
            onLine: !0,
            webdriver: !1,
            javaEnabled: !1,
            deviceMemory: 8,
            enumerationOrder: [
                "vendorSub",
                "productSub",
                "vendor",
                "maxTouchPoints",
                "scheduling",
                "userActivation",
                "doNotTrack",
                "geolocation",
                "connection",
                "plugins",
                "mimeTypes",
                "pdfViewerEnabled",
                "webkitTemporaryStorage",
                "webkitPersistentStorage",
                "hardwareConcurrency",
                "cookieEnabled",
                "appCodeName",
                "appName",
                "appVersion",
                "platform",
                "product",
                "userAgent",
                "language",
                "languages",
                "onLine",
                "webdriver",
                "getGamepads",
                "javaEnabled",
                "sendBeacon",
                "vibrate",
                "bluetooth",
                "clipboard",
                "credentials",
                "keyboard",
                "managed",
                "mediaDevices",
                "storage",
                "serviceWorker",
                "virtualKeyboard",
                "wakeLock",
                "deviceMemory",
                "ink",
                "hid",
                "locks",
                "mediaCapabilities",
                "mediaSession",
                "permissions",
                "presentation",
                "serial",
                "gpu",
                "usb",
                "windowControlsOverlay",
                "xr",
                "userAgentData",
                "clearAppBadge",
                "getBattery",
                "getUserMedia",
                "requestMIDIAccess",
                "requestMediaKeySystemAccess",
                "setAppBadge",
                "webkitGetUserMedia",
                "getInstalledRelatedApps",
                "registerProtocolHandler",
                "unregisterProtocolHandler",
            ],
        },
        p: [],
        w: {
            devicePixelRatio: 1,
            screenTop: 0,
            screenLeft: 0,
        },
        s: {
            availHeight: 896,
            availWidth: 414,
            colorDepth: 24,
            height: 896,
            width: 414,
            pixelDepth: 24,
        },
        sc: {
            ActiveBorder: "rgb(118, 118, 118)",
            ActiveCaption: "rgb(0, 0, 0)",
            AppWorkspace: "rgb(255, 255, 255)",
            Background: "rgb(255, 255, 255)",
            ButtonFace: "rgb(239, 239, 239)",
            ButtonHighlight: "rgb(239, 239, 239)",
            ButtonShadow: "rgb(239, 239, 239)",
            ButtonText: "rgb(0, 0, 0)",
            CaptionText: "rgb(0, 0, 0)",
            GrayText: "rgb(128, 128, 128)",
            Highlight: "rgb(181, 213, 255)",
            HighlightText: "rgb(0, 0, 0)",
            InactiveBorder: "rgb(118, 118, 118)",
            InactiveCaption: "rgb(255, 255, 255)",
            InactiveCaptionText: "rgb(128, 128, 128)",
            InfoBackground: "rgb(255, 255, 255)",
            InfoText: "rgb(0, 0, 0)",
            Menu: "rgb(255, 255, 255)",
            MenuText: "rgb(0, 0, 0)",
            Scrollbar: "rgb(255, 255, 255)",
            ThreeDDarkShadow: "rgb(118, 118, 118)",
            ThreeDFace: "rgb(239, 239, 239)",
            ThreeDHighlight: "rgb(118, 118, 118)",
            ThreeDLightShadow: "rgb(118, 118, 118)",
            ThreeDShadow: "rgb(118, 118, 118)",
            Window: "rgb(255, 255, 255)",
            WindowFrame: "rgb(118, 118, 118)",
            WindowText: "rgb(0, 0, 0)",
        },
        ss: {
            cookie: !0,
            localStorage: !0,
            sessionStorage: !0,
            globalStorage: !1,
            indexedDB: !0,
        },
        tz: -480,
        lil: "",
        wil: "",
    };
    let s1 = encrypt(s1_param);
    let s2 = encrypt(s2_param);
    var opt = {
        method: "post",
        url: `https://gia.jd.com/jsTk.do?a=${encodeURIComponent(s1)}`,
        headers: {
            Host: "gia.jd.com",
            Connection: "keep-alive",
            "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
            Accept: "*/*",
            Origin: "https://pro.m.jd.com",
            "X-Requested-With": "com.jd.jdlite",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "https://pro.m.jd.com/jdlite/active/23CeE8ZXA4uFS9M9mTjtta9T4S5x/index.html?babelChannel=ttt6",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            Cookie: cookie + ";cid=8;", //sid={self.sha};+ getBaseCookie()
            "User-Agent": UA,
        },
        data: querystring.stringify({ d: encodeURIComponent(s2) }),
    };
    try {
        const response = await axios(opt);
        if (response.data && response.data.code === 0) {
            return response.data.data;
        } else {
            console.error("Error:", response.data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
module.exports = { jsToken };
