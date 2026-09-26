import createClient from "openapi-fetch";
import type { paths } from "./schema";

export type { paths };
export type ApiClient = ReturnType<typeof createClient<paths>>;

export function createApiClient(baseUrl: string, options?: { getAccessToken?: () => string | null }) {
  const client = createClient<paths>({
    baseUrl,
    credentials: "include",
  });

  client.use({
    onRequest({ request }) {
      const token = options?.getAccessToken?.();
      if (token) {
        request.headers.set("Authorization", `Bearer ${token}`);
      }
      if (!request.headers.has("X-GymPulse-Client")) {
        request.headers.set("X-GymPulse-Client", "admin");
      }
      return request;
    },
  });

  return client;
}
