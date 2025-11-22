"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { User } from "../lib/types";
import api from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "../lib/store";


interface UserFormProps {
  user?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  companyName: string; // store only name for input
}

export default function UserForm({ user, open, onOpenChange }: UserFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    companyName: "",
  });

  const addActivity = useStore((state) => state.addActivity);

  // Prefill form when editing a user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        companyName: user.company.name,
      });
    } else {
      setFormData({ name: "", email: "", phone: "", companyName: "" });
    }
  }, [user]);

  const queryClient = useQueryClient();

  const mutation = useMutation({

    mutationFn: (data: FormData) => {
      const payload = {
        ...data,
        company: { name: data.companyName },
      };

      if (user) {
        // Fake PUT request
        return api.put(`/users/${user.id}`, payload);
      } else {
        // Fake POST request
        return api.post("/users", payload);
      }
    },

    onMutate: async (newData) => {
      await queryClient.cancelQueries(["users"]);
      const previousUsers = queryClient.getQueryData<User[]>(["users"]);

      if (user) {
        queryClient.setQueryData<User[]>(["users"], (old) =>
          old?.map((u) =>
            u.id === user.id ? { ...u, ...newData, company: { name: newData.companyName } } : u
          )
        );
        // addActivity(`Edited user: ${user.name}`);
        addActivity({
          type: "edit",
          message: `Edited user: ${user.name}`,
          timestamp: new Date().toISOString(),
        });
      } else {
        queryClient.setQueryData<User[]>(["users"], (old) => [
          ...(old || []),
          { id: Date.now(), ...newData, company: { name: newData.companyName } },
        ]);
        // addActivity(`Added user: ${newData.name}`);
        addActivity({
          type: "add",
          message: `Added user: ${newData.name}`,
          timestamp: new Date().toISOString(),
        });
      }

      return { previousUsers };
    },

    onError: (_err, _newData, context: any) => {
      queryClient.setQueryData(["users"], context.previousUsers);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["users"]);
      onOpenChange(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />

        {/* Content */}
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl z-50 border border-gray-200 dark:border-gray-700">
          <Dialog.Title className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {user ? "Edit User" : "Add User"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
              required
            />
            <input
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
              required
            />
            <input
              type="text"
              placeholder="Company"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
              required
            />

            <div className="flex justify-end gap-2 mt-2">
              <Dialog.Close className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                Cancel
              </Dialog.Close>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
              >
                {user ? "Save" : "Add"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
