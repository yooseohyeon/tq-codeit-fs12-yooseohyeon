"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTodo } from "@/api/todos";

export default function TodoForm() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");

  const { mutate: mutateAddTodo, isPending: isAdding } = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: () => {
      alert("할 일을 추가하는데 실패했습니다.");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    mutateAddTodo(title, {
      onSuccess: () => {
        setTitle("");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="할 일을 입력하세요"
          className="flex-grow p-2 border"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white">
          {isAdding ? "추가 중..." : "츄가"}
        </button>
      </div>
    </form>
  );
}
