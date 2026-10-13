/* Supabase provider: talks to the GoTrue auth API and PostgREST with plain fetch, so there is no SDK.
   The same code works against a self-hosted Supabase, since only the base URL changes.
   Table and policies: supabase/schema.sql. */
export function supabaseProvider({ url, key, fetchFn, now = () => Date.now() }) {
  const base = String(url).replace(/\/+$/, "");

  async function call(path, { method = "GET", token, body, headers } = {}) {
    const res = await fetchFn(base + path, {
      method,
      headers: { apikey: key, "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    let data = null;
    if (text) { try { data = JSON.parse(text); } catch (e) { data = text; } }
    if (!res.ok) {
      const err = new Error((data && (data.msg || data.error_description || data.message)) || `Server said ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return data;
  }

  const toSession = (d) => ({
    access_token: d.access_token,
    refresh_token: d.refresh_token,
    expires_at: now() + (d.expires_in || 3600) * 1000,
    user: { id: d.user.id, email: d.user.email },
  });

  return {
    signIn: async (email, password) => toSession(await call("/auth/v1/token?grant_type=password", { method: "POST", body: { email, password } })),
    /** Returns {session} when the project signs people in at once, or {confirm:true} when an email must be confirmed first. */
    signUp: async (email, password) => {
      const d = await call("/auth/v1/signup", { method: "POST", body: { email, password } });
      return d && d.access_token ? { session: toSession(d) } : { confirm: true };
    },
    refresh: async (refreshToken) => toSession(await call("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: { refresh_token: refreshToken } })),
    pull: async (token) => {
      const rows = await call("/rest/v1/progress?select=key,value", { token });
      return Object.fromEntries((rows || []).map((r) => [r.key, r.value]));
    },
    push: async (token, userId, docs) => {
      const stamp = new Date(now()).toISOString();
      const rows = Object.entries(docs).map(([k, value]) => ({ user_id: userId, key: k, value, updated_at: stamp }));
      if (!rows.length) return;
      await call("/rest/v1/progress?on_conflict=user_id,key", { method: "POST", token, body: rows, headers: { Prefer: "resolution=merge-duplicates,return=minimal" } });
    },
  };
}
