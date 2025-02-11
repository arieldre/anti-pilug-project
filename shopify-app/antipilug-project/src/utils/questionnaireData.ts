export interface QuestionnaireQuestion {
    id: number;
    text: string;
    type: 'scale' | 'special';
    specialType?: string;
}

export const politicalQuestions: QuestionnaireQuestion[] = [
    { id: 1, text: "How strongly do you support Israel's right to self-defense?", type: "scale" },
    { id: 2, text: "Rate your support for peace negotiations with neighboring states.", type: "scale" },
    { id: 3, text: "How important is maintaining national security for you?", type: "scale" },
    { id: 4, text: "How do you view the balance between civil liberties and security measures?", type: "scale" },
    { id: 5, text: "Rate Israel's approach to international diplomacy.", type: "scale" },
    { id: 6, text: "How much do you agree with increasing investments in defense?", type: "scale" },
    { id: 7, text: "Special: Drag the balance icon to indicate your preferred equilibrium between security and freedom.", type: "special", specialType: "balance" },
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
    { id: 7, text: "Special: Drag the balloon to show your level of enthusiasm for new hobbies.", type: "special", specialType: "balloon" },
    { id: 8, text: "Rate your interest in technology and new gadgets.", type: "scale" },
    { id: 9, text: "How creative do you consider yourself?", type: "scale" },
    { id: 10, text: "To what extent do you believe hobbies improve your well-being?", type: "scale" },
];