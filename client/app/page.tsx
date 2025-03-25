import Link from 'next/link';

interface Quiz {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  difficulty: string;
  created_at: string;
}

interface CategorySamples {
  [category: string]: Quiz[];
}
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
async function getCategorySamples() {
  const response = await fetch(`${API_URL}/api/quizzes/category-samples`, {
    cache: 'no-store',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch category samples');
  }

  const data = await response.json();
  return data.samples as CategorySamples;
}

export default async function CategoriesPage() {
  const categorySamples = await getCategorySamples();

  return (
    <main className="container mx-auto px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h2 className="text-xl text-[#43855b] max-w-3xl mx-auto">
        🌱 Welcome to Veggie Quiz! 🥑 Ready to flex your plant-based knowledge? 🌿 From mighty mushrooms to powerful proteins,
          discover the amazing world of vegan cuisine! Pick a category below and let&apos;s grow together!
        </h2>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(categorySamples).map(([category, quizzes]) => (
          <div
            key={category}
            className="bg-gradient-to-br from-[#f8f6f0] to-[#e8f5e9] rounded-tl-[32px] rounded-br-[32px] p-6 border border-[#43855b]/20 shadow-[#2d5d3c]/10 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Category Header */}
            <div className="flex items-center mb-6">
              <h3 className="text-2xl font-bold text-[#2d5d3c] capitalize">
                {category}
              </h3>
            </div>

            {/* Quizzes List */}
            <div className="space-y-4">
              {quizzes.map(quiz => (
                <Link
                  key={quiz.id}
                  href={`/quiz/${quiz.id}`}
                  className="block transform transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="bg-white rounded-lg p-5 border border-[#43855b]/10 hover:border-[#43855b]/30 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-[#2d5d3c] text-lg group-hover:text-[#43855b] transition-colors">
                        {quiz.name}
                      </h4>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        quiz.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {quiz.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {quiz.description}
                    </p>
                    <div className="flex items-center text-[#43855b] text-sm font-medium">
                      Start Quiz
                      <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}