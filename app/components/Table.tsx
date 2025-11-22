"use client";


import { User } from "../lib/types";
import { useState, useMemo } from "react";
import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

interface TableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function Table({ users, onEdit, onDelete }: TableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);


  const filteredUsers = useMemo(() => {
    let filtered = users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
    if (companyFilter) filtered = filtered.filter(user => user.company.name === companyFilter);
    filtered.sort((a, b) =>
      sortAsc
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email)
    );
    return filtered;
  }, [users, search, sortAsc, companyFilter]);

  const uniqueCompanies = Array.from(new Set(users.map(u => u.company.name)));

  return (
    <div className="overflow-x-auto">
  {/* Search + Filter + Sort */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
    <input
      type="text"
      placeholder="Search by name..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/3"
    />

    <Select.Root onValueChange={setCompanyFilter}>
      <Select.Trigger className="inline-flex items-center border px-3 py-2 rounded shadow-sm w-48 justify-between">
        <Select.Value placeholder="Filter by company" />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Content className="mt-2 rounded shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-48">
        <Select.Viewport>
          <Select.Item value="All Companies" >
            <Select.ItemText>All Companies</Select.ItemText>
            <Select.ItemIndicator>
              <CheckIcon />
            </Select.ItemIndicator>
          </Select.Item>
          {uniqueCompanies.map((c) => (
            <Select.Item
              key={c}
              value={c}
              className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white cursor-pointer flex justify-between"
            >
              <Select.ItemText>{c}</Select.ItemText>
              <Select.ItemIndicator>
                <CheckIcon />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>

    <button
      onClick={() => setSortAsc(!sortAsc)}
      className="border px-3 py-2 rounded shadow-sm bg-blue-500 text-white hover:bg-blue-600 transition"
    >
      Sort Email {sortAsc ? "A-Z" : "Z-A"}
    </button>
  </div>

  {/* Table */}
  <table className="min-w-full border-collapse border border-slate-300 dark:border-gray-700 rounded-lg overflow-hidden">
    <thead>
      <tr className="bg-gray-100 dark:bg-gray-800">
        <th className="border p-2 text-left">Avatar</th>
        <th className="border p-2 text-left">Name</th>
        <th className="border p-2 text-left">Email</th>
        <th className="border p-2 text-left">Phone</th>
        <th className="border p-2 text-left">Company</th>
        <th className="border p-2 text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredUsers.length === 0 ? (
        <tr>
          <td colSpan={6} className="text-center p-4 text-gray-500 dark:text-gray-400">
            No users found.
          </td>
        </tr>
      ) : (
        filteredUsers.map((u) => (
          <tr
            key={u.id}
            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            onClick={() => router.push(`/users/${u.id}`)}
          >
            <td className="border p-2 font-bold text-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                {u.name.split(" ").map((n) => n[0]).join("")}
              </div>
            </td>
            <td className="border p-2">{u.name}</td>
            <td className="border p-2">{u.email}</td>
            <td className="border p-2">{u.phone}</td>
            <td className="border p-2">{u.company.name}</td>
            <td className="border p-2 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(u);
                }}
                className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded transition"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(u);
                }}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition"
              >
                Delete
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

  );
}
