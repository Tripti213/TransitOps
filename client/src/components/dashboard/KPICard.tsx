import { type FC } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
}

export const KPICard: FC<KPICardProps> = ({ title, value, subtext, icon }) => (
  <div className="bg-[var(--bg)] p-6 rounded-lg border border-[var(--accent)]/20 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-[var(--text)]/70">{title}</p>
        <h3 className="text-2xl font-semibold mt-1 text-[var(--text-h)]">{value}</h3>
        {subtext && <p className="text-xs text-[var(--accent)] mt-2">{subtext}</p>}
      </div>
      <div className="text-[var(--accent)] opacity-80">{icon}</div>
    </div>
  </div>
);