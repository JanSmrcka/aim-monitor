import { useQuery } from "@tanstack/react-query";

interface TaskItem {
  id: string;
  title: string;
  config: { frequency?: string; scope?: string };
  createdAt: string;
  updatedAt: string;
}

async function fetchTasks(): Promise<TaskItem[]> {
  const res = await fetch("/api/tasks");
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
}
