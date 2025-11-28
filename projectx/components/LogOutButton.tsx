"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { LogOut } from 'lucide-react';

export default function LogOutButton() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    function handleLogout() {
        setIsLoading(true);
        toast.success("Logged out!")
        setTimeout(() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_email");
            router.replace("/");
        }, 500);
    }

    return (
        <Button 
            className= "hover:cursor-pointer transition duration-300 ease-in-out w-full"
            onClick={handleLogout}>
            {isLoading ? (
                <span className="flex items-center justify-center gap-2 w-full ">
                    <Spinner /> Logging out...
                </span>
            ) : (
                <span className="flex items-center justify-center gap-2 w-full ">
                    <LogOut /> Logout
                </span>
            )}
        </Button>
    )
}