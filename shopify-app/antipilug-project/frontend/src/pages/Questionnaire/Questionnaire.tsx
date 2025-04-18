import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { politicalQuestions, hobbiesQuestions } from '../../utils/questionnaireData';
import PoliticalScaleQuestion from '../../components/PoliticalScaleQuestion';
import HobbiesScaleQuestion from '../../components/HobbiesScaleQuestion';
import SpecialQuestion from '../../components/SpecialQuestion';
import './Questionnaire.scss';

const Questionnaire = () => {
  const [isPolitical, setIsPolitical] = useState(true);
  const [answers, setAnswers] = useState<Record<string | number, any>>({});
  const [missingQuestions, setMissingQuestions] = useState<(string | number)[]>([]);
  const [showMissingAlert, setShowMissingAlert] = useState(false);
  const navigate = useNavigate();

  // Reset effect
  useEffect(() => {
    console.log('Questionnaire component mounted', new Date().toISOString());
    setIsPolitical(true);
    setAnswers({});
    setMissingQuestions([]);
    setShowMissingAlert(false);
    
    return () => {
      console.log('Questionnaire component unmounted', new Date().toISOString());
    };
  }, []);

  // Debug effect
  useEffect(() => {
    console.log("Political questions:", politicalQuestions.length);
    console.log("Hobbies questions:", hobbiesQuestions.length);
  }, []);

  // Scroll effect
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [isPolitical]);

  // Handle answer updates
  const handleAnswer = (questionId: string | number, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    
    // If this question was previously missing, remove it from the missing list
    if (missingQuestions.includes(questionId)) {
      setMissingQuestions(prev => prev.filter(id => id !== questionId));
      if (missingQuestions.length === 1) {
        setShowMissingAlert(false);
      }
    }
  };

  // Progress calculation
  const progress = isPolitical ? 25 : 75;

  // Check for missing questions
  const checkMissingQuestions = () => {
    const currentQuestions = isPolitical ? politicalQuestions : hobbiesQuestions;
    const missing = currentQuestions
      .filter(question => !answers.hasOwnProperty(question.id))
      .map(question => question.id);
    
    setMissingQuestions(missing);
    return missing.length === 0;
  };

  // Handle next button click
  const handleNext = () => {
    if (isPolitical) {
      // Check if all questions are answered
      const allQuestionsAnswered = checkMissingQuestions();
      if (allQuestionsAnswered) {
        // Move from political to hobbies questions
        setIsPolitical(false);
        setShowMissingAlert(false);
      } else {
        setShowMissingAlert(true);
        // Scroll to the first missing question
        if (missingQuestions.length > 0) {
          const firstMissingId = missingQuestions[0];
          const element = document.getElementById(`question-${firstMissingId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    } else {
      // Finished both sections
      navigate('/home');
    }
  };

  // Handle previous button click
  const handlePrevious = () => {
    if (!isPolitical) {
      setIsPolitical(true);
      setShowMissingAlert(false);
    }
  };

  // Current questions based on section
  const currentQuestions = isPolitical ? politicalQuestions : hobbiesQuestions;

  return (
    <div className="questionnaire-container">
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      
      {/* This ensures showMissingAlert is used */}
      {showMissingAlert && missingQuestions.length > 0 && (
        <div className="missing-questions-alert">
          <p>Please complete all questions before continuing. You have {missingQuestions.length} unanswered questions:</p>
          <ul>
            {missingQuestions.map(id => {
              const question = currentQuestions.find(q => q.id === id);
              return (
                <li key={String(id)}>
                  <a href={`#question-${id}`} onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(`question-${id}`)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center'
                    });
                  }}>
                    {question?.text.substring(0, 50)}...
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
      <div className="questionnaire-section">
        <h2>{isPolitical ? 'Political Preferences' : 'Interests & Hobbies'}</h2>
        
        {currentQuestions.map((question) => (
          <div 
            key={String(question.id)} 
            className={`question-container ${missingQuestions.includes(question.id) ? 'missing' : ''}`}
            id={`question-${question.id}`}
          >
            {question.type === 'scale' ? (
              isPolitical ? (
                <PoliticalScaleQuestion
                  question={question}
                  value={answers[question.id] || 5}
                  onChange={(value) => handleAnswer(question.id, value)}
                />
              ) : (
                <HobbiesScaleQuestion
                  question={question}
                  value={answers[question.id] || 5}
                  onChange={(value) => handleAnswer(question.id, value)}
                />
              )
            ) : (
              <SpecialQuestion
                question={question}
                value={answers[question.id] || 0}
                onChange={(value) => handleAnswer(question.id, value)}
              />
            )}
          </div>
        ))}
        
        <div className="navigation-buttons">
          {/* Only show Previous button on second page */}
          {!isPolitical && (
            <button 
              className="previous-button"
              onClick={handlePrevious}
            >
              Previous
            </button>
          )}
          
          {/* Always show Next/Continue button but with dynamic text */}
          <button 
            className="next-button"
            onClick={handleNext}
          >
            {isPolitical ? 'Continue to Hobbies' : 'Finish'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;