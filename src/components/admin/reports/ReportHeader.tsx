'use client';

interface Props {
  title: string;
  subtitle: string;
}

export default function ReportHeader({ title, subtitle }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}