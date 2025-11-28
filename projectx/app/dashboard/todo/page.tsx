import ToDoList from "@/components/ToDoList"

export default function ToDoListPage(){
  return (
    <main className="flex min-h-svh flex-col items-center justify-center ">
      <div className="w-full max-w-lg">
        <ToDoList/>
      </div>
    </main>
  )
}