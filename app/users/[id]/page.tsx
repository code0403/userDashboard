'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { User } from '@/app/lib/types';
import { getUserById } from '@/app/lib/api';
import { ArrowLeftIcon } from '@radix-ui/react-icons';


export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id;

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  if (isLoading) return <div className="p-6">Loading...</div>;

  if (!user) return <div className="p-6">User not found</div>;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <div className="mt-12 p-6 max-w-xl mx-auto bg-white dark:bg-gray-800 rounded shadow-md">
      <button
        className="mb-4 flex items-center gap-2 text-blue-500 hover:underline cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className="w-5 h-5" /> Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold mb-4">
          {initials}
        </div>

        {/* Name */}
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          {user.name}
        </h1>

        {/* Email */}
        <p className="text-gray-700 dark:text-gray-300 mb-1">{user.email}</p>

        {/* Phone */}
        <p className="text-gray-700 dark:text-gray-300 mb-1">{user.phone}</p>

        {/* Company */}
        <p className="text-gray-700 dark:text-gray-300 mb-1">
          <span className="font-semibold">Company:</span> {user.company.name}
        </p>

        {/* Full Address */}
        <p className="text-gray-700 dark:text-gray-300 text-center">
          <span className="font-semibold">Address:</span> {user.address.street}, {user.address.city}, {user.address.zipcode}
        </p>
      </div>
    </div>
  );
}
