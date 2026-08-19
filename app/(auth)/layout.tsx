export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      {children}
      {/* Subtle background decoration, per Stitch worklyn_login_branding_update */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 opacity-50 blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-secondary-container/30 opacity-50 blur-3xl" />
      </div>
    </div>
  );
}
