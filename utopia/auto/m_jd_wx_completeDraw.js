let mode = __dirname.includes("Work");
const { Env, cheerio } = require("../utopia");
const $ = new Env("M完善有礼");
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_COMPLETE_DRAW_URL);
if (mode) {
    $.activityUrl =
        "https://cjhy-isv.isvjcloud.com/wx/completeInfoActivity/view/activity?activityId=009b8d77c8af40bd9ad3cbc7c9e09cf3&venderId=1000089246";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10049&templateId=20210720190900wsxxyl011&activityId=1622897703159136257&nodeId=101001009&prd=cjwx&shareuserid4minipg=ixaKACMHzt107D3uPA8WcPkaL5GGqMTUc8u/otw2E+a7Ak3lgFoFQlZmf45w8Jzw&shopid=1000392887";
    $.activityUrl = "https://jinggeng-isv.isvjcloud.com/ql/front/showPerfectInformation?id=9e80805a8905676301890ce7606717f6&user_id=1000121005";
    $.activityUrl = "https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v2/10049/1002/?activityId=1752215214774620162&shopId=1000088382";
    $.activityUrl =
        "https://cjhy-isv.isvjcloud.com/wx/completeInfoActivity/view/activity?activityId=162dc72596d2418c9b141b103b7b62fb&venderId=1000374674";
    $.activityUrl = "https://jinggeng-rc.isvjcloud.com/ql/front/showPerfectInformation?id=9e8080478f2dbc75018f2e6e473f0389&user_id=1000167901";
    $.activityUrl =
        "https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10049&activityId=1773303944642351106&templateId=20210720190900wsxxyl011&nodeId=101001009&prd=cjwx";
    $.maxCookie = 1;
}
const names =
    "赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康".split(
        ""
    );
const phones =
    "13969023158@13789265347@13827195843@13105243798@13285217694@13810579842@18116850374@13957864013@18248527690@13218594367@18231025689@13795783126@18189607415@13158920361@13345937082@18046701523@13202613475@13908473691@13982147693@13920641735@18141893057@13786245370@13985634170@18123860451@18006837241@13712739086@13267203458@18131259064@13123049176@13328631504@13316720958@13802876945@13761723409@18296534180@13235129706@13916325740@18013258649@13768034759@18151237689@18214065739@13991643258@13969728354@18006234875@13956719043@13775604931@13141975826@13126179534@13360259417@13853924680@13862843095@13213902846@18223896540@13107952861@13285967423@13283140752@18045376298@13793865107@18202639415@18289063741@13160745381@18187594620@13247985610@13131708452@13379038615@13238671259@13334879512@13280243716@13210279853@13912964503@13842570813@13784275903@18016387205@13171365940@13764257381@18261043275@13878536049@13387542319@18163054927@13135497821@18090163487@13162073189@13809168374@18093186240@13262938514@18093571682@13361235094@13912067385@18172849601@18279628310@18247389526@13879463502@18147396150@13839072458@13903624971@18047301895@13934287591@13263475819@13364895023@13790357184@18139740182".split(
        "@"
    );
$.version = "v1.0.0";
class Task extends Env {
    constructor() {
        super();
    }
    async getPrizeList(context) {
        if (this.isV2Act) {
            let prizes = await this.api(`/api/${this.activityType}/getPrize`, {});
            $.prizeList = prizes.data;
        } else if (this.isHdbAct) {
            let loadFrontAward = await this.api("/front/activity/loadFrontAward", {});
            if (loadFrontAward.succ) {
                $.prizeList = loadFrontAward.result || [];
            }
        } else if (this.isV1Act) {
            let data = await this.api("/api/prize/drawPrize", {});
            $.prizeList = data.data?.prizeInfo || [];
        } else {
            $.prizeList = context.data || [];
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
        await this.login({ fn: "ql/front/showPerfectInformation" });
        if (this.isV2Act) {
            let getItem = await this.api(`/api/${this.activityType}/getItem`, {});
            if (getItem.data.status) {
                this.putMsg("已领过");
                return;
            }
            let allInfo = getItem.data.allInfo;
            for (let item of allInfo) {
                switch (item.title) {
                    case "姓名":
                        item.content = names[$.random(0, names.length - 1)];
                        break;
                    case "生日":
                        item.content = `19${$.random(60, 99)}/0${$.random(1, 9)}/0${$.random(1, 9)}`;
                        break;
                    case "手机号":
                        item.content = `${phones[$.random(0, phones.length - 1)]}`;
                        break;
                    case "性别":
                        item.content = $.randomArray(["男", "女"], 1)[0];
                        break;
                    case "邮箱":
                        value.content = `${phones[$.random(0, phones.length - 1)].slice(1, 10)}@qq.com`;
                        break;
                    case "地址":
                        value.content = "北京市北京市海淀区";
                    default:
                        item.content = "其他";
                        break;
                }
            }
            let addInfo = await this.api(`/api/${this.activityType}/addInfo`, { allInfo });
            if (addInfo.code === 200) {
                this.putMsg("领取成功");
            }
            return;
        }
        if (this.isJinggengAct) {
            let data = await this.api(
                "ql/front/postAddMaterial",
                `user_id=${$.userId}&act_id=${$.activityId}&detail=${encodeURIComponent(
                    JSON.stringify({
                        姓名: names[$.random(0, names.length - 1)],
                        性别: $.randomArray(["男", "女"], 1)[0],
                        生日: `19${$.random(60, 99)}-0${$.random(1, 9)}-0${$.random(1, 9)}`,
                        手机号码: `${phones[$.random(0, phones.length - 1)]}`,
                        "地区(省市)": "北京市-北京市",
                    })
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
                }
            }
            return;
        }
        if (this.isV1Act) {
            let activity = await this.api("/api/task/perfectInfo/activity", {});
            let perfectInfo = activity.data.allInfo;
            for (let value of Object.values(perfectInfo)) {
                switch (value.title) {
                    case "姓名":
                        value.content = names[$.random(0, names.length - 1)];
                        break;
                    case "生日":
                        value.content = `${$.random(2000, 2022)}年${$.random(1, 12)}月${$.random(1, 27)}日`;
                        break;
                    case "手机号":
                        value.content = phones[$.random(0, phones.length - 1)];
                        break;
                    case "性别":
                        value.content = $.randomArray(["男", "女"], 1)[0];
                        break;
                    case "职业":
                        value.content = "其他";
                        break;
                    case "邮箱":
                        value.content = `${phones[$.random(0, phones.length - 1)].slice(1, 10)}@qq.com`;
                        break;
                    case "地址":
                        value.content = "北京市北京市海淀区";
                        break;
                    default:
                        value.content = "其他";
                        break;
                }
            }
            await this.api("/api/task/perfectInfo/addInfo", { perfectInfo });
            activity = await this.api("/api/task/perfectInfo/activity", {});
            let acquire = await this.api("/api/prize/receive/acquire", { prizeInfoId: activity.data.prizeId });
            if (acquire.resp_code === 0) {
                this.putMsg(acquire.data.prizeName);
                if (acquire.data.prizeType === 3) {
                    this.addressId = acquire.data.addressId;
                    this.prizeName = acquire.data.prizeName;
                    await this.saveAddress();
                }
            }
            return;
        }
        let activity = await this.api("completeInfoActivity/selectById", `activityId=${$.activityId}&venderId=${$.venderId}`);
        let activityContent = await this.api("drawContent/listDrawContent", `activityId=${$.activityId}&type=${$.activityType}`);
        $.actStartTime = activity.data.startTime;
        $.actEndTime = activity.data.endTime;
        $.rule = activity.data.actRule;
        await this.checkActivity(activityContent);
        let drawInfoId = $.prizeList[0]?.drawInfoId || null;
        let map = new Map();
        for (let key in activity.data) {
            if (key.startsWith("choose") && activity.data[key] === "y") {
                let cs = firstCharToLowercase(key?.replace("choose", ""));
                switch (cs) {
                    case "name":
                        map.set("name", encodeURIComponent(names[$.random(0, names.length - 1)]));
                        continue;
                    case "phone":
                        map.set("phone", phones[$.random(0, phones.length - 1)]);
                        continue;
                    case "weixin":
                        map.set("weiXin", "wx_" + $.randomNum(10));
                        continue;
                    case "qq":
                        map.set("qq", $.randomNum(10));
                        continue;
                    case "birth":
                        map.set("birthDay", `19${$.random(60, 99)}-0${$.random(1, 9)}-0${$.random(1, 9)}`);
                        continue;
                    case "professional":
                        map.set("professional", encodeURIComponent($.randomArray(["科学家", "工人", "农民", "白领", "司机"], 1)[0]));
                        continue;
                    case "address":
                        map.set("province", encodeURIComponent("北京市"));
                        map.set("city", encodeURIComponent("东城区"));
                        map.set("address", encodeURIComponent("未知"));
                        continue;
                    case "email":
                        map.set("email", encodeURIComponent($.random(1000000, 9999999) + "@163.com"));
                        continue;
                    case "gender":
                        map.set("gender", encodeURIComponent($.randomArray(["男", "女"], 1)[0]));
                        continue;
                    default:
                        map.set(cs, "1");
                }
            }
        }
        if (activity.data["customJson"]) {
            let customContent = [];
            for (let i = 0; i < JSON.parse(activity.data["customJson"]).length; i++) {
                customContent.push("1");
            }
            map.set("customContent", encodeURIComponent(JSON.stringify(customContent)));
        }
        if (drawInfoId) {
            map.set("drawInfoId", drawInfoId);
        }
        map.set("activityId", $.activityId);
        map.set("venderId", $.venderId);
        map.set("pin", this.Pin);
        map.set("vcode", "");
        map.set("token", this.isvToken);
        map.set("fromType", "APP");
        const saveData = Array.from(map)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");
        let prize = await this.api("wx/completeInfoActivity/save", saveData);
        if (prize.result) {
            if (prize.data?.drawOk) {
                this.putMsg(prize.data.name);
                if (prize.data.drawInfoType === 7 && prize.data.addressId) {
                    this.prizeName = prize.data.name;
                    this.addressId = prize.data.addressId;
                    await this.saveAddress();
                }
            } else if (prize.data === "修改成功") {
                this.putMsg("已领过");
            } else {
                this.putMsg(`${prize.data.errorMessage}`);
            }
        }
    }
}
$.after = async function () {
    try {
        for (let ele of $.prizeList || []) {
            $.msg.push(`    ${ele.prizeName || ele.name} ${ele?.type === 8 ? "专享价" : ""}`);
        }
    } catch (e) {
        console.log(e);
    }
    $.msg.push(`export M_WX_COMPLETE_DRAW_URL="${$.activityUrl}"`);
};
function firstCharToLowercase(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
$.start(Task);
