import { useState } from "react";

export function ColumnSelector({ table }: { table: any }) {
  const [open, setOpen] = useState(false);

  // columns the user is not allowed to deselect
  const requiredColumns = ["generationTime", "message"];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded border bg-gray-100 px-2 py-1 text-xs hover:bg-gray-50"
      >
        Columns
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-1 w-48 rounded border bg-white p-2 shadow">
          {table
            .getAllLeafColumns()
            .filter((column: any) => !requiredColumns.includes(column.id))
            .map((column: any) => {
              const isRequired = requiredColumns.includes(column.id);

              return (
                <label
                  key={column.id}
                  className="flex items-center gap-2 text-xs"
                >
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    disabled={isRequired}
                    onChange={column.getToggleVisibilityHandler()}
                  />
                  {column.columnDef.meta.label}
                </label>
              );
            })}
        </div>
      )}
    </div>
  );
}
