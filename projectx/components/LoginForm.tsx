"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link";
import { useForm } from "react-hook-form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react";
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
    watch,
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {email:"", password: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  })

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
        router.replace("/dashboard/todo");
    }
  }, [router]);
  
  const mutation = useMutation({
    mutationFn: async (formData: { email:string, password: string }) => {
      const res = await fetch ("http://localhost:4000/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Login failed: ${text}`);
      }

      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_email', data.email);

      toast.success("Login successful");
      reset();

      setTimeout(() =>{
        router.push("/dashboard/todo")
      }, 500);
    },

    onError: (error:any) => {
      let message = "Login failed";
      try {
        const errObj = JSON.parse(error.message.replace("Login failed: ", ""));
        if (errObj.message) {
          message = errObj.message;
        }
      } catch {
      }
      toast.error(message);
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(data: LoginForm) {
    mutation.mutate({
      email: data.email,
      password: data.password,
    });
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login your account.
        </CardDescription>
        <CardAction>
          <Link href="/auth/signup">
            <Button variant="link" className="hover:cursor-pointer">Sign Up</Button>
          </Link>
        </CardAction>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                {...register("email")}  
                id="login-email"
                type="email"
                placeholder="example@example.com"
              />
              {errors.email && (
                <span className="text-red-500 text-xs">{errors.email.message}</span>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="login-password">Password</Label> 
                <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                  Forgot your password?
                </a>
              </div>
              <div className="relative">
                <Input
                  {...register("password")} 
                  id="login-password"
                  type={showPassword? "text" : "password"}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:cursor-pointer"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs">{errors.password.message}</span>
              )}
            </div>
          </div>
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full hover:cursor-pointer transition duration-300 ease-in-out"
              aria-busy={mutation.isPending}
              disabled={mutation.isPending}
            >
              {mutation.isPending ?
                (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner /> Logging In
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn />Log In
                  </span>
                )
              }
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
