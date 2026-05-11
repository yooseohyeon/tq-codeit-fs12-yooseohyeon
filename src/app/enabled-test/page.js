"use client";

import { fetchTodos } from "@/api/todos";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import TodoItem from "@/app/_components/TodoItem";

export default function EnabledTestPage() {
  const [isEnabled, setIsEnabled] = useState(false);
  const {
    data: todos,
    isPending,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["todos", "enabled-test"],
    queryFn: fetchTodos,
    enabled: isEnabled,
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">enabled 속성 테스트</h1>

      <div className="mb-6">
        <div className="flex items-center space-x-4 p-4 border rounded bg-gray-50">
          <div className="font-medium">데이터 로딩 상태:</div>
          <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {isEnabled ? "활성화됨" : "비활성화됨"}
          </div>

          <button
            onClick={() => setIsEnabled((prev) => !prev)}
            className={`px-4 py-2 rounded text-white ${
              isEnabled
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isEnabled ? "비활성화 처리" : "활성화 처리"}
          </button>
        </div>

        <div className="mt-4 p-4 border rounded bg-gray-50">
          <div className="flex items-center space-x-2">
            <span className="font-medium">쿼리 상태:</span>
            {isFetching && <span className="text-blue-500">로딩 중...</span>}
            {!isEnabled && (
              <span className="text-orange-500">쿼리 비활성화됨</span>
            )}
            {isEnabled && !isFetching && (
              <span className="text-green-500">쿼리 완료</span>
            )}
          </div>
        </div>
      </div>

      <div className="border">
        {!isEnabled && (
          <div className="p-4 text-center">
            데이터 로딩을 활성화하려면 위의 버튼을 클릭하세요.
          </div>
        )}

        {isPending && isEnabled && (
          <div className="p-4 text-center">로딩 중...</div>
        )}

        {error && <div className="p-4 text-center text-red-500">{error}</div>}

        {todos && todos.length === 0 && (
          <div className="p-4 text-center">할 일이 없습니다.</div>
        )}

        {todos &&
          todos.length > 0 &&
          todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
      </div>
    </div>
  );
}
