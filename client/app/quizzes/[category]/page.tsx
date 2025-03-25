import CategoryClient from './CategoryClient';

async function getQuizzesByCategory(category: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
  const res = await fetch(
    `${API_URL}/api/quizzes?category=${category}`,
    { cache: 'no-store' }
  );
  return res.json();
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  const decodedCategory = decodeURIComponent(resolvedParams.category);
  const quizzes = await getQuizzesByCategory(decodedCategory);

  return <CategoryClient quizzes={quizzes} />;
}