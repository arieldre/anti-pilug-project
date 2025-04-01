import React from 'react';
import { QuestionnaireQuestion } from '../utils/questionnaireData';

interface ScaleQuestionProps {
  question: QuestionnaireQuestion;
  value: number;
  onChange: (value: number) => void;
}

const ScaleQuestion: React.FC<ScaleQuestionProps> = ({ question, value, onChange }) => {
  // Calculate the percentage for the background gradient
  const percentage = ((value - 1) / 9) * 100;
  
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
          style={{
            background: `linear-gradient(to right, #1976D2 ${percentage}%, #e0e0e0 ${percentage}%)`
          }}
        />
        <span className="scale-value">{value}</span>
      </div>
    </div>
  );
};

export default ScaleQuestion;