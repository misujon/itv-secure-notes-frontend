"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/api";

interface PaginationControlsProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

export function PaginationControls({
  meta,
  onPageChange,
  isFetching = false,
}: PaginationControlsProps) {
  if (meta.last_page <= 1) {
    return null;
  }

  const canGoPrev = meta.current_page > 1 && !isFetching;
  const canGoNext = meta.current_page < meta.last_page && !isFetching;

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-3 border-t border-border pt-4 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{meta.current_page}</span> of{" "}
        <span className="font-medium text-foreground">{meta.last_page}</span>{" "}
        <span className="hidden sm:inline">({meta.total} total)</span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(meta.current_page - 1)}
          disabled={!canGoPrev}
        >
          <ChevronLeft className="mr-1 size-4" aria-hidden="true" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(meta.current_page + 1)}
          disabled={!canGoNext}
        >
          Next
          <ChevronRight className="ml-1 size-4" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
