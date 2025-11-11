"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { useForm } from "react-hook-form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

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
  const {
    register,
    handleSubmit,
    formState: {errors},
    watch,
    setError,
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

  function onSubmit(data: SignUpForm) {
  
  }

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
                <Input
                  {...register("password")}
                  id="signup-password"
                  type="password"
                />
                {errors.password &&(
                  <span className="text-red-500 text-xs">{errors.password.message}</span>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                <Input
                  {...register("confirmPassword")}
                  id="confirm-password"
                  type="password"
                />
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
            >
              Create Account
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