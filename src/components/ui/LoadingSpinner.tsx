export const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-[#f2f3f5]/50 dark:bg-[#1a1a1a]/55 z-50 flex flex-col items-center justify-center gap-3.5">
      <div className="w-10 h-10 rounded-full border-[3px] border-slate-200/60 dark:border-slate-600/30 border-t-blue-500 dark:border-t-blue-400 animate-spin" />
      <p className="text-[0.8rem] font-medium tracking-wide text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
};