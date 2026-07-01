import type React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns,
  rows = 20,
}) => {
  return (
    <div className="w-full bg-white rounded-lg">
      {/* Table Header Skeleton */}
      <div className="flex h-10 bg-gray-50 rounded-t-lg">
        {[...Array(columns)].map(() => (
          // biome-ignore lint/correctness/useJsxKeyInIterable: static skeleton placeholders, fixed length, never reorder
          <div className={`flex-1 px-4 py-2`}>
            <Skeleton className="h-4 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table Body Skeleton */}
      <div className="divide-y divide-gray-100">
        {[...Array(rows)].map(() => (
          // biome-ignore lint/correctness/useJsxKeyInIterable: static skeleton placeholders, fixed length, never reorder
          <div className="flex h-10">
            {[...Array(columns)].map(() => (
              // biome-ignore lint/correctness/useJsxKeyInIterable: static skeleton placeholders, fixed length, never reorder
              <div className={`flex-1 px-4 py-2`}>
                <Skeleton className="h-4 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
