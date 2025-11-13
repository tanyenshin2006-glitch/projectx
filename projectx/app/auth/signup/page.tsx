import SignUpForm from "@/components/SignUpForm"

export default function SignupPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </main>
  )
}
