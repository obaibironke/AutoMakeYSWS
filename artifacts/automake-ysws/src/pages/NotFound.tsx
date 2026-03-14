import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#D1DCCF] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl mb-6">🤖</div>
      <h1 className="font-serif text-5xl font-bold text-[#3B2F3E] mb-4">404</h1>
      <p className="font-sans text-xl text-[#424242] mb-2">This page doesn't exist.</p>
      <p className="font-sans text-base text-[#424242] mb-10 max-w-md">
        Looks like this automation didn't complete successfully. Head back home and try again.
      </p>
      <Link href="/">
        <span className="font-sans font-semibold bg-[#3B2F3E] text-white px-8 py-4 rounded-lg text-base hover:bg-[#2d2330] transition-colors cursor-pointer inline-block">
          ← Back Home
        </span>
      </Link>
    </div>
  );
}
