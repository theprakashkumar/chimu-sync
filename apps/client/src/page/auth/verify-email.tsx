import { useMutation } from "@tanstack/react-query";
import { Loader, MailXIcon } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { verifyEmailMutationFn } from "@/lib/api";
import { AUTH_ROUTES } from "@/routes/common/routePaths";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const code = params.get("code");

  const { mutate, isPending } = useMutation({
    mutationFn: verifyEmailMutationFn,
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!code) {
      toast({
        title: "Error",
        description: "Invalid link!",
        variant: "destructive",
      });
      return;
    }
    mutate(
      { code },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Email verified successfully!",
            variant: "default",
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
      },
    );
  };

  if (!code) {
    return (
      <main className="w-80 mx-auto min-h-[590px] h-full max-w-full flex items-center justify-center">
        <div className="w-full h-full p-5 rounded-md flex flex-col items-center justify-center gap-2">
          <MailXIcon
            size="48px"
            className="text-destructive mb-2 animate-bounce"
          />
          <h1 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold">
            Invalid verification link
          </h1>
          <p className="mb-4 text-sm text-muted-foreground dark:text-[#f1f7feb5] font-normal">
            The verification link is missing or malformed. Please check your
            email and try again.
          </p>
          <Link to={AUTH_ROUTES.SIGN_IN}>
            <Button className="h-[40px]">Go to login</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="w-80 mx-auto min-h-[590px] h-full max-w-full flex items-center justify-center">
      <div className="w-full h-full p-5 rounded-md">
        <h1
          className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold mb-4 mt-8
        text-center sm:text-left"
        >
          Verify Email
        </h1>
        <p className="mb-6 sm:text-left text-[15px] dark:text-[#f1f7feb5] font-normal">
          To verify your email, please click the button below.
        </p>
        <form onSubmit={onSubmit}>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full text-[15px] h-[40px] text-white font-semibold"
          >
            {isPending && <Loader className="animate-spin" />}
            Verify email
          </Button>
        </form>
      </div>
    </main>
  );
};

export default VerifyEmail;
