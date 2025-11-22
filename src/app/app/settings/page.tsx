import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { AccountSettings } from "./_components/account-settings";
import { DeleteAccount } from "./_components/delete-account";
import { UpdatePassword } from "./_components/update-password";
import { UserForm } from "./_components/user-form";
import { getUser } from "./actions";

export default async function SettingsPage() {
  const user = await getUser();
  if (!user) {
    notFound();
  }

  return (
    <div className="w-full space-y-6 py-6">
      <Suspense fallback={<LoadingSpinner />}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserForm user={user} />
          <UpdatePassword />
        </div>
        <AccountSettings />
        <DeleteAccount />
      </Suspense>
    </div>
  );
}
