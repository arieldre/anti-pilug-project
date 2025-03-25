import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { politicalQuestions } from '../../utils/questionnaireData';
import ScaleQuestion from '../../components/ScaleQuestion';
import SpecialQuestion from '../../components/SpecialQuestion';
import './Questionnaire.scss';

const PoliticalQuestionnaire: React.FC = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<number[]>(new Array(politicalQuestions.length).fill(0));

  const handleAnswerChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    // Save answers if needed
    navigate('/questionnaire/hobbies'); // Updated from '/hobbies' to match router config
  };

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-section">
        <h2>Political Views Questionnaire</h2>
        <div className="questions-list">
          {politicalQuestions.map((question, index) => (
            <div key={question.id} className="question-item">
              <div className="question-number">Question {index + 1}</div>
              {question.type === 'special' ? (
                <SpecialQuestion 
                  question={question} 
                  value={answers[index]}
                  onChange={(value) => handleAnswerChange(index, value)}
                />
              ) : (
                <ScaleQuestion 
                  question={question} 
                  value={answers[index]}
                  onChange={(value) => handleAnswerChange(index, value)}
                />
              )}
            </div>
          ))}
        </div>
        <button className="next-button" onClick={handleNext}>
          Next Questionnaire
        </button>
      </div>
    </div>
  );
};

export default PoliticalQuestionnaire;