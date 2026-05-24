import { Bi } from "./lang";

/* ============================================================
   THE TEN SYSTEMS — section headers + essays
   ============================================================ */
export type Section = { num: string; id: string; title: Bi; sub: Bi; body: Bi };

export const SECTIONS: Section[] = [
  {
    num: "01", id: "origin",
    title: { en: "The Origin of the Carbon Cycle", zh: "碳循环的起源" },
    sub: { en: "Earth as a single, slow-turning engine that moves carbon between sky, sea, life and stone", zh: "把地球看作一台缓慢运转的引擎，在天、海、生命与岩石之间搬运碳" },
    body: {
      en: "Before it was a crisis, carbon was the bookkeeping of a living planet. The same six-proton atom that builds every sugar, protein and strand of DNA is also the gas a volcano breathes and the diamond locked in the deep — and Earth has spent four billion years circulating it through a vast, slow engine with no engineer. A leaf pulls carbon dioxide from the air and welds it into sugar with sunlight; an animal eats the leaf and exhales the carbon back; the ocean dissolves it, plankton sink it, and over millions of years rock weathering and burial bury it as limestone, coal and oil. These flows are enormous and nearly balanced: roughly a hundred billion tonnes of carbon move between air, ocean and life every year, and for most of history what went up came back down. The atmosphere is the smallest reservoir and the most sensitive — a thin shared account that the ocean, the forests, the soil and the rocks all draw on and pay into. Understand that ledger, and you understand that climate is not weather but accounting: the slow arithmetic of where a planet keeps its carbon.",
      zh: "在成为一场危机之前，碳是一颗活着的行星的记账。那个构建起每一个糖、每一种蛋白质、每一条 DNA 的、带六个质子的原子，也是火山所呼出的气体、是深处被锁住的钻石——而地球已花了四十亿年，借由一台缓慢、无人设计的庞大引擎，让它循环不息。一片叶子从空气中拉出二氧化碳，用阳光把它焊接成糖；一只动物吃下叶子，又把碳呼回去；海洋将它溶解，浮游生物把它沉降，而历经数百万年，岩石的风化与埋藏，把它封存为石灰岩、煤与石油。这些流量是巨大的，且几近平衡：每年约有一千亿吨碳，在空气、海洋与生命之间移动，而在历史的大部分时间里，升上去的，又回落下来。大气，是最小的储库，也是最敏感的那个——一份被海洋、森林、土壤与岩石共同支取、共同存入的、单薄的共享账户。读懂那本账，你就读懂了：气候不是天气，而是记账——一颗行星把它的碳存放在何处的、那道缓慢的算术。",
    },
  },
  {
    num: "02", id: "industry",
    title: { en: "Industrialization & Atmospheric Transformation", zh: "工业化与大气的改变" },
    sub: { en: "How a civilization learned to burn the buried past faster than the planet could rebury it", zh: "一个文明如何学会，以比行星重新埋藏更快的速度，焚烧那被埋藏的过去" },
    body: {
      en: "For three hundred million years the planet was a carbon sink: forests fell into swamps, plankton rained onto the seafloor, and the slow press of geology turned them into coal, oil and gas — sunlight from the deep past, locked away. Industrial civilization is, at its physical root, the discovery that this buried sunlight could be dug up and set on fire. A steam engine, a blast furnace, a power station, a jet — each is a machine for converting ancient carbon back into atmospheric carbon dioxide, and doing it in a century what burial took epochs to accumulate. The result is not subtle: the atmosphere held about 280 parts per million of CO₂ for the ten thousand years of human civilization, and we have pushed it past 420 in under two hundred — a vertical line on a graph that was flat since the last ice age. Coal, oil and gas supply the energy; cement, steel and ammonia add their own chemistry; clearing forests and tilling soil release the carbon that living systems had banked. The deep change is one of rate. The natural carbon engine still turns, but we have opened a valve it cannot close, releasing in decades what it filed away over geological time — and the bill arrives as a warming, acidifying, destabilizing sky.",
      zh: "有三亿年，这颗行星是一个碳汇：森林倒进沼泽，浮游生物如雨落向海底，而地质的缓慢挤压，把它们变成煤、石油与天然气——来自远古的阳光，被封存了起来。工业文明，在它物理的根上，正是这样一个发现：这被埋藏的阳光，可以被掘出，并被点燃。一台蒸汽机、一座高炉、一座电站、一架喷气机——每一个，都是把远古的碳转回成大气二氧化碳的机器，并以一个世纪、去完成埋藏曾耗费数个地质时代才积累之事。其结果毫不含糊：在人类文明的一万年里，大气中的二氧化碳约为百万分之二百八十，而我们已在不到两百年内，把它推过了百万分之四百二十——一条图上的垂直线，而那图自上一个冰期以来本是平的。煤、石油与天然气供应能量；水泥、钢铁与合成氨添上它们自己的化学；而砍伐森林、翻耕土壤，释放出活的系统曾存入的碳。那个深层的改变，是速率的改变。自然的碳引擎仍在转动，但我们打开了一个它无法关闭的阀门，在数十年间，释放出它历经地质时间归档之物——而账单，正以一片变暖、酸化、失稳的天空，到来。",
    },
  },
  {
    num: "03", id: "greenhouse",
    title: { en: "The Greenhouse Effect & Climate Dynamics", zh: "温室效应与气候动力学" },
    sub: { en: "Why a few molecules in a few hundred parts per million can move an entire planet's thermostat", zh: "为何百万分之几百中的、寥寥几个分子，能拨动整颗行星的恒温器" },
    body: {
      en: "Earth keeps warm the way a blanket does — not by making heat, but by slowing its escape. Sunlight arrives as visible light, passes easily through the air, and warms the surface; the warmed surface radiates that energy back upward as infrared, and here is the trick: certain gases — carbon dioxide, methane, water vapor — are nearly transparent to incoming sunlight but absorb outgoing infrared, re-emitting it in all directions, including back down. Without them the planet would average about −18°C, a frozen rock; with them it sits near +15°C, and life is possible. The greenhouse effect is not the problem — it is the reason Earth is habitable. The problem is that we are turning the dial. Adding carbon dioxide thickens the blanket, trapping a little more heat, and the system answers with feedbacks that dwarf the original push: a warmer atmosphere holds more water vapor, itself a greenhouse gas; melting ice exposes dark ocean that absorbs more sunlight; thawing permafrost exhales methane; warming seas hold less dissolved CO₂. Each is an amplifier. A planet's climate is not a thermostat that gently corrects — it is a system of tipping balances, capable of lurching from one stable state to another, and the energy now accumulating is measured in the heat of billions of bombs a year, quietly loaded into the ocean and the air.",
      zh: "地球保暖的方式，与一床被子相同——不是靠制造热量，而是靠减缓热量的逃逸。阳光以可见光抵达，轻易穿过空气，温暖地表；被温暖的地表，把那能量以红外线向上辐射回去，而玄机正在此处：某些气体——二氧化碳、甲烷、水汽——对射入的阳光几乎透明，却吸收射出的红外线，并把它向四面八方重新发射，包括向下。没有它们，这颗行星的平均温度将约为零下十八摄氏度，一块冰封的岩石；有了它们，它停在约正十五摄氏度，生命于是可能。温室效应本身，不是问题——它正是地球宜居的原因。问题在于，我们正在转动那个旋钮。添加二氧化碳，加厚了那床被子，多困住一点点热，而系统以一连串远超那原初推力的反馈作答：更暖的大气容纳更多水汽，而水汽本身就是温室气体；融化的冰，露出深色的海洋，吸收更多阳光；解冻的永冻土，呼出甲烷；变暖的海，溶解更少的二氧化碳。每一个，都是一个放大器。一颗行星的气候，不是一个温柔自我修正的恒温器——它是一个由临界平衡构成的系统，能够从一个稳定态、猛然跌入另一个，而此刻正在累积的能量，以每年数十亿颗炸弹的热量来计量，悄然地，被装入海洋与空气。",
    },
  },
  {
    num: "04", id: "dac",
    title: { en: "Direct Air Capture & Industrial Carbon Removal", zh: "直接空气捕获与工业碳移除" },
    sub: { en: "Building machines that run the carbon cycle backward — pulling CO₂ out of a transparent, near-empty sky", zh: "建造让碳循环倒转的机器——从一片透明、近乎空旷的天空中，把二氧化碳抽出来" },
    body: {
      en: "Stopping emissions slows the filling of the bath; carbon removal is the attempt to pull the plug. The hardest version is direct air capture: machines that move enormous volumes of air across a chemical sorbent that grabs CO₂ — present at just 0.04% — then heat or vacuum the sorbent to release a pure stream that can be compressed and pumped a kilometre underground, where it mineralizes into rock over centuries. The thermodynamics are unforgiving: separating a dilute gas from everything else costs energy by the laws of physics, which is why a tonne removed can cost hundreds of dollars and why the power had better be clean, or the cure emits more than it captures. Direct air capture is only one architecture among many, each with its own trade of cost, energy, permanence and scale: bioenergy with capture lets plants do the dilute work and burns them for power; enhanced weathering spreads crushed rock to speed a natural reaction; ocean alkalinity nudges the sea to drink more; mineralization turns CO₂ to stone for ten thousand years. None is a license to keep emitting, and all are dwarfed today by the scale of the problem — humanity emits some forty billion tonnes of CO₂ a year and removes a rounding error. But the significance is conceptual as much as practical: for the first time, the atmosphere has become an engineering target, a system we propose not merely to stop disturbing but to actively, deliberately repair.",
      zh: "停止排放，减缓的是浴缸被注满；碳移除，则是试图拔掉塞子。其中最难的一种，是直接空气捕获：让机器把巨量的空气，吹过一种能抓住二氧化碳——它在空气中仅占百分之零点零四——的化学吸附剂，再以加热或抽真空，让吸附剂释放出一股纯净的气流，它可被压缩、被泵入地下一公里，在那里，历经数个世纪，矿化成岩石。其热力学是无情的：把一种稀薄的气体从其余一切中分离出来，依物理定律就要耗费能量，这正是为何移除一吨，可能花费数百美元，也是为何那能量最好是清洁的——否则，这剂解药排放的，比它捕获的还多。直接空气捕获，只是众多架构中的一种，每一种都有它自己在成本、能量、持久性与规模之间的取舍：生物能源加捕获，让植物去做那稀释的活计，再焚烧它们以发电；强化风化，铺撒碎石，以加速一个自然反应；海洋碱化，轻推海水多喝一些；矿化，把二氧化碳变成岩石，封存一万年。没有一种，是继续排放的许可证，而今天，它们全都被问题的规模所矮化——人类每年排放约四百亿吨二氧化碳，移除的，则是一个可忽略的尾数。但其意义，是观念上的、不亚于实践上的：人类头一次，把大气变成了一个工程目标，一个我们提议的，不只是停止扰动、而是去主动地、刻意地修复的系统。",
    },
  },
  {
    num: "05", id: "bio",
    title: { en: "Biological & Oceanic Carbon Systems", zh: "生物与海洋的碳系统" },
    sub: { en: "The living machinery that has captured carbon for free, at planetary scale, for a billion years", zh: "那活着的机械，已免费地、以行星尺度、捕获了碳，长达十亿年" },
    body: {
      en: "Before any engineer proposed a carbon-capture machine, life had been running the largest one on Earth for a billion years. Every forest is a slow carbon vault; every gram of soil holds more carbon than the air above it; every breath of phytoplankton in the sunlit sea fixes carbon that sinks, when they die, into the cold dark below — the biological pump that has quietly governed the atmosphere across the ages. Roughly a quarter of the carbon we emit each year is currently soaked up by the land's plants and soils, and another quarter by the ocean, and without these two free services the climate would already be far hotter. The lesson is that the cheapest, most scalable carbon technology is biology itself — but it is neither free of trade-offs nor permanent. A forest stores carbon only until it burns or is cut; soil releases it when tilled; the ocean's appetite for CO₂ comes at the price of acidification, which corrodes the very shells and reefs that anchor marine life. The frontier is to work with this living machinery rather than against it: protecting the forests and peatlands and mangroves that already bank carbon, farming kelp and restoring seagrass, returning carbon to soils as biochar, and learning where a gentle human nudge can enlarge a natural sink without breaking the ecosystem that makes it run. Biology is not a substitute for cutting emissions — it is the substrate on which any livable planet, managed or wild, must stand.",
      zh: "在任何一位工程师提议一台碳捕获机器之前，生命，已运行着地球上最大的那一台，长达十亿年。每一片森林，都是一座缓慢的碳库；每一克土壤，所含的碳，都多过它上方的空气；阳光照耀的海中，浮游植物的每一次呼吸，都固定下碳，待它们死去，便沉入下方那寒冷的黑暗——那是悄然主宰着大气、跨越了诸多时代的生物泵。我们每年排放的碳，眼下约有四分之一，被陆地的植物与土壤吸纳，另有四分之一，被海洋吸纳，而若没有这两项免费的服务，气候早已远比现在炎热。这一课是：最廉价、最可扩展的碳技术，正是生物本身——但它既非没有取舍，也非永久。一片森林储存碳，只到它焚毁或被砍伐为止；土壤在被翻耕时，把碳释放；而海洋对二氧化碳的胃口，以酸化为代价，那酸化，正腐蚀着锚定海洋生命的、那些贝壳与珊瑚礁。前沿，是与这活着的机械协作，而非与之对抗：守护那些早已存碳的森林、泥炭地与红树林，养殖海带、修复海草，以生物炭的形式把碳还给土壤，并学会，在何处，一记温柔的人为轻推，能扩大一个自然的碳汇，而不击碎那让它运转的生态系统。生物，不是削减排放的替代品——它是任何一颗宜居行星，无论被管理还是野生，都必须立足其上的基底。",
    },
  },
  {
    num: "06", id: "energy",
    title: { en: "Energy Systems & Carbon-Negative Economies", zh: "能源系统与负碳经济" },
    sub: { en: "Decarbonizing the bloodstream of civilization without starving it of power", zh: "为文明的血流脱碳，而不令它因缺乏动力而枯竭" },
    body: {
      en: "Almost all of the carbon problem is, underneath, an energy problem: civilization runs on burning, and burning is how we have made carbon a pollutant. To fix the climate without dismantling modern life means rebuilding the entire energy system — the largest machine humanity has ever operated — so that it delivers the same power without the smoke. The components are now real and falling in price: solar and wind, whose fuel is free and whose carbon is near zero once built; nuclear fission and the long-promised fusion, dense and steady; hydrogen as a way to store and ship clean energy and to decarbonize the stubborn industries — steel, cement, shipping, aviation — that cannot simply plug into a wall; and synthetic fuels made by combining captured carbon with clean hydrogen, closing a loop instead of opening the ground. The deepest idea here is the carbon-negative economy: not merely an economy that stops adding carbon, but one whose normal operation removes more than it emits, paid for because removal has been given a price. This inverts the entire industrial logic. For two centuries growth meant more combustion; the proposal now is that growth, intelligently arranged, could mean a planet that cools as its civilization expands — the first economy in history rewarded for putting carbon back.",
      zh: "几乎整个碳问题，在底下，都是一个能源问题：文明靠燃烧运转，而燃烧，正是我们把碳变成污染物的方式。要在不拆解现代生活的前提下修复气候，意味着重建整个能源系统——人类操作过的最大的机器——好让它输出同样的动力，却不冒烟。其组件如今已是真实的，且价格仍在下跌：太阳能与风能，燃料免费、一旦建成碳近乎为零；核裂变，以及那被许诺已久的核聚变，密集而稳定；氢，作为一种储存与运输清洁能源的方式，并为那些无法简单插上插座的、顽固的行业——钢铁、水泥、航运、航空——脱碳；以及合成燃料，把捕获的碳与清洁的氢结合而成，闭合一个循环，而非掘开大地。这里最深的念头，是负碳经济：不只是一个停止添加碳的经济，而是一个其正常运转便移除多于排放的经济，之所以付得起，是因为「移除」被赋予了一个价格。这颠倒了整个工业逻辑。两个世纪以来，增长意味着更多的燃烧；而如今的提议是：增长，若被智慧地安排，可以意味着一颗随其文明扩张而冷却的行星——历史上头一个因把碳放回去而获报酬的经济。",
    },
  },
  {
    num: "07", id: "geo",
    title: { en: "Geoengineering & Planetary Management", zh: "地球工程与行星管理" },
    sub: { en: "The temptation to turn down the sun — and the dilemma of a thermostat with no owner", zh: "调暗太阳的诱惑——以及一个无主恒温器的两难" },
    body: {
      en: "There is a faster, cheaper, more frightening lever than removing carbon: changing how much sunlight the planet keeps. Geoengineering — more precisely, solar radiation management — proposes to cool Earth not by fixing the cause but by masking the symptom, mimicking the way a large volcanic eruption throws a haze of sulfate into the stratosphere and shades the world for a year or two. A fleet of high aircraft could in principle do the same continuously, brightening marine clouds, thinning cirrus, or scattering a veil of fine particles to reflect a percent of incoming sunlight. The physics is plausible and the cost is shockingly low — well within the reach of a single wealthy nation or even a determined individual — and that is precisely the danger. Such a shade does nothing about ocean acidification, redistributes rainfall in ways that could parch one region while drowning another, and creates a terrifying dependency: stop abruptly and the masked warming returns all at once, a termination shock. Worst of all, it is a thermostat with no agreed owner — who sets the temperature of a shared planet, and who is liable when the monsoon fails? Geoengineering forces the question this whole subject has been circling: humanity has already become a geological force by accident. The only choice left is whether to become one on purpose, with the wisdom, the governance and the humility that deliberate planetary management would demand.",
      zh: "有一根比移除碳更快、更廉价、也更令人惊惧的杠杆：改变这颗行星留住多少阳光。地球工程——更确切地说，太阳辐射管理——提议为地球降温，不靠修复病因，而靠掩盖症状，模仿一场大型火山喷发，把一层硫酸盐的薄雾抛入平流层、为世界遮荫一两年的方式。一支高空机队，原则上能持续地做同样的事，增亮海洋上的云、削薄卷云，或散布一层细微颗粒的面纱，去反射百分之一的入射阳光。其物理是说得通的，其成本低得令人震惊——远在一个富裕国家、甚至一个意志坚决的个人的能力之内——而那，恰恰是危险所在。这样一层荫蔽，对海洋酸化无能为力，会以可能让一个区域干涸、却让另一个淹没的方式重新分配降雨，并造成一种可怖的依赖：一旦骤然停止，被掩盖的变暖会一次性全部归来，一记终止冲击。最糟的是，它是一个无人达成共识的恒温器——谁来设定一颗共享行星的温度，而当季风失灵，谁来担责？地球工程，逼出了这整个主题一直在绕行的问题：人类已经，在意外之中，成为了一种地质力量。剩下唯一的选择是：要不要有意地成为一种——带着刻意的行星管理所要求的、那份智慧、那份治理，与那份谦卑。",
    },
  },
  {
    num: "08", id: "ai",
    title: { en: "AI, Climate Modeling & Autonomous Ecological Systems", zh: "AI、气候建模与自主生态系统" },
    sub: { en: "A planetary nervous system that can finally measure, predict, and coordinate the carbon it once ignored", zh: "一套行星神经系统，终于能去测量、预测、并协调它曾忽视的碳" },
    body: {
      en: "You cannot manage what you cannot measure, and for most of the industrial era we could not measure carbon at the resolution the problem demands. That is changing fast. A growing mesh of satellites, sensors and models is becoming a planetary nervous system — and artificial intelligence is the layer that turns its flood of data into understanding and action. AI now tracks emissions plume by plume from orbit, holding polluters to account where self-reporting failed; it compresses the staggering physics of the atmosphere into climate models that run in minutes instead of weeks, and into 'digital twins' of the Earth detailed enough to rehearse a policy before it is enacted. It balances electrical grids around the flicker of sun and wind so that clean power is not wasted; it searches the chemical space for better sorbents and catalysts faster than any lab; it monitors forests, reefs and ice in near-real time, catching collapse before it is irreversible. The horizon is an autonomous ecological layer: systems that do not merely advise but act — dispatching capture, adjusting flows, stabilizing sinks — coordinating a planet's carbon the way a body's autonomic nervous system regulates its breath, beneath conscious attention. The promise is competence at a scale no committee could match. The peril is the same as anywhere a system optimizes a number: a planetary manager is only as wise as the goal it is given, and the goal for a living world is far harder to specify than a temperature.",
      zh: "你无法管理你无法测量之物，而在工业时代的大部分时间里，我们都无法以问题所要求的分辨率去测量碳。这正在迅速改变。一张日益密集的卫星、传感器与模型之网，正成为一套行星神经系统——而人工智能，是把它那洪流般的数据，转化为理解与行动的那一层。AI 如今从轨道上一缕一缕地追踪排放，在自我申报失效之处，让污染者负起责任；它把大气那令人咋舌的物理，压缩进能以分钟、而非数周运行的气候模型，压缩进精细到足以在一项政策被颁布前先行演练的、地球的「数字孪生」。它围绕日照与风的闪烁来平衡电网，好让清洁的电力不被浪费；它在化学的空间里搜寻更好的吸附剂与催化剂，比任何实验室都快；它近乎实时地监测森林、珊瑚礁与冰，在崩溃变得不可逆之前将其捕捉。地平线，是一个自主的生态层：那些不只建议、而是行动的系统——调度捕获、调整流量、稳定碳汇——以一具身体的自主神经系统调节其呼吸的方式，在意识的注意之下，协调着一颗行星的碳。它许诺的，是任何委员会都无法匹敌的、那种规模的胜任。它的凶险，与任何一个优化某个数字的系统处，并无二致：一个行星的管理者，只与它被赋予的目标一样有智慧，而为一个活着的世界设定目标，远比设定一个温度，要困难得多。",
    },
  },
  {
    num: "09", id: "space",
    title: { en: "Space, Terraforming & Future Biospheres", zh: "太空、地球化与未来的生物圈" },
    sub: { en: "Carbon management as the founding craft of any civilization that intends to live off-world", zh: "把碳管理，看作任何一个意图在地外生存的文明的、立身之技" },
    body: {
      en: "Leave Earth and carbon management stops being one problem among many and becomes the whole game. A spacecraft is a tiny closed biosphere in which every breath of exhaled CO₂ must be scrubbed and, ideally, recycled into oxygen and food, or the crew dies; the air does not refresh itself because there is no planet beneath it doing the work for free. Scale that up and you arrive at the dream and the discipline of the closed ecological system — a sealed habitat that, like Biosphere 2, must balance its own carbon, water and nutrients with no outside help, and which has taught us mostly how breathtakingly hard the planet's free services are to replicate. Beyond the habitat lies the largest engineering proposal ever entertained: terraforming, the deliberate thickening of a dead world's atmosphere to make it breathe. Mars holds carbon dioxide frozen in its soil and caps; releasing it could warm the planet and begin a runaway greenhouse in reverse — using the very effect overheating Earth to resurrect a frozen one. The symmetry is the lesson. To make Mars livable, you would run a carbon cycle forward on purpose; to keep Earth livable, you must run ours back toward balance. Both demand the same mastery. A species that learns to regulate the carbon of a planet — to build, repair and steward a biosphere — has acquired the founding capability of a spacefaring civilization, and discovers that the skill it needs to settle the stars is the very skill it needs to not ruin the world it already has.",
      zh: "离开地球，碳管理便不再是诸多问题中的一个，而成了整盘棋。一艘飞船，是一个微小的、封闭的生物圈，在其中，每一口呼出的二氧化碳，都必须被洗涤，并且，理想地，被回收成氧气与食物，否则乘员将死去；空气不会自行更新，因为它下方，没有一颗行星在免费地做那活计。把这放大，你便抵达了封闭生态系统的梦想与纪律——一个密封的栖息地，它须像「生物圈二号」那样，在没有外界帮助的情况下，平衡它自己的碳、水与养分，而它教给我们的，多半是：这颗行星那些免费的服务，要复制起来，竟是何等令人窒息地困难。栖息地之外，横亘着有史以来被认真考虑过的、最大的工程提议：地球化——刻意地加厚一个死亡世界的大气，让它呼吸。火星，把二氧化碳冻结在它的土壤与极冠中；释放它，或可温暖那颗行星，并启动一场逆向的失控温室——用那个正令地球过热的效应，去复活一颗冰封的。这份对称，正是那一课。要让火星宜居，你须有意地、正向地运行一个碳循环；要让地球宜居，你须把我们的，倒转回平衡。两者，都要求同一种精通。一个学会调节一颗行星之碳的物种——去建造、修复并守护一个生物圈——便已获得了一个航天文明的、立身之能，并发现：它定居群星所需的技艺，恰恰就是它不去毁掉自己已拥有之世界所需的、那同一种技艺。",
    },
  },
  {
    num: "10", id: "unified",
    title: { en: "The Unified Planetary Carbon Model", zh: "统一的行星碳模型" },
    sub: { en: "One framework for the leaf, the smokestack, the capture plant, and the managed planet", zh: "为叶片、烟囱、捕获工厂与被管理的行星，提供同一个框架" },
    body: {
      en: "Stand far enough back and every chapter of this story is the same act performed at a different scale: moving carbon between the air, the life, the sea and the stone, and being judged by whether the books balance. A leaf does it in a second; a forest over a century; the geological cycle over a hundred million years; an industrial civilization, catastrophically, in two hundred. What changed with us is not that we entered the carbon cycle — every living thing is in it — but that we became, for the first time, an agent within it large enough to swing the whole balance, and conscious enough to know we are doing so. The unified model proposes that the carbon stability of any system — a habitat, a nation, a planet — can be read as the sum of eight capacities: how steady its atmospheric balance, how clean its energy, how much carbon its biology absorbs, how well its industry manages emissions, how intelligently it coordinates the whole, how much it can store in rock, how resilient its ecosystems remain, and how far ahead it is willing to plan. For four billion years the first four ran on their own and the last four did not exist. The entire significance of this moment is that a species has begun, clumsily and late, to supply the missing terms — to add management, intelligence, storage and foresight to a cycle that never had them. Carbon capture, read this way, is not pollution control. It is the opening move in civilization's attempt to take conscious responsibility for the metabolism of an entire planet.",
      zh: "站得足够远，这故事的每一章，都是同一桩行为，在不同尺度上的演出：在空气、生命、海洋与岩石之间搬运碳，并以「账是否平」来评判。一片叶子，用一秒去做它；一片森林，历经一个世纪；地质循环，历经一亿年；而一个工业文明，灾难性地，在两百年间。与我们一同改变的，不是我们「进入了」碳循环——每一个活物都在其中——而是我们头一次，成为了它内部的一个行动者，大到足以撼动整个平衡，又清醒到足以知道，我们正在如此做。这个统一模型提议：任何系统——一个栖息地、一个国家、一颗行星——的碳稳定性，都可被读作八种能力之和：它的大气平衡多么稳定、它的能源多么清洁、它的生物吸收多少碳、它的工业多么好地管理排放、它多么智慧地协调全局、它能在岩石中储存多少、它的生态系统保持多么有韧性，以及它愿意把计划做到多远的将来。有四十亿年，前四项自行运转，而后四项并不存在。这一刻全部的意义，正在于：一个物种，已经笨拙地、迟来地，开始去供应那些缺失的项——去为一个从未拥有它们的循环，添上管理、智能、储存与远见。以这种方式读，碳捕获不是污染控制。它是文明试图为一整颗行星的新陈代谢，承担起自觉责任的——那开局的一着。",
    },
  },
];

/* ============================================================
   SECTION 1 — carbon reservoirs + the flows between them
   (CarbonCycleEngine — the flagship)
   ============================================================ */
export type Reservoir = { key: string; name: Bi; store: number; unit: Bi; gloss: Bi; accent: string };
/** store in GtC (gigatonnes of carbon), order-of-magnitude. */
export const RESERVOIRS: Reservoir[] = [
  { key: "atmosphere", name: { en: "Atmosphere", zh: "大气" }, store: 875, unit: { en: "GtC", zh: "亿吨碳·十" }, gloss: { en: "the smallest, most sensitive account — the shared sky", zh: "最小、最敏感的账户——那片共享的天空" }, accent: "#37b6f6" },
  { key: "ocean", name: { en: "Ocean", zh: "海洋" }, store: 38000, unit: { en: "GtC", zh: "亿吨碳·十" }, gloss: { en: "the great reservoir — dissolved CO₂, the deep store", zh: "巨大的储库——溶解的二氧化碳，那深处的存量" }, accent: "#6cc6ff" },
  { key: "biosphere", name: { en: "Living biosphere", zh: "活的生物圈" }, store: 550, unit: { en: "GtC", zh: "亿吨碳·十" }, gloss: { en: "all plants, animals, microbes — carbon walking around", zh: "一切植物、动物、微生物——四处走动的碳" }, accent: "#2bd48b" },
  { key: "soil", name: { en: "Soil & permafrost", zh: "土壤与永冻土" }, store: 3700, unit: { en: "GtC", zh: "亿吨碳·十" }, gloss: { en: "more carbon than air and life combined — and thawing", zh: "比空气与生命之和还多的碳——而且正在解冻" }, accent: "#5ee6a8" },
  { key: "fossil", name: { en: "Fossil reserves", zh: "化石储量" }, store: 1200, unit: { en: "GtC", zh: "亿吨碳·十" }, gloss: { en: "buried sunlight — coal, oil, gas we are burning back", zh: "被埋藏的阳光——我们正焚烧回去的煤、油、气" }, accent: "#f5923c" },
  { key: "geologic", name: { en: "Rock & sediment", zh: "岩石与沉积" }, store: 100000000, unit: { en: "GtC", zh: "亿吨碳·十" }, gloss: { en: "the vast slow vault — limestone, the deep crust", zh: "那庞大而缓慢的金库——石灰岩、深处的地壳" }, accent: "#8798a6" },
];

/** carbon flows: from→to reservoir keys, with natural and human-added rates in GtC/yr. */
export type CarbonFlow = { from: string; to: string; name: Bi; natural: number; human: number; accent: string };
export const CARBON_FLOWS: CarbonFlow[] = [
  { from: "atmosphere", to: "biosphere", name: { en: "Photosynthesis", zh: "光合作用" }, natural: 120, human: 0, accent: "#2bd48b" },
  { from: "biosphere", to: "atmosphere", name: { en: "Respiration & decay", zh: "呼吸与分解" }, natural: 119, human: 0, accent: "#5ee6a8" },
  { from: "atmosphere", to: "ocean", name: { en: "Ocean uptake", zh: "海洋吸收" }, natural: 90, human: 2.5, accent: "#6cc6ff" },
  { from: "ocean", to: "atmosphere", name: { en: "Ocean outgassing", zh: "海洋释气" }, natural: 88, human: 0, accent: "#37b6f6" },
  { from: "fossil", to: "atmosphere", name: { en: "Fossil combustion", zh: "化石燃烧" }, natural: 0, human: 9.5, accent: "#f5923c" },
  { from: "biosphere", to: "atmosphere", name: { en: "Land-use change", zh: "土地利用变化" }, natural: 0, human: 1.5, accent: "#ffb368" },
  { from: "atmosphere", to: "geologic", name: { en: "Rock weathering", zh: "岩石风化" }, natural: 0.3, human: 0, accent: "#8798a6" },
  { from: "geologic", to: "atmosphere", name: { en: "Volcanism", zh: "火山活动" }, natural: 0.1, human: 0, accent: "#c5631a" },
];

/* ============================================================
   SECTION 2 — atmospheric CO₂ rise + emission sources
   ============================================================ */
export type Co2Point = { year: number; ppm: number; label: Bi; proj?: boolean };
export const CO2_CURVE: Co2Point[] = [
  { year: 1750, ppm: 278, label: { en: "Pre-industrial baseline", zh: "工业化前基线" } },
  { year: 1850, ppm: 285, label: { en: "Dawn of coal", zh: "煤的黎明" } },
  { year: 1900, ppm: 296, label: { en: "Electrification", zh: "电气化" } },
  { year: 1958, ppm: 315, label: { en: "Keeling begins measuring", zh: "基林开始测量" } },
  { year: 1980, ppm: 339, label: { en: "Climate alarm rises", zh: "气候警报升起" } },
  { year: 2000, ppm: 369, label: { en: "Globalized industry", zh: "全球化工业" } },
  { year: 2015, ppm: 401, label: { en: "Paris Agreement", zh: "巴黎协定" } },
  { year: 2024, ppm: 422, label: { en: "Today — and still rising", zh: "今天——且仍在上升" } },
  { year: 2050, ppm: 500, label: { en: "Projection if slow to act", zh: "若行动迟缓的推演" }, proj: true },
];

export type EmissionSource = { key: string; name: Bi; share: number; gloss: Bi; accent: string };
/** share of annual human CO₂ emissions, approximate. */
export const EMISSION_SOURCES: EmissionSource[] = [
  { key: "coal", name: { en: "Coal", zh: "煤" }, share: 27, gloss: { en: "power & heat — the densest, dirtiest fossil carbon", zh: "电力与供热——最密集、最脏的化石碳" }, accent: "#c5631a" },
  { key: "oil", name: { en: "Oil", zh: "石油" }, share: 22, gloss: { en: "transport — cars, ships, planes that move the world", zh: "交通——驱动世界的汽车、船舶、飞机" }, accent: "#f5923c" },
  { key: "gas", name: { en: "Natural gas", zh: "天然气" }, share: 17, gloss: { en: "power, heat, fertilizer — cleaner-burning, still carbon", zh: "电力、供热、化肥——燃烧更清洁，仍是碳" }, accent: "#ffb368" },
  { key: "industry", name: { en: "Cement & industry", zh: "水泥与工业" }, share: 12, gloss: { en: "chemistry itself emits CO₂ — calcining limestone", zh: "化学过程本身排放二氧化碳——石灰石煅烧" }, accent: "#ffce9c" },
  { key: "land", name: { en: "Land-use change", zh: "土地利用变化" }, share: 11, gloss: { en: "clearing forests releases the carbon they banked", zh: "砍伐森林，释放它们存入的碳" }, accent: "#5ee6a8" },
  { key: "agri", name: { en: "Agriculture", zh: "农业" }, share: 11, gloss: { en: "soils, livestock, machinery feeding eight billion", zh: "土壤、牲畜、机械，喂养八十亿人" }, accent: "#2bd48b" },
];

/* ============================================================
   SECTION 3 — climate feedback loops + radiation balance
   ============================================================ */
export type Feedback = { key: string; name: Bi; sign: "+" | "−" | "±"; strength: number; gloss: Bi; accent: string };
export const FEEDBACKS: Feedback[] = [
  { key: "watervapor", name: { en: "Water vapor", zh: "水汽" }, sign: "+", strength: 90, gloss: { en: "warmer air holds more vapor — itself a greenhouse gas", zh: "更暖的空气容纳更多水汽——而水汽本身就是温室气体" }, accent: "#f5923c" },
  { key: "icealbedo", name: { en: "Ice–albedo", zh: "冰—反照率" }, sign: "+", strength: 78, gloss: { en: "melting ice bares dark ocean that drinks more sunlight", zh: "融化的冰，露出畅饮阳光的深色海洋" }, accent: "#ffb368" },
  { key: "permafrost", name: { en: "Permafrost methane", zh: "永冻土甲烷" }, sign: "+", strength: 70, gloss: { en: "thawing tundra exhales a carbon bomb of CH₄ and CO₂", zh: "解冻的苔原，呼出一颗甲烷与二氧化碳的碳弹" }, accent: "#c5631a" },
  { key: "solubility", name: { en: "Ocean solubility", zh: "海洋溶解度" }, sign: "+", strength: 55, gloss: { en: "warmer seas hold less dissolved CO₂, releasing it back", zh: "更暖的海，溶解更少二氧化碳，把它释放回去" }, accent: "#6cc6ff" },
  { key: "sink", name: { en: "Sink saturation", zh: "碳汇饱和" }, sign: "+", strength: 50, gloss: { en: "land and sea soak up less as they fill — the free help fades", zh: "陆与海随着填满而吸纳更少——免费的帮助在消退" }, accent: "#ffce9c" },
  { key: "cloud", name: { en: "Cloud response", zh: "云的响应" }, sign: "±", strength: 40, gloss: { en: "clouds can warm or cool — the great uncertainty", zh: "云可致暖，亦可致冷——那巨大的不确定" }, accent: "#a9def8" },
  { key: "weathering", name: { en: "Rock weathering", zh: "岩石风化" }, sign: "−", strength: 30, gloss: { en: "the planet's slow thermostat — over a hundred thousand years", zh: "行星缓慢的恒温器——历经十万年" }, accent: "#2bd48b" },
  { key: "planck", name: { en: "Planck response", zh: "普朗克响应" }, sign: "−", strength: 65, gloss: { en: "a hotter body radiates more heat — the stabilizing baseline", zh: "更热的物体辐射更多热——那稳定的基线" }, accent: "#5ee6a8" },
];

/** climate sensitivity: ~3°C of warming per doubling of CO₂ from 278 ppm. */
export const CLIMATE_SENSITIVITY = 3.0;
export const PREINDUSTRIAL_PPM = 278;

/* ============================================================
   SECTION 4 — carbon removal architectures
   ============================================================ */
export type CaptureMethod = {
  key: string; name: Bi; family: Bi;
  cost: number; energy: number; durability: number; scalability: number;
  gloss: Bi; accent: string;
};
/** cost = US$/tCO₂ (order-of-magnitude, near-term); energy/durability/scalability are 0–100 illustrative scores.
    durability score reflects how long the carbon stays stored. */
export const CAPTURE_METHODS: CaptureMethod[] = [
  { key: "dac", name: { en: "Direct air capture", zh: "直接空气捕获" }, family: { en: "engineered", zh: "工程化" }, cost: 500, energy: 90, durability: 98, scalability: 70, gloss: { en: "machines sieve CO₂ from open air, then bury it as rock", zh: "机器从开放的空气中筛出二氧化碳，再把它埋成岩石" }, accent: "#37b6f6" },
  { key: "beccs", name: { en: "Bioenergy + capture", zh: "生物能源+捕获" }, family: { en: "hybrid", zh: "混合" }, cost: 150, energy: 55, durability: 95, scalability: 60, gloss: { en: "plants do the capturing; burning them yields power + CO₂ to store", zh: "植物负责捕获；焚烧它们产出电力与待储存的二氧化碳" }, accent: "#5ee6a8" },
  { key: "mineral", name: { en: "Mineralization", zh: "矿化" }, family: { en: "geologic", zh: "地质" }, cost: 120, energy: 45, durability: 99, scalability: 75, gloss: { en: "CO₂ reacts with basalt and turns to solid stone for millennia", zh: "二氧化碳与玄武岩反应，化为固态岩石，封存千年" }, accent: "#8798a6" },
  { key: "weathering", name: { en: "Enhanced weathering", zh: "强化风化" }, family: { en: "geologic", zh: "地质" }, cost: 100, energy: 35, durability: 96, scalability: 80, gloss: { en: "crushed rock spread on fields speeds a natural reaction", zh: "撒在田里的碎石，加速一个自然反应" }, accent: "#2bd48b" },
  { key: "ocean", name: { en: "Ocean alkalinity", zh: "海洋碱化" }, family: { en: "marine", zh: "海洋" }, cost: 120, energy: 40, durability: 90, scalability: 85, gloss: { en: "nudging the sea to drink more CO₂ — and counter acidification", zh: "轻推海水多喝二氧化碳——并抵消酸化" }, accent: "#6cc6ff" },
  { key: "biochar", name: { en: "Biochar", zh: "生物炭" }, family: { en: "biological", zh: "生物" }, cost: 100, energy: 30, durability: 70, scalability: 55, gloss: { en: "charred biomass locks carbon into soil for centuries", zh: "炭化的生物质，把碳锁进土壤数个世纪" }, accent: "#ffb368" },
  { key: "forest", name: { en: "Afforestation", zh: "造林" }, family: { en: "biological", zh: "生物" }, cost: 30, energy: 10, durability: 35, scalability: 50, gloss: { en: "cheap and vast — but reversible by fire, drought or the axe", zh: "廉价而辽阔——但可被火、旱或斧头逆转" }, accent: "#9af2cb" },
  { key: "soil", name: { en: "Soil carbon", zh: "土壤固碳" }, family: { en: "biological", zh: "生物" }, cost: 25, energy: 8, durability: 30, scalability: 60, gloss: { en: "better farming returns carbon to soils — until they are tilled", zh: "更好的耕作，把碳还给土壤——直到它们被翻耕" }, accent: "#2bd48b" },
];

/** the DAC pipeline stages — for the capture animation. */
export type DacStage = { key: string; name: Bi; gloss: Bi; accent: string };
export const DAC_PIPELINE: DacStage[] = [
  { key: "intake", name: { en: "Air intake", zh: "进气" }, gloss: { en: "fans pull huge volumes of ordinary air through the unit", zh: "风扇把巨量的普通空气吹过装置" }, accent: "#a9def8" },
  { key: "sorbent", name: { en: "Sorbent contact", zh: "吸附剂接触" }, gloss: { en: "a chemical filter grabs CO₂ and lets the rest pass", zh: "化学滤层抓住二氧化碳，放其余通过" }, accent: "#37b6f6" },
  { key: "desorb", name: { en: "Desorption", zh: "脱附" }, gloss: { en: "heat or vacuum frees a pure stream of CO₂", zh: "加热或抽真空，释放一股纯净的二氧化碳" }, accent: "#9a7dfa" },
  { key: "compress", name: { en: "Compression", zh: "压缩" }, gloss: { en: "the gas is squeezed to a dense, pipeline-ready fluid", zh: "气体被压成密实、可入管道的流体" }, accent: "#6cc6ff" },
  { key: "store", name: { en: "Geologic storage", zh: "地质封存" }, gloss: { en: "pumped a kilometre down to mineralize into rock", zh: "泵入地下一公里，矿化成岩石" }, accent: "#8798a6" },
];

/* ============================================================
   SECTION 5 — biological & oceanic carbon systems
   ============================================================ */
export type BioSystem = { key: string; name: Bi; capacity: number; durability: number; gloss: Bi; accent: string };
/** capacity & durability are 0–100 illustrative scores. */
export const BIO_SYSTEMS: BioSystem[] = [
  { key: "tropical", name: { en: "Tropical forests", zh: "热带森林" }, capacity: 92, durability: 55, gloss: { en: "the planet's lungs — vast uptake, vulnerable to fire and the axe", zh: "行星的肺——吸纳辽阔，却易受火与斧之害" }, accent: "#2bd48b" },
  { key: "peat", name: { en: "Peatlands & wetlands", zh: "泥炭地与湿地" }, capacity: 70, durability: 88, gloss: { en: "waterlogged carbon vaults — immense per hectare, ancient", zh: "被水浸泡的碳库——每公顷的存量惊人，且古老" }, accent: "#5ee6a8" },
  { key: "soil", name: { en: "Soil organic carbon", zh: "土壤有机碳" }, capacity: 95, durability: 60, gloss: { en: "the largest land store — built slowly, lost in one plough", zh: "陆地上最大的储库——缓慢积累，一犁尽失" }, accent: "#9af2cb" },
  { key: "blue", name: { en: "Mangroves & seagrass", zh: "红树林与海草" }, capacity: 55, durability: 85, gloss: { en: "'blue carbon' — coastal sinks that bury it in marine mud", zh: "「蓝碳」——把碳埋进海泥的、海岸碳汇" }, accent: "#6cc6ff" },
  { key: "kelp", name: { en: "Kelp & macroalgae", zh: "海带与大型藻" }, capacity: 65, durability: 50, gloss: { en: "fast-growing forests of the sea — farmable, sinkable", zh: "海里生长飞快的森林——可养殖、可沉降" }, accent: "#37b6f6" },
  { key: "plankton", name: { en: "Phytoplankton pump", zh: "浮游植物泵" }, capacity: 98, durability: 75, gloss: { en: "microscopic life that rains carbon into the deep ocean", zh: "把碳如雨般降入深海的、微观的生命" }, accent: "#a9def8" },
  { key: "biochar", name: { en: "Biochar (engineered)", zh: "生物炭（工程化）" }, capacity: 45, durability: 80, gloss: { en: "human-made char that stabilizes biological carbon", zh: "人造的炭，稳定了生物碳" }, accent: "#ffb368" },
];

/** the ocean biological pump — surface to deep. */
export type PumpStage = { name: Bi; gloss: Bi; accent: string };
export const OCEAN_PUMP: PumpStage[] = [
  { name: { en: "Surface fixation", zh: "表层固定" }, gloss: { en: "plankton fix CO₂ in the sunlit layer", zh: "浮游生物在阳光层固定二氧化碳" }, accent: "#a9def8" },
  { name: { en: "The biological rain", zh: "生物的雨" }, gloss: { en: "dead cells and pellets sink as 'marine snow'", zh: "死去的细胞与颗粒，如「海雪」般下沉" }, accent: "#6cc6ff" },
  { name: { en: "Deep sequestration", zh: "深海封存" }, gloss: { en: "carbon parked in cold water for centuries", zh: "碳，被停泊在冷水中数个世纪" }, accent: "#37b6f6" },
  { name: { en: "Burial in sediment", zh: "沉积埋藏" }, gloss: { en: "a fraction reaches the floor and becomes rock", zh: "一小部分抵达海底，化为岩石" }, accent: "#1f7fd6" },
];

/* ============================================================
   SECTION 6 — energy sources, carbon intensity, transition
   ============================================================ */
export type EnergySource = {
  key: string; name: Bi; intensity: number; share2024: number; share2050: number; gloss: Bi; accent: string;
};
/** intensity = gCO₂ per kWh, lifecycle. shares are illustrative % of primary energy. */
export const ENERGY_SOURCES: EnergySource[] = [
  { key: "coal", name: { en: "Coal", zh: "煤" }, intensity: 820, share2024: 26, share2050: 3, gloss: { en: "the dirtiest watt — first to fall", zh: "最脏的一瓦——最先退场" }, accent: "#c5631a" },
  { key: "oil", name: { en: "Oil", zh: "石油" }, intensity: 650, share2024: 30, share2050: 8, gloss: { en: "transport's fuel — slow to electrify fully", zh: "交通的燃料——完全电气化进展缓慢" }, accent: "#f5923c" },
  { key: "gas", name: { en: "Natural gas", zh: "天然气" }, intensity: 490, share2024: 23, share2050: 10, gloss: { en: "the bridge fuel — or the bridge that lasts too long", zh: "过渡的燃料——或一座停留过久的桥" }, accent: "#ffb368" },
  { key: "nuclear", name: { en: "Nuclear", zh: "核能" }, intensity: 12, share2024: 4, share2050: 12, gloss: { en: "dense, steady, near-zero carbon — and politically heavy", zh: "密集、稳定、近零碳——而政治上沉重" }, accent: "#9a7dfa" },
  { key: "hydro", name: { en: "Hydro", zh: "水电" }, intensity: 24, share2024: 6, share2050: 8, gloss: { en: "the old renewable — limited by geography", zh: "古老的可再生——受地理所限" }, accent: "#6cc6ff" },
  { key: "wind", name: { en: "Wind", zh: "风能" }, intensity: 11, share2024: 4, share2050: 22, gloss: { en: "cheapest new power in much of the world", zh: "世界许多地方最廉价的新电力" }, accent: "#a9def8" },
  { key: "solar", name: { en: "Solar", zh: "太阳能" }, intensity: 40, share2024: 5, share2050: 27, gloss: { en: "falling in cost faster than any energy in history", zh: "成本下降得比历史上任何能源都快" }, accent: "#37b6f6" },
  { key: "hydrogen", name: { en: "Hydrogen & e-fuels", zh: "氢与电制燃料" }, intensity: 5, share2024: 2, share2050: 10, gloss: { en: "clean storage for the hard-to-electrify industries", zh: "为难以电气化的行业，提供清洁的储能" }, accent: "#5ee6a8" },
];

/* ============================================================
   SECTION 7 — geoengineering interventions + risks
   ============================================================ */
export type GeoIntervention = {
  key: string; name: Bi; leverage: number; reversibility: number; risk: number; gloss: Bi; accent: string;
};
/** leverage/reversibility/risk are 0–100 illustrative scores. high reversibility = easier to undo. */
export const GEO_INTERVENTIONS: GeoIntervention[] = [
  { key: "sai", name: { en: "Stratospheric aerosols", zh: "平流层气溶胶" }, leverage: 95, reversibility: 40, risk: 88, gloss: { en: "a sulfate veil mimicking a volcano — cheap, fast, fraught", zh: "一层模仿火山的硫酸盐面纱——廉价、迅速、充满隐患" }, accent: "#9a7dfa" },
  { key: "mcb", name: { en: "Marine cloud brightening", zh: "海洋云增亮" }, leverage: 60, reversibility: 80, risk: 55, gloss: { en: "sea-salt spray makes clouds whiter and more reflective", zh: "海盐喷雾，让云更白、更能反射" }, accent: "#6cc6ff" },
  { key: "cirrus", name: { en: "Cirrus thinning", zh: "卷云削薄" }, leverage: 50, reversibility: 75, risk: 60, gloss: { en: "seeding high clouds to let more heat escape to space", zh: "为高云播种，让更多热量逃向太空" }, accent: "#a9def8" },
  { key: "sunshade", name: { en: "Space sunshade", zh: "太空遮阳" }, leverage: 85, reversibility: 30, risk: 50, gloss: { en: "orbital mirrors or dust at the Earth–Sun L1 point", zh: "位于日地 L1 点的轨道反射镜或尘埃" }, accent: "#37b6f6" },
  { key: "albedo", name: { en: "Surface albedo", zh: "地表反照率" }, leverage: 30, reversibility: 90, risk: 25, gloss: { en: "reflective roofs and crops — modest, safe, local", zh: "反光的屋顶与作物——温和、安全、局部" }, accent: "#5ee6a8" },
  { key: "iron", name: { en: "Ocean fertilization", zh: "海洋施肥" }, leverage: 45, reversibility: 50, risk: 70, gloss: { en: "iron dust to bloom plankton — uncertain, ecologically risky", zh: "铁尘催发浮游生物——不确定，生态上有风险" }, accent: "#2bd48b" },
];

export type GeoRisk = { name: Bi; gloss: Bi };
export const GEO_RISKS: GeoRisk[] = [
  { name: { en: "Termination shock", zh: "终止冲击" }, gloss: { en: "stop abruptly and the masked warming returns at once", zh: "骤然停止，被掩盖的变暖一次性归来" } },
  { name: { en: "Governance", zh: "治理" }, gloss: { en: "who sets the thermostat of a shared planet?", zh: "谁来设定一颗共享行星的恒温器？" } },
  { name: { en: "Regional disruption", zh: "区域扰动" }, gloss: { en: "cooling one place can parch or flood another", zh: "为一处降温，可能令另一处干涸或淹没" } },
  { name: { en: "Moral hazard", zh: "道德风险" }, gloss: { en: "a cheap shade may license us to keep emitting", zh: "一层廉价的荫蔽，或许准许我们继续排放" } },
];

/* ============================================================
   SECTION 8 — AI climate roles + autonomy ladder
   ============================================================ */
export type AiRole = { key: string; name: Bi; gloss: Bi; accent: string };
export const AI_ROLES: AiRole[] = [
  { key: "mrv", name: { en: "Carbon accounting", zh: "碳核算" }, gloss: { en: "measure, report, verify emissions plume by plume from orbit", zh: "从轨道上一缕一缕地测量、报告、核实排放" }, accent: "#37b6f6" },
  { key: "twin", name: { en: "Earth digital twin", zh: "地球数字孪生" }, gloss: { en: "a simulation detailed enough to rehearse a policy first", zh: "一个精细到能先行演练政策的模拟" }, accent: "#9a7dfa" },
  { key: "forecast", name: { en: "Climate forecasting", zh: "气候预测" }, gloss: { en: "physics compressed into models that run in minutes", zh: "被压缩进可在分钟内运行的模型的物理" }, accent: "#6cc6ff" },
  { key: "grid", name: { en: "Grid balancing", zh: "电网平衡" }, gloss: { en: "matching clean power to demand around sun and wind", zh: "围绕日照与风，让清洁电力匹配需求" }, accent: "#5ee6a8" },
  { key: "materials", name: { en: "Materials discovery", zh: "材料发现" }, gloss: { en: "searching chemical space for better sorbents & catalysts", zh: "在化学空间里搜寻更好的吸附剂与催化剂" }, accent: "#b89dff" },
  { key: "monitor", name: { en: "Ecosystem monitoring", zh: "生态监测" }, gloss: { en: "watching forests, reefs and ice for collapse in real time", zh: "实时监视森林、珊瑚礁与冰，以防崩溃" }, accent: "#2bd48b" },
];

export type AiLayer = { key: string; level: string; name: Bi; gloss: Bi; accent: string };
export const AI_LAYERS: AiLayer[] = [
  { key: "sense", level: "L0", name: { en: "Sensing", zh: "感知" }, gloss: { en: "satellites and sensors merely measure the planet", zh: "卫星与传感器，仅仅测量这颗行星" }, accent: "#a9def8" },
  { key: "account", level: "L1", name: { en: "Accounting", zh: "核算" }, gloss: { en: "quantify and verify every flow of carbon", zh: "量化并核实每一道碳的流动" }, accent: "#6cc6ff" },
  { key: "model", level: "L2", name: { en: "Modeling", zh: "建模" }, gloss: { en: "a digital twin simulates the Earth system", zh: "一个数字孪生，模拟地球系统" }, accent: "#37b6f6" },
  { key: "forecast", level: "L3", name: { en: "Forecasting", zh: "预测" }, gloss: { en: "predict outcomes and advise human decisions", zh: "预测结果，并为人类的决策提供建议" }, accent: "#9a7dfa" },
  { key: "optimize", level: "L4", name: { en: "Optimization", zh: "优化" }, gloss: { en: "actively dispatch capture and balance sinks", zh: "主动调度捕获，并平衡碳汇" }, accent: "#b89dff" },
  { key: "steward", level: "L5", name: { en: "Autonomous stewardship", zh: "自主守护" }, gloss: { en: "a closed loop regulating a planet's carbon unattended", zh: "一个无需照看、调节着行星之碳的闭环" }, accent: "#d7c8ff" },
];

/* ============================================================
   SECTION 9 — closed-biosphere stages + futures grid
   ============================================================ */
export type BiosphereStage = { key: string; name: Bi; scope: Bi; gloss: Bi; accent: string };
export const BIOSPHERE_STAGES: BiosphereStage[] = [
  { key: "craft", name: { en: "Spacecraft scrubbers", zh: "飞船洗涤器" }, scope: { en: "a crew of three", zh: "三人乘组" }, gloss: { en: "every exhaled breath of CO₂ chemically removed by hand", zh: "每一口呼出的二氧化碳，被化学地、手动地移除" }, accent: "#a9def8" },
  { key: "closed", name: { en: "Closed habitat", zh: "封闭栖息地" }, scope: { en: "a sealed building", zh: "一栋密封的建筑" }, gloss: { en: "Biosphere-2: balance your own air, or suffocate", zh: "生物圈二号：平衡你自己的空气，否则窒息" }, accent: "#6cc6ff" },
  { key: "base", name: { en: "Lunar / Mars base", zh: "月球/火星基地" }, scope: { en: "a settlement", zh: "一个定居点" }, gloss: { en: "recycle carbon, water and food in a hostile vacuum", zh: "在充满敌意的真空中，回收碳、水与食物" }, accent: "#37b6f6" },
  { key: "dome", name: { en: "Domed city", zh: "穹顶城市" }, scope: { en: "thousands", zh: "数千人" }, gloss: { en: "an engineered atmosphere for a town under glass", zh: "为玻璃之下的市镇，工程出一片大气" }, accent: "#9a7dfa" },
  { key: "terraform", name: { en: "Partial terraforming", zh: "部分地球化" }, scope: { en: "a planet's region", zh: "一颗行星的区域" }, gloss: { en: "release frozen CO₂ to thicken and warm a dead sky", zh: "释放冻结的二氧化碳，加厚并温暖一片死亡的天空" }, accent: "#b89dff" },
  { key: "biosphere", name: { en: "Full biosphere", zh: "完整生物圈" }, scope: { en: "a whole world", zh: "一整个世界" }, gloss: { en: "a self-running carbon cycle on a once-barren planet", zh: "一颗曾贫瘠的行星上，自行运转的碳循环" }, accent: "#d7c8ff" },
];

export type Future = { name: Bi; horizon: Bi; desc: Bi; accent: string };
export const FUTURES: Future[] = [
  { name: { en: "Carbon as currency", zh: "碳即货币" }, horizon: { en: "near", zh: "近期" }, desc: { en: "Every tonne emitted or removed carries a price, and markets begin to reward repair over extraction.", zh: "每一吨被排放或被移除的碳都带着价格，市场开始奖赏修复、而非开采。" }, accent: "#37b6f6" },
  { name: { en: "Gigatonne removal", zh: "吉吨级移除" }, horizon: { en: "near", zh: "近期" }, desc: { en: "Capture plants scale from thousands to billions of tonnes — a new heavy industry built to run the cycle backward.", zh: "捕获工厂从数千吨扩展到数十亿吨——一个为倒转循环而建的新重工业。" }, accent: "#9a7dfa" },
  { name: { en: "Planetary digital twin", zh: "行星数字孪生" }, horizon: { en: "mid", zh: "中期" }, desc: { en: "A live, high-resolution simulation of Earth's carbon system, accurate enough to test interventions before reality does.", zh: "一个实时、高分辨率的地球碳系统模拟，精确到能在现实之前先行检验干预。" }, accent: "#6cc6ff" },
  { name: { en: "Autonomous biosphere", zh: "自主生物圈" }, horizon: { en: "mid", zh: "中期" }, desc: { en: "Sensors, capture and AI fuse into a self-regulating ecological layer that stabilizes sinks without a human in the loop.", zh: "传感器、捕获与 AI 熔合为一个自我调节的生态层，无需人类参与回路便稳定碳汇。" }, accent: "#2bd48b" },
  { name: { en: "Off-world carbon craft", zh: "地外碳工艺" }, horizon: { en: "far", zh: "远期" }, desc: { en: "Closed life-support and terraforming make carbon management the founding trade of every settlement beyond Earth.", zh: "封闭的生命支持与地球化，让碳管理成为地球之外每一个定居点的、立身之技。" }, accent: "#b89dff" },
  { name: { en: "Conscious planet", zh: "自觉的行星" }, horizon: { en: "far", zh: "远期" }, desc: { en: "Civilization holds a planet's metabolism deliberately steady — the carbon cycle, for the first time, with an author.", zh: "文明刻意地稳住一颗行星的新陈代谢——碳循环，头一次，有了一位作者。" }, accent: "#d7c8ff" },
];

/* ============================================================
   SECTION 10 — the unified planetary-carbon-stability model (8 terms)
   ============================================================ */
export type Capacity = { sym: string; name: Bi; gloss: Bi; natural: number; industrial: number; managed: number };
export const CAPACITIES: Capacity[] = [
  { sym: "A", name: { en: "Atmospheric balance", zh: "大气平衡" }, gloss: { en: "how steady the CO₂ concentration is held", zh: "二氧化碳浓度被维持得多么稳定" }, natural: 92, industrial: 34, managed: 82 },
  { sym: "E", name: { en: "Energy efficiency", zh: "能源效率" }, gloss: { en: "how much work civilization gets per unit of carbon", zh: "文明每单位碳获得多少有用的功" }, natural: 70, industrial: 30, managed: 90 },
  { sym: "B", name: { en: "Biological absorption", zh: "生物吸收" }, gloss: { en: "how much carbon the living biosphere soaks up", zh: "活的生物圈吸纳了多少碳" }, natural: 95, industrial: 48, managed: 85 },
  { sym: "M", name: { en: "Industrial management", zh: "工业管理" }, gloss: { en: "how well emissions are captured at the source", zh: "排放在源头被捕获得多么彻底" }, natural: 80, industrial: 15, managed: 90 },
  { sym: "C", name: { en: "AI coordination", zh: "AI 协调" }, gloss: { en: "how intelligently the whole cycle is measured and steered", zh: "整个循环被多么智慧地测量与导航" }, natural: 5, industrial: 20, managed: 95 },
  { sym: "G", name: { en: "Geologic storage", zh: "地质储存" }, gloss: { en: "how much carbon is locked durably into rock", zh: "多少碳被持久地锁进岩石" }, natural: 40, industrial: 10, managed: 88 },
  { sym: "R", name: { en: "Ecological resilience", zh: "生态韧性" }, gloss: { en: "how well ecosystems absorb shocks without collapsing", zh: "生态系统在不崩溃的前提下吸收冲击的能力" }, natural: 90, industrial: 45, managed: 78 },
  { sym: "P", name: { en: "Long-term planning", zh: "长期规划" }, gloss: { en: "how far ahead the system is willing to look", zh: "系统愿意把目光投向多远的将来" }, natural: 30, industrial: 25, managed: 92 },
];

/* ============================================================
   RECURSIVE ENGINE — the same carbon-move at every scale
   ============================================================ */
export type RecursionLayer = { k: string; name: Bi; scale: Bi; move: Bi; color: string };
export const RECURSION_LAYERS: RecursionLayer[] = [
  { k: "photosynthesis", name: { en: "Photosynthesis", zh: "光合作用" }, scale: { en: "one leaf", zh: "一片叶子" }, move: { en: "a single leaf welds CO₂ and sunlight into sugar — carbon captured, one molecule at a time.", zh: "一片叶子，把二氧化碳与阳光焊成糖——碳被捕获，一次一个分子。" }, color: "#2bd48b" },
  { k: "organism", name: { en: "The organism", zh: "生物个体" }, scale: { en: "one tree", zh: "一棵树" }, move: { en: "a tree stockpiles decades of captured carbon in wood — a slow, living vault.", zh: "一棵树，把数十年捕获的碳，囤积在木质中——一座缓慢、活着的库。" }, color: "#5ee6a8" },
  { k: "ecosystem", name: { en: "The ecosystem", zh: "生态系统" }, scale: { en: "a forest", zh: "一片森林" }, move: { en: "forest, soil and wetland together hold a balance that breathes with the seasons.", zh: "森林、土壤与湿地，共同维持一个随季节呼吸的平衡。" }, color: "#9af2cb" },
  { k: "geochemical", name: { en: "Geochemical cycle", zh: "地球化学循环" }, scale: { en: "the planet, natural", zh: "自然态的行星" }, move: { en: "rock weathering and burial regulate CO₂ over a hundred million years — Earth's slow thermostat.", zh: "岩石的风化与埋藏，在一亿年间调节二氧化碳——地球缓慢的恒温器。" }, color: "#6cc6ff" },
  { k: "preindustrial", name: { en: "Land management", zh: "土地管理" }, scale: { en: "an agrarian society", zh: "一个农耕社会" }, move: { en: "fire, farming and herding nudge the carbon of a landscape — the first human hand on the cycle.", zh: "火、耕作与放牧，轻推一片地景的碳——人类落在循环上的、第一只手。" }, color: "#ffb368" },
  { k: "industrial", name: { en: "Industrial combustion", zh: "工业燃烧" }, scale: { en: "a civilization", zh: "一个文明" }, move: { en: "buried carbon is dug up and burned faster than the planet can rebury it — the balance breaks.", zh: "被埋藏的碳被掘出、焚烧，比行星能重新埋藏的更快——平衡破裂。" }, color: "#f5923c" },
  { k: "accounting", name: { en: "Carbon accounting", zh: "碳核算" }, scale: { en: "a global economy", zh: "一个全球经济" }, move: { en: "the cycle is measured and priced — civilization's first conscious feedback on its own metabolism.", zh: "循环被测量、被定价——文明对自身新陈代谢的、第一次自觉的反馈。" }, color: "#37b6f6" },
  { k: "engineered", name: { en: "Engineered capture", zh: "工程化捕获" }, scale: { en: "an industry of repair", zh: "一个修复的产业" }, move: { en: "machines, rock and biomass deliberately pull carbon back down — the cycle, run in reverse.", zh: "机器、岩石与生物质，刻意地把碳拉回——循环，被倒转运行。" }, color: "#1f7fd6" },
  { k: "ai", name: { en: "AI-coordinated planet", zh: "AI 协调的行星" }, scale: { en: "an Earth system", zh: "一个地球系统" }, move: { en: "a digital twin senses, predicts and dispatches — carbon stewarded like a body's autonomic breath.", zh: "一个数字孪生，去感知、预测、调度——碳被守护，如一具身体自主的呼吸。" }, color: "#9a7dfa" },
  { k: "biosphere", name: { en: "Closed biospheres", zh: "封闭生物圈" }, scale: { en: "a habitat off-world", zh: "一个地外栖息地" }, move: { en: "in a sealed world, every gram of carbon must be balanced by hand — the cycle, made fully artificial.", zh: "在一个密封的世界里，每一克碳都须被手动平衡——循环，被造得彻底人工。" }, color: "#b89dff" },
  { k: "planetary", name: { en: "Planetary stewardship", zh: "行星守护" }, scale: { en: "a civilization, deliberate", zh: "一个自觉的文明" }, move: { en: "sensors, capture, biology and intelligence fuse into one system holding a planet's metabolism steady on purpose.", zh: "传感器、捕获、生物与智能，熔合为一个系统，有意地稳住一颗行星的新陈代谢。" }, color: "#a9def8" },
];

/* ============================================================
   SECTION 10 — open questions
   ============================================================ */
export type BigQ = { q: Bi; lens: { en: string } };
export const BIG_QUESTIONS: BigQ[] = [
  { q: { en: "Is the carbon cycle a planetary thermostat civilization broke by accident?", zh: "碳循环，是否一个被文明意外打破的行星恒温器？" }, lens: { en: "Earth-system science · the balance we did not know we were keeping" } },
  { q: { en: "Can carbon removal scale to gigatonnes without becoming its own industry of harm?", zh: "碳移除能否扩展到吉吨级，而不沦为它自己的、一个有害的产业？" }, lens: { en: "Thermodynamics · land · energy · the cost of running the cycle backward" } },
  { q: { en: "Does geoengineering buy us time, or license us to keep emitting?", zh: "地球工程是为我们争取时间，还是准许我们继续排放？" }, lens: { en: "Solar management · moral hazard · the thermostat with no owner" } },
  { q: { en: "When AI manages the climate, who decides the setpoint of the planet?", zh: "当 AI 管理气候，谁来决定这颗行星的设定值？" }, lens: { en: "Autonomous systems · alignment · governance of a shared sky" } },
  { q: { en: "Is a growing economy that cools the planet a contradiction, or the only stable kind?", zh: "一个让行星冷却的增长经济，是矛盾，还是唯一稳定的那一种？" }, lens: { en: "Carbon-negative economics · decoupling growth from combustion" } },
  { q: { en: "If we could terraform Mars, why can we not yet steward Earth?", zh: "倘若我们能地球化火星，为何我们还不能守护地球？" }, lens: { en: "Planetary engineering · the skill to settle stars is the skill to keep home" } },
];

/* ============================================================
   AI LAYER — the Carbon Analyst: six lenses on the deep questions
   ============================================================ */
export type AnalystLens = { key: string; role: Bi; blurb: Bi; accent: string };
export const ANALYST_LENSES: AnalystLens[] = [
  { key: "climate", role: { en: "Climate scientist", zh: "气候科学家" }, blurb: { en: "the carbon cycle, forcing, feedbacks", zh: "碳循环、辐射强迫、反馈" }, accent: "#37b6f6" },
  { key: "atmos", role: { en: "Atmospheric analyst", zh: "大气分析者" }, blurb: { en: "chemistry, concentration, the thin shared sky", zh: "化学、浓度、那片单薄的共享天空" }, accent: "#6cc6ff" },
  { key: "energy", role: { en: "Energy strategist", zh: "能源策略家" }, blurb: { en: "fuels, grids, the cost of clean power", zh: "燃料、电网、清洁电力的成本" }, accent: "#f5923c" },
  { key: "engineer", role: { en: "Ecological engineer", zh: "生态工程师" }, blurb: { en: "capture, sinks, biology, durability", zh: "捕获、碳汇、生物、持久性" }, accent: "#2bd48b" },
  { key: "modeler", role: { en: "Planetary modeler", zh: "行星建模者" }, blurb: { en: "Earth-system dynamics, tipping points, scale", zh: "地球系统动力学、临界点、尺度" }, accent: "#9a7dfa" },
  { key: "civ", role: { en: "Sustainability theorist", zh: "可持续性理论家" }, blurb: { en: "the long arc, metabolism, civilization", zh: "长程弧线、新陈代谢、文明" }, accent: "#a9def8" },
];

export type AnalystTopic = { key: string; q: Bi; views: { lens: string; text: Bi }[] };
export const ANALYST_TOPICS: AnalystTopic[] = [
  {
    key: "what-is-cycle",
    q: { en: "What is the carbon cycle, really?", zh: "碳循环，究竟是什么？" },
    views: [
      { lens: "climate", text: { en: "It is the planet's bookkeeping. Carbon moves continuously between four reservoirs — the atmosphere, the ocean, living things, and rock — and for most of Earth's history the flows in and out of the air were nearly equal. Roughly a hundred billion tonnes cycle between sky, sea and life each year; what makes the modern era unique is not the size of our addition but that it is one-directional, and lands in the smallest, most sensitive reservoir.", zh: "它是行星的记账。碳在四个储库——大气、海洋、活物与岩石——之间持续移动，而在地球历史的大部分时间里，进出空气的流量几近相等。每年约有一千亿吨在天、海、生命之间循环；让现代独一无二的，不是我们添加的量，而是它是单向的，并落入了那个最小、最敏感的储库。" } },
      { lens: "atmos", text: { en: "Look only at the air and the story sharpens. The atmosphere holds the least carbon of any reservoir, which is exactly why it is the dial: a flow that barely dents the ocean visibly moves the sky. We have raised CO₂ from 278 to over 420 parts per million — a 50% increase in the thinnest, most consequential layer of the system, and the one every other reservoir is now scrambling to re-balance.", zh: "只看空气，故事便锐利起来。大气，是所有储库中含碳最少的，而这恰恰是它之所以是那个旋钮的原因：一道几乎不会让海洋显眼地凹陷的流量，却能明显地撼动天空。我们已把二氧化碳从百万分之二百七十八，抬到四百二十以上——在这系统中最薄、最举足轻重的一层里，增加了百分之五十，而其余每一个储库，如今都在手忙脚乱地重新平衡它。" } },
      { lens: "civ", text: { en: "Read at civilizational scale, the carbon cycle is the metabolism of a living planet — the slow exchange of matter and energy that keeps a biosphere alive. Every culture has lived inside it without naming it. What is new is that one species has grown large enough to perturb the whole metabolism and, only just now, conscious enough to see the ledger it was always part of.", zh: "在文明的尺度上读，碳循环，是一颗活着的行星的新陈代谢——那让一个生物圈存活的、物质与能量的缓慢交换。每一种文化都活在它之中，却未曾为它命名。新鲜的是：一个物种已长得大到足以扰动整个新陈代谢，而仅仅是此刻，才清醒到足以看见，那本它一直身处其中的账。" } },
    ],
  },
  {
    key: "why-broke",
    q: { en: "Why did industrialization break the balance?", zh: "工业化为何打破了平衡？" },
    views: [
      { lens: "energy", text: { en: "Because the cheapest energy we ever found was fire, and the cheapest fuel was carbon the planet had spent three hundred million years burying. Coal, oil and gas are concentrated ancient sunlight; burning them is the single most powerful, scalable trick civilization has — and its by-product is exactly the gas the slow cycle had been removing. We did not set out to change the sky. We set out to do work, and the sky was the exhaust pipe.", zh: "因为我们找到过的最廉价的能量是火，而最廉价的燃料，是行星花了三亿年去埋藏的碳。煤、石油与天然气，是被浓缩的远古阳光；焚烧它们，是文明拥有的、最强大、最可扩展的一招——而它的副产品，恰恰是那缓慢的循环一直在移除的气体。我们并非存心要改变天空。我们存心要做功，而天空，是那根排气管。" } },
      { lens: "atmos", text: { en: "It is a problem of rate, not of kind. Volcanoes emit CO₂; so do forests and oceans. The cycle copes with vast flows because they are balanced and slow. Industrial combustion releases in two centuries what burial accumulated over tens of millions of years — perhaps a hundred times faster than the natural sinks can draw it back down. The balance did not break because we added carbon; it broke because we added it faster than the planet can file it away.", zh: "这是速率的问题，而非种类的问题。火山排放二氧化碳；森林与海洋也是。循环能应付巨大的流量，是因为它们平衡而缓慢。工业燃烧，在两个世纪里释放出埋藏历经数千万年所积累之物——或许比自然碳汇能把它拉回的速度，快上一百倍。平衡之所以破裂，不是因为我们添加了碳；而是因为我们添加它的速度，快过了行星能把它归档的速度。" } },
      { lens: "modeler", text: { en: "And the system does not respond linearly. Push it gently and feedbacks amplify the push: water vapor, melting ice, thawing permafrost, saturating sinks. A model of Earth is not a thermostat that gently corrects but a landscape of basins — stable states separated by tipping points. Industrial carbon did not just warm the world by a fixed amount; it nudged a nonlinear system toward edges we cannot see clearly and cannot easily walk back from.", zh: "而系统的响应并非线性。轻轻推它，反馈便放大那一推：水汽、融化的冰、解冻的永冻土、饱和的碳汇。一个地球的模型，不是一个温柔自我修正的恒温器，而是一片由盆地构成的地景——被一个个临界点分隔的稳定态。工业的碳，不只是把世界暖了一个固定的量；它把一个非线性的系统，朝着我们看不清、也无法轻易走回的边缘，推了一把。" } },
    ],
  },
  {
    key: "can-scale",
    q: { en: "Can carbon capture actually scale to planetary level?", zh: "碳捕获真能扩展到行星级吗？" },
    views: [
      { lens: "engineer", text: { en: "Physically, yes — but the numbers are sobering. Humanity emits about forty billion tonnes of CO₂ a year; today's engineered removal is in the low millions. To matter, capture must grow by a factor of thousands, becoming a heavy industry larger than oil. Each method trades cost against permanence: forests are cheap but reversible; direct air capture is durable but energy-hungry; mineralization is near-permanent but slow. The honest answer is that no single method scales alone — only a portfolio does, and only if cutting emissions does the heavy lifting first.", zh: "在物理上，能——但那些数字令人清醒。人类每年排放约四百亿吨二氧化碳；而今天工程化的移除，仅在数百万吨这一量级。要起作用，捕获必须增长数千倍，成为一个比石油还庞大的重工业。每一种方法，都在成本与持久性之间权衡：森林廉价却可逆；直接空气捕获持久却耗能；矿化近乎永久却缓慢。诚实的答案是：没有任何单一方法能独自扩展——只有一个组合能，而且，只有在削减排放先挑起重担的前提下。" } },
      { lens: "energy", text: { en: "The binding constraint is energy. Separating a gas that is 0.04% of the air costs work by the laws of thermodynamics, and if that work comes from fossil power the cure emits more than it captures. So planetary-scale removal is really a bet on cheap, abundant clean energy — it is downstream of the energy transition, not a substitute for it. Build out enough zero-carbon power and removal becomes feasible; without it, the arithmetic never closes.", zh: "那个约束性的限制，是能量。分离一种仅占空气百分之零点零四的气体，依热力学定律就要耗费功，而若那功来自化石电力，这剂解药排放的，便多过它捕获的。所以行星级的移除，其实是一场关于廉价、充裕的清洁能源的赌注——它在能源转型的下游，而非它的替代品。建起足够多的零碳电力，移除便变得可行；没有它，那道算术，永远算不平。" } },
      { lens: "civ", text: { en: "Scale is also a question of incentive. The atmosphere is a commons; removal is a service with diffuse benefits and concentrated costs, which markets ignore until carbon carries a price. The deepest barrier is not the chemistry but the accounting: a civilization will only run the cycle backward at scale once it has decided, collectively, that putting carbon away is worth paying for. That decision, not the technology, is the bottleneck.", zh: "规模，也是一个激励的问题。大气，是一片公地；移除，是一项收益弥散、成本集中的服务，而在碳带上价格之前，市场对它视而不见。最深的障碍，不是化学，而是记账：一个文明，只有在它集体地决定「把碳收起来值得付钱」之后，才会大规模地倒转那个循环。那个决定，而非那项技术，才是瓶颈。" } },
    ],
  },
  {
    key: "geo-wisdom",
    q: { en: "Is geoengineering wisdom or hubris?", zh: "地球工程，是智慧还是傲慢？" },
    views: [
      { lens: "modeler", text: { en: "Both, depending on how it is done and who decides. The physics of solar management is sound — a sulfate veil would cool the planet, fast and cheap. But it treats a symptom, not the cause: it does nothing for ocean acidification, it shifts rainfall in ways that punish some regions, and it builds a dangerous dependency — stop suddenly and the masked warming returns all at once. It is a tourniquet, not a cure: it can buy time, or it can let the wound fester unattended.", zh: "两者皆是，取决于如何去做、由谁来定。太阳管理的物理是成立的——一层硫酸盐面纱，会为行星降温，又快又廉。但它治的是症状，而非病因：它对海洋酸化无能为力，它以惩罚某些区域的方式改变降雨，并建立起一种危险的依赖——一旦骤然停止，被掩盖的变暖便一次性归来。它是一根止血带，而非一剂解药：它能争取时间，也能让伤口无人照看地化脓。" } },
      { lens: "civ", text: { en: "The hubris is not in the technology but in the politics it implies. Solar management is so cheap that a single nation, or a lone actor, could do it unilaterally — setting the temperature of a planet that belongs to everyone. There is no thermostat we all agree to, no liability when a monsoon fails. Wisdom here would mean building the governance before the capability is used, and humility would mean treating it as the option of last resort, not first convenience.", zh: "那份傲慢，不在技术里，而在它所隐含的政治里。太阳管理如此廉价，以至于一个国家，或一个孤身的行动者，便能单方面去做——为一颗属于所有人的行星设定温度。没有一个我们共同认可的恒温器，没有一份「当季风失灵时」的担责。此处的智慧，将意味着在能力被动用之前，先建起治理；而谦卑，将意味着把它视作最后的手段，而非首选的便利。" } },
      { lens: "climate", text: { en: "Frame it honestly and the dilemma clarifies. Geoengineering and carbon removal are not rivals: one masks warming, the other removes its cause. The danger is the moral hazard — that a cheap shade lets us postpone the hard work of cutting emissions, leaving a planet both still-acidifying and now dependent on a veil it dares not lift. Used as a bridge while we decarbonize, it may be wise; used as a permit to keep burning, it is hubris with a delayed bill.", zh: "诚实地框定它，两难便清晰了。地球工程与碳移除，并非对手：一个掩盖变暖，另一个移除其病因。危险，在于那道德风险——一层廉价的荫蔽，让我们得以推迟削减排放的苦工，留下一颗既仍在酸化、又如今依赖于一层它不敢揭开之面纱的行星。把它当作我们脱碳时的一座桥来用，或许是智慧；把它当作继续燃烧的许可证来用，则是一份延期付款的傲慢。" } },
    ],
  },
  {
    key: "metabolism",
    q: { en: "Is carbon management civilization regulating its own metabolism?", zh: "碳管理，是文明在调节它自己的新陈代谢吗？" },
    views: [
      { lens: "civ", text: { en: "That is the deepest reading of the whole subject. A body regulates its own chemistry without conscious thought; a civilization, until now, has not. We burned, built and grew while the planet's slow cycle absorbed the consequences for free. Carbon management is the moment a species begins to do deliberately what the biosphere did automatically — to take the metabolism of its world off autopilot and onto a control surface. Whether we are ready for that responsibility is the open question of the century.", zh: "那是这整个主题最深的一种读法。一具身体，无需自觉的思考便调节它自己的化学；而一个文明，直到此刻，都不曾如此。我们燃烧、建造、增长，而行星缓慢的循环，免费地吸收了那些后果。碳管理，是一个物种开始去刻意地做那生物圈曾自动去做之事的、那一刻——把它世界的新陈代谢，从自动驾驶，切到一个控制台上。我们是否准备好承担那份责任，是本世纪悬而未决的问题。" } },
      { lens: "modeler", text: { en: "The metaphor is exact in a useful way. Metabolism is the regulated flow of carbon and energy through a system to keep it far from equilibrium — alive. The unified model reads planetary carbon stability as eight coupled terms: atmospheric balance, clean energy, biological uptake, industrial management, intelligent coordination, geologic storage, ecological resilience and long-term planning. For four billion years the first terms ran alone. We are clumsily adding the rest.", zh: "这个比喻，以一种有用的方式精确。新陈代谢，是碳与能量穿过一个系统的、被调节的流动，以让它远离平衡——即活着。统一模型，把行星碳稳定性读作八个耦合的项：大气平衡、清洁能源、生物吸收、工业管理、智能协调、地质储存、生态韧性，与长期规划。有四十亿年，前面那些项独自运转。而我们，正笨拙地添上其余的。" } },
      { lens: "engineer", text: { en: "And like any metabolism, it can be regulated well or badly. A healthy body holds its chemistry in a narrow band; a sick one overshoots and crashes. The engineering goal is homeostasis at planetary scale — sensing the carbon flows, capturing the excess, protecting the sinks, and closing the loop, the way a closed life-support system must on a spacecraft. The difference is only one of size. To manage Earth's carbon is to build, for the first time, a thermostat for a planet — and to learn the humility that operating one demands.", zh: "而如同任何新陈代谢，它可以被调节得好，也可以被调节得糟。一具健康的身体，把它的化学维持在一条狭窄的带里；一具病弱的，则过冲、并崩溃。工程的目标，是行星尺度上的稳态——感知碳的流动、捕获过剩、守护碳汇、闭合那个回路，正如一套封闭的生命支持系统在飞船上必须做的那样。区别，仅在于尺寸。管理地球的碳，是头一次，为一颗行星建造一个恒温器——并去学会，操作一个这样的恒温器所要求的、那份谦卑。" } },
    ],
  },
];
