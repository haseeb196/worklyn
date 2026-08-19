import { Boxes } from "lucide-react";

export function Header({ userEmail }: { userEmail?: string | null }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-surface-container-lowest px-4 md:px-8">
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary">
          <Boxes className="h-4 w-4" />
        </div>
        <span className="font-semibold tracking-tight text-slate-900">
          Worklyn
        </span>
      </div>
      <div className="hidden md:block" />
      {userEmail && (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-sm font-semibold text-on-primary-container">
            {userEmail.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
    </header>
  );
}
