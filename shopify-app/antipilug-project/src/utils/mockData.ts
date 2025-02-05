// Array of topic-specific images
const topicImages = {
  healthcare: [
    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118",
    "https://images.unsplash.com/photo-1584982751601-97dcc096659c",
  ],
  economics: [
    "https://images.unsplash.com/photo-1574607383476-f517f260d30b",
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e",
    "https://images.unsplash.com/photo-1518186285589-2f7649de83e0",
  ],
  immigration: [
    "https://images.unsplash.com/photo-1483726234545-481d6e880fc6",
    "https://images.unsplash.com/photo-1528813860492-bb99459ec095",
    "https://images.unsplash.com/photo-1569325652536-f45d6f63d3eb",
    "https://images.unsplash.com/photo-1525372380916-4b665f808344",
    "https://images.unsplash.com/photo-1473187983305-f615310e7daa",
  ],
  environment: [
    "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce",
    "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9",
    "https://images.unsplash.com/photo-1440288736878-766bd5839edb",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17",
  ],
  education: [
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655",
  ],
  security: [
    "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    "https://images.unsplash.com/photo-1614064641938-3bbee52942c7",
  ],
};

const titles = [
  "The Future of Democracy in Digital Age",
  "Economic Inequality: Global Perspectives",
  "Climate Change Solutions: A Bipartisan Approach",
  "Healthcare Systems Around the World",
  "Immigration Reform: Finding Common Ground",
  "Education Policy: What Works?",
  "The Role of Government in Modern Economy",
  "Social Media's Impact on Political Discourse",
  "Urban Development and Social Justice",
  "National Security in the 21st Century",
  "Renewable Energy: Economic Implications",
  "Public Transportation and Social Equity",
  "Mental Healthcare Access: A Policy Review",
  "Digital Privacy in Modern Democracy",
  "Agricultural Policy and Food Security",
  "Housing Crisis: Policy Solutions",
  "International Trade: Winners and Losers",
  "Education Technology: Future of Learning",
  "Criminal Justice Reform Debate",
  "Space Policy and International Cooperation",
  "Cybersecurity: National Defense Priorities",
  "Universal Basic Income Analysis",
  "Green Jobs and Economic Growth",
  "Public Health Policy Post-Pandemic",
  "AI Regulation: Finding Balance",
  "Blockchain in Government Services",
  "Water Rights and Policy Making",
  "Nuclear Energy: Policy Debate",
  "Social Media Regulation",
  "Military Spending Analysis",
  "Affordable Housing Initiatives",
  "Drug Policy Reform Debate",
  "Pension System Reform",
  "Public Education Funding",
  "Border Security Technology",
  "Cryptocurrency Regulation",
  "Healthcare Innovation Policy",
  "Sustainable Urban Planning",
  "Election Security Measures",
  "Privacy Rights in Digital Age",
  "Carbon Tax Implementation",
  "Space Exploration Policy",
  "Automation and Labor Laws",
  "5G Infrastructure Policy",
  "Mental Health Services",
  "Renewable Energy Transition",
  "Transportation Infrastructure",
  "Data Privacy Legislation",
  "Agricultural Subsidies",
  "Defense Technology Policy",
  "Public Health Initiatives",
  "Financial Market Regulation",
  "Artificial Intelligence Ethics",
  "Veterans Affairs Reform",
  "Digital Currency Policy",
  "Clean Energy Investment",
  "Cybersecurity Standards",
  "Maritime Law and Policy",
  "Tech Industry Regulation",
  "Welfare System Reform"
];

const channels = [
  "PolicyInsights",
  "GlobalPerspectives",
  "EconomicsToday",
  "PoliticalDialogue",
  "SocialImpact",
  "FutureThink",
  "HealthPolicy",
  "EcoWatch",
  "TechPolicy",
  "SecurityBrief",
  "EducationFront",
  "WorldAffairs",
  "LocalPolitics",
  "GreenFuture",
  "UrbanPolicy",
];

const tags = [
  ["Politics", "Democracy", "Technology"],
  ["Economics", "Society", "Global"],
  ["Environment", "Policy", "Science"],
  ["Healthcare", "Reform", "Global"],
  ["Immigration", "Policy", "Reform"],
  ["Education", "Society", "Policy"],
  ["Security", "Technology", "Defense"],
  ["Urban", "Development", "Society"],
  ["Climate", "Economics", "Future"],
  ["Justice", "Reform", "Society"],
  ["Technology", "Privacy", "Rights"],
  ["Trade", "Global", "Economics"],
  ["Health", "Mental", "Society"],
  ["Energy", "Environment", "Economy"],
  ["Transportation", "Urban", "Policy"],
];

export const generateMockVideos = (page: number, perPage: number) => {
  const startIndex = (page - 1) * perPage;
  const videos = [];

  for (let i = 0; i < perPage; i++) {
    const id = startIndex + i + 1;
    const titleIndex = (id - 1) % titles.length;
    const topic = Object.keys(topicImages)[id % Object.keys(topicImages).length];
    const topicImageArray = topicImages[topic as keyof typeof topicImages];
    const imageIndex = id % topicImageArray.length;

    videos.push({
      id,
      title: titles[titleIndex],
      thumbnail: `${topicImageArray[imageIndex]}?w=320&h=180&fit=crop`,
      channel: channels[id % channels.length],
      views: `${Math.floor(Math.random() * 900 + 100)}K`,
      timestamp: `${Math.floor(Math.random() * 14 + 1)} days ago`,
      duration: `${Math.floor(Math.random() * 20 + 5)}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`,
      tags: tags[id % tags.length],
      likes: Math.floor(Math.random() * 5000 + 500)
    });
  }

  return videos;
}; 