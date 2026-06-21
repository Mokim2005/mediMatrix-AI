export default function LoadingPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5 text-center">
        {/* Spinner */}
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#10B981]/20 border-t-[#10B981]" />
          <div
            className="absolute h-8 w-8 animate-spin rounded-full border-2 border-[#10B981]/10 border-b-[#10B981]"
            style={{ animationDuration: "0.8s" }}
          />
        </div>

        {/* Text */}
        <div>
          <p className="text-sm font-semibold text-[#E2E8F0]">Loading...</p>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Preparing your health data...
          </p>
        </div>
      </div>
    </div>
  );
}
