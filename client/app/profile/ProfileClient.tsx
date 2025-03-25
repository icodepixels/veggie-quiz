'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CategoryStat {
  average_score: number;
  category: string;
  quizzes_taken: number;
}

interface OverallStats {
  average_score: number;
  highest_score: number;
  lowest_score: number;
  total_quizzes: number;
  unique_quizzes: number;
}

interface UserStats {
  category_stats: CategoryStat[];
  email: string;
  overall_stats: OverallStats;
}

export default function ProfileClient() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      const email = localStorage.getItem('userEmail');

      if (!email) {
        router.push('/');
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:9000/api/users/${encodeURIComponent(email)}/stats`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const data = await response.json();
        setStats(data);
      } catch {
        setError('Failed to load profile statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  // Helper function to round numbers
  const roundScore = (score: number) => Math.round(score);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#43855b]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/"
            className="text-[#43855b] hover:text-[#2d5d3c] underline"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-[#f8f6f0] to-[#e8f5e9] rounded-tl-[32px] rounded-br-[32px] p-8 border border-[#43855b]/20 shadow-[#2d5d3c]/10">
        {/* Overall Stats */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#2d5d3c] mb-8">Your Quiz Statistics</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-4xl font-bold text-[#43855b] mb-2">
                {stats.overall_stats.total_quizzes}
              </div>
              <div className="text-[#2d5d3c]">Total Attempts</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-4xl font-bold text-[#43855b] mb-2">
                {stats.overall_stats.unique_quizzes}
              </div>
              <div className="text-[#2d5d3c]">Unique Quizzes</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-4xl font-bold text-[#43855b] mb-2">
                {roundScore(stats.overall_stats.average_score)}%
              </div>
              <div className="text-[#2d5d3c]">Average Score</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-4xl font-bold text-[#43855b] mb-2">
                {roundScore(stats.overall_stats.highest_score)}%
              </div>
              <div className="text-[#2d5d3c]">Highest Score</div>
            </div>
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#2d5d3c] mb-6">Categories Performance</h2>
          <div className="grid grid-cols-1 gap-4">
            {stats.category_stats.map((categoryStat) => (
              <div
                key={categoryStat.category}
                className="bg-white rounded-lg p-6 flex flex-wrap md:flex-nowrap justify-between items-center gap-4"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2d5d3c] capitalize">
                    {categoryStat.category}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {categoryStat.quizzes_taken} quizzes taken
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-[#43855b]/10 text-[#43855b] px-4 py-2 rounded-full">
                    <span className="font-bold">{roundScore(categoryStat.average_score)}%</span>
                    <span className="text-sm ml-1">avg</span>
                  </div>
                  <Link
                    href={`/quizzes/${categoryStat.category}`}
                    className="text-[#43855b] hover:text-[#2d5d3c] font-medium"
                  >
                    Try More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Display */}
        <div className="text-center text-sm text-gray-600">
          Signed in as: <span className="font-medium">{stats.email}</span>
        </div>
      </div>
    </div>
  );
}