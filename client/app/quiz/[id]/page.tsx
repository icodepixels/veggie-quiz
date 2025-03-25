import QuizClient from './QuizClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://veggie-quiz.onrender.com'
    : 'http://localhost:9000');
async function getQuizData(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/quizzes/${id}/questions`, {
      cache: 'no-store',  // Ensure we're getting fresh data
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Quiz fetch error:', error);
    throw new Error('Unable to load quiz. Please try again later.');
  }
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const resolvedParams = await params;
    const quiz = await getQuizData(resolvedParams.id);
    return <QuizClient quiz={quiz} quizId={resolvedParams.id} />;
  } catch {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <h2 className="text-lg font-semibold mb-2">Error Loading Quiz</h2>
        </div>
      </div>
    );
  }
}