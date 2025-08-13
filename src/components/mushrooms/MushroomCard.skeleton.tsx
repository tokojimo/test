import React from "react";
import Skeleton from "@/components/ui/skeleton";

export default function MushroomCardSkeleton() {
  return (
    <div className="h-full flex flex-col rounded-lg border border-border shadow-sm">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-t-lg bg-paper">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex grow flex-col p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="mt-1 h-4 w-1/2" />
        <div className="mt-auto flex gap-2">
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}
