'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Logo() {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/');
    router.refresh(); 
  };

  return (
    <Link 
      href="/" 
      className="flex items-center gap-2 group"
      onClick={handleClick}
    >
      <div className="flex flex-col">
        <span className="text-xl font-bold leading-tight">
          PISETH SORN
        </span>
        <span className="text-xs tracking-wider">
        </span>
      </div>
    </Link>
  );
}