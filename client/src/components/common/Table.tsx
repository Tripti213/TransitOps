import React, { type ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  isNumeric?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
}

export function Table<T>({ data, columns, onRowClick }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--accent)]/20 bg-[var(--bg)] shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--accent)]/20 bg-[var(--canvas)]/50">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-sm font-medium text-[var(--text)] ${
                  col.isNumeric ? 'text-right' : ''
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--accent)]/10">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`group transition-colors ${
                onRowClick ? 'cursor-pointer hover:bg-[var(--canvas)]' : ''
              }`}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-4 py-3 text-sm text-[var(--text)] ${
                    col.isNumeric ? 'font-mono text-right' : ''
                  }`}
                >
                  {typeof col.accessor === 'function'
                    ? col.accessor(row)
                    : (row[col.accessor] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-[var(--text)]/60">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}