'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import SignUpModal from '../../../components/SignUpModal';

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
  category: string;
  questions: Question[];
  description: string;
  quiz: {
    name: string;
    category: string;
    description: string;
    difficulty: string;
    id: number;
    image: string;
  };
}

interface ResultsClientProps {
  quiz: Quiz;
  userAnswers: number[];
  quizId: string;
}

interface QuizResult {
  quiz_id: number;
  score: number;
  answers: { [key: number]: number };
}

export default function ResultsClient({
  quiz,
  userAnswers,
  quizId,
}: ResultsClientProps) {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [resultsSaved, setResultsSaved] = useState(false);
  const saveAttempted = useRef(false);

  const correctAnswers = userAnswers.filter(
    (answer, index) => answer === quiz.questions?.[index]?.correct_answer_index
  )?.length;

  const score = Math.round((correctAnswers / quiz.questions?.length) * 100);

  const saveQuizResults = async (email: string) => {
    if (saveAttempted.current) return;
    saveAttempted.current = true;

    try {
      const formattedAnswers = quiz.questions.reduce((acc, question, index) => {
        acc[question.id] = userAnswers[index];
        return acc;
      }, {} as { [key: number]: number });

      const result: QuizResult = {
        quiz_id: quiz.id,
        score,
        answers: formattedAnswers,
      };

      const response = await fetch(`http://localhost:9000/api/users/${encodeURIComponent(email)}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });

      if (response.ok) {
        setResultsSaved(true);
      } else {
        saveAttempted.current = false;
        console.error('Failed to save quiz results');
      }
    } catch (error) {
      saveAttempted.current = false;
      console.error('Error saving quiz results:', error);
    }
  };

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      setShowSignUpModal(true);
    } else {
      saveQuizResults(userEmail);
    }
  }, []); // Empty dependency array

  const handleModalClose = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setShowSignUpModal(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-[#f8f6f0] to-[#e8f5e9] rounded-tl-[32px] rounded-br-[32px] p-8 border border-[#43855b]/20 shadow-[#2d5d3c]/10">
          {/* Score Summary */}
          <div className="text-center mb-12">
            <div className="text-2xl font-bold text-[#2d5d3c]">Results</div>
            <h2 className="text-3xl font-bold text-[#2d5d3c]">{quiz.name}</h2>
            <p className="text-lg text-[#2d5d3c] mb-8">{quiz.description}</p>

            <div className="inline-block bg-white rounded-full p-8 mb-6">
              <div className="text-6xl font-bold text-[#43855b]">{score}%</div>
            </div>

            <div className="text-xl text-[#2d5d3c]">
              You got <span className="font-bold">{correctAnswers}</span> out of <span className="font-bold">{quiz.questions?.length}</span> questions correct!
            </div>

            {resultsSaved && (
              <div className="mt-4 text-sm text-[#43855b]">
                ✓ Results saved to your account
              </div>
            )}
          </div>

          {/* Question Review */}
          <div className="space-y-8">
            {quiz.questions.map((question, index) => (
              <div
                key={question.id}
                className={`p-6 rounded-lg ${
                  userAnswers[index] === question.correct_answer_index
                    ? 'bg-green-50/50'
                    : 'bg-red-50/50'
                }`}
              >
                <h3 className="text-xl font-semibold mb-4 text-[#2d5d3c]">
                  Question {index + 1}: {question.question_text}
                </h3>

                <div className="space-y-2 mb-4">
                  {question.choices.map((choice, choiceIndex) => (
                    <div
                      key={choiceIndex}
                      className={`p-4 rounded-lg ${
                        choiceIndex === question.correct_answer_index
                          ? 'bg-green-100/50 border-green-200'
                          : choiceIndex === userAnswers[index]
                          ? 'bg-red-100/50 border-red-200'
                          : 'bg-white'
                      } border`}
                    >
                      <span className="inline-block w-8 h-8 rounded-full bg-[#43855b]/10 text-[#43855b] text-center leading-8 mr-4">
                        {String.fromCharCode(65 + choiceIndex)}
                      </span>
                      {choice}
                      {choiceIndex === question.correct_answer_index && (
                        <span className="ml-2 text-green-600">✓ Correct Answer</span>
                      )}
                      {choiceIndex === userAnswers[index] && choiceIndex !== question.correct_answer_index && (
                        <span className="ml-2 text-red-600">✗ Your Answer</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-sm bg-white p-4 rounded-lg text-[#2d5d3c]">
                  <strong>Explanation:</strong> {question.explanation}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex-wrap md:flex-nowrap mt-12 flex justify-center gap-4">
            <Link
              href="/"
              className="inline-block bg-[#43855b] text-white text-xl font-semibold px-12 py-4 rounded-full hover:bg-[#2d5d3c] transition-colors"
            >
              Try Another Quiz
            </Link>
            <Link
              href={`/quiz/${quizId}`}
              className="inline-block bg-white text-[#43855b] text-xl font-semibold px-12 py-4 rounded-full border-2 border-[#43855b] hover:bg-[#43855b] hover:text-white transition-colors"
            >
              Retake This Quiz
            </Link>
          </div>
        </div>
      </div>

      <SignUpModal
        isOpen={showSignUpModal}
        onClose={handleModalClose}
        onSignUpSuccess={(email) => {
          saveQuizResults(email);
          setShowSignUpModal(false);
        }}
      />
    </>
  );
}