import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center h-screen justify-center min-h-screenpx-4 py-16 text-center">
      <h1 className="text-6xl font-bold  mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-100 mb-8">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link 
        href="/"
        className="inline-block border-2   px-6 py-3   transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}