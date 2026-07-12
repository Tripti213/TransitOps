import { type FC } from 'react';

export type StatusVariant = 'available' | 'warning' | 'danger' | 'neutral';

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ label, variant = 'neutral' }) => {
  // Using color-mix to create a subtle tinted background from your solid CSS variables
  const styles = {
    available: { 
      backgroundColor: 'color-mix(in srgb, var(--status-available) 15%, transparent)', 
      color: 'var(--status-available)', 
      borderColor: 'color-mix(in srgb, var(--status-available) 30%, transparent)' 
    },
    warning: { 
      backgroundColor: 'color-mix(in srgb, var(--status-warning) 15%, transparent)', 
      color: 'var(--status-warning)', 
      borderColor: 'color-mix(in srgb, var(--status-warning) 30%, transparent)' 
    },
    danger: { 
      backgroundColor: 'color-mix(in srgb, var(--status-danger) 15%, transparent)', 
      color: 'var(--status-danger)', 
      borderColor: 'color-mix(in srgb, var(--status-danger) 30%, transparent)' 
    },
    neutral: { 
      backgroundColor: 'color-mix(in srgb, var(--status-neutral) 15%, transparent)', 
      color: 'var(--status-neutral)', 
      borderColor: 'color-mix(in srgb, var(--status-neutral) 30%, transparent)' 
    }
  };

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border"
      style={styles[variant]}
    >
      {label}
    </span>
  );
};