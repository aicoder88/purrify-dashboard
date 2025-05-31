import { redirect } from 'next/navigation';

export default function HomePage() {
  // Simple redirect to login page
  redirect('/login');
}
