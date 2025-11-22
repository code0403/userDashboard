//  user list table + pagination
'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../lib/api";
import Table from "../components/Table";
import UserForm from "../components/UserForm";
import DeleteDialog from "../components/DeleteDialog";
import Pagination from "../components/Pagination";
import { User } from "../lib/types";



export default function UsersPage() {
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  console.log("Users in UsersPage:", users);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(users.length / pageSize);

  const paginatedUsers = users.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-6">
      <button
        onClick={() => {
          console.log("Add User button clicked");
          setSelectedUser(null);
          setFormOpen(true);
        }}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Add User
      </button>

      {isLoading ? <div>Loading...</div> : (
        <>
          <Table
            users={paginatedUsers}
            onEdit={(user: User) => { setSelectedUser(user); setFormOpen(true); }}
            onDelete={(user: User) => { setSelectedUser(user); setDeleteOpen(true); }}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </>
      )}

      {/* Dialogs */}
      {/* User Form Dialog — always rendered */}
      <UserForm
        user={selectedUser || undefined} // undefined for Add, user object for Edit
        open={isFormOpen}
        onOpenChange={setFormOpen}
      />

      {/* Delete Dialog — only render when a user is selected */}
      {selectedUser && (
        <DeleteDialog
          user={selectedUser}
          open={isDeleteOpen}
          onOpenChange={setDeleteOpen}
        />
      )}
    </div>
  );
}
