import ResultsClient from './ResultsClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
async function getQuizData(id: string) {
  const response = await fetch(`${API_URL}/api/quizzes/${id}/questions`, {
    cache: 'no-store',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch quiz results');
  }
  return response.json();
}

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ answers: string }>;
}) {
  try {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const quiz = await getQuizData(resolvedParams.id);
    const userAnswers = resolvedSearchParams.answers?.split(',').map(Number) || [];

    return <ResultsClient
      quiz={quiz}
      userAnswers={userAnswers}
      quizId={resolvedParams.id}
    />;
  } catch {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <h2 className="text-lg font-semibold mb-2">Error Loading Results</h2>
          <p>Unable to load the quiz results. Please try again.</p>
        </div>
      </div>
    );
  }
}