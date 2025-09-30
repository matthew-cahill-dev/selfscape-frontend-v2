export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-bg/80 backdrop-blur">
      <div className="mx-auto max-w-[1100px] px-4 py-3 flex items-center justify-between">
        <div className="text-lg font-semibold tracking-tight">Selfscape</div>
        <nav className="flex items-center gap-5 text-sm opacity-90">
          <a href="/">Home</a>
          <a href="/timeline">Timeline</a>
          <a href="/social">Social</a>
          <a href="/saved-insights">Insights</a>
          <a href="/profile">Profile</a>
        </nav>
      </div>
    </header>
  );
}
