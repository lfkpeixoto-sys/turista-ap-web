import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const ensureProfile = useCallback(async (u) => {
    try {
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(
          ref,
          {
            displayName: u.displayName || "Usuário",
            username: "",
            bio: "",
            city: "",
            instagramUrl: "",
            tiktokUrl: "",
            youtubeUrl: "",
            whatsappE164: "",
            whatsappVerified: false,
            wishlistCities: [],
visitedCities: [],

            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
        const snap2 = await getDoc(ref);
        setProfile(snap2.data() || null);
      } else {
        setProfile(snap.data() || null);
      }
    } catch (e) {
      console.error("Firestore profile error:", e);
      // ✅ não trava o app: deixa profile null
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);

      if (u) {
        await ensureProfile(u);
      } else {
        setProfile(null);
      }

      // ✅ importante: sempre finaliza loading
      setLoading(false);
    });

    return () => unsub();
  }, [ensureProfile]);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const updateProfileData = useCallback(async (data) => {
    if (!auth.currentUser) throw new Error("Not logged");

    const ref = doc(db, "users", auth.currentUser.uid);
    await setDoc(
      ref,
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    try {
      const snap = await getDoc(ref);
      setProfile(snap.data() || null);
    } catch (e) {
      console.error("Reload profile error:", e);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, updateProfileData, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
