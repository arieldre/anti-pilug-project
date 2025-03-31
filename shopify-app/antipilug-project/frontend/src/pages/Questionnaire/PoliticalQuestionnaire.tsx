import React, { useState } from 'react';
import { politicalQuestions } from '../../utils/questionnaireData';
import PoliticalScaleQuestion from '../../components/PoliticalScaleQuestion';
// Import other components for special question types as needed

interface PoliticalQuestionnaireProps {
  onComplete: (answers: Record<string | number, any>) => void;
}

const PoliticalQuestionnaire: React.FC<PoliticalQuestionnaireProps> = ({ onComplete }) => {
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
    <div className="political-questionnaire">
      <h2>Political Preferences</h2>
      {politicalQuestions.map((question) => (
        <div key={String(question.id)} className="question-container">
          {question.type === 'scale' ? (
            <PoliticalScaleQuestion
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
        disabled={politicalQuestions.some(q => !answers.hasOwnProperty(q.id))}
      >
        Submit
      </button>
    </div>
  );
};

export default PoliticalQuestionnaire;