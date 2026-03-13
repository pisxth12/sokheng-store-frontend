'use client';

import { FileText } from 'lucide-react';

interface Props {
  onDownload: () => void;
  loading?: boolean;
}

export default function ReportPDFButton({ onDownload, loading }: Props) {
  return (
    <button
      onClick={onDownload}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      <FileText className="w-4 h-4" />
      {loading ? 'Generating...' : 'Download PDF'}
    </button>
  );
}