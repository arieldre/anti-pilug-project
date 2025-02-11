import React from 'react';
import { QuestionnaireQuestion } from '../utils/questionnaireData';

interface SpecialQuestionProps {
  question: QuestionnaireQuestion;
}

const SpecialQuestion: React.FC<SpecialQuestionProps> = ({ question }) => {
  return (
    <div className="special-question">
      <p>{question.text}</p>
      {/* Implement the special interaction based on question.specialType */}
      {question.specialType === 'balance' && (
        <div className="balance-interaction">
          {/* Balance interaction implementation */}
        </div>
      )}
      {question.specialType === 'balloon' && (
        <div className="balloon-interaction">
          {/* Balloon interaction implementation */}
        </div>
      )}
    </div>
  );
};

export default SpecialQuestion;