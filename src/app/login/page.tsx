'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  useAuth,
  useUser,
} from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { FirebaseError } from 'firebase/app';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});


const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Google</title>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.62-4.38 1.62-3.8 0-6.88-3.1-6.88-7s3.08-7 6.88-7c2.05 0 3.58.77 4.75 1.82l2.75-2.75C19.43 1.93 16.36 0 12.48 0 5.88 0 .02 5.82 0 12.87s5.86 12.87 12.48 12.87c7.42 0 12.02-4.93 12.02-12.42 0-.8-.08-1.57-.2-2.35z" />
    </svg>
  );

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
  });


  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleAuthError = (error: any) => {
    let title = 'Authentication Failed';
    let description = 'An unexpected error occurred. Please try again.';

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/user-not-found':
          description = 'No account found with this email. Please sign up.';
          break;
        case 'auth/wrong-password':
          description = 'Incorrect password. Please try again.';
          break;
        case 'auth/email-already-in-use':
          description = 'This email is already in use. Please sign in.';
          break;
        case 'auth/invalid-email':
            description = 'The email address is not valid.';
            break;
        case 'auth/weak-password':
            description = 'The password is too weak.';
            break;
        case 'auth/popup-closed-by-user':
            title = 'Sign-in Canceled';
            description = 'The Google sign-in window was closed.';
            break;
        case 'auth/cancelled-popup-request':
            return; // Don't show toast if there are multiple popups
        default:
          description = error.message;
          break;
      }
    }
    toast({ title, description, variant: 'destructive' });
  };
  
  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    if (!auth) return;
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      // onAuthStateChanged will handle the redirect
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    if (!auth) return;
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      // onAuthStateChanged will handle the redirect
    } catch (error) {
        handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the redirect
    } catch (error) {
        handleAuthError(error);
    } finally {
        setGoogleLoading(false);
    }
  };

  if (isUserLoading || (!isUserLoading && user)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background px-4">
       <Tabs defaultValue="sign-in" className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="sign-in">
            <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
                <CardDescription>
                Enter your credentials to access your account.
                </CardDescription>
            </CardHeader>
            <Form {...signInForm}>
              <form onSubmit={signInForm.handleSubmit(handleSignIn)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} disabled={isLoading || isGoogleLoading}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} disabled={isLoading || isGoogleLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                            </span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
                        {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                        Google
                    </Button>
                </CardFooter>
              </form>
            </Form>
            </Card>
        </TabsContent>
        <TabsContent value="sign-up">
            <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
                <CardDescription>
                Enter your email and password to get started.
                </CardDescription>
            </CardHeader>
             <Form {...signUpForm}>
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)}>
                <CardContent className="space-y-4">
                    <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input placeholder="m@example.com" {...field} disabled={isLoading || isGoogleLoading}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                            <Input type="password" {...field} disabled={isLoading || isGoogleLoading}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign Up
                    </Button>
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                            </span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
                        {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                        Google
                    </Button>
                </CardFooter>
              </form>
            </Form>
            </Card>
        </TabsContent>
        </Tabs>
    </div>
  );
}
    