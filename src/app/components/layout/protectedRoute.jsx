"use client";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../data/useAuth";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user && pathname !== "/") {
            router.replace("/");
        }
    }, [user, loading, pathname, router]);

    if (loading) return null; 

    return user ? children : null;
}
