
'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
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
  updateProfile,
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
import Link from 'next/link';

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
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
    defaultValues: { name: "", email: "", password: "" },
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
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await updateProfile(userCredential.user, {
        displayName: values.name,
      })
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
    <div className="w-full h-screen flex items-center justify-center">
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
                <Tabs defaultValue="sign-in" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                        <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sign-in">
                         <div className="grid gap-2 text-center mt-8">
                            <h1 className="text-3xl font-bold font-headline">Welcome Back</h1>
                            <p className="text-balance text-muted-foreground">
                                Enter your credentials to access your account
                            </p>
                         </div>
                         <Form {...signInForm}>
                          <form onSubmit={signInForm.handleSubmit(handleSignIn)}>
                            <div className="grid gap-4 mt-4">
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
                                     <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <Link href="#" className="ml-auto inline-block text-sm underline">
                                            Forgot your password?
                                        </Link>
                                    </div>
                                    <FormControl>
                                      <Input type="password" {...field} disabled={isLoading || isGoogleLoading} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
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
                            </div>
                          </form>
                        </Form>
                    </TabsContent>
                    <TabsContent value="sign-up">
                        <div className="grid gap-2 text-center mt-8">
                            <h1 className="text-3xl font-bold font-headline">Create an Account</h1>
                            <p className="text-balance text-muted-foreground">
                                Enter your information to create an account
                            </p>
                        </div>
                         <Form {...signUpForm}>
                          <form onSubmit={signUpForm.handleSubmit(handleSignUp)}>
                            <div className="grid gap-4 mt-4">
                                <FormField
                                    control={signUpForm.control}
                                    name="name"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                        <Input placeholder="Jane Doe" {...field} disabled={isLoading || isGoogleLoading}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
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
                            </div>
                          </form>
                        </Form>
                    </TabsContent>
                </Tabs>
            </div>
          </div>
          <div className="hidden bg-muted lg:block">
            <Image
              src="https://picsum.photos/seed/login-scholar/1200/1800"
              alt="Image"
              width="1920"
              height="1080"
              className="h-full w-full object-cover dark:brightness-[0.3] dark:grayscale"
              data-ai-hint="library books"
            />
          </div>
        </div>
    </div>
  );
}

    