"use client";


import { User } from "../lib/types";
import { useState, useMemo } from "react";
import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useStore } from "../lib/store";

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
  const darkMode = useStore((state) => state.darkMode);


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
          className={`border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/3 ${darkMode ? "bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400" : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
            }`}
        />

        <Select.Root onValueChange={setCompanyFilter}>
          <Select.Trigger
            className={`inline-flex items-center border px-3 py-2 rounded shadow-sm w-48 justify-between ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"
              }`}
          >
            <Select.Value placeholder="Filter by company" />
            <Select.Icon>
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Content
            className={`mt-2 rounded shadow-lg border w-48 ${darkMode ? "border-gray-700 bg-gray-800 text-gray-100" : "border-gray-200 bg-white text-gray-900"
              }`}
          >
            <Select.Viewport>
              <Select.Item value="All Companies">
                <Select.ItemText>All Companies</Select.ItemText>
                <Select.ItemIndicator>
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
              {uniqueCompanies.map((c) => (
                <Select.Item
                  key={c}
                  value={c}
                  className={`px-2 py-1 cursor-pointer flex justify-between transition-colors ${darkMode ? "hover:bg-gray-700 text-gray-100" : "hover:bg-gray-100 text-gray-900"
                    }`}
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
          className={ `border px-3 py-2 rounded shadow-sm transition ${darkMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Sort Email {sortAsc ? "A-Z" : "Z-A"}
        </button>
      </div>

      {/* Table */}
      <table
        className={`min-w-full border-collapse border rounded-lg overflow-hidden ${darkMode ? "border-gray-700" : "border-slate-300"
          }`}
      >
        <thead>
          <tr className={`${darkMode ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
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
              <td colSpan={6} className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-center p-4`}>
                No users found.
              </td>
            </tr>
          ) : (
            filteredUsers.map((u) => (
              <tr
                key={u.id}
                className={`cursor-pointer transition ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
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
                    className={`px-2 py-1 rounded transition ${darkMode ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "bg-yellow-400 hover:bg-yellow-500 text-white"
                      }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(u);
                    }}
                    className={`px-2 py-1 rounded transition ${darkMode ? "bg-red-700 hover:bg-red-800 text-white" : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
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
