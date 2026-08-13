// All copy and imagery below is the client's own, taken from the existing build.
const CDN = "https://south-indian-urban-backend.wc-1.previewbay.com/uploads";

export const IMAGES = {
  logo: `${CDN}/Group_1_eaca00a82b.svg`,
  hero: `${CDN}/Hero_Section_825dde5218.png`,
  about: `${CDN}/c260ca855e2a72048ecc1f5d1186847e783474c2_51a33ea208.png`,
  loans: `${CDN}/Rectangle_18360_75f64edc5d.png`,
  career: `${CDN}/Frame_29_a51ece4dde.png`,
  cardFarmers: `${CDN}/a8326dc159fcbef656e63f3295f55b057b2c165e_fc2244cfe4.jpg`,
  drone: "/hero_banner_hd.png",
  cardHomestead: `${CDN}/e1960458fffdf94d3598800c4ec43e6d2c6dcc68_8f76c08ba8.png`,
  bullocks: `${CDN}/d95832c09055afea970dd4f5b55e456dfbfce4fc_23a36d7334.jpg`,
  highFive: `${CDN}/2959f638a69073a28208faf191125f089e5e8f13_cf6d23aa5d.jpg`,
  sowing: `${CDN}/bc2a669adb811d4679b95467b27b729c6c730b41_5ec2ed7566.jpg`,
  whoWeAreBanner: "/who_we_are_banner.png",
  /** Local photography. Preferred over the CDN entries above: Next 16's image
   *  optimizer refuses upstream hosts that resolve to a NAT64 address, which is
   *  how the CDN resolves on some networks. See the note in next.config.ts. */
  harvest: "/blog_harvest.jpg",
  award: "/blog_award.jpg",
  polyhouse: "/blog_agritech.jpg",
  memberMeeting: "/blog_subsidy.jpg",
} as const;


export const NOTICE = {
  title: "Scheduled System Maintenance – Temporary Service Interruption",
  date: "21 Jul 2026, 6:45 PM",
};

export const NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Application for Member Farm Mechanisation & Agri Credit Scheme (2026–27)",
    date: "07.08.2026 04:37 PM",
    category: "Financial Scheme",
    summary: "Inviting short-term credit applications for cultivation, irrigation, livestock, and modern machinery across Kerala and Tamil Nadu units.",
    hasDownload: true,
  },
  {
    id: "notif-2",
    title: "Disbursement of Organic Fertilizer & Bio-Input Subsidy Batch II",
    date: "05.08.2026 02:38 PM",
    category: "Input Supply",
    summary: "Certified bio-fertilizers and soil health nutrients available at subsidized rates for registered society members.",
    hasDownload: true,
  },
  {
    id: "notif-3",
    title: "Scheduled System Maintenance – Member Portal & Transaction Interruption",
    date: "03.08.2026 11:15 AM",
    category: "System Update",
    summary: "Online member service portal will undergo scheduled maintenance on Saturday between 11:00 PM and 3:00 AM.",
    hasDownload: false,
  },
  {
    id: "notif-4",
    title: "Notification for 16th Annual General Meeting (AGM) & Director Elections",
    date: "01.08.2026 09:30 AM",
    category: "Governance",
    summary: "Official notice for members regarding the upcoming Annual General Meeting at District HQ Viyur, Thrissur.",
    hasDownload: true,
  },
] as const;


export const NAV_LINKS = [
  { label: "About Us", href: "#who-we-are" },
  { label: "Services", href: "#services" },
  { label: "Leadership", href: "#leadership" },
  { label: "Careers", href: "#careers" },
  { label: "Gallery", href: "#gallery" },
  { label: "Blogs", href: "/blog" },
];

export const HERO = {
  title: "Empowering Farmers,",
  titleAccent: "Building Communities",
  intro:
    "A member-owned cooperative bringing fair inputs, honest credit and better markets to the people who grow our food.",
  /** Modern South Indian farming — precision growing, drone spraying and
   *  digital member service, drawn from the Society's own library. */
  banner: {
    main: {
      src: "/hero_banner.jpg",
      alt: "Ultra HD modern smart agriculture in South India with high-tech drone and solar irrigation sensors over emerald rice fields during golden hour",
      caption: "Smart Agriculture, South India",
    },
    side: [
      {
        src: IMAGES.about,
        alt: "A member monitoring crop data on a tablet inside a polyhouse",
        caption: "Precision growing",
        note: "Sensors and crop data guide what a polyhouse gets, and when.",
      },
      {
        src: IMAGES.cardFarmers,
        alt: "A member with his society card alongside a field officer",
        caption: "Digital member services",
        note: "One card for inputs, credit and procurement across both states.",
      },
    ],
  },
};

export const FACTS = [
  { value: "15+", label: "Years serving farming communities" },
  { value: "2", label: "States of operation" },
  { value: "12", label: "Member services" },
  { value: "2026", label: "Registered under MSCS Act" },
];

export const WHO_WE_ARE = {
  label: "Who we are",
  /** Split so the heading can be set in two tones. */
  title: "A Society Built on",
  titleAccent: "Trust & Transparency",
  /** The short version, for the home page. `body` is the full text, used on /about. */
  lead: "For over 15 years we have been the backbone of rural and peri-urban farming communities across Kerala and Tamil Nadu — supplying inputs, marketing produce, and putting a share of the profit back in members' hands.",
  body: [
    "South Urban Agro Multi State Co-operative Society Ltd. has been the backbone of rural and peri-urban agricultural communities for over 15 years. We offer services ranging from input supply and marketing to financial assistance and skill development.",
    "Our cooperative model ensures that every member has a voice in governance, a share in profits, and access to the resources needed to thrive in today's dynamic agri-market.",
  ],
};

export const OVERVIEW = {
  label: "Cooperative overview",
  title: "What an Agro Multi-State Cooperative Society does",
  body: [
    "An Agro Multi-State Cooperative Society is a member-owned organization registered under the provisions of the Multi State Cooperative Societies Act, 2002, enabling it to operate across multiple states in India. The primary objective of such a society is to promote the economic and social welfare of farmers, agricultural producers, rural entrepreneurs, and allied sector stakeholders through cooperative principles.",
    "The society focuses on activities such as agricultural input supply, procurement and marketing of farm produce, food processing, warehousing, cold storage, value addition, dairy and livestock development, agro-based industries, rural finance facilitation, and farmer capacity building. By pooling resources and working collectively, members benefit from improved market access, better pricing, reduced input costs, and enhanced income opportunities.",
  ],
};

/** Slide 4 of the Society deck — the democratic-governance half of the
 *  "what a multi-state agro cooperative is" explainer. `OVERVIEW` is slide 3. */
export const COOP_PRINCIPLES = [
  "An Agro Multi-State Cooperative Society operates on democratic principles, where each member has an equal voice in decision-making. The society aims to create sustainable agricultural ecosystems, strengthen rural livelihoods, encourage entrepreneurship, and contribute to the overall development of the agricultural sector.",
  "Through innovation, professional management, and member participation, an Agro Multi-State Cooperative Society serves as a platform for transforming agriculture into a more profitable, sustainable, and inclusive enterprise while fostering economic growth in rural communities.",
];

/** The activity areas listed on slide 3, broken out so they can be shown as a grid.
 *  `icon` is a lucide-react export name, resolved by the About page. */
export const COOP_ACTIVITIES = [
  { icon: "Sprout", title: "Agricultural input supply", desc: "Seeds, fertilisers and crop protection sourced collectively." },
  { icon: "ShoppingBasket", title: "Procurement & marketing", desc: "Farm produce aggregated and taken to better markets." },
  { icon: "Warehouse", title: "Warehousing & cold storage", desc: "Storage that lets members hold produce for a fairer price." },
  { icon: "PackageCheck", title: "Processing & value addition", desc: "Food processing and agro-based industry at member scale." },
  { icon: "Milk", title: "Dairy & livestock development", desc: "Allied-sector support beyond the crop cycle." },
  { icon: "HandCoins", title: "Rural finance facilitation", desc: "Short-term credit routed through the cooperative, not the moneylender." },
] as const;

export const COMPANY_DETAILS = {
  intro:
    "SOUTH URBAN AGRO MULTI STATE CO-OP SOCIETY LIMITED is being established as an Agro-Focused Multi-State Cooperative Society under the MSCS Act, 2002. The Society aims to become a professionally managed, member-centric institution operating across Kerala and Tamil Nadu.",
  rows: [
    { label: "Date of registration", value: "15th Jan, 2026" },
    { label: "Registration number", value: "MSCS/CR/1664/2026" },
    {
      label: "Address",
      value: "Kishanu Square, First Floor, Power House Jn, Viyur – Thrissur 680010",
    },
    { label: "Area of operation", value: "Kerala, Tamil Nadu" },
  ],
};

/** Vision / Mission / Objectives / Goals / Values — the original site ran these as
 *  five stacked walls of text; here they share one tabbed panel. */
type CompassPanel = { id: string; title: string; lead: string; items: string[] };

export const COMPASS: CompassPanel[] = [
  {
    id: "vision",
    title: "Vision",
    lead: "To be a premier, transparent, technology-driven, and member-centric Multi-State Cooperative that empowers farmers and rural communities across Kerala and Tamil Nadu through sustainable economic growth, innovation, and shared prosperity.",
    items: [],
  },
  {
    id: "mission",
    title: "Mission",
    lead: "We are committed to transforming the lives of farmers by",
    items: [
      "Delivering high-quality agricultural inputs at fair and competitive prices.",
      "Securing better price realization for agricultural produce through efficient collective marketing.",
      "Providing timely and accessible short-term credit to enhance farm productivity and income.",
      "Upholding the highest standards of transparent governance and financial discipline.",
      "Harnessing modern technology for efficient, accountable, and seamless service delivery.",
    ],
  },
  {
    id: "objectives",
    title: "Objectives",
    lead: "Four commitments that shape how the Society operates day to day.",
    items: [
      "Member-Centric Service Excellence — Provide quality agricultural inputs at fair prices and ensure better price realization for produce through collective marketing.",
      "Financial Empowerment — Offer timely short-term credit to members to boost agricultural productivity and income.",
      "Transparency & Good Governance — Maintain strong financial discipline and the highest levels of transparency in all operations and decision-making.",
      "Technological Advancement — Leverage modern technology for efficient, paperless, and transparent service delivery to members.",
    ],
  },
  {
    id: "goals",
    title: "Goals",
    lead: "Our primary goals are to provide quality agricultural inputs at fair and competitive prices to our members, ensure better price realization for agricultural produce through effective collective marketing, deliver timely short-term credit to improve farm productivity and income, maintain the highest standards of transparent governance and strong financial discipline, and harness modern technology to achieve efficient, accountable, and transparent service delivery to all members.",
    items: [],
  },
  {
    id: "values",
    title: "Values",
    lead: "Seven principles our members hold us to.",
    items: [
      "Transparency — We believe in open, honest, and accountable operations in all our dealings.",
      "Farmer Centricity — Our members and their prosperity are at the heart of every decision we make.",
      "Integrity — We uphold the highest ethical standards and honour our commitments.",
      "Excellence — We strive for quality and continuous improvement in our products, services, and processes.",
      "Innovation — We embrace technology and modern solutions to serve our members better.",
      "Collaboration — We work together with farmers, communities, and stakeholders for collective success.",
      "Sustainability — We are committed to environmentally responsible and long-term sustainable growth.",
    ],
  },
];

/** The same five panels as `COMPASS`, split into the shapes the About page needs:
 *  a standalone vision statement, a numbered mission, and titled objective /
 *  value cards. Kept separate so the home page's tabbed panel is untouched. */
export const VISION = {
  label: "Vision",
  statement:
    "To be a premier, transparent, technology-driven, and member-centric Multi-State Cooperative that empowers farmers and rural communities across Kerala and Tamil Nadu through sustainable economic growth, innovation, and shared prosperity.",
};

/** The five commitments are parallel, not sequential — each one names a field the
 *  Society works in. `focus` is that field, so the About page can rail them as a
 *  taxonomy rather than number them into an order that does not exist. */
export const MISSION = {
  label: "Mission",
  lead: "We are committed to transforming the lives of farmers by",
  items: [
    {
      focus: "Inputs",
      text: "Delivering high-quality agricultural inputs at fair and competitive prices.",
    },
    {
      focus: "Markets",
      text: "Securing better price realization for agricultural produce through efficient collective marketing.",
    },
    {
      focus: "Credit",
      text: "Providing timely and accessible short-term credit to enhance farm productivity and income.",
    },
    {
      focus: "Governance",
      text: "Upholding the highest standards of transparent governance and financial discipline.",
    },
    {
      focus: "Technology",
      text: "Harnessing modern technology for efficient, accountable, and seamless service delivery.",
    },
  ],
};

export const OBJECTIVES = [
  {
    icon: "BadgeCheck",
    title: "Member-Centric Service Excellence",
    desc: "Provide quality agricultural inputs at fair prices and ensure better price realization for produce through collective marketing.",
  },
  {
    icon: "HandCoins",
    title: "Financial Empowerment",
    desc: "Offer timely short-term credit to members to boost agricultural productivity and income.",
  },
  {
    icon: "Scale",
    title: "Transparency & Good Governance",
    desc: "Maintain strong financial discipline and the highest levels of transparency in all operations and decision-making.",
  },
  {
    icon: "TrendingUp",
    title: "Technological Advancement",
    desc: "Leverage modern technology for efficient, paperless, and transparent service delivery to members.",
  },
] as const;

export const GOALS = {
  label: "Goals",
  statement:
    "Our primary goals are to provide quality agricultural inputs at fair and competitive prices to our members, ensure better price realization for agricultural produce through effective collective marketing, deliver timely short-term credit to improve farm productivity and income, maintain the highest standards of transparent governance and strong financial discipline, and harness modern technology to achieve efficient, accountable, and transparent service delivery to all members.",
};

export const VALUES = [
  { icon: "Eye", title: "Transparency", desc: "Open, honest, and accountable operations in all our dealings." },
  { icon: "Users2", title: "Farmer Centricity", desc: "Our members and their prosperity are at the heart of every decision." },
  { icon: "ShieldCheck", title: "Integrity", desc: "We uphold the highest ethical standards and honour our commitments." },
  { icon: "Gem", title: "Excellence", desc: "Quality and continuous improvement in our products, services, and processes." },
  { icon: "Lightbulb", title: "Innovation", desc: "We embrace technology and modern solutions to serve our members better." },
  { icon: "Handshake", title: "Collaboration", desc: "We work with farmers, communities, and stakeholders for collective success." },
  { icon: "Leaf", title: "Sustainability", desc: "Environmentally responsible growth, measured over the long term." },
] as const;

/** Membership drive — share structure approved by the Board (deck slides 21–24).
 *  Staff enrolment targets from the same section are internal and left out. */
export const MEMBERSHIP = {
  label: "Becoming a member",
  title: "Two ways to hold a share",
  intro:
    "The Board has opened a large-scale membership and share capital mobilization campaign to build a strong member base and increase owned funds. Membership is open under two classes.",
  classes: [
    {
      name: "Class A",
      tagline: "Entry membership",
      total: "₹110",
      totalLabel: "Total minimum per member",
      rows: [
        { label: "Membership fee", value: "₹10" },
        { label: "Documentation charges", value: "Nil" },
        { label: "GST", value: "Nil" },
        { label: "Minimum share contribution", value: "₹100" },
      ],
    },
    {
      name: "Class B",
      tagline: "Full share membership",
      total: "₹1,200",
      totalLabel: "Total minimum per member",
      rows: [
        { label: "Membership fee", value: "₹10" },
        { label: "Documentation charges", value: "₹100" },
        { label: "P&S", value: "₹90" },
        { label: "Minimum share contribution", value: "₹1,000" },
      ],
    },
  ],
  documents: [
    { icon: "FileText", label: "Application form" },
    { icon: "Camera", label: "Passport size photo × 2" },
    { icon: "IdCard", label: "Aadhaar card" },
    { icon: "CreditCard", label: "PAN card" },
    { icon: "ScrollText", label: "Ration card" },
  ],
} as const;

/** Collapsed by default — `summary` is all a visitor sees until they open one. */
export const SERVICES = [
  {
    title: "Member Thrift & Contribution Schemes",
    summary: "Recurring, fixed and long-term savings plans for members.",
    body: "The Society offers a range of thrift and contribution schemes exclusively for its members to encourage the habit of regular savings and disciplined financial planning. Members can choose from recurring contribution plans, fixed contribution schemes, and other long-term thrift options tailored to different financial goals. These schemes help members build financial security over time while remaining fully within the framework of cooperative principles and the Society's bye-laws.",
  },
  {
    title: "Agricultural Credit & Finance",
    summary: "Affordable credit for cultivation, irrigation, livestock and mechanisation.",
    body: "Recognising the genuine credit needs of farmer members, the Society provides timely and affordable agricultural credit for a wide range of purposes, including crop cultivation, plantation development, irrigation systems, farm mechanisation, livestock rearing, dairy and poultry activities, and other allied agricultural enterprises. These credit facilities are extended only to members and are aimed at enhancing productivity, reducing dependence on informal sources of credit, and enabling the adoption of modern and sustainable farming practices.",
  },
  {
    title: "Gold-Linked Credit Facilities",
    summary: "Quick liquidity against gold, for members only.",
    body: "Subject to the Society's approved bye-laws and applicable cooperative regulations, limited gold-linked credit facilities may be extended exclusively to members to meet urgent personal, agricultural, business, or emergency requirements. The process is kept transparent and member-friendly, with the primary objective of providing quick liquidity while remaining fully compliant with cooperative norms.",
  },
  {
    title: "Farmer Development Programmes",
    summary: "Workshops and field demonstrations on modern and organic farming.",
    body: "The Society regularly organises awareness programmes, workshops, field demonstrations, and training sessions on modern agriculture, organic and natural farming, water conservation, soil health management, crop diversification, integrated pest management, and sustainable farming technologies. These capacity-building initiatives help member farmers improve productivity, reduce input costs, and adopt environment-friendly practices.",
  },
  {
    title: "Agricultural Machinery & Infrastructure Support",
    summary: "Shared access to equipment that lowers labour costs.",
    body: "To promote mechanised and efficient farming, the Society facilitates access to agricultural machinery, equipment, and related infrastructure through collective initiatives and member-based financial support. This enables farmers to reduce labour costs, improve operational efficiency, and adopt modern farming methods that enhance overall farm productivity.",
  },
  {
    title: "Marketing & Value Chain Development",
    summary: "Stronger market linkages and fewer intermediaries.",
    body: "The Society works systematically to strengthen market linkages for its members by assisting in the marketing of agricultural produce, promoting value addition and primary processing, facilitating collective procurement of quality inputs, and improving access to better markets and fairer prices. Collective marketing efforts help members reduce intermediaries and realise better returns.",
  },
  {
    title: "Rural Development & Community Welfare",
    summary: "Education, health, women's empowerment and youth enterprise.",
    body: "Committed to holistic rural development, the Society actively supports initiatives in education, skill development, women empowerment, youth entrepreneurship, health awareness, environmental conservation, and community welfare activities among its members and in the areas of its operation. These efforts contribute to the overall socio-economic progress of rural communities.",
  },
  {
    title: "Financial Inclusion of Members",
    summary: "Thrift habits and financial literacy for underserved members.",
    body: "The Society strives to bring accessible and responsible financial services to its rural and underserved members by encouraging thrift habits, promoting responsible credit behaviour, and creating opportunities for financial literacy and economic empowerment. The focus remains on enabling members to manage their finances more effectively and securely.",
  },
  {
    title: "Digital Member Services",
    summary: "Digital records, prompt service and streamlined transactions.",
    body: "The Society is committed to delivering efficient, transparent, and technology-enabled services through digital member management systems, accurate record keeping, prompt member service, and streamlined financial transactions. These digital initiatives enhance convenience, accountability, and ease of access for members.",
  },
  {
    title: "Agricultural Input Supply",
    summary: "Certified seeds, fertilisers and crop protection at collective prices.",
    body: "The Society facilitates the timely supply of quality agricultural inputs to its members, including certified seeds, fertilisers, organic manures, bio-fertilisers, crop protection products, micronutrients, irrigation materials, and modern farming equipment, sourced from reputed manufacturers and approved suppliers. Through collective procurement and an efficient distribution system, members are able to access essential farm inputs at competitive prices while maintaining high standards of quality. Technical guidance on the proper selection and application of inputs is also provided to promote sustainable farming and improve yields.",
  },
  {
    title: "Training and Skill Development",
    summary: "Structured programmes from precision agriculture to agribusiness.",
    body: "Recognising that knowledge and skills are fundamental to sustainable agricultural and rural development, the Society regularly organises structured training programmes, workshops, seminars, and awareness campaigns for its members. These cover a wide range of subjects including modern farming techniques, organic and natural farming, precision agriculture, crop management, livestock development, fisheries, post-harvest management, value addition, food processing, agribusiness management, digital agriculture, financial literacy, and cooperative governance. Exposure visits, on-field demonstrations, and interactions with agricultural experts, research institutions, and government agencies are also facilitated to encourage the adoption of best practices.",
  },
  {
    title: "Market Intelligence Services",
    summary: "Price trends, demand forecasts and policy updates.",
    body: "The Society provides practical market intelligence support to help members make informed production, marketing, and investment decisions. Timely information on agricultural commodity prices, market demand trends, weather patterns, input costs, export opportunities, and relevant government policies is collected, analysed, and shared with members. Regular updates on price movements, seasonal demand forecasts, and emerging opportunities help farmers and agripreneurs optimise crop planning, identify profitable markets, and improve price realisation. Through these initiatives, the Society aims to reduce market risks and strengthen the economic position of its members.",
  },
] as const;

export const JOB = {
  title: "Field Agriculture Officer",
  type: "Full-time",
  location: "District HQ",
  dept: "Operations",
  tags: ["Agriculture", "Field Work", "Rural"],
};

export const GALLERY = [
  { src: IMAGES.cardFarmers, alt: "Members with their society card at a dairy unit", category: "Operations" },
  { src: IMAGES.drone, alt: "Drone spraying a paddy field", category: "Operations" },
  { src: IMAGES.cardHomestead, alt: "A member holding his society card outside his homestead", category: "Events" },
  { src: IMAGES.bullocks, alt: "A farmer ploughing with bullocks", category: "Events" },
  { src: IMAGES.highFive, alt: "Two farmers celebrating in a paddy field", category: "Events" },
  { src: IMAGES.sowing, alt: "A farmer sowing across a green paddy field", category: "Operations" },
] as const;

export const BLOG = {
  label: "Insights & updates",
  title: "Agri insights, market news and Society notices",
  intro:
    "Scheme breakdowns, price outlooks and field notes from the desks that work with our members every day.",
};

/**
 * Blog posts. `slug` drives /blog/[slug]; `body` is rendered block by block by
 * the detail page.
 *
 * TODO: the article bodies below are house-written drafts standing in for the
 * Society's own editorial. Have the communications desk review the figures and
 * scheme names before this goes live.
 */
export type PostBlock =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "list"; items: readonly string[] }
  | { kind: "quote"; text: string; attribution?: string };

export const POSTS = [
  {
    slug: "government-subsidies-for-cooperative-members",
    title: "New Government Subsidies Available for Cooperative Members",
    excerpt: "A breakdown of the latest agricultural support schemes and how South Urban members can apply.",
    read: "4 min read",
    image: "/blog_subsidy.jpg",
    date: "2026-08-04",
    dateLabel: "4 August 2026",
    category: "Schemes & Subsidies",
    author: "Member Services Desk",
    body: [
      { kind: "p", text: "A fresh round of central and state agricultural support has opened for the 2026–27 cycle, and a good share of it is reachable through a registered cooperative rather than by individual application. For members of the Society, that difference matters: collective applications clear faster, carry lower documentation overhead, and in several schemes attract a higher ceiling than an individual holding would." },
      { kind: "h2", text: "What is on offer this cycle" },
      { kind: "p", text: "The schemes most relevant to our members fall into four broad groups. Each has its own eligibility window, and a few close well before the season ends." },
      {
        kind: "list",
        items: [
          "Farm mechanisation support — part-funding on tillers, transplanters, sprayers and small harvesting equipment, with a higher share for smallholders and first-time buyers.",
          "Bio-input and soil health assistance — subsidised organic manures, bio-fertilisers and micronutrients, tied to a soil test carried out through the Society.",
          "Irrigation and water conservation — assistance on drip and sprinkler systems, farm ponds and pump sets.",
          "Post-harvest and storage — support toward on-farm storage, primary processing units and cold chain access.",
        ],
      },
      { kind: "h2", text: "Why route the application through the Society" },
      { kind: "p", text: "Most of these schemes ask for land records, a soil health card, bank details and a purchase quotation. Assembling that once, at the Society, is considerably less work than each member assembling it separately — and our field officers already hold much of it from the membership file. Where a scheme sets a minimum order size, pooling members into a single application is often the only practical way to reach it." },
      { kind: "quote", text: "Collective applications clear faster, and pooling members is often the only practical way to reach a scheme's minimum order size.", attribution: "Member Services Desk" },
      { kind: "h2", text: "How to apply" },
      { kind: "p", text: "Speak to your unit's field officer or visit the Society office at Viyur with your membership number. Bring your Aadhaar, the land record for the plot the assistance is meant for, and your most recent soil health card if you have one. The desk will confirm which schemes you qualify for and open the file on your behalf." },
      { kind: "p", text: "Applications are processed in the order they are received, and several of this cycle's windows close before the end of the season. Members who applied in the previous round do not need to re-register — only the scheme-specific annexure is required." },
    ],
  },
  {
    slug: "rabi-season-price-outlook",
    title: "Rabi Season Price Outlook: What Farmers Should Prepare For",
    excerpt: "Commodity price forecasts for the upcoming Rabi season, and what they mean for planting decisions.",
    read: "3 min read",
    image: "/blog_harvest.jpg",
    date: "2026-07-22",
    dateLabel: "22 July 2026",
    category: "Market Intelligence",
    author: "Market Intelligence Desk",
    body: [
      { kind: "p", text: "Planting decisions made in the next few weeks will be settled at prices set months from now. This note sets out what the Society's market desk is seeing, so members can weigh the crop mix with something more than last season's memory." },
      { kind: "h2", text: "The short version" },
      { kind: "p", text: "Input costs have steadied after two volatile cycles, but they have steadied at a level well above where they sat three years ago. Output prices have not risen to match across every crop — which means margin, not yield, is the number worth planning around this season." },
      {
        kind: "list",
        items: [
          "Pulses continue to hold firm, supported by steady demand and constrained supply.",
          "Paddy remains stable, with procurement providing a floor but little upside beyond it.",
          "Vegetables stay the most volatile line — high ceilings, but a price that can halve inside a fortnight at harvest.",
          "Spices remain the strongest margin opportunity for members with the land and the patience for a longer cycle.",
        ],
      },
      { kind: "h2", text: "What to do with this" },
      { kind: "p", text: "Two things are worth acting on. First, split the risk: members who put everything into a single high-volatility crop have had the roughest three seasons, and a mixed plot has consistently held up better. Second, plan the sale, not just the harvest — the difference between selling at harvest and holding a few weeks has been larger than the difference between a good yield and an average one." },
      { kind: "quote", text: "Margin, not yield, is the number worth planning around this season." },
      { kind: "h2", text: "How the Society can help" },
      { kind: "p", text: "Collective marketing gives members access to buyers that individual lots cannot reach, and storage access means a member is not forced to sell into the weakest week of the year. Members who want to be included in this season's collective marketing pool should register with their field officer before sowing, since the pool is built around committed acreage." },
    ],
  },
  {
    slug: "precision-agriculture-indian-cooperatives",
    title: "How Precision Agriculture is Changing Indian Cooperatives",
    excerpt: "Drone mapping, soil sensors, and AI-powered advisory tools are entering the field — and cooperatives are how smallholders reach them.",
    read: "4 min read",
    image: "/blog_agritech.jpg",
    date: "2026-07-09",
    dateLabel: "9 July 2026",
    category: "Technology",
    author: "Field Operations Desk",
    body: [
      { kind: "p", text: "Precision agriculture has a reputation as something for large holdings — the sort of technology that only pays back across hundreds of acres. On an individual smallholding, that is broadly true. Through a cooperative, it stops being true, and that is the shift worth paying attention to." },
      { kind: "h2", text: "The economics change when the asset is shared" },
      { kind: "p", text: "A spraying drone is out of reach for a two-acre holding and entirely sensible across two hundred acres of member land. The same applies to soil testing equipment, moisture sensors and the advisory subscriptions that make sense of the readings. The cooperative is the structure that turns an unaffordable asset into a shared service billed by the acre." },
      { kind: "h2", text: "What members actually see" },
      {
        kind: "list",
        items: [
          "Soil testing that produces a plot-specific nutrient recommendation rather than a generic dose — usually the fastest saving, because most plots are over-fertilised in one nutrient and short in another.",
          "Drone spraying that covers in an afternoon what takes days by hand, with less chemical drift and materially less exposure for the person spraying.",
          "Moisture and weather data that shifts irrigation from a fixed schedule to actual need.",
          "Advisory alerts for pest and disease pressure, early enough to act rather than to salvage.",
        ],
      },
      { kind: "h2", text: "Where the honest limits are" },
      { kind: "p", text: "None of this substitutes for knowing your own land. The sensors report what is happening; they do not know that the western corner floods, or that a particular variety has always struggled on that soil. The members getting the most out of these tools are the ones treating the data as a second opinion rather than an instruction." },
      { kind: "quote", text: "The cooperative is the structure that turns an unaffordable asset into a shared service billed by the acre." },
      { kind: "p", text: "The Society is expanding shared-equipment access across both operating states through the coming season. Members interested in soil testing or drone spraying for their plots should register interest at their unit office so routes can be planned by cluster." },
    ],
  },
  {
    slug: "state-cooperative-excellence-award",
    title: "South Urban Members Win State Cooperative Excellence Award",
    excerpt: "Our member network was recognised for outstanding contribution to farmer welfare across Kerala and Tamil Nadu.",
    read: "3 min read",
    image: "/blog_award.jpg",
    date: "2026-06-28",
    dateLabel: "28 June 2026",
    category: "Society News",
    author: "Communications Desk",
    body: [
      { kind: "p", text: "The Society's member network has been recognised with a State Cooperative Excellence Award for its contribution to farmer welfare — an award that belongs, in the most literal sense, to the members whose participation earned it." },
      { kind: "h2", text: "What the recognition was for" },
      { kind: "p", text: "The citation highlighted three areas: the reach of collective input supply into remote hamlets, the movement of members away from informal credit and onto Society terms, and the participation rate in training and capacity-building programmes. The last of those is the one the Board is proudest of, because it is the hardest to manufacture — attendance at a workshop cannot be bought, only earned." },
      {
        kind: "list",
        items: [
          "Input supply extended into hamlets previously served only by intermediaries.",
          "A measurable shift from informal moneylenders to Society credit terms.",
          "Sustained participation in farmer training and field demonstration programmes.",
        ],
      },
      { kind: "quote", text: "An award like this measures what members chose to do, not what the Society announced it would do." },
      { kind: "h2", text: "What happens next" },
      { kind: "p", text: "Recognition is pleasant and it is not a plan. The Board has asked that the areas named in the citation be treated as the baseline rather than the achievement, with the coming year's focus on extending the same reach into the units that have grown most recently and have the least established field presence." },
      { kind: "p", text: "Members will find the full citation available at unit offices, and the Board has recorded its thanks to the field officers and member representatives whose work over the last several seasons made the recognition possible." },
    ],
  },
] as const;

export const BOARD = [
  {
    name: "Mr. Sujan Mathew",
    role: "Chairman",
    photo: "/sujan_mathew.jpg",
    photoPosition: "object-[center_30%]",
    teaser: "25 years across corporate banking, trade finance and branch operations.",
    bio: "Mr. Sujan Mathew is a seasoned banking and financial services professional with over 25 years of experience across corporate banking, trade finance, commercial banking, and branch operations. He has held key positions in leading institutions such as CSB Bank, IDBI Bank, HDFC Bank, and ICICI Bank. At South Indian Credits Ltd (SICL), he oversees overall operations, including business development, branch banking, microfinance operations, compliance, and policy formulation. He plays a central role in strategic planning, operational efficiency, and organizational development. Mr. Mathew has also contributed to development initiatives such as DDUGKY and has been actively involved in training programs with ICICI Foundation, CHEGG, and ESAF Bank. He holds an MPhil from Madras Christian College and an MA in Economics from the University of Kerala, Karyiavattom.",
  },
  {
    name: "Elby Thomson",
    role: "MD & CEO",
    photo: "/elby_thomson.jpg",
    teaser: "22+ years in finance, leading governance and digital transformation.",
    bio: "Ensures sound corporate governance at operational as well as policy level, he is principally responsible for providing the mandate and leadership for the executive team to work in partnership across their operational groups, to lead and implement continuous improvement in business process, leveraging digital transformation and ensure delivery of customer-centric services. In his role, he steers the board of directors on policy decisions regarding asset liability and risk management. His experience in loan policy making, implementation of process and procedure, recruitment, training and portfolio management, delinquency management and economic analysis, moulded his perspective on societal needs and social interaction. A battle-hardened banking professional, with an MBA in Finance & Marketing, for more than 22 years of experience serving across verticals in Max Microfinance, Muthoot Fincorp and ESAF, Elby has played an instrumental role in driving the growth of the company. He has significant experience managing fund vehicles of various sizes being involved right from the early stage with due diligence.",
  },
  {
    name: "Mr. Rajan K Xavier",
    role: "Director",
    photo: "/rajan_xavier.jpg",
    teaser: "28 years in the financial sector; a microfinance pioneer at ESAF.",
    bio: "Mr. Rajan K Xavier, a stalwart in the financial sector with over 28 years of unwavering dedication, stands as a beacon of transformative leadership and impactful change. His journey began in 1996 with a leading microfinance organization, ESAF, where his passion for empowering economically underprivileged communities took root. Throughout his career, Rajan has pioneered microfinance initiatives across diverse geographies, notably expanding the outreach to new regions. His visionary approach didn't stop there; he integrated additional financial services into his repertoire, augmenting offerings and fortifying community resilience. Mr. Rajan's influence extends beyond corporate corridors; he has been a motivational force, shaping countless lives through entrepreneurship and personality development training. His leadership has not only enriched the careers of hundreds but also catalysed the eradication of predatory money lenders from remote villages, laying the foundation for sustainable livelihoods across Kerala, Tamil Nadu and Gujarat.",
  },
  {
    name: "Anish Vijayan",
    role: "Director",
    photo: "/anish_vijayan.jpg",
    teaser: "From tribal-colony teacher to award-winning rural development leader.",
    bio: "Started his career in 1999 as a teacher in a tribal colony in Kanthalloor Panchayath. He was awarded the best teacher under BRC Munnar. Along with teaching he was associated with the socio-economic development of poor students in this panchayath. Later he joined ESAF, a microfinance firm, as development officer and ESAF honoured him with the Excellency Award for exemplary service. He was deeply associated with the economic development of more than 10,000 rural women through empowerment programmes. He started his own social service organization in 2005-2015. As part of that, he actively involved in the rehabilitation of Tsunami affected coastal areas of Tarangambadi and Chinnamgudi in Nagapattanam district, Tamil Nadu, as project director. He was awarded best social worker by Rotary International, Tamil Nadu, and has received the V.K Kurian Memorial award (2017), Fr. Immanuel Vettikkuzhy Memorial award (2018), and the Best Achievement award from Kanthalloor Grama Panchayath (2019). He is responsible for strategic partnerships, government relations, and risk management.",
  },
  {
    name: "Thirumal Swamy",
    role: "Director",
    photo: "/thirumal_swamy.jpg",
    teaser: "Tribal community leader and a pioneer of millets cultivation.",
    bio: "He hails from Devikulam Taluk, Kanthalloor Village and belongs to the tribal community, born and raised in the scenic surroundings of the Chinnar Wildlife Sanctuary. As a proud representative of his tribal roots, he serves as the President of the Economic Development Committee, where he plays a pivotal role in driving initiatives for the upliftment of his community. A true pioneer in millets cultivation within the tribal hamlet, he has successfully introduced and popularised this hardy, nutritious crop, transforming traditional farming practices and enhancing food security in the region. Recognised as an excellent organiser in the farming sector, he brings people together, coordinates resources efficiently, and implements innovative agricultural strategies. Above all, he is a born leader whose vision, dedication, and ability to inspire others have made him a guiding force for sustainable development and community progress.",
  },
  {
    name: "Aji Mathew",
    role: "Director",
    photo: "/aji_mathew.jpg",
    teaser: "Soft skills and English trainer; heads admissions at Nirmala College.",
    bio: "Aji Mathew is a dynamic and dedicated Soft Skills and English Trainer with extensive experience in office administration, counselling, teaching, and student development across educational institutions and government-funded programs. Skilled in training diverse learners, improving communication competency, and preparing individuals for corporate environments. Known for exceptional interpersonal skills, learner engagement, and the ability to motivate, mentor, and guide trainees toward achieving personal and professional growth. An HR and Software professional, she is currently heading Admissions in Nirmala College Group of Institutions, Chalakudy.",
  },
] as const;

export const MANAGEMENT = [
  {
    name: "Mr. George Varghese",
    role: "Chief Vigilance Officer",
    photo: "/george_varghese.jpg",
    teaser: "IPS Superintendent of Police (Retd.), 37 years of service.",
    bio: "Mr. George Varghese is a distinguished police professional with over 37 years of exemplary service, bringing deep expertise in security strategy, vigilance, and fraud risk management. Over the course of his career, he has demonstrated exceptional capability in conceptualizing and executing complex security frameworks, strengthening internal controls, and leading large, multidisciplinary teams. He has held several key leadership positions, including District Police Chief of Kozhikode Rural, Kochi City, and Idukki, where he played a pivotal role in enhancing law enforcement operations and organizational effectiveness. An alumnus of Sainik School Kazhakoottam and Catholicate College, Pathanamthitta, he began his career as a Sub Inspector in 1976 and retired as District Police Chief, Idukki.",
  },
  {
    name: "Ms. Agnes Minu",
    role: "Chief Accounts Officer",
    photo: "/agnes_minu.jpg",
    teaser: "Leads financial reporting, compliance and internal controls.",
    bio: "Ms. Agnes Minu leads the finance and accounting functions at SICL, with responsibility for financial reporting, compliance, and internal control systems. She has been instrumental in implementing a risk-based ERP framework, enhancing process efficiency and strengthening financial governance. Her professional experience includes roles at Al Dhafra Insurance Company and Thaliath & Jacob Chartered Accountants, where she developed strong expertise in financial reporting and internal controls. She holds an MBA in Finance from ISBM and is currently pursuing the Chartered Accountancy qualification.",
  },
  {
    name: "Mr. Subash K G",
    role: "Vice President – Corporate Sales",
    photo: "/subash_kg.jpg",
    teaser: "Four decades in banking, 35 of them at CSB Bank.",
    bio: "Mr. Subash K G is a veteran banking professional with over four decades of experience in banking operations, corporate sales, and risk management. He served for 35 years at CSB Bank, where he held multiple leadership roles, culminating in his position as Zonal Cluster Head. Post-retirement, he contributed as Head of the BSFI division at ASAP Chathannur and later served in the Risk Control Division at ESAF Bank. At SICL, he plays a strategic role in driving corporate sales, strengthening client relationships, and expanding business growth.",
  },
  {
    name: "Mr. Jomi De Panakkal",
    role: "Deputy Vice President – Administration",
    photo: "/jomi_panakkal.jpg",
    teaser: "28+ years in project financing, HR and compliance.",
    bio: "Mr. Jomi De Panakkal brings over 28 years of experience in project financing, institutional funding, and financial strategy. At SICL, he leads initiatives to secure funding from banks and financial institutions, ensuring alignment with organizational objectives and long-term sustainability. He is highly skilled in financial analysis, risk assessment, and relationship management with funding agencies. His role also encompasses administrative oversight, HR coordination, and compliance management.",
  },
] as const;

export const CONTACT = {
  phone: "1245 678 910",
  email: "southurban@gmail.com",
  address: "South Urban Cooperative House, Agricultural District, State — 000001",
};

/**
 * TODO: the Society's real profile URLs are not on file yet — these are inert
 * placeholders so the header renders. Replace each `href` before going live,
 * or delete the entry and its icon disappears from the header.
 */
export const SOCIALS = [
  { name: "Facebook", href: "#" },
  { name: "Instagram", href: "#" },
  { name: "X", href: "#" },
  { name: "LinkedIn", href: "#" },
] as const;
