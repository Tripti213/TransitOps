import { type ReactNode } from 'react';

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
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow)]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--canvas)]/60">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--text)]/70 ${
                  col.isNumeric ? 'text-right' : ''
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]/60">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`group relative transition-colors ${
                rowIndex % 2 === 1 ? 'bg-[var(--canvas)]/25' : ''
              } ${onRowClick ? 'cursor-pointer hover:bg-[var(--accent-bg)]' : ''}`}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`relative px-4 py-3 text-sm text-[var(--text)] ${
                    colIndex === 0 && onRowClick
                      ? 'before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:scale-y-0 before:bg-[var(--accent)] before:transition-transform group-hover:before:scale-y-100'
                      : ''
                  } ${col.isNumeric ? 'font-mono text-right' : ''}`}
                  style={col.isNumeric ? { fontFamily: 'var(--mono)' } : undefined}
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
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-[var(--text)]/60">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}