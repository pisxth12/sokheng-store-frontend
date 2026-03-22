export const LoadingSpinner = ({ message = "Loading" }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 bg-white/85 dark:bg-[#0f0f0e]/85 backdrop-blur-md">

      {/* Three pulsing dots */}
      <div className="flex items-center gap-2.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-1.5 h-1.5 rounded-full bg-[#c8102e]"
            style={{
              animation: "ld-pulse 1.5s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Label */}
      <span
        className="text-[0.65rem] tracking-[0.22em] uppercase text-[#a3a39f] dark:text-[#5a5a57] font-normal select-none"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {message}
      </span>

      <style>{`
        @keyframes ld-pulse {
          0%, 100% { transform: scale(1);   opacity: 0.2; }
          50%       { transform: scale(1.6); opacity: 1;   }
        }
      `}</style>
    </div>
  );
};