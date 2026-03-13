import Link from 'next/link';
import { Baby, Car, Guitar } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" className=" flex  items-center gap-2 group">
      {/* Icon */}
      {/* Text */}
      <div className="flex flex-col">
        <span className="text-xl font-bold  leading-tight">
          PISETH SORN
        </span>
        <span className="text-xs  tracking-wider">
        </span>
      </div>
    </Link>
  );
}