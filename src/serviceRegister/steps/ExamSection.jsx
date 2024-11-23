import React, { useState } from 'react';

const ExamSection = ({ formData, handleChange, handlePrev, handleNext }) => {
  const electricianQuestions = [
    { question: 'What is the standard voltage in most households?', options: ['120V', '220V', '240V', '110V'], correct: '220V' },
    { question: 'What tool is used to check electrical current?', options: ['Wrench', 'Screwdriver', 'Multimeter', 'Hammer'], correct: 'Multimeter' },
    { question: 'What tool is used to check electrical current?', options: ['Wrench', 'Screwdriver', 'Multimeter', 'Hammer'], correct: 'Multimeter' },
    { question: 'What tool is used to check electrical current?', options: ['Wrench', 'Screwdriver', 'Multimeter', 'Hammer'], correct: 'Multimeter' },
  ];

  const plumberQuestions = [
    { question: 'What is used to join two pieces of pipe?', options: ['Hammer', 'Solder', 'Glue', 'Pipe wrench'], correct: 'Glue' },
    { question: 'What is the purpose of a P-trap?', options: ['To prevent backflow', 'To remove water', 'To prevent leaks', 'To seal the pipe'], correct: 'To prevent backflow' },
  ];

  const questions = formData.serviceType === 'Electrician' ? electricianQuestions : plumberQuestions;
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState(formData.examAnswers || Array(questions.length).fill(null));
  const [correctAnswers, setCorrectAnswers] = useState(Array(questions.length).fill(false));
  const [isAnswered, setIsAnswered] = useState(Array(questions.length).fill(false));
  const [errorMessage, setErrorMessage] = useState('');

  const handleAnswerChange = (index, answer) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    const newIsAnswered = [...isAnswered];
    newIsAnswered[index] = true;
    handleChange({ examAnswers: newAnswers });
    setAnswers(newAnswers);
    setIsAnswered(newIsAnswered);
    
    // Check if the answer is correct
    const isCorrect = questions[index].correct === answer;
    const newCorrectAnswers = [...correctAnswers];
    newCorrectAnswers[index] = isCorrect;
    setCorrectAnswers(newCorrectAnswers);
  };

  const handleSubmit = () => {
    const score = correctAnswers.filter(Boolean).length; // Calculate score
    const pass = score >= 1; // Pass if 1 or more correct

    handleChange({ examAnswers: answers, score, pass }); // Update formData with answers, score, and pass status
    setSubmitted(true);
  };

  const totalQuestions = questions.length;
  const score = correctAnswers.filter(Boolean).length;

  const validateAnswers = () => {
    const unanswered = answers.filter(answer => answer === null).length;
    if (unanswered > 0) {
      setErrorMessage(`Please answer all questions. You have ${unanswered} unanswered question(s).`);
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleNextWithValidation = () => {
    if (validateAnswers()) {
      handleNext();
    }
  };

  return (
    <>
      <div className="">
        <h2 className="text-xl font-bold mb-4">Exam - {formData.serviceType}</h2>
        <div className="mb-4 h-[500px] sm:h-[400px] overflow-y-auto">
          {questions.map((item, index) => (
            <div key={index} className="mb-4">
              <p className={`font-semibold ${isAnswered[index] && correctAnswers[index] === false ? 'text-red-500' : ''}`}>{item.question}</p>
              <div className="mt-2 space-y-2">
                {item.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={() => handleAnswerChange(index, option)}
                      className="text-blue-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
                {isAnswered[index] && (
                  <p className={correctAnswers[index] ? 'text-green-500' : 'text-red-500'}>
                    Answer: {correctAnswers[index] ? 'Your answer is correct' : `Incorrect. Correct answer is: ${item.correct}`}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        <button onClick={handleSubmit} className="btn bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Submit Answers</button>
        <div className=" absolute right-6 sm:bottom-16 bottom-24 bg-gray-300 p-3 rounded-lg ">
        {submitted && (
          <div className="mt-4">
            <h3 className="font-bold">Exam Result</h3>
            <p>{formData.pass ? 'Result: Pass' : 'Result: Fail'}</p>
            <p>Score: {score} out of {totalQuestions} ({((score / totalQuestions) * 100).toFixed(2)}%)</p>
          </div>
        )}
        </div>
      </div>
      
      <div className="absolute bottom-2 right-6 gap-12 flex justify-between mt-4">
        <button onClick={handlePrev} className="btn bg-gray-400 px-6 py-2 rounded hover:bg-gray-500">Previous</button>
        <button onClick={handleNextWithValidation} className="btn bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">Next</button>
      </div>
    </>
  );
};

export default ExamSection;
