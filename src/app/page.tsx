import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to enhanced dashboard as the default page
  redirect('/dashboard/enhanced');
}
