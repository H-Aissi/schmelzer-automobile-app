// T-005
'use client';

export default function PublicError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-xl font-semibold text-gray-900">
        Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.
      </p>
      <button
        onClick={reset}
        className="rounded-[10px] bg-accent px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        Erneut versuchen
      </button>
    </div>
  );
}
