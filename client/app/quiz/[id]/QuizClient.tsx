'use client';
import { useState } from 'react';

import { useRouter } from 'next/navigation';

interface Question {
  id: number;
  question_text: string;
  choices: string[];
  correct_answer_index: number;
  explanation: string;
  image: string;
  category: string;
}

interface Quiz {
  id: number;
  name: string;
  questions: Question[];
  quiz: {
    name: string;
    category: string;
    description: string;
    difficulty: string;
    id: number;
    image: string;
  };
}

interface QuizClientProps {
  quiz: Quiz;
  quizId: string;
}

export default function QuizClient({ quiz, quizId }: QuizClientProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);

    // Add a slight delay before moving to next question for better UX
    setTimeout(() => {
      const newAnswers = [...answers, answerIndex];
      setAnswers(newAnswers);
      setSelectedAnswer(null);

      if (!isLastQuestion) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        router.push(`/quiz/${quizId}/results?answers=${newAnswers.join(',')}`);
      }
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-2 w-full bg-[#43855b]/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#43855b] transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-sm text-[#43855b]">
          <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
          <span>{Math.round((currentQuestionIndex + 1) / quiz.questions.length * 100)}% Complete</span>
        </div>
      </div>

      {/* Quiz card */}
      <div className="bg-gradient-to-br from-[#f8f6f0] to-[#e8f5e9] rounded-tl-[32px] rounded-br-[32px] p-8 border border-[#43855b]/20 shadow-[#2d5d3c]/10">
        {/* Question header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2d5d3c] mb-6">{quiz.name}</h1>

          <h2 className="text-2xl font-semibold text-[#2d5d3c] leading-relaxed">
            {currentQuestion.question_text}
          </h2>
        </div>

        {/* Answer choices */}
        <div className="space-y-4">
          {currentQuestion.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              className={`w-full text-left p-6 rounded-lg transition-all duration-200 border text-lg font-medium
                ${selectedAnswer === index
                  ? 'bg-[#43855b] text-white border-transparent transform scale-105'
                  : 'bg-white hover:bg-[#43855b] hover:text-white border-[#43855b]/20 hover:transform hover:scale-102'}
                ${selectedAnswer !== null && selectedAnswer !== index ? 'opacity-50' : ''}
                focus:outline-none focus:ring-2 focus:ring-[#43855b] focus:ring-offset-2`}
            >
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#43855b]/10 text-[#43855b] font-semibold mr-4">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-grow">{choice}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Question navigation */}
        <div className="mt-8 flex justify-between items-center text-sm text-[#43855b]">
          <div className="flex items-center space-x-2">
            {Array.from({ length: quiz.questions.length }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentQuestionIndex
                    ? 'bg-[#43855b] scale-125'
                    : index < currentQuestionIndex
                      ? 'bg-[#43855b]/50'
                      : 'bg-[#43855b]/20'
                }`}
              />
            ))}
          </div>
          <div className="font-medium">
            {isLastQuestion ? 'Final Question' : 'Choose your answer'}
          </div>
        </div>
      </div>
    </div>
  );
}