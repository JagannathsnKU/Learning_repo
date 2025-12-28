import React from 'react'

/**
 * Glass Panel component - creates frosted glass effect panels
 * Core UI building block for the glassmorphism aesthetic
 */

interface GlassPanelProps {
  children: React.ReactNode
  className?: string
  variant?: 'dark' | 'light'
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  variant = 'dark',
}) => {
  const baseStyles = 'backdrop-blur-glass rounded-2xl border border-white/10'
  const variantStyles = variant === 'dark' 
    ? 'bg-glass-dark hover:bg-glass-light' 
    : 'bg-glass-light'

  return (
    <div className={`${baseStyles} ${variantStyles} transition-all duration-300 ${className}`}>
      {children}
    </div>
  )
}

/**
 * Button component with glass aesthetic
 */

interface GlassButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const variantStyles = {
    primary: 'bg-gradient-to-r from-dream-blue to-dream-purple text-white hover:shadow-glow-lg',
    secondary: 'bg-glass-light text-white border border-white/20 hover:bg-glass-dark',
    ghost: 'text-white hover:bg-glass-dark',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        rounded-lg font-medium
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  )
}

/**
 * Card component for content display
 */

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverable = false,
}) => {
  return (
    <GlassPanel
      className={`p-6 ${hoverable ? 'hover:shadow-glow cursor-pointer' : ''} ${className}`}
    >
      {children}
    </GlassPanel>
  )
}

/**
 * Input component with glass styling
 */

interface GlassInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  type?: string
}

export const GlassInput: React.FC<GlassInputProps> = ({
  value,
  onChange,
  placeholder = '',
  className = '',
  type = 'text',
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`
        w-full px-4 py-2 rounded-lg
        bg-glass-dark border border-white/10
        text-white placeholder-white/40
        focus:outline-none focus:ring-2 focus:ring-dream-blue
        focus:bg-glass-light transition-all duration-300
        ${className}
      `}
    />
  )
}

/**
 * Badge component for tags and labels
 */

interface GlassBadgeProps {
  children: React.ReactNode
  className?: string
  color?: string
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  className = '',
  color = 'bg-dream-blue',
}) => {
  return (
    <span
      className={`
        inline-block px-3 py-1 rounded-full
        text-xs font-medium text-white
        ${color} opacity-80
        ${className}
      `}
    >
      {children}
    </span>
  )
}

/**
 * Divider component
 */

interface GlassDividerProps {
  className?: string
}

export const GlassDivider: React.FC<GlassDividerProps> = ({ className = '' }) => {
  return (
    <div className={`h-px bg-gradient-to-r from-transparent via-white/20 to-transparent ${className}`} />
  )
}

/**
 * Spinner/Loading indicator
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={`${sizeStyles[size]} ${className}`}>
      <svg
        className="animate-spin h-full w-full text-dream-blue"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}
