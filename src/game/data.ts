// ─── 创业人生 · 游戏数据（地区/行业/事件/投资人/候选人/结局） ─────────────
import type {
  Region, Industry, GameEvent, Investor, Candidate, Ending, Cofounder, ScenarioDef,
} from "./types";

// ─── 出身地 ─────────────────────────────────────────────────────────────────
export const REGIONS: Region[] = [
  {
    id: "shenzhen",
    name: "亚洲 · 中国深圳",
    flag: "🇨🇳",
    city: "深圳 · 华强北",
    currency: "¥",
    description:
      "硬件天堂与草根创业圣地。供应链一应俱全，晚上十点写字楼还亮着灯。竞争激烈，资本精明。",
    modifiers: { fundingBonus: 0.9, burnMultiplier: 0.85, talentPool: 1.2, marketAccess: 1.1, regRisk: 0.15 },
    investorScene: "人民币基金居多，问营收和利润比问梦想多。",
    pros: ["供应链完整，成本低", "执行速度快", "工程师勤奋且相对便宜"],
    cons: ["融资环境偏谨慎", "巨头抄袭阴影", "监管政策多变"],
  },
  {
    id: "singapore",
    name: "亚洲 · 新加坡",
    flag: "🇸🇬",
    city: "新加坡 · 珊顿道",
    currency: "S$",
    description:
      "东南亚桥头堡。政府补贴慷慨，法治健全，英语通行。市场小，但辐射六亿人口的东南亚。",
    modifiers: { fundingBonus: 1.0, burnMultiplier: 1.1, talentPool: 0.8, marketAccess: 1.2, regRisk: 0.05 },
    investorScene: "政府基金（EDB）与东南亚美元基金活跃，重合规。",
    pros: ["政府有 grants 补贴", "东南亚市场准入好", "法律透明"],
    cons: ["本地市场极小", "人才贵且稀缺"],
  },
  {
    id: "berlin",
    name: "欧洲 · 德国柏林",
    flag: "🇩🇪",
    city: "柏林 · 克罗伊茨贝格",
    currency: "€",
    description:
      "欧洲创业之都。租金曾是全欧最低，工程师密度极高。融资节奏慢，但公司活得久。",
    modifiers: { fundingBonus: 0.85, burnMultiplier: 0.9, talentPool: 1.1, marketAccess: 1.0, regRisk: 0.1 },
    investorScene: "欧洲 VC 谨慎，尽调长达半年，但一旦投资就很长情。",
    pros: ["技术人才多且稳", "生活成本低", "欧盟单一市场"],
    cons: ["融资额普遍偏小", "扩张文化保守"],
  },
  {
    id: "london",
    name: "欧洲 · 英国伦敦",
    flag: "🇬🇧",
    city: "伦敦 · 肖尔迪奇",
    currency: "£",
    description:
      "金融科技之城。资本密集，人才国际化，脱欧后依旧活跃。什么都贵。",
    modifiers: { fundingBonus: 1.1, burnMultiplier: 1.35, talentPool: 1.0, marketAccess: 1.0, regRisk: 0.1 },
    investorScene: "机构密集，从天使到 PE 一条龙，fintech 尤其受追捧。",
    pros: ["金融人才与资本集中", "英语国际化", "退出渠道多"],
    cons: ["人力和房租极贵", "生活成本高"],
  },
  {
    id: "silicon",
    name: "美国 · 硅谷",
    flag: "🇺🇸",
    city: "帕洛阿尔托 · 大学街",
    currency: "$",
    description:
      "创业宇宙中心。VC 在街上排队给你塞 term sheet，但烧钱速度也是宇宙第一。",
    modifiers: { fundingBonus: 1.5, burnMultiplier: 1.5, talentPool: 1.3, marketAccess: 1.1, regRisk: 0.05 },
    investorScene: "YC 系基金成群，Pre-seed 都能拿百万美元，但下一个赛道对手也在隔壁车库。",
    pros: ["融资体量全球最大", "人才密度最高", "退出市场成熟"],
    cons: ["烧钱速度惊人", "竞争最残酷", "签证和合规成本高"],
  },
  {
    id: "austin",
    name: "美国 · 德州奥斯汀",
    flag: "🤠",
    city: "奥斯汀 · 南国会大道",
    currency: "$",
    description:
      "硅谷出走者的新家。零州税，房价只有湾区三分之一，特斯拉和甲骨文都搬来了。",
    modifiers: { fundingBonus: 1.15, burnMultiplier: 0.95, talentPool: 1.0, marketAccess: 0.95, regRisk: 0.05 },
    investorScene: "本地基金规模中等，但很多湾区基金现在愿意远程投德州项目。",
    pros: ["生活成本远低于湾区", "税收优惠", "新兴技术人才流入"],
    cons: ["本地 VC 体量有限", "部分客户资源在东西海岸"],
  },
  {
    id: "beijing",
    name: "亚洲 · 中国北京",
    flag: "🏯",
    city: "北京 · 中关村",
    currency: "¥",
    description:
      "资本与政策的心脏。顶尖高校云集，大厂总部林立，车库咖啡里的每个座位都可能坐着下一个独角兽。",
    modifiers: { fundingBonus: 1.1, burnMultiplier: 1.25, talentPool: 1.2, marketAccess: 1.0, regRisk: 0.1 },
    investorScene: "美元基金与人民币头部基金的双总部，国企战投活跃，路演必问政策与格局。",
    pros: ["清华北大等顶尖人才", "政策与央企资源集中", "头部创投机构密度高"],
    cons: ["房租人力成本高", "大厂虹吸效应强", "通勤与生活压力大"],
  },
  {
    id: "shanghai",
    name: "亚洲 · 中国上海",
    flag: "🌆",
    city: "上海 · 张江",
    currency: "¥",
    description:
      "金融与国际化之城。外资 corporate 与人民币基金同样活跃，契约精神强，离钱近，也离竞争近。",
    modifiers: { fundingBonus: 1.1, burnMultiplier: 1.2, talentPool: 1.1, marketAccess: 1.15, regRisk: 0.08 },
    investorScene: "外资 VC 与人民币基金均衡分布，尽调专业，重商业模式与盈利路径。",
    pros: ["国际化与外资资源", "金融人才密集", "商业契约精神强"],
    cons: ["综合成本高", "竞争节奏极快", "对盈利要求更现实"],
  },
  {
    id: "nyc",
    name: "美国 · 纽约",
    flag: "🗽",
    city: "纽约 · 硅巷",
    currency: "$",
    description:
      "世界之都的硅巷。金融、媒体、广告科技与时尚交汇，资本密度不输硅谷，烧钱速度也不输。",
    modifiers: { fundingBonus: 1.35, burnMultiplier: 1.45, talentPool: 1.2, marketAccess: 1.1, regRisk: 0.05 },
    investorScene: "从 Union Square 到 SoHo，VC 密度极高，fintech 与媒体科技备受追捧。",
    pros: ["全球资本顶点", "媒体与行业资源无敌", "退出市场成熟"],
    cons: ["全球最贵城市之一", "竞争白热化", "签证与合规成本高"],
  },
  {
    id: "hongkong",
    name: "亚洲 · 中国香港",
    flag: "🇭🇰",
    city: "香港 · 中环",
    currency: "HK$",
    description:
      "东方之珠的融资走廊。普通法体系、自由资金进出、离岸人民币枢纽——通往中国与世界的中转站。",
    modifiers: { fundingBonus: 1.2, burnMultiplier: 1.3, talentPool: 1.0, marketAccess: 1.2, regRisk: 0.08 },
    investorScene: "家族办公室与对冲基金密度全球第一，跨境架构玩家的主场。",
    pros: ["资金自由进出", "法治与国际信用", "辐射内地与东南亚"],
    cons: ["租金人力高昂", "本地市场小", "赛道偏金融地产"],
    unlock: "finish_any",
    unlockHint: "完成任意一局解锁",
  },
  {
    id: "tokyo",
    name: "亚洲 · 日本东京",
    flag: "🇯🇵",
    city: "东京 · 涩谷",
    currency: "JP¥",
    description:
      "深科技之城。机器人、材料、游戏与消费硬件的隐形冠军聚集地，融资保守但客户付费意愿极强。",
    modifiers: { fundingBonus: 0.95, burnMultiplier: 1.2, talentPool: 1.05, marketAccess: 1.0, regRisk: 0.08 },
    investorScene: "VC 决策慢但长情，大企业 CVC 活跃，最看重技术与专利壁垒。",
    pros: ["客户付费意愿全球顶级", "技术积淀深厚", "企业客户忠诚度高"],
    cons: ["融资节奏慢", "语言与文化门槛", "官僚流程繁琐"],
    unlock: "grade_A",
    unlockHint: "达成 A 级以上结局解锁",
  },
  {
    id: "israel",
    name: "中东 · 以色列特拉维夫",
    flag: "🇮🇱",
    city: "特拉维夫 · 罗斯柴尔德大道",
    currency: "₪",
    description:
      "创业国度。人均初创密度全球第一，8200 部队出身的安全与芯片天才满街都是，出口导向，天生全球化。",
    modifiers: { fundingBonus: 1.1, burnMultiplier: 1.15, talentPool: 1.3, marketAccess: 0.85, regRisk: 0.1 },
    investorScene: "VC 密度全球第二，被巨头收购是主流退出方式，尽调极其硬核。",
    pros: ["工程师密度与战斗力顶级", "全球化基因", "退出市场成熟"],
    cons: ["本地市场极小", "地缘风险", "高盐高日照以外生活成本不低"],
    unlock: "runs5",
    unlockHint: "累计创业 5 局解锁",
  },
];

// ─── 行业 ───────────────────────────────────────────────────────────────────
export const INDUSTRIES: Industry[] = [
  {
    id: "ai",
    name: "AI SaaS 工具",
    icon: "🤖",
    description: "用大模型给企业卖铲子。投资人当下最爱，但三个月后赛道可能挤满一百个你。",
    baseBurn: 3.5,
    baseUsers: 400,
    revenuePerUser: 0.014,
    productDifficulty: 1.1,
    fundingAppeal: 1.5,
    regRisk: 0.05,
    mktEff: 0.14,
    mechanic: "☁️ 用户超 500 后每月产生云账单——规模越大越贵",
  },
  {
    id: "ecom",
    name: "跨境电商品牌",
    icon: "📦",
    description: "把中国供应链卖给全世界。现金流扎实但毛利薄，物流和关税是命门。",
    baseBurn: 2.8,
    baseUsers: 600,
    revenuePerUser: 0.006,
    productDifficulty: 0.7,
    fundingAppeal: 0.8,
    regRisk: 0.15,
    mktEff: 0.16,
    mechanic: "📦 用户超 300 后每月物流仓储费随单量增长",
  },
  {
    id: "fintech",
    name: "金融科技",
    icon: "💳",
    description: "用技术重构支付、借贷或理财。客单价高，牌照和合规是生死线。",
    baseBurn: 4,
    baseUsers: 150,
    revenuePerUser: 0.03,
    productDifficulty: 1.2,
    fundingAppeal: 1.2,
    regRisk: 0.4,
    mktEff: 0.12,
    mechanic: "💳 监管风险最高；拿牌照后有每月固定合规开销",
  },
  {
    id: "consumer",
    name: "消费级 App",
    icon: "📱",
    description: "做一款让人上瘾的 C 端应用。爆发力强，但护城河往往只有一层窗户纸。",
    baseBurn: 3,
    baseUsers: 2000,
    revenuePerUser: 0.002,
    productDifficulty: 0.9,
    fundingAppeal: 1.0,
    regRisk: 0.1,
    mktEff: 0.20,
    mechanic: "☁️ 用户超 500 后每月产生云账单",
  },
  {
    id: "hardware",
    name: "智能硬件",
    icon: "🔧",
    description: "从原型到量产是一道鬼门关。库存会吃掉你所有现金，成功了则是硬件的护城河。（起步资金更高，但烧钱也更猛）",
    startCash: 30,
    baseBurn: 4.2,
    baseUsers: 110,
    revenuePerUser: 0.05,
    productDifficulty: 1.4,
    fundingAppeal: 0.9,
    regRisk: 0.1,
    mktEff: 0.11,
    mechanic: "🏭 起步 30 万；每月 30% 营收被备货占款",
  },
  {
    id: "game",
    name: "游戏工作室",
    icon: "🎮",
    description: "做一款让人熬夜的好游戏。爆款回报惊人，但版号、渠道分成和爆款概率是三重生死门。",
    baseBurn: 3.2,
    baseUsers: 1500,
    revenuePerUser: 0.004,
    productDifficulty: 1.0,
    fundingAppeal: 1.0,
    regRisk: 0.3,
    mktEff: 0.15,
    mechanic: "🎮 研发预算 ≥30% 才能维持内容产能，否则玩家持续流失",
  },
  {
    id: "traditional",
    name: "传统行业",
    icon: "🍜",
    description: "餐饮连锁或实业制造的硬核路线。现金流扎实、慢热，资本不追捧，但也死得慢。",
    baseBurn: 2.5,
    baseUsers: 300,
    revenuePerUser: 0.02,
    productDifficulty: 0.6,
    fundingAppeal: 0.6,
    regRisk: 0.05,
    mktEff: 0.10,
    mechanic: "🍜 现金流扎实、慢热抗造；资本不追捧但也死得慢",
  },
  {
    id: "angel",
    name: "天使投资人",
    icon: "😇",
    description: "隐藏职业：用上一次创业攒下的弹药转型投资人。项目少而精，单笔回报惊人，全看眼光。",
    baseBurn: 2.0,
    baseUsers: 40,
    revenuePerUser: 0.15,
    productDifficulty: 0.8,
    fundingAppeal: 0.5,
    regRisk: 0.05,
    mktEff: 0.06,
    mechanic: "😇 项目少而精、单笔回报惊人；初始资金 120 万",
    locked: true,
    startCash: 120,
  },
  {
    id: "energy",
    name: "工业能源",
    icon: "⚡",
    description: "储能、光伏与工业软件的硬骨头路线。单子大、周期长、强监管，但一旦站稳就是十年护城河。（重资产启动：起步资金更高，但双碳资本红利与政策补贴也更大）",
    startCash: 35,
    baseBurn: 4.2,
    baseUsers: 100,
    revenuePerUser: 0.07,
    productDifficulty: 1.5,
    fundingAppeal: 1.1,
    regRisk: 0.3,
    mktEff: 0.12,
    mechanic: "⚡ 起步 35 万；客单价高但开发极慢（1.5×）；产品 ≥70 进入补贴目录，每月 +3 万政策补贴",
  },
  {
    id: "biotech",
    name: "生物制药",
    icon: "💊",
    description: "十年磨一剑的豪华赌局。研发周期极长、临床关卡重重，但一款重磅药的回报足以买下一家公司。（重资产启动：起步 40 万，里程碑付款帮你在收入前续命）",
    startCash: 40,
    baseBurn: 4.5,
    baseUsers: 30,
    revenuePerUser: 0.2,
    productDifficulty: 1.6,
    fundingAppeal: 1.3,
    regRisk: 0.45,
    mktEff: 0.10,
    mechanic: "💊 起步 40 万；开发最难（1.6×）；产品 60/85 触发里程碑 BD 首付款 +15/+25 万",
  },
  {
    id: "entertainment",
    name: "影视文娱",
    icon: "🎬",
    description: "爆款驱动的内容生意。一部爆款吃三年，三部扑街回原点——抗风险全靠项目组合的命中率。",
    baseBurn: 3,
    baseUsers: 800,
    revenuePerUser: 0.005,
    productDifficulty: 0.9,
    fundingAppeal: 0.9,
    regRisk: 0.2,
    mktEff: 0.18,
    mechanic: "🎬 用户基数大爆发力强；收入波动剧烈，靠作品命中率吃饭",
  },
  {
    id: "vcpe",
    name: "VC/PE 基金",
    icon: "💼",
    description: "隐藏职业：不看报表看项目。募资、尽调、投决、退出——LP 的钱在你手里变成别人公司的股份，组合的回报道尽周期冷暖。",
    baseBurn: 3.5,
    baseUsers: 10,
    revenuePerUser: 0.5,
    productDifficulty: 1.0,
    fundingAppeal: 0.3,
    regRisk: 0.1,
    mktEff: 0.09,
    locked: true,
    startCash: 200,
    mechanic: "💼 初始 200 万；「客户」是你投的项目——会不定期带来回报，也会爆雷",
  },
];

// ─── 投资人池 ───────────────────────────────────────────────────────────────
export const INVESTORS: Investor[] = [
  { name: "陈总 · 某人民币基金", type: "angel", style: "产业老兵，话少钱多", checkSize: [100, 300], ask: 12, preference: "营收数据" },
  { name: "KPCB 式老牌基金 · 张Partner", type: "vc", style: "经典美元基金，讲赛道论", checkSize: [300, 800], ask: 18, preference: "市场规模" },
  { name: "YC 式加速器合伙人", type: "vc", style: "只看团队和增长曲线", checkSize: [50, 150], ask: 8, preference: "增长速度" },
  { name: "某大厂战投部", type: "corporate", style: "微笑背后是想把你也收了", checkSize: [200, 600], ask: 15, preference: "战略协同" },
  { name: "东南亚主权基金代表", type: "vc", style: "问合规问到你想哭", checkSize: [200, 500], ask: 14, preference: "合规架构" },
  { name: "欧洲家族办公室 · 冯·xx 先生", type: "angel", style: "_old money_，尽调半年", checkSize: [50, 200], ask: 10, preference: "现金流健康度" },
  { name: "硅谷明星 Solo Capital", type: "angel", style: "前独角兽创始人，动作快", checkSize: [100, 400], ask: 10, preference: "创始人魅力" },
  { name: "某上市公司战投", type: "corporate", style: "带着订单来，也带着锁链", checkSize: [150, 500], ask: 12, preference: "能否并表" },
];

// ─── 候选人池 ───────────────────────────────────────────────────────────────
export const CANDIDATES: Candidate[] = [
  { name: "阿凯", role: "全栈工程师", salary: 2.2, skill: 88, loyalty: 70, quirk: "前大厂 P8，降薪跟你干，但要求期权明确", good: true },
  { name: "Lena", role: "增长负责人", salary: 3.0, skill: 85, loyalty: 60, quirk: "数据驱动，之前把两家初创做到百万用户", good: true },
  { name: "老周", role: "供应链总监", salary: 2.0, skill: 80, loyalty: 85, quirk: "传统行业二十年，不懂互联网但极其靠谱", good: true },
  { name: "小唐", role: "前端工程师", salary: 1.2, skill: 55, loyalty: 50, quirk: "简历漂亮，面试时发现八股文背得比代码好", good: false },
  { name: "Max", role: "海外 BD", salary: 2.8, skill: 75, loyalty: 40, quirk: "嘴上全是资源，问细节就含糊", good: false },
  { name: "苏苏", role: "产品经理", salary: 2.5, skill: 82, loyalty: 75, quirk: "用户同理心极强，会怼老板但总是对的", good: true },
  { name: "Viktor", role: "算法工程师", salary: 3.5, skill: 92, loyalty: 55, quirk: "技术极强，但要求远程+四天工作制", good: true },
  { name: "马哥", role: "销售 VP", salary: 3.2, skill: 78, loyalty: 45, quirk: "承诺半年带你见完所有客户，名片厚得能防身", good: false },
];

// ─── 随机事件库 ─────────────────────────────────────────────────────────────
// 灵感自真实创业史：硅谷剧集、精益创业、真实公司案例的改编。
export const EVENTS: GameEvent[] = [
  {
    id: "cofounder-fight",
    title: "联合创始人撕逼",
    scene:
      "凌晨两点，你的联合创始人把电脑摔在桌上：「为什么股权 5:5，干活的却都是我？」他/她要求重新分配股权，否则退出。空气凝固了。",
    minStage: 2, weight: 8, once: true,
    condition: (s) => !s.tags.includes("solo"),
    choices: [
      {
        id: "vesting", text: "提议设定 4 年归属期（Vesting），谁走谁留下股份",
        effects: { morale: -5, flag: "vesting" },
        resultText: "吵了一周，最终签了补充协议。对方情绪缓了下来——规则比人情更能留住人。",
        lessonTitle: "创业课 · 股权 vesting",
        lesson: "几乎所有正规投资机构都会要求创始人股权 4 年归属 + 1 年悬崖（cliff）。扎克伯格早期驱逐联合创始人、Snapchat 联合创始人被扫地出门，都是因为一开始没定规则。先小人后君子。",
      },
      {
        id: "give-in", text: "让步，把自己 10% 的股份转给对方",
        effects: { morale: 8, health: -5 },
        resultText: "对方暂时满意了。但你心里那根刺埋下了，以后的每一次分歧都会更疼。",
        lessonTitle: "创业课 · 不平等的股权",
        lesson: "用股份买和平是最贵的消费。股权给出去容易拿回来难，它是你未来融资、激励、控制权的根基。和解要靠机制（vesting、董事会席位），不是靠出血。",
      },
      {
        id: "let-go", text: "强硬：不接受就分手，你一个人也能干",
        effects: { morale: -20, product: -15, addTag: "solo" },
        resultText: "对方第二天没有来。你看着半成品的代码和空了一半的办公室，突然明白了什么叫独木难支。",
        lessonTitle: "创业课 · 联合创始人分手",
        lesson: "YC 统计：没有联合创始人的单人创业成功率显著更低。分手要快，但要体面：好聚好散的联合创始人未来可能是你的投资人、客户，而反目成仇的前合伙人可能拿着你的代码再创业。",
      },
    ],
  },
  {
    id: "bigco-copy",
    title: "巨头抄袭警报",
    scene:
      "你的产品刚有起色，某大厂连夜上线了几乎一样的功能，还内置进了它十亿级用户的 App。凌晨的创业者群里都在 @你，有人已经开始替你写「悼文」。",
    minStage: 4, weight: 7, once: true,
    choices: [
      {
        id: "niche", text: "收缩到巨头看不上的细分场景，做深做重",
        effects: { usersPct: -10, mrrPct: 15, morale: 5 },
        resultText: "你砍掉了一半功能，专注服务一个垂直人群。用户少了，但付费率和续约率反而翻倍。巨头的大炮打不到这么细的缝里。",
        lessonTitle: "创业课 · 错位竞争",
        lesson: "Instagram 被 Twitter 抛弃滤镜功能后反而聚焦；Snapchat 被抄后靠年轻人文化存活；钉钉靠『已读回执』这种细节赢下企业市场。巨头胜在广度和资源，你赢在纵深和速度。",
      },
      {
        id: "speed", text: "比他们快十倍，每周发版，把社区做起来",
        effects: { product: 15, morale: -5, cash: -20 },
        resultText: "你们进入战时状态，三班倒疯狂迭代。大厂的功能评审会还没开完，你们已经更新了五个版本。一部分用户留了下来。",
        lessonTitle: "创业课 · 速度作为护城河",
        lesson: "Peter Thiel 问：你的十倍优势是什么？对初创公司，最现实的答案是决策速度和迭代速度。大厂一个功能要过十个会，你今晚就能上线。但速度是有成本的——烧的是团队的命。",
      },
      {
        id: "sell", text: "主动接触大厂，探讨被收购的可能性",
        effects: { flag: "acquire-talk" },
        resultText: "对方的商务总监客气地接待了你，临走时说『保持联系』。你隐约觉得，这可能是礼貌的拒绝。",
        lessonTitle: "创业课 · 被收购是一门学问",
        lesson: "主动求购会削弱你的谈判地位。正确的姿势是把公司运营到『对方不买就会疼』的状态。被收购很少是创业者的初衷，但经常是理性的归宿——关键是价格和控制权。",
      },
    ],
  },
  {
    id: "investor-ghost",
    title: "投资人变卦",
    speaker: "vc-zhou",
    scene:
      "周远帆：「TS 我们内部重新过了一遍，流程上需要再看看。你先别急，有消息我第一时间告诉你。」\n电话挂了。你的律师提醒：对方可能在同时看你的竞争对手。账上的钱只够撑两个月了。",
    minStage: 3, weight: 7, once: true,
    choices: [
      {
        id: "parallel", text: "立刻启动备选方案，一周内约见五个新投资人",
        effects: { health: -8, cash: -5, flag: "backup-investors" },
        resultText: "你把咖啡当水喝，两周见了十一个投资人。第三个对你表示了兴趣。你第一次理解了什么叫『永远要有 Plan B』。",
        lessonTitle: "创业课 · TS 不是钱",
        lesson: "Term Sheet 只是意向，交割（closing）前一切都可能生变。职业选手会同时推进多家、刻意制造竞争，直到钱到账。Airbnb 早期曾被七个投资人拒绝，靠的就是一轮一轮不放弃的平行推进。",
      },
      {
        id: "wait", text: "相信对方，专心做业务等消息",
        effects: { cash: -40, months: 1 },
        resultText: "一个月过去，对方回复『很遗憾』。你的 runway 从五个月变成了三个月，而你已经错过了最佳的融资窗口。",
        lessonTitle: "创业课 · Runway 意识",
        lesson: "Runway（现金流跑道）= 账上现金 ÷ 每月净消耗。拿到 TS 不等于拿到钱，把钱到账当作唯一事实。最优秀的创始人在账上还有 6 个月钱时就开始融资。",
      },
      {
        id: "confront", text: "带着律师函去质问对方是否违约",
        effects: { reputation: -10 },
        resultText: "对方法务淡淡回了一句『意向书不具约束力』。圈内很快流传你『难搞』的名声。",
        lessonTitle: "创业课 · TS 的法律性质",
        lesson: "TS 里只有排他期、保密、费用等少数条款有约束力，投资本身通常『以完成尽调为准』。生气解决不了问题，把情绪换成备选方案才是成熟创业者。",
      },
    ],
  },
  {
    id: "server-down",
    title: "凌晨三点，服务器崩了",
    scene:
      "凌晨三点十七分，监控警报把你炸醒：核心服务宕机，付费客户群里已经刷了 200 条消息。修复需要 4 小时，而你现在只有两个人。",
    minStage: 3, weight: 6,
    choices: [
      {
        id: "all-night", text: "通宵抢修，逐个私聊大客户道歉",
        effects: { health: -10, product: 8, reputation: 8 },
        resultText: "天亮时服务恢复。最大的客户在你的道歉长文下回复：『就冲这个态度，续约了。』",
        lessonTitle: "创业课 · 危机即营销",
        lesson: "2009 年 Amazon AWS 故障后公开了详尽的事后报告（Postmortem），反而赢得信任。初创公司扛不住不出错，扛得住的是出错后的透明度。坦诚的危机公关是小公司最便宜的品牌资产。",
      },
      {
        id: "auto-msg", text: "发个公告模板，先睡觉，明天再说",
        effects: { usersPct: -8, reputation: -12, morale: -3 },
        resultText: "客户流失率当月翻倍。有人在社交媒体上发了长文《某创业公司如何敷衍它的上帝》。",
        lessonTitle: "创业课 · 客户的耐心有额度",
        lesson: "早期客户买的不是产品，是对你的信任。信任账户平时靠小事积累，危机时大笔支取。Stripe 的『随时给你打电话』式客服、海底捞的危机处理，本质是同一个道理：把客户当合伙人。",
      },
      {
        id: "outsource", text: "花 5 万紧急请外部运维团队处理",
        effects: { cash: -5, health: 3, reputation: 2 },
        resultText: "专业团队两小时搞定。你心疼钱，但学会了算账：5 万买你一条命和 8 小时的客户信任，不贵。",
        lessonTitle: "创业课 · 花钱买时间",
        lesson: "创始人最贵的是注意力和时间。凡是不构成核心竞争力的工作（运维、法务、财税），都应该考虑外包或工具化。YC 的建议：Do things that don't scale 指的是客户获取，不是指什么都自己扛。",
      },
    ],
  },
  {
    id: "reg-crackdown",
    title: "监管风向突变",
    scene:
      "一纸新规征求意见稿深夜发布：你的行业被点名纳入强监管，牌照、数据、资本充足率全有了新要求。同行的群里一片哀嚎，有人已经开始转让公司。",
    minStage: 3, weight: 5,
    condition: (s) => s.industry.regRisk >= 0.1,
    choices: [
      {
        id: "comply", text: "第一时间拥抱监管，主动申请牌照、请合规顾问",
        effects: { cash: -30, months: 1, reputation: 10, flag: "licensed" },
        resultText: "合规花了三个月和一大笔钱。但当竞争对手批量倒下时，你成了少数『有证驾驶』的玩家，客户反而涌向你。",
        lessonTitle: "创业课 · 合规是护城河",
        lesson: "2021 年教培、2020 年 P2P、2018 年现金贷——监管从来不是『黑天鹅』，只是时间问题。 Stripe 拿到银行牌照、蚂蚁整改后重启，说明活下来的都是把合规当战略而不是成本的公司。",
      },
      {
        id: "pivot", text: "连夜转型，把核心能力平移到相邻赛道",
        effects: { product: -25, months: 2, morale: -15 },
        resultText: "全员大会开到凌晨四点。一半人选择离开，剩下的人陪你把产品拆了重装。三个月后你们以新面目出现。",
        lessonTitle: "创业课 · Pivot 的艺术",
        lesson: "YouTube 前身是视频约会网站，Slack 前身是游戏公司，小红书前身是跨境电商。Pivot 不是失败，是用已验证的能力换一块更厚的冰面。关键是保留什么、放弃什么的判断力。",
      },
      {
        id: "ignore", text: "观望，觉得『落实还早』",
        effects: { months: 2 },
        resultText: "三个月后正式文件落地，罚款和限期整改一起来。你既丢了时间又丢了主动权。",
        lessonTitle: "创业课 · 政策雷达",
        lesson: "对强监管行业，创始人必须建立自己的『政策雷达』：行业协会、监管沙盒、政策律师。在中国做生意尤其如此——监管不是风险本身，对监管毫无准备才是。",
      },
    ],
  },
  {
    id: "viral-hit",
    title: "产品突然爆火",
    scene:
      "早上醒来，后台数据曲线像火箭：某个 KOL 自发推荐了你们，日新增是平时的 40 倍。Slack（内部通讯）炸了，团队问：接不接得住？",
    minStage: 3, weight: 6,
    choices: [
      {
        id: "lean-in", text: "all-in 这波流量：加服务器、全员客服、买投放接势能",
        effects: { cash: -25, usersPct: 60, mrrPct: 25, morale: 10, health: -6 },
        resultText: "你们像接住了一个燃烧的电焊球。两周后流量退潮，但留下了平时半年的用户量。团队累瘫了，眼睛却都在发光。",
        lessonTitle: "创业课 · 接住好运",
        lesson: "Clubhouse 爆红后没能留住用户，Zoom 在疫情期间接住了每一个用户。爆红是运气，接住是实力：容量、留存漏斗、新手引导，必须在平时就备好。运气只眷顾有准备且敢 all-in 的人。",
      },
      {
        id: "steady", text: "谨慎乐观，只按正常节奏扩容",
        effects: { usersPct: 15, reputation: 3 },
        resultText: "服务器扛住了，但大量新用户进来后困惑地离开——你们的引导流程没跟上。你记住了这个教训。",
        lessonTitle: "创业课 · 激活（Activation）优先于获客",
        lesson: "获客 1000 个而激活率 10%，不如获客 100 个激活率 80%。 Facebook 的 aha-moment 是 10 天内加 7 个好友。流量来了接不住，等于往漏水的桶里灌水。",
      },
    ],
  },
  {
    id: "key-hire-poached",
    title: "核心员工被挖角",
    scene:
      "你的技术负责人桌上的 offer 打印出来了：某大厂，三倍薪水，外加签字费。他/她找你谈，没有提离职，但眼神在问你：我们为什么要留在这里？",
    minStage: 4, weight: 6, once: true,
    choices: [
      {
        id: "mission", text: "不谈钱，谈使命、成长和下一份期权的价值",
        effects: { morale: 5, cash: 0, flag: "loyal-core" },
        resultText: "你们谈了四个小时，从第一次发布聊到五年后的样子。对方把 offer 折起来放进了抽屉。",
        lessonTitle: "创业课 · 留住 20% 的核心",
        lesson: "Netflix 只留『表现优异且价值观契合』的人。对早期公司，前 10 名员工决定生死。留下核心靠的不是加班费，是：1) 真实成长空间 2) 被信任的权力 3) 看得见的期权价值。",
      },
      {
        id: "match", text: "咬牙匹配薪水，甚至再加一点",
        effects: { cash: -30, morale: -5 },
        resultText: "人留住了。但消息传开后，另外两个骨干也来『谈心』了。你意识到这是没有尽头的竞标。",
        lessonTitle: "创业课 · 薪酬的锚",
        lesson: "和大厂拼现金是必输的战争。聪明的早期公司用『低现金+高期权+快成长』的组合拳。如果核心员工只认现金，要么是你的愿景不够性感，要么是他本来就该走。",
      },
      {
        id: "bless", text: "体面放手，祝福对方，保持联系",
        effects: { product: -12, morale: -8, reputation: 5 },
        resultText: "欢送饭吃到很晚。三个月后，对方在大厂内部推动了与你们的合作，还介绍了一个新客户。",
        lessonTitle: "创业课 · 前员工网络",
        lesson: "PayPal 黑帮、阿里中供铁军、字节离职员工群——最伟大的公司网络往往是前员工构成的。人走茶不凉是创始人格局的试金石，也是未来资源网络的伏笔。",
      },
    ],
  },
  {
    id: "pr-crisis",
    title: "社交媒体公关危机",
    speaker: "reporter-wen",
    scene:
      "温记者：「那条控诉帖你们看到了吧？评论区已经失控了。截至发稿前，方便给个回应吗？」\n一条微博/推特冲上热搜：一位用户控诉你们的产品导致他损失了一笔钱，配图、时间线、聊天记录一应俱全。",
    minStage: 3, weight: 6,
    choices: [
      {
        id: "face", text: "24 小时内公开回应：承认问题、公布补偿方案、晒整改计划",
        effects: { cash: -10, reputation: 12, usersPct: 5 },
        resultText: "声明发出后，舆论反转了一半。那位用户更新了帖子：『至少他们敢认。』更多的用户因为这条回应知道了你们。",
        lessonTitle: "创业课 · 黄金 24 小时",
        lesson: "强生 1982 年泰诺投毒事件：一周内召回 3100 万瓶，损失 1 亿美元，但换来了『史上最佳公关』的美誉。危机面前：速度 > 完美，真诚 > 话术，行动 > 道歉。",
      },
      {
        id: "lawyer", text: "让法务起草措辞严谨的声明，逐条反驳",
        effects: { reputation: -18, usersPct: -10 },
        resultText: "声明滴水不漏，但读起来像个被告。网友总结：『他们没错，但他们很冷。』热搜挂了一整天。",
        lessonTitle: "创业课 · 法务语言≠人话",
        lesson: "法律自保和用户沟通是两张皮。先发人话（承认感受、说明行动），再附法务文本。三星 Note7 起初的强硬声明 vs 后来全球召回，对比鲜明。",
      },
      {
        id: "ignore2", text: "冷处理，觉得『过两天就没人记得』",
        effects: { reputation: -10, morale: -5 },
        resultText: "热度确实过去了。但截图留了下来，每次你融资、招聘、上媒体，它都会重新出现一次。",
        lessonTitle: "创业课 · 互联网没有遗忘",
        lesson: "未被回应的负面内容会成为你永久的搜索画像。CEO 的个人信誉是公司最贵的无形资产，尤其在融资时——投资人尽调一定会搜你的名字。",
      },
    ],
  },
  {
    id: "covid",
    title: "黑天鹅：全球性疫情",
    scene:
      "疫情突袭，城市封锁，你的客户预算冻结、供应链中断。办公室租金照付，工资照发，收入却断崖式下跌 60%。所有扩张计划一夜作废。",
    minStage: 4, weight: 4, once: true,
    choices: [
      {
        id: "cut", text: "一周内裁员 30%，收缩战线，保住 12 个月 runway",
        effects: { team: -3, morale: -20, cash: 40, reputation: -5 },
        resultText: "这是你做过的最难的决定。送别会上有人哭了。但公司活了下来，而隔壁赛道的热钱公司们正在批量倒闭。",
        lessonTitle: "创业课 · 果断的生存算术",
        lesson: "2020 年 Airbnb 裁员 25%，创始人写公开信承诺：被裁员工保留电脑、延长医保、建立人才库帮助找工作。市场回暖后它强势上市。裁员要一次到位、给足尊严——拖泥带水的裁员才是最贵的。",
      },
      {
        id: "bridge", text: "不裁员，创始人零薪+高管降薪 50%，借过桥贷款续命",
        effects: { debt: 60, health: -10, morale: -5 },
        resultText: "你们像一家人一样扛过了至暗时刻。但桥接贷款像定时炸弹，利率和转股条款会在未来某天引爆。",
        lessonTitle: "创业课 · 债务的双面性",
        lesson: "桥接贷款（Bridge Loan）常带折扣转股条款，救急但稀释凶猛。2008 年金融危机中，接受债务续命的初创公司很多倒在了恢复期——因为债务不分享你的 upside，只分享你的现金流。",
      },
      {
        id: "pivot-online", text: "孤注一掷转型线上/远程场景产品",
        effects: { product: -15, months: 1, usersPct: 30, morale: -10 },
        resultText: "三个月后，你们的远程协作模块意外踩中了时代的脉搏。灾难里长出了新芽。",
        lessonTitle: "创业课 · 危中有机",
        lesson: "Zoom 日活从 1000 万到 3 亿、拼多多在物流中断中靠社区团购翻盘、Shopify 市值在疫情中翻了 6 倍。黑天鹅杀死旧模式，也奖励快速转向者。",
      },
    ],
  },
  {
    id: "burn-war",
    title: "烧钱大战",
    scene:
      "直接竞争对手宣布融了 10 个亿，开始补贴大战：同款产品半价，还到处挖你的人。你的销售团队看着对手的广告坐立不安，问你：跟不跟？",
    minStage: 4, weight: 6, once: true,
    choices: [
      {
        id: "no-war", text: "不打补贴战，死磕产品和单位经济模型",
        effects: { usersPct: -15, mrrPct: 10, morale: 3 },
        resultText: "你们失去了价格敏感的用户，却留住了愿为价值付费的。半年后对手补贴停止，那些用户回来了——带着对『便宜没好货』的记忆。",
        lessonTitle: "创业课 · 单位经济（Unit Economics）",
        lesson: "LTV/CAC > 3 是健康线。补贴买来的不是用户，是租来的流量，停租即走。滴滴快的补贴大战、瑞幸的疯狂扩张，最终都回到了同一个问题：每一单到底赚不赚钱？",
      },
      {
        id: "war", text: "跟进补贴，融资备战，跟它拼了",
        effects: { cash: -80, usersPct: 40, mrrPct: -20, health: -8 },
        resultText: "你们像两个拳击手互相抡拳，观众叫好，裁判数钱。三个月后你先松了手——钱先烧完的那个永远是你。",
        lessonTitle: "创业课 · 不对称战争",
        lesson: "不要在你对手选定的战场上开战。美团避开正面、攻下三四线城市；Netflix 不租碟、直接流媒体。当你的弹药是对手的 1/10，规则必须你来定。",
      },
      {
        id: "alliance", text: "联系第三名玩家/巨头，提议结盟或合并对抗",
        effects: { flag: "merger-talk" },
        resultText: "对方 CEO 和你约在机场喝了杯咖啡。竞争的尽头，可能是一张谈判桌。",
        lessonTitle: "创业课 · 合纵连横",
        lesson: "携程与去哪儿合并结束 OTA 大战、Uber 中国与滴滴合并、滴滴快的合并。商场上没有永远的敌人。当行业进入消耗战，合并往往是对股东、员工、创始人三方最优解。",
      },
    ],
  },
  {
    id: "data-breach",
    title: "用户数据泄露",
    scene:
      "一个白帽子黑客邮件你：你们数据库裸奔了，几十万用户数据可拖库。按照当地法律，这可能意味着天价罚款和集体诉讼。",
    minStage: 3, weight: 5,
    choices: [
      {
        id: "disclose", text: "48 小时内主动披露并修复，上报监管部门",
        effects: { cash: -20, reputation: 5, morale: -3 },
        resultText: "监管部门的调查员在报告里写下『企业态度积极、响应及时』。罚款减半，用户零流失。",
        lessonTitle: "创业课 · 数据合规不是选择题",
        lesson: "GDPR 罚款上限是全球营收 4%，国内《个保法》同样严厉。Uber 2016 年隐瞒泄露事件，2018 年被罚 1.48 亿美元。主动披露几乎是唯一正确解——法律奖励坦诚者。",
      },
      {
        id: "hide", text: "悄悄修复，赌没人发现",
        effects: { cash: -5, flag: "breach-hidden" },
        resultText: "你修好了漏洞。但三个月后，暗网出现了你们的数据。记者的电话比监管的电话先到。",
        lessonTitle: "创业课 · 藏不住的秘密",
        lesson: "在日志、区块链分析、安全社区面前，隐瞒泄露几乎必然败露，而败露的代价是数倍的罚款加信誉死刑。Equifax 高管因隐瞒数据泄露被刑事起诉。",
      },
    ],
  },
  {
    id: "angel-check",
    title: "种子轮的「霸王条款」",
    speaker: "angel-li",
    scene:
      "李曼姨：「条款我让律师顺了一遍，加了几条小字——都是为了保护我的钱，你别多想。」\n你接过 TS：完全棘轮反稀释条款、一票否决权、创始人 3 年内不得离职。你的律师皱眉：这是『毒丸』。",
    minStage: 3, weight: 6, condition: (s) => s.stage === "seed" || s.stage === "seriesA",
    choices: [
      {
        id: "negotiate", text: "拒绝毒丸条款，给出标准条款（1x 非参与清算优先权）",
        effects: { flag: "clean-terms" },
        resultText: "谈判桌上你第一次感觉自己在『做生意』而不是『讨饭』。对方撤回了两个条款，交易继续。",
        lessonTitle: "创业课 · Term Sheet 攻防",
        lesson: "完全棘轮（Full Ratchet）反稀释意味着你下次低价融资时，投资方股份被自动补足，创始人被无限稀释。Facebook 早期投资人想要特殊条款都被拒绝。底线：1x 非参与清算优先权 + 标准反稀释（加权平均）。",
      },
      {
        id: "accept-bad", text: "钱要紧，先签了再说",
        effects: { cash: 0, flag: "toxic-terms", morale: -5 },
        resultText: "钱到账了。但律师私下说：从签的那天起，这家公司已经不完全属于你了。",
        lessonTitle: "创业课 · 便宜的昂贵",
        lesson: "优步 Travis Kalanick 早期接受大量带控制权的条款，为后来的董事会政变埋下伏笔。有毒条款会在你最脆弱的下一轮融资时发作——那时你会为今天的急切付出股权、董事会席位甚至公司的代价。",
      },
      {
        id: "walk", text: "放弃这位投资人，继续找下一家",
        effects: { months: 1, cash: -8 },
        resultText: "又熬了一个月。但新找到的投资人给的条款干净得像纯净水。你庆幸自己没签。",
        lessonTitle: "创业课 · 投资人的选择是婚姻",
        lesson: "你要和这个投资人同桌至少七年。条款、声誉、投后风格比支票金额重要。Benchmark、Sequoia 的价值从来不止是钱。『坏钱拿了比没钱更可怕』是血泪共识。",
      },
    ],
  },
  {
    id: "star-engineer-quit",
    title: "技术合伙人要「谈一谈」",
    scene:
      "凌晨，你的技术合伙人发来长文：大模型浪潮下，他/她的市场身价翻了三倍，而你给的期权「看不到兑现希望」。要求：加薪 + 重新谈期权，否则两周后离职。",
    minStage: 4, weight: 6,
    choices: [
      {
        id: "refresh", text: "做一轮期权 refresh，绑定 4 年，坦诚沟通估值预期",
        effects: { cash: -15, morale: 8, flag: "team-locked" },
        resultText: "你们重新对齐了预期。对方说：『我要的不是钱，是知道自己这几年的青春值多少。』",
        lessonTitle: "创业课 · 期权 refresh",
        lesson: "Google、Meta 常用期权 refresh 留住老员工。早期员工入职时的期权在后续融资中会被稀释，定期 refresh（追加授予）是成熟公司的标配。最怕的是创始人装傻——市场价摆在那里。",
      },
      {
        id: "refuse", text: "创业公司谈不了条件，爱干不干",
        effects: { product: -20, morale: -15, addTag: "cto-gone" },
        resultText: "两周后，对方加入了竞争对手。你半夜看着看不懂的代码，第一次认真考虑『技术债』这个词的字面意思。",
        lessonTitle: "创业课 · 技术债与人",
        lesson: "核心技术人员离职的成本 = 知识流失 + 招聘成本(6 个月+) + 进度延误 + 竞业风险。工程师的『市场价』是客观存在的，假装看不见只是在积累爆炸当量。",
      },
    ],
  },
  {
    id: "acquire-offer",
    title: "收购要约",
    scene:
      "一家上市公司 CFO 约你午餐，开门见山：出价你估值的 1.8 倍现金收购，创始团队保留两年。你心跳加速——这可能是财富自由，也可能是温水煮青蛙。",
    minStage: 5, weight: 5, once: true,
    choices: [
      {
        id: "sell-high", text: "谈判抬价到 2.5 倍，成交",
        effects: { flag: "sold" },
        resultText: "签字那天你想起在车库里写第一行代码的夜晚。交割款到账的短信提示音响起时，你发现自己并没有想象中兴奋，只是很累。",
        lessonTitle: "创业课 · 何时卖掉公司",
        lesson: "Instagram 10 亿美元卖给了 Facebook（当时零营收），创始人数十亿美元离场；Snap 拒绝后 IPO 市值一度 300 亿。没有对错的答案，只有对你个人风险、野心和时机的诚实评估。现金流为正时，你才有资格说『不』。",
      },
      {
        id: "decline", text: "拒绝：这家公司值得一个 IPO",
        effects: { morale: 10, reputation: 5 },
        resultText: "你拒绝了。回到办公室，团队眼里的光比任何融资都珍贵。但你知道，从此每一天你都得证明这个决定是对的。",
        lessonTitle: "创业课 · 拒绝的艺术",
        lesson: "拒绝收购要约需要两个前提：1) 账面现金撑得到证明你是对的；2) 你和团队在『为什么而战』上高度一致。扎克伯格拒绝雅虎 10 亿美元时两者兼备。拒绝不是姿态，是押注。",
      },
    ],
  },
  {
    id: "tax-audit",
    title: "税务稽查",
    scene:
      "税务局来信：对近三年账目进行稽查。早期为了省钱，你们用过私人账户收货款、买过一些『灵活用工』发票。会计的脸色不太好看。",
    minStage: 3, weight: 4,
    choices: [
      {
        id: "cooperate", text: "全面配合，主动补税+缴滞纳金",
        effects: { cash: -25, reputation: 5 },
        resultText: "补了税和罚款，账目从此干干净净。审计师在报告里写下『企业整改积极』。",
        lessonTitle: "创业课 · 财税合规",
        lesson: "『金税四期』时代，私户收款、买卖发票基本等于自杀。公司做大后，历史税务问题会被尽调翻个底朝天——投资人发现税务瑕疵轻则压价，重则直接放弃。",
      },
      {
        id: "bury", text: "想办法『解释』过去",
        effects: { cash: -8, flag: "tax-risk" },
        resultText: "这次糊弄过去了。但税务档案会永久保存，下一次——也许是上市前的税务尽调——它们会回来找你。",
        lessonTitle: "创业课 · 上市的税务尽调",
        lesson: "A股/港股/美股 IPO 都有 3 年税务合规审查。大量拟上市公司因历史税务瑕疵被迫撤回申请。今天省下的每一分『税』，未来都会以十倍的价格要回来。",
      },
    ],
  },
  {
    id: "tariff",
    title: "关税大棒",
    scene:
      "你的主力海外市场突然宣布对你们的产品加征 30% 关税。货还在海上，成本瞬间倒挂。客户来电：要么你们消化关税，要么订单转给东南亚工厂。",
    minStage: 4, weight: 4, condition: (s) => s.industry.id === "ecom" || s.industry.id === "hardware",
    choices: [
      {
        id: "eat", text: "自己消化一半关税，保住客户",
        effects: { mrrPct: -20, usersPct: 5, cash: -20 },
        resultText: "利润薄如纸片，但客户留住了。你开始研究海外仓和产地多元化。",
        lessonTitle: "创业课 · 供应链韧性",
        lesson: "2018 中美贸易战后，立讯精密、歌尔加速东南亚建厂；SHEIN 用分布式小单快反对冲关税。把鸡蛋放在一个篮子里的成本，在危机来临时会一次性结清。",
      },
      {
        id: "move", text: "把产能/仓储迁往第三国，花 3 个月重构供应链",
        effects: { months: 1, cash: -35, mrrPct: 5 },
        resultText: "这是一场豪赌。但当同行还在关税里窒息时，你已经在新产地轻装上阵。",
        lessonTitle: "创业课 · 产地多元化",
        lesson: "特斯拉上海工厂、苹果印度产线、TikTok 的『得州计划』——全球化 2.0 的玩法是『中国+1』。供应链重构很贵，但被卡脖子更贵。",
      },
      {
        id: "pass", text: "把关税全转嫁给客户",
        effects: { usersPct: -25, mrrPct: -10 },
        resultText: "订单量暴跌 40%。你在 Excel 里算了整夜：丢掉的市场，多久能拿回来？答案是：可能永远。",
        lessonTitle: "创业课 · 定价权的真相",
        lesson: "转嫁成本的能力取决于你的不可替代性。苹果敢涨价，白牌不敢。想拥有定价权，平时就要投资品牌、技术和客户关系——危机只是定价权的压力测试。",
      },
    ],
  },
  {
    id: "cofounder-quit-burnout",
    title: "创始人健康红灯",
    scene:
      "连续 18 个月每天睡 4 小时后，你在会议室里眼前一黑。体检报告出来：心律不齐、甲状腺异常、重度焦虑。医生盯着你说：『再这么干，下一次就不是头晕了。』",
    minStage: 3, weight: 5,
    condition: (s) => s.health < 55,
    choices: [
      {
        id: "rest", text: "强制休整两周，任命临时负责人",
        effects: { months: 1, health: 25, morale: -3, cash: -10 },
        resultText: "第一周你手机震动就心慌，第二周你开始能睡整觉。回来后你看问题的清晰度，比连轴转三个月还高。",
        lessonTitle: "创业课 · 创始人是单点故障",
        lesson: "桥水达利欧说『痛苦+反思=进步』，但持续 burnout 只会=出局。VC 尽职调查现在会评估创始人健康。YouTube 前 CEO 之死的教训残酷：公司可以换 CEO，你的孩子只有一个父母。",
      },
      {
        id: "push", text: "吃点药顶着，公司离了我转不了",
        effects: { health: -20, product: 10 },
        resultText: "你又撑了半年。产品确实进步了，但你的体检报告像一个正在倒计时的炸弹。",
        lessonTitle: "创业课 · 不可持续的胜利",
        lesson: "以健康换来的增长是借高利贷。更危险的是：过度依赖创始人的公司，在投资人眼里是减分项——他们投资的不是超人，是可复制的系统。",
      },
    ],
  },
  {
    id: "whale-customer",
    title: "「鲸鱼客户」的诱惑",
    scene:
      "一家行业巨头找上门：一份合同金额顶你全年营收 40%，但要求定制开发、独家条款和 180 天账期。签，还是不签？",
    minStage: 4, weight: 6,
    choices: [
      {
        id: "take", text: "签！先让营收数字好看",
        effects: { cash: 30, mrrPct: 40, morale: -8, flag: "whale-dependency" },
        resultText: "合同签了，团队成了这家巨头的驻场外包。你的产品路线图被改写，其他客户被冷落。",
        lessonTitle: "创业课 · 大客户依赖症",
        lesson: "当你的 40% 营收来自单一客户，你不是在经营公司，是在给员工发工资的同时给大客户打工。客户集中度是尽调红线（通常 <30%）。美团的早期教训：BD 签大客户容易，摆脱依赖难。",
      },
      {
        id: "counter", text: "签，但砍掉独家和定制，坚持标准化产品",
        effects: { mrrPct: 20, reputation: 5 },
        resultText: "对方皱着眉同意了 80%。你保住了产品主权。半年后，三个同类客户循着口碑而来——标准化的力量。",
        lessonTitle: "创业课 · 产品化 vs 项目制",
        lesson: "Salesforce 的『No Customization』原则、Atlassian 不做一毛钱定制——标准化才能规模化。愿意为你的标准产品付费的客户，才是真正的 PMF 信号。",
      },
      {
        id: "decline", text: "婉拒，专注中小客户市场",
        effects: { morale: 5 },
        resultText: "团队有人不理解。但当巨头因为你们不做定制而扶持了一个对手、而对手被定制拖垮时，大家才懂。",
        lessonTitle: "创业课 · 说不是战略",
        lesson: "乔布斯回归苹果第一件事是把 350 条产品线砍到 10 条。战略的本质是取舍——『我们对什么说不』比『我们做什么』更定义一家公司。",
      },
    ],
  },
  {
    id: "media-fame",
    title: "聚光灯下的诱惑",
    scene:
      "你上了当地知名创业节目/36氪/ TechCrunch 封面，头衔变成「XX 赛道最值得关注创始人」。采访、峰会邀请、颁奖礼接踵而至。团队问：老板，咱还写代码吗？",
    minStage: 4, weight: 4, once: true,
    choices: [
      {
        id: "pr-limit", text: "定下规矩：每月只接 1 个活动，其余全部拒绝",
        effects: { reputation: 5, product: 5 },
        resultText: "曝光度降了，但你发现产品在投资人面前 speak for itself。真正的口碑开始沉淀。",
        lessonTitle: "创业课 · 虚荣指标",
        lesson: "Paul Graham 警告创业者远离「名利场」：报道、奖项、粉丝数都是虚荣指标（Vanity Metrics），唯一重要的是留存、收入和单位经济。很多明星创业者死在了领奖台上。",
      },
      {
        id: "fame", text: "趁热打铁，个人 IP 也是生产力",
        effects: { reputation: 15, product: -10, morale: -5, flag: "celebrity-founder" },
        resultText: "你的演讲视频播放百万。但季度会上你发现：用户增长没跟上你的知名度，而竞品在你领奖时悄悄上线了杀手功能。",
        lessonTitle: "创业课 · 注意力≠竞争力",
        lesson: "周鸿祎、雷军级别的个人 IP 确实是护城河，但那是打赢了仗之后的麦克风，不是武器本身。产品还没赢之前过度曝光，只会给竞争对手做市场教育。",
      },
    ],
  },
  {
    id: "legal-sue",
    title: "专利流氓/巨头诉讼",
    scene:
      "一封律师函躺在邮箱里：某 NPE（专利流氓）起诉你们侵犯专利，索赔 800 万。和解开价 120 万。律师说：这官司就算赢，也要花 200 万和两年。",
    minStage: 4, weight: 4,
    choices: [
      {
        id: "settle", text: "花 120 万和解，花钱买清净",
        effects: { cash: -12, reputation: -3 },
        resultText: "和解协议保密签署。你安慰自己这是『商业决策』，但钱包和自尊都很疼。",
        lessonTitle: "创业课 · NPE 的商业模式",
        lesson: "专利流氓（Patent Troll）不生产产品，只靠诉讼赚钱。美国每年 NPE 诉讼和解金中位数约 50 万美元。罗永浩曾公开专利流氓威胁，Spotify、特斯拉都交过『保护费』。这不是正义问题，是算术问题。",
      },
      {
        id: "fight", text: "应诉到底，联合行业同盟反诉",
        effects: { cash: -30, months: 1, reputation: 15, flag: "fighter" },
        resultText: "你们联合了 7 家被同一 NPE 骚扰的同行，分摊律师费集体应诉。对方撤诉了。行业记住了你们的名字。",
        lessonTitle: "创业课 · 集体防御",
        lesson: "LOT Network、OIN 等专利保护联盟正是为此而生。面对系统性勒索，单打独斗是下策，行业同盟能把『保护费』变成『抵抗成本』。",
      },
    ],
  },
  {
    id: "supply-chain",
    title: "核心元器件断供",
    scene:
      "你们的独家供应商突然通知：因为某地缘事件，关键芯片/元件断供 6 个月，已付的订金无法退回。产品库存只够 40 天。",
    minStage: 4, weight: 4, condition: (s) => s.industry.id === "hardware" || s.industry.id === "ecom",
    choices: [
      {
        id: "redesign", text: "紧急换方案，用国产/替代料号重新设计",
        effects: { product: -12, months: 1, cash: -20 },
        resultText: "工程师们连续奋战 45 天完成替代设计。新品上市晚了两个月，但你们从此有了双供应商体系。",
        lessonTitle: "创业课 · 单一供应商风险",
        lesson: "2021 全球缺芯让无数硬件公司断粮，而提前双供应商布局的大疆逆势抢下市场。供应链管理不是成本中心，是生死线。",
      },
      {
        id: "wait-supply", text: "等 6 个月，先卖库存",
        effects: { months: 2, mrrPct: -40, morale: -10 },
        resultText: "库存清完的那周，公司陷入停摆。员工开始更新简历，渠道商开始代理竞品。",
        lessonTitle: "创业课 · 停摆的代价",
        lesson: "现金流断裂不会等你『6 个月后重来』。供应商断供期超过 runway 的 50%，就必须启动 B 计划——这是硬件创业的常识。",
      },
    ],
  },
  {
    id: "bad-cofounder-hire",
    title: "请神容易送神难",
    scene:
      "你高薪请来的合伙人级 VP，三个月后原形毕露：KPI 全靠 PPT，开会喊口号，复盘甩锅下属。他/她握着 3% 的期权和一票之差的团队影响力。",
    minStage: 4, weight: 5,
    choices: [
      {
        id: "fast-fire", text: "快速、依法、体面地解除合作（n+1 + 收回未归属期权）",
        effects: { cash: -10, morale: 10, reputation: 3 },
        resultText: "谈话 30 分钟结束。两周后团队效率不降反升——原来大家都在等这个决定。",
        lessonTitle: "创业课 · 快速解雇",
        lesson: "Netflix 的文化圣经：Keeper Test——『如果这个人明天要走，你会不会拼命挽留？』答案是『松口气』就该让他走。错的人每小时都在消耗团队的士气和你的现金。",
      },
      {
        id: "keep", text: "再观察观察，也许下个季度就好了",
        effects: { morale: -12, cash: -15, months: 1 },
        resultText: "又三个月，最好的两个主管因为这人离职。你终于动手了，代价翻了三倍。",
        lessonTitle: "创业课 · 沉没成本陷阱",
        lesson: "『已经给了 3% 期权、已经合作半年』不是继续忍耐的理由。拖延解雇的真正成本 = 拖的时间 ×（此人破坏力 + 替代者产出）。早做决定的创始人，公司活得更久。",
      },
    ],
  },
  {
    id: "friend-money",
    title: "「兄弟」的 50 万",
    scene:
      "发小听说你在创业，凑了 50 万要「入股」：『咱俩谁跟谁，合同就不用了吧？』你妈也打来电话：『你可别坑了人家。』",
    minStage: 1, weight: 5, once: true,
    choices: [
      {
        id: "formal", text: "坚持签正规协议：借款或小额 SAFE，写明风险",
        effects: { cash: 50, debt: 20, reputation: 3 },
        resultText: "发小愣了一下，还是签了。三年后公司波折时他感慨：『幸亏当初你坚持写清楚，不然我连朋友都保不住。』",
        lessonTitle: "创业课 · 亲友钱的铁律",
        lesson: "亲友投资（FF&F Round）是创业第一桶金的常见来源，但无数兄弟反目、亲戚成仇都源于「口头约定」。三条铁律：1) 只拿亏得起的钱 2) 白纸黑字 3) 讲清『这钱可能归零』。",
      },
      {
        id: "handshake", text: "拍胸脯：亏了算我的，赚了分你一半",
        effects: { cash: 50, debt: 50, flag: "informal-debt" },
        resultText: "钱到账很快。但「亏了算我的」这五个字，在你后来最艰难的那个冬天，变成了每晚睡前的一吨铅。",
        lessonTitle: "创业课 · 无限责任的幻觉",
        lesson: "有限责任公司的意义就在这：用公司资产承担风险，不牵连个人和家庭。用个人信用为创业担保，等于把家人也押上牌桌。任正非、史玉柱都曾被巨债压身——不要重复他们的苦难。",
      },
      {
        id: "refuse", text: "婉拒：创业九死一生，不想拿兄弟的钱冒险",
        effects: { morale: 3 },
        resultText: "发小有点失落，但你们的酒一直喝到了今天。",
        lessonTitle: "创业课 · 拒绝也是保护",
        lesson: "不是所有送上门的钱都要接。拿不到机构钱只能借亲友钱时，先问自己：这笔钱亏掉，我们的关系还在吗？创业者最大的善良，是不让爱你的人为你的梦想陪葬。",
      },
    ],
  },
  {
    id: "first-revenue",
    title: "第一笔「大订单」骗局",
    scene:
      "一位「渠道大佬」承诺一次性采购全年服务，金额是你月营收的 8 倍。条件：先付 30% 定金…但要求你开全额发票、先返 10% 「渠道服务费」。",
    minStage: 2, weight: 5, once: true,
    choices: [
      {
        id: "spot-scam", text: "查对方公司背景，要求对公账户+标准合同，婉拒返点",
        effects: { reputation: 2 },
        resultText: "工商信息一查：成立 3 个月，参保人数 0。你礼貌拒绝。一周后新闻爆出同手法骗了同行 300 万。",
        lessonTitle: "创业课 · 创业骗局图鉴",
        lesson: "「先返点」「高开票」「代采返佣」是经典的创业诈骗三件套，专杀缺现金的初创公司。记住：任何让你先付钱的「大订单」，都是猎人在收智商税。",
      },
      {
        id: "bite", text: "机会难得，冒险签了",
        effects: { cash: -25, months: 1, morale: -8 },
        resultText: "对方付款到账后迅速要求退款「走流程」，你才发现发票和合同全是坑。追讨三个月，只追回一半。",
        lessonTitle: "创业课 · 现金饥渴是命门",
        lesson: "骗子最懂创业者：缺现金的人判断力会系统性下降。越是缺钱，越要守住合同与账期的底线——VC 尽调时会翻看你的重大合同，被骗经历暴露的是风控能力。",
      },
    ],
  },
  {
    id: "office-landlord",
    title: "二房东的温柔刀",
    scene:
      "现在的联合办公到期了。中介带你看了一处「政府补贴园区」，押二付三、装修补贴、税收返还，听起来完美。法务提醒你：合同主体是一家成立 4 个月的空壳公司。",
    minStage: 2, weight: 4,
    choices: [
      {
        id: "verify", text: "核实产权与出租方资质，宁可贵一点签正规园区",
        effects: { cash: -6 },
        resultText: "多花了 20% 租金，但房产证、消防、租约全部合规。两年后你才知道当初那个「补贴园区」卷款跑路了。",
        lessonTitle: "创业课 · 办公室骗局",
        lesson: "「二房东跑路」是创业公司的经典死法：预付的押金装修款一夜蒸发。租办公室的尽调清单：产权证明、出租方征信、发票能否开具、同楼栋其他租户口碑。",
      },
      {
        id: "cheap", text: "便宜就是硬道理，签！",
        effects: { cash: -15, months: 1, morale: -10, addTag: "office-scam" },
        resultText: "第四个月，物业贴出清场公告。你和团队抱着电脑站在路边办公的照片，成了行业群里的「今日最佳」。",
        lessonTitle: "创业课 · 便宜的代价",
        lesson: "WeWork 泡沫破裂后全球创业公司学到一课：办公成本每省一分都是利润，但「省」的前提是法律安全。押二付三给空壳公司的 15 万，比贵 20% 的正规园区贵得多。",
      },
    ],
  },
  {
    id: "family-pressure",
    title: "家里的电话",
    speaker: "mom",
    scene:
      "妈：「你爸的检查报告出来了，情况不太好。家里不缺钱，就缺你回来一趟。」\n三年没回家过年了。电话这头的妈妈很平静。你看着刚融到的钱和排满的发布计划。",
    minStage: 3, weight: 5,
    choices: [
      {
        id: "go-home", text: "立刻订票回家，工作远程安排",
        effects: { months: 1, health: 10, morale: 5, product: -5 },
        resultText: "你在病床前守了两周。离开那天爸爸摆摆手：『去吧，好好干。』回公司的飞机上你哭了一场，然后好好睡了一觉——三年来第一次。",
        lessonTitle: "创业课 · 为了什么创业",
        lesson: "Y Combinator 的「Make something people want」前面其实还有半句人生前提：别在创造财富的路上弄丢了为什么出发。硅谷无数创始人在公司上市那年离婚或错过亲人最后一面——那不是成功的代价，是失败的另一种写法。",
      },
      {
        id: "stay", text: "让家人先撑着，等这轮融资交割就回去",
        effects: { health: -15, morale: -8, flag: "family-gap" },
        resultText: "融资交割那天，爸爸的手术已经做完了。电话那头说「一切都好」。你盯着香槟，一点味道都尝不出来。",
        lessonTitle: "创业课 · 不可逆清单",
        lesson: "管理学有个「不可逆清单」：有些事错过就永远错过。钱可以以后赚，有些时刻没有以后。成熟创业者会提前定义：什么情况下公司必须为人生让路。",
      },
    ],
  },
  {
    id: "churn-spike",
    title: "留存断崖：用户在集体出走",
    scene:
      "数据分析会一片死寂：次月留存从 41% 跌到 17%。用户调研的反馈高度一致——「新鲜感过了，没啥用」。拉新团队的眼神在问你：我们还在往漏水的桶里灌水吗？",
    minStage: 4, weight: 7, once: true,
    choices: [
      {
        id: "pause-growth", text: "砍投放、全员扑留存：逐户回访流失用户，重做核心功能",
        effects: { usersPct: -10, product: 15, cash: -10, mrrPct: 10, morale: -5 },
        resultText: "三个月，你们打了一场没人喝彩的仗。留存回到 35%，投放重新打开时，每一分钱都花在了会变老的用户身上。",
        lessonTitle: "创业课 · 留存优先于增长",
        lesson: "YC 合伙人 Lenny Rachitsky 的数据：留存曲线才是产品的 ECG（心电图）。Facebook 当年砍掉了所有拉新预算死磕留存曲线变平。增长黑客的前提，是桶先不漏水。",
      },
      {
        id: "double-ads", text: "加大投放盖过流失，用规模换时间",
        effects: { cash: -40, usersPct: 30, mrrPct: -10, morale: -8 },
        resultText: "用户总量还在涨，投资人周报很好看。但你知道真相在 cohort（同期群）数据里：每一批新用户都在以同样的速度流失。",
        lessonTitle: "创业课 · 虚荣指标陷阱",
        lesson: "总用户数是会骗人的指标。LinkedIn 创始人 Reid Hoffman：「只要看留存曲线能不能变平，就知道产品有没有 PMF。」用投放掩盖留存问题，等于给癌症病人化妆。",
      },
    ],
  },
  {
    id: "app-store-rejection",
    title: "平台方的一纸下架令",
    scene:
      "凌晨邮件：应用商店以「违规收集数据」为由下架了你的 App，没有申诉入口，没有具体条款。你的 60% 新增来自这个渠道。渠道经理的电话永远占线。",
    minStage: 4, weight: 5, once: true,
    condition: (s) => ["consumer", "game", "ai"].includes(s.industry.id),
    choices: [
      {
        id: "multi-channel", text: "紧急全量铺设独立渠道：官网直装、小程序、海外镜像",
        effects: { months: 1, cash: -20, usersPct: -15, flag: "channel-diversified" },
        resultText: "阵痛两个月后，你们的渠道结构从 6:4 变成了 3:3:4。再收到下架通知时，你第一次能睡个好觉。",
        lessonTitle: "创业课 · 渠道即命脉",
        lesson: "Zynga 被 Facebook 算法调整一刀砍残、无数淘宝店主死于平台规则变更。平台方的每一次「优化」，对依赖它的公司都是地震。铁律：单一渠道占比不超过 40%。",
      },
      {
        id: "beg", text: "托关系找人疏通，先恢复上架再说",
        effects: { cash: -15, reputation: -5, months: 1 },
        resultText: "上架恢复了，但每三个月同样的邮件还会来一次。你成了平台规则的人质。",
        lessonTitle: "创业课 · 人质困境",
        lesson: "靠关系恢复的单次解，不改变权力结构。Epic 起诉苹果 App Store 抽成（30%），赢回了第三方支付——改变规则的永远是「有底气掀桌子的人」，而底气来自渠道多元化。",
      },
    ],
  },
  {
    id: "board-fight",
    title: "董事会政变",
    scene:
      "A 轮领投资董事联合两位外部董事发来会议通知：议题是「讨论 CEO 的继任方案」。你翻开当初签的条款——B 类股、保护性条款、董事席位 2:2:1，你发现自己可能赢不了这场投票。",
    minStage: 5, weight: 6, once: true,
    condition: (s) => s.tags.includes("toxic-terms") || s.morale < 40,
    choices: [
      {
        id: "negotiate-seat", text: "私下逐个沟通，用增长数据+个人让步换取支持",
        effects: { reputation: -5, morale: 5, flag: "survived-coup" },
        resultText: "你在两周内谈了七次。最终方案：你保留 CEO 但交出部分董事会权力。走出会议室时你后背全湿——但公司还是你的。",
        lessonTitle: "创业课 · 公司治理 survival",
        lesson: "Uber 的 Travis Kalanick 在投资人逼宫下辞职；WeWork 的 Neumann 被董事会废黜。董事会政治学是创始人的必修课：股份比例 ≠ 控制权，投票权结构（Voting Structure）才是。早期就埋下 AB 股或一致行动人安排。",
      },
      {
        id: "step-aside", text: "体面让位，保留股份和董事席位",
        effects: { morale: -10, reputation: 3, health: 10 },
        resultText: "交棒那天你在车库坐了很久。后来公司在新 CEO 手里真的做大了——你的股份反而更值钱了。说不憋屈是假的，但你保住了最重要的东西。",
        lessonTitle: "创业课 · 何时放手",
        lesson: "Google 的佩奇曾把 CEO 让给施密特十年再回归；Twitter 创始人多尔西被赶走又回归。让位不等于失败——持有 20% 的上市公司股份，好过持有 100% 的沉船。",
      },
    ],
  },
  {
    id: "hiring-spree",
    title: "融资到账后的「甜蜜陷阱」",
    scene:
      "A 轮 8000 万到账的第二周，各部门的编制申请像雪片一样飞来：市场部要扩三倍，行政要换写字楼，HR 说「对标大厂福利才能吸引人才」。你的 CFO 在桌下踢你：钱是这么烧的？",
    minStage: 5, weight: 6, once: true,
    condition: (s) => s.cash > 150,
    choices: [
      {
        id: "discipline", text: "立下军规：钱只花在验证过的增长引擎上，编制冻结 90 天",
        effects: { morale: -8, cash: 10, mrrPct: 8 },
        resultText: "抱怨声持续了一个月。但 90 天后，你们的单位经济模型比融资前更健康，而隔壁赛道的竞品已经因为疯狂扩张进了裁员名单。",
        lessonTitle: "创业课 · 融资后的纪律",
        lesson: "研究显示：大额融资后的 18 个月是创业公司死亡高发期——钱太多比钱太少更考验定力。亚马逊的「Day 1」信条、字节早期的「延迟满足」，本质都是对抗资本带来的熵增。",
      },
      {
        id: "spend", text: "兵马未动粮草先行，全面扩张抢占窗口期",
        effects: { cash: -100, team: 5, usersPct: 25, morale: 10 },
        resultText: "办公室热闹得像过年，工位从一层扩到三层。但月消耗从 40 万涨到 130 万，你忽然理解了什么叫「增长吞噬现金」。",
        lessonTitle: "创业课 · 扩张的数学",
        lesson: "盲目扩张的财务逻辑：团队×5 ≠ 产出×5（ Brooks 定律：向延期的项目加人只会让它更延期）。Quibi 融了 17.5 亿美元两年烧光倒闭——钱能买来速度，也能买来规模化的错误。",
      },
    ],
  },
  {
    id: "tech-paradigm",
    title: "技术范式突变",
    scene:
      "一夜之间，行业被新技术范式颠覆：你的核心产品路线被判定为「上一代方案」。团队里年轻的工程师眼神发亮地想重做，老员工觉得你在背叛过去三年的积累。",
    minStage: 4, weight: 5, once: true,
    condition: (s) => s.product > 50,
    choices: [
      {
        id: "embrace", text: "壮士断腕：抽调 70% 力量 all-in 新范式，老产品维持运营",
        effects: { product: -20, months: 1, cash: -30, morale: -10, mrrPct: 15, flag: "pioneer" },
        resultText: " cannibalize 自己的产品是最疼的决策。但六个月后，当同行们开始恐慌性转型时，你们已经坐在了新牌桌的头位。",
        lessonTitle: "创业课 · 自我颠覆",
        lesson: "Netflix 亲手杀掉 DVD 邮寄业务全力流媒体、苹果 iPhone 发布时乔布斯说「会蚕食我们自己的 iPod——但与其别人蚕食，不如我们自己来」。柯达发明了数码相机却死于数码——杀死你的常常是你最擅长的东西。",
      },
      {
        id: "defend", text: "坚守现有路线，新技术还不成熟，等它泡沫破裂",
        effects: { product: 10, mrrPct: -15, morale: -5 },
        resultText: "你赌对了一半——泡沫确实会破裂。但用户回不来了：他们已经在新平台上重建了工作流。诺基亚押注 Symbian 的教训重演了一次。",
        lessonTitle: "创业课 · 创新者的窘境",
        lesson: "克里斯坦森的名著揭示：管理最好的公司最容易被颠覆，因为它们只听取最优质客户的声音，而颠覆恰恰从边缘市场开始。对范式转移，正确的姿势是「永远留一张新牌桌的门票」。",
      },
    ],
  },
  {
    id: "whale-churn",
    title: "鲸鱼客户搁浅",
    scene:
      "那份占你营收 40% 的大客户合同到期了。对方的新采购负责人面无表情：「我们要重新招标，你们的报价比新玩家高 30%。」你的现金流预测表上，未来六个月的窟窿像深渊。",
    minStage: 5, weight: 6,
    condition: (s) => s.tags.includes("whale-dependency"),
    choices: [
      {
        id: "diversify-fast", text: "把续约团队改成独立销售军团，90 天冲刺客户多元化",
        effects: { months: 1, cash: -20, mrrPct: -5, morale: -5, flag: "diversified" },
        resultText: "最终鲸鱼还是走了，但你们抢下了 12 个中小客户——单个都不大，加起来超过了原合同的 70%。集中度降到了 25%。",
        lessonTitle: "创业课 · 客户集中度的救赎",
        lesson: "失去大客户不是灾难，依赖才是。Salesforce 早期立下军规：没有任何客户贡献超过 10% 营收。分散的客户组合让公司抗风险能力指数级提升。",
      },
      {
        id: "discount-keep", text: "降价 30% + 加定制服务，无论如何先留住它",
        effects: { mrrPct: -25, cash: 10, morale: -10, flag: "deeper-whale" },
        resultText: "客户留下了。但你算了一笔账：这单现在几乎不赚钱，团队 40% 的产能被锁死。你保住了报表，押上了未来。",
        lessonTitle: "创业课 · 利润与规模的伪命题",
        lesson: "「战略性亏损」是创业者对自己说过最多的谎话。降价换来的续约只会招来下一轮更狠的压价。报价体系一旦崩溃，重建需要五年。",
      },
    ],
  },
  {
    id: "ip-theft-leak",
    title: "前员工带走的「代码」",
    scene:
      "离职三个月的前技术负责人创业了，产品界面和你的像亲兄弟，连埋的几个彩蛋都一模一样。法务评估：能告，但取证难、周期长、赢了也未必赔多少。",
    minStage: 4, weight: 4, once: true,
    choices: [
      {
        id: "sue", text: "起诉 + 公开声明，杀鸡儆猴",
        effects: { cash: -20, months: 1, reputation: 5, morale: -3 },
        resultText: "官司打了一年，庭前和解了。但圈内都知道了你「不好惹」，之后再没发生过类似的事。",
        lessonTitle: "创业课 · 知识产权防御战",
        lesson: "可口可乐的配方、腾讯的「南山必胜客」、华为对三星的专利反诉——IP 是沉默的护城河。竞业协议、代码权限分级、离职审计，要在信任尚存时就布好。",
      },
      {
        id: "outrun", text: "不纠缠，用三倍速度把它甩在身后",
        effects: { product: 12, cash: -10, morale: 5, flag: "outrun-copy" },
        resultText: "你把愤怒全部写进了代码。一年后对方的产品还停留在抄袭你的那一版，而你已经迭代了八个版本。",
        lessonTitle: "创业课 · 最好的报复是领先",
        lesson: "腾讯被抄袭困扰多年后的解法：微创新+开放平台，让抄袭者追不上迭代速度。法律是底线武器，速度才是终极防御——代码会过时，组织能力不会。",
      },
    ],
  },
  {
    id: "license-crackdown-game",
    title: "版号寒冬",
    scene:
      "监管部门通知：你的游戏/内容产品需要重新送审，审批周期 6-12 个月，期间不得商业化。团队用三年打磨的作品，命运突然悬在了一张批文上。",
    minStage: 3, weight: 5, once: true,
    condition: (s) => s.industry.id === "game" || s.industry.regRisk >= 0.3,
    choices: [
      {
        id: "oversea", text: "转战海外发行：翻译、本地化、买量，全组转型出海",
        effects: { months: 2, cash: -30, usersPct: 20, mrrPct: 15, morale: -10, flag: "gone-global" },
        resultText: "出海的第一年极其狼狈：不懂当地文化、渠道规则、支付方式。但第二年，海外收入超过了原计划的国内收入三倍。",
        lessonTitle: "创业课 · 出海求生",
        lesson: "2018 年游戏版号停发 9 个月，腾讯网易重挫，而莉莉丝、米哈游靠出海逆势崛起（《原神》海外收入占七成）。监管风险的本质是单一市场依赖——「东方不亮西方亮」是血泪换来的智慧。",
      },
      {
        id: "wait-license", text: "按兵不动，打磨产品等批文",
        effects: { months: 2, cash: -25, morale: -15, product: 10 },
        resultText: "批文终于下来了，但市场窗口已经错过：同类玩法被三家竞品做烂，用户审美疲劳。你赢回了资格，输掉了时机。",
        lessonTitle: "创业课 · 时机是隐形的成本",
        lesson: "创业的第一死因不是没钱，是「等」。时机成本从不在财务报表上体现，却真实吞噬着一切。 waiting is a decision——而且通常是最贵的那个。",
      },
    ],
  },
  {
    id: "scandal-traditional",
    title: "黑天鹅飞进后厨",
    scene:
      "一段视频在网络疯传：你们某家门店的后厨卫生问题被曝光，评论区一片「再也不去了」。你是连锁模式，一夜之间所有门店的流水掉了三成。",
    minStage: 3, weight: 4, once: true,
    condition: (s) => s.industry.id === "traditional" || s.industry.id === "ecom",
    choices: [
      {
        id: "full-transparency", text: "后厨直播+全线自查+受害门店停业整顿，CEO 出镜道歉",
        effects: { cash: -30, reputation: 8, usersPct: -10, morale: -5 },
        resultText: "道歉视频下的最高赞评论：「至少敢开直播」。三个月后流水恢复，「透明后厨」反而成了你们的品牌标签。",
        lessonTitle: "创业课 · 餐饮/实业危机公关",
        lesson: "海底捞「老鼠门」事件：两小时道歉、涉事门店停业、所有后厨开放参观——股价在三个月后创新高。实体行业的信任是日积月累的玻璃，碎了就用透明重建。",
      },
      {
        id: "franchise-blame", text: "撇清：那是加盟商/供应商的问题",
        effects: { reputation: -15, usersPct: -20, morale: -8 },
        resultText: "律师说从合同角度你没错。但消费者不在乎合同——在他们眼里，招牌是你的，责任就是你的。",
        lessonTitle: "创业课 · 品牌连带责任",
        lesson: "麦当劳被「福喜过期肉」拖累、蜜雪冰城食安问题永远算在品牌头上。加盟/供应链模式的悖论：你靠别人的手赚钱，就要为别人的错道歉。管理半径决定品牌命运。",
      },
    ],
  },
  {
    id: "angel-portfolio-crash",
    title: "被投公司连环爆雷",
    scene:
      "你的投资组合接连出事：A 公司创始人跑路、B 公司账目造假、C 公司被投资人集体诉讼。LP（出资人）的电话打进来：「你的尽调是怎么做的？」你的声誉和下一期基金都悬了。",
    minStage: 3, weight: 5, once: true,
    condition: (s) => s.industry.id === "angel",
    choices: [
      {
        id: "write-down", text: "主动核销坏账，向 LP 出详细复盘报告，建立投后风控体系",
        effects: { cash: -40, reputation: 8, months: 1 },
        resultText: "报告发出去的当晚，一位老 LP 回邮件：「亏钱我见过，敢认账的投资人我第一次见。」下一期基金的承诺出资额反而多了。",
        lessonTitle: "创业课 · 投资人的信任账户",
        lesson: "天使投资的失败率天然 60%+，LP 要的不是永不踩雷，而是踩雷后的诚实与体系。红杉也会投错——区别在错误率、认错速度和复盘质量。",
      },
      {
        id: "cover", text: "隐瞒亏损，用新项目的估值美化报表",
        effects: { reputation: -20, flag: "fund-fraud" },
        resultText: "纸包不住火。一位 LP 委托第三方审计后，你在圈内的名声先于基金破产了。",
        lessonTitle: "创业课 · 基金界的integrity",
        lesson: "WeWork 诺伊曼夸大财务数据、Theranos 血检造假——金融业的每一次崩塌都始于「让报表好看一点」。投资圈的口碑是复利最慢的资产，也是复利最狠的惩罚。",
      },
    ],
  },
  {
    id: "egg-cash-king",
    title: "🥚 彩蛋 · 「现金王」的悖论",
    scene:
      "会计师指着报表欲言又止：「您账上的现金比很多上市公司都多……但估值反而在跌。」你盯着屏幕陷入沉思——钱在手上，为什么公司越来越不值钱？（你已触发隐藏事件：现金与估值的悖论）",
    minStage: 4, weight: 0, once: true,
    condition: (s) => s.cash > 260 && s.mrr < 12 && !s.tags.includes("egg-cash-king"),
    choices: [
      {
        id: "deploy", text: "顿悟：钱要变成增长才有价值。把 30% 现金投入已验证的增长引擎",
        effects: { cash: -60, mrrPct: 30, valuationPct: 20, flag: "egg-cash-king" },
        resultText: "三个月后，钱变成了用户、口碑和营收曲线。估值开始跟着 MRR 起飞。你悟了：现金是弹药，不是勋章。🥚 彩蛋成就：现金的觉醒",
        lessonTitle: "创业课 · 现金的三种命运",
        lesson: "现金只有三种健康去向：1) 投入已验证的增长（ROIC 为正）2) 变成护城河（技术、牌照、人才）3) 备足 12 个月 runway 的余量。趴在账上的现金会被通胀和「不增长即贬值」的估值逻辑双重吞噬。",
      },
      {
        id: "hoard", text: "乱世现金为王，继续捂着",
        effects: { valuationPct: -10, flag: "egg-cash-king" },
        resultText: "现金还在，估值又跌了 10%。市场用真金白银给你上了一课。🥚 彩蛋成就：现金的觉醒（以反面教材的方式）",
        lessonTitle: "创业课 · 为什么现金多估值反而低",
        lesson: "估值的本质是未来现金流的折现。账上现金不产生增长信号时，投资人只会按「净资产+微量溢价」定价；而增长中的公司按「想象力」定价。现金决定你活多久，增长决定你值多少。",
      },
    ],
  },
  {
    id: "egg-musk-interview",
    title: "🥚 彩蛋 · 第一性原理的顿悟",
    scene:
      "深夜改 BP 时你突然问自己：「如果物理上可行，为什么我做不到？」一种久违的兴奋感涌上来——你发现自己正在用「第一性原理」拆解行业假设。窗外星光正好。🥚 隐藏彩蛋已触发：第一性原理",
    minStage: 2, weight: 0, once: true,
    condition: (s) => /musk|elon|马斯克|钢铁侠/i.test(s.name),
    choices: [
      {
        id: "first-principles", text: "把行业成本结构推倒重来，按物理极限重新设计产品",
        effects: { product: 15, valuationPct: 15, morale: 10, flag: "egg-first-principles" },
        resultText: "你砍掉了一个被整个行业视为「理所当然」的成本项。三个月后，对手们开始研究你的发布会录像。🚀「当别人用类比思考，我们用第一性原理。」",
        lessonTitle: "创业课 · 第一性原理（First Principles）",
        lesson: "SpaceX 把火箭成本从 6500 万美元打到 6000 万分之一的原因：不问「火箭为什么这么贵」，而问「造火箭的原材料值多少钱」（答案是售价的 2%）。类比思维让你成为更好的抄袭者，第一性原理让你成为颠覆者。",
      },
    ],
  },
  {
    id: "egg-garage",
    title: "🥚 彩蛋 · 车库里的第一台服务器",
    scene:
      "搬新办公室时，你在角落的纸箱里翻出了创业第一天用的那台旧笔记本——键盘缺了两个键，风扇声像拖拉机。你把它擦干净，摆在了新工位最显眼的位置。🥚 隐藏彩蛋已触发：不忘初心",
    minStage: 4, weight: 0, once: true,
    condition: (s) => s.product >= 90 && s.team >= 6 && !s.tags.includes("egg-garage"),
    choices: [
      {
        id: "keep-it", text: "把旧电脑供起来，给新员工讲「第一天」的故事",
        effects: { morale: 15, reputation: 5, flag: "egg-garage" },
        resultText: "新员工入职仪式多了一项：摸一摸那台缺键的笔记本。团队里流传着你的传说，文化成了最值钱的资产。🥚 彩蛋成就：不忘初心",
        lessonTitle: "创业课 · 文化不是墙上的标语",
        lesson: "亚马逊把门板当办公桌的传统保留了二十年、奈飞的「自由与责任」文化手册被硅谷疯传。伟大的公司都用「物」承载故事——旧电脑、第一笔订单、第一次失败。文化是公司的免疫系统。",
      },
    ],
  },
  // ── 行业专属事件：硬件 ────────────────────────────────────────────────────
  {
    id: "yield-hell",
    title: "量产良率地狱",
    scene:
      "代工厂传来消息：首批量产的良率只有 41%——每两个产品就有一个点亮失败。工程师说可能是散热设计余量不足，重做要 6 周；工厂建议「放宽检验标准先出货」。客户的首批订单还在等。",
    minStage: 3, weight: 6, once: true,
    condition: (s) => s.industry.id === "hardware",
    choices: [
      {
        id: "fix-design", text: "暂停出货，花 6 周重做散热与公差设计",
        effects: { months: 1, cash: -25, product: 15, reputation: 5 },
        resultText: "六周后良率爬到 92%。晚交付一个月，但你没有让 59% 的残次品流向市场——那个决定替你省下了未来三年的口碑债。",
        lessonTitle: "创业课 · 产能地狱",
        lesson: "Tesla Model 3 的「产能地狱」让马斯克睡在工厂，但坚持重质量不放手；小米早期靠代工质量管控打出口碑。硬件的良率是品牌的物理上限——放宽标准等于向未来借高利贷。",
      },
      {
        id: "ship-anyway", text: "放宽标准先出货，别让现金流断掉",
        effects: { cash: 20, reputation: -15, usersPct: 20, mrrPct: -15 },
        resultText: "前三个月出货顺利。第四个月，退货和差评像雪崩一样到来，渠道商要求全线召回。省下的时间连本带利还了回去。",
        lessonTitle: "创业课 · 质量的复利与单利",
        lesson: "硬件召回的成本 = 物流 + 商誉 + 渠道信任，通常是预防成本的十倍。三星 Note7 召回损失超 50 亿美元。质量是复利资产：省一次，亏十次。",
      },
    ],
  },
  {
    id: "mold-cost",
    title: "开模费的悬崖",
    scene:
      "结构设计定稿了。代工厂报价单上有一行刺眼数字：开模费 45 万，一次付清。账上的现金瞬间见底，但不开模就永远停在「漂亮的原型」阶段。",
    minStage: 2, weight: 5, once: true,
    condition: (s) => s.industry.id === "hardware",
    choices: [
      {
        id: "pay", text: "咬牙付清，压缩其他开支",
        effects: { cash: -45, product: 20, morale: -5 },
        resultText: "模具到厂那天你围着它转了三圈。45 万买的不只是塑料和钢，是从「手工作坊」跨向「产品公司」的门票。",
        lessonTitle: "创业课 · 硬件的固定成本悬崖",
        lesson: "硬件创业最难的不是技术，是固定成本悬崖：开模、认证、首批物料都是「不付就没有然后」的钱。大疆、韶音都经历过「账上只够一次开模」的时刻。融不到钱连犯错的资格都没有。",
      },
      {
        id: "3dprint", text: "先用 3D 打印小批量验证，攒够钱再开模",
        effects: { months: 2, product: 8, cash: -8, flag: "slow-mold" },
        resultText: "你用 3D 打印交付了第一批「丑但能用」的产品。速度慢了一半，但你还活着——而且第二批用户的需求反馈直接改进了开模设计。",
        lessonTitle: "创业课 · 分阶段验证",
        lesson: "Tesla Roadster 用 Lotus 的底盘先验证市场；Pebble 手表用 Kickstarter 预付款开模。硬件的铁律：让每一笔钱只为「验证下一个假设」服务，而不是一步到位。",
      },
    ],
  },
  // ── 行业专属事件：软件/SaaS ────────────────────────────────────────────────
  {
    id: "deploy-outage",
    title: "上线发布夜的大翻车",
    scene:
      "大版本发布，全组加班到凌晨。切换流量的瞬间，数据库连接池打满、核心接口超时、刚进来的用户看到满屏报错。回滚要 40 分钟，硬修可能两小时也可能更糟。监控群里甲方客户已经截图发问。",
    minStage: 3, weight: 6, once: true,
    condition: (s) => ["ai", "consumer"].includes(s.industry.id),
    choices: [
      {
        id: "rollback", text: "立即回滚，先保稳定，白天再复盘",
        effects: { reputation: 5, product: -3, morale: -5 },
        resultText: "回滚 40 分钟完成，用户几乎无感。第二天的复盘会上，你们立下「发布红线」：任何变更可回滚、灰度先行。",
        lessonTitle: "创业课 · 可回滚的发布",
        lesson: "Knight Capital 2012 年因一次没有回滚方案的系统部署，45 分钟亏 4.4 亿美元直接破产。谷歌 SRE 的黄金法则：发布的第一优先级不是新功能，是随时可以撤回。稳定性是 SaaS 的合同本体。",
      },
      {
        id: "fix-forward", text: "现场硬修，赌一把凌晨人少",
        effects: { product: 10, reputation: -12, usersPct: -10, health: -5 },
        resultText: "凌晨两点终于修好了，但欧洲时区的客户已经上班。早上的技术社区出现了长文：《某服务凌晨宕机三小时始末》。",
        lessonTitle: "创业课 · 修复 vs 回滚的算术",
        lesson: "fix-forward 的期望收益只有在「故障域极小+回滚成本极高」时才成立。AWS 的 Well-Architected 框架第一条就是「设计失败」：假设一切会崩，让崩的时候代价最小。",
      },
    ],
  },
  {
    id: "api-dep",
    title: "赖以生存的 API 突然涨价 8 倍",
    scene:
      "邮件来得毫无预兆：你们调用量最大的第三方 API（地图/大模型/支付）宣布新定价，成本涨 8 倍，30 天后生效。你的产品 60% 的核心功能都建立在它上面。",
    minStage: 3, weight: 5, once: true,
    condition: (s) => ["ai", "consumer", "fintech"].includes(s.industry.id),
    choices: [
      {
        id: "self-host", text: "三个月自研替代方案，长痛不如短痛",
        effects: { months: 1, cash: -30, product: 5, mrrPct: 10, flag: "self-hosted" },
        resultText: "三个月地狱般的迁移。但当新价生效那天，你淡定地喝着咖啡看同行哀嚎——核心技术握在自己手里的感觉，是创始人的终极安全感。",
        lessonTitle: "创业课 · API 依赖症",
        lesson: "Twitter API 涨价逼死了大批第三方客户端、Reddit API 改革引发黑屏抗议、某大模型厂商一次调价让无数套壳产品瞬间归零。技术栈的「单点依赖」和供应链单一供应商是同一个病。",
      },
      {
        id: "absorb", text: "咬牙接受涨价，先保住增长",
        effects: { mrrPct: -15, cash: -15, morale: -3 },
        resultText: "毛利率被砍了一大刀。你开始理解：你们不是在为自己打工，是在为那家 API 公司打工。",
        lessonTitle: "创业课 · 利润的归属权",
        lesson: "如果你的成本结构里有一个随时能掐你脖子的变量，利润就不属于你。Zapier 早期的策略是「API 之上建护城河，但绝不把命脉交出去」。议价能力 = 可替代性。",
      },
      {
        id: "multicloud", text: "立刻接入两家备选供应商，动态切换流量",
        effects: { cash: -12, product: -8, morale: -5 },
        resultText: "切换层写得极其痛苦，但你从此有了谈判筹码。下次续约，对方主动给了折扣。",
        lessonTitle: "创业课 · 永远留有 Plan B 的接口",
        lesson: "Netflix 的 Chaos Monkey 故意随机关停服务来逼系统具备容错能力。对供应商也是：架构上预留 20% 的「可替换性」，成本是平时的麻烦，收益是危机时的生路。",
      },
    ],
  },
  {
    id: "private-deploy",
    title: "大客户要「私有化部署」",
    scene:
      "一家大型集团客户递来意向：年合同额是你现在 MRR 的三倍，但要求整套系统私有化部署到他们的机房，外加三个月定制改造和专属驻场团队。签，等于为一个大客户变成项目公司；不签，现金流的窟窿补不上。",
    minStage: 4, weight: 5, once: true,
    condition: (s) => s.industry.id === "ai",
    choices: [
      {
        id: "standard-only", text: "只接受标准 SaaS 版本：「我们的产品是标准品」",
        effects: { morale: 5, reputation: 3 },
        resultText: "对方愣了一下，两个月后回来说服了自己的 IT 委员会：用你们的标准版。你守住了产品化路线，团队士气为之一振。",
        lessonTitle: "创业课 · SaaS 的纪律",
        lesson: "Atlassian 上市前坚持不做任何定制、Salesforce 靠标准产品打天下。私有化部署的隐性成本：代码分支维护、版本升级噩梦、销售定制军备竞赛。标准产品的拒绝能力，是 SaaS 估值倍数的来源。",
      },
      {
        id: "take-private", text: "签！营收先救命，定制化以后再说",
        effects: { cash: 40, mrrPct: 35, product: -10, morale: -8, flag: "project-company" },
        resultText: "合同到账的那一刻很香。但半年后你们的代码库变成了「一个标准版+三个定制版」，每次发版都像排雷。你隐约看到了自己正在变成一家外包公司。",
        lessonTitle: "创业课 · 收入的质量",
        lesson: "投资人给 SaaS 高估值是因为「可复制、可规模化的收入」。定制项目收入估值倍数只有标准 SaaS 的零头。短期现金流和长期估值的取舍，是增长期创始人最贵的选择题。",
      },
    ],
  },
  // ── 行业专属事件：游戏 ────────────────────────────────────────────────────
  {
    id: "channel-negotiation",
    title: "渠道分成谈判：五五开还是自立门户？",
    scene:
      "你们的游戏冲上榜单，渠道方派来商务：「恭喜！续约条件谈一下——分成比例从 30% 提到 50%，顺便独家首发给我们。」与此同时，自建官网/官服的技术方案也摆在你桌上。",
    minStage: 4, weight: 5, once: true,
    condition: (s) => s.industry.id === "game",
    choices: [
      {
        id: "accept-channel", text: "接受 50% 分成：大树底下好乘凉",
        effects: { usersPct: 25, mrrPct: 20, morale: -5 },
        resultText: "流量确实更猛了，但你算了笔账：每收入 100 元，渠道拿 50、税后再扣，团队到手刚够发工资。你成了渠道的内容供应商。",
        lessonTitle: "创业课 · 渠道霸权",
        lesson: "苹果 App Store 与 Epic 的「30% 税」大战打到最高法院；国内安卓渠道 50% 分成逼出米哈游《原神》拒绝上架硬核联盟的豪赌——结果原神 80% 收入来自官服。渠道是放大器，也是抽血泵。",
      },
      {
        id: "self-publish", text: "拒绝独家，自建官服+多端发行（TapTap/Steam/海外）",
        effects: { usersPct: -15, mrrPct: 10, cash: -20, flag: "self-published" },
        resultText: "短期流水跌了，但用户数据第一次完整躺在你们自己的后台。社区直接对话玩家，口碑开始自增长。三个月后，官服流水反超渠道服。",
        lessonTitle: "创业课 · 用户资产的所有权",
        lesson: "心动 CEO 黄一孟做 TapTap 的初心就是「不让渠道吃独食」；Steam 让独立开发者直连全球玩家。谁握着用户数据和关系，谁就握着定价权与续命粮。",
      },
    ],
  },
  {
    id: "cheat-farm",
    title: "外挂与打金工作室攻陷服务器",
    scene:
      "排行榜前十里有六个是脚本号，打金工作室批量刷资源挂到交易平台，正常玩家在世界频道刷屏退游。技术组给出方案：上高强度反作弊（误伤风险）或做经济系统大改（伤筋动骨）。运营组哀求：「先出活动稳一稳吧。」",
    minStage: 4, weight: 5, once: true,
    condition: (s) => s.industry.id === "game",
    choices: [
      {
        id: "war-on-cheat", text: "铁腕治理：封号+法律函+交易溯源三管齐下",
        effects: { cash: -15, usersPct: -8, reputation: 10, morale: 5, flag: "clean-server" },
        resultText: "两周封了 12 万个号，法务给三个工作室发函。硬核玩家在社区刷屏：「这官方能处。」留存率止跌回升。",
        lessonTitle: "创业课 · 游戏经济的央行职责",
        lesson: "腾讯游戏安全团队万人规模打击外挂，PUBG 因外挂流失过半用户。游戏公司本质是虚拟经济的中央银行：通胀（工作室刷金）不治理，货币（玩家信任）就崩盘。治理的短期阵痛远小于失控的慢性死亡。",
      },
      {
        id: "look-away", text: "睁一只眼闭一只眼，反正他们也在充钱",
        effects: { cash: 10, usersPct: -20, reputation: -10, morale: -5 },
        resultText: "工作室的月卡收入确实进账了。但正常玩家的道具被通胀稀释，三个月后月活腰斩——你赚的是毁灭游戏未来的钱。",
        lessonTitle: "创业课 · 饮鸩止渴的收入",
        lesson: "动视暴雪《暗黑3》现金拍卖行毁掉游戏经济被迫关闭；征途式「养工作室」模式透支口碑。收入分两种：让游戏更健康的钱，和让游戏更快死的钱。后者在报表上一样漂亮。",
      },
    ],
  },
  // ── 行业专属事件：金融科技 ────────────────────────────────────────────────
  {
    id: "payment-cut",
    title: "支付通道被掐断",
    scene:
      "合作银行发来公函：因「合作策略调整」，你们的支付通道 30 天后关闭。没有备援通道，用户的充值和提现将在一个月后全部停摆。金融业务的命门，握在别人手里。",
    minStage: 3, weight: 5, once: true,
    condition: (s) => s.industry.id === "fintech",
    choices: [
      {
        id: "multi-channel", text: "两周内接入三条备援通道，连夜迁移",
        effects: { months: 1, cash: -20, product: -5, flag: "multi-rail" },
        resultText: "切流那晚全组盯着监控大屏。通道关闭时，99% 的交易已经平滑迁移。你学到了金融业最朴素的一课：通道必须永远有备胎。",
        lessonTitle: "创业课 · 金融基础设施冗余",
        lesson: "2018 年「断直连」重构了整个第三方支付格局，没有备援通道的公司当场死亡。Stripe 从第一天就多收单机构并行。金融的系统设计哲学：任何单点故障都是时间问题，不是概率问题。",
      },
      {
        id: "beg-bank", text: "托关系挽留，争取延期",
        effects: { months: 1, cash: -10, reputation: -5 },
        resultText: "延期批了 60 天。但你清楚，把公司命脉寄托在别人的「慷慨」上，是创业者最卑微的姿势。",
        lessonTitle: "创业课 · 谈判地位来自替代方案",
        lesson: "BATNA（最佳替代方案）决定谈判力。没有备援通道时，你不是在谈判，是在求饶。金融创业者的人脉应该花在「建第二条路」上，而不是「保住第一条路」上。",
      },
    ],
  },
  {
    id: "aml-freeze",
    title: "反洗钱风控误杀：资金被冻结",
    scene:
      "一笔大额交易触发了风控模型，监管要求冻结相关资金 90 天配合调查。这笔钱占你流动性的 40%。法务说配合调查是义务；CFO 说 90 天后公司可能已经发不出工资。",
    minStage: 4, weight: 4, once: true,
    condition: (s) => s.industry.id === "fintech",
    choices: [
      {
        id: "comply", text: "全力配合调查，同时启动过桥融资补流动性",
        effects: { debt: 30, months: 1, reputation: 8 },
        resultText: "调查第 87 天，资金解冻，公司还白捡一次「合规经得起查」的背书。桥接贷款贵，但信用无价。",
        lessonTitle: "创业课 · 监管配合是长期资产",
        lesson: "蚂蚁金服整改后重启上市进程、Coinbase 主动拥抱监管换来合规溢价。金融业里，监管关系不是成本中心，是护城河的一部分。短痛换长通行证。",
      },
      {
        id: "circumvent", text: "用关联账户绕开冻结，先保运营",
        effects: { reputation: -20, flag: "reg-blackmark" },
        resultText: "资金流绕开的第三周，监管问询函到了。性质从「配合调查」变成了「妨碍调查」。你用最贵的方式省了 60 天。",
        lessonTitle: "创业课 · 金融业的红线意识",
        lesson: "Wirecard 伪造账目的结局是 190 亿欧元市值归零、高管被捕；瑞幸财务造假的代价是退市+集体诉讼。金融业没有任何一个决定值得用「妨碍监管」来换——那是公司信用的一次性自杀按钮。",
      },
    ],
  },
  // ── 行业专属事件：跨境电商 ────────────────────────────────────────────────
  {
    id: "logistics-explode",
    title: "爆单之后，物流瘫痪",
    scene:
      "一款产品在短视频平台意外爆单：日销从 200 件冲到 8000 件。庆祝持续了不到 48 小时——合作物流爆仓，包裹积压 12 天，差评和退款申请如雪片般飞来，店铺评分从 4.8 跌到 4.2。",
    minStage: 4, weight: 5, once: true,
    condition: (s) => s.industry.id === "ecom",
    choices: [
      {
        id: "air-freight", text: "紧急切换空运+临时仓，高价保时效",
        effects: { cash: -25, usersPct: 5, reputation: 8, mrrPct: -5 },
        resultText: "利润被运费吃掉大半，但评分稳住了。事后你建立了「爆单预案」：三级物流冗余+自动切换阈值。",
        lessonTitle: "创业课 · 增长的供应链带宽",
        lesson: "SHEIN 的小单快反、亚马逊的 FBA 前置仓，本质都是「用供应链冗余买增长确定性」。Zara 靠物流速度打败时装周期。爆单死掉的公司比没单死掉的多——机会只奖励接得住的供应链。",
      },
      {
        id: "let-it-burn", text: "让客户等，慢慢消化积压",
        effects: { cash: 10, reputation: -15, usersPct: -25, morale: -8 },
        resultText: "积压清了，店铺也半废了。平台算法把低评分店铺踢出了流量池——爆单带来的 50 万曝光，变成了 5 万条差评的纪念碑。",
        lessonTitle: "创业课 · 平台经济评分即生死",
        lesson: "亚马逊 Buy Box 算法里，物流时效权重极高；淘宝动态评分低于 4.6 流量腰斩。跨境品牌的真正资产不是产品，是店铺评分和履约记录——它们是用钱买不来的复利。",
      },
    ],
  },
  {
    id: "deadstock",
    title: "海外仓里的「沉睡库存」",
    scene:
      "季末盘点让你倒吸一口凉气：海外仓压了价值 60 万的过季库存，仓储费还在每天计费。运营给出三个选项：清仓甩卖（回血但伤品牌）、继续养着（等旺季）、销毁弃置（止损但血本无归）。",
    minStage: 4, weight: 4, once: true,
    condition: (s) => s.industry.id === "ecom",
    choices: [
      {
        id: "clearance", text: "限时清仓+捆绑销售，快速回笼现金",
        effects: { cash: 25, reputation: -5, mrrPct: -10 },
        resultText: "三周清掉七成库存，现金回血。品牌粉丝群里有人吐槽「买早了」，你发了补偿券——用 5% 的代价保住了 95% 的信任。",
        lessonTitle: "创业课 · 库存是吞现金的怪兽",
        lesson: "凡客陈年毁于库存、海澜之家靠「轻库存快反」翻身。零售的终极命题是库存周转：现金压在仓库里就是亏损。索罗斯说过「我富有只是因为我知道何时认错」——清库存就是商业上的止损。",
      },
      {
        id: "hold-season", text: "扛到旺季，原价慢慢卖",
        effects: { cash: -15, months: 2, mrrPct: 15 },
        resultText: "旺季卖掉了一半，另一半跌价 30% 才出清。算上四个月的仓储费，这笔「等待」的净收益是负数。",
        lessonTitle: "创业课 · 现金的时间价值",
        lesson: "库存的机会成本 = 压货金额 × 资金成本 × 时间 + 仓储 + 跌价风险。服装设计行业的规律：过季库存每年贬值 30-50%。「等旺季」的算盘常常是安慰剂。",
      },
    ],
  },
  // ── 行业专属事件：传统行业 ────────────────────────────────────────────────
  {
    id: "site-selection",
    title: "选址的蝴蝶效应",
    scene:
      "扩张第三家店，两个候选铺面摆在桌上：A 铺位于新商圈核心，租金高 40% 但人流旺；B 铺是成熟社区底商，租金便宜但增长见顶。你的店长各执一词，而租金一签就是五年。",
    minStage: 2, weight: 4, once: true,
    condition: (s) => s.industry.id === "traditional",
    choices: [
      {
        id: "data-driven", text: "蹲点两周数人流、算翻台率、测竞品动线，用数据定",
        effects: { months: 1, cash: -5, product: 5, mrrPct: 10 },
        resultText: "数据说 A 铺周末人流是 B 铺的三倍，但工作日平平。你选了 A 并调整了营业时段侧重——第三个月就实现盈利。",
        lessonTitle: "创业课 · 实体生意的尽调",
        lesson: "海底捞选址要看 51 项指标，7-11 用 GIS 系统评估每个铺面。实体行业的「产品迭代」就是选址模型：蹲点数人流、看车流方向、算竞品距离，朴素但致命。房租差 40% 是小事，选错位置的五年租约是大事。",
      },
      {
        id: "gut-feel", text: "相信直觉：B 铺看着踏实，租金压力小",
        effects: { cash: 10, months: 2, mrrPct: -15, morale: -5 },
        resultText: "B 铺如期「稳定」——稳定地不增长。两年后续约时你才发现，新商圈的 A 位置已经被竞品拿下，每天看着它排队。",
        lessonTitle: "创业课 · 位置的不对称性",
        lesson: "实体生意里，位置是少数不可复制的护城河。星巴克把最好的街角全部提前锁死。省下的 40% 租金，买断了你错失增长的机会成本——实体的失败常常不是经营问题，是坐标问题。",
      },
    ],
  },
  {
    id: "raw-material",
    title: "原材料涨价 40%",
    scene:
      "上游供应商通知：核心原材料国际市场涨价 40%，且随行就市。你的毛利本来就不厚。采购建议签一年锁价长协（量大价稳但占资金）， CFO 建议随用随买（灵活但赌行情）。",
    minStage: 3, weight: 4, once: true,
    condition: (s) => s.industry.id === "traditional" || s.industry.id === "hardware",
    choices: [
      {
        id: "lock-price", text: "签锁价长协+战略备货六个月",
        effects: { cash: -30, mrrPct: 8, flag: "price-locked" },
        resultText: "半年后同行都在涨价时，你的成本纹丝不动，顺势抢了一波市场份额。占用资金的机会成本，换来了定价战的弹药。",
        lessonTitle: "创业课 · 供应链套保思维",
        lesson: "航空公司用燃油期货锁成本、麦当劳长期锁牛肉采购价。实业的利润经常被上游波动吞噬，锁价本质是「用确定性换利润」。巴菲特的伯克希尔多赚的一笔，就来自金融危机前锁的原材料长协。",
      },
      {
        id: "spot-buy", text: "随行就市，现金为王",
        effects: { cash: 5, mrrPct: -12 },
        resultText: "材料价一路涨到 60%。你被迫跟着提价，客户流失了一成。省下的采购资金，不够填毛利率的窟窿。",
        lessonTitle: "创业课 · 现货采购是裸奔",
        lesson: "2008 年金融危机、2021 年大宗商品暴涨，无数中小企业死于「随用随买」的裸奔策略。现金为王不假，但「该花确定性钱的时候省现金」是另一场赌博——赌行情永远友好。",
      },
    ],
  },
  // ── 行业专属事件：VC/PE 基金 ─────────────────────────────────────────────
  {
    id: "vc-deal-flow",
    title: "项目找上门：投不投？",
    scene:
      "一位创始人带着 BP 堵在你的办公室：企业服务的某个细分赛道，团队来自大厂，天使轮估值 1500 万，愿意让你领投。你的投委会群里，大家意见分裂。",
    minStage: 3, weight: 6,
    condition: (s) => s.industry.id === "vcpe",
    choices: [
      {
        id: "lead", text: "领投 40 万：押注团队，签 TS",
        effects: { cash: -40, portfolioAdd: "领投 · 企业服务天使轮", reputation: 3 },
        resultText: "你打款 40 万，成为第一大股东。对方 CEO 在签约饭上说：「我们找的不是钱，是懂行的合伙人。」——这句话让你一整晚没睡着。",
        lessonTitle: "创业课 · 领投的责权",
        lesson: "领投意味着定价权和董事会席位，也意味着最大的敞口。红杉早期投 Google 时先投小额试探、追加时再领投——好项目值得加码，但第一笔钱永远当学费预算。",
      },
      {
        id: "follow", text: "跟投 15 万，小仓位观察",
        effects: { cash: -15, portfolioAdd: "跟投 · 观察仓" },
        resultText: "你跟了 15 万，换来一个董事观察员席位。投后你每月看一次报表，慢慢学会了用投资人的眼睛看生意。",
        lessonTitle: "创业课 · 跟投的艺术",
        lesson: "跟投（Follow-on）是控制学费成本的标准姿势：先用小仓位建立认知，验证后再加注。巴菲特说「第一次买叫试探仓位」。切忌第一单就 all-in——VC 的死亡率注定了分散是铁律。",
      },
      {
        id: "pass", text: "婉拒：赛道还没看懂，不赌不懂的局",
        effects: { morale: 2 },
        resultText: "你写了三页婉拒邮件，认真说明了你的顾虑。半年后对方上了头部机构的 portfolio 名单——你错过了，但记录里的「为什么没投」成了你最重要的复盘材料。",
        lessonTitle: "创业课 · 错过的艺术",
        lesson: "顶级 VC 也会错过 Google（红杉当年就拒绝了）、错过 Airbnb。巴菲特的「能力圈」原则在投资端同样成立：不投不是失误，乱投才是。把你的「pass 理由」写下来，它会变成你的投资框架。",
      },
    ],
  },
  {
    id: "vc-portfolio-win",
    title: "被投企业传来捷报",
    scene:
      "你投的某家公司拿下了行业标杆客户，下一轮融资估值翻了三倍，老股转让的报价摆在你面前：现在套现离场，还是继续持有赌一个 IPO？",
    minStage: 4, weight: 5,
    condition: (s) => s.industry.id === "vcpe" && (s.portfolio?.length ?? 0) >= 1,
    choices: [
      {
        id: "cash-out", text: "转让老股套现 80 万落袋为安",
        effects: { cash: 80, reputation: 5 },
        resultText: "交割款到账那天你给 LP 发了分红报告。一位 LP 回电：「会退钱的基金管理人，我才敢把下一期也给你。」",
        lessonTitle: "创业课 · DPI 才是硬道理",
        lesson: "基金行业最大的谎言是「账面回报」（TVPI），最真实的指标是 DPI（实际分回的现金）。许多明星基金portfolio 漂亮却十几年退不出钱——能给 LP 分现金的回报，才是金融业的信誉货币。",
      },
      {
        id: "hold", text: "继续持有：好资产不该在半山腰卖",
        effects: { valuationPct: 25 },
        resultText: "你拒绝了报价。公司次年确实估值再翻两倍——虽然这笔钱依然只是纸面富贵，但你的基金净值报告从此有了底气。",
        lessonTitle: "创业课 · 纸面富贵与真实回报",
        lesson: "二级市场价格不等于退出价格。Peter Thiel 投资 Facebook 后等了七年才 IPO 退出；孙正义持有阿里巴巴 14 年。持有需要两个前提：标的质量经得起周期 + LP 的耐心经得起你。",
      },
    ],
  },
  {
    id: "vc-lp-pressure",
    title: "LP 的质疑电话",
    scene:
      "出资人（LP）打来电话，语气不善：「两年投了八个项目，一个退出的都没有。管理费照收，DPI 是零。下一期基金，我要重新考虑。」你的 IR（投资人关系）能力迎来大考。",
    minStage: 4, weight: 5, once: true,
    condition: (s) => s.industry.id === "vcpe",
    choices: [
      {
        id: "transparent", text: "约 LP 面谈：公开全部组合状况、退出计划和时间表",
        effects: { reputation: 8, morale: 5 },
        resultText: "你把最难看的数字也摊在桌上。LP 沉默了一会儿说：「冲这份坦诚，下一期我给你留份额。」——信任是基金唯一的产品。",
        lessonTitle: "创业课 · LP 关系管理",
        lesson: "基金的商业模式是「管别人的钱」。危机时刻的透明度决定了 LP 的去留。桥水靠「极端透明」做到全球最大对冲基金；隐瞒坏消息的基金经理，会在下一次募资时被整个行业记住。",
      },
      {
        id: "promise", text: "画大饼：明年一定有两个项目 IPO",
        effects: { reputation: -10, flag: "lp-overpromise" },
        resultText: "LP 没再说什么。但「过度承诺」四个字被记进了对方内部的评估表。退出窗口如果不开，你的每一句话都会变成呈堂证供。",
        lessonTitle: "创业课 · 承诺的复利",
        lesson: "融资（无论募股还是募基金）卖的首先是信任。软银愿景基金 II 期募不动，LP 们公开质疑的正是第一期的「叙事与现实的差距」。对 LP 永远只承诺你能控制的：透明度、流程、努力，而不是结果。",
      },
    ],
  },
  // ── 合伙人专属事件 ────────────────────────────────────────────────────────
  {
    id: "cf-tech-refactor",
    title: "合伙人的深夜重构",
    scene:
      "凌晨两点你发现工作室的灯还亮着——技术合伙人阿哲正在给核心系统做第三次重构。「现在欠债，以后付利息，」他头也不回，「相信我，这波值。」",
    minStage: 2, weight: 0, once: true,
    condition: (s) => s.cofounder?.trait === "tech" && !s.tags.includes("ev-cf-tech-refactor"),
    choices: [
      {
        id: "trust", text: "给他一周：技术的事听技术的",
        effects: { product: 12, morale: 8 },
        resultText: "一周后系统像换了一台发动机。发版速度翻倍，线上故障清零。你在日记里写：找对合伙人，等于公司多长了一个器官。",
        lessonTitle: "创业课 · 技术合伙人的价值",
        lesson: "CTO 的第一职责不是写代码，是技术决策的质量。Stripe 的 Collison 兄弟、Google 的 Page & Brin——技术合伙人选对了，产品迭代速度是竞争对手的结构性优势。选错或不给权，是早期公司最贵的浪费。",
      },
    ],
  },
  {
    id: "cf-sales-whale",
    title: "Grace 的大单",
    scene:
      "销售合伙人 Grace 把一份合同拍在你桌上：行业头部客户，年框金额是现有 MRR 的四倍。「对方 CFO 是我十年前睡上下铺的兄弟，」她咧嘴一笑，「但价格我按标准价签的，一毛钱没让。」",
    minStage: 3, weight: 0, once: true,
    condition: (s) => s.cofounder?.trait === "sales" && !s.tags.includes("ev-cf-sales-whale"),
    choices: [
      {
        id: "celebrate", text: "全员庆功，把案例打磨成销售武器",
        effects: { mrrPct: 25, morale: 10, reputation: 5 },
        resultText: "案例写进官网首页后，同行业的询价电话排到了下个月。你意识到：好的销售合伙人不是卖货的，是打开整个市场的。",
        lessonTitle: "创业课 · 标杆客户的杠杆",
        lesson: "企业服务的获客成本里，『信任』最贵。一个标杆客户 = 背书 + 案例 + 转介绍。Salesforce 早期死磕时代华纳、AWS 早期拿下 Netflix——标杆客户的价值远超合同金额本身。",
      },
    ],
  },
  {
    id: "cf-mentor-dinner",
    title: "老徐的饭局",
    scene:
      "贵人型合伙人老徐一个电话，把三位在行业内说得上话的前辈约到了同一张饭桌上。酒过三巡，其中一位忽然说：「你这个项目，下次路演我来站台。」",
    minStage: 2, weight: 0, once: true,
    condition: (s) => s.cofounder?.trait === "mentor" && !s.tags.includes("ev-cf-mentor-dinner"),
    choices: [
      {
        id: "grateful", text: "敬酒，记在心里",
        effects: { reputation: 8, flag: "backup-investors", morale: 5 },
        resultText: "这顿饭之后，你的通讯录里多了三个愿意接你电话的人。你想起老徐常说的那句话：「创业到最后，拼的都是人品和口碑。」",
        lessonTitle: "创业课 · 贵人网络的复利",
        lesson: "雷军创立小米前是「中关村劳模」，人脉网用了二十年才织成；张小龙做微信前，是雷军周鸿祎都追着投资的人。贵人不是求来的，是十几年靠谱做事攒来的。合伙人带进来的网络，是公司最便宜的融资来源。",
      },
    ],
  },
  // ── 剧本模式：千团大战（2010） ─────────────────────────────────────────────
  {
    id: "sc-groupon-boom",
    title: "风口来了：千团大战开战",
    scene:
      "2010 年的北京，团购是唯一的叙事。你的对手这周又融了 5000 万美元，广告已经铺到了地铁站的每一寸墙面。地推团队在前线等你表态：跟不跟进这场「百团大战」？",
    minStage: 2, weight: 0, once: true,
    choices: [
      {
        id: "blitz", text: "全力跟进：烧钱换单量，先把规模做起来",
        effects: { cash: -30, usersPct: 80, mrrPct: -10, morale: 5, flag: "groupon-blitz" },
        resultText: "单量冲进了城市前三，账上的钱像水一样流走。投资人看着曲线笑了，财务看着余额哭了。",
        lessonTitle: "创业课 · 千团大战的教训",
        lesson: "2010-2012 年全国诞生了超过 5000 家团购网站。拉手网、窝窝团烧钱冲 IPO，美团却在同期打磨『商家服务体系』。历史证明：风口期烧出来的规模是租来的，租约到期就要还。",
      },
      {
        id: "steady", text: "克制扩张：守住两个城市的密度，把履约做扎实",
        effects: { cash: 10, product: 15, mrrPct: 15, morale: -3 },
        resultText: "规模排名不起眼，但复购率是对手的两倍。一线地推报告说：商家点名要跟你合作，『就冲你们结款快、不跑路』。",
        lessonTitle: "创业课 · 密度大于广度",
        lesson: "美团王兴在千团大战后期总结：『团购是本地生意，本地生意讲密度。』先把一个城市打到 60% 份额再开下一个。对比 Groupon 全球撒网后的崩盘——密度才是本地生活的护城河。",
      },
    ],
  },
  {
    id: "sc-groupon-capital",
    title: "资本的棋局",
    scene:
      "两家头部机构同时约你喝茶。话里话外是一个意思：团购赛道终局已定，你最好的出路是接受战略合并——成为『那家赢家』的一部分。你的联合创始人拍案而起：「我们凭什么给别人做嫁衣？」",
    minStage: 4, weight: 0, once: true,
    choices: [
      {
        id: "listen", text: "认真听条件：合并也是一门生意，先上桌谈判",
        effects: { reputation: 5, flag: "merger-talk" },
        resultText: "你按住联创的肩膀：『愤怒不估值，谈判才估值。』你带着财务顾问坐上了谈判桌——至少要先知道自己在别人棋盘上的价格。",
        lessonTitle: "创业课 · 资本意志与创始人意志",
        lesson: "2015 年美团与大众点评合并、滴滴快的合并、58 赶集合并——中国互联网的大合并时代，资本是最强推手。红杉沈南鹏们推动合并的逻辑：结束消耗战、合并份额、共享未来。创始人可以拒绝，但必须先听懂对方的牌。",
      },
      {
        id: "refuse-now", text: "当场拒绝：我们的终局是独立上市",
        effects: { morale: 8, reputation: -3 },
        resultText: "机构代表不置可否地笑了笑：『年轻人，我们尊重理想。』你走出茶馆时后背发凉——你知道这个『尊重』里，藏着他们已布局的对手。",
        lessonTitle: "创业课 · 拒绝资本的代价",
        lesson: "拒绝合并邀约的创业公司，后续往往拿不到同梯队资本的加注——这不是报复，是立场。京东当年拒绝各种『站队』、坚持自建物流和独立 IPO，靠的前提是手里还有能证明自己的牌。拒绝之前，先数清楚弹药。",
      },
    ],
  },
  {
    id: "sc-groupon-endgame",
    title: "千团大战的终局",
    scene:
      "2012 年，冬天到了。资本市场的钱一夜之间消失，5000 家团购网站正在批量倒闭，媒体的头条每天都在更新阵亡名单。你账上的现金只够三个月——而对方的合并邀约，还摆在桌上。",
    minStage: 4, weight: 0, once: true,
    choices: [
      {
        id: "merge", text: "接受战略合并，成为幸存者版图的一部分",
        effects: { endingId: "groupon-end" },
        resultText: "合并发布会那天，你看着两家团队的工牌换成同一家 logo。三年前跟你抢地盘的老对手，现在跟你挤在同一张大会议桌旁。千团大战结束了——你活了下来。",
        lessonTitle: "创业课 · 合并的结局",
        lesson: "美团点评合并后，点评系创始人张涛在全员会上哽咽离场。商业的终局很少是童话：合并保住了业务、团队和大部分人的饭碗，但创始人交出的是控制权。活下来的公司与活下来的理想，常常只能选一个。",
      },
      {
        id: "fight-alone", text: "拒绝合并，带着剩下的兄弟死磕到底",
        effects: { endingId: "groupon-dead" },
        resultText: "你把最后的钱发给了留下来的地推团队。倒下那天，办公室的白板上还写着明年的城市扩张计划。你在朋友圈发了一句话：『愿赌服输，但我们来过。』",
        lessonTitle: "创业课 · 炮灰的价值",
        lesson: "千团大战里死掉的几千家团购公司并非都是笑话——它们用尸骨铺出了本地生活赛道的用户习惯、地推体系和商家认知，美团的胜利建立在全行业试错的总和上。创业史上，「炮灰」与「先驱」经常是同一批人。",
      },
    ],
  },
  // ── 剧本模式：口罩风云（2020） ─────────────────────────────────────────────
  {
    id: "sc-mask-rush",
    title: "疫情突袭：订单爆炸",
    scene:
      "2020 年 2 月，世界停摆。你的工厂突然成了「战略物资单位」：口罩订单排到六个月后，电话被打爆，有客户带着现金在厂门口排队。工人三倍工资招不回来，熔喷布一天一个价。",
    minStage: 1, weight: 0, once: true,
    choices: [
      {
        id: "honest", text: "全力接单但守住质量和价格：签合同锁量锁价，不坐地起价",
        effects: { cash: 60, mrrPct: 40, reputation: 15, usersPct: 50, flag: "mask-boom" },
        resultText: "同行笑话你不会赚钱。但三个月后，你的客户没有一个毁约转单，而「坐地起价」的厂家名单正在采购圈里流传。",
        lessonTitle: "创业课 · 危机中的定价伦理",
        lesson: "2020 年有口罩厂因哄抬价格被顶格处罚、列入失信名单；比亚迪、五菱转产口罩反而赢得国字号口碑。危机是定价权的巅峰时刻，也是品牌信誉的试金石——暴涨的收入会退潮，留下的名声不会。",
      },
      {
        id: "gouge", text: "坐地起价：现货翻三倍，谁急谁先拿",
        effects: { cash: 120, mrrPct: 60, reputation: -20, flag: "mask-gouger" },
        hidden: true,
        resultText: "一个月内利润顶过去三年。但你半夜看到市场监管局的通报模板时，手心全是汗——名单上的下一个，可能就是正在数钱的人。",
        lessonTitle: "创业课 · 发国难财的算术",
        lesson: "短期暴利的三个隐性成本：1) 监管处罚（疫情期间多地口罩厂被立案）2) 客户关系的永久性透支 3) 团队价值观的污染。快钱是最慢的钱——它会在未来的每个路口收走本金。",
      },
    ],
  },
  {
    id: "sc-mask-speculator",
    title: "熔喷布狂潮：炒不炒？",
    scene:
      "核心原料熔喷布从 2 万/吨炒到 40 万/吨。厂里会计红着眼劝你：「囤一仓库，转手就是十倍利润，比辛辛苦苦做一年口罩强多了！」仓库门外，投机客的货车已经排起了队。",
    minStage: 2, weight: 0, once: true,
    choices: [
      {
        id: "no-speculate", text: "不碰投机：只按生产计划锁一个月用量，安心做制造",
        effects: { cash: -10, mrrPct: 10, morale: 5 },
        resultText: "会计气得半个月没理你。但四个月后熔喷布从 40 万跌回 3 万，囤料的同行在仓库门口哭了——你的工厂还在稳稳出货。",
        lessonTitle: "创业课 · 赚能力范围内的钱",
        lesson: "巴菲特：「能力圈之外的钱，赚得了一时，还回去时要连本带利。」2020 年炒熔喷布、2021 年炒芯片、炒锂矿的实业老板，多数在价格反转时连工厂都搭了进去。制造业的护城河是制造，不是投机。",
      },
      {
        id: "speculate", text: "抵押工厂囤 50 吨熔喷布，赌价格再上台阶",
        effects: { cash: -80, flag: "mask-speculator" },
        hidden: true,
        resultText: "两周内账面浮盈 200 万，全厂开会你发言都有回音。但期货市场的老话开始在你耳边响：『会买的是徒弟，会卖的是师傅。』——你还没想好什么时候卖。",
        lessonTitle: "创业课 · 存货投机的死亡螺旋",
        lesson: "囤货的本质是加了 10 倍杠杆做多大宗商品：涨时舍不得卖（贪婪），跌时卖不掉（流动性枯竭）。中储粮系统、国际粮商做套保的对冲逻辑，正是实业者最该学的——对冲价格波动，而不是赌博价格波动。",
      },
    ],
  },
  {
    id: "sc-mask-expand",
    title: "扩产的豪赌",
    scene:
      "省里的招商干部带着银行行长登门：「政府贴息贷款，三个月建成十条新产线，你就是全省的防疫物资重点企业。」你看着账上暴涨的现金——扩产十倍，赌疫情常态化；还是守住现有产线，把现金流存起来过冬？",
    minStage: 3, weight: 0, once: true,
    choices: [
      {
        id: "moderate", text: "适度扩产：新增两条线，大部分现金留着过冬",
        effects: { cash: -40, mrrPct: 30, product: 10, morale: 5 },
        resultText: "新产线投产时，你特意把旧设备的检修排上了日程。招商干部说你有定力，厂长说你胆小——只有你自己知道，你只是在等周期转身的那个声音。",
        lessonTitle: "创业课 · 逆周期扩产的纪律",
        lesson: "在需求顶点扩产是实业最大的陷阱：2020 年口罩产能一年扩张 20 倍，2021 年行业大洗牌，一半产线沦为废铁。三一重工、台积电的逆周期投资之所以成功，是因为它们赌的是『十年需求』而不是『当下需求』。",
      },
      {
        id: "all-in-expand", text: "all-in：贷款上十条线，把市场份额一口吃下来",
        effects: { cash: -150, debt: 100, mrrPct: 60, morale: 10, flag: "mask-allin" },
        hidden: true,
        resultText: "十条产线轰鸣的场面壮观极了，银行的贴息、政府的奖状、媒体的头条把你包围。但你在深夜复盘时总会多看一眼日历——疫情，总会结束的。",
        lessonTitle: "创业课 · 杠杆与周期",
        lesson: "「潮水退去才知道谁在裸泳」——2008 年、2020 年两次危机后批量死掉的都是「顶点加杠杆」的公司。实业扩张的铁律：用长债投长周期资产，用自有资金留 18 个月过冬钱。把周期当常态，是所有破产故事的第一页。",
      },
    ],
  },
  {
    id: "sc-mask-endgame",
    title: "风停了",
    scene:
      "疫苗普及，疫情退潮。口罩价格从 3 块跌到 2 毛，订单像退潮一样消失。政府储备订单开始招标，价格是市场价的 90%——亏着做，还是清盘退场？厂房门口，二手设备回收商的报价单已经递了三次。",
    minStage: 3, weight: 0, once: true,
    choices: [
      {
        id: "exit-peak", text: "见好就收：高位转让产线，把现金落袋",
        effects: { endingId: "mask-end" },
        resultText: "设备转让合同签完那天，你在空了一半的厂房里站了很久。两年，从身家见底到套现离场——你亲身验证了一个朴素的道理：在风口上，收手比伸手更需要勇气。",
        lessonTitle: "创业课 · 风口的退出纪律",
        lesson: "2020 年入场的口罩老板，赚到钱的只有两类：转产前就有工厂的（成本优势）、在疫情中期果断退出的（周期意识）。把周期行业的顶部当「新常态」，是制造业亏损的第一大原因。索罗斯的名言：『重要的不是对错，而是对的时候赚多少、错的时候亏多少。』",
      },
      {
        id: "hold-out", text: "咬牙硬扛：赌储备订单和政府关系能续命",
        effects: { endingId: "mask-crash" },
        resultText: "储备订单的毛利只有 3%，还不够付贷款利息。第九个月，银行收走了厂房。回收商拖走设备时，你想起订单爆炸那晚自己说的话：『这生意能再做十年。』——周期的耳光总是来得又快又响。",
        lessonTitle: "创业课 · 不要用杠杆赌周期见底",
        lesson: "2021-2022 年口罩行业大清算：据行业统计，超过一半 2020 年新入场企业在两年内退出，不少负债离场。『需求悬崖』是周期行业的专有名词——当你习惯了 3 块的订单，0.2 元的现实就是深渊。承认周期，是实业家最重要的诚实。",
      },
    ],
  },
  // ── 剧本模式：泡沫之巅（1999） ─────────────────────────────────────────────
  {
    id: "sc-dotcom-goldrush",
    title: "车库里的点击率神话",
    minStage: 1, weight: 0, once: true,
    scene:
      "1999 年的硅谷，空气里都是钱的味道。你的车库创业项目刚上线三周，一个只看了十分钟的路演嘉宾就递来 term sheet：『我不在乎盈利，我在乎 eyeballs（眼球）。』办公室墙上，实习生用红笔写下当月口号：『Get Big Fast』。账上的种子钱，够烧八个月。",
    choices: [
      {
        id: "stay-lean", text: "保持精益：只买必需品，盯住真实用户留存",
        effects: { cash: -5, usersPct: 15, product: 8, morale: 5 },
        resultText: "你在全员会上立了规矩：每一块钱都要回答『换来什么用户行为』。工程师在白板上画留存曲线时，投资人皱着眉说『你们增长太慢了』——你笑笑没解释。",
        lessonTitle: "创业课 · 泡沫中最反直觉的资产",
        lesson: "1999 年 Google 拒绝了不计亏损的扩张逻辑，把每一分融资都押在搜索质量上；同期 Webvan 烧了 12 亿美金在仓库上，三年后破产。泡沫里『慢』不是缺点，是唯一能让你活到退潮后的速度。",
      },
      {
        id: "spend-big", text: "All-in 速度：豪华办公室+ Super Bowl 广告+大规模招聘",
        effects: { cash: -35, usersPct: 50, awareness: 25, morale: 10, flag: "dotcom-burner" },
        resultText: "超级碗广告播出那晚，流量暴涨 40 倍，媒体把你列为『年度最炙手可热的 25 家初创』。你站在新办公室的手动扶梯上向下看，三十个新工位还空着一半——HR 说下个月就能填满。",
        lessonTitle: "创业课 · 买量的甜蜜陷阱",
        lesson: "Pets.com 用超级碗广告买来了全美知名度，也买来了全行业最快的死亡速度——广告换来的用户留存率不到 10%。泡沫时代买量的本质是：用资本伪装成 PMF（产品市场匹配）。广告停止的那一刻，真相开始计费。",
      },
    ],
  },
  {
    id: "sc-dotcom-vc-frenzy",
    title: "抢钱大战：条款会自己变好",
    minStage: 2, weight: 0, once: true,
    scene:
      "三家 VC 同时在抢你：A 家估值给 3000 万，B 家 4000 万但要求对赌，C 家是顶级机构但动作慢。你的 CFO 提醒你：『现在签，现金跑道 24 个月；等 C 家，可能窗口就没了。』而行业新闻里，某竞对昨天刚以零营收拿到 5000 万估值。",
    choices: [
      {
        id: "take-highest", text: "价高者得：签 B 家 4000 万（接受对赌回购条款）",
        effects: { cash: 40, valuationPct: 20, flag: "dotcom-toxic-terms", morale: 5 },
        hidden: true,
        resultText: "香槟开了，头条上了。只有律师在签约后提醒你：『注意这行小字——若 18 个月内未上市，创始团队需按本金加 15% 年息回购。』你挥挥手说：『18 个月？我们 12 个月就上。』",
        lessonTitle: "创业课 · 泡沫期的毒条款",
        lesson: "1999-2000 年大量互联网融资附带个人回购对赌，泡沫破裂后无数创始人倾家荡产。红杉、KPCB 的条款书（term sheet）之所以值钱，恰恰因为它们从不加对赌——顶级资本用条款质量筛选项目。估值高 30%，条款烂一倍，等于便宜 100%。",
      },
      {
        id: "wait-quality", text: "等 C 家顶级机构：慢四周，条款干净",
        effects: { cash: 30, valuationPct: 10, reputation: 8, months: 1 },
        resultText: "C 家的尽调做了整整一个月，问题尖锐得像手术刀。签约那天合伙人送你一句话：『我们投的不是你的增速，是你泡沫破了之后还能站着的样子。』三个月后你才明白这句话的含金量。",
        lessonTitle: "创业课 · 资本质量的排序",
        lesson: "顶级 VC 的价值排序：条款质量 > 投后资源 > 品牌背书 > 估值数字。2000 年泡沫破裂时，有红杉/红杉资本在董事会的公司死亡率显著更低——因为它们的条款允许公司『慢下来活着』，而毒条款公司被逼着『快下去死掉』。",
      },
    ],
  },
  {
    id: "sc-dotcom-ipo-window",
    title: "纳斯达克 5000 点：冲不冲 IPO？",
    minStage: 3, weight: 0, once: true,
    scene:
      "纳斯达克站上 5000 点。你的投行说：现在递表，六个月就能挂牌，发行估值 5 亿美金——虽然你的年营收只有 300 万。而在投行 PPT 的最后一页，小字写着：『历史平均：IPO 后锁定期 180 天。』你的竞对昨天挂牌首日暴涨 300%。",
    choices: [
      {
        id: "file-now", text: "立刻递表：接住这场资本的盛宴",
        effects: { cash: 60, valuationPct: 40, flag: "dotcom-ipo-filer", morale: 10 },
        resultText: "路演行程排得像摇滚巡演：一天三城，连轴两周。机构投资者的问题出奇地一致：『你们的 burn rate 好酷，怎么做到的？』没人问盈利。你隐隐觉得哪里不对，但打开账户看到那串数字时，这个念头就散了。",
        lessonTitle: "创业课 · 泡沫 IPO 的本质",
        lesson: "1999 年美国 457 家公司 IPO，大部分无盈利。TheGlobe.com 上市首日涨 606% 成为时代符号。泡沫期 IPO 是『把未来的钱提前透支』——它不是毕业典礼，是一笔高息贷款，还款日期由市场情绪决定。",
      },
      {
        id: "stay-private", text: "忍住不递表：练好基本功，等真实收入",
        effects: { cash: -10, product: 12, mrrPct: 15, valuationPct: -10 },
        resultText: "你拒绝了投行的倒计时，把工程团队从 12 人扩到 20 人，全部扑在付费墙和留存上。销售VP 不解：『现在上市就是捡钱啊！』你答：『捡来的钱，烫手。』",
        lessonTitle: "创业课 · 拒绝窗口的纪律",
        lesson: "Google 1999 年本可轻松 IPO，硬是等到 2004 年盈利模型清晰后上市，首日定价 85 美元涨到 700+。eBay、雅虎同期选择抢窗口，活得好但也背上了迎合季报的增长枷锁。窗口是礼物也是债务——区别在于你拿它换时间，还是换幻觉。",
      },
    ],
  },
  {
    id: "sc-dotcom-crash",
    title: "黑色三月：纳斯达克崩了",
    minStage: 3, weight: 0, once: true,
    scene:
      "2000 年 3 月 10 日，纳斯达克见 5132 点后掉头向下。十周内跌去 40%。你的 voicemail 里躺着三条消息：投行说『发行暂停，时间待定』，B 轮领投方说『估值需要重谈』，最大的企业客户说『预算冻结，续约推迟』。办公室外，旧金山写字楼的中介开始在路边发传单：『转租！送家具！』",
    choices: [
      {
        id: "deep-cut", text: "休克疗法：砍到骨头，现金为王",
        effects: { cash: 25, team: -6, morale: -18, product: -5, flag: "dotcom-survivor" },
        resultText: "裁员公告你亲自念的，念完在消防通道坐了半小时。从 80 人砍到 22 人，从两层办公室退到半层。但当你看着 24 个月的现金跑道时，第一次感到『确定性』这三个字的重量。活下来的 22 个人，眼神不一样了。",
        lessonTitle: "创业课 · 危机休克疗法",
        lesson: "2000 年泡沫破裂后活下来的公司都有一个共同点：在最恐慌的那 90 天里完成了最深刻的一次裁员和组织重塑。PayPal 从『烧钱扩张』切换到『每一笔交易都要赚钱』，才有了后来的 eBay 收购。危机中的深裁一次到位，是幸存者与小强（死不掉但也长不大）的分水岭。",
      },
      {
        id: "hope-rebound", text: "熬一熬：市场总会弹回来的",
        effects: { cash: -30, months: 3, morale: -8, flag: "dotcom-hoper" },
        resultText: "你觉得 40% 的跌幅已经是底了。但纳斯达克最终跌去 78%，用了 15 年才回到 5000 点。你的『再等等』等了三个月，烧钱速度一分没降，而下一轮融资的市场——已经从『抢项目』变成了『救项目』。",
        lessonTitle: "创业课 · 均值回归的幻觉",
        lesson: "凯恩斯：『市场保持非理性的时间，可以长过你保持偿付能力的时间。』泡沫破裂后的抄底心态，害死了比泡沫本身更多的公司——因为抄底者把本可用于求生的现金，押在了不可控的他人情绪上。你的现金跑道，永远不能建立在『市场会好转』这个假设上。",
      },
    ],
  },
  {
    id: "sc-dotcom-last-stand",
    title: "最后一轮融资：尊严还是续命",
    minStage: 3, weight: 0, once: true,
    condition: (s) => s.cash < 40 || s.tags.includes("dotcom-hoper"),
    scene:
      "2001 年秋，融资市场冻结。你账上的现金撑不过五个月。一家秃鹫基金（vulture fund）开出救命价：1000 万现金，但要 60% 股权、董事会多数席位，以及——把你的品牌名从公司名里去掉。『这不是投资，』律师直说，『这是吞并预付。』",
    choices: [
      {
        id: "dilution-death", text: "接受秃鹫条款：活命要紧",
        effects: { cash: 30, valuationPct: -40, morale: -15, flag: "dotcom-vulture" },
        resultText: "钱到账，工资发了，服务器续了。但新董事会的第一次会议就否掉了你的产品路线图，换上他们理解的『变现捷径』。你看着自己创立的公司一天天变成你不认识的样子，像看着别人开你的车，还乱改你的导航。",
        lessonTitle: "创业课 · 秃鹫资本的规则",
        lesson: "秃鹫基金（Vulture Fund）在每次危机后都会批量收购困境公司：2001 年互联网、2008 年房地产、2022 年加密行业。它们的数学很简单——1/10 活下来的公司赚回全部投入。对创始人而言，接受秃鹫条款不是融资，是预支自己的出局。只有当你确定『活着的价值大于控制权的价值』时才该签。",
      },
      {
        id: "walk-away", text: "拒绝：启动体面关停程序",
        effects: { cash: 5, reputation: 10, morale: -5 },
        resultText: "你在董事会上说：『这家公司可以死，但不能跪着活。』关停方案优先保障了员工补偿和供应商货款。散伙饭上，工程师们约好下一个项目再并肩。你背着背包走出办公室时，夕阳把影子拉得很长——你知道自己会回来的。",
        lessonTitle: "创业课 · 拒绝的艺术",
        lesson: "Webvan 破产后，创始人皮特曼拒绝过类似条款，多年后创立新公司被亚马逊收购。体面关停的创始人会得到二次创业的『品格溢价』：投资人记得谁把员工和供应商放在自己前面。拒绝烂条款不是失败，是把信誉存进了下一家公司的开户行。",
      },
    ],
  },
  {
    id: "sc-dotcom-second-wave",
    title: "废墟上的第二春",
    minStage: 4, weight: 0, once: true,
    condition: (s) => !s.tags.includes("dotcom-vulture"),
    scene:
      "2003 年， survivors' party（幸存者聚会）。纳斯达克还在 1500 点徘徊，但一个奇怪的现象出现了：宽带普及了、用户习惯养成了、服务器和带宽便宜到了白菜价——2000 年缺的『基础设施』，泡沫的牺牲者用真金白银替你修好了。你的付费墙收入连续六个季度增长。",
    choices: [
      {
        id: "scale-carefully", text: "谨慎扩张：把收入的一多半再投入产品",
        effects: { cash: -15, product: 15, mrrPct: 25, usersPct: 20 },
        resultText: "你没有重回豪华办公室，但给 22 个人里的每个人都加了薪。更重要的是，你开始在行业大会上做分享：《我们怎么在 5000 点忍住没疯》。台下坐着的年轻创业者眼里，有 1999 年别人看你的光。",
        lessonTitle: "创业课 · 泡沫的遗产红利",
        lesson: "每一次泡沫破裂都会留下廉价而优质的基础设施：2000 年留下光纤和服务器（亚马逊 AWS 的雏形）、2018 年留下廉价 GPU 和 AI 人才。幸存者的巨大优势不是运气，是『在废墟上捡到了别人用几十亿美金修好的路』。",
      },
      {
        id: "acquire-assets", text: "低价扫货：收购泡沫期买不起的团队和技术",
        effects: { cash: -30, team: 4, product: 20, valuationPct: 10 },
        resultText: "你从清算拍卖会上捡回了一支完整的数据库团队和三项专利，价格是 2000 年行情的零头。被收购团队的 leader 跟你握手时说：『谢谢你让我们以这种方式继续活下来。』",
        lessonTitle: "创业课 · 危机资产处置的智慧",
        lesson: "2002-2003 年，无数优质技术资产以 1-3 折流转：人才、专利、客户合同。甲骨文、微软在那轮洗牌里低成本扩充了大量关键技术。危机中的并购要点：买的是『人和资产』，不是『壳和债务』——尽职调查的重点从增长故事切换到隐性负债。",
      },
    ],
  },
  {
    id: "sc-dotcom-endgame",
    title: "泡沫之巅的终局",
    minStage: 4, weight: 0, once: true,
    scene:
      "2004 年，纳斯达克还在缓慢爬坡。摆在你面前的是三条真实历史中创业者走过的路口：雅虎/Microsoft 的战略收购邀约（报价优厚，团队全留）；咬牙冲刺独立 IPO（收入已转正，但市场窗口未知）；或者守住现有的盈利业务，做一家『小而美的幸存者公司』。办公室窗外，旧金山的樱花又开了。",
    choices: [
      {
        id: "sell-big", text: "接受巨头收购：把胜利果实锁进保险箱",
        effects: { endingId: "dotcom-sell" },
        resultText: "收购协议里的数字你数了三遍才敢相信。交割宴上，收购方 CTO 敬酒时说：『2000 年我们差点买了你们的竞对——幸好当时没下手，也幸好你们当时没卖。』你笑了。2000 年如果卖，价格只有现在的 1/20。泡沫教会的最后一课：时间站在活得久的人这边。",
        lessonTitle: "创业课 · 延迟满足的胜利",
        lesson: "Hotmail 1997 年 4 亿美元卖给微软、GeoCities 1999 年 35 亿卖给雅虎——都卖在了好价钱，但买方的市值后来又涨了十倍。而熬到 2004 年后退出的 DoubleClick、Google 系创业者，吃到了完整的第二波红利。卖不卖没有标准答案，但『因为撑不住了而卖』和『选择时机而卖』，是两个宇宙的结局。",
      },
      {
        id: "ipo-2004", text: "冲刺 IPO：收入转正+市场回暖，就是现在",
        condition: (s) => s.mrr >= 30,
        effects: { endingId: "dotcom-ipo" },
        resultText: "路演最后一站，有基金经理问：『你们 2000 年为什么没上市？』你答：『因为我们想带着利润而不是故事来。』定价日，开盘价较发行价上涨 38%。敲钟时你旁边站着 2001 年没走的第 7 号员工——他现在是 CTO，也是千万富翁。",
        lessonTitle: "创业课 · 反周期上市的悖论",
        lesson: "2004 年 Google 上市开创了『盈利型科技公司』的新定价范式。反周期上市的最大优势不是估值，是叙事权：你不用向市场解释为什么亏损，只需要展示为什么赚钱。市场回暖初期的 IPO 窗口，比狂热顶点的窗口宽十倍。",
      },
      {
        id: "stay-independent", text: "不上市不卖：做一家盈利的冠军隐形企业",
        condition: (s) => s.tags.includes("dotcom-survivor") && s.morale >= 40,
        effects: { endingId: "dotcom-survivor" },
        resultText: "你在董事会上宣布两条决定：不接受收购，不启动 IPO。『我们要做那家同行都尊敬、用户离不开、员工不想走的公司。』十年后行业复盘 2000 年那批创业者，对你的标签是：『唯一一个全程清醒的人。』",
        lessonTitle: "创业课 · 第三条路的存在",
        lesson: "37signals（现 37signals）、Atlassian 早期、WordPress 母公司 Automattic 都选择了长期独立盈利路线——它们没上头条，但活成了行业基础设施。创业的终局不止敲钟和被收购：可持续的现金流、自治的文化、和一群不想离开的人，也是 S 级结局。",
      },
    ],
  },
  // ── v1.7.5：债务最后通牒（濒临崩盘时的挣扎窗口，给玩家「看见倒计时」）──
  {
    id: "debt-ultimatum", title: "债权人的最后通牒", weight: 0, once: true,
    minStage: 2,
    condition: (s) => s.debt + (s.loan ?? 0) > 90,
    scene:
      "你的所有债权人罕见地坐在了同一张桌子旁——亲友、供应商、还有那家紧急贷款公司。桌上摊着一张你公司的偿债能力测算表，红笔圈出的数字比你想的更难看。「我们再给一次机会，」代表说，「但方案今天就要定。别逼我们走那一步。」你知道『那一步』是什么：总债务破 120 的那天，一切都不再由你决定。",
    choices: [
      {
        id: "cut-to-bone", text: "断臂求生：砍掉 40% 业务和人员，换取债务冻结",
        effects: { cashMult: 0.6, loanMult: 0.7, team: -3, morale: -15 },
        resultText: "你当场宣布了收缩计划。会议室安静得可怕，但债权人代表在散会时拍了拍你的肩：「至少你敢看这个数字。」债务冻结了，公司缩回了襁褓——但它还活着，在你的手里。",
        lessonTitle: "创业课 · 债务冻结谈判",
        lesson: "濒临崩盘时，主动找债权人谈「冻结+重组」远比被动等催收有优势——因为清盘对债权人也是损失。ofo 的教训恰恰是反面：戴威在债务失控后失联，把可谈的僵局变成了众叛亲离。债权人桌上的椅子，要主动拉过来坐，而不是等他们站起来抓你。",
      },
      {
        id: "beg-investors", text: "拉下脸求老股东：增资救急，代价是估值打折",
        condition: (s) => s.tags.some((t) => t.startsWith("inv-")),
        effects: { loan: -30, valuationPct: -10, morale: -5, reputation: -3 },
        resultText: "你一家一家给投过的机构打电话——有些没接，有些直接拒绝了。最后一家老股东问了一个问题：「如果这次救了你，你第一件事做什么？」你答：「把烧钱速度砍半。」对方沉默十秒：「钱下周到。别让我后悔。」",
        lessonTitle: "创业课 · 向投资人求救的礼仪",
        lesson: "向老股东求救（rescue round）的关键不是情怀，是让对方看到「救命钱改变行为」的证据：先砍成本再开口，条款接受打折，给领投方特殊权利。SBF 倒台前向投资人哭穷却拒绝砍支出——没人会救一个不改的病人。",
      },
      {
        id: "gamble-growth", text: "赌一把：把钱全砸向增长，下个月翻盘",
        effects: { cashMult: 0.4, mrrPct: 25, morale: -20, health: -10, flag: "all-in-gamble" },
        hidden: true,
        resultText: "你把剩余现金全部砸进了增长投放。前两周数据漂亮得像奇迹——第三周，CAC 开始失控，退款率翻倍。债权人看着你的周报，脸上的表情从「再等等」变成了「倒计时」。这次赌局没有翻盘，只是让坠落多了一个抛物线。",
        lessonTitle: "创业课 · 绝境加注的幻觉",
        lesson: "「增长翻盘」是绝境中最诱人的幻觉：Quibi 在现金流恶化时追加 3.5 亿内容投入，9 个月后关掉。绝境加注成立的唯一前提是单位经济已验证（LTV>CAC 2 倍以上）；否则加注只是放大亏损的速度。赌桌上最后一颗筹码，不该押在还没有被数据证明的事情上。",
      },
    ],
  },
  // ── 剧本模式：链上狂潮（2017） ─────────────────────────────────────────────
  {
    id: "sc-ico-goldrush",
    title: "白皮书印钞机",
    minStage: 1, weight: 0, once: true,
    scene:
      "2017 年夏，币圈疯了。你的技术团队还在讨论共识算法，隔壁会议室一家 PPT 公司刚发完币，一小时募了 1.5 亿——他们的白皮书是昨晚用模板改的。投资人递话过来：「别做技术服务了，发币吧，韭菜有的是。」你的联合创始人眼睛发亮。",
    choices: [
      {
        id: "stay-tech", text: "守住底线：只做底层技术服务，不碰代币发行",
        effects: { usersPct: 10, product: 10, reputation: 8, morale: 5 },
        resultText: "你拒绝了快钱。团队在车库白板上写下四个字：「不割韭菜」。三个月后那些一小时募 1.5 亿的项目开始欠薪，而你们的技术服务费准时到账——虽然慢，但睡得着。",
        lessonTitle: "创业课 · 技术理想主义的定价",
        lesson: "2017 年 90% 的 ICO 项目在一年内破发归零，而给行业卖铲子的人活到了现在：嘉楠、比特大陆、ConsenSys 都选择了技术路线。快钱最诱人时，往往是它离法律和崩溃最近时。",
      },
      {
        id: "issue-token", text: "趁热发币：白皮书一周上线，割一轮是一轮",
        effects: { cash: 80, valuationPct: 60, reputation: -15, flag: "ico-issuer" },
        resultText: "代币上线交易所那天，价格翻了 8 倍。你在深夜数着钱包里的数字，刻意不去想白皮书里那些写不出来的技术细节——击鼓传花的音乐正响，谁都以为自己不是最后一棒。",
        lessonTitle: "创业课 · 流动性的幻觉",
        lesson: "ICO 的本质是把「未来现金流」一次性贴现成无监管证券。2017 年 EOS 募 40 亿美元、Tezos 2.32 亿随后陷入诉讼——钱来得越快，离法律和责任越近。监管不是会不会来的问题，是什么时候来的问题。",
      },
    ],
  },
  {
    id: "sc-ico-pump",
    title: "拉盘会议",
    minStage: 3, weight: 0, once: true,
    scene:
      "深夜的私人会所，「市值管理团队」把方案推到你面前：先控盘 60% 流通盘，配合利好拉 10 倍，分三批出货。「老板们都这么玩，」对方吐了个烟圈，「你那个币现在流动性这么差，不拉盘，散户凭什么接盘？」",
    choices: [
      {
        id: "refuse-pump", text: "拒绝坐庄：哪怕币价跌回发行价",
        effects: { valuationPct: -20, reputation: 10, morale: 5 },
        resultText: "你拒绝了。币价果然阴跌，投资人骂你「不懂市场」。但半年后经侦介入币圈坐庄调查时，那份拒绝的记录成了你最重要的护身符。",
        lessonTitle: "创业课 · 坐庄的刑法课",
        lesson: "2020 年 Plustoken 400 亿传销案、2021 年各类「市值管理」团队被刑事立案——拉盘出货在多数司法辖区构成操纵市场/诈骗。牛市里所有「老板都这么玩」的游戏，熊市里都会变成呈堂证供。",
      },
      {
        id: "join-pump", text: "合作：按方案拉盘，出货后五五分",
        condition: (s) => s.tags.includes("ico-issuer"),
        effects: { cash: 60, valuationPct: 40, flag: "ico-pumper" },
        resultText: "币价三个月涨了 10 倍，出货那天团队在酒店开了一瓶 82 年的拉菲。你在阳台上看着夜景想：这一切的前提是，永远不要有人翻开交易所的成交记录。",
        lessonTitle: "创业课 · 链上无秘密",
        lesson: "区块链的残酷与公平：所有交易公开可查。美国 SEC 起诉多家项目方时，链上数据分析公司（Chainalysis、Nansen）提供的证据链完整到分钟。你以为的隐身，只是还没轮到你被数据分析。",
      },
    ],
  },
  {
    id: "sc-ico-ban",
    title: "九四禁令：监管重锤落地",
    minStage: 3, weight: 0, once: true,
    scene:
      "2017 年 9 月 4 日，七部委联合公告：代币发行融资属非法公开融资，所有平台清退业务。你的手机瞬间爆炸——投资人、员工、token 持有者都在问同一个问题：「我们怎么办？」交易所的币价半小时腰斩再腰斩。",
    choices: [
      {
        id: "comply-exit", text: "全面清退：退币退钱，配合监管保团队",
        effects: { cashMult: 0.7, reputation: 12, morale: -5, flag: "ico-cleaned" },
        resultText: "你贴出了清退公告，按成本价回购了流通盘。账上钱少了一大截，但 30 人的团队一个没散。监管约谈结束时，工作人员说了一句让你意外的话：「清退做得最干净的，你们算一家。」",
        lessonTitle: "创业课 · 合规即护城河",
        lesson: "九四之后，清退干净的项目方成了稀缺资产：云币网李林干净清退后做出火币；配合监管的团队保住了人、牌照关系与信用。监管重锤落下时，「听话」不是懦弱，是对团队和用户的负责。",
      },
      {
        id: "flee-offshore", text: "出海转移：注册新加坡基金会，继续发币",
        condition: (s) => s.tags.includes("ico-issuer"),
        effects: { cash: 20, flag: "ico-offshore", reputation: -8 },
        resultText: "你把公司迁到了新加坡，服务器搬到了海外。国内办公室的灯还亮着，只是招牌换了。你在朋友圈写「拥抱监管之外的创新」，心里清楚：物理可以出海，用户和监管的记忆不会。",
        lessonTitle: "创业课 · 出海不是法外之地",
        lesson: "2018 年起，针对「变相 ICO」「出海发币面向国内用户」的认定标准不断收紧：只要面向境内居民募资，境外主体同样被追责。PlusToken、维卡币案的被告多躲在境外，最终都被引渡或劝返。地理套利敌不了属人管辖。",
      },
    ],
  },
  {
    id: "sc-ico-winter",
    title: "破发潮与信仰考验",
    minStage: 3, weight: 0, once: true,
    scene:
      "2018 年，熊市来了。你持仓列表一片惨绿：当年一小时募 1.5 亿的隔壁项目已经解散，币价跌去 95%。媒体标题从「区块链革命」变成「区块链骗局」。团队工资开始需要用你的个人积蓄垫付，而你手中还有一堆不知何时能变现的代币。",
    choices: [
      {
        id: "sell-bag", text: "壮士断腕：在底部清掉所有代币，换现金过冬",
        effects: { cash: 25, valuationPct: -15, morale: 5, flag: "ico-cashed" },
        resultText: "你在最底部卖掉了所有代币——三个月后市场又跌了 50%，你庆幸自己逃顶；两年后市场涨回来 10 倍，你庆幸自己还活着。熊市教会你的第一课：活下来比抄到底重要。",
        lessonTitle: "创业课 · 熊市的生存算术",
        lesson: "2018-2019 年寒冬里，把筹码换成现金的公司活到了 2020 年的牛市；满仓硬扛的项目多数死于工资单。索罗斯：「重要的不是对错，而是对的时候赚多少、错的时候亏多少。」熊市第一目标是活，不是赢。",
      },
      {
        id: "diamond-hands", text: "信仰持有：地板价也不卖，等下一轮周期",
        effects: { cash: -15, morale: -10, flag: "ico-hodler" },
        resultText: "你锁了钱包，把私钥存进保险柜，跟团队说「我们拿五年」。钱包里的数字起起落落落落，你的头发也掉了不少。信仰是奢侈品——它最贵的部分不是买入，是持有的每一天。",
        lessonTitle: "创业课 · 信仰不能发工资",
        lesson: "「HODL」叙事掩盖了一个事实：波动资产不能做运营储备金。MicroStrategy 能拿比特币当储备是因为有主营现金流；创业公司拿代币发工资，等于拿期权当现金。资产的信仰价值 ≠ 流动性价值。",
      },
    ],
  },
  {
    id: "sc-ico-endgame",
    title: "链上狂潮的终局",
    minStage: 4, weight: 0, once: true,
    scene:
      "2019 年，潮水彻底退去。政策明牌：发币已死，产业区块链当立——各地政府开始招标「区块链+政务/供应链」项目。摆在你面前三条真实创业者走过的路：彻底转型做 To B 技术服务，吃产业区块链的饭；把手里的筹码高位变现离场，落袋为安；或者坚信下一轮牛市，继续 all-in 发币路线。",
    choices: [
      {
        id: "pivot-b-chain", text: "转型产业区块链：给政府和企业做链改服务",
        effects: { endingId: "ico-pivot" },
        resultText: "你们把白皮书里吹过的牛一条条实现了：溯源、存证、供应链金融。第一个政府项目验收那天，当年的联创感慨：「原来不用发币，这些技术也能卖钱。」后来国家区块链试点名单公布，你们是服务商之一。",
        lessonTitle: "创业课 · 技术穿越周期",
        lesson: "蚂蚁链、腾讯至信链、长安链——产业区块链的赢家全是当年守住技术底线的团队。周期会杀死叙事，杀不死真实解决问题的能力。每一轮狂潮，都是一次「谁在裸泳」的点名。",
      },
      {
        id: "cash-out-now", text: "高位套现离场：把筹码和公司一起卖给大资金",
        condition: (s) => s.tags.includes("ico-cashed") || s.tags.includes("ico-pumper"),
        effects: { endingId: "ico-exit" },
        resultText: "交割那天你把私钥和公章一起交了出去。账户里的数字是当年车库里的你们不敢想的。你在庆功宴上没说出口的一句话是：「我们赚的是时代的 β，不是自己的 α。」——但 β 也是钱，落袋为安不是罪。",
        lessonTitle: "创业课 · 认清 β 与 α",
        lesson: "2017 年链圈暴富的多数回报来自周期 β（市场水位）而非个人 α（真实能力）。索罗斯的反射理论：在泡沫里赚钱不可耻，可耻的是把 β 当 α 然后加杠杆。认清这一点的人，离场时手不会抖。",
      },
      {
        id: "keep-hodling", text: "死撑发币路线：牛市一定会回来",
        effects: { endingId: "ico-hodl" },
        resultText: "你又撑了两年。2021 年牛市真的回来了，你的币也真的涨过——但监管的目光比你涨得更快。项目被认定非法公开融资的那天，你在退赔协议上签字，算了一下：这些年赚的快钱，连本带息刚好退完。",
        lessonTitle: "创业课 · 周期的钟摆与监管的钟摆",
        lesson: "2021 年 9 月，发改委等十部门将虚拟货币相关业务定性为非法金融活动——牛市救不了合规死亡。孙宇晨们可以反复横跳，普通创业者没有第二次机会。看懂两个钟摆：市场的和监管的，缺一不可。",
      },
    ],
  },
  // ── 剧本模式：流量之巅（2019） ─────────────────────────────────────────────
  {
    id: "sc-mcn-boom",
    title: "流量洼地的最后窗口",
    minStage: 1, weight: 0, once: true,
    scene:
      "2019 年，短视频的补贴大战进入尾声。你的内容工作室刚做出一条 500 万播放的视频，MCN 机构就带着合同找上门：「签约我们，保底年薪 200 万，流量包管够。」而同一天，你最喜欢的创作者发了条动态：流量越来越贵，红利期快关了。",
    choices: [
      {
        id: "own-brand", text: "做自己的账号矩阵：不签独家，all-in 内容质量",
        effects: { usersPct: 30, product: 8, morale: 5 },
        resultText: "你把 200 万保底拒之门外，把钱全砸进了内容和团队。头三个月播放量惨淡，合伙人开始动摇。第五个月，一条认真做了两周的视频爆了——5000 万播放。你明白了：算法的尽头是人心。",
        lessonTitle: "创业课 · 流量租赁 vs 资产自建",
        lesson: "李子柒、办公室小野的教训与启示：MCN 保底合同的本质是流量租赁，租来的流量随时收回；账号矩阵+自有 IP 是重资产，慢但属于你。papi 酱 2016 年拒绝长期绑定、自建团队，是内容创业资产化的早期范本。",
      },
      {
        id: "sign-fast-money", text: "签约拿保底：先落袋 200 万，流量交给机构",
        effects: { cash: 40, valuationPct: 15, flag: "mcn-signed-fast", morale: -3 },
        resultText: "200 万到账，工作室升级了设备，你给自己发了笔奖金。但合同第 14 页写着：账号归机构所有，商务报价机构说了算。第二年你才发现，你的账号一年给机构赚了 2000 万，而你的分成还是按 200 万底薪算的。",
        lessonTitle: "创业课 · 保底合同的数学",
        lesson: "MCN 保底合同的经典结构：底薪买断你的账号所有权+商务定价权+竞业。机构赚的是「你爆红」的期权，保底只是期权金。李子柒与微念的纠纷（2021 年对簿公堂、停更 500 天）证明：签合同时你以为的保底，往往是别人眼中的封顶。",
      },
    ],
  },
  {
    id: "sc-mcn-gimmick",
    title: "数据造价的报价单",
    minStage: 3, weight: 0, once: true,
    scene:
      "品牌方拿着报价单找上门：「你们矩阵 5000 万粉丝，坑位费 50 万，我们要求保 ROI 1:5。」商务总监凑过来压低声音：「其实刷量和剧情直播的转化率能凑出来——行业里都这么干，央视还没查到这里。」",
    choices: [
      {
        id: "real-data", text: "给真实数据：ROI 做不到 1:5 就直说，按 1:2 报价",
        effects: { reputation: 10, cash: 15, usersPct: -5 },
        resultText: "品牌方愣了一下，说你们是第一家敢把真实转化率贴在 PPT 首页的。这单只赚了 15 万，但三个月后对方把整个年度预算都给了你们：「跟不吹牛的人合作，睡得着。」",
        lessonTitle: "创业课 · 复购率是内容的照妖镜",
        lesson: "直播带货 2019-2021 年泡沫期，行业平均退货率 30-50%、ROI 注水普遍；而坚持真实数据的谦寻（薇娅）、美 ONE（李佳琦）拿到了品牌最长的合同。流量是一锤子买卖，复购才是商业模式。数据造假省下的钱，会在复购率上还回来。",
      },
      {
        id: "fake-gmv", text: "接了：刷单+剧情砍价，先把 50 万坑位费赚到手",
        effects: { cash: 50, reputation: -12, flag: "mcn-faked" },
        resultText: "GMV 报表漂亮极了：单场 800 万。只有财务知道退货率 62%、实际成交不到 300 万。品牌方老板在行业饭局上夸你「数据能打」，你端着酒杯笑，胃里有点沉。",
        lessonTitle: "创业课 · GMV 泡沫的账期谋杀",
        lesson: "2021 年双十一后多起「GMV 对赌纠纷」曝光：刷单撑起的 GMV 伴随的是巨额退货和品牌方账期拖延，多家 MCN 死于现金流而非内容。辛巴燕窝事件（2020 年退一赔三、账号封停 60 天）证明：剧情可以演，产品不会配合你演。",
      },
    ],
  },
  {
    id: "sc-mcn-taxstorm",
    title: "税务稽查风暴",
    minStage: 4, weight: 0, once: true,
    scene:
      "2021 年底，薇娅 13.41 亿补税罚款的新闻刷爆全网，雪梨、林珊珊先后被查。你的财务顾问连夜来电：「你们工作室的『税收洼地』核定征收，正是这次稽查的重点。主动补申报可以只补税+滞纳金，被查出来就是 0.5-5 倍罚款。」",
    choices: [
      {
        id: "voluntary-tax", text: "主动补税：全额申报+滞纳金，清理所有洼地合同",
        effects: { cash: -35, reputation: 12, morale: 3, flag: "mcn-tax-clean" },
        resultText: "补税单比你想象的长，但你睡得着了。行业大清洗后，品牌方重新招标——「完税证明」成了硬门槛，合规的 MCN 反而拿到了溢价的合同。你在全员大会上说：「薇娅塌房那天，就是我们的招生简章。」",
        lessonTitle: "创业课 · 税收洼地的保质期",
        lesson: "薇娅 13.41 亿、邓伦 1.06 亿、范冰冰 8.8 亿——「洼地核定征收」在金税四期大数据比对下无所遁形。主动补税（首违不罚+仅滞纳金）与被查（0.5-5 倍罚款+封禁）的差距，就是合规决策的 ROI。",
      },
      {
        id: "pray-audit", text: "心存侥幸：那么多家，未必查到我这小工作室",
        effects: { cash: 20, reputation: -10, flag: "mcn-tax-gray" },
        resultText: "你赌赢了第一年。第二年春天，税务稽查的通知还是来了：补税+滞纳金+一倍罚款，金额是当年「省下」的三倍。更贵的是，平台把你的信用分降了一档，流量分配肉眼可见地少了。",
        lessonTitle: "创业课 · 侥幸是最贵的税筹",
        lesson: "金税四期的监管逻辑是数据比对（银行流水 vs 申报收入 vs 平台分账），不依赖举报和抽查。2022 年后直播行业补税名单以百位计。侥幸不是策略，是延期付款——而且利率由监管说了算。",
      },
    ],
  },
  {
    id: "sc-mcn-fade",
    title: "算法翻脸",
    minStage: 4, weight: 0, once: true,
    scene:
      "平台算法调整了：你赖以起家的「剧情短视频」权重腰斩，流量像退潮一样消失。同时平台推出「主播限薪令」和打赏新规，腰部主播的收入一夜回到三年前。团队看着断崖下跌的播放曲线，等着你给答案。",
    choices: [
      {
        id: "follow-algorithm", text: "押注新算法：直播切片+知识付费，跟着平台转型",
        effects: { cash: -15, usersPct: 20, product: 10 },
        resultText: "你把团队裁了一半，剩下一半转型做直播切片和课程。三个月播放量回到八成，收入结构反而更健康了：广告+带货+课程三条腿。你在复盘里写：「算法不是你的用户，它甚至不是你的合作伙伴——它只是天气。」",
        lessonTitle: "创业课 · 平台依赖症",
        lesson: "Zynga 之于 Facebook、MCN 之于抖音快手，死于同一病因：单一平台依赖。健康的内容公司把平台当渠道而非客户——刘畊宏 2022 年爆红后第一时间多平台分发，就是给自己买「算法保险」。",
      },
      {
        id: "wait-old-days", text: "死磕原路线：算法总会变回来的，熬着",
        effects: { cash: -20, morale: -12, usersPct: -25 },
        resultText: "你熬了六个月，播放量没有回来。最忠粉的那批观众开始问：「你们怎么还在拍这个？」你想起 2019 年那个拒绝 200 万签约的自己——原来拒绝的不是钱，是那次转型演练的机会。",
        lessonTitle: "创业课 · 沉没成本与算法",
        lesson: "内容行业的「路径依赖死亡」：押注单一内容形态=做空算法变化。抖音 2020 年后平均 6-12 个月一次大调权，每次调权都是一次行业洗牌。把「适应平台变化」写进组织能力，而不是写进祈祷。",
      },
    ],
  },
  {
    id: "sc-mcn-endgame",
    title: "流量之巅的终局",
    minStage: 4, weight: 0, once: true,
    scene:
      "2022 年，流量之巅的牌桌重新发牌。三条真实创业者走过的路摆在你面前：把流量沉淀成自有品牌（参考交个朋友转型直播供应链公司上市）；高价把工作室卖给平台或大 MCN，落袋为安；或者继续all-in 内容，赌自己永远不过气。",
    choices: [
      {
        id: "brand-pivot", text: "转型自有品牌：流量为品牌服务，做长期生意",
        condition: (s) => !s.tags.includes("mcn-faked"),
        effects: { endingId: "mcn-brand" },
        resultText: "你们用三年攒下的信任做了第一款自营产品，首发当晚售罄。后来你们上了市——招股书「竞争优势」一栏写的是：复购率 47%，全网最高。敲钟那天你说：「流量会过期，信任不会。」",
        lessonTitle: "创业课 · 从流量到留量",
        lesson: "交个朋友（罗永浩）从直播带货到借壳上市、东方甄选转型自营品牌——流量生意的终点都是「流量资产化」：把注意力兑换成品牌、供应链或信任。只会买流量的公司永远是平台的打工者。",
      },
      {
        id: "sell-to-platform", text: "高价卖身：把工作室和账号矩阵卖给平台系 MCN",
        effects: { endingId: "mcn-signed" },
        resultText: "交割协议的数字让你和合伙人在会议室沉默了很久——是当年拒绝的那个 200 万的几十倍。买方负责人说：「我们买的是你们的操盘能力。」你点点头，心里知道：还买了你们熬出来的那个时代。",
        lessonTitle: "创业课 · 内容公司的估值逻辑",
        lesson: "无忧传媒、遥望科技收购大量腰部工作室的逻辑：单账号估值 = 粉丝资产 × 变现稳定性 × 团队操盘能力。卖身不是失败——开心麻花、笑果的内容资产化路径证明：在正确的时间把内容能力卖给更大的资本，是 A 级退出。",
      },
      {
        id: "content-forever", text: "继续 all-in 内容：我再做十条爆款证明自己",
        effects: { endingId: "mcn-faded" },
        resultText: "你又做了两年，出过两条爆款，但播放曲线的中枢一路下移。新一代的创作者用你当年看不懂的形式抢走了注意力。停更那天你发了最后一条视频：「谢谢陪过我的人。」评论区置顶的回复是：「原来你还在？」",
        lessonTitle: "创业课 · 内容行业的代际诅咒",
        lesson: "内容平台的残酷规律：每 18-24 个月一次注意力代际更替（图文→短视频→直播→切片），没有组织化转型的个人/工作室存活率极低。papi 酱停更转型幕后、薇娅塌房后谦寻转供应链——留在镜头前的人，最终都被镜头遗忘。",
      },
    ],
  },
  // ── 剧本模式：雷曼时刻（2008）· 隐藏彩蛋剧本 ────────────────────────────────
  {
    id: "sc-lehman-collapse",
    title: "那个叫雷曼的周一",
    minStage: 1, weight: 0, once: true,
    scene:
      "2008 年 9 月 15 日，周一。你开了一夜的空调还是睡不着——新闻里，158 年历史的雷曼兄弟申请破产保护，全球股市血崩。你的 A 轮领投方发来一封只有三行的邮件：「LP 冻结了所有新承诺。我们的 term sheet 撤回。祝好。」你账上的现金，还剩 4 个月。",
    choices: [
      {
        id: "war-chest", text: "进入战时状态：当天砍 40% 开支，现金是唯一信仰",
        effects: { cash: 20, team: -3, morale: -10, flag: "crisis-lean" },
        resultText: "你在 48 小时内完成了裁员、退租、砍项目三件事。被裁的工程师临走时说「理解，但别忘了欠我一顿饭」。你看着延长到 11 个月的跑道，心里只有一句话：斯瓦尔巴特种子库原则——文明的前提是先活下来。",
        lessonTitle: "创业课 · 危机 48 小时",
        lesson: "2008 年 9 月，红杉资本向全体被投企业发布「RIP Good Times」内部信：砍掉不盈利业务、现金为王、假设最坏情况。 Airbnb 那年估值砍掉一半仍坚持融资，最终活成巨头。危机中的决策窗口只有几天——慢一周，选项就少一半。",
      },
      {
        id: "business-as-usual", text: "静观其变：也许只是华尔街感冒，我们照旧扩张",
        effects: { cash: -15, morale: 3, flag: "crisis-denial" },
        resultText: "你选择了相信这只是「华尔街的事」。两周后你的第二大客户砍掉了全年预算，销售 pipeline 消失了三分之一。你在白板上写下新的现金流预测，笔尖顿了很久—— denial 的账单，总是以复利计价。",
        lessonTitle: "创业课 · 否认阶段的代价",
        lesson: "危机心理学五阶段：否认→愤怒→讨价还价→抑郁→接受。企业死法排名：死于否认的远多于死于寒冬本身。2008 年倒下的公司多数不是 9 月死的，是 11-12 月现金流耗尽才死——中间有三个月可以自救，他们用来开会祈祷。",
      },
    ],
  },
  {
    id: "sc-lehman-freeze",
    title: "融资市场的北极",
    minStage: 2, weight: 0, once: true,
    scene:
      "2008 年 Q4，融资市场彻底冻结。你连续被 11 家机构拒绝，最短的一次对方只听了 4 分钟——「市场不好，过两年再来」。TSR（TERM SHEET）成了传说。CFO 给你看数字：按现在的烧钱速度，3 月发不出工资。今夜必须做出选择。",
    choices: [
      {
        id: "down-round", text: "打折融资：估值砍 60% 也要拿钱（down round）",
        effects: { cash: 35, valuationPct: -40, morale: -8, flag: "crisis-downround" },
        resultText: "新投资人的条款很冷酷：估值只有上一轮的四成，还要求董事席位。你签了—— chalk it up to 活下来。老股东们脸色难看，但三个月后他们都发来同一句话：「幸好你当时签了。」",
        lessonTitle: "创业课 · Down Round 的智慧",
        lesson: "Flat/down round 不等于失败：2009 年 Airbnb 估值腰斩融资仍坚持拿钱；Square 2012 年 down round 后两年上市。融资的第一定律：现金优先级永远高于估值尊严。估值可以涨回来，公司没了就什么都没了。",
      },
      {
        id: "bridge-family", text: "亲友过桥：向老股东和创始人自己借钱续命",
        effects: { loan: 30, morale: -5, flag: "crisis-bridge" },
        resultText: "你把自己唯一的房子做了抵押，老股东们凑了一笔过桥。签字那天你手在抖——这已经不是公司融资，是拿人生下注。桥的那头要么是回暖，要么是深渊，没有中间地带。",
        lessonTitle: "创业课 · 创始人个人担保",
        lesson: "2008-2009 年无数创业者抵押房产发工资（马斯克 2008 年同时押上特斯拉和 SpaceX 最后的钱）。个人担保是把「有限责任」变回「无限责任」——用之前要算清楚：输了是破产，家人住哪里。勇气值得尊敬，但值得尊敬不等于值得模仿。",
      },
    ],
  },
  {
    id: "sc-lehman-contrarian",
    title: "遍地尸体的并购市场",
    minStage: 3, weight: 0, once: true,
    scene:
      "2009 年初，坏消息堆里开始出现一种奇怪的机会：三家竞对挂出了「整体出售」的牌子，报价只有去年估值的 1/3；被裁的资深工程师在 LinkedIn 上排着队找工作；写字楼空置率创了纪录，房东愿意免租 6 个月。投资人在电话那头说：「历史上所有伟大的公司，都在这种时候捡过便宜。」",
    choices: [
      {
        id: "buy-distressed", text: "逆势抄底：折价收购一家竞对的核心团队+客户",
        condition: (s) => s.cash > 25 || s.tags.includes("crisis-downround") || s.tags.includes("crisis-lean"),
        effects: { cash: -25, team: 4, usersPct: 35, mrrPct: 25, valuationPct: 20 },
        resultText: "你用去年 1/3 的价格买到了对方五年的积累：一个成熟团队、四十个大客户、一整套文档。整合阵痛了三个月，第四个月你们的 MRR 反超危机前。危机复盘会上你说：「别人恐惧时贪婪，知易行难——难在你自己也恐惧。」",
        lessonTitle: "创业课 · 危机并购的艺术",
        lesson: "2009 年科技并购大潮：惠普 27 亿买 3Com、德勤统计当年 Q4 并购量暴增——买方全是现金充裕的幸存者。危机并购三原则：买的是「人和客户」不是壳；整合方案先于交易谈判；只用「亏得起的钱」。当然，前提是你先活到了 2009 年。",
      },
      {
        id: "hunker-down", text: "只守不攻：把每一分钱花在活着上",
        effects: { cash: 10, product: 8, morale: -3 },
        resultText: "你关掉了所有进攻性支出，带着精干的团队打磨产品。市场回暖时，你的产品评分比危机前高了 20 分——客户回流的速度超过了你的预期。不是每次危机都要抄底，活得久的人才有选择权。",
        lessonTitle: "创业课 · 不动如山的价值",
        lesson: "巴菲特「别人贪婪我恐惧」的另一半是「有时候什么都不做」。2009 年没有抄底的公司很多也活得很好——关键不是动作，是资产负债表允许你选。抄底是奢侈品，现金流纪律才是必需品。",
      },
    ],
  },
  {
    id: "sc-lehman-stimulus",
    title: "四万亿与行业洗牌",
    minStage: 3, weight: 0, once: true,
    scene:
      "2008 年 11 月，四万亿刺激计划出台；大洋彼岸，QE1 启动。政策和货币的双闸门同时打开——但水没有均匀流淌：基建、新能源、消费互联网接到了水管，外贸和传统制造还在结冰。你的客户名单和现金流预测，取决于你站在哪根水管下面。",
    choices: [
      {
        id: "ride-stimulus", text: "调整航向：把产品和销售对准政策扶持的方向",
        effects: { cash: -10, mrrPct: 30, usersPct: 20, months: 1 },
        resultText: "你用两个月完成了产品线的政策适配。当第一笔政府背景客户的订单到账时，你发现对手们还在抱怨「水都流到了别处」。危机最大的教训：宏观政策是创业者的天气系统——可以抱怨天气，也可以学会看云图。",
        lessonTitle: "创业课 · 政策贝塔的识别",
        lesson: "2009 年后中国 VC 集体转向「四万亿受益行业」：光伏、电商、手游轮流接棒。创业者的政策敏感度=生存率：同样是 2008 年创立，对准消费互联网的都等到了 2010 年的移动互联网浪潮，守着旧需求的熬到了 2012 年还在等风。",
      },
      {
        id: "stay-course", text: "保持航线：我们不做政策投机，只做正确的事",
        effects: { morale: 5, product: 5, mrrPct: -10 },
        resultText: "你拒绝了「追政策热点」的建议。团队士气因为「有原则」而高涨，但财务数据不会说谎：你的复苏曲线比转行的对手们慢了两个季度。你安慰自己慢即是快——只是「慢」的利息，也是真金白银。",
        lessonTitle: "创业课 · 原则的机会成本",
        lesson: "「不做政策投机」听起来高尚，但贝索斯会说：「你的利润就是我的机会。」原则需要定价：坚持航线的真实成本是复苏速度。成熟的做法不是全押或全拒，而是核心产品线不动、边缘资源试水——用 20% 的机动性换政策贝塔的期权。",
      },
    ],
  },
  {
    id: "sc-lehman-endgame",
    title: "雷曼时刻的终局",
    minStage: 4, weight: 0, once: true,
    scene:
      "2010 年，金融危机两周年。市场的废墟上站起了新的秩序：活下来的公司拿走了死去公司的客户、人才和市场份额。你的公司在董事会上有三个选项：全面扩张，吃掉危机期间攒下的全部势能；接受巨头的战略投资，借船出海；或者保持精益，把危机里练出的成本纪律变成长期竞争力。窗外，纽约的天际线没有变——变的是站在楼里的人。",
    choices: [
      {
        id: "expand-post-crisis", text: "全面扩张：危机攒下的势能一次兑现",
        condition: (s) => s.tags.includes("crisis-lean") || s.tags.includes("crisis-downround"),
        effects: { endingId: "lehman-winner" },
        resultText: "你在全员大会上宣布扩张计划时，台下安静了几秒，然后掌声炸了。当年被裁员的工程师回来了两个。两年后行业复盘，你的名字出现在「金融危机十大赢家」的名单上，颁奖词写着：「他在别人死亡时出生。」",
        lessonTitle: "创业课 · 危机红利的兑现",
        lesson: "2009-2010 年扩张的幸存者吃到了 2010-2015 年的完整牛市：Uber、Airbnb 都在危机中完成了产品和组织的深蹲，回暖后全面起跳。深蹲的质量决定起跳的高度——危机里的每一分纪律，都是回暖后的杠杆。",
      },
      {
        id: "strategic-investor", text: "接受巨头战投：借渠道和品牌完成规模化",
        effects: { endingId: "lehman-survivor" },
        resultText: "战投协议的交割仪式上，对方 CEO 说：「我们看中的不是你们现在的收入，是你们在 2008 年活下来的方式。」你保留了控股权，拿到了渠道。危机教会你生存，战投教会你规模——两课相加，是完整的创业教育。",
        lessonTitle: "创业课 · 战投的双刃剑",
        lesson: "2009 年后科技战投大爆发（谷歌、腾讯、阿里扫货式投资）。战投的核心价值是「战略协同」而非资金——腾讯投京东给流量入口、谷歌投安卓建生态。代价是独立性让渡：签之前想清楚，你要的是钱、渠道，还是靠山——三者的合同完全不同。",
      },
      {
        id: "stay-lean-forever", text: "永远精益：不再相信增长叙事",
        effects: { endingId: "lehman-hermit" },
        resultText: "你把「现金为王」四个字刻在了会议室墙上，任何扩张提案都要先过「雷曼测试」：如果明天市场冻结，这个决定会杀死我们吗？公司活得很好，但也再没有惊艳过。有员工在离职面谈里说：「这里安全得像银行——但我来创业公司不是为了安全。」",
        lessonTitle: "创业课 · 创伤后应激性保守",
        lesson: "PTSD 式的经营哲学：经历过 2008 的创始人很多在 2010-2020 错过了整轮移动互联网——过度防御的代价是机会成本。风险管理的目标是「活下来继续下注」，不是「再也不下注」。凯恩斯：「长期来看我们都死了。」",
      },
    ],
  },
  {
    id: "sc-jobs-garage",
    title: "车库里的第一批 50 台",
    minStage: 1, weight: 0, once: true,
    scene:
      "1976 年，加州洛思阿图斯。你 21 岁，和高中时代就认识的技术宅朋友挤在他父母家的车库里，焊板子、攒机箱。第一批 50 台电脑是赊账买的零件装的，交货期限是 30 天。周五晚上，本地一个计算机俱乐部要办展示会，所有人都带自己攒的机器去交流——那是这个时代唯一的获客渠道。账上每一分钱都是借来的，错过这次展示，下个月连车库的电费都付不起。",
    choices: [
      {
        id: "demo-everything", text: "带上样机去俱乐部做现场演示：让产品自己说话",
        effects: { cash: 8, morale: 5, flag: "jobs-demo" },
        resultText: "你在展示会角落里接上电视，机器开机的瞬间屏幕亮起字符——人群呼啦一下围了过来。当晚有 3 个经销商留了电话，一周后第一笔订单进来：50 台，全款预付。你数着支票想：原来最好的销售话术，是一个能当场跑起来的产品。",
        lessonTitle: "创业课 · 演示即获客",
        lesson: "1976 年的家酿计算机俱乐部（Homebrew Computer Club）是 PC 革命的策源地：乔布斯和沃兹在这里演示了 Apple I，拿下第一批经销商订单。在那个没有互联网的时代，线下社群就是唯一的冷启动渠道——今天对应的是 Product Hunt、垂直社群和线下 meetup。产品能在真实环境里当场跑起来，胜过一百页 BP。",
      },
      {
        id: "polish-first", text: "先把产品打磨完美再亮相：第一印象只有一次",
        effects: { cash: -6, morale: 2, flag: "jobs-perfectionist" },
        resultText: "你推迟了亮相，多花三周重做外壳和说明书。产品确实更漂亮了，但俱乐部的人已经见过竞争对手的演示，订单流向了先到场的人。完美主义的账单上写着一行小字：窗口期不等人。",
        lessonTitle: "创业课 · 先发窗口",
        lesson: "PC 行业的先发优势极大：Apple II 早于 IBM PC 五年定义了个人电脑形态。完美主义适合抛光阶段，不适合卡位阶段。判断标准是：晚一周上线，失去的东西（渠道、心智、标准制定权）值不值这一周？Reid Hoffman 的名言可以倒着用：如果你对产品完全不感到难堪，你已经上线晚了。",
      },
    ],
  },
  {
    id: "sc-jobs-partner",
    title: "合伙人的 50% 难题",
    minStage: 1, weight: 0, once: true,
    scene:
      "第一批订单回款后，技术宅朋友把你约到车库里，话说得很直：「板子是我设计的，系统是我写的，生意是我们两个人的——一人一半。」你心里算了一笔账：公司接下来要融资、要雇人、要开拓渠道，这些都是你跑出来的；但你也清楚，没有他，你手里只有一腔热血和借来的车库。股权怎么分，今晚必须谈定——谈崩了，两个人才散伙是最常见的死法。",
    choices: [
      {
        id: "equal-split", text: "一人一半，白纸黑字写清楚，从此绑死",
        effects: { cash: 6, morale: 8, team: 2, flag: "jobs-partner-loyal" },
        resultText: "你们握手时谁都没说话，但你知道这个决定在十年后价值连城。技术合伙人从此把全部聪明劲都押在公司上——他后来为产品省下的每一个设计决策，都比那多让出的几个点值钱。多年以后有人问你合伙人怎么找的，你说：「找一个你愿意分一半江山的人，然后真的分。」",
        lessonTitle: "创业课 · 股权即承诺",
        lesson: "乔布斯与沃兹尼亚克在创立苹果时约定了各 45% 的股权（预留 10% 给早期投资人马库拉），绑定持续十余年。股权的本质是对未来的承诺结构：让技术合伙人拿足份额，他才会把最优设计决策留给公司而非留给自己。博弈论的结论很冷：长期合作的最优策略是让对方也赢。",
      },
      {
        id: "keep-control", text: "你出 65%：生意、渠道、融资都是你在跑，他要理解",
        effects: { cash: 5, team: -2, morale: -6, flag: "jobs-partner-bitter" },
        resultText: "他沉默了很久，最后说「行，你说了算」。从那天起他仍然写最好的代码，但你感觉车库里少了点什么——后来他才告诉你，那天回家后他认真考虑过把设计卖给另一家公司。你赢了股权的算术，输掉了一点人心。算术和人心，哪个在公司账上？",
        lessonTitle: "创业课 · 控制权的隐性成本",
        lesson: "早期公司最贵的不是工资而是合伙人的心气。控制型股权分配短期占优，长期会抑制合伙人的主人翁投入——Facebook 创立早期扎克伯格稀释萨维林的股权导致反目与诉讼，苹果后期乔布斯与沃兹也因理念不合渐行渐远。股权谈判赢多赢少，会在之后十年以复利形式回到公司账上。",
      },
    ],
  },
  {
    id: "sc-jobs-gui",
    title: "帕洛阿尔托的那次参观",
    minStage: 2, weight: 0, once: true,
    scene:
      "1980 年代初，一家复印机巨头的研究院向你敞开大门——你只需要用一些期权换一次参观。你走进去，看到一个屏幕上跑着图形界面：鼠标、窗口、图标、下拉菜单。你瞬间明白了计算机的未来长什么样——但你手里的产品还是命令行，一行行敲代码的原始形态。问题是：巨头研究院的东西能『借鉴』吗？同行都说这是抄袭，你的工程师说从零重做要 18 个月。",
    choices: [
      {
        id: "steal-gui", text: "好艺术家借鉴，伟大的艺术家偷窃：立刻立项做图形界面",
        effects: { cash: -6, team: 3, morale: 4, flag: "jobs-gui" },
        resultText: "你把工程师们叫到白板前，画了三个小时你看到的未来：点击图标就能用电脑，不需要背命令。有人质疑这是抄来的，你回了一句后来被引用一万遍的话。18 个月后产品发布，评论家说「其他电脑都像石器时代」。你把参观那天定为公司的生日。",
        lessonTitle: "创业课 · 技术预见力",
        lesson: "1979 年乔布斯参观施乐 PARC，看到 Alto 的 GUI 后 Apple 立项 Lisa 与 Macintosh，把图形界面带给大众；施乐拥有技术却没看懂自己的发明，这是商业史上最著名的『发明者悖论』。毕加索的原话是：好艺术家模仿皮毛，伟大艺术家偷走灵魂——偷的是对用户价值的理解，而不是代码。预见到别人已有但没人重视的东西，是创业者最贵的能力。",
      },
      {
        id: "stay-cli", text: "坚守命令行：那是我们的技术根基，抄袭会遭行业唾弃",
        effects: { morale: -3, flag: "jobs-nogui" },
        resultText: "你守住了『原创者』的清白。两年后，竞争对手把图形界面的电脑卖进了千家万户，你的技术根基变成了技术遗迹。行业没有唾弃任何人——行业只唾弃迟到的人。清白在手，市场份额在对手那里。",
        lessonTitle: "创业课 · 发明的归属权",
        lesson: "施乐 PARC 发明了 GUI、以太网、激光打印，却几乎没赚到任何钱——因为施乐的组织基因是卖复印机的，看不懂自己的发明。发明的归属从不属于『最先做出来的人』，而属于『第一个把它变成大众产品的人』。GUI 如此、搜索引擎如此、智能手机也如此。道德洁癖在资本市场上没有估值。",
      },
    ],
  },
  {
    id: "sc-jobs-coup",
    title: "董事会里的政变",
    minStage: 3, weight: 0, once: true,
    scene:
      "公司上市了，但你和管理团队的裂痕也在加深：你坚持产品要『酷』，管理层要的是利润率；你骂产线是垃圾，工程师们开始不敢进你的办公室；新品延期、库存积压，股价从高点腰斩。某个周二下午，你信任的 CEO 把你叫进会议室，桌上放着一份文件：董事会已经表决，你被剥夺了经营实权，调去一个没有下属的『董事长』职位。这家你用名字命名的公司，把你从驾驶座上请了下来。",
    choices: [
      {
        id: "accept-exile", text: "体面离场：保留股权和董事席位，先保住手里的一切",
        effects: { cash: 20, morale: -10, team: -2, flag: "jobs-ousted" },
        resultText: "你在办公室坐到凌晨，最后只带走了一张椅子——你是被从自己创立的公司里赶出来的，但至少不是净身出户。走出大楼时你回头看了一眼 logo，想起车库里的第一批 50 台。股权还在，人心散了；钱保住了，名字暂时不属于你了。",
        lessonTitle: "创业课 · 创始人 ouster",
        lesson: "1985 年乔布斯被苹果董事会架空后愤而离职——这是硅谷最著名也最昂贵的治理事故之一：赶走创始人的苹果此后十二年迷失了产品灵魂，直到 1997 年把他请回来。现代公司治理里，创始人保护条款（双股权结构、董事会否决权）就是为这种时刻设计的。创始人的『难搞』一半是缺陷，一半是公司最稀缺的资产——判断力。",
      },
      {
        id: "legal-war", text: "发起反击：动用股权和舆论，和管理层鱼死网破",
        effects: { cash: -10, valuationPct: -25, morale: -15, team: -5, flag: "jobs-war" },
        resultText: "你雇了律师、联系了记者，董事会会议室变成了战场。三个月后你赢了几个条款，但公司的股价又跌了三分之一，三个核心工程师在混乱中离职加入了对手。你保住了面子，公司输了里子——而面子在纳斯达克不值一分钱。",
        lessonTitle: "创业课 · 内耗的复利",
        lesson: "创始人与董事会的战争没有赢家：OpenAI 2023 年的宫斗事件证明，即使顶级机构在内耗时也会瞬间蒸发数百亿估值。治理冲突的正确解法是提前设计（股权结构、董事会构成、创始人条款），而非事后开战。创始人要记住一个残酷等式：董事会战赢来的每一块钱，都会以公司价值的形式加倍还回去。",
      },
    ],
  },
  {
    id: "sc-jobs-next",
    title: "流放者的下一台机器",
    minStage: 3, weight: 0, once: true,
    scene:
      "离开自己公司的第二年，你创办了一家新公司，名字只有一个词，定位是『给高校和实验室的终极工作站』。你烧钱如烧纸：请顶级建筑师把总部修成黑色立方体，机器追求完美到连内部线路都要排列整齐——成本是竞品的两倍，售价是三倍。投资人开始皱眉：这不是一家公司，这是你证明自己的纪念碑。账上的钱只够 14 个月了。",
    choices: [
      {
        id: "next-pragmatic", text: "砍掉完美执念：聚焦一个垂直市场，先让公司活下来",
        effects: { cash: 10, team: 2, flag: "jobs-humble" },
        resultText: "你把产品线砍到只剩一款，定价对标竞品，销售转向了实际有预算的高校系所。黑色立方体总部依旧安静，但财务报表第一次出现了接近平衡的数字。你在全员信里写：「被赶出苹果教会我最重要的事——公司存在的意义是让产品到达用户，不是让创始人抵达神坛。」",
        lessonTitle: "创业课 · 流放期的价值",
        lesson: "NeXT 在商业上是失败的（累计亏损、硬件停产），但乔布斯在流放期完成了两件大事：学会经营纪律（NeXT 后期靠软件授权扭亏），并收购皮克斯积累了动画产业的运营经验。1996 年苹果 4.29 亿美元收购 NeXT，真实目的从来不是硬件，而是乔布斯带回的操作系统和管理团队。失败公司的最大资产，是变强了的创始人。",
      },
      {
        id: "double-down", text: "偏执才能改变行业：继续加注，做一台完美的机器",
        effects: { cash: -12, morale: 4, flag: "jobs-monument" },
        resultText: "新机器发布那天，媒体评价「这是十年内最美的工业设计」——然后无人买单。销量只有预测的三成，你在董事会上第一次听到『清盘』这个词。完美这台机器确实改变了行业，只不过是以『失败的教科书案例』的方式写进了商学院教材的第三章。",
        lessonTitle: "创业课 · 完美主义的边界",
        lesson: "NeXT 的教训是产品哲学的边界案例：乔布斯式的偏执在苹果是对的（整合软硬件、死磕体验），在 NeXT 是错的（无视价格带和渠道）。同一套哲学，舞台不同，结论相反。创业者的成熟标志，是能区分『这个产品需要完美』和『这只是我的 ego 需要完美』——两者的成本都极高，只有一个能卖钱。",
      },
    ],
  },
  {
    id: "sc-jobs-return",
    title: "王者归来的董事会",
    minStage: 4, weight: 0, once: true,
    scene:
      "1997 年。你离开十二年的那家公司濒临破产，董事会请你回来救火——条件是收购你的新公司，你以顾问身份回归。十二年后再次走进那间会议室，当年的反对者有些已经不在，公司账上现金只够 90 天。你站在白板前，划掉了 70% 的产品线，只留下四个象限。有人小声问：就这四款？你说：「专注就是把其他的都说不。现在，我们来重新定义这家公司。」窗外，正是互联网浪潮将起的前夜。",
    choices: [
      {
        id: "focus-simplify", text: "极致专注：砍到四款产品，All-in 一个时代级机遇",
        condition: (s) => s.tags.includes("jobs-gui") || s.tags.includes("jobs-humble"),
        effects: { endingId: "jobs-legend" },
        resultText: "你把全部资源压进一个『不同凡想』的赌注：一台透明的彩色电脑，和一个能装进口袋的『互联网设备』。三年后，那两个产品分别成为史上最畅销的个人电脑和重新定义手机的设备。你在 keynote 舞台上从口袋掏出它的那一刻，全世界的竞争对手都沉默了——十二年的流放，换回来的是一个时代的入场券。",
        lessonTitle: "创业课 · 聚焦的复利",
        lesson: "1997 年乔布斯回归苹果后把 350 个产品线砍到 10 个，画出著名的四象限矩阵；随后用 iMac、iPod、iPhone 完成了商业史上最伟大的 turnaround。他的管理哲学浓缩为一句：「专注就是对另外一百个好主意说不。」公司的资源永远少于野心，赢家的唯一解法是押注——而押注的前提是敢砍。",
      },
      {
        id: "steward-comeback", text: "稳健回归：止血、修渠道、用五年时间把公司带回正轨",
        condition: (s) => s.tags.includes("jobs-ousted"),
        effects: { endingId: "jobs-phoenix" },
        resultText: "你没有赌上全部——先止住出血，修复与经销商的关系，用两代人畜无害的产品赢回现金流，再慢慢图谋反击。五年后公司重回盈利，媒体标题是「回来了，但不再是那个乔帮主」。你自己也接受了这个版本：不是每个归来都必须惊天动地，能把亲手创立的公司从棺材里抬回来，本身就是 A 级的结局。",
        lessonTitle: "创业课 · 回归者的两种剧本",
        lesson: "创始人回归有两种范式：乔布斯的孤注一掷（高风险高回报）与更常见的「托管人模式」（止血、修复、渐进创新）。1997 年后苹果的奇迹建立在『时间窗口 + 现金流安全垫』两个前提上——不是每个回归者都同时具备。理性评估自己的牌面，是创始人最被低估的能力。",
      },
      {
        id: "empire-monument", text: "重建帝国：用十二年的执念，把公司变回自己的纪念碑",
        effects: { endingId: "jobs-exile" },
        resultText: "你赢了每一场董事会战役：赶走异己、恢复权威、把 logo 重新刻上每一栋楼。公司活了下来，但你始终没回答那个真正的问题——下一台机器为什么而存在？多年后公司仍在盈利，评论员的评价一针见血：「这是一家由胜利者管理的、却不再发明任何东西的公司。国王回到了王位，王国却停止了生长。」",
        lessonTitle: "创业课 · 权威与使命",
        lesson: "创始人回归最大的陷阱是把『夺回控制权』误认为『完成使命』。控制权是手段，产品使命才是目的——混淆两者的回归者会把公司变成个人纪念碑：远看巍峨，近看空心。董事会请你回来，买的是你的判断力，不是你的复仇剧本。",
      },
    ],
  },
  {
    id: "sc-blade-permit",
    title: "批文与酒局",
    minStage: 1, weight: 0, once: true,
    scene:
      "1998 年，深圳。你的电子加工厂接到了第一笔出口大单——但配额批文卡在某个办事员的抽屉里，正常排队要八个月，客户的交货期只有六周。一个自称「熟门熟路」的中间人约你在酒楼见面，酒过三巡，他把话挑明：有关系可以快，价钱好商量，「大家都这么走」。他举杯等你回答，包厢里的空调很冷。",
    choices: [
      {
        id: "walk-away", text: "起身离席：这单不要了，规矩比订单大",
        effects: { cash: -5, morale: -3, flag: "blade-straight" },
        resultText: "你放下筷子说了声抱歉。大客户黄了，厂里当月只发了八成工资，车间主任找你谈话，觉得你「不懂事」。你把那张名片揉成一团，却没扔——你告诉自己：记住这张脸，记住这条路有多少人在走。",
        lessonTitle: "创业课 · 第一块多米诺",
        lesson: "灰色收入的第一笔永远数额不大、理由永远充分——「就这一次」「大家都这么干」。野夫《身边的江湖》里写江湖人的堕落：不是某一天决定的，是第一笔不该拿的钱决定的。《狂飙》里高启强的滑落也不是从杀人开始，而是从收第一笔「辛苦费」开始。滑落的起点都长得 innocuous，代价都在十年后结账。",
      },
      {
        id: "pay-guanxi", text: "把酒干了：费用走咨询费科目，先拿下订单",
        effects: { cash: 12, valuationPct: 8, flag: "sin-permit" },
        resultText: "三周后批文到手，客户惊叹你的「效率」。季度报表好看了，银行主动来问要不要贷款。只有你自己知道那笔「咨询费」躺在账本的哪个角落——以及那个中间人现在有你办公室的电话。捷径的第一步最轻，轻到你几乎听不见落地声。",
        lessonTitle: "创业课 · 捷径的利息",
        lesson: "九十年代沿海的「批文经济」是真实历史：配额、牌照、退税指标都可以流通。走捷径的代价不只是钱——每一次灰色交易都让你多了一个知情者，而知情者是有记忆、有要价权的。商业史上，靠关系拿到的订单最终都折算成了控制权的让渡。",
      },
    ],
  },
  {
    id: "sc-blade-customs",
    title: "报关行的特殊通道",
    minStage: 2, weight: 0, once: true,
    scene:
      "出口量上来之后，合作的报关行老板请你喝茶，递给你一份「优化方案」：货值低报三成，关税和增值税能省下一大截，「行业里默认的玩法，稽查抽不到我们」。他轻描淡写地说，一年能省下的钱够你在南山买两套房子。你的财务负责人坐在旁边，手在桌下捏着笔，没有抬头。",
    choices: [
      {
        id: "declare-full", text: "按实际货值如实申报： sleep 踏实比利润重要",
        effects: { cash: -8, morale: 2, flag: "blade-straight" },
        resultText: "你的报价比同行高了，一个客户转单给了「更便宜」的对手。你在报关单上签下真数字的那一刻，财务负责人松了一口气——后来她告诉你，她已经写好了辞职信，如果你签字她当天就交。留住一个敢辞职守底线的人，比省下的税贵，也比税值钱。",
        lessonTitle: "创业课 · 组织风向标",
        lesson: "创始人对灰色收入的态度，是全公司道德水位的水尺。签字低报货值，等于向财务、报关、销售全员广播：这里的规则是可以议价的。之后你吸引来的、留下的，都是规则感可议价的人——而这种人会在关键时刻以同样的逻辑对待你。",
      },
      {
        id: "under-declare", text: "签「优化方案」：省下的都是纯利润，先活下来",
        effects: { cash: 15, valuationPct: 10, flag: "sin-customs" },
        resultText: "当年利润翻了近一倍，你在年会上宣布全员双薪。台下欢呼声里，报关行老板悄悄发来一条短信：「兄弟，账上那几笔差价，哥帮你做了两年期的『技术咨询服务』，别问细节。」你盯着「别问细节」四个字看了很久——从今天起，你的公司有了一些你自己都不完全知道的账目。",
        lessonTitle: "创业课 · 看不见的合伙人",
        lesson: "接受灰色安排的那一刻，你就引入了一个不在工商登记里的合伙人：所有经手人。他们没有股权，却共享你的秘密——而共享秘密是这世界上绑定最深的合伙形式。共享型合伙人不会出现在董事会上，只会出现在你需要「配合调查」的那天。",
      },
    ],
  },
  {
    id: "sc-blade-bathhouse",
    title: "澡堂里的控制权",
    minStage: 2, weight: 0, once: true,
    scene:
      "亚洲金融风暴的余波卷到了你的上下游：客户拖款、银行抽贷，账上现金只够六周。约你谈「债务重组」的人把地点选在澡堂——蒸腾的热气里，谁都藏不了录音笔。他的方案很直白：他的钱可以进来填窟窿，但要的不是利息，是「大家一起做事」。你想起上个月那笔批文、那份报关单——原来每一步都记在某个账上，今天一起来结账。",
    choices: [
      {
        id: "sell-shrink", text: "断臂求生：卖设备、砍产线、缩小一半，不借这个钱",
        effects: { cash: -6, team: -4, morale: -8, flag: "blade-straight" },
        resultText: "你卖掉了两条产线，裁掉了跟了你三年的老班组。签字那天车间安静得可怕，有个老师傅走时把工具擦得锃亮，还给了你。公司缩成了原来的一半，但每一分钱都说得清来路。澡堂那位的钱最终流进了你的对手公司——两年后那家公司的老板成了新闻里的通报人物。",
        lessonTitle: "创业课 · 最难的拒绝",
        lesson: "企业危机期的「白衣骑士」要价最高，因为知道你无处可去。接受带控制权的救命钱，等于把公司从「你的」变成「大家的」——高启强的建工集团、无数被「战略投资」后创始人出局的公司，剧本都一样。缩小的公司是自己的，扩大的公司如果是别人的，规模只是别人的战利品。",
      },
      {
        id: "take-money", text: "签：先渡过眼前，控制权的事以后再说",
        effects: { cash: 25, team: 2, morale: 3, flag: "sin-bath" },
        resultText: "资金到账，工资如期发出，公司活了下来。但从那天起，你的采购部多了一位「副总介绍来的主管」，你的仓库进出的货偶尔会「换单」。你在办公室里装了一把更结实的锁，然后意识到一个恐怖的事实：你需要防的已经不是外面的人了。",
        lessonTitle: "创业课 · 控制权的让渡不可逆",
        lesson: "控制权出让容易收回难：黄光裕与陈晓的国美之战、无数创始人被资本请出自己公司的故事，起点都是一次「先渡难关」的签字。带控制权的资金不是债务，是并购——只是被包装成了借款。判断标准永远只有一个：这笔钱进来之后，谁说了算？",
      },
    ],
  },
  {
    id: "sc-blade-shell",
    title: "做平报表的那个深夜",
    minStage: 3, weight: 0, once: true,
    scene:
      "为了拿到银行的低息贷款，财务负责人深夜把你的办公室门关上，声音压得很低：账面流水还差一截，「做两轮关联往来」就能把收入做实——通过几家壳公司走一遍资金，合同、发票、流水全套齐活。「银行不会查穿透的，」她说，「但决定权在你。出了事，进去的是我签的字。」她看着你，等一个答案。你想起她当年那封没交出去的辞职信。",
    choices: [
      {
        id: "real-books", text: "把真报表递给银行：贷不到就少贷，利息高一点认了",
        effects: { loan: 12, valuationPct: -12, morale: 4, flag: "blade-straight" },
        resultText: "银行只批了六成额度，利率上浮两成。财务负责人走出会议室时忽然说：「老板，我跟你干到退休。」很多年后公司上市尽调，会计师在你的流水里一个字都挑不出来，项目在同行里创造了最快过会纪录。那封没交的辞职信，后来被她裱起来挂在办公室——比什么激励计划都管用。",
        lessonTitle: "创业课 · 干净的报表是最贵的资产",
        lesson: "真实的财务记录是创始人最被低估的资产：尽调快、融资顺、关键时刻睡得着。相反，做过关联交易的报表是一颗定时炸弹——它不会因为公司做大而失效，只会因为公司做大而威力倍增。恒大的清盘、乐视的崩塌，尽调档案里翻出的都是十年前埋的雷。",
      },
      {
        id: "fake-flow", text: "做：让财务安排，天知地知",
        effects: { loan: 32, valuationPct: 22, flag: "sin-shell" },
        resultText: "贷款到账，利率漂亮，副行长后来升了行长，见到你都热情。报表上的数字像一座刷了新漆的楼，只有你知道承重墙里有空洞。财务负责人那天下班最早，你听见她在楼梯间打了个很长的电话。三个月后她交了辞呈——「孩子要上学」——你不敢问真假。",
        lessonTitle: "创业课 · 共谋的脆弱性",
        lesson: "共谋关系是最不稳定的人际关系：每个参与者都握着所有人的把柄，也都活在「谁先开口」的恐惧里。所以共谋组织的成员会加速流失、互相提防、层层设防——内耗成本远高于省下的一切。让下属替你做违法的决定，等于亲手教会她：这个组织里什么都可以交易，包括你。",
      },
    ],
  },
  {
    id: "sc-blade-photo",
    title: "那张合影",
    minStage: 3, weight: 0, once: true,
    scene:
      "凌晨两点，你收到一封没有署名的邮件：一张合影——某家夜夜笙歌的会所门口，你的「副总」和几位不该同框的人笑得很开心，照片角落里有半张你的侧脸（你记得那晚你只是去接人）。邮件只有一句话：「底片有价。」你盯着屏幕，忽然意识到自己早已身处一个你不了解规则的游戏：把柄在这里是硬通货，而你的账户余额，别人似乎比你更清楚。",
    choices: [
      {
        id: "report-cut", text: "报警并切割：副总停职，配合说明一切",
        effects: { cash: -12, team: -3, morale: -6, flag: "blade-straight" },
        resultText: "副总被带走调查那天在电梯里对你说：「老板，你这一辈子就毁在『干净』两个字上。」你没回话。半年后判决下来，他在里面给你写了一封信，只有一句：「你说得对，出来我想做点干净生意。」勒索邮件再没来过——对没有秘密的人，底片一文不值。",
        lessonTitle: "创业课 · 把柄经济学",
        lesson: "把柄的价值 = 对方守住它的意愿。秘密越多的人，勒索市场对他报价越高；干净的人天然免疫。《人民的名义》里大风厂股权纠纷的起点、无数官场商战的突破口，都是「掌握了一点什么」。防守把柄的最优策略不是藏得更好，而是少制造把柄——这听起来像废话，却是被反复验证的唯一正解。",
      },
      {
        id: "buy-negative", text: "出钱买下底片，息事宁人",
        effects: { cash: -8, flag: "sin-photo" },
        resultText: "对方收钱很痛快，快得像排练过。底片「买」回来了，但你买回的是一张长期饭票的收据——三个月后对方的「朋友」又来谈「合作」，六个月后是「借款」。你第一次明白：向勒索者付款不是解决问题，是完成首轮融资——对方拿你的钱，扩张的是拿捏你的业务。",
        lessonTitle: "创业课 · 勒索的首轮融资",
        lesson: "博弈论对勒索的冷酷结论：任何一次付款都会显著增加后续被勒索的概率——你用自己的行为证明了你愿意付。商业史上处理勒索/敲诈的正确案例几乎都是「拒绝并公开」：秘密见光即死。支付的每一分钱都是在给对方的「拿捏你」业务做估值背书。",
      },
    ],
  },
  {
    id: "sc-blade-trial",
    title: "雷霆行动",
    minStage: 4, weight: 0, once: true,
    scene:
      "2010 年代，专项行动的风暴扫过这座城市。你认识的某位「大哥」在某个清晨被带走，电视新闻用了三分钟播报；报关行老板的手机已成空号；财务负责人的旧同事们陆续接到配合调查的电话。你的办公室门被敲响的那一刻，你发现自己并没有想象中慌乱——二十年前酒楼的那张名片、报关单上的签名、壳公司的公章、底片的收据……你心里有一本账，每一笔都清楚自己在哪一页。",
    choices: [
      {
        id: "clean-witness", text: "干干净净：作为证人配合调查，说出你知道的一切",
        condition: (s) => !s.tags.some((t) => t.startsWith("sin-")),
        effects: { endingId: "blade-clean" },
        resultText: "专案组的人翻完你二十年的流水，合上卷宗说了句难得的话：「查了你三个月，你是我经手的案子里最无聊的一个。」你回到工厂，设备换了三代，厂房扩了两次，每一分钱都说得清来路。有年轻创业者慕名来请教「成功秘诀」，你带他参观完仓库，只说了四个字：慢就是快。他显然不信。二十年前你也不信。",
        lessonTitle: "创业课 · 慢就是快",
        lesson: "把二十年放在一张表里看：走捷径的人前五年指数增长、第六年被连根拔起；走直路的人增长平缓、复利不中断。最终净值差出一个数量级——这就是「慢就是快」的数学本质。监管成熟、金税四期、CRS 信息交换的时代，灰色空间不是变小了，是消失了。干净，已经从道德选择变成了唯一划算的算法。",
      },
      {
        id: "clean-expand", text: "清白者的时代：当年的拒绝都变成了护城河，全力扩张",
        condition: (s) => !s.tags.some((t) => t.startsWith("sin-")),
        effects: { endingId: "blade-clean" },
        resultText: "风暴过后，倒下的「聪明人」腾出了市场、客户和人才——他们的下游发现只有你的公司经得起任何审查，订单像退潮后回到干净港湾的鱼群。你在全员大会上没讲战术，只讲了那晚酒楼你放下的那双筷子。台下安静了几秒，掌声响起来的时候，你知道这家公司最值钱的东西，二十年前就装好了。",
        lessonTitle: "创业课 · 声誉的复利",
        lesson: "声誉是少数会复利的无形资产：每一次「不方便的拒绝」都在给未来的自己存款，而风暴（监管收紧、行业洗牌、尽调）就是集中兑付的时刻。巴菲特说建立声誉要二十年、毁掉只要五分钟——反过来说，守住底线的回报也常常在二十年后的五分钟里一次性到账。",
      },
      {
        id: "cooperate-light", text: "配合调查，退赃退股，争取宽大",
        condition: (s) => { const n = s.tags.filter((t) => t.startsWith("sin-")).length; return n >= 1 && n <= 2; },
        effects: { endingId: "blade-survivor" },
        resultText: "你把当年的「咨询费」、省下的税款一笔笔记成清单，能退的退、能缴的缴。判决书比最坏的预想轻——因为你只有两页账，而且交出得足够快。走出法院那天阳光刺眼，公司缩水成原来的一小半，但公章还姓你的姓。你给当年那个报关行老板写了封信，他没回。后来才知道，他还在里面，刑期是你的六倍。",
        lessonTitle: "创业课 · 落网的宽严梯度",
        lesson: "真实司法实践里，主动投案、退赃退赔、检举揭发对应的正是最宽的梯度——近年的反腐与税务大案通报里，「积极配合」四个字多次改变了刑期量级。但宽大也有边界：它减的是刑期，不删的是案底。你二十年前只签过两次名，所以你还回得来。",
      },
      {
        id: "cooperate-heavy", text: "配合调查、全额退赃——但欠的账太多，宽大也有边界",
        condition: (s) => s.tags.filter((t) => t.startsWith("sin-")).length >= 3,
        effects: { endingId: "blade-atone" },
        resultText: "你交出了一份连办案人员都惊讶的完整账——五页，每一页都清清楚楚。「配合」两个字确实救了你的命：指控从五项减到三项，刑期从十年减到三年。宣判那天你在被告席上没有哭，直到听见「没收违法所得」时也没什么感觉——那些钱你早就花成厂房和设备了。真正让你眼眶一热的是旁听席：老财务带着全厂四十七个工人，一个都没少。他们决定等你回来。",
        lessonTitle: "创业课 · 从轻的边界",
        lesson: "司法宽严的第一变量从来不是态度，是数额与次数：同样是「积极配合」，偷税 200 万和虚开 2 亿对应的结局完全不同。宽大量刑可以减情节、不能消事实——签过的每一页账都在案卷里占一个页码。这就是为什么刀尖上的第一笔最贵：它不是第一笔，是后面每一笔的利息起算日。",
      },
      {
        id: "burn-resist", text: "负隅顽抗：销毁证据、串供，赌一把查不到底",
        condition: (s) => s.tags.some((t) => t.startsWith("sin-")),
        effects: { endingId: "blade-prison" },
        resultText: "你烧掉了能找到的凭证，叮嘱所有人「统一口径」。第一个开口的却是跟了你最久的报关主管——她的孩子那年高考。办案人员后来告诉你，你的「统一口径」比他们整理的证据链还完整：每个谎言都互相印证，钉死了每个人。宣判那天你在被告席站了很久，想起 1998 年酒楼里那杯没喝的酒。原来从放下筷子的那一刻起，结局就写好了——只是你选了另一条路。",
        lessonTitle: "创业课 · 毁灭证据的数学",
        lesson: "现代经侦的证据体系早已不依赖单一口供：银行流水、税务数据、通讯记录、同行者证词构成多重交叉验证，「统一口径」在交叉验证面前等于主动绘图。刑法上毁灭证据、串供是法定从重情节——它不改变过去，只加重未来。刀尖上跳舞的人总以为终点是上岸，统计意义上，终点几乎都是审判席。",
      },
    ],
  },
  // ── v1.6-beta：Big Al 债务重组（紧急贷款缠身时的专属抉择）──
  {
    id: "debt-restructure", title: "债权人约谈：重组还是清算", weight: 0, once: true,
    minStage: 2,
    condition: (s) => (s.loan ?? 0) > 60 && (s.zeroRev ?? 0) >= 3,
    scene:
      "紧急贷款方把你叫进了一间没有窗户的会议室。桌上摊着你公司的现金流预测：连续多个月收入近零，贷款本金滚到了危险线。对方给出了三个方案，但每一个都带着刺。「我们不想清盘，」对方说，「清盘对我们也是损失。但你得证明你还想活。」",
    choices: [
      {
        id: "negotiate-cut", text: "谈判砍债：一次性拿出大部分现金，换取本金打折", condition: (s) => s.cash > 5,
        effects: { loanMult: 0.55, cashMult: 0.7, reputation: -6, morale: -5 },
        resultText: "你把账上七成的现金拍在桌上，换回了 45% 的本金减免。走出大楼时天在下雨，但公司是你的了——连同那份用血汗换来的、更薄的债务表。",
        lessonTitle: "创业课 · 债务重组的艺术",
        lesson: "贾跃亭与乐视的反面教材、通用汽车 2009 年破产保护后重生：债权人只要相信你有恢复偿付的能力，就愿意「以时间换空间」。砍债的本质是让对方相信「你活着比清盘值钱」。代价是信用记录——短期内没有银行会再理你。",
      },
      {
        id: "new-for-old", text: "借新还旧：找过桥机构再借一笔，先堵住这个窟窿",
        effects: { loanMult: 1.15, loan: 20, flag: "toxic-terms", morale: -8 },
        resultText: "新贷款到账那天，对方代表笑着说「合作愉快」。你没笑。你知道自己签的是一份『毒丸』条款——下一轮融资时，这笔钱的清算优先权会让所有新投资人皱眉。但今晚，至少能发工资。",
        lessonTitle: "创业课 · 毒丸条款",
        lesson: "优先清算权、对赌回购、可转债高利贷——救急的钱往往附带最狠的条款。硅谷银行暴雷前夜，多少初创企业的现金一夜冻结。过桥资金的核心问题从来不是利率，而是它在你资本结构里埋下的那颗雷。",
      },
      {
        id: "tough-it-out", text: "硬扛：不重组，慢慢还",
        effects: { loanMult: 1.05, morale: -10, health: -8 },
        resultText: "你拒绝了所有方案，选择正面硬刚复利。团队看着你眼里的血丝，没人说话。你知道这个决定意味着什么：接下来每个月，利息都会先一步吃掉利润。",
        lessonTitle: "创业课 · 复利是你的敌人",
        lesson: "年化 34% 的复利意味着债务每两年翻一倍。巴菲特说复利是世界第八大奇迹——但对负债者，它是绞索，每个月收紧一圈。硬扛成立的前提是收入曲线即将抬头，否则只是延长痛苦。",
      },
    ],
  },
  // ── v1.6-beta：地狱难度 · 中国特别版系统性风险（全部类型化化名，不影射真实案件）──
  {
    id: "hell-sasac", title: "国资监管新规征求意见", hellOnly: true, weight: 4, minStage: 3,
    scene:
      "某部委发布征求意见稿：你所在的行业若涉及数据或关键资源，控股股东结构可能面临新的穿透式审查。行业协会连夜开会，大家口径一致——「监管是为了行业更健康」。但会议室散场后，每个创始人都在打同一个电话：问律师。",
    choices: [
      {
        id: "proactive-filing", text: "主动申报、配合整改（花钱消灾）",
        effects: { cash: -18, reputation: 6 },
        resultText: "律师团队驻场两周，把股权结构和数据流程全部梳理了一遍。钱花得心疼，但监管沟通会上，你是唯一一家材料齐全的——态度本身就是护身符。",
        lessonTitle: "创业课 · 监管是环境变量，不是黑天鹅",
        lesson: "教培、游戏版号、互联网平台反垄断——系统性监管从不针对某一家公司，它是整个经济体的呼吸节律。成熟创始人的做法是：把合规当成本中心提前布局，而不是当灾难事后补救。",
      },
      {
        id: "wait-see", text: "观望：等细则落地再说",
        effects: { reputation: -8, loan: 15, morale: -5 },
        resultText: "你选择了等等看。三个月后细则落地，适用条款比征求意见稿更严。因为被动整改，银行收紧了你的授信，紧急贷款补上了缺口。省下的律师费，变成了更贵的代价。",
        lessonTitle: "创业课 · 观望是最贵的选项",
        lesson: "政策窗口期里，早表态者获得「整改样板」身份（甚至参与细则座谈），观望者只能被动接受。滴滴上市后的网络安全审查、蚂蚁的暂缓——监管环境里，信息和时间就是护城河。",
      },
    ],
  },
  {
    id: "hell-detention", title: "核心高管被留置协助调查", hellOnly: true, weight: 3, minStage: 3, once: true,
    condition: (s) => s.team >= 4,
    scene:
      "凌晨两点，你的 COO 被监委带走协助调查——他上一家公司的旧案牵到了他。凌晨四点，投资人在群里问：公司运营是否受实质影响？凌晨五点，你盯着天花板想：这个月的关键客户拜访，谁来顶？",
    choices: [
      {
        id: "open-communication", text: "对内坦诚+对外统一口径，自己顶上关键岗位",
        effects: { cash: -8, morale: -4, reputation: 4, team: -1 },
        resultText: "你召开了全员会：不隐瞒、不猜测、只讲工作安排。你自己接管了 COO 的全部客户。两周后 COO 配合完调查平安回来——他在留置室外看到你的排班表，眼圈红了。",
        lessonTitle: "创业课 · 危机时刻，创始人就是首席沟通官",
        lesson: "新东方在双减后体面退场、海底捞面对食品安全舆情的 24 小时回应——危机公关的第一原则是速度+坦诚。高管个人风险与公司风险必须隔离：关键岗位要有 AB 角，客户关系的备份是组织建设的一部分。",
      },
      {
        id: "deny-everything", text: "对外称「正常休假」，掩盖过去",
        effects: { reputation: -15, morale: -10, team: -1 },
        resultText: "纸包不住火。员工从新闻里看到消息的那刻，信任崩塌比股价下跌更快。两位骨干一周内提了离职——他们不是怕公司出事，是怕创始人说谎。",
        lessonTitle: "创业课 · 信任是唯一的货币",
        lesson: "安然公司倒掉不是因为做假账的技术差，而是因为说谎让每一次真话都变廉价。团队能接受公司倒霉，不能接受被骗。",
      },
    ],
  },
  {
    id: "hell-tax-audit", title: "税务稽查通知书", hellOnly: true, weight: 4, minStage: 2,
    scene:
      "税务局发来稽查通知：公司成立以来的进项抵扣和个人所得税申报进入抽查范围。你的财务顾问小声说：早期为了省现金流，有几笔居间费走了个人账户……",
    choices: [
      {
        id: "full-compliance", text: "全面自查补税+滞纳金，一次清账",
        effects: { cashMult: 0.85, reputation: 5 },
        resultText: "补税加滞纳金吞掉了账上 15% 的现金，但换来了完税证明和一份干净的审计底稿。后来 Pre-IPO 尽调时，这份底稿帮你省下了两个月的解释时间。",
        lessonTitle: "创业课 · 税务合规是融资的隐形通行证",
        lesson: "金税四期下，个人账户收付款、虚开发票几乎无所遁形。补税的现金痛苦是一次性的，税务瑕疵在融资尽调里暴露的代价是致命的——VC 的合规清单上，税务是红线第一条。",
      },
      {
        id: "hope-luck", text: "赌抽查抽不到实质问题，按兵不动",
        effects: { cash: -25, reputation: -12, morale: -6 },
        resultText: "稽查组查了三个月。那几笔居间费被认定为偷逃税款，补税、罚款、滞纳金三件套齐活，还登上了税务公告的「典型通报」。品牌合作方打来电话的语气都变了。",
        lessonTitle: "创业课 · 在金税系统面前没有侥幸",
        lesson: "范冰冰案、薇娅案：税务罚单最狠的部分从来不是税款本身，而是滞纳金、罚款和公众信任的叠加损失。早期省钱是本能，省在税务上是自杀。",
      },
    ],
  },
  {
    id: "hell-antitrust", title: "涉嫌垄断的举报函", hellOnly: true, weight: 3, minStage: 4,
    condition: (s) => s.users > 3000 || s.mrr > 80,
    scene:
      "竞争对手向市场监管部门递交举报函：指责你利用「二选一」协议和排他性条款封锁渠道。律师看完举报材料说：「条款确实签得激进，但行业里都这么干。」——问题是，现在行业龙头已经被罚过了，「都这么干」不再是辩护词。",
    choices: [
      {
        id: "self-rectify", text: "主动终止排他条款+发布合规承诺",
        effects: { cash: -12, usersPct: -8, reputation: 8 },
        resultText: "你主动撕掉了七份排他协议，短期渠道确实松动了，但监管部门把你列入了「主动整改名单」。竞争对手的小动作反而让你看清了哪些渠道是真正的护城河。",
        lessonTitle: "创业课 · 规模是合规的闹钟",
        lesson: "阿里 182 亿罚单确立的原则：市占率超过阈值后，「行业惯例」不再适用。创新可以野蛮生长，规模化之后必须「穿越回」规则之内。真正的护城河从不是排他条款，是用户离不开你。",
      },
      {
        id: "fight-back", text: "正面硬刚：发声明指责恶意举报",
        effects: { cash: -20, reputation: -10, morale: -5 },
        resultText: "声明发出当天上了热搜——但热搜词条是「#某公司回应垄断举报#」。监管约谈如期而至，公司被迫在媒体围观下整改，比安静认罚狼狈十倍。",
        lessonTitle: "创业课 · 与监管对轰是最差策略",
        lesson: "与监管博弈的正确姿势是「律师对律师、制度对制度」，把争议留在专业场域。公开对抗只会把行政处罚升级成立法关注——后者的代价高两个数量级。",
      },
    ],
  },
  {
    id: "hell-data-review", title: "数据安全现场检查", hellOnly: true, weight: 4, minStage: 3,
    condition: (s) => ["ai", "fintech", "consumer", "game"].includes(s.industry.id),
    scene:
      "网信办会同专家组进驻公司，对数据存储、用户授权、跨境传输做现场检查。技术负责人额头冒汗：早期为了快速迭代，用户同意书用的是模板，埋点权限也超了范围……",
    choices: [
      {
        id: "full-remediation", text: "借检查全面整改：下架冗余埋点+重做授权流程",
        effects: { cash: -15, product: -5, reputation: 6 },
        resultText: "整改让产品迭代慢了两个月，但检查组在报告里写下了「整改态度积极」。更重要的是，重做授权流程时你砍掉了 60% 的无效埋点——产品反而更清爽了。",
        lessonTitle: "创业课 · 数据合规倒逼产品瘦身",
        lesson: "GDPR 罚亚马逊 7.46 亿欧元、国内某出行平台 80.26 亿罚单——数据合规不是成本，是底线能力。好消息是合规整改往往顺带完成「技术债大扫除」，短期变慢，长期更快。",
      },
      {
        id: "minimal-patch", text: "只做表面功夫：改改文案应付检查",
        effects: { reputation: -10, usersPct: -5, loan: 10 },
        resultText: "检查组离开三个月后，一篇用户数据泄露报道把你顶上了风口浪尖。监管回头看，公司被列入重点名单——合作方开始要求额外的数据安全保证金，紧急贷款又一次填坑。",
        lessonTitle: "创业课 · 表面合规是最大的不划算",
        lesson: "应付式合规的成本是复合的：监管信任、合作方信任、用户信任同时折价。每一次「回头查」的代价都是首次整改的 3-5 倍。",
      },
    ],
  },
  {
    id: "hell-social-insurance", title: "社保稽核与劳动仲裁", hellOnly: true, weight: 4, minStage: 2,
    condition: (s) => s.team >= 5,
    scene:
      "一位离职员工申请劳动仲裁：加班费、未休年假、社保未足额缴纳——三项打包索赔。更麻烦的是，他贴出了全员工资条截图，公司「按最低基数缴纳社保」的潜规则被摊在了阳光下。在职员工的目光开始闪躲。",
    choices: [
      {
        id: "settle-reform", text: "调解赔偿+全员社保基数合规化",
        effects: { cashMult: 0.88, morale: 8, reputation: 4 },
        resultText: "调解金加全员社保补缴，账上现金骤减。但一周后，三位老员工主动找你谈长期规划——「跟着你，不怕后方起火」。你这才明白：合规是最贵的福利，也是最便宜的留人手段。",
        lessonTitle: "创业课 · 劳动合规是隐性薪酬",
        lesson: "按最低基数缴社保是 90% 初创的潜规则，但它埋着两颗雷：员工仲裁（一告一个准）和核心人才流失（看得懂的员工会用脚投票）。足额缴纳的本质是把「不信任成本」换成「组织凝聚力」。",
      },
      {
        id: "litigate", text: "奉陪到底：请律师打仲裁",
        effects: { cash: -15, morale: -12, reputation: -6 },
        resultText: "仲裁庭上你赢了程序，输了人心。判决书公开的当月，两位核心工程师入职了大厂——「创业公司连社保都算计」成了这个行业小圈子里的一句点评。",
        lessonTitle: "创业课 · 赢了官司，输了组织",
        lesson: "劳动争议里，法律成本只是冰山一角，真正的成本是剩余员工的心理账户。劳动仲裁记录是公开的，下轮融资做尽调时，HR 背调会原样呈现。",
      },
    ],
  },
  {
    id: "hell-abroad-freeze", title: "异地协查：账户被冻结", hellOnly: true, weight: 2, minStage: 3, once: true,
    scene:
      "财务突然报警：公司基本户被某地公安机关冻结——一笔客户的回款牵涉远方的电诈案件，协查文书直接锁死了账户。工资日还有 9 天，账户里躺着全公司下季度的口粮。律师说：解冻流程走下来，乐观也要 2-3 个月。",
    choices: [
      {
        id: "new-account", text: "紧急开立一般户+法人代表个人垫付工资",
        effects: { cash: -10, loan: 20, morale: -3 },
        resultText: "你用个人信用借了笔过桥资金开了一般户，工资准时到账。两个月后案件澄清、账户解冻，你在全员会上只说了三个字：「没事了。」但你自己知道，那 60 天里你白了多少头发。",
        lessonTitle: "创业课 · 账户冗余与现金流隔离",
        lesson: "企业账户被冻结在实践中并不罕见（涉诉、协查、税务保全）。成熟财务的标配：基本户+一般户双轨、工资专户隔离、法人应急授信。现金流管理的最高层级，是为「系统级意外」预留逃生舱。",
      },
      {
        id: "wait-thaw", text: "等解冻，跟员工解释延后发薪",
        effects: { morale: -18, team: -2, reputation: -5 },
        resultText: "工资迟发两周，两位员工贷款逾期的消息在群里炸开。虽然账户解冻后你补发了全部薪水加利息，但离职申请还是来了三份——其中一份来自你最不想失去的人。",
        lessonTitle: "创业课 · 发薪日是信任的计量器",
        lesson: "创业可以失败，工资不能拖欠——这是用无数公司验证过的组织铁律。员工个人财务经不起「公司不确定性」的传导，一次延薪摧毁的凝聚力，三次团建都补不回来。",
      },
    ],
  },
  {
    id: "hell-industry-crackdown", title: "行业专项整治风暴", hellOnly: true, weight: 3, minStage: 3, once: true,
    condition: (s) => s.industry.regRisk >= 0.2,
    scene:
      "监管部门宣布对你所在行业开展为期半年的专项整治：牌照复核、存量业务清理、新批项目暂停。行业协会的群里死一般寂静——上一次这种规模的整治，行业消失了三分之一的公司。",
    choices: [
      {
        id: "pivot-premium", text: "主动转型：砍低毛利业务，押注合规的高端线",
        effects: { cash: -20, product: -10, valuationPct: 10, reputation: 5 },
        resultText: "你在三个月内砍掉了 40% 的收入，把资源全部押向合规门槛更高的高端业务线。同行在寒冬里倒下时，你拿到了稀缺的资质牌照——风暴过后，沙滩上的幸存者屈指可数，而你握着铲子。",
        lessonTitle: "创业课 · 监管风暴是行业洗牌加速器",
        lesson: "P2P 清退后活下来的是持牌机构，教培转型后跑通的是素质教育和直播带货。整治从来消灭的是「伪需求+擦边球」，真正的需求只会在规范后以更贵的价格重新出现。",
      },
      {
        id: "hold-position", text: "坚守：赌整治雷声大雨点小",
        effects: { usersPct: -30, mrrPct: -25, cash: -15, morale: -10 },
        resultText: "整治不是雷声，是冰雹。牌照复核卡住、渠道全面收紧，收入曲线像断了线的风筝。你熬到了风暴结束，但公司已经瘦脱相——估值膝盖斩，投资人只想谈回购。",
        lessonTitle: "创业课 · 与监管周期对赌没有赢家",
        lesson: "「监管总会放松」在数学上是成立的，但在现金流上往往不成立——公司活不到那一天。活下去的前提是假设风暴持续两年，并做好在风暴最猛时转型的心理准备。",
      },
    ],
  },
  // ── v1.7.5 内容包 · 后期通用事件（minStage 5：规模化/上市前/独角兽阶段）──
  {
    id: "late-short-seller", title: "做空报告横空出世", minStage: 5, weight: 4, once: true,
    scene:
      "一家做空机构发布了 87 页的报告：质疑你的用户数据造假、关联交易不透明、现金流撑不过 12 个月。报告发布的上午，你的估值蒸发了 18%。投资人群炸了，董事会要求你 24 小时内回应。",
    choices: [
      {
        id: "transparent-defense", text: "48 小时内逐条公开回应+开放审计底稿",
        effects: { cash: -15, reputation: 10, morale: 5 },
        resultText: "你逐条晒出了数据口径和审计底稿。一周后做空机构悄悄删掉了报告里最狠的三条指控。投资者电话会议结束时，一位 LP 说：「危机是最好的尽调——我现在敢加仓了。」",
        lessonTitle: "创业课 · 透明度是最便宜的护城河",
        lesson: "瑞幸做空报告 89 页、浑水做空欢聚时代——做空机构是资本市场的免费审计师。应对做空唯一正确的姿势是数据透明：造谣止于底稿。Allbirds、蔚来都在做空报告后选择了全面公开。",
      },
      {
        id: "lawyer-up", text: "起诉做空机构「恶意诽谤」",
        effects: { cash: -25, reputation: -8, months: 1 },
        hidden: true,
        resultText: "诉讼立案那天股价反弹了 5%，但律师费像流水一样花了出去。三个月后法院以「学术质疑受言论自由保护」为由不予立案——你花了 25 万，替对方的报告做了一次免费传播。",
        lessonTitle: "创业课 · 别和做空者对轰",
        lesson: "特斯拉起诉做空者赢过个别案件，但绝大多数公司对做空机构的起诉都以败诉或撤诉告终——而且诉讼过程本身会让报告传播十倍。对手要的是注意力，你要的是现金流，别在对方的战场上开战。",
      },
    ],
  },
  {
    id: "late-patent-troll", title: "专利流氓敲门", minStage: 5, weight: 3, once: true,
    scene:
      "你收到一封律师函：一家注册在德州空壳公司指控你侵犯了他们的「基于互联网的商业模式」专利（2001 年注册，从未有过产品），索赔 800 万或庭外和解 120 万。法务说：这官司我们九成能赢，但打官司要 18 个月、律师费 200 万起。",
    choices: [
      {
        id: "fight", text: "硬刚到底：应诉+反诉专利无效",
        effects: { cash: -30, reputation: 12, morale: 5 },
        resultText: "18 个月后你赢了，专利被宣告无效。行业媒体报道了你的胜利，三家被同一家公司敲诈过的同行发来贺电——你们联手推动了一次专利法修订倡议。",
        lessonTitle: "创业课 · 专利流氓的商业模式",
        lesson: "专利流氓（Patent Troll）在美国是一个年产值 300 亿美元的产业：他们不买产品、不创新，只买专利然后批量起诉。扎克伯格说过：任何成功的产品都会收到专利敲诈函。应对策略：要么抱团应诉（LOT Network），要么快速和解止损——取决于你的现金跑道。",
      },
      {
        id: "settle", text: "花钱消灾：120 万和解",
        effects: { cash: -12, reputation: -5 },
        resultText: "和解协议签完第三周，你的竞对也收到了同样的律师函——你们只是这家空壳公司的年度 KPI 之一。内部信里你写道：「我们花钱买了 18 个月的安宁，但也给这个行业交了保护费。」",
        lessonTitle: "创业课 · 和解的经济学",
        lesson: "120 万和解 vs 200 万律师费 +18 个月管理层精力——很多时候和解是理性选择。但和解会吸引更多专利流氓（他们共享「付款名单」）。马化腾当年的选择是：大额专利战绝不和解，小额骚扰快速买断。",
      },
    ],
  },
  {
    id: "late-exec-exit", title: "二号人物出走", minStage: 5, weight: 4, once: true,
    condition: (s) => s.team >= 12,
    scene:
      "你的联合创始人/CTO 约你在车库咖啡馆见面——就是你们当年写第一行代码的地方。他推过来一份竞业的豁免申请：某大厂开出 3 倍薪资 + 独立事业部总裁的位置挖他。「我不是不爱这家公司，」他说，「我是想看看没有你的战场是什么样子。」",
    choices: [
      {
        id: "promote-partner", text: "给股份、给授权：升为联席 CEO",
        effects: { cash: -12, morale: 10, team: 0, flag: "co-ceo" },
        resultText: "他留下了。联席 CEO 的磨合比想象中痛——你们吵了三个月的战略，但第四个月，公司第一次同时拿下了两条产品线。十年后回顾，这是你做过最值的 20 万。",
        lessonTitle: "创业课 · 二号人物困境",
        lesson: "PayPal 的 Levchin、苹果的沃兹、联想的倪光南——每个巨头都经历过二号人物时刻。期权不是镣铐，授权才是羁绊。给不了的成长空间，多少钱都留不住。",
      },
      {
        id: "let-go", text: "体面放手：好聚好散+保留顾问身份",
        effects: { team: -3, morale: -12, product: -8, cash: 10 },
        resultText: "欢送宴上你们抱了一下，像七年前在车库那样。他走后三个月，技术路线偏航了两次——你这才意识到，那些年他替你挡掉了多少技术决策的地雷。",
        lessonTitle: "创业课 · 创始团队的离别管理学",
        lesson: "体面分手是技术活：竞业要谈、代码要交接、团队要稳住、期权成熟时间表要重新定义。Starbucks 创始人舒尔茨买回原公司时，第一件事就是把离开的老员工请回来。",
      },
    ],
  },
  {
    id: "late-data-breach", title: "用户数据泄露", minStage: 5, weight: 3, once: true,
    scene:
      "凌晨三点安全负责人打电话：一个配置错误的云存储桶，让 120 万用户的手机号和住址在公网暴露了 11 天。已经有用户在论坛发帖。监管规定：72 小时内必须向主管部门报告并通知用户。",
    choices: [
      {
        id: "disclose-72h", text: "72 小时内主动上报+全员通知用户",
        effects: { cash: -14, reputation: 8, usersPct: -8 },
        resultText: "通知邮件发出那天，客服热线被打爆，但也有用户在社交媒体留言：「至少他们告诉我了。」监管约谈时，你的主动报告成为减轻处罚的关键——最终罚款只有法定下限。",
        lessonTitle: "创业课 · GDPR 时代的 72 小时铁律",
        lesson: "Equifax 数据泄露拖了 40 天才披露，CEO 进国会听证、股价腰斩；而 Dropbox 主动披露的事件反而没掀起波澜。GDPR 罚金的计算基准里，「主动报告」是最高权重的减分项。隐瞒的代价永远是披露的十倍。",
      },
      {
        id: "quiet-fix", text: "悄悄修复，祈祷没人发现",
        effects: { cash: -5, reputation: -18, usersPct: -15 },
        hidden: true,
        resultText: "你堵上了漏洞。但三周后，一个安全研究员把事件捅给了媒体，标题是《某公司隐瞒用户数据泄露近一个月》。监管立案调查，罚款按上限的 80% 执行。",
        lessonTitle: "创业课 · 纸包不住火定律",
        lesson: "在安全圈，「悄悄修」约等于「等着被捅」。安全研究员的存在就是让隐瞒暴露——他们以此为职业荣誉。Uber 2016 年数据泄露隐瞒案最终以 1.48 亿美元和解收场。",
      },
    ],
  },
  {
    id: "late-cash-squeeze", title: "银根骤紧：账上只剩 6 个月", minStage: 5, weight: 5, once: true,
    condition: (s) => s.cash < s.team * 8,
    scene:
      "CFO 把现金流量表放在你面前：按现在的烧钱速度，账上现金只够 6 个月。下轮融资最早 4 个月后才能 close。会议室里安静得能听见中央空调的声音。",
    choices: [
      {
        id: "cut-deep", text: "断臂求生：裁 20% 人员+砍所有非核心项目",
        effects: { team: -4, morale: -15, cash: 30, reputation: -5 },
        resultText: "裁员那天你在停车场坐到凌晨。但第二个月，烧钱速度降了 35%，剩余跑道变成 14 个月——你们活下来了。被裁员工里有两个三个月后加入了客户公司，反而带来了订单。",
        lessonTitle: "创业课 · 裁员要一次裁到位",
        lesson: "本·霍洛维茨《创业维艰》：「裁员就像截肢，一次切不干净就要切第二次，而第二次没人相信你还能活。」2000 年泡沫时两次以上裁员的公司死亡率是单次裁员的 3 倍。深裁一次，留住核心，保住士气。",
      },
      {
        id: "bridge-round", text: "向现有股东借过桥贷款续命",
        effects: { loan: 30, flag: "toxic-terms", morale: -5 },
        resultText: "老股东的钱到账了，但条款里有一行小字：「若 12 个月内未完成下一轮融资，按本金 1.5 倍回购。」你又多了一年的命，也多了一颗定时炸弹。",
        lessonTitle: "创业课 · 过桥贷款是带引信的救生圈",
        lesson: "桥接轮（Bridge Round）是真实创业的最高危操作：它用未来的不确定性换今天的时间。Bridge 的利率不重要，回购条款才重要——它会把「融不到资」从慢性病变成急性病。",
      },
    ],
  },
  {
    id: "late-reg-inquiry", title: "交易所问询函", minStage: 5, weight: 4, once: true,
    scene:
      "你收到了交易所/证监部门的问询函：连续三个季度毛利率异常波动 + 前五大客户集中度 78%，要求 15 个交易日内书面回复。投行说：「答得好是加分项，答不好就是现场检查。」",
    choices: [
      {
        id: "full-disclosure", text: "请最贵的审计所，逐条附底稿回复",
        effects: { cash: -18, reputation: 8 },
        resultText: "47 页回复函附了 200 多页底稿。问询函回完，你的 IR 团队反而整理出了一套「投资者问答圣经」——之后的每一场路演，你都用这次问询的框架讲故事。",
        lessonTitle: "创业课 · 问询函是最好的免费顾问",
        lesson: "A 股问询函制度 2019 年全面推行后，能高质量回复问询的公司 IPO 通过率显著更高。监管帮你问出了投资人不敢问、媒体问不到的问题。把问询函当免费尽调，而不是麻烦。",
      },
      {
        id: "minimal-reply", text: "法务模板式回复，能省则省",
        effects: { cash: -5, reputation: -10, months: 1 },
        hidden: true,
        resultText: "模板回复的第 9 天，第二封问询函到了——这次的问题是「请具体说明」。监管专员在电话里说：「我们时间很多。」最终你多花了两个月和双倍的中介费。",
        lessonTitle: "创业课 · 监管的耐心是你的成本",
        lesson: "对付监管的第一原则是「第一遍就答透」。每一轮敷衍都会换来更专业、更尖锐的下一轮。蚂蚁集团暂缓上市前的 197 页问询回复，是投行和律师团队的马拉松——但那是必须要跑的。",
      },
    ],
  },
  {
    id: "late-giant-enters", title: "巨头下场了", minStage: 5, weight: 4, once: true,
    scene:
      "你所在赛道的头部大厂昨晚发布了同类产品：功能比你全、价格是你的 60%、入口自带 8 亿用户。早晨打开行业群，所有人都在 @你：「你们怎么办？」你的大客户发来邮件：「我们要重新评估供应商。」",
    choices: [
      {
        id: "niche-deep", text: "不打正面：缩回细分市场做 10 倍深",
        effects: { usersPct: -20, mrrPct: 15, reputation: 6, flag: "niche-moat" },
        resultText: "你把 80% 的资源押进大厂看不上的垂直场景，客单价涨了三倍，续费率到了 97%。一年后大厂的产品经理在行业大会上承认：「那个细分，我们打不进去。」",
        lessonTitle: "创业课 · 蚂蚁的生存法则",
        lesson: "当大象踩进你的池塘，游向大象去不了的深水区。Zoom 面对微软 Teams 的策略：把企业级体验做到 10 倍好，而不是功能做到 1.1 倍多。巨头覆盖的是「平均水平」，垂直深度是创业公司的专利。",
      },
      {
        id: "price-war", text: "跟价迎战：烧钱换市场份额",
        effects: { cash: -30, usersPct: 25, mrrPct: -25, morale: -8 },
        hidden: true,
        resultText: "价格战打了八个月，用户涨了 50%，毛利从 45% 砍到 12%。第九个月，大厂把价格又降了 20%——那不是定价，是零头。你的董事会终于叫停了这场不对称战争。",
        lessonTitle: "创业课 · 永远不要和巨头打价格战",
        lesson: "巨头打价格战花的是零头预算（补贴对你 100% 是成本，对它 3% 是营销费）；美团 vs 饿了么、滴滴 vs 快的不计补贴换市场的前提是有对等的资本弹药。弹药不对等时的价格战=慢性自杀。",
      },
    ],
  },
  {
    id: "late-options-uprising", title: "期权起义", minStage: 5, weight: 3, once: true,
    condition: (s) => s.team >= 15,
    scene:
      "一封 47 人联名的内部信躺在你的邮箱里：早期员工认为期权池被后续轮次严重稀释，且行权价「高到永远无法兑现」。HR 总监小声提醒：领头的是三年前跟你的老员工。窗外，行业同行正在以 2 倍薪资挖你的中层。",
    choices: [
      {
        id: "re-pool", text: "重做期权池：创始人让渡 2% + 老员工行权价重置",
        effects: { cash: -10, morale: 15, team: 0, flag: "re-pooled" },
        resultText: "全员大会上你公布了新方案，讲了一个小时「为什么要早期相信」。散会后那个领头员工留到最后：「我其实不是想要更多期权，我只是想知道你还记不记得我们在车库的日子。」",
        lessonTitle: "创业课 · 期权是承诺，不是数字",
        lesson: "硅谷期权起义史：Color、Groupon 上市后早期员工发现行权即亏钱（行权价>市价）。期权的心理账户规则是「承诺对比」：员工对比的不是市场，是「当初你描述的未来」。重置行权价（repricing）在成熟公司不罕见。",
      },
      {
        id: "hold-line", text: "按合同办：安抚但不改条款",
        effects: { team: -5, morale: -15 },
        hidden: true,
        resultText: "法律上你完全正确。但那个月走了 7 个中层——都是三年前 1 万月薪跟你干的人。猎头公司在群里发喜报的速度，比你的挽留邮件快多了。",
        lessonTitle: "创业课 · 正确与正确之间的选择",
        lesson: "期权条款上公司永远「对」，但早期员工流失的隐性成本（知识、文化、招聘溢价）远超 2% 股份。Airbnb 上市前 Brian Chesky 主动给早期员工补发期权——「他们值得」。",
      },
    ],
  },
  {
    id: "late-scandal", title: "创始人舆论危机", minStage: 5, weight: 3, once: true,
    scene:
      "一段你在行业晚宴上的发言被剪成 15 秒短视频，配上耸动标题冲上热搜。完整语境里你在讲「敬畏周期」，但剪出来的版本像在嘲讽同行。客服系统涌入大量「抵制」工单，两个合作方来函「关注事态」。",
    choices: [
      {
        id: "full-context", text: "放出完整视频+亲自写长文说明",
        effects: { cash: -5, reputation: 6, awareness: 8 },
        resultText: "完整视频放出后舆情反转了一半——「断章取义」本身成了新的话题。你的长文没有辩解，而是顺势讲了一小时的行业常识，意外成了年度传播最好的品牌内容。",
        lessonTitle: "创业课 · 语境是创始人最贵的资产",
        lesson: "张小龙、任正非都极少公开讲话但每次都全文放出——语境控制权比声明速度重要。公关第一定律：在断章的世界里，完整语境就是最稀缺的辟谣。",
      },
      {
        id: "silence", text: "冷处理：热搜三天就会过去",
        effects: { reputation: -12, usersPct: -10, morale: -5 },
        resultText: "热搜确实三天就过去了——但「那个嘲讽同行的 CEO」标签留下了。三个月后的一次融资尽调里，投资人在风险章节写了四个字：「舆情敏感」。",
        lessonTitle: "创业课 · 沉默的复利",
        lesson: "沉默在算法时代不是中立——不回应等于承认叙事权让渡。刘强东案、罗永浩的每一次危机回应都证明：创始人个人 IP 的修复成本，按「沉默天数 × 传播层级」复利计算。",
      },
    ],
  },
  {
    id: "late-supplier-monopoly", title: "供应商坐地起价", minStage: 5, weight: 3, once: true,
    scene:
      "你的核心供应商发来涨价函：关键元器件/原料/流量采购价上调 40%，理由是「产能紧张」。但行业情报显示：对方同时给你最大的竞对供应，价格只涨了 5%。他们在测试你的依赖度。",
    choices: [
      {
        id: "dual-source", text: "启动二供：咬牙付切换成本",
        effects: { cash: -25, mrrPct: -8, months: 2 },
        resultText: "二供爬坡的两个月很痛苦，良率掉了、交付慢了。但切换完成那天，原供应商的销售总监亲自飞来：「价格的事，可以谈。」——你终于从「被测试者」变成了「谈判者」。",
        lessonTitle: "创业课 · 二供是买不来的谈判筹码",
        lesson: "苹果对三星屏幕的依赖控制、特斯拉的电池多供应商策略——供应链的铁律：单一供应商的忠诚是不可测试的。二供的成本是确定的，单一依赖的风险是不确定且无限的。",
      },
      {
        id: "accept-hike", text: "接受涨价：稳交付优先",
        effects: { cash: -18, mrrPct: -12, morale: -3 },
        resultText: "你签了新合同。三个月后对方又来谈「产能附加费」。CFO 在经营会上说：「我们的毛利正在变成别人的毛利。」",
        lessonTitle: "创业课 · 依赖税",
        lesson: "接受单方面涨价而不做替代布局，等于向市场宣告「请继续」。日本车企 2011 地震后的教训：没有二供体系的公司平均多花 2.7 年才恢复成本竞争力。",
      },
    ],
  },
  {
    id: "late-international", title: "出海的诱惑", minStage: 5, weight: 3, once: true,
    scene:
      "东南亚/中东的合作伙伴带着渠道资源找上门：本地化团队现成的，用户增长曲线诱人的，但要求你投 18 个月、300 万现金做本地化。国内业务刚走上正轨，账上现金并不宽裕。",
    choices: [
      {
        id: "slow-expand", text: "小步快跑：只投产品本地化，不建重团队",
        effects: { cash: -15, usersPct: 15, awareness: 10 },
        resultText: "你用远程团队 + 本地代理的轻模式探路，6 个月做到 5 万海外用户。数据跑通后你才加注——那时你谈的不再是「可能性」，是「转化率」。",
        lessonTitle: "创业课 · 出海三部曲",
        lesson: "Shein、TikTok 的出海路径都不是一步到位：产品本地化（语言/支付/合规）→ 渠道轻试 → 本地重投入。反例：Uber 中国三年烧 10 亿美金，滴滴的地推密度是它的五倍——重投入必须建立在已验证的单位经济上。",
      },
      {
        id: "all-in", text: "重仓出海：复制国内打法",
        effects: { cash: -35, usersPct: 30, morale: -10, health: -5 },
        hidden: true,
        resultText: "18 个月烧了 280 万，用户涨了但留存只有国内的 1/3——你照搬的打法在当地的水土面前节节败退。收缩那天你在白板写下：「增长可以复制，土壤不能。」",
        lessonTitle: "创业课 · 增长不可平移定律",
        lesson: "每个市场有自己的「隐性基础设施」：支付习惯、物流密度、监管口径、社交图谱。Google 在巴西是成功的社交实验场，在 Orkut 退潮后什么都没留下——因为土壤变了。出海公司死亡率最高的死因就是「复制成功」。",
      },
    ],
  },
  {
    id: "late-old-investor-exit", title: "老股东要退出", minStage: 5, weight: 3, once: true,
    scene:
      "你的种子轮投资人发来正式函：基金进入清算期，需要在 12 个月内退出全部仓位，报价 1200 万转让老股——比你的心理价位低了 30%。不接，他们有权把股份卖给「任何愿意接盘的第三方」。",
    choices: [
      {
        id: "buy-back", text: "公司回购：现金换股权（股权激励池注入）",
        effects: { cash: -35, morale: 10, flag: "clean-cap-table" },
        resultText: "你用公司现金加一笔过桥贷款回购了老股，注入期权池。老员工得知股份池变厚了，离职率连降三个月。投资界传开：「这家公司的 cap table 干净得像上市公司。」",
        lessonTitle: "创业课 · 干净的股权结构是隐形资产",
        lesson: "老股贱卖会向市场传递「早期支持者撤退」的负面信号，且接盘方可能是你的竞对（敌意持股！）。陌陌、快手的 Pre-IPO 轮都清理过早期小额股东。回购价贵不贵，看相对谁——相对 30% 的估值折损，它就是便宜的。",
      },
      {
        id: "let-transfer", text: "任由转让：谁买不是买",
        effects: { reputation: -8, valuationPct: -8 },
        hidden: true,
        resultText: "股份被一家你没听说过名字的基金接走。半年后你发现：这家基金是你最大竞对的 LP。股东名册上从此有一双你永远看不见的眼睛。",
        lessonTitle: "创业课 · 股东名册上的特洛伊木马",
        lesson: "股份转让给「未知第三方」的最大风险不是价格，是身份——竞对的 LP、做空机构、职业维权股东。成熟公司都会在新股东协议里加「同意权条款」：老股转让需董事会同意。",
      },
    ],
  },
  {
    id: "late-tax-planning", title: "税务筹划的诱惑", minStage: 5, weight: 3, once: true,
    scene:
      "一家「税收优化服务商」找上门：通过霍尔果斯/开曼/核定征收组合方案，可以「合法」省下每年 200 万企业所得税。CFO 心动了：「很多同行都在做。」但你的合规顾问只回了一句话：「金税四期上线后，这类方案的追缴案例已经 1400+ 起。」",
    choices: [
      {
        id: "decline", text: "拒绝：老老实实全额纳税",
        effects: { cash: -20, reputation: 8 },
        resultText: "同行笑话了你一年「老实人」。第二年影视行业税收大清查，三家采用「税收洼地」方案的同行公司上了追缴名单，滞纳金加罚款超过省税额的 4 倍。你在全员大会上说：「我们没省下 200 万，我们买下了未来十年的安宁。」",
        lessonTitle: "创业课 · 税收洼地的保质期",
        lesson: "范冰冰 8.8 亿、郑爽 2.99 亿、薇娅 13.41 亿——「洼地筹划」在金税四期（大数据比对）面前无所遁形。税务筹划的底线：只碰政策明文鼓励的（研发加计扣除、小微企业优惠），不碰「地方默许」的。",
      },
      {
        id: "adopt", text: "采用方案：省下真金白银",
        effects: { cash: 30, reputation: -6, flag: "tax-gray" },
        hidden: true,
        resultText: "当年利润表好看了，你给自己发了大额年终奖。第三年税务稽查找上门：追缴 + 滞纳金 + 0.5 倍罚款，合计超过当年「省下」金额的 2 倍。更贵的是：IPO 尽调报告里多了一章「历史税务瑕疵」。",
        lessonTitle: "创业课 · 灰色节税的复利是负的",
        lesson: "历史税务瑕疵在 Pre-IPO 尽调中的修复成本通常是当年节税额的 3-10 倍（补税+罚款+中介费+上市延迟）。所有「大家都在做」的事情，都值得用「如果清算发生在明天」来重新评估。",
      },
    ],
  },
  {
    id: "late-second-curve", title: "第二曲线的抉择", minStage: 5, weight: 4, once: true,
    condition: (s) => s.product >= 80,
    scene:
      "你的主营产品增长放缓到 8%/月。战略会上吵成两派：一派要做新产品线（市场空间大、和主业协同弱）；一派要做深主业（把续费率和客单价做到极致）。一位顾问的话让你失眠：「你们不是在选战略，是在选死法——多元化是慢性死，单吊是急性死。」",
    choices: [
      {
        id: "second-product", text: "开辟第二产品线：用利润的 30% 养新团队",
        effects: { cash: -18, product: -10, valuationPct: 15, months: 2 },
        resultText: "新产品线的头六个月颗粒无收，董事会两次质疑。第 9 个月，新产品拿下第一个标杆客户——它的客单价是主业的 4 倍。三年后回头看：主业贡献了 90% 的利润，第二曲线贡献了 90% 的估值。",
        lessonTitle: "创业课 · 第二曲线的时机",
        lesson: "克里斯坦森的创新者窘境：第一曲线还在增长时就要种第二曲线（等它衰退就晚了），但投入不能超过主业利润的 30%（否则主业失血）。亚马逊 AWS、微信之于 QQ 都是「主业养新线」的范本。",
      },
      {
        id: "deepen", text: "all-in 主业：把护城河挖到对手绝望",
        effects: { mrrPct: 25, usersPct: -5, valuationPct: -5 },
        resultText: "你砍掉了所有副业，把 NPS 从 40 做到 75，续费率 97%。三年后公司活得很好——但估值始终停在一个「不错的生意」，而不是「伟大的公司」。有次路演，投资人问：「你的第二增长曲线在哪？」你沉默了。",
        lessonTitle: "创业课 · 好生意与伟大公司的距离",
        lesson: "深挖主业换来的是确定性，牺牲的是想象力——资本市场给「确定性」的倍数永远低于「想象力」。Zoom 疫情后的困境正在于此：主业做到极致，但第二曲线迟迟未能兑现。",
      },
    ],
  },
  {
    id: "late-ipo-rumor", title: "上市传闻满天飞", minStage: 5, weight: 3, once: true,
    scene:
      "「据知情人士透露，贵司已启动上市辅导」——你没启动，但媒体替你启动了。瞬间多了三类访客：各路 FA（财务顾问）带着「独家承销」方案、地方政府带着「上市奖励政策」、还有三家想「战略入股」的神秘机构。",
    choices: [
      {
        id: "official-deny", text: "官方口径否认+内部加速准备",
        effects: { awareness: 10, cash: -8 },
        resultText: "你在媒体群发了八个字：「不实报道，专注业务。」然后把上市筹备从「三年计划」提前到了「18 个月计划」——传闻是假的，但它逼真的那一面，是所有人都开始用上市公司的标准看你。",
        lessonTitle: "创业课 · 传闻的管理学",
        lesson: "蜜雪冰城、Shein 都经历过「被上市」阶段。传闻的价值在于：它是一次免费的组织压力测试——供应商、客户、员工的心态变化都是真实数据。不证实不证伪，用行动节奏管理预期。",
      },
      {
        id: "ride-rumor", text: "顺水推舟：不否认，借传闻抬估值",
        effects: { valuationPct: 12, reputation: -8 },
        hidden: true,
        resultText: "传闻让你的估值谈判顺利了不少——直到一个耿直的LP在尽调时问：「辅导备案号是多少？」你答不上来。那次尽调无疾而终，而「爱炒作」的标签在机构圈悄悄传开。",
        lessonTitle: "创业课 · 估值泡沫的借与还",
        lesson: "借传闻抬估值的本质是透支信用——资本市场的记忆比你想的长。瑞幸造假后，所有中概股的尽调成本都上升了 30%——为一两家公司的谎言买单的是整个市场。",
      },
    ],
  },
  {
    id: "late-family-pressure", title: "家庭与事业的临界点", minStage: 5, weight: 3, once: true,
    scene:
      "父亲住院了。你在病房外边开视频董事会边改招股书，妻子把离婚协议书放在了你的行李箱上——不是威胁，是通知：「这半年你在家说过的话不超过 50 句。」医生、律师、投行，三个职业的人在同一周找你签字。",
    choices: [
      {
        id: "delegate-trust", text: "放权两周：把公司交给 COO，陪家人",
        effects: { months: 2, morale: 12, health: 15, valuationPct: -5 },
        resultText: "两周里公司没有垮——反而暴露了你不在时暴露不出的三个流程漏洞。你回来时，COO 交上来一份「创始人依赖度报告」：原来你的 30% 日常工作是可以被系统替代的。父亲说：「钱可以再挣，我这把骨头等不起。」",
        lessonTitle: "创业课 · 创始人依赖度测试",
        lesson: "奈飞的文化手册第一条：「公司不是家庭。」但创始人必须定期做「消失测试」——你消失两周公司会不会更好？会，说明组织成熟；不会，说明你在用勤奋掩盖管理失败。张一鸣 2021 年卸任 CEO 时说：「我不再是最合适的人选。」",
      },
      {
        id: "push-through", text: "挺过去：上市敲钟后补偿一切",
        effects: { health: -20, morale: -10, reputation: 5 },
        resultText: "你挺过去了——上市那天你站在敲钟台前，想起了病房。父亲康复了，但妻子搬回了娘家：「你敲的是钟，我数的是日子。」三年后市盈率翻倍，你在匿名社区回答「创业最大的代价」：「我以为是健康，其实不是。」",
        lessonTitle: "创业课 · 不可延期账户",
        lesson: "健康、婚姻、亲子，是三个「不可延期账户」——错过的时间窗口永远无法用后来的金钱赎回。硅谷统计：创业者离婚率显著高于平均。时间管理的书都教你怎么做更多事，但人生的关键课题是：哪些事永远不该被延期。",
      },
    ],
  },
  {
    id: "late-union-boom", title: "反加班浪潮席卷行业", minStage: 5, weight: 3, once: true,
    scene:
      "「996 是福报」的余波正在反噬整个行业：你的两家竞对先后宣布取消大小周、强制 955。你的 HR 总监递来报告：过去一个月，你司加班时长行业第三，离职咨询量翻了一倍。而在融资材料里，你的「人效比」正是估值故事的核心。",
    choices: [
      {
        id: "efficiency-shift", text: "顺势改革：砍无效加班，转抓人效",
        effects: { cash: -12, morale: 18, mrrPct: -5, reputation: 10 },
        resultText: "改革第一个月产出降了 8%，第二个月回到原位，第三个月反超了 5%——原来 30% 的加班在做无用功。新政策成了招聘金字招牌：你收到了过去三年质量最高的一批简历。",
        lessonTitle: "创业课 · 工时与产出的解耦",
        lesson: "微软日本 2019 年「四天工作制」实验：产出反升 40%。知识工作的产出与工时在 50 小时后呈负相关（《人月神话》的结论 40 年前就写了）。996 的本质是管理能力欠费的信用卡——短期透支，长期破产。",
      },
      {
        id: "double-down", text: "逆水行舟：保持强度，用高薪对冲",
        effects: { cash: -20, morale: -15, team: -3, mrrPct: 8 },
        resultText: "你加了薪，留住了 80% 的人。但第二年春招，你发现同一个岗位的候选人质量明显下滑——行业口碑是会沉淀的。一位离职高管在告别信里写：「钱给够了，但我在这里看不到自己 35 岁之后的样子。」",
        lessonTitle: "创业课 · 高薪买不来文化传承",
        lesson: "华为的高薪背后是「奋斗者协议」的期权绑定与完整的退出机制，不是单纯的工资溢价。当整个行业都在转向「效率优先」，逆势加钱能买到时间，买不到认同。",
      },
    ],
  },
  // ── v1.7.5 内容包 · 行业专属事件：能源/生物制药/影视文娱/天使投资/VC·PE ──
  {
    id: "energy-policy-subsidy", title: "补贴退坡悬崖", minStage: 3, weight: 4, once: true,
    condition: (s) => s.industry.id === "energy",
    scene:
      "发改委新文件落地：你所在细分领域的国家补贴明年起退坡 30%，三年后归零。行业里一片哀嚎——去年刚扩产的同行们正在连夜开会。你的销售总监问你：「订单要抢在退坡前冲量吗？」",
    choices: [
      {
        id: "pre-rush", text: "退坡前抢装冲量：降价 15% 抢订单",
        effects: { cash: 25, mrrPct: -10, reputation: -3, flag: "subsidy-rushed" },
        resultText: "退坡前的最后六个月你签了相当于过去两年的订单。但交付高峰压垮了售后体系，安装投诉率翻倍。更麻烦的是：明年的订单簿，几乎是空的。",
        lessonTitle: "创业课 · 政策周期是能源行业的第二重力",
        lesson: "中国光伏 2018 年「531 新政」补贴急刹：当天行业市值蒸发 2000 亿，但活下来的隆基、通威反而在平价时代建立了成本优势。补贴冲量赚的是政策的钱，退坡后赚竞争力的钱——别把前者当能力。",
      },
      {
        id: "cost-down", text: "不抢单：把退坡当倒计时做降本",
        effects: { cash: -20, mrrPct: 8, product: 10 },
        resultText: "你顶着收入下滑的压力投了自动化产线。补贴归零那天，你的成本曲线已经压到行业前 20%——退坡杀死了 half 同行，也把市场让给了准备充分的你。",
        lessonTitle: "创业课 · 把政策变化当免费战略咨询",
        lesson: "每次补贴退坡都是一次全行业成本竞赛的哨声。比亚迪在新能源补贴退坡前 3 年布局刀片电池，退坡当年销量反增。政策是外力，应对是内功。",
      },
    ],
  },
  {
    id: "energy-grid-connection", title: "并网审批卡壳", minStage: 2, weight: 4, once: true,
    condition: (s) => s.industry.id === "energy",
    scene:
      "你投建的项目万事俱备，唯独并网批复迟迟下不来。电网公司的口径很官方：「消纳能力评估中。」但行业里的老司机都懂——有的地方要等 18 个月。你的设备每天在折旧，贷款每天在计息。",
    choices: [
      {
        id: "storage-shift", text: "加装储能，转「自发自用+市场化交易」",
        effects: { cash: -25, mrrPct: 15, months: 1 },
        resultText: "储能系统让项目绕开了并网排队，直接以工商业电价峰谷套利。审批半年后下来了，但你已经不太需要它了——市场化交易的毛利反而更高。",
        lessonTitle: "创业课 · 绕开堵点而不是等堵点开",
        lesson: "分布式能源的死穴是并网，解法是储能+市场化交易。特斯拉 Powerwall 商业模式的本质：把「等电网」变成「当电网」。监管堵点面前，技术路线本身就是商业模式。",
      },
      {
        id: "wait-official", text: "走正规流程慢慢等",
        effects: { cash: -12, months: 3, morale: -5 },
        resultText: "第 14 个月批复下来，项目 IRR 从 12% 掉到了 7%。你学会了一个行业暗知识：在能源行业，「时间表」本身就是最大的风险因子。",
        lessonTitle: "创业课 · 重资产行业的时间成本",
        lesson: "光伏/风电项目测算 IRR 时，审批延迟每增加 6 个月，回报率平均掉 1.5 个点。重资产创业和互联网的差别：互联网错过窗口是机会成本，能源错过窗口是现金流失血。",
      },
    ],
  },
  {
    id: "energy-safety-incident", title: "安全事故惊魂", minStage: 3, weight: 3, once: true,
    condition: (s) => s.industry.id === "energy",
    scene:
      "凌晨四点电话炸响：一个合作电站的储能单元热失控起火，烧了半个集装箱，万幸无人员伤亡。视频已经在行业群里传开，标题写着你的品牌名。应急管理部门要求 48 小时内提交事故报告。",
    choices: [
      {
        id: "recall-all", text: "主动召回同批次全部设备+全额赔付",
        effects: { cash: -30, reputation: 12, usersPct: -5 },
        resultText: "召回通告发出去，当天股价/估值承压 8%。但三个月后，事故调查报告确认是安装方的接线错误——你的主动召回反而成了行业安全标杆案例，两家央国企客户因此把你列入了优先供应商。",
        lessonTitle: "创业课 · 安全事故的第一响应定生死",
        lesson: "三星 Note7 全球召回烧了 50 亿美金，但保住了品牌信任；三聚氰胺事件里的隐瞒者则直接消失在行业版图上。能源行业安全事件的铁律：速度比成本重要，透明比辩解重要。",
      },
      {
        id: "blame-installer", text: "切割责任：是安装方的锅",
        effects: { reputation: -15, cash: -5, morale: -8 },
        hidden: true,
        resultText: "技术鉴定确实不是你的锅，但行业里的口碑塌了——客户买的不是设备，是「出事了找谁兜底」。接下来两个季度，三个意向订单悄悄改投了竞对。",
        lessonTitle: "创业课 · 责任切割的品牌税",
        lesson: "B2B 能源采购的隐性决策因子是「事故时的担当」。卡特彼勒的经销商体系百年不倒，靠的就是「机器在哪坏，责任就在哪」的承诺。法律上赢、商业上输，是 B2B 最常见的错觉。",
      },
    ],
  },
  {
    id: "energy-carbon-market", title: "碳交易的意外之财", minStage: 4, weight: 3, once: true,
    condition: (s) => s.industry.id === "energy",
    scene:
      "全国碳市场扩容，你的项目类型被纳入覆盖范围。券商和碳资产管理公司像闻见血腥味的鲨鱼：一家报价 150 万收购你未来三年的全部碳配额，另一家劝你自己进市场慢慢卖：「欧洲碳价 90 欧/吨，中国才 60 人民币，这是躺赚的时间差。」",
    choices: [
      {
        id: "sell-forward", text: "落袋为安：一次性卖断三年配额",
        effects: { cash: 15, morale: 3 },
        resultText: "150 万到账，团队发了一笔不错的奖金。两年后碳价翻了三倍，你在行业酒会上听说当年劝你的那家帮别人赚了 800 万。你安慰自己：确定的 150 万，好过不确定的 800 万——虽然那晚你失眠了。",
        lessonTitle: "创业课 · 确定性与期权的定价",
        lesson: "把不确定的未来收益一次性折价变现，是无数能源创业者的真实选择（现金流饥渴时会系统性低估期权价值）。宁德时代早期也卖断过碳配额。没有标准答案，只有和你现金跑道匹配的答案。",
      },
      {
        id: "hold-carbon", text: "自己持有：雇碳资产管理团队运作",
        effects: { cash: -8, valuationPct: 10, flag: "carbon-holder" },
        resultText: "碳资产团队做了三个动作：部分现货滚动卖出、部分做了远期套保、剩下的押注 CCER 重启。第三年这笔「意外之财」成了你估值故事里的独立一章——资本开始把你当「能源+碳资产」双赛道公司定价。",
        lessonTitle: "创业课 · 碳资产是新生产要素",
        lesson: "特斯拉 2020 年靠卖碳积分赚了 15.8 亿美金——那年它的车业务是亏损的。碳配额从成本变成资产的关键：把它纳入财务模型和融资故事，而不是当意外之财随手花掉。",
      },
    ],
  },
  {
    id: "biotech-clinical-fail", title: "二期临床未达终点", minStage: 3, weight: 5, once: true,
    condition: (s) => s.industry.id === "biotech",
    scene:
      "统计师把盲态数据放在你面前：主要临床终点 p=0.11，未达到统计学显著。按行业惯例，这意味着这个适应症基本判死刑。烧掉的 4000 万研发费和三年的团队心血，都压在这一页纸上。会议室里，首席科学家摘下了眼镜。",
    choices: [
      {
        id: "subgroup-dig", text: "砸锅卖铁做亚组分析+换适应症重来",
        effects: { cash: -30, product: 5, valuationPct: -10, morale: -5, months: 3 },
        resultText: "亚组分析找到了应答人群生物标记物——信号微弱但真实。你砍掉两个在研管线，all-in 新适应症。14 个月后，新适应症二期数据漂亮得让所有人沉默。投资人会上你说：「我们不是在赌，是在还债——还给科学。」",
        lessonTitle: "创业课 · 失败数据的二次开采",
        lesson: "辉瑞的伟哥原是心血管药、二甲双胍的适应症迭代史——大量神药都是失败管线里挖出来的。Biotech 公司的估值模型里，「失败管线的数据资产」经常值回全部投入。临床失败杀死的是适应症，不一定是公司。",
      },
      {
        id: "cut-loss", text: "止损：砍掉管线，转型 CRO 服务回血",
        effects: { cash: 15, product: -15, valuationPct: -25, morale: -10, flag: "pivot-cro" },
        resultText: "你痛苦地关停了核心管线，团队从 60 人裁到 25 人。转型 CRO 后现金流转正，但你清楚：资本市场给你的估值逻辑已经换了——从「未来的制药巨头」变成了「不错的服务商」，倍数差了十倍。",
        lessonTitle: "创业课 · Biotech 止损的双刃剑",
        lesson: "药明康德就是从失败管线转型 CRO 的范本，但那是创始人的主动选择而非被动止损。被动转型最大的问题不是业务，是叙事崩塌：团队、投资人、人才市场对你的定价体系全部重置。转型要趁早，赶在现金和叙事都没耗尽之前。",
      },
    ],
  },
  {
    id: "biotech-licensing", title: "跨国药企的授权要约", minStage: 4, weight: 4, once: true,
    condition: (s) => s.industry.id === "biotech",
    scene:
      "一家全球 Top5 药企的 BD 负责人飞来找你：对你的在研管线开出 3000 万美元首付 + 8% 销售分成的 license-out 方案，负责海外三期和全球商业化。条件是：他们要 50% 的管线权益和共同专利决策权。",
    choices: [
      {
        id: "license-out", text: "出海授权：拿钱续命+借船出海",
        effects: { cash: 45, valuationPct: 20, reputation: 10, flag: "licensed" },
        resultText: "签约那天你的科学家团队在会议室哭了——他们的分子要去造福全球患者了。首付款让你 runway 延到 30 个月，而那家药企的三期资源是你十年都攒不下来的。行业里开始叫你「某某领域的百济神州」。",
        lessonTitle: "创业课 · License-out 是中国 biotech 的成人礼",
        lesson: "百济神州替雷利珠单抗授权诺华、信达生物 PD-1 出海——license-out 的本质是「用权益换时间换资源」。它不等于卖掉公司：保留大中华区权益+联合开发，才是聪明的授权结构。",
      },
      {
        id: "go-alone", text: "拒绝：自己做全球多中心三期",
        effects: { cash: -40, valuationPct: 30, health: -10, morale: 5, flag: "global-solo" },
        resultText: "你押上全部身家启动全球多中心三期：美国 12 个中心、欧盟 8 个、中国 20 个。每天醒来都是 7 位数的烧钱速度。如果成，你是中国原创药的旗帜；如果败，教科书里多一个案例。",
        lessonTitle: "创业课 · 自己做全球化的豪赌",
        lesson: "拒绝 license-out 自己跑全球三期，是百济神州的原始路径——代价是累计融资 600 亿人民币。这条路的核心问题不是科学，是资本组织能力和管理半径。大多数 biotech 死于此，但活下来的改写行业版图。",
      },
    ],
  },
  {
    id: "biotech-ethics-review", title: "伦理审查委员会叫停", minStage: 2, weight: 4, once: true,
    condition: (s) => s.industry.id === "biotech",
    scene:
      "伦理委员会（IRB）驳回了你新试验方案的加速审批申请：受试者知情同意书被认定「风险披露不充分」，一位委员在意见里写得很直白——「这是一份给投资人看的文件，不是给受试者看的。」试验启动推迟至少 4 个月。",
    choices: [
      {
        id: "rewrite-patient-first", text: "推倒重写：请患者代表参与重写知情同意",
        effects: { cash: -8, months: 2, reputation: 8, morale: 5 },
        resultText: "你请了三位患者组织代表参与重写，把「受试者权益」章节从法律术语改成了人话。二次过会全票通过。更意外的是，患者社群口碑发酵，后续试验的招募速度成了行业最快。",
        lessonTitle: "创业课 · IRB 是免费的伦理教练",
        lesson: "临床试验的合规成本常被创业者视为摩擦，但 FDA/药监局的每一次驳回都在替你把关「科学向善」的底线。礼来、罗氏的成熟做法：把患者参与（Patient Engagement）前置到方案设计阶段。慢两个月，快两年。",
      },
      {
        id: "forum-shop", text: "换个审查宽松的机构重新申报",
        effects: { cash: -3, months: 1, reputation: -10, flag: "ethics-gray" },
        hidden: true,
        resultText: "你找到了一家审批快的机构。试验如期启动，但半年后有自媒体扒出知情同意书的问题，标题是《把受试者当数据点的公司》。药监局飞行检查随之而来，全部试验数据的可信度被打上问号。",
        lessonTitle: "创业课 · 伦理捷径是最贵的捷径",
        lesson: "生物制药行业的信任是核心资产：一次伦理污点会通过文献、监管记录、患者社群永久留痕。Sarepta 的加速审批争议至今困扰着它的每一个适应症。在生命科学里，「过得去」和「经得起审视」是两个行业。",
      },
    ],
  },
  {
    id: "biotech-ipo-funding-winter", title: "资本寒冬里的 IPO 窗口", minStage: 4, weight: 4, once: true,
    condition: (s) => s.industry.id === "biotech" && s.cash < 60,
    scene:
      "18A/科创板第五套的窗口忽开忽关：上个月两家同赛道公司 IPO 破发 30%，但本周突然有一家以超预期定价上市。你的 CFO 盯着日历：按现在的烧钱速度，这是 24 个月内唯一可能的上市窗口。投行问：「冲，还是再融一级市场？」",
    choices: [
      {
        id: "rush-ipo", text: "抢窗口 IPO：接受折价也要上",
        effects: { cash: 50, valuationPct: -15, reputation: 5 },
        resultText: "定价压得很难看，但募资到账那天，全公司最大的奢侈是——终于可以慢下来做科学了。破发 20% 的代价，换来的是「上市公司」这个永不再关的融资平台。首席科学家说：「第一次，我们不用在实验设计和省钱之间做选择。」",
        lessonTitle: "创业课 · Biotech IPO 的真功能是续命",
        lesson: "对 biotech 而言，IPO 从来不是终点而是「永续债平台」：上市后的增发、配股、可转债都是一级市场拿不到的融资工具。和黄医药、信达都破发过——只要核心管线在推进，破发的市值只是注脚。",
      },
      {
        id: "stay-private", text: "再等一级市场：不贱卖",
        effects: { cash: -15, valuationPct: 10, morale: -8, flag: "winter-gamble" },
        resultText: "你拒绝了折价条款，但一级市场的估值从「传闻」变成了「回忆录」——下一轮融资的 term sheet 比预期晚了 11 个月，估值砍了 40%。你赌赢了尊严，输了时间；而 biotech 行业，时间就是数据，数据就是一切。",
        lessonTitle: "创业课 · 寒冬里估值的锚是现金",
        lesson: "2022-2023 全球 biotech 寒冬：一级市场融资额缩水 60%，无数「非独角兽不融」的公司在静默中耗尽现金。寒冬里最值钱的不是估值，是流动性——能拿钱的时候，先拿。",
      },
    ],
  },
  {
    id: "entertainment-censorship", title: "过审惊魂夜", minStage: 2, weight: 5, once: true,
    condition: (s) => s.industry.id === "entertainment",
    scene:
      "你的旗舰内容/项目到了终审环节。审读意见下来了：三处「导向问题」要求修改，其中一处的修改会破坏整个叙事的情感线。而上线档期已经官宣，渠道方的资源位都锁死了。发行总监问：「改，还是赌一把再审？」",
    choices: [
      {
        id: "comply-rewrite", text: "全改：保住档期是第一优先级",
        effects: { cash: -10, product: -8, usersPct: 15, reputation: -3 },
        resultText: "你带着团队通宵改了三版，情感线伤了两处，但如期上线。数据意外地好——观众根本看不出哪里被改过。你在庆功宴上闷了一杯：「他们看到的是作品，我们看到的是缝补的痕迹。」",
        lessonTitle: "创业课 · 内容行业的档期经济学",
        lesson: "影视文娱是「档期生意」：错过黄金档期的损失远大于内容妥协的损失。《流浪地球》当年为过审删减 30 分钟仍成影史标杆。先活下来、保住现金流和渠道关系，表达的理想主义才有下一部作品可寄托。",
      },
      {
        id: "appeal-keep", text: "申诉保留原样：艺术作品不能打补丁",
        effects: { months: 3, cash: -15, reputation: 8, product: 5, flag: "artistic-integrity" },
        resultText: "申诉拉锯了三个月，最终保住了 90% 的原貌，但档期凉了、渠道资源位丢了。作品上线后口碑封神，行业媒体称你「内容行业的理想主义者」——理想主义很燃，只是财务报表上那三个空转的月份，是你和团队一起扛的。",
        lessonTitle: "创业课 · 理想主义的定价",
        lesson: "贾樟柯、娄烨的艺术坚持赢来了影史地位，代价是漫长的市场冻结期。内容创业者每一次「不改」，都在用团队和股东的现金为信念付费。关键是想清楚：这份账单你愿意付多久、用什么付。",
      },
    ],
  },
  {
    id: "entertainment-talent-scandal", title: "艺人/主创塌房危机", minStage: 3, weight: 4, once: true,
    condition: (s) => s.industry.id === "entertainment",
    scene:
      "凌晨热搜：你头部项目的主创/签约艺人被实名爆料，品牌方开始撤物料，平台方来函「评估合作风险」，你投出去的 60% 制作费还在他/她身上。公关团队给出两条路，每条路的 PPT 都很厚。",
    choices: [
      {
        id: "ai-reshoot", text: "果断切割+AI 换脸/重拍止损",
        effects: { cash: -35, product: -5, reputation: 3 },
        resultText: "48 小时内你发了切割声明，追加 35 万做 AI 换脸和补拍。项目延期两个月上线，错过了最好的档期但没错过市场——观众对「塌房切割速度」的印象分成了项目意外的营销点。",
        lessonTitle: "创业课 · 塌房时代的风险管理",
        lesson: "吴亦凡事件让《青簪行》彻底沉没、《狂飙》含笑事件后剧组连夜删改——文娱行业已进入「单点人物风险」时代。成熟做法：合同里加道德条款+投保+多主创结构。切割要快，止损要狠，迟一天的公关成本翻倍。",
      },
      {
        id: "wait-see", text: "观望：等舆论水落石出",
        effects: { cash: -8, months: 2, reputation: -15, valuationPct: -10 },
        resultText: "你等了两个月，等来的是实锤通报和全网下架。延期的项目档期错过、物料作废、团队散了三分之一。投资人在董事会上问了一个让你至今难忘的问题：「你的风控部门是干嘛的？」",
        lessonTitle: "创业课 · 观望是最大的仓位",
        lesson: "危机公关的黄金时间是 4-24 小时。文娱塌房事件里「观望等反转」的公司，九成等来了最坏结果。反应速度本身就是风险管理能力——它暴露的是公司有没有预先写好的危机预案。",
      },
    ],
  },
  {
    id: "entertainment-boxoffice-bet", title: "春节档的孤注一掷", minStage: 3, weight: 4, once: true,
    condition: (s) => s.industry.id === "entertainment",
    scene:
      "春节档排片战开打。你的项目要拿 15% 的保底排片，需要追加 25 万宣发费；不追，自然排片只有 5%。发行总监说：「春节档是年度 40% 票房的池子，但输家连汤都喝不到。」竞争对手的物料已经铺满了地铁站。",
    choices: [
      {
        id: "all-in-festival", text: "全押春节档：追加宣发+保底排片",
        effects: { cash: -25, valuationPct: 25, usersPct: 30, health: -5, flag: "festival-bet" },
        resultText: "大年初一票房出炉：你的项目以 9% 的排片吃下了 22% 的票房——口碑逆袭曲线成了行业年度案例。那个春节你瘦了 6 斤，但庆功宴上所有人都说：赌对了。",
        lessonTitle: "创业课 · 档期就是杠杆",
        lesson: "《流浪地球》《你好，李焕英》都是「小排片高票房」逆袭，但前提是内容质量过硬+宣发精准。档期杠杆的本质：用确定性成本（保底宣发）换非对称收益（爆款窗口）。前提是产品力撑得起排片兑现率。",
      },
      {
        id: "steady-release", text: "避开红海：选冷门档期稳扎稳打",
        effects: { cash: -5, usersPct: 8, mrrPct: 10 },
        resultText: "你选了三月淡季上线，没有热搜、没有大战，但靠着 8.5 分的长尾口碑，票房曲线走得像定投基金。行业会上有人问你为什么不赌春节，你答：「我们的组织扛不住 all-in 失败的后果——知道自己的风险承受力，也是一种战略。」",
        lessonTitle: "创业课 · 反脆弱排期",
        lesson: "博纳的《长津湖》能押国庆档，是因为它的体量输得起；中小体量项目选冷门档吃长尾，是概率上更优的选择。决策质量不在于赌不赌，在于赌资占净资产的比例——凯利公式的本质是仓位管理。",
      },
    ],
  },
  {
    id: "entertainment-ip-sequel", title: "续作魔咒", minStage: 4, weight: 4, once: true,
    condition: (s) => s.industry.id === "entertainment",
    scene:
      "你的爆款 IP 要出续作。平台方带着 8 位数合同找上门，条件只有一个：明年上线。但主创团队的意见分成了两半——一半说「趁热打铁」，一半说「第一部的灵魂是打磨了四年，续作至少要三年」。粉丝已经在超话里催更了 14 个月。",
    choices: [
      {
        id: "fast-sequel", text: "趁热打铁：接合同，一年内交付",
        effects: { cash: 40, product: -15, reputation: -12, usersPct: 20, flag: "cashed-ip" },
        resultText: "续作如期上线，首日数据炸裂，第七天口碑崩了。豆瓣评分从第一部的 8.9 跌到 5.2，「恰烂钱」的标签焊在了 IP 身上。第三部的开发权，平台收回转给了别家——你用一部续作，烧掉了五年的品牌。",
        lessonTitle: "创业课 · IP 的时间贴现陷阱",
        lesson: "《黑客帝国》三部曲 vs 仓促续作、《琅琊榜 2》的口碑断崖——续作魔咒的本质是「用品牌信用贴现现金流」。粉丝经济的残酷：他们可以爱你很久，但被敷衍一次，信任归零。IP 是复利资产，透支复利是最贵的融资。",
      },
      {
        id: "slow-craft", text: "婉拒平台：打磨三年，宁缺毋滥",
        effects: { cash: -20, months: 3, product: 15, reputation: 8, valuationPct: 5, flag: "ip-craftsman" },
        resultText: "你婉拒了 8 位数的诱惑。粉丝从催更变成「等得起」，行业里开始流传「那家做内容不恰快钱的公司」。三年后续作上线，评分 8.7——平台这次主动开了 12 位数的合同，因为你证明了：慢，也是一种定价权。",
        lessonTitle: "创业课 · 慢品牌的定价权",
        lesson: "宫崎骏、暴雪（巅峰期）、HBO 的路径证明：内容行业的终极壁垒是「观众相信你不会敷衍我」。这种信任的形成要十年，摧毁只要一季。拒绝快钱不是情怀，是 IP 资产的最优管理策略。",
      },
    ],
  },
  {
    id: "angel-portfolio-death", title: "投资组合里的明星项目死了", minStage: 2, weight: 5, once: true,
    condition: (s) => s.industry.id === "angel",
    scene:
      "你投的占组合 40% 仓位的明星项目 CEO 打来电话，声音平静得可怕：「账上还剩两个月工资，下一轮融资没 close。我们准备关门了。」你想起三年前看项目时，他眼里的光和你投出去的第一笔钱——那是你基金的招牌案例，LP 们都在问它的进展。",
    choices: [
      {
        id: "bridge-personal", text: "个人追加一笔过桥钱救它",
        effects: { cash: -25, reputation: 5, flag: "loyal-angel" },
        resultText: "你追加了最后一轮。项目又活了 8 个月，但还是没能找到 PMF，最终体面清算。CEO 退还了你一部分设备残值，附了一封三页的信：「对不起，也谢谢你相信过我。」LP 没有责怪你——「敢做雪中送炭的人，才配赚复利的钱」写进了你的基金介绍。",
        lessonTitle: "创业课 · 天使投资的「最后一笔钱」哲学",
        lesson: "本·霍洛维茨给濒临死亡的创业公司的「goodbye money」传统：当所有机构都撤了，天使的决定是纯信仰的。统计显示救回来的比例不足 10%，但投出去的那刻，你在创业者心里的位置再无人能替。",
      },
      {
        id: "let-die", text: "遵守纪律：不投沉没成本",
        effects: { cash: 5, reputation: -8, morale: -5 },
        resultText: "你用「投资纪律」说服了自己，也写进了给 LP 的季报。但行业里开始有声音：「那个项目死的时候，他第一个跑了。」两年后你最好的项目做新一轮融资时，创始人的尽调问题里有一条：「如果公司快死了，他会怎么做？」",
        lessonTitle: "创业课 · 声誉是天使的复投本金",
        lesson: "顶级天使（Ron Conway、徐小平）的核心资产不是眼光，是「危难时刻的口碑」。创业者圈子极小，「谁会在你最难的时候出现」是会流传的。纪律和冷血之间，隔着一个行业声誉。",
      },
    ],
  },
  {
    id: "angel-big-winner", title: "百倍回报的退出窗口", minStage: 4, weight: 4, once: true,
    condition: (s) => s.industry.id === "angel",
    scene:
      "你的早期投资项目收到了战略方的收购要约：报价是你投资成本的 80 倍。创始人来找你商量：他想拒绝——「我们刚看到更大市场的入口。」而你的基金今年是回报年，LP 在催 DPI（现金回报倍数），一个 80 倍的退出能让你的下只基金规模翻倍。",
    choices: [
      {
        id: "sell-shares", text: "卖老股部分退出：落袋 + 留 upside",
        effects: { cash: 45, valuationPct: 10, morale: 3 },
        resultText: "你卖了一半老股，落袋为安；另一半押注创始人的「更大市场」。三年后那家公司 IPO，剩下的部分又涨了 20 倍。你在 LP 年会上说：「好的退出不是卖在顶点，是卖在你需要的地方。」",
        lessonTitle: "创业课 · 部分退出的艺术",
        lesson: "彼得·蒂尔 Facebook 早期部分套现、Yuri Milner 的 DST 策略——成熟的早期投资人永远在「落袋」和「让子弹飞」之间做再平衡。全卖是短视，不卖是赌博，部分退出是风险管理。",
      },
      {
        id: "hold-conviction", text: "全持有：陪创始人搏终极市场",
        effects: { cash: -5, valuationPct: 25, flag: "true-believer" },
        resultText: "你告诉创始人：「按你的判断来。」收购方撤了要约。两年后行业突变，那条「更大的市场」没能兑现，公司最终以 15 倍退出。LP 会议上有人尖锐地问：「80 倍的窗口和 15 倍的结果之间，差的是什么？」你答：「差的是我对「更大的市场」的信念——信念不保证回报，但保证我不后悔。」",
        lessonTitle: "创业课 · 信念的定价",
        lesson: "天使投资是「非共识正确」的游戏：所有事后看错的信念，在当时都有拒绝 80 倍的合理逻辑。关键是区分「信念」和「拒绝信息」——真信念者会给自己的判断设 falsification 条件（比如：再验证两个关键假设）。",
      },
    ],
  },
  {
    id: "vcpe-fund-crunch", title: "基金到期，DPI 归零", minStage: 4, weight: 4, once: true,
    condition: (s) => s.industry.id === "vcpe",
    scene:
      "你管理的基金进入第 8 年：LP 的耐心正在耗尽——DPI（现金回报倍数）还是 0.1，而 IRR 靠账面估值撑着。年会上一位养老金 LP 直接发问：「我们不想听未实现收益的故事，现金呢？」两个选择摆在桌上：折价转让老股换现金，或向 LP 申请延期。",
    choices: [
      {
        id: "discount-secondaries", text: "折价走 S 交易：30% 折价换真金白银",
        effects: { cash: 40, valuationPct: -12, reputation: -3 },
        resultText: "你把两个项目的老股以 7 折卖给了 S 基金。DPI 从 0.1 跳到 0.6，LP 松了口气。但行业里的议论开始了：「他开始在二级市场甩货了」——有些 GP 靠拖延混日子，而你用折价买了「说话算数」四个字。",
        lessonTitle: "创业课 · S 基金是老练 GP 的泄压阀",
        lesson: "全球 PE 二级市场 2023 年交易量破 1100 亿美金——折价 20-40% 换流动性已是成熟操作。Lexington、Ardian 靠这个起家。GP 最大的职业风险不是折价，是让 LP 的耐心先于项目的价值耗尽。",
      },
      {
        id: "ask-extension", text: "申请基金延期 2 年+讲长期故事",
        effects: { cash: -10, months: 2, reputation: -6, flag: "extended-fund" },
        resultText: "延期申请通过了，但附带严苛条件：管理费减半+LP 观察员进 IC（投委会）。从此你的每个投资决策都要先过一道「LP 视角」的审视——长期投资还在，但决策的从容不在了。",
        lessonTitle: "创业课 · 延期的隐形条款",
        lesson: "基金延期的真实成本从不在条款清单首页：管理费压缩、治理权让渡、团队士气。Kauffman 基金研究：延期基金的下一只基金募资成功率显著低于按期清算的——LP 记得谁的时间管理出了问题。",
      },
    ],
  },
  {
    id: "traditional-ecommerce-shock", title: "直播电商的降维打击", minStage: 2, weight: 4, once: true,
    condition: (s) => s.industry.id === "traditional",
    scene:
      "你所在的传统行业正在经历渠道革命：直播电商的头部主播找到你，开价 20 万坑位费 + 25% 佣金做专场。你的经销商体系炸锅了——省级代理连夜飞来：「你上了直播，我们的价格体系就崩了！」财务算了笔账：直播价必须比经销价低 30% 才能过机制。",
    choices: [
      {
        id: "live-launch", text: "拥抱直播：自建账号，绕过主播",
        effects: { cash: -15, usersPct: 25, mrrPct: -8, reputation: -5, flag: "self-live" },
        resultText: "你自建直播团队，用「工厂直营」的故事绕开经销体系。头三个月天天翻车：话术生硬、投流烧钱。第六个月，一条讲「三十年老厂」的视频爆了，自营渠道占比冲到 35%。经销商从抗议变成了求合作：「能不能给我们也开直播账号？」",
        lessonTitle: "创业课 · 渠道革命的主动权",
        lesson: "东方甄选让新东方转型、鸿星尔克靠直播间翻红——传统企业的直播转型，关键不是找哪个主播，是把「品牌叙事权」从渠道拿回自己手里。代价是价格体系的重构，而这正是转型的阵痛本身。",
      },
      {
        id: "protect-channel", text: "保价盘：拒绝直播，稳住经销商",
        effects: { cash: -5, usersPct: -12, morale: -3 },
        resultText: "你守住了价格体系，经销商很感激。但两年后你在商超货架上发现：竞品的直播专供款已经用你 6 折的价格抢走了你 25% 的市场份额。渠道忠诚救不了产品老化。",
        lessonTitle: "创业课 · 价格体系的保质期",
        lesson: "娃哈哈、格力都经历过「保价盘 vs 新渠道」的纠结。残酷规律：价格体系保护的是昨天的利润分配，而市场在按明天的成本结构重新定价。渠道忠诚是双向的——当竞品给了经销商更高毛利时，忠诚的保质期到期。",
      },
    ],
  },
  {
    id: "ai-compute-cost", title: "算力账单失控", minStage: 3, weight: 4, once: true,
    condition: (s) => s.industry.id === "ai",
    scene:
      "CFO 深夜发来一张图：本月 GPU 账单 42 万，是预算的 2.3 倍——用户增长带来的推理成本，涨得比收入快。更麻烦的是，大客户要求私有化部署，报价里 60% 是硬件成本。投资人刚在董事会上问：「你们的毛利故事还成立吗？」",
    choices: [
      {
        id: "distill-optimize", text: "All-in 模型蒸馏+推理优化",
        effects: { cash: -20, product: 15, mrrPct: 8, months: 2 },
        resultText: "你成立「降本敢死队」：模型蒸馏、量化、缓存、批处理，四个月把单次推理成本砍掉 70%。成本曲线转好的那个季度，你在全员会上说：「从今天起，我们的护城河不是模型多大，是每 1 块钱能跑多少智能。」",
        lessonTitle: "创业课 · AI 创业的毛利保卫战",
        lesson: "OpenAI 的 GPT-4 推理成本两年内下降 90%+，靠的是系统级优化（蒸馏、MoE、硬件调度）。AI 产品的生死线：单位智能成本必须随规模下降，否则收入增长=亏损放大。DeepSeek 靠极致推理优化颠覆了定价体系。",
      },
      {
        id: "raise-prices", text: "提价+限流：把成本转嫁给客户",
        effects: { usersPct: -20, mrrPct: 12, reputation: -8 },
        resultText: "提价函发出去，流失率当月翻倍——其中两个大客户转投了竞对。你守住了毛利数字，却丢了规模叙事。董事会上有董事说：「我们好像在用客户的离开，支付算力的账单。」",
        lessonTitle: "创业课 · AI 定价的规模悖论",
        lesson: "AI 产品提价的空间极其有限：替代方案太多，切换成本太低。硅谷 2023 年的集体教训：靠提价守毛利的公司丢掉了下一轮融资的故事；靠优化成本守毛利的公司（Anthropic、Perplexity）拿到了溢价估值。",
      },
    ],
  },
  // ── v1.7ultra：男女主角差异化事件线（隐性偏见 + 姐妹 mentorship + 男性视角一条）──
  {
    id: "gender-pitch-family", title: "路演桌上的「平衡问题」", minStage: 2, weight: 4, once: true,
    condition: (s) => s.gender === "female",
    scene:
      "路演 Q&A 环节，一位 LP 微笑着举手：「项目不错。但我很好奇——你婚后打算怎么平衡家庭和创业？」台下安静了一秒。你注意到同场路演的男创始人上周被问的是「你的五年扩张计划」。",
    choices: [
      {
        id: "data-comeback", text: "用数据回击：「您上次问男创始人这个问题是什么时候？」",
        effects: { reputation: 10, morale: 5, awareness: 5 },
        resultText: "会场愣了两秒，然后有人鼓掌。那位 LP 会后主动来道歉，还介绍了两位女合伙人给你认识。这段视频被剪成 30 秒在行业群里疯传——你的路演还没结束，下一轮的邀约已经来了。",
        lessonTitle: "创业课 · 偏见问题的正确打开方式",
        lesson: "2023 年哈佛研究：女创始人在路演中被问「预防式问题」（如何规避风险、如何平衡家庭）的概率比男创始人高 65%，而被问「促进式问题」（如何扩张、如何赢）的概率则相反——直接关联融资额差距。指出问题本身，就是最好的回答。",
      },
      {
        id: "smile-through", text: "微笑带过：「我会安排好的。」",
        effects: { morale: -8, flag: "bias-swallowed" },
        resultText: "你答得滴水不漏，会后却在停车场坐了十分钟。更糟的是，这句「我会安排好的」被写进了对方的纪要——「创始人对关键问题回避」。",
        lessonTitle: "创业课 · 回避的代价",
        lesson: "偏见问题没有标准答案，但「回避」是最差答案——它会被解读为软肋。研究显示女创始人若像男创始人一样直接回答促进式框架，融资谈判结果显著改善。问题本身不公，但回应方式可以选择。",
      },
    ],
  },
  {
    id: "gender-term-sheet-clause", title: "条款书里多出来的一行", minStage: 3, weight: 3, once: true,
    condition: (s) => s.gender === "female",
    scene:
      "律师 reviewing 条款书时用笔敲了敲其中一条：「创始人婚姻关系发生重大变动，需提前向董事会报备并协商职务安排。」她抬头看你：「这一条不在标准模板里。我查了，上轮那家男创始人公司的条款书——没有。」",
    choices: [
      {
        id: "refuse-clause", text: "拒绝：「删掉这一条，否则免谈」",
        effects: { cash: -10, reputation: 8, morale: 5, months: 1 },
        resultText: "对方拖了两周最终让步。删掉那行字的那天，律师发消息：「我干这行十二年，第三次见到女创始人坚持删这一条。前两位，一家上市了，一家被巨头收了。」",
        lessonTitle: "创业课 · 条款书里的人格",
        lesson: "Term sheet 是人格的试金石：不标准的条款针对的都是「可欺负的人」。2019 年硅谷多位女创始人公开「可疑条款」清单（婚育条款、道德条款滥用）后，多家顶级基金承诺禁用。谈判桌上退一步，条款书里多十刀。",
      },
      {
        id: "sign-anyway", text: "签了：融资要紧，别节外生枝",
        effects: { cash: 20, morale: -15, flag: "signed-bias-clause" },
        resultText: "钱到账了，但那行字像一根刺。两年后你分手，董事会「善意提醒」条款的存在——那一刻你明白了：有些妥协当时只值 20 万，赎回却要付出十倍。",
        lessonTitle: "创业课 · 沉没的霸王条款",
        lesson: "霸王条款的定价原则：它在你弱的时候植入，在你最脆弱的时刻生效。京东、滴滴的回购条款之争证明：创始人在签时总觉得「不会那么巧」，生效时才发现没有巧合。条款书上的每一行都要假设最坏情况。",
      },
    ],
  },
  {
    id: "gender-network-exclusion", title: "高端局从不叫你", minStage: 3, weight: 3, once: true,
    condition: (s) => s.gender === "female",
    scene:
      "你又从同行朋友圈的合照里发现那个「周末小规模聚会」：三位上市公司 CEO、两位基金合伙人、你最大的潜在客户——全是男性。没人恶意排挤，只是组局的人「顺手」没想起你。这已经是今年第四次。",
    choices: [
      {
        id: "host-own-table", text: "自己组局：办一场行业女性创始人晚宴",
        effects: { cash: -8, awareness: 12, reputation: 8, morale: 8 },
        resultText: "你组了十五人的局，来了一半上市公司的女高管。三个月后，这个局成了行业固定活动，而你的公司成了局里最常被提起的新星。有人问你秘诀，你答：「等不到的桌子，就自己开一桌。」",
        lessonTitle: "创业课 · 网络的重力",
        lesson: "AllRaise、春雨计划、她山——女性创业者网络的崛起证明：被排除在旧网络外的人，最优解不是硬挤，而是建新网络（新网络还自带媒体属性）。商业网络的本质是价值交换，谁组局，谁定价。",
      },
      {
        id: "squeeze-in", text: "下次硬挤进去：不请自来，主动敬酒",
        effects: { morale: -5, reputation: -3, awareness: 3 },
        resultText: "你去了，气氛礼貌而微妙。有人交换了名片，但没有下文。回程车上你复盘：挤进去一次容易，挤进「被想起的名单」难——那张名单是十年攒的，不靠一次酒局改写。",
        lessonTitle: "创业课 · 弱连接的正确姿势",
        lesson: "Granovetter 弱连接理论：机会来自圈外，但连接靠长期价值输送而非单次冒泡。硬挤的酒局转化率为零，持续输出观点/资源的「可见度经营」转化率是复利。社交不是突击，是定投。",
      },
    ],
  },
  {
    id: "gender-mentor-sisterhood", title: "前辈递来的一张名片", minStage: 2, weight: 3, once: true,
    condition: (s) => s.gender === "female",
    scene:
      "行业峰会上，一位四十五岁的女企业家听完你的 pitch，递来名片：「我创业那会儿，连女厕所都要跟物业争取改成办公室。」她顿了顿：「每月第一个周五，我空出一下午。带上你最头疼的问题来。」",
    choices: [
      {
        id: "take-mentorship", text: "拜师：每月认真准备问题赴约",
        effects: { health: 8, morale: 10, reputation: 5, flag: "has-mentor" },
        resultText: "第一次请教她就问：「你现在最后悔的事是什么？」你想了一周才敢说真话。后来她帮你避开了两个坑、挡了一个骗子、介绍了关键客户。三年后你也开始每月空出一个周五——给更年轻的创始人。",
        lessonTitle: "创业课 · mentorship 的复利",
        lesson: "SCORE 研究报告：有导师的创业者公司存活率是没有导师的 2 倍。女性创业者因网络排斥更缺导师，因此女企业家间的 mentorship（「姐妹情谊」）转化率尤其高。被点破一个盲点，省下的可能是三年弯路。",
      },
      {
        id: "decline-busy", text: "婉拒：现在实在太忙，以后再说",
        effects: { morale: -3 },
        resultText: "你说「以后一定」。忙是永恒的，那张名片在抽屉里慢慢变黄。半年后你遇到一个大坑——正是她当年第一句话就想提醒你避开的那个。",
        lessonTitle: "创业课 · 「以后再说」的成本",
        lesson: "贵人不会排队重来。LinkedIn 创始人 Reid Hoffman：「你的人际网络是唯一会随时间增值、且贬值最快的资产。」拒绝一次 mentor 邀约的真实成本，按你未来三年的学费折算。",
      },
    ],
  },
  {
    id: "gender-male-assumption", title: "「你这个年纪该求稳」", minStage: 2, weight: 3, once: true,
    condition: (s) => s.gender === "male",
    scene:
      "家族聚会上，三叔拍着你的肩：「三十岁的人了，房贷怎么办？孩子上学怎么办？创业能当饭吃？」一桌亲戚附和。你想起上周路演，投资人夸你「有家庭的男人稳重，值得托付」——同一个你，两个剧本。",
    choices: [
      {
        id: "own-choice", text: "正面回应：「求稳才是最大的风险，我算过账了」",
        effects: { reputation: 5, morale: 6, health: -2 },
        resultText: "你花十分钟讲了你的 runway 模型和止损线。三叔没全听懂，但听懂了「不是冲动」。散席时表妹悄悄说：「哥，我也想辞职做自己的事——你给我打打气。」",
        lessonTitle: "创业课 · 家庭叙事的反转",
        lesson: "男性创业者承受的是「供养者必须求稳」的反向偏见；女性承受的是「不稳定不许冒险」的正向偏见——框架不同，牢笼相同。用数据和止损线回应家人，本质是把情绪问题翻译成财务问题——这也是对投资人沟通的训练。",
      },
      {
        id: "brush-off", text: "不解释：「说了你们也不懂」",
        effects: { morale: -4, flag: "family-tension" },
        resultText: "饭桌安静了几秒，话题转去别家孩子。那晚你收到父亲的短信：「不懂，但支持你。」你盯着那五个字很久——有些理解，不需要你先说狠话。",
        lessonTitle: "创业课 · 最便宜的股东关系",
        lesson: "家人的不理解是创业者最大的隐性成本（睡眠、情绪、过年）。耐心和解释是最便宜的股东关系维护——家人不要回报率，只要「被当回事」。调查显示创业者家属的心理支持与实际存活率正相关。",
      },
    ],
  },
];

// ─── 结局 ───────────────────────────────────────────────────────────────────
export const ENDINGS: Record<string, Ending> = {
  ipo: {
    id: "ipo", title: "🏛️ 上市敲钟", grade: "S",
    narrative:
      "敲钟前一分钟，你站在交易所的大厅里，突然想起很多年前的那个深夜——第一次发不出工资、第一次被投资人拒绝、第一次在医院走廊改 PPT。钟声响起的瞬间，你明白上市不是终点，而是把公司交给更大世界的起点。但你做到了：从车库到敲钟，十不存一的旅程。",
    lesson: "全球创业公司中最终能上市的不足 1%。能走到这里，靠的不是运气——是每一次现金流危机时的决断、每一次诱惑前的清醒、每一次跌倒后的爬起。恭喜，创业者。",
    stats: [],
  },
  acquired: {
    id: "acquired", title: "🤝 被收购退出", grade: "A",
    narrative:
      "交割仪式上，你和收购方 CEO 交换签字笔。团队的期权兑现了，有人买房，有人结婚，有人终于敢跟父母说『我这几年没瞎折腾』。你在收购协议最后一页签名时，手很稳。",
    lesson: "并购是最常见的成功退出方式（占退出事件的 90%+）。把公司卖个好价钱、让团队人人受益、让自己体面离场——这是被低估的英雄结局。不是每个故事都要 IPO 才配叫成功。",
    stats: [],
  },
  acquihire: {
    id: "acquihire", title: "🧩 人才收购（Acqui-hire）", grade: "B",
    narrative:
      "公司没能继续下去，但大厂看中了你们的团队，用一笔『安慰奖」打包收购。你带着团队入职那天，前投资人发来消息：『至少人还在，江湖再见。』",
    lesson: "Acqui-hire 是硅谷常见结局：公司死了，人值钱了。它验证了「优秀的团队本身就是资产」。对员工是归宿，对投资人是止损，对你是下一次出发的弹药。",
    stats: [],
  },
  shutdown: {
    id: "shutdown", title: "🕯️ 体面关停", grade: "B",
    narrative:
      "你在全员会上宣布了这个决定，把最后剩下的钱优先补偿了员工工资和供应商货款。散会后你独自关灯锁门。这不是失败，是你在所有坏选项里，选了一个最负责任的。",
    lesson: "硅谷对连续创业者有句名言：Fail fast, fail gracefully。90% 的创业公司都会死，区别只在于死得体面与否：不欠薪、不赖账、不拉用户垫背。体面关掉的创始人，下一次融资时反而更受尊重——市场记得你的品格。",
    stats: [],
  },
  bankrupt: {
    id: "bankrupt", title: "💸 破产清算", grade: "D",
    narrative:
      "银行账户冻结、办公室贴上封条、员工在劳动仲裁窗口排队。你在解散协议上签字时，笔没水了——就像你的现金一样。你输给的不是某一个对手，是 runrate、市场时机和一连串『再等等看』。",
    lesson: "破产是公司层面的死亡，但经验是你的。复盘清单：1) 是否过度乐观预测收入？2) 现金跑道是否低于 6 个月还在硬扛？3) 是否在该砍的时候舍不得？记住这次疼，下次你会成为更危险的创业者。",
    stats: [],
  },
  runaway: {
    id: "runaway", title: "🏃 欠债跑路", grade: "F",
    narrative:
      "深夜的机场，你把手机卡掰断扔进垃圾桶。供应商的催款短信还在旧手机里震动：『我们也有孩子要养。』你逃到一座南方小城，用假名在餐馆打工。每当电视里出现创业新闻，你都会默默换台。",
    lesson: "跑路是最差结局——它摧毁的不只是征信，还有你重新站在阳光下的资格。真正的创业者在绝境中会回到那张谈判桌：申请破产保护、协商债务重组、哪怕打工还债。信用破产比公司破产可怕一百倍。",
    stats: [],
  },
  burnout: {
    id: "burnout", title: "🩺 健康崩塌", grade: "C",
    narrative:
      "医生说你透支了十年的身体。你在病床上签下股权转让协议，把公司交给合伙人。窗外的阳光很好，你第一次注意到楼下花园的樱花开了——原来春天到了。",
    lesson: "公司可以转让、股权可以稀释、项目可以重来，只有身体和健康不可再生。投资人最喜欢的创始人画像是「可持续的狂热」，不是「燃烧自己照亮 PPT」。",
    stats: [],
  },
  // ── 剧本模式专属结局 ───────────────────────────────────────────────────
  "groupon-end": {
    id: "groupon-end", title: "🤝 千团大战 · 幸存者合并", grade: "A",
    narrative:
      "合并发布会那天，会场门口还立着另一家公司的易拉宝。三年前你们在同一座城市的每条街上贴身肉搏，今天成了同一面旗帜下的战友。你没有成为那个一统江湖的人——但五千家团购公司里，活下来的不超过十家。资本、时机与克制，替你交了学费。",
    lesson: "美团点评合并终结了千团大战。合并不是投降，是在资本寒冬里把两堆篝火合成一堆——取暖能力翻倍，而燃烧自我ego的速度减半。能在全行业死掉 95% 时坐在合并桌边，本身就是 A 级的胜利。",
    stats: [],
  },
  "groupon-dead": {
    id: "groupon-dead", title: "💀 千团大战 · 风口炮灰", grade: "C",
    narrative:
      "倒下那天，办公室白板上还写着明年的扩张计划。地推团队的工牌还挂在墙上，像一排沉默的纪念碑。你后来发现：拉手的上市折戟、窝窝团的市值蒸发——不是只有你在冬天倒下，是五千个兄弟一起倒下的。",
    lesson: "千团大战的阵亡名单长达五千家。它们教会了幸存者的用户习惯、地推体系和商家认知——美团的胜利建立在全行业的试错总和上。创业史上「炮灰」与「先驱」是同一批人，区别在于谁来写历史。愿赌服输，但你来过。",
    stats: [],
  },
  "mask-end": {
    id: "mask-end", title: "🌬️ 口罩风云 · 高位套现", grade: "A",
    narrative:
      "设备转让合同签完那天，你在空了一半的厂房里站了很久。两年：从身家见底到订单爆炸，再到在所有人劝你「再赌一把」时收手离场。你把现金换成了厂房隔壁那间小办公室的钥匙——门牌上写着新的公司名，行业那一栏，你还没想好。",
    lesson: "2020 年入场的口罩老板赚到钱的只有两类：转产前就有工厂的、在疫情中期果断退出的。把周期行业的顶部当新常态是亏损的第一大原因。索罗斯：「重要的不是对错，而是对的时候赚多少、错的时候亏多少。」",
    stats: [],
  },
  "mask-crash": {
    id: "mask-crash", title: "📉 口罩风云 · 一地鸡毛", grade: "D",
    narrative:
      "回收商拖走最后一条产线时，按废铁价算的钱还不够结清搬运费。第九个月，银行收走了厂房；第十个月，你在原竞争对手的厂里打工做品控。有天新员工请教你怎么一眼识别次品，你笑了笑——这门手艺，是你用整个工厂换来的。",
    lesson: "2021-2022 年口罩行业大清算：一半新入场企业两年内退出，不少负债离场。「需求悬崖」是周期行业的专有名词——习惯了 3 块的订单，0.2 元的现实就是深渊。承认周期，是实业家最重要的诚实。",
    stats: [],
  },
  "dotcom-sell": {
    id: "dotcom-sell", title: "🛡️ 泡沫之巅 · 高位套现", grade: "A",
    narrative:
      "交割协议签完的那个下午，你在旧金山的公寓阳台上坐了很久。从 1999 年车库里的红笔标语，到 2000 年黑色三月，再到此刻账户里那串锁进保险箱的数字——五年，你亲身走完了一个完整的资本周期。收购方给你保留了独立品牌三年，团队全部留任。你赢了，赢得不轰烈，但赢得完整。",
    lesson: "2000 年泡沫破裂时手握现金和正现金流的公司，在 2003-2004 年迎来了历史上最舒服的卖方市场：巨头们拿着泡沫期赚来的钱扫货，报价是 2001 年行情的十倍。高位套现的 A 级结局，前提是你在 2000 年活了下来——活得久，才有资格谈卖得贵。",
    stats: [],
  },
  "dotcom-ipo": {
    id: "dotcom-ipo", title: "🔔 泡沫之巅 · 反周期敲钟", grade: "S",
    narrative:
      "敲钟大厅里，你刻意没有请乐队——2001 年裁员那晚，是你和 22 个员工在消防通道里开的『散伙饭』，今天站在你身边的是他们每一个人。开盘价跳涨 38%，但你注意到的第一个细节是：财经媒体的头条写的是『盈利型科技公司回归』，而不是『又一个泡沫故事』。从 5132 点的崩塌中，你带回了一家公司，而不只是一个壳。",
    lesson: "2004 年 Google 的 IPO 重新定义了科技上市叙事：带着利润上市的公司，市场给的不是同情价，是溢价。反周期敲钟的 S 级结局，本质是三重复利的兑现——泡沫期攒下的用户习惯、崩溃期练出的成本纪律、回暖期等来的定价权。笑到最后的人，都是在别人狂欢时练内功的人。",
    stats: [],
  },
  "dotcom-survivor": {
    id: "dotcom-survivor", title: "🌳 泡沫之巅 · 清醒的幸存者", grade: "S",
    narrative:
      "行业峰会的晚宴上，主持人请你分享『从泡沫中幸存的经验』。你举了举杯：『我的经验是——不要幸存。』全场愣了三秒，然后笑成一片。你没解释：幸存是被动的，而你是主动选择了一条没人投票的路——不借泡沫的钱，不接秃鹫的条款，不追别人的窗口。公司连续 40 个季度盈利，员工平均司龄 9 年。这杯酒，敬清醒。",
    lesson: "37signals、Automattic 证明了创业终局的第三种可能：不上市、不套现，用可持续的现金流换取完全的自治。它们的估值从不上头条，但员工保留率和客户续费率常年全行业第一。『清醒的幸存者』是最难拿的 S 级——它要求你在所有人都疯的时候保持正常，在所有人绝望的时候保持建设。",
    stats: [],
  },
  "ico-pivot": {
    id: "ico-pivot", title: "⛓️ 链上狂潮 · 产业区块链转身", grade: "S",
    narrative:
      "政务链项目验收通过那天，你带着团队去吃大排档——还是当年讨论要不要发币的那家。当年的联创举起啤酒杯：「敬我们没发的那个币。」你笑着碰杯。后来你的名字出现在国家区块链试点名单的服务商名录里，当年那些一小时募 1.5 亿的白皮书团队，一半在看守所，一半在送外卖。技术理想主义的回报迟到，但从不到账失败。",
    lesson: "蚂蚁链、腾讯至信链、长安链——产业区块链的赢家全是当年守住技术底线的团队。周期会杀死叙事，杀不死真实解决问题的能力。每一轮狂潮都是一次裸泳点名，穿好了泳裤的人，才有资格谈下一个周期。",
    stats: [],
  },
  "ico-exit": {
    id: "ico-exit", title: "💰 链上狂潮 · 高位套现", grade: "A",
    narrative:
      "私钥和公章一起交出时，你最后一次登录那个钱包。数字定格在一个当年不敢想的量级。你在庆功宴上举杯，把没敢说出口的那句话留在了心里：「我们赚的是时代的 β，不是自己的 α。」散场后你去了趟大理，开了家小咖啡馆。有客人认出你：「你是那个做区块链的？」你笑笑：「那是上一个周期的事了。」",
    lesson: "索罗斯的反射理论：在泡沫里赚钱不可耻，可耻的是把 β 当 α 然后加杠杆。2017-2019 年链圈完成财富再分配，落袋为安的人笑到最后，把账面富贵当实力的人还给了市场。认清自己赚的是什么钱，是退场的最后也是最重要一课。",
    stats: [],
  },
  "ico-hodl": {
    id: "ico-hodl", title: "📉 链上狂潮 · 信仰清算", grade: "D",
    narrative:
      "退赔协议很长，你签了三个小时。经计算：这些年赚的快钱连本带息刚好退完，还搭上了两年自由的时间成本和团队的青春。走出大门时天在下小雨，你想起 2017 年那个夏夜，联创眼睛发亮地说「发币吧」——如果当时把那个决定多想一层监管的钟摆，故事的结尾也许会不一样。",
    lesson: "2021 年十部门定性虚拟货币相关业务为非法金融活动——牛市救不了合规死亡。创业者没有孙宇晨们反复横跳的资本：一次押错监管的钟摆，就是全部的筹码。看懂两个钟摆：市场的和监管的，缺一不可。",
    stats: [],
  },
  "mcn-brand": {
    id: "mcn-brand", title: "🏷️ 流量之巅 · 品牌落地", grade: "S",
    narrative:
      "上市敲钟那天，记者问你「网红转型企业家最大的心得」，你答：「流量会过期，信任不会。」招股书的优势栏写着复购率 47%。晚宴上当年的品牌方来了，就是被你真实数据劝退又回来的第一家。他举杯：「当年你说 ROI 做不到 1:5 的时候，我就知道你们能成。」",
    lesson: "交个朋友上市、东方甄选自营转型——流量生意的终点都是流量资产化：把注意力兑换成品牌、供应链与信任。只会买流量的公司永远是平台的打工者；能把复购率做成护城河的，才配叫品牌。",
    stats: [],
  },
  "mcn-signed": {
    id: "mcn-signed", title: "🤝 流量之巅 · 高价卖身", grade: "A",
    narrative:
      "交割那天你在办公室坐到深夜。这个工作室承载过你的三条爆款、五次转型和三十个年轻人的两年青春。买方负责人的话言犹在耳：「我们买的是你们的操盘能力。」你知道这句话有一半是真的——另一半是，你们也把自己的时代一起卖了个好价钱。",
    lesson: "无忧传媒、遥望的并购逻辑：单账号估值=粉丝资产×变现稳定性×团队能力。在正确的时间把内容能力卖给更大的资本，是 A 级退出——开心麻花、笑果的内容资产化路径同理。卖身不是失败，错估身价才是。",
    stats: [],
  },
  "mcn-faded": {
    id: "mcn-faded", title: "🌫️ 流量之巅 · 被算法遗忘", grade: "D",
    narrative:
      "停更三个月后，你路过当年拍摄的工作室，玻璃门上还贴着那张「单账号估值公式」的手写海报。新的租户在做你三年前就见过的内容，播放量比你的巅峰期还高。你在评论区打出一句「加油」，删掉，又打出「当年我也这么干过」，还是删了。最后你什么也没留——注意力时代的退场，连回声都没有。",
    lesson: "内容行业每 18-24 个月一次注意力代际更替，没有组织化转型的个人/工作室存活率极低。留在镜头前的人最终都被镜头遗忘——papi 酱转型幕后、谦寻转供应链，活下来的都是先一步离开镜头的人。",
    stats: [],
  },
  "lehman-winner": {
    id: "lehman-winner", title: "🏆 雷曼时刻 · 危机赢家", grade: "S",
    narrative:
      "行业峰会把你请去做主题演讲，题目是《如何在金融危机中创业》。你站在台上想了想说：「说实话，我不记得自己做了什么聪明的决策——我只记得每天醒来先确认现金，再确认团队，然后才看市场。」台下有人追问成功秘诀，你答：「雷曼死的那个周一，我做的第一件事是把办公室的自动售货机退了。」全场大笑。但你没说的是——那天你其实也哭了。",
    lesson: "2009-2010 年扩张的幸存者吃到了完整牛市：Uber、Airbnb 在危机中完成深蹲，回暖后全面起跳。深蹲的质量决定起跳的高度。危机赢家的共同点不是预测了底部，而是底部到来时他们还活着、手里还有现金、团队还没散。",
    stats: [],
  },
  "lehman-survivor": {
    id: "lehman-survivor", title: "⚓ 雷曼时刻 · 幸存者联盟", grade: "A",
    narrative:
      "战投交割那天，对方 CEO 握着你的手说：「我们看中的不是你们现在的收入，是你们在 2008 年活下来的方式。」你保留了控股权，拿到了渠道和资源。两年后公司在战投的生态里完成了规模化，你在董事会上听着增长数字，想起 2008 年那个只听了 4 分钟就拒绝你的投资人——市场从不记仇，市场只记结果。",
    lesson: "2009 年后战投大爆发（腾讯投京东、谷歌投安卓）。战投的核心价值是战略协同而非资金。代价是独立性让渡——签之前想清楚你要的是钱、渠道还是靠山，三者的合同完全不同。活下来 + 借势，是 A 级创业者最优雅的过冬姿势。",
    stats: [],
  },
  "lehman-hermit": {
    id: "lehman-hermit", title: "🏦 雷曼时刻 · 创伤性保守", grade: "C",
    narrative:
      "公司活着，利润稳定，没有任何一家银行会担心你们。但你知道代价是什么：2012 年移动互联网爆发时，你以「风险太大」否掉了团队的转型提案；那个提案后来在对手公司变成了主打产品。当年和你一起扛过危机的联合创始人辞职时说：「我们赢了 2008，然后输给了『不再相信』。」你在「现金为王」四个字下面，很久没再看过。",
    lesson: "经历过 2008 的创始人很多错过了 2010-2020 的整轮移动互联网——创伤后应激性保守的代价是机会成本。风险管理的目标是活下来继续下注，不是再也不下注。危机给的是纪律，不是枷锁；用它防死，也用它出击。",
    stats: [],
  },
  "jobs-legend": {
    id: "jobs-legend", title: "🖥️ 车库极客 · 时代传奇", grade: "S",
    narrative:
      "你在 keynote 舞台上从口袋掏出那台设备的瞬间，全世界的竞争对手都沉默了。十二年前你被自己创立的公司赶出来，睡过地板、赔过名声、差点连新公司也保不住；十二年后，你用一个四象限矩阵、一场四分钟的演示，重新定义了三个行业。散场后有人问你：「你这一辈子最重要的产品是什么？」你想了想说：「是苹果这家公司本身——产品会过时，锻造产品的那个组织不会。」第二天，你照常七点到办公室，在白板左上角写下新的四个词。传奇不退休，传奇只是换个象限。",
    lesson: "乔布斯路径的完整闭环：车库冷启动（社群演示）→ 绑定技术合伙人 → 技术预见（GUI）→ 被逐（治理风险）→ 流放期补课（经营纪律）→ 聚焦回归。每个阶段对应一条可迁移的创业课：窗口期、股权承诺、预见力、治理设计、失败复盘、押注勇气。S 级不是运气好，是六次大决策基本全对——而这正是本剧本想让你练的肌肉。",
    stats: [],
  },
  "jobs-phoenix": {
    id: "jobs-phoenix", title: "🔥 车库极客 · 浴火重建", grade: "A",
    narrative:
      "公司重回盈利那天，你没有开香槟，只是一个人走到曾经的车库旧址——那里现在是一家干洗店。十二年的放逐、两次豪赌、无数次深夜的白板推演，换来的是一家活下来的公司和一个不再偏执的自己。媒体问你错过了什么，你答：「错过了成为『时代传奇』的那班船——但说实话，能把亲手创立的公司从棺材里抬回来，我已经拿到了命运欠我的全部。」你知道那台改变世界的设备此刻正在某个竞争对手的实验室里，而你不嫉妒。归来者最难得的品质，是接受 A 级结局的从容。",
    lesson: "创始人回归的「托管人模式」：止血、修渠道、渐进创新。不是每个回归者都有乔布斯当年的时间窗口和现金流安全垫，理性评估牌面比复刻传奇更重要。A 级结局的启示：把公司救回来本身就是顶级成就——商业史上完成 turnaround 的公司不超过十分之一。",
    stats: [],
  },
  "jobs-exile": {
    id: "jobs-exile", title: "👑 车库极客 · 永恒的流放者", grade: "D",
    narrative:
      "你赢下了每一场董事会战役，把名字重新刻上了每一栋楼。公司活着，利润稳定，分析师评级「持有」。但深夜加班时你偶尔会打开储藏室——那里堆着当年没敢发布的三台原型机，蒙着十二年的灰。你终于明白了流放者真正的悲剧：不是被赶出去的那一次，而是回来之后，再也没有什么东西值得赌上一切。国王回到了王位，王国却停止了生长。员工在内部论坛给你的匿名评价流传很广：「他很伟大。曾经是。」",
    lesson: "控制权是手段，使命才是目的。把『夺回公司』误认为『完成使命』的回归者，会把组织变成个人纪念碑。真正的王者归来永远以产品为赌注——没有赌注的回归，只是一场漫长的自我加冕。",
    stats: [],
  },
  "blade-clean": {
    id: "blade-clean", title: "🌅 刀尖起舞 · 慢就是快", grade: "S",
    narrative:
      "风暴过后，你站在被「聪明人」腾空的市场的中央。他们的客户需要新供应商，他们的人才需要新雇主，而尽调表上唯一挑不出毛病的公司是你——拒绝过捷径的人。有记者问你凭什么穿越了四个经济周期，你带他去仓库看了一圈，说：「我什么也没做，就是每一笔钱都说得清来路。」他在稿子里写道：「这位老板二十年前拒绝过的东西，比大多数人一辈子拥有的都多。」你不介意这句话被当成赞美。你知道那不是拒绝，那是储蓄——存了二十年，风暴那天，连本带利。",
    lesson: "把二十年放进一张表：走捷径的人前五年指数增长、第六年被连根拔起；走直路的人增长平缓但复利不中断，终值差出一个数量级。监管成熟的时代，「干净」已从道德选择变成唯一划算的算法。这局游戏里最无聊的选择，现实中是最难的选择——所以它配 S。",
    stats: [],
  },
  "blade-survivor": {
    id: "blade-survivor", title: "🩸 刀尖起舞 · 断尾求生", grade: "C",
    narrative:
      "判决书下来的那天，公司缩水了三分之二，你的个人账户几乎清零，但公章还姓你的姓。你在看守所门口接回替你签字又替你作证的老财务——她苍老了十岁，见到你只说了一句：「报表我这次全是真的，一个字都改不了。」你点点头。你们俩都明白这句话的分量：这是这家公司最后一次、也是第一次完全干净的资产负债表。后来的十年，你把这句话裱在了财务室墙上。生意做回去了大半，但你再也没有接过任何一张「大家都这么走」的名片——递名片的人，都被你请出了办公室。",
    lesson: "C 级不是坏结局——它是真实世界里多数「回头」创业者的结局：罚没、缩水、信用修复、二次创业。代价真实且惨重，但人生和公司都保下来了。核心教训：配合调查与退赃是司法实践中最宽的梯度的入场券，而这张券只在还来得及的时候有效。刀尖上回头，永远不晚，但永远不便宜。",
    stats: [],
  },
  "blade-atone": {
    id: "blade-atone", title: "🩸 刀尖起舞 · 从轻发落", grade: "D",
    narrative:
      "三年刑期，因为你交出了那份完整得连办案人员都惊讶的账。指控从五项减到三项，你从十年减到三年——「配合」两个字救了你的命，但案底上的五页纸一页都没少。进去后第一个探视日，老财务隔着玻璃告诉你：公司没倒，四十七个工人一个没少，账已经干净得能拿去裱起来。你在高墙里算了三年账，算清了一笔最大的：那些年省下的每一分钱，最后都加倍变成了刑期、罚没和信用记录。出狱那天，全厂的人来接你。有人喊了一声「老板回来了」，你摆摆手：「别叫老板了，叫师傅吧——我现在的本事，是教你们怎么不踩我踩过的坑。」",
    lesson: "这是本剧本的梯度结局：sin ≥ 3 的重罪者即使全力配合，也逃不掉实刑——宽大量刑减情节、不消事实。它回答了一个关键设计：此前的决策没有作废，每一笔 sin 都在案卷里占一个页码，页数决定你落在宽严梯度的哪一级。",
    stats: [],
  },
  "blade-prison": {
    id: "blade-prison", title: "⚖️ 刀尖起舞 · 铁窗泪", grade: "D",
    narrative:
      "宣判那天，旁听席坐满了你认识的和不认识的人。刑期数字念出来的时候，你异常平静——二十年前的每一张签名在你眼前排成一列，终点在这里，其实一直都在这里。公司在你入监后第三个月被拍卖，买家是你当年的对手，他出价最高的那一项资产，是你的客户名单。探视日，老财务带着她孙子来，隔着玻璃说：「报表我都交给经侦了，全是真的。」你笑了，眼泪却下来了。原来这间公司最后一份干净的报表，是你进去之后才做出来的。窗外阳光很好，慢就是快——你用了二十年学会这句话，学费是全部的自由。",
    lesson: "负隅顽抗是数学上的必然败局：现代经侦的多重交叉验证让「统一口径」变成自我举证，毁灭证据只是法定从重情节。这个 D 级结局想让你记住的不是恐惧，是荒谬——所有聪明人机关算尽，最后输给的是二十年前一张报关单上的签名。刀尖舔到的每一滴血，都标好了利息。",
    stats: [],
  },
};

// ─── 联合创始人 ─────────────────────────────────────────────────────────────
export const COFOUNDERS: Cofounder[] = [
  {
    id: "azhe", name: "阿哲", role: "技术合伙人", trait: "tech",
    desc: "前大厂架构师，话少活好。你们在一次黑客马拉松上通宵并肩过，他知道你所有的烂代码，还是选择跟你干。",
    bonus: "⚡ 被动：产品/技术推进速度 +20%（深夜重构事件线）",
  },
  {
    id: "grace", name: "Grace", role: "销售合伙人", trait: "sales",
    desc: "十五年 ToB 销售老兵，通讯录里躺着半个行业的 CFO。她卖的不是产品，是打开市场的第一扇门。",
    bonus: "💰 被动：营收转化效率 +30%（大单事件线）",
  },
  {
    id: "laoxu", name: "老徐", role: "贵人合伙人", trait: "mentor",
    desc: "你父亲的旧识、连续创业者，投过也黄过三家公司。他不一定懂你的技术，但他懂得人在局里的每一步棋。",
    bonus: "🍀 被动：融资成功率 +8%（贵人饭局事件线）",
  },
];

// ─── 剧本模式 ───────────────────────────────────────────────────────────────
export const SCENARIOS: ScenarioDef[] = [
  {
    id: "groupon",
    title: "千团大战（2010）",
    year: 2010,
    tagline: "五千家团购公司，只有不到十家活到终局。你是冲锋者，还是幸存者？",
    realHistory: "改编自 2010-2012 年真实千团大战：拉手网/窝窝团烧钱冲 IPO 折戟，美团靠密度与克制成为终局赢家，2015 年美团点评合并。",
    regionId: "beijing",
    industryId: "consumer",
    startCash: 40,
    endingHint: "固定事件链 · 两种真实历史走向的结局",
    queue: [
      { month: 3, eventId: "sc-groupon-boom" },
      { month: 6, eventId: "burn-war" },
      { month: 9, eventId: "investor-ghost" },
      { month: 11, eventId: "sc-groupon-capital" },
      { month: 13, eventId: "sc-groupon-endgame" },
    ],
    finalEventId: "sc-groupon-endgame",
  },
  {
    id: "mask",
    title: "口罩风云（2020）",
    year: 2020,
    tagline: "订单排到半年后、原料涨 20 倍——风口的盛宴，还是周期的陷阱？",
    realHistory: "改编自 2020 年疫情口罩产业：熔喷布从 2 万炒到 40 万/吨、产能一年扩张 20 倍、2021 年行业大洗牌。赚快钱与守纪律的人走向了不同的结局。",
    regionId: "shenzhen",
    industryId: "traditional",
    startCash: 60,
    endingHint: "固定事件链 · 纪律与贪婪对应不同结局",
    queue: [
      { month: 2, eventId: "sc-mask-rush" },
      { month: 4, eventId: "sc-mask-speculator" },
      { month: 6, eventId: "sc-mask-expand" },
      { month: 9, eventId: "sc-mask-endgame" },
    ],
    finalEventId: "sc-mask-endgame",
  },
  {
    id: "dotcom1999",
    title: "泡沫之巅（1999）",
    year: 1999,
    tagline: "纳斯达克 5000 点的狂欢，5132 点的崩塌——穿越史上最著名的资本泡沫。",
    realHistory: "改编自 1999-2004 年互联网泡沫全过程：TheGlobe.com 首日暴涨 606%、Pets.com 超级碗广告烧光 1.47 亿、纳斯达克 78% 崩溃、Google 2004 年反周期上市。你的每个选择都有真实的历史对照组。",
    regionId: "silicon",
    industryId: "ecom",
    startCash: 35,
    endingHint: "固定事件链 · 高位套现 / 反周期敲钟 / 清醒的幸存者 三结局",
    queue: [
      { month: 2, eventId: "sc-dotcom-goldrush" },
      { month: 4, eventId: "sc-dotcom-vc-frenzy" },
      { month: 7, eventId: "sc-dotcom-ipo-window" },
      { month: 9, eventId: "sc-dotcom-crash" },
      { month: 11, eventId: "sc-dotcom-last-stand" },
      { month: 14, eventId: "sc-dotcom-second-wave" },
      { month: 18, eventId: "sc-dotcom-endgame" },
    ],
    finalEventId: "sc-dotcom-endgame",
  },
  {
    id: "ico2017",
    title: "链上狂潮（2017）",
    year: 2017,
    tagline: "一小时募 1.5 亿的白皮书时代，与九四重锤——发币、割韭菜还是守住技术底线？",
    realHistory: "改编自 2017-2019 年加密货币狂潮与监管风暴：ICO 募资狂潮、Plustoken 传销案、九四禁令全面清退、2018 破发潮、十部门定性非法金融活动。技术派与发币派走向了完全不同的结局。",
    regionId: "shenzhen",
    industryId: "fintech",
    startCash: 25,
    endingHint: "固定事件链 · 产业转型 S / 高位套现 A / 信仰清算 D 三结局",
    queue: [
      { month: 2, eventId: "sc-ico-goldrush" },
      { month: 4, eventId: "sc-ico-pump" },
      { month: 6, eventId: "sc-ico-ban" },
      { month: 8, eventId: "sc-ico-winter" },
      { month: 11, eventId: "sc-ico-endgame" },
    ],
    finalEventId: "sc-ico-endgame",
  },
  {
    id: "mcn2019",
    title: "流量之巅（2019）",
    year: 2019,
    tagline: "短视频红利期的最后窗口——自建 IP、MCN 保底还是刷单造假？薇娅风暴正在路上。",
    realHistory: "改编自 2019-2022 年直播电商与自媒体行业：MCN 保底合同陷阱、辛巴燕窝事件、薇娅 13.41 亿税务风暴、算法代际更替、交个朋友与东方甄选的转型上市。",
    regionId: "shanghai",
    industryId: "entertainment",
    startCash: 20,
    endingHint: "固定事件链 · 品牌落地 S / 高价卖身 A / 被算法遗忘 D 三结局",
    queue: [
      { month: 2, eventId: "sc-mcn-boom" },
      { month: 4, eventId: "sc-mcn-gimmick" },
      { month: 6, eventId: "sc-mcn-fade" },
      { month: 8, eventId: "sc-mcn-taxstorm" },
      { month: 11, eventId: "sc-mcn-endgame" },
    ],
    finalEventId: "sc-mcn-endgame",
  },
  {
    id: "lehman2008",
    title: "雷曼时刻（2008）",
    year: 2008,
    tagline: "158 年历史的银行在一夜之间死掉。融资冻结、客户消失、现金为王——你是废墟上的种子，还是废墟本身？",
    realHistory: "改编自 2008-2010 年金融危机创业史：雷曼破产当周的 term sheet 大逃亡、红杉「RIP Good Times」内部信、Airbnb 估值腰斩仍融资、四万亿与 QE 的行业洗牌、危机并购潮。本剧本为隐藏彩蛋：通关全部城市与行业后解锁。",
    regionId: "nyc",
    industryId: "fintech",
    startCash: 25,
    hidden: true,
    unlockHint: "🥚 隐藏剧本 · 通关全部 12 座城市 + 全部 12 个行业后解锁",
    endingHint: "固定事件链 · 危机赢家 S / 幸存者联盟 A / 创伤性保守 C 三结局",
    queue: [
      { month: 2, eventId: "sc-lehman-collapse" },
      { month: 4, eventId: "sc-lehman-freeze" },
      { month: 6, eventId: "sc-lehman-contrarian" },
      { month: 8, eventId: "sc-lehman-stimulus" },
      { month: 11, eventId: "sc-lehman-endgame" },
    ],
    finalEventId: "sc-lehman-endgame",
  },
  {
    id: "jobs1976",
    title: "车库极客之路（1976）",
    year: 1976,
    tagline: "21 岁，父母家的车库，赊账买来的 50 台零件。PC 革命的枪声即将打响——你是那个从口袋掏出未来的人，还是被时代绕过的人？",
    realHistory: "原型化改编自闭环商业史案例：1976 年车库创业（家酿计算机俱乐部冷启动）、技术合伙人的 50% 股权之问、图形界面的技术预见、1985 年被董事会放逐、流放期的新公司实验、1997 年王者归来与极致聚焦。人物均为架空原型，事件链为真实创业规律的戏剧化重现。二重彩蛋：在「雷曼时刻（2008）」达成 S 级后解锁。",
    regionId: "silicon",
    industryId: "hardware",
    startCash: 65,
    hidden: true,
    unlockScenarioId: "lehman2008",
    unlockMinGrade: "S",
    unlockHint: "🥚 二重彩蛋 · 在「雷曼时刻（2008）」达成 S 级后解锁",
    endingHint: "固定事件链 · 时代传奇 S / 浴火重建 A / 永恒的流放者 D 三结局",
    queue: [
      { month: 2, eventId: "sc-jobs-garage" },
      { month: 4, eventId: "sc-jobs-partner" },
      { month: 6, eventId: "sc-jobs-gui" },
      { month: 8, eventId: "sc-jobs-coup" },
      { month: 9, eventId: "sc-jobs-next" },
      { month: 11, eventId: "sc-jobs-return" },
    ],
    finalEventId: "sc-jobs-return",
  },
  {
    id: "blade1998",
    title: "刀尖起舞（1998）",
    year: 1998,
    tagline: "金融风暴后的深圳，批文、报关单、澡堂和底片——每一步捷径都在某个账本上记了页码。风暴来临时，你心里有本账吗？",
    realHistory: "原型化改编自九十年代沿海「批文经济」时代的集体记忆与反腐风暴叙事（《狂飙》式悲剧结构）：批关系费、低报货值、带控制权的救命钱、关联交易做平报表、把柄勒索与断尾求生。所有灰色操作均为叙事选择、不展示可复用方法；结局永远是审判，变量只在摔多狠、保住什么。三重彩蛋：在「车库极客之路（1976）」达成 S 级后解锁。",
    regionId: "shenzhen",
    industryId: "traditional",
    startCash: 25,
    hidden: true,
    unlockScenarioId: "jobs1976",
    unlockMinGrade: "S",
    unlockHint: "🥚 三重彩蛋 · 在「车库极客之路（1976）」达成 S 级后解锁",
    endingHint: "固定事件链 · 慢就是快 S（全程干净）／断尾求生 C（1-2 笔账+配合）／从轻发落 D（3 笔以上，配合也减刑期不减案底）／铁窗泪 D（负隅顽抗）",
    queue: [
      { month: 2, eventId: "sc-blade-permit" },
      { month: 4, eventId: "sc-blade-customs" },
      { month: 6, eventId: "sc-blade-bathhouse" },
      { month: 8, eventId: "sc-blade-shell" },
      { month: 10, eventId: "sc-blade-photo" },
      { month: 13, eventId: "sc-blade-trial" },
    ],
    finalEventId: "sc-blade-trial",
  },
];

// ─── 访谈题库 ───────────────────────────────────────────────────────────────
export interface InterviewQuestion {
  id: string;
  text: string;
  score: number; // 好的访谈问题得分
  why: string;
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  { id: "q1", text: "「你上一次遇到这个问题是什么时候？当时怎么解决的？」", score: 3, why: "问真实行为而非假设——「你会付费吗」得到的全是客套话，「你上周怎么解决的」才是真相。" },
  { id: "q2", text: "「能给我看看你现在是怎么 workaround（凑合解决）的吗？」", score: 3, why: "有 workaround 说明痛点真实且急迫。Dropbox 创始人在论坛里发现人们用各种奇葩方式同步文件，验证了需求。" },
  { id: "q3", text: "「如果这产品今天就能用，你愿意预付一年费用吗？」", score: 2, why: "嘴上说好用不算数，愿意掏钱的承诺才是 PMF 信号。Stripe 最早的用户都是还没产品就付了款的。" },
  { id: "q4", text: "「你觉得这个产品有没有前途？」", score: 0, why: "糟糕的问题：对方只会说你想听的。礼貌的谎言是访谈最大的噪音。" },
  { id: "q5", text: "「这个问题让你损失了多少钱/时间？能说具体点吗？」", score: 3, why: "量化痛点：损失越大、越具体，付费意愿越强。「挺麻烦的」和「每月损失 2 万块」之间隔着一整个商业模式。" },
  { id: "q6", text: "「我给你演示一下我们的想法，你觉得酷吗？」", score: 0, why: "演示会锚定对方，收获的全是恭维。The Mom Test 第一条规则：谈论对方的生活，而不是你的想法。" },
  { id: "q7", text: "「谁还会遇到这个问题？能介绍我认识吗？」", score: 2, why: "好的访谈自带获客渠道。「谁痛得最厉害」帮你找到第一批种子用户，转介绍是免费的精准流量。" },
  { id: "q8", text: "「你打算为这个付多少钱？」", score: 1, why: "直接问价格会触发谈判本能，得到的答案偏乐观。更好的方式：问当前替代方案的预算，或做真实的预售测试。" },
  { id: "q9", text: "「如果明天这个问题消失，你的日子会有什么不同？」", score: 2, why: "衡量价值感：如果对方说不出「会怎样」，说明痛点没痛到改变行为——而没有行为改变就没有市场。" },
];

// ─── 随机名字 ───────────────────────────────────────────────────────────────
export const NAMES = {
  male: ["陈舟", "李昂", "Alex Chen", "Max Weber", "Jack Liu", "顾远", "Kevin Tan", "王一鸣"],
  female: ["林晚", "苏晴", "Sarah Lin", "Emma Zhang", "赵敏之", "Lena Fischer", "陈曦", "Maya Chen"],
};

export const STAGE_NAMES: Record<string, string> = {
  idea: "💡 灵感期",
  validate: "🔍 需求验证",
  mvp: "⚒️ MVP 开发",
  seed: "🌱 种子轮",
  growth: "🚀 增长期",
  seriesA: "📈 A 轮",
  scale: "🏭 规模化",
  endgame: "🏛️ 终局",
};
