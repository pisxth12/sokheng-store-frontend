'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './Header.css';

export default function Logo() {
  const router = useRouter();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/');
    router.refresh();
  };
  return (
    <Link href="/" className="hd-logo" onClick={handleClick}>
      <span className="hd-logo-text">PISETH SORN</span>
    </Link>
  );
}