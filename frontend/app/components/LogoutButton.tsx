"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-full border border-[#e8c6d1] px-4 py-2 font-semibold text-[#a84766] transition hover:bg-[#fff0f3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c65f7d]"
    >
      خروج
    </button>
  );
}
