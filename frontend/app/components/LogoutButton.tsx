"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      className="button button-quiet"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      خروج
    </button>
  );
}
