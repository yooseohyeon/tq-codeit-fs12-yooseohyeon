"use client";

import TodoItem from "@/app/_components/TodoItem";
import { fetchTodos, toggleTodoStatus, toggleTodoLike } from "@/api/todos";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function TodoList() {
  const {
    data: todos,
    isPending,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    meta: {
      name: "todos 홈",
    },
  });

  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: toggleTodoStatus,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: toggleTodoLike,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData(["todos"]);

      queryClient.setQueryData(["todos"], (old) =>
        old.map((todo) =>
          todo.id === newTodo.id ? { ...todo, liked: !todo.liked } : todo,
        ),
      );

      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["todos"], context.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
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
    <div className="border">
      {todos.length === 0 ? (
        <div className="p-4 text-center">할 일이 없습니다.</div>
      ) : (
        todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleMutation.mutate}
            onLikeToggle={toggleLikeMutation.mutate}
          />
        ))
      )}
    </div>
  );
}
