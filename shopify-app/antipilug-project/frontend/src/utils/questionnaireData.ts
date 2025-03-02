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
    { id: 1, text: "How strongly do you support Israel's right to self-defense?", type: "scale" },
    { id: 2, text: "Rate your support for peace negotiations with neighboring states.", type: "scale" },
    { id: 3, text: "How important is maintaining national security for you?", type: "scale" },
    { id: 4, text: "How do you view the balance between civil liberties and security measures?", type: "scale" },
    { id: 5, text: "Rate Israel's approach to international diplomacy.", type: "scale" },
    { id: 6, text: "How much do you agree with increasing investments in defense?", type: "scale" },
    {
        id: 7,
        text: "Build your security wall: Place stones to balance defensive measures with international cooperation",
        type: "special",
        specialType: "securityWall",
        options: {
            leftSide: {
                label: "Defense Measures",
                icon: "🛡️",
                description: "Strengthen internal security and defensive capabilities"
            },
            rightSide: {
                label: "International Cooperation",
                icon: "🤝",
                description: "Foster diplomatic relations and partnerships"
            },
            totalStones: 12
        }
    },
    { id: 8, text: "How much do you trust your political leaders?", type: "scale" },
    { id: 9, text: "Rate your optimism about Israel's future.", type: "scale" },
    { id: 10, text: "How strongly do you agree with current foreign trade policies?", type: "scale" },
];

export const hobbiesQuestions: QuestionnaireQuestion[] = [
    { id: 1, text: "How much do you enjoy outdoor activities?", type: "scale" },
    { id: 2, text: "Rate your passion for creative arts (e.g. painting, music).", type: "scale" },
    { id: 3, text: "How interesting do you find culinary exploration?", type: "scale" },
    { id: 4, text: "How important is physical fitness in your routine?", type: "scale" },
    { id: 5, text: "How engaged are you in reading or watching documentaries?", type: "scale" },
    { id: 6, text: "How often do you participate in community or social events?", type: "scale" },
    {
        id: 7,
        text: "Throw arrows to show your enthusiasm for sports activities",
        type: "special",
        specialType: "dartThrow"
    },
    { id: 8, text: "Rate your interest in technology and new gadgets.", type: "scale" },
    { id: 9, text: "How creative do you consider yourself?", type: "scale" },
    { id: 10, text: "To what extent do you believe hobbies improve your well-being?", type: "scale" },
];