import { useRouter } from 'next/dist/client/router';

export default function Home() {
  const router = useRouter();

  if (typeof window !== 'undefined') {
    router.push('home');
  }

  return <div>home</div>;
}
