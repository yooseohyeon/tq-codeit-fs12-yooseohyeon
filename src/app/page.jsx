"use client";

import { useEffect, useState } from "react";
import { fetchTodos } from "@/api/todos";
import TodoList from "./_components/TodoList";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTodos();
        setTodos(data);
      } catch (err) {
        console.error("[error] fetch Todos:", err);
        setError("할 일 목록을 가져오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">로딩 중...</div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">투두리스트</h1>
      <div className="max-w-md mx-auto mt-8">
        {/* <TodoForm loadTodos={loadTodos} /> */}
        <h2 className="text-2xl font-bold mb-4">할 일 목록</h2>
        <TodoList todos={todos} />
      </div>
    </div>
  );
}
