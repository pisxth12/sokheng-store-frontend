// app/actions/user.actions.ts
"use server";

import { cookies } from "next/headers";
import { apiServerService } from "@/lib/api/server";
import { revalidatePath } from "next/cache";

export async function updateUserProfile() {

  const updatedUser = await apiServerService.put("/users/me");
  revalidatePath("/profile");
  return updatedUser;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  revalidatePath("/");
}