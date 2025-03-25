export interface QuestionnaireQuestion {
    id: number;
    text: string;
    type: 'scale' | 'special';
    specialType?: 'securityWall' | 'balloon' | 'dartThrow';
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
            sections: {
                label: string;
                value: number;
            }[];
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
      totalStones: 12
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

export const hobbiesQuestions = [
  {
    id: 'h1',
    text: 'How interested are you in discussing movies, TV shows, or entertainment trends?',
    type: 'scale'
  },
  {
    id: 'h2',
    text: 'How much do you enjoy talking about music—listening, discovering new artists, or playing instruments?',
    type: 'scale'
  },
  {
    id: 'h3',
    text: 'How interested are you in video games, board games, or strategy-based games?',
    type: 'scale'
  },
  {
    id: 'h4',
    text: 'How much do you enjoy talking about food—cooking, trying new restaurants, or exploring different cuisines?',
    type: 'scale'
  },
  {
    id: 'h5',
    text: 'How excited are you to talk about travel experiences, places you\'ve been, or places you want to visit?',
    type: 'scale'
  },
  {
    id: 'h6',
    text: 'How much do you enjoy discussing books, stories, or interesting articles you\'ve read?',
    type: 'scale'
  },
  {
    id: 'h7',
    text: 'How much do you enjoy talking about sports—whether watching games, playing, or following teams?',
    type: 'special',
    specialType: 'dartBoard'  // Make sure this matches exactly what the component is checking for
  },
  {
    id: 'h8',
    text: 'How interested are you in talking about technology, new gadgets, or digital trends?',
    type: 'scale'
  },
  {
    id: 'h9',
    text: 'How much do you enjoy discussing art, photography, design, or DIY projects?',
    type: 'scale'
  },
  {
    id: 'h10',
    text: 'How excited are you to talk about science, space, or cool facts about the world?',
    type: 'scale'
  },
  {
    id: 'h11',
    text: 'How much do you enjoy discussing funny topics, internet trends, memes, or random trivia?',
    type: 'scale'
  },
  {
    id: 'h12',
    text: 'How interested are you in talking about history, world cultures, or interesting past events?',
    type: 'scale'
  }
];