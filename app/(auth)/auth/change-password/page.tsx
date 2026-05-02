import { redirect } from "next/navigation";

export default function ChangePasswordPage() {
  redirect("/auth/profile?tab=change-password");
}

