import Header from '@/components/Header';
import Layout from '@/components/Layout';
import { getSortedPostsData } from '@/lib/posts';
import type { Metadata } from 'next';
import YearPageClient from './YearPageClient';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  const years = new Set(posts.map((post) => {
    const date = new Date(post.date);
    return date.getFullYear().toString();
  }));

  return Array.from(years).map((year) => ({
    year,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `Posts de ${year} | Jadilson Guedes`,
    description: `Todos os artigos publicados em ${year}`,
  };
}

export default async function YearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const allPosts = getSortedPostsData();

  // Filter posts for this year
  const yearPosts = allPosts.filter((post) => {
    const date = new Date(post.date);
    return date.getFullYear().toString() === year;
  });

  // Group posts by month
  const postsByMonth = yearPosts.reduce((acc, post) => {
    const date = new Date(post.date);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(post);
    return acc;
  }, {} as Record<string, typeof yearPosts>);

  // Sort months in descending order
  const sortedMonths = Object.keys(postsByMonth).sort((a, b) => b.localeCompare(a));

  return (
    <Layout>
      <Header />
      <YearPageClient
        year={year}
        yearPosts={yearPosts}
        sortedMonths={sortedMonths}
        postsByMonth={postsByMonth}
      />
    </Layout>
  );
}
