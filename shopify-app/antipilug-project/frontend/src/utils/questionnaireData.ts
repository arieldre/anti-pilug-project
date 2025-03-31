export interface QuestionnaireQuestion {
  id: number | string;
  text: string;
  type: "scale" | "special";  // This restricts the type to only these two values
  specialType?: string;
  options?: {
    leftSide?: {
      label: string;
      icon: string;
      description: string;
    };
    rightSide?: {
      label: string;
      icon: string;
      description: string;
    };
    totalStones?: number;
    hobbies?: {
      label: string;
      icon: string;
    }[];
    totalEnergy?: number;
    dartboard?: {
      sections?: {
        label: string;
        value: number;
      }[];
      maxScore?: number;
      randomPlacement?: boolean;
    };
  };
}

export const politicalQuestions: QuestionnaireQuestion[] = [
  {
    id: 1,
    text: "Religion and State – To what extent do you support allowing freedom of choice in matters such as public transportation on Shabbat, business operations on Shabbat, and civil marriage, without religious restrictions?",
    type: "scale"
  },
  {
    id: 2,
    text: "The Israeli-Palestinian Conflict – To what extent do you support a political resolution to the Israeli-Palestinian conflict, even if it requires territorial concessions or changes in national security?",
    type: "scale"
  },
  {
    id: 3,
    text: "Economy and Society – To what extent should the state intervene in reducing economic inequality through taxation on the wealthy or the expansion of welfare programs?",
    type: "scale"
  },
  {
    id: 4,
    text: "Gender Equality and LGBTQ+ Rights – How strongly do you support granting full rights to LGBTQ+ couples, including marriage, family formation, and legal equality?",
    type: "scale"
  },
  {
    id: 5,
    text: "Judicial System – How much do you believe there is a need to balance political authority and the independence of the judiciary?",
    type: "scale"
  },
  {
    id: 6,
    text: "Haredi-Secular Relations – Should the state condition economic support for the Haredi community on requirements such as workforce integration or civil service participation?",
    type: "scale"
  },
  {
    id: 7,
    text: "National Security – To what extent should Israel proactively engage in military actions to ensure its security, even if it risks international escalation or regional tensions?",
    type: "special",
    specialType: "securityWall",
    options: {
      leftSide: {
        label: "Proactive Security",
        icon: "🛡️",
        description: "Support preemptive military actions"
      },
      rightSide: {
        label: "Diplomatic Approach",
        icon: "🤝",
        description: "Prefer diplomatic solutions"
      },
      totalStones: 10
    }
  },
  {
    id: 8,
    text: "Education – How important is it that all Israeli schools provide a standardized core curriculum alongside maintaining unique cultural content?",
    type: "scale"
  },
  {
    id: 9,
    text: "Immigration and National Identity – To what extent do you support opening Israel's borders to asylum seekers, even if it could impact the Jewish identity of the state?",
    type: "scale"
  },
  {
    id: 10,
    text: "Environmental Sustainability – How important is it that the government imposes strict regulations on polluting industries, even if it comes at the cost of economic growth?",
    type: "scale"
  },
  {
    id: 11,
    text: "Freedom of Speech and Media – To what extent should the government regulate media and social platforms to prevent misinformation or incitement versus preserving free speech?",
    type: "scale"
  },
  {
    id: 12,
    text: "Military Service and National Duty – Should mandatory military service be required for all citizens, including Arab and Haredi populations?",
    type: "scale"
  }
];

// Make sure your hobbiesQuestions array has all 12 questions:
export const hobbiesQuestions: QuestionnaireQuestion[] = [
  {
    id: "hobby1",
    text: "How passionate are you about music—listening, discovering new artists, or playing instruments?",
    type: "scale"
  },
  {
    id: "hobby2",
    text: "How much do you enjoy movies, TV shows, or entertainment trends?",
    type: "scale"
  },
  {
    id: "hobby3",
    text: "How important are books, stories, or interesting articles in your life?",
    type: "scale"
  },
  {
    id: "hobby4",
    text: "How excited do you get about technology, new gadgets, or digital trends?",
    type: "scale"
  },
  {
    id: "hobby5",
    text: "How much pleasure do you take in food—cooking, trying new restaurants, or exploring different cuisines?",
    type: "scale"
  },
  {
    id: "hobby6",
    text: "How much do you value travel experiences, visiting new places, or planning future trips?",
    type: "scale"
  },
  {
    id: "hobby7",
    text: "How passionate are you about sports—watching games, playing, or following teams?",
    type: "special",
    specialType: "dartThrow",
    options: {
      dartboard: {
        maxScore: 10,
        randomPlacement: true
      }
    }
  },
  {
    id: "hobby8",
    text: "How much fun do you have with video games, board games, or strategy-based activities?",
    type: "scale"
  },
  {
    id: "hobby9",
    text: "How drawn are you to art, photography, design, or DIY projects?",
    type: "scale"
  },
  {
    id: "hobby10",
    text: "How fascinating do you find science, space exploration, or interesting facts about our world?",
    type: "scale"
  },
  {
    id: "hobby11",
    text: "How much do you appreciate humor, internet trends, memes, or random trivia?",
    type: "scale"
  },
  {
    id: "hobby12",
    text: "How curious are you about history, world cultures, or significant past events?",
    type: "scale"
  }
];