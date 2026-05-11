"use client";

import { fetchTodos } from "@/api/todos";
import { useQuery } from "@tanstack/react-query";
import TodoItem from "@/app/_components/TodoItem";

export default function CompletedPage() {
  const {
    data: completedTodos,
    isPending,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    select: (todos) => todos.filter((todo) => todo.completed),
  });

  if (isPending)
    return (
      <div className="container mx-auto px-4 py-8 text-center">로딩 중...</div>
    );

  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        {error.message}
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">완료된 할 일 목록</h1>

      <div className="border">
        {completedTodos?.length === 0 ? (
          <div className="p-4 text-center">완료된 할 일이 없습니다.</div>
        ) : (
          completedTodos?.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        )}
      </div>
    </div>
  );
}
