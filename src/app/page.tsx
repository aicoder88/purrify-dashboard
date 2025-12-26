import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to dashboard (authentication disabled for development)
  redirect('/dashboard');
}
