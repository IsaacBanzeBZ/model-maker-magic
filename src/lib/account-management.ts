import { supabase } from "@/integrations/supabase/client";

export type AccountManagementResponse = Record<string, unknown>;

export async function manageAccount<T extends AccountManagementResponse = AccountManagementResponse>(
  body: Record<string, unknown>,
): Promise<T> {
  const { data, error } = await supabase.functions.invoke("manage-users", { body });

  if (error) {
    let message = error.message;
    if ("context" in error && error.context instanceof Response) {
      try {
        const payload = (await error.context.clone().json()) as { error?: unknown };
        if (typeof payload.error === "string") message = payload.error;
      } catch {
        // Use the SDK message when the response does not contain JSON.
      }
    }
    throw new Error(message);
  }

  if (data && typeof data === "object" && "error" in data && typeof data.error === "string") {
    throw new Error(data.error);
  }

  return data as T;
}