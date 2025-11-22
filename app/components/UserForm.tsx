"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { User } from "../lib/types";
import api from "../lib/api";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
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

  const darkMode = useStore((state) => state.darkMode);
  const addActivity = useStore((state) => state.addActivity);

  // Prefill form when editing a user
  useEffect(() => {
    if (user) {
      // Delay the state update to next tick
      const timeout = setTimeout(() => {
        setFormData({
          name: user.name,
          email: user.email,
          phone: user.phone,
          companyName: user.company.name,
        });
      });
      return () => clearTimeout(timeout);
    }
  }, [user]);

  const queryClient = useQueryClient();
  const usersQueryKey: QueryKey = ["users"];

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
      await queryClient.cancelQueries({ queryKey: usersQueryKey });
      const previousUsers = queryClient.getQueryData<User[]>(usersQueryKey);

      if (user) {
        queryClient.setQueryData<User[]>(usersQueryKey, (old) =>
          old?.map((u) =>
            u.id === user.id
              ? {
                ...u,
                ...newData,
                company: { ...u.company, name: newData.companyName },
              }
              : u
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
          {
            id: Date.now(),
            name: newData.name,
            email: newData.email,
            phone: newData.phone,
            company: {
              name: newData.companyName,
              catchPhrase: "",
              bs: "",
            },
            username: "",
            address: { street: "", city: "", zipcode: "" },
            website: "",
          },
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
      queryClient.invalidateQueries({ queryKey: usersQueryKey });
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
        <Dialog.Content
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 p-6 rounded-2xl shadow-xl z-50 border transition-colors
            ${darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900"}
          `}
        >
          <Dialog.Title className="text-2xl font-bold mb-4">
            {user ? "Edit User" : "Add User"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {["name", "email", "phone", "companyName"].map((field) => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                placeholder={field === "companyName" ? "Company" : field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field as keyof FormData]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
                required
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors
                  ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}
                `}
              />
            ))}

            <div className="flex justify-end gap-2 mt-2">
              <Dialog.Close
                className={`px-4 py-2 rounded-lg border transition-colors
                  ${darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"}
                `}
              >
                Cancel
              </Dialog.Close>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
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
