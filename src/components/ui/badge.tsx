// CMP-012
import { cn } from '@/lib/utils';

type BadgeVariant =
  | 'active'
  | 'sold'
  | 'hidden'
  | 'new'
  | 'read'
  | 'contacted'
  | 'declined'
  | 'fuelType';

type BadgeProps = {
  variant: BadgeVariant;
  label: string;
  className?: string;
};

const variantClasses: Record<BadgeVariant, string> = {
  active: 'bg-success-light text-success',
  sold: 'bg-gray-900 text-white',
  hidden: 'bg-canvas text-gray-500',
  new: 'bg-accent-light text-accent',
  read: 'bg-info-light text-info',
  contacted: 'bg-success-light text-success',
  declined: 'bg-canvas text-gray-500',
  fuelType: 'bg-info-light text-info',
};

export function Badge({ variant, label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {label}
    </span>
  );
}

export type { BadgeVariant, BadgeProps };
