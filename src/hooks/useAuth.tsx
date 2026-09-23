import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Role = "resident" | "secretary";

export type Profile = { id: string; name: string; flat_number: string };

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: Role | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  profile: null,
  role: null,
  loading: true,
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async (current: Session | null) => {
    if (!current?.user) {
      setProfile(null);
      setRole(null);
      setLoading(false);
      return;
    }
    const user = current.user;
    const meta = (user.user_metadata ?? {}) as Record<string, string>;

    const { data: existing } = await supabase
      .from("profiles")
      .select("id, name, flat_number")
      .eq("id", user.id)
      .maybeSingle();

    let resolved = existing as Profile | null;
    if (!resolved) {
      const { data: inserted } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          name: meta["name"] ?? user.email?.split("@")[0] ?? "Resident",
          flat_number: meta["flat_number"] ?? "",
        })
        .select("id, name, flat_number")
        .maybeSingle();
      resolved = (inserted as Profile | null) ?? null;
    }
    setProfile(resolved);

    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    let resolvedRole = (roles?.[0]?.role as Role | undefined) ?? null;
    if (!resolvedRole) {
      const wanted: Role = meta["role"] === "secretary" ? "secretary" : "resident";
      await supabase.from("user_roles").insert({ user_id: user.id, role: wanted });
      resolvedRole = wanted;
    }
    setRole(resolvedRole);
    setLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    await hydrate(data.session);
  }, [hydrate]);

  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      if (!active) return;
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      setSession(next);
      void hydrate(next);
    });
    void refresh();
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [hydrate, refresh]);

  return (
    <AuthContext.Provider
      value={{ user: session?.user ?? null, session, profile, role, loading, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
