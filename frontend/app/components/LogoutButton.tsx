"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      className="rounded-full border border-rose-200 px-4 py-2 hover:bg-rose-50 disabled:opacity-60"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      خروج
    </button>
  );
}
