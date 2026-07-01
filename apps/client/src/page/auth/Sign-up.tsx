import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Loader, MailCheckIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import GoogleOauthButton from "@/components/auth/google-oauth-button";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { registerMutationFn } from "@/lib/api";

const SignUp = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const { mutate, isPending } = useMutation({
    mutationFn: registerMutationFn,
  });

  const formSchema = z
    .object({
      name: z.string().trim().min(1, {
        message: "Name is required",
      }),
      email: z.string().trim().email("Invalid email address").min(1, {
        message: "Workspace name is required",
      }),
      password: z.string().trim().min(1, {
        message: "Password is required",
      }),
      confirmPassword: z.string().trim().min(1, {
        message: "Password is required",
      }),
    })
    .refine((val) => val.password === val.confirmPassword, {
      message: "Password does not match!",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "pk",
      email: "maiprakashkumar@gmail.com",
      password: "12345",
      confirmPassword: "12345",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;

    mutate(values, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <span className="flex items-center gap-2 self-center font-medium">
          <Logo url="/" />
          Chimu Sync
        </span>

        <div className="flex flex-col gap-6">
          <Card>
            {!isSubmitted ? (
              <>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Create an account</CardTitle>
                  <CardDescription>
                    Signup with your Email or Google account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="grid gap-6">
                        <div className="flex flex-col gap-4">
                          <GoogleOauthButton label="Signup" />
                        </div>
                        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                          <span className="relative z-10 bg-background px-2 text-muted-foreground">
                            Or continue with
                          </span>
                        </div>
                        <div className="grid gap-2">
                          <div className="grid gap-2">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                    Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Joh Doe"
                                      className="!h-[48px]"
                                      {...field}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid gap-2">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                    Email
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="m@example.com"
                                      className="!h-[48px]"
                                      autoComplete="email"
                                      {...field}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid gap-2">
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                    Password
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      className="!h-[48px]"
                                      {...field}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid gap-2">
                            <FormField
                              control={form.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                    Confirm Password
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      className="!h-[48px]"
                                      {...field}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button
                            disabled={isPending}
                            type="submit"
                            className="w-full"
                          >
                            {isPending && <Loader className="animate-spin" />}
                            Sign up
                          </Button>
                        </div>
                        <div className="text-center text-sm">
                          Already have an account?{" "}
                          <Link to="/" className="underline underline-offset-4">
                            Sign in
                          </Link>
                        </div>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </>
            ) : (
              <div className="w-full h-60 flex flex-col gap-2 items-center justify-center rounded-md">
                <div className="size-[48px]">
                  <MailCheckIcon size="48px" className="animate-bounce" />
                </div>
                <h2 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold">
                  Check your email
                </h2>
                <p className="mb-2 text-center text-sm text-muted-foreground dark:text-[#f1f7feb5] font-normal">
                  {`We just sent a verification link to ${form.getValues().email}`}
                </p>
                <a href="/">
                  <Button className="h-[40px]">
                    Go to login
                    <ArrowRight />
                  </Button>
                </a>
              </div>
            )}
          </Card>
          {!isSubmitted && (
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
              By clicking continue, you agree to our{" "}
              <a href="/terms-of-service">Terms of Service</a> and{" "}
              <a href="/privacy-policy">Privacy Policy</a>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
