import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { politicalQuestions, hobbiesQuestions } from '../../utils/questionnaireData';
import ScaleQuestion from '../../components/ScaleQuestion';
import SpecialQuestion from '../../components/SpecialQuestion';
import './Questionnaire.scss';

const Questionnaire: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isPolitical, setIsPolitical] = useState(true);
  const navigate = useNavigate();
  const questions = isPolitical ? politicalQuestions : hobbiesQuestions;

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (isPolitical) {
      setIsPolitical(false);
      setCurrentQuestion(0);
    } else {
      navigate('/home');
    }
  };

  const question = questions[currentQuestion];

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-section">
        <h2>{isPolitical ? 'Political Views Questionnaire' : 'Hobbies and Values Questionnaire'}</h2>
        <div className="question-counter">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <TransitionGroup>
          <CSSTransition key={question.id} timeout={300} classNames="fade">
            <div className="question-container">
              {question.type === 'scale' ? (
                <ScaleQuestion question={question} />
              ) : (
                <SpecialQuestion question={question} />
              )}
            </div>
          </CSSTransition>
        </TransitionGroup>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default Questionnaire;