interface ToothIconProps {
  size?: number;
  className?: string;
}

export default function ToothIcon({ size = 20, className = "" }: ToothIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
    >
      <path
        d="M50 15C38 15 25 25 25 40C25 50 25 55 25 65C25 70 27 75 30 80C32 83 35 85 38 87C40 88 42 89 44 90C46 91 48 92 50 92C52 92 54 91 56 90C58 89 60 88 62 87C65 85 68 83 70 80C73 75 75 70 75 65C75 55 75 50 75 40C75 25 62 15 50 15Z"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42 85C40 88 38 90 36 92C34 94 32 95 30 95C28 95 26 94 25 92C24 90 24 88 25 86C26 84 28 82 30 81C32 80 34 80 36 81C38 82 40 83 42 85Z"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M58 85C60 88 62 90 64 92C66 94 68 95 70 95C72 95 74 94 75 92C76 90 76 88 75 86C74 84 72 82 70 81C68 80 66 80 64 81C62 82 60 83 58 85Z"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}