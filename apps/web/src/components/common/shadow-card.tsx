import { VariantProps, cva } from 'class-variance-authority';

export const cardVariants = cva('rounded-[40px] border-[3px]', {
  variants: {
    variant: {
      'orange-fill': 'bg-light-orange border-orange shadow-orange',
      orange: 'bg-white border-orange shadow-orange',
      'blue-fill': 'bg-light-blue border-blue shadow-blue',
      blue: 'bg-white border-blue shadow-blue',
      'violent-fill': 'bg-light-violent border-violent shadow-violent',
      violent: 'bg-white border-violent shadow-violent',
      dark: 'bg-white border-dark shadow-dark hover:border-primary hover:shadow-primary',
    },
  },
  defaultVariants: {
    variant: 'orange',
  },
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

export const ShadowCard = ({ children, className, variant }: CardProps) => {
  return <div className={cardVariants({ variant, className })}>{children}</div>;
};
