import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, BrainCircuit, Users } from 'lucide-react';

export default function Home() {

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: 'AI-Powered Search',
      description: 'Instantly find top research papers and articles using our intelligent agent.',
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: 'Automated Summarization',
      description: 'Get concise summaries and key findings for any paper, saving you hours of reading.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Collaborative Workspaces',
      description: 'Share, annotate, and discuss research with your team in a dedicated space.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between animate-fade-in">
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
          <h1 className="text-2xl font-bold font-headline text-foreground">Scholar Chat</h1>
        </div>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Get Started Free</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-bold font-headline text-foreground tracking-tight">
            Synthesize Research at the Speed of Thought
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            Scholar Chat is an AI-powered platform that helps you discover, understand, and connect research papers like never before.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/login">Start Your Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </section>

        <section id="features" className="bg-secondary/50 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in-up">
              <h3 className="text-3xl md:text-4xl font-bold font-headline text-foreground">A New Paradigm in Research</h3>
              <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
                Go beyond simple search. Understand the landscape of your field.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {features.map((feature, i) => (
                <Card key={feature.title} className="text-center animate-fade-in-up" style={{animationDelay: `${200 * (i + 1)}ms`}}>
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold font-headline text-foreground">Everything You Need to Get Ahead</h3>
              <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
                Packed with features for individual researchers and entire teams.
              </p>
            </div>
            <div className="mt-12 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {[
                'Trend Analysis and Visualization',
                'Conversational Research Assistant',
                'Filtering and Sorting Options',
                'Save, Annotate, and Create Collections',
                'User Authentication and Data Storage',
                'Responsive Dashboard UI',
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-secondary/50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Scholar Chat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
