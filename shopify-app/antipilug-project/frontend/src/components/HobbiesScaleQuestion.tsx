import React from 'react';
import { QuestionnaireQuestion } from '../utils/questionnaireData';

interface HobbiesScaleQuestionProps {
  question: QuestionnaireQuestion;
  value: number;
  onChange: (value: number) => void;
}

const HobbiesScaleQuestion: React.FC<HobbiesScaleQuestionProps> = ({ question, value, onChange }) => {
  // Calculate the percentage for the background gradient
  const percentage = ((value - 1) / 9) * 100;
  
  return (
    <div className="hobbies-scale-question scale-question">
      <p className="question-text">{question.text}</p>
      <div className="scale-container">
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          style={{
            background: `linear-gradient(to right, #FF9800 ${percentage}%, #e0e0e0 ${percentage}%)`
          }}
          className="hobbies-slider"
        />
        <span className="scale-value">{value}</span>
      </div>
    </div>
  );
};

export default HobbiesScaleQuestion;