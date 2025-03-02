import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hobbiesQuestions } from '../../utils/questionnaireData';
import ScaleQuestion from '../../components/ScaleQuestion';
import SpecialQuestion from '../../components/SpecialQuestion';
import './Questionnaire.scss';

const HobbiesQuestionnaire: React.FC = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<number[]>(new Array(hobbiesQuestions.length).fill(5));

  const handleAnswerChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    // Here you can save the answers if needed
    navigate('/home');
  };

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-section">
        <h2>Hobbies and Values Questionnaire</h2>
        <div className="questions-list">
          {hobbiesQuestions.map((question, index) => (
            <div key={question.id} className="question-item">
              <div className="question-number">Question {index + 1}</div>
              {question.type === 'scale' ? (
                <ScaleQuestion 
                  question={question} 
                  value={answers[index]}
                  onChange={(value) => handleAnswerChange(index, value)}
                />
              ) : (
                <SpecialQuestion 
                  question={question}
                  value={answers[index]}
                  onChange={(value) => handleAnswerChange(index, value)}
                />
              )}
            </div>
          ))}
        </div>
        <button className="next-button" onClick={handleNext}>
          Finish Questionnaires
        </button>
      </div>
    </div>
  );
};

export default HobbiesQuestionnaire;