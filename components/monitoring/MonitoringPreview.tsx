"use client";

import type { MonitoringTask } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EntityBadge } from "@/components/monitoring/EntityBadge";
import { ProgressBar } from "@/components/monitoring/ProgressBar";
import { Globe, Newspaper, Users, FileText, BookOpen, Rss, Settings } from "lucide-react";

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
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">
          Your monitoring task will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {task.title && (
        <h3 className="text-lg font-semibold">{task.title}</h3>
      )}

      <ProgressBar task={task} />

      {task.scope && (
        <div>
          <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">Scope</h4>
          <p className="text-sm">{task.scope}</p>
        </div>
      )}

      {task.keywords && task.keywords.length > 0 && (
        <div>
          <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">Keywords</h4>
          <div className="flex flex-wrap gap-1">
            {task.keywords.map((kw) => (
              <Badge key={kw} variant="secondary" className="text-xs">
                {kw}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {task.entities && task.entities.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">Entities</h4>
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
          <Separator />
          <div>
            <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">Sources</h4>
            <div className="space-y-1">
              {task.sources.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-sm">
                  {sourceIcons[s.type] ?? <Globe className="h-3.5 w-3.5" />}
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {task.frequency && (
        <>
          <Separator />
          <div>
            <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">Frequency</h4>
            <Badge>{task.frequency}</Badge>
          </div>
        </>
      )}
    </div>
  );
}
