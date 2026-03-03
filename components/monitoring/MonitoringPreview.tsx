"use client";

import type { MonitoringTask } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EntityBadge } from "@/components/monitoring/EntityBadge";
import { ProgressBar } from "@/components/monitoring/ProgressBar";
import { Globe, Newspaper, Users, FileText, BookOpen, Rss, Settings, ShieldCheck } from "lucide-react";

const sourceIcons: Record<string, React.ReactNode> = {
  web: <Globe className="h-3.5 w-3.5" />,
  news: <Newspaper className="h-3.5 w-3.5" />,
  social: <Users className="h-3.5 w-3.5" />,
  sec: <FileText className="h-3.5 w-3.5" />,
  arxiv: <BookOpen className="h-3.5 w-3.5" />,
  rss: <Rss className="h-3.5 w-3.5" />,
  custom: <Settings className="h-3.5 w-3.5" />,
};

function isEmpty(task: MonitoringTask): boolean {
  return (
    !task.title &&
    !task.scope &&
    !task.keywords?.length &&
    !task.entities?.length &&
    !task.sources?.length &&
    !task.frequency
  );
}

export function MonitoringPreview({ task }: { task: MonitoringTask }) {
  if (isEmpty(task)) {
    return (
      <div className="flex h-full w-full min-h-0 items-center justify-center p-3">
        <div className="w-full max-w-md rounded-xl border border-dashed border-zinc-700 bg-zinc-900/45 px-4 py-6 text-center">
          <p className="text-sm text-zinc-300">Your monitoring task will appear here</p>
          <p className="mt-1 text-xs text-zinc-500">Answer prompts in chat to build a live monitor spec.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-zinc-800/80 px-3 py-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Monitor spec</p>
        <div className="mt-1 flex items-center gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <p className="min-w-0 break-words font-heading text-sm font-semibold leading-snug text-zinc-100">
            {task.title ?? "In progress"}
          </p>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-3">
          <ProgressBar task={task} />

          {task.scope && (
            <div>
              <h4 className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">Scope</h4>
              <p className="text-sm text-zinc-200">{task.scope}</p>
            </div>
          )}

          {task.keywords && task.keywords.length > 0 && (
            <div>
              <h4 className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">Keywords</h4>
              <div className="flex flex-wrap gap-1">
                {task.keywords.map((kw) => (
                  <Badge
                    key={kw}
                    variant="secondary"
                    className="max-w-full border border-amber-200/20 bg-amber-300/10 text-[11px] text-amber-100 whitespace-normal break-words overflow-visible"
                  >
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {task.entities && task.entities.length > 0 && (
            <>
              <Separator className="bg-zinc-800/80" />
              <div>
                <h4 className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                  Entities
                </h4>
                <div className="flex flex-wrap gap-1">
                  {task.entities.map((e) => (
                    <EntityBadge key={e.name} type={e.type} name={e.name} />
                  ))}
                </div>
              </div>
            </>
          )}

          {task.sources && task.sources.length > 0 && (
            <>
              <Separator className="bg-zinc-800/80" />
              <div>
                <h4 className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">Sources</h4>
                <div className="space-y-1.5">
                  {task.sources.map((s) => (
                    <div
                      key={s.name}
                      className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-900/70 px-2 py-1.5 text-xs text-zinc-300"
                    >
                      <span className="mt-0.5 shrink-0">
                        {sourceIcons[s.type] ?? <Globe className="h-3.5 w-3.5" />}
                      </span>
                      <span className="min-w-0 break-words">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {task.frequency && (
            <>
              <Separator className="bg-zinc-800/80" />
              <div>
                <h4 className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                  Frequency
                </h4>
                <Badge className="bg-amber-300 text-[10px] uppercase tracking-[0.16em] text-zinc-950">
                  {task.frequency}
                </Badge>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
