"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";

interface FinalizeConfirmationProps {
  summary: string;
  onConfirm: () => void;
  onDismiss: () => void;
  isLoading: boolean;
}

export function FinalizeConfirmation({ summary, onConfirm, onDismiss, isLoading }: FinalizeConfirmationProps) {
  return (
    <Card className="border-green-500/30 bg-green-500/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Ready to create
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{summary}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button onClick={onConfirm} disabled={isLoading} size="sm">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Create Monitor"
          )}
        </Button>
        <Button variant="ghost" size="sm" onClick={onDismiss} disabled={isLoading}>
          Keep editing
        </Button>
      </CardFooter>
    </Card>
  );
}
