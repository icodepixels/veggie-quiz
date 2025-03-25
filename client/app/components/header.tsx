import HeaderClient from './HeaderClient';
import { Category } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
async function getCategories(): Promise<string[]> {
  const response = await fetch(`${API_URL}/api/categories`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
}

export default async function Header() {
  const categoryNames = await getCategories();
  const categories: Category[] = categoryNames.map(name => ({
    name,
    image: `/images/${name}.jpg`
  }));

  return <HeaderClient categories={categories} />;
}