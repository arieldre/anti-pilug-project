import React from 'react';
import { QuestionnaireQuestion } from '../utils/questionnaireData';

interface ScaleQuestionProps {
  question: QuestionnaireQuestion;
  value: number;
  onChange: (value: number) => void;
}

const ScaleQuestion: React.FC<ScaleQuestionProps> = ({ question, value, onChange }) => {
  return (
    <div className="scale-question">
      <p>{question.text}</p>
      <div className="scale-container">
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
        />
        <span className="scale-value">{value}</span>
      </div>
    </div>
  );
};

export default ScaleQuestion;