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

const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: {errors},
    watch,
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {email:"", password: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  })

  function onSubmit(data: LoginForm) {
  // handle form data here
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login your account.
        </CardDescription>
        <CardAction>
          <Link href="/signup">
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
              <Input
                {...register("password")} 
                id="login-password"
                type="password"
              />
              {errors.password && (
                <span className="text-red-500 text-xs">{errors.password.message}</span>
              )}
            </div>
          </div>
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full hover:cursor-pointer transition duration-300 ease-in-out"
            >
              Login
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
