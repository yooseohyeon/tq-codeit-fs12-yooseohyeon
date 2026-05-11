"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchInfiniteTodos } from "@/api/todos";

export default function useInfiniteTodos() {
  const query = useInfiniteQuery({
    queryKey: ["todos", "infinite"],
    queryFn: fetchInfiniteTodos,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const allTodos =
    query.data?.pages.reduce((acc, page) => {
      return [...acc, ...page.todos];
    }, []) || [];

  return {
    ...query,
    allTodos,
  };
}
