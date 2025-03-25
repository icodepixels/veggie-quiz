'use client';
import Link from 'next/link';
import Image from 'next/image';

interface Quiz {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  difficulty: string;
  created_at: string;
}

interface CategoryClientProps {
  quizzes: Quiz[];
}

export default function CategoryClient({ quizzes }: CategoryClientProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">{quizzes?.[0]?.category} Quizzes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quizzes.map((quiz: Quiz) => (
          <div
            key={quiz.id}
            className="bg-[#e8f7ec] rounded-tl-[32px] rounded-br-[32px] overflow-hidden p-6 hover:shadow-lg transition-all border border-[#a7ccb4] shadow-[#2d5d3c]/20 flex flex-col justify-between"
          >
            <div className="aspect-[4/3] relative mb-6 rounded-tl-[32px] rounded-br-[32px] overflow-hidden border-8 border-[#43855b]/60">
              <Image
                src="/images/vegan.png"
                alt={quiz.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="text-center px-4">
              <h2 className="text-[32px] leading-tight font-bold text-[#2d5d3c] mb-6">
                {quiz.name}
              </h2>
              <Link
                href={`/quiz/${quiz.id}`}
                className="inline-block bg-[#43855b] text-white text-xl font-semibold px-12 py-4 rounded-full hover:bg-[#2d5d3c] transition-colors"
              >
                Start Quiz!
              </Link>
            </div>
          </div>
        ))}
      </div>

      {quizzes.length === 0 && (
        <p className="text-center text-gray-600">
          No quizzes available.
        </p>
      )}
    </div>
  );
}