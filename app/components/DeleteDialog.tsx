"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { User } from "../lib/types";
import api from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "../lib/store";


interface DeleteDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteDialog({ user, open, onOpenChange }: DeleteDialogProps) {
  const queryClient = useQueryClient();
  const addActivity = useStore((state) => state.addActivity);

  const mutation = useMutation({
    mutationFn: () => api.delete(`/users/${user.id}`),
    onMutate: async () => {
      await queryClient.cancelQueries(["users"]);
      const previousUsers = queryClient.getQueryData<User[]>(["users"]);

      queryClient.setQueryData<User[]>(["users"], (old) =>
        old?.filter((u) => u.id !== user.id)
      );

      // addActivity(`Deleted user: ${user.name}`);
      addActivity({
        type: "delete",
        message: `Deleted user: ${user.name}`,
        timestamp: new Date().toISOString(),
      });

      return { previousUsers };
    },
    onError: (_err, _variables, context: any) => {
      queryClient.setQueryData(["users"], context.previousUsers);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["users"]);
      onOpenChange(false);
    },
  });

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl z-50 border border-gray-200 dark:border-gray-700">
          <AlertDialog.Title className="text-xl font-bold text-red-600 mb-2">
            Delete User
          </AlertDialog.Title>
          <AlertDialog.Description className="text-gray-700 dark:text-gray-200 mb-4">
            Are you sure you want to delete <span className="font-semibold">{user.name}</span>? This action cannot be undone.
          </AlertDialog.Description>

          <div className="flex justify-end gap-3 mt-4">
            <AlertDialog.Cancel className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              Cancel
            </AlertDialog.Cancel>
            <AlertDialog.Action
              onClick={() => mutation.mutate()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Delete
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
