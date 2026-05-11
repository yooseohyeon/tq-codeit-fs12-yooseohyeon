"use client";

import { useState } from "react";
import TodoItem from "@/app/_components/TodoItem";
import { fetchTodos, toggleTodoStatus, toggleTodoLike } from "@/api/todos";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";

export default function TodoList() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: todosData,
    isPending,
    error,
  } = useQuery({
    queryKey: ["todos", currentPage],
    queryFn: () => fetchTodos({ page: currentPage }),
    meta: {
      name: "todos 홈",
    },
  });

  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: toggleTodoStatus,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["todos", currentPage] });
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: toggleTodoLike,
    // When mutate is called:
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["todos", currentPage] });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(["todos", currentPage]);

      // Optimistically update to the new value
      queryClient.setQueryData(["todos", currentPage], (old) => {
        if (!old) return old;
        return {
          ...old,
          todos: old.todos.map((todo) =>
            todo.id === newTodo.id ? { ...todo, liked: !todo.liked } : todo,
          ),
        };
      });

      // Return a context object with the snapshotted value
      return { previousTodos };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["todos", currentPage], context.previousTodos);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", currentPage] });
    },
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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

  const { todos, totalPages } = todosData;

  return (
    <div>
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

      {/* 페이지네이션 UI */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
