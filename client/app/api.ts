const API_URL = process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://veggie-quiz.onrender.com'
    : 'http://localhost:9000');

export const fetchData = async () => {
    const response = await fetch(`${API_URL}/your-endpoint`);
    return response.json();
}