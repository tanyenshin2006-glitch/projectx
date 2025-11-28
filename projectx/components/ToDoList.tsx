"use client"

import { 
    Card, 
    CardHeader,
    CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { SquarePen, Trash, CircleCheck, CircleX } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LogOutButton from "@/components/LogOutButton"

type Todo = {
    id: string;
    title: string;
    completed: boolean;
}

export default function ToDoList(){
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("access_token");
        if (storedToken) {
            setToken(storedToken);
            setReady(true);
        } else {
            router.replace("/");
        }
    }, []);

    const { data: todos, isLoading, refetch } = useQuery<Todo[]>({
        queryKey: ["todos", token],
        enabled: ready && !!token,
        queryFn: async() => {
            const res = await fetch("http://localhost:4000/todos", {
                headers: {
                "Authorization": `Bearer ${token}`,
                }
             });
            if (!res.ok) throw new Error("Failed to fetch todos");
            return res.json();
        },
    });

    const [newTask, setNewTask] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const addTodoMutation = useMutation({
        mutationFn: async (title:string) => {
            const res = await fetch("http://localhost:4000/todos", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ title }),
            });
            if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to add todo");
        }
            return res.json();
        },
        onSuccess: () => {
            setNewTask("");
            refetch();
        },
        onError: (error: any) => {
            setErrorMsg(error.message || "Failed to add todo");
        }
    });

    function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        if (newTask.trim()){
            addTodoMutation.mutate(newTask);
        }
    }

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    const editTodoMutation = useMutation({
        mutationFn: async ({id, title}: {id: string, title: string }) => {
            const res = await fetch(`http://localhost:4000/todos/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({title}),
            });
            return res.json();
        },
        onSuccess: () => {
            setEditingId(null);
            setEditValue("");
            refetch();
        },
        onError: (error: any) => {
            setErrorMsg(error.message || "Failed to edit todo");
        }
    })

    function handleEdit(id: string, title: string) {
        setEditingId(id);
        setEditValue(title);
    }

    function handleDoneEdit(id: string) {
        if (editValue.trim()) {
            editTodoMutation.mutate({ id, title: editValue });
        }
    }

    function handleCancelEdit() {
        setEditingId(null);
        setEditValue("");
    }

    const deleteTodoMutation = useMutation({
        mutationFn: async ({id}: {id: string}) => {
            const res = await fetch(`http://localhost:4000/todos/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            return res.json();
        },
        onSuccess: () => {
            setEditingId(null);
            setEditValue("");
            refetch();
        },
        onError: (error: any) => {
            setErrorMsg(error.message || "Failed to delete todo");
        }
    })

    const toggleTodoMutation = useMutation({
        mutationFn: async ({id, completed}: {id: string, completed: boolean }) => {
            const res = await fetch(`http://localhost:4000/todos/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ completed }),
            });
            return res.json();
        },
        onSuccess: () => {
            refetch();
        },
        onError: (error: any) => {
            setErrorMsg(error.message || "Failed to update todo");
        }
    });

    if (!ready) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span>Loading...</span>
            </div>
        );
    }

    return(
        <>
            <Card className="w-full">
                <CardHeader>
                    <h1 className="flex justify-center items-center font-bold text-2xl">TO DO LIST</h1>
                </CardHeader>
                <CardContent>
                    {errorMsg && (
                        <div className="text-red-500 mb-2">{errorMsg}</div>
                    )}
                    <form onSubmit={handleAdd}>
                        <div className="flex gap-4 mb-8">
                            <Input
                                placeholder="Add a new task..."
                                value={newTask}
                                onChange={e => setNewTask(e.target.value)}
                            />
                            <Button
                                className="hover:cursor-pointer transition duration-300 ease-in-out"
                            >
                                Add
                            </Button>
                        </div>
                    </form>
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <ScrollArea className="h-96 w-full pr-4">
                            <ul>
                                {todos?.map(todo =>(
                                    <li key={todo.id} className="flex items-center justify-content mb-4">
                                        <Checkbox
                                            checked={todo.completed}
                                            onCheckedChange={() =>
                                                toggleTodoMutation.mutate({ id: todo.id, completed: !todo.completed })
                                            }
                                            className="mr-4 w-4 h-4 hover:cursor-pointer hover:border-gray-600"
                                        />
                                        {editingId === todo.id ? (
                                            <>
                                                <Input
                                                    value={editValue}
                                                    onChange={e => setEditValue(e.target.value)}
                                                    className="mr-2"
                                                />
                                                <div className="flex ml-auto gap-2">
                                                    <Button 
                                                        onClick={() => handleDoneEdit(todo.id)}
                                                        className="bg-green-500 text-white hover:bg-green-600 hover:cursor-pointer"
                                                    >
                                                        <CircleCheck />
                                                        Done
                                                    </Button>
                                                    <Button 
                                                        onClick={handleCancelEdit}
                                                        className="bg-gray-400 text-white hover:bg-gray-500 hover:cursor-pointer"
                                                    >
                                                        <CircleX />
                                                        Cancel
                                                    </Button>
                                                </div>

                                            </>
                                        ) : (
                                            <>
                                                <Label className={`max-w-xs break-all whitespace-normal mr-4 ${todo.completed ? "line-through" : ""}`}>
                                                    {todo.title}
                                                </Label>
                                                <div className="flex ml-auto gap-2">
                                                    <Button 
                                                        onClick={() => handleEdit(todo.id, todo.title)}
                                                        className="bg-blue-500 text-white hover:bg-blue-600 hover:cursor-pointer transition duration-300 ease-in-out"
                                                    >
                                                        <SquarePen />
                                                        Edit
                                                    </Button>
                                                    <Button 
                                                        onClick={() => deleteTodoMutation.mutate({ id: todo.id })}
                                                        className="text-white bg-red-400 hover:cursor-pointer hover:bg-red-500 transition duration-300 ease-in-out"
                                                    >
                                                        <Trash />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
            <div className="mt-4 flex justify-center">
                <LogOutButton />
            </div>
        </>
    )
}