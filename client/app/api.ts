const API_URL = typeof window === 'undefined'
  ? process.env.NEXT_PUBLIC_API_URL  // Server-side: use 'http://api:9000'
  : 'http://localhost:9000';         // Client-side: use localhost

export const fetchData = async () => {
    const response = await fetch(`${API_URL}/your-endpoint`);
    return response.json();
}