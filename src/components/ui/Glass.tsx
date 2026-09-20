import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';

export function GlassPanel({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`glass-panel ${className}`} {...props} />;
}
export function GlassButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`glass-button ${className}`} {...props} />;
}
