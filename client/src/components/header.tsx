import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "./ui/separator";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAuthContext } from "@/context/auth-provider";

const Header = () => {
  const location = useLocation();
  const params = useParams();
  const { user } = useAuthContext();

  const paramWorkspaceId = params.workspaceId as string | undefined;
  const workspaceId =
    paramWorkspaceId ?? user?.currentWorkspace?._id ?? undefined;

  const pathname = location.pathname;
  const dashboardHref = workspaceId ? `/workspace/${workspaceId}` : "/";

  const getPageLabel = (path: string) => {
    if (path.includes("/account")) return "Account";
    if (path.includes("/project/")) return "Project";
    if (path.includes("/settings")) return "Settings";
    if (path.includes("/tasks")) return "Tasks";
    if (path.includes("/members")) return "Members";
    return null;
  };

  const pageHeading = getPageLabel(pathname);

  return (
    <header className="flex sticky top-0 z-50 bg-white  h-12 shrink-0 items-center border-b">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block text-[15px]">
              {pageHeading ? (
                <BreadcrumbLink asChild>
                  <Link to={dashboardHref}>Dashboard</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="line-clamp-1 ">
                  Dashboard
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {pageHeading && (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="text-[15px]">
                  <BreadcrumbPage className="line-clamp-1">
                    {pageHeading}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default Header;
