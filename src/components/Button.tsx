import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export default function Button({ variant = 'primary', ...props }: Props) {
  const base: React.CSSProperties = {
    padding: '0.625rem 1rem',
    borderRadius: 8,
    border: '1px solid transparent',
    cursor: 'pointer'
  };

  const styles: Record<string, React.CSSProperties> = {
    primary: { background: '#111827', color: '#fff' },
    secondary: { background: '#fff', color: '#111827', borderColor: '#e5e7eb' }
  };

  return <button {...props} style={{ ...base, ...styles[variant], ...props.style }} />;
}








