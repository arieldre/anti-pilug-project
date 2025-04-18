import React, { useState } from 'react';
import { hobbiesQuestions, QuestionnaireQuestion } from '../../utils/questionnaireData';
import HobbiesScaleQuestion from '../../components/HobbiesScaleQuestion';
// Import other components as needed

interface HobbiesQuestionnaireProps {
  onComplete: (answers: Record<string | number, any>) => void;
}

const HobbiesQuestionnaire: React.FC<HobbiesQuestionnaireProps> = ({ onComplete }) => {
  const [answers, setAnswers] = useState<Record<string | number, any>>({});

  const handleAnswer = (questionId: string | number, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  return (
    <div className="hobbies-questionnaire">
      <h2>Interests & Hobbies</h2>
      {hobbiesQuestions.map((question: QuestionnaireQuestion) => (  // Add the type annotation here
        <div key={String(question.id)} className="question-container">
          {question.type === 'scale' ? (
            <HobbiesScaleQuestion
              question={question}
              value={answers[question.id] || 5}
              onChange={(value) => handleAnswer(question.id, value)}
            />
          ) : (
            // Handle special question types here
            <div>Special question component would go here</div>
          )}
        </div>
      ))}
      <button 
        className="submit-button"
        onClick={handleSubmit}
        disabled={hobbiesQuestions.some(q => !answers.hasOwnProperty(q.id))}
      >
        Submit
      </button>
    </div>
  );
};

export default HobbiesQuestionnaire;