import { useMutation, useQuery } from "@tanstack/react-query";
import SessionItem from "./SessionItem";
import { getAllSessionQueryFn, sessionDelMutationFn } from "@/lib/api";
import { Loader } from "lucide-react";
import { useCallback } from "react";
import { toast } from "@/hooks/use-toast";

const Sessions = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["sessions"],
    queryFn: getAllSessionQueryFn,
  });
  const currentSession = data?.sessions?.find((session) => session.isCurrent);
  const nonCurrentSession = data?.sessions?.filter(
    (session) => !session.isCurrent,
  );

  const { mutate, isPending } = useMutation({
    mutationFn: sessionDelMutationFn,
  });

  const handleDelete = useCallback(
    (id: string) => {
      mutate(id, {
        onSuccess: () => {
          refetch();
          toast({
            title: "Success",
            description: "Session removed successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
      });
    },
    [mutate, refetch],
  );

  return (
    <div className="via-root to-root rounded-xl bg-gradient-to-r p-0.5">
      <div className="rounded-[10px] p-6">
        <h3 className="text-xl tracking-[-0.16px] text-slate-12 font-bold mb-1">
          Sessions
        </h3>
        <p className="mb-6 max-w-xl text-sm text-[#0007149f] dark:text-gray-100 font-normal">
          Sessions are the devices you are using or that have used your Squeezy
          These are the sessions where your account is currently logged in. You
          can log out of each session.
        </p>

        <div className="rounded-t-xl max-w-xl">
          <div>
            <h5 className="text-base font-semibold">Current active session</h5>
            <p className="mb-6 text-sm text-[#0007149f] dark:text-gray-100">
              You’re logged into this Squeezy account on this device and are
              currently using it.
            </p>
          </div>
          {isLoading ? (
            <Loader size="35px" className="animate-spin" />
          ) : (
            <div className="w-full">
              <div className="w-full">
                {currentSession && (
                  <SessionItem
                    loading={isLoading}
                    userAgent={currentSession.userAgent}
                    date={currentSession.createdAt}
                    expiresAt={currentSession.expiresAt}
                    isCurrent={currentSession.isCurrent}
                  />
                )}
              </div>
              <div className="mt-4">
                <h5 className="text-base font-semibold">Other sessions</h5>
                <ul className="mt-4">
                  {nonCurrentSession?.map((session) => {
                    return (
                      <li key={session._id}>
                        <SessionItem
                          loading={isPending}
                          userAgent={session.userAgent}
                          date={session.createdAt}
                          expiresAt={session.expiresAt}
                          isCurrent={session.isCurrent}
                          onRemove={() => handleDelete(session._id)}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sessions;
