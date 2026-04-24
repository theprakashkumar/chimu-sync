import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { mfaRevokeMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useCallback } from "react";
import { Loader } from "lucide-react";

const RevokeMFA = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: mfaRevokeMutationFn,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
      toast({
        title: "Success",
        description: response.message,
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

  const submit = useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <Button
      disabled={isPending}
      onClick={submit}
      className="h-[35px] text-[#c40006d3] bg-red-100 shadow-none mr-1"
    >
      {isPending && <Loader className="animate-spin" />}
      Revoke Access
    </Button>
  );
};

export default RevokeMFA;
