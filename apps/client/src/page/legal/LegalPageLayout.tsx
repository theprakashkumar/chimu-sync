import { Link } from "react-router-dom";
import Logo from "@/components/logo";

type LegalPageLayoutProps = {
  title: string;
  children: React.ReactNode;
};

const LegalPageLayout = ({ title, children }: LegalPageLayoutProps) => {
  return (
    <div className="min-h-svh bg-muted px-6 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Link
            to="/"
            className="flex w-fit items-center gap-2 font-medium hover:opacity-80"
          >
            <Logo url="/" />
            Chimu Sync
          </Link>
          <Link
            to="/"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
          >
            Back to home
          </Link>
        </div>

        <article className="rounded-xl border bg-background p-6 shadow-sm md:p-10">
          <h1 className="mb-6 text-3xl font-bold tracking-tight">{title}</h1>
          <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
            {children}
          </div>
        </article>
      </div>
    </div>
  );
};

export default LegalPageLayout;
