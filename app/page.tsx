import { redirect } from 'next/navigation';
import { getAuthFromCookies } from '@/lib/auth';

export default function Home() {
  const auth = getAuthFromCookies();
  
  if (!auth) {
    redirect('/login');
  }
  
  if (auth.role === 'admin') {
    redirect('/admin');
  }
  
  if (auth.role === 'wali_kelas') {
    redirect('/wali-kelas');
  }
  
  redirect('/student');
}
