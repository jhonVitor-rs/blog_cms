interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  message?: string;
  showLogo?: boolean;
}

export function LoadingSpinner({
  size = "medium",
  message = "Carregando...",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-10 h-10",
    large: "w-16 h-16",
  };

  const Spinner = () => (
    <div className={`${sizeClasses[size]} relative`}>
      {/* Spinner principal */}
      <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
      <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>

      {/* Efeito de pulso */}
      <div className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-20 animate-ping"></div>
    </div>
  );

  return (
    <div className="flex items-center space-x-3">
      <Spinner />
      {message && (
        <span className="text-gray-600 dark:text-gray-400">{message}</span>
      )}
    </div>
  );
}
