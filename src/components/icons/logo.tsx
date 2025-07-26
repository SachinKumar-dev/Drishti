import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>SentinelAI Logo</title>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      <path d="M12 22V12"></path>
      <path d="M20 14.5c-2.22-2.22-4.44-4.44-8-4.5s-5.78 2.28-8 4.5"></path>
      <path d="M12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"></path>
    </svg>
  );
}
