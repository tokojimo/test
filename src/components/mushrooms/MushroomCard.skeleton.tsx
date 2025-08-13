import React from "react";
import Skeleton from "@/components/ui/skeleton";

export default function MushroomCardSkeleton() {
  return (
    <div className="h-full flex flex-col rounded-lg border border-border bg-paper shadow-sm">
        <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-[var(--surface-2)]">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex grow flex-col gap-2 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="mt-auto flex gap-2">
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}
