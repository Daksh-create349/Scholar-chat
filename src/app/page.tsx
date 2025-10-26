import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-20"
      >
        <source src="https://cdn.pixabay.com/video/2024/05/18/212509_large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="fixed top-0 left-0 w-full h-full bg-black/60 -z-10"></div>

      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between animate-fade-in z-10">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-primary"
          >
            <path d="M3.5 2.7c.3 0 .6.1.8.4l1.8 2.9v11.5c0 .9-.7 1.6-1.6 1.6H3.5c-.9 0-1.6-.7-1.6-1.6V4.7c0-.9.7-1.6 1.6-1.6h.1z"></path>
            <path d="M20.5 2.7c-.3 0-.6.1-.8.4l-1.8 2.9v11.5c0 .9.7 1.6 1.6 1.6h1.1c.9 0 1.6-.7 1.6-1.6V4.7c0-.9-.7-1.6-1.6-1.6h-.1z"></path>
            <path d="M8.9 2.1l5.2 2.7c.3.1.5.4.5.8v13.2c0 .5-.3.9-.8 1L8.9 22.5c-.3-.2-.5-.5-.5-.8V2.9c0-.5.3-.9.8-1.2z"></path>
          </svg>
          <h1 className="text-2xl font-bold font-headline text-white">Scholar Chat</h1>
        </div>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild className="text-white hover:bg-white/10 hover:text-white">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Get Started Free</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-grow flex items-center z-10">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-bold font-headline text-white tracking-tight">
            Synthesize Research at the Speed of Thought
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-200">
            Scholar Chat is an AI-powered platform that helps you discover, understand, and connect research papers like never before.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/login">Start Your Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-transparent border-white text-white hover:bg-white hover:text-black">
              <Link href="/learn-more">Learn More</Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="py-8 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Scholar Chat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
