import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Frown, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { resetPasswordMutationFn } from "@/lib/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const verificationCode = params.get("verification-code");
  const [isValid, setIsValid] = useState<boolean>(!!verificationCode);

  const formSchema = z
    .object({
      password: z.string().trim().min(1, {
        message: "Password is required",
      }),
      confirmPassword: z.string().trim().min(1, {
        message: "Confirm password is required",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password does not match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: resetPasswordMutationFn,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!verificationCode) {
      navigate("/forgot-password?email=");
      return;
    }

    const data = {
      password: values.password,
      verificationCode: verificationCode,
    };

    mutate(data, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Password reset successfully!",
          variant: "success",
        });
        navigate("/");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  useEffect(() => {
    setIsValid(!!verificationCode);
  }, [verificationCode]);

  return (
    <main className="w-full min-h-[590px] h-full max-w-full flex items-center justify-center ">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <span className="flex items-center gap-2 self-center font-medium">
          <Logo url="/" />
          Chimu Sync
        </span>
        <Card>
          {isValid ? (
            <div className="w-full p-5 rounded-md">
              <h1
                className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold mb-6
        text-center sm:text-left w-fit mx-auto"
              >
                Set up a new password
              </h1>
              <p className="mb-6 text-center sm:text-left text-[15px] dark:text-[#f1f7feb5] font-normal">
                Your password must be different from your previous one.
              </p>
              <Form {...form}>
                <form
                  className="flex flex-col gap-6"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="mb-0">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                            New password
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your password"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-0">
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                            Confirm new password
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your password again"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    className="w-full text-[15px] h-[40px] text-white font-semibold"
                    disabled={isPending}
                  >
                    {isPending && <Loader className="animate-spin" />}
                    Update password
                  </Button>
                </form>
              </Form>
            </div>
          ) : (
            <div className="w-full h-60 flex flex-col gap-2 items-center justify-center rounded-md">
              <div className="size-[48px]">
                <Frown size="48px" className="animate-bounce text-red-500" />
              </div>
              <h2 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold">
                Invalid or expired reset link
              </h2>
              <p className="mb-2 text-center text-sm text-muted-foreground dark:text-[#f1f7feb5] font-normal">
                You can request a new password reset link
              </p>
              <Link to="/forgot-password?email=">
                <Button className="h-[40px]">
                  <ArrowLeft />
                  Go to forgot password
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
};

export default ResetPassword;
