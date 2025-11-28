"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, UserRoundPlus } from 'lucide-react';

const signUpSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[a-z]/, { message: "Password must include a lowercase letter" })
  .regex(/[A-Z]/, { message: "Password must include an uppercase letter" })
  .regex(/[0-9]/, { message: "Password must include a number" })
  .regex(/[^a-zA-Z0-9]/, { message: "Password must include a symbol" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"]})
type SignUpForm = z.infer<typeof signUpSchema>

export default function SignUpForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: {errors},
    watch,
    setError,
    reset,
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  })

  const mutation = useMutation({
    mutationFn: async (formData: SignUpForm) => {
      const res =  await fetch("http://localhost:4000/auth/signup", {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Signup failed: ${text}`);
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Signup successful!");
      reset();
      setTimeout(() => {
        router.push("/");
      }, 500);
    },
    onError: (error: any) => {
      let message = "Signup failed";
      try{
        const errObj = JSON.parse(error.message.replace("Signup failed: ", ""));
        if (errObj.message) {
          message = errObj.message;
        }
      } catch {

      }
      toast.error(message);
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function onSubmit(data: SignUpForm) {
    mutation.mutate(data)
  };

  return (
    <Card className="overflow-hidden p-0 max-w-sm w-full">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1>Create your account</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your email below to create your account
              </p>
            </div>
            <Field>
              <FieldLabel htmlFor="signup-email">Email</FieldLabel>
              <Input
                {...register("email")}
                id="signup-email"
                type="email"
                placeholder="example@example.com"
                aria-invalid={!!errors.email}
              />
              {errors.email &&(
                  <span className="text-red-500 text-xs">{errors.email.message}</span>
              )}
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email with anyone else.
              </FieldDescription>
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    {...register("password")}
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    aria-invalid={!!errors.email}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:cursor-pointer" 
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                {errors.password &&(
                  <span className="text-red-500 text-xs">{errors.password.message}</span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                <div className="relative">
                  <Input
                    {...register("confirmPassword")}
                    id="confirm-password"
                    type= {showConfirmPassword ? "text" : "password"}
                    aria-invalid={!!errors.email}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:cursor-pointer"
                    onClick={() => setShowConfirmPassword((v) => !v) }
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword &&(
                  <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>
                )}
              </Field>
            </div>
            <FieldDescription>
              Must be at least 8 characters, include a mix of uppercase letters, lowercase letters, numbers, and symbols.
            </FieldDescription>
            <Button
              type="submit"
              className="hover:cursor-pointer transition duration-300 ease-in-out w-full"
              aria-busy={mutation.isPending}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 
                (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner/ > Creating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserRoundPlus/> Create Account
                  </span>
                )
              }
            </Button>
            <FieldDescription className="text-center">
              Already have an account? <Link href="/">Sign in</Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}