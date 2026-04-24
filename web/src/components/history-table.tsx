import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useHistory, type HistoryItem } from "../hooks/useHistory";
import { ChevronLeft, ChevronRight, ExternalLink, Loader2 } from "lucide-react";
import Button from "./ui/button";

const columns: ColumnDef<HistoryItem>[] = [
  {
    accessorKey: "longUrl",
    header: "Original URL",
    cell: ({ getValue }) => {
      const url = getValue<string>();
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-700 hover:text-cyan-800 flex items-center gap-1 max-w-md truncate"
          title={url}
        >
          <span className="truncate">{url}</span>
          <ExternalLink size={14} className="shrink-0" />
        </a>
      );
    },
  },
  {
    accessorKey: "shortUrl",
    header: "Short URL",
    cell: ({ getValue }) => {
      const url = getValue<string>();
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          {url}
        </a>
      );
    },
  },
];

export function HistoryTable() {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { data, isLoading, isError, error } = useHistory(page, limit);

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data?.meta.totalPages ?? 0,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-cyan-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          Error loading history: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data?.items.length) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">No URLs shortened yet</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-4 animate-card-pop-in">
      <div className="rounded-xl bg-white border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-zinc-200 bg-zinc-50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-semibold text-zinc-700 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-sm text-zinc-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-zinc-600">
            Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} total)
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              text="Previous"
              icon={<ChevronLeft size={16} />}
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            />
            <Button
              text="Next"
              icon={<ChevronRight size={16} />}
              size="sm"
              onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
              disabled={page === data.meta.totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
}
