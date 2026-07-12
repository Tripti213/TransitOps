import { type FC } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
}

export const KPICard: FC<KPICardProps> = ({ title, value, subtext, icon }) => (
  <div className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 shadow-[var(--shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent-border)]">
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 h-[3px] scale-x-0 bg-[var(--accent)] transition-transform duration-200 group-hover:scale-x-100"
    />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-[var(--text)]/70">{title}</p>
        <h3
          className="mt-2 text-[28px] leading-none font-semibold text-[var(--text-h)]"
          style={{ fontFamily: 'var(--mono)', fontWeight: 500 }}
        >
          {value}
        </h3>
        {subtext && (
          <p className="mt-2.5 text-xs font-medium text-[var(--accent)]">{subtext}</p>
        )}
      </div>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-bg)] text-[var(--accent)]">
        {icon}
      </div>
    </div>
  </div>
);