"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../data/firebase"; 
import { doc, getDoc } from "firebase/firestore";

export function useAuth() {
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDocRef = doc(db, "usuarios", firebaseUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    let userData = null;
                    if (userDocSnap.exists()) {
                        userData = userDocSnap.data();
                    }

                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        ...userData, 
                    });
                } catch (error) {
                    console.error("Erro ao buscar dados do usuário:", error);
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                    }); 
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
}
