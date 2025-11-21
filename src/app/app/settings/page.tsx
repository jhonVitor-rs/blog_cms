import { notFound } from "next/navigation";
import { UserForm } from "./_components/user-form";
import { getUser } from "./actions";

export default async function SettingsPage() {
  const user = await getUser();
  if (!user) {
    notFound();
  }

  return <UserForm user={user} />;
}
