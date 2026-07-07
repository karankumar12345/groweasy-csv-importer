import ThemeToggle from "./theme-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 border-b  backdrop-blur ">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold">
          AI CSV Importer
        </h1>

        <ThemeToggle />
      </div>
    </header>
  );
}