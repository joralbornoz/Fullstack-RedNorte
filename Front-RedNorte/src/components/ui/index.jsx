// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'default' }) {
  const styles = {
    default: { bg: 'var(--teal-light)', color: 'var(--teal-dark)' },
    success: { bg: '#dcfce7', color: '#15803d' },
    warning: { bg: '#fef3c7', color: '#92400e' },
    danger:  { bg: '#fee2e2', color: '#991b1b' },
    muted:   { bg: '#f1f5f9', color: '#475569' },
  }
  const s = styles[variant] || styles.default
  return (
    <span style={{
      fontSize: 11, padding: '3px 10px', borderRadius: 20,
      background: s.bg, color: s.color, fontWeight: 500,
      display: 'inline-block', whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}

// ─── MetricCard ───────────────────────────────────────────────────────────────
export function MetricCard({ label, value, badge, badgeVariant = 'default', icon }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.85)',
      border: '1px solid rgba(14,155,132,0.12)',
      borderRadius: '1rem',
      padding: '16px 20px',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </p>
          <p style={{ fontSize: 26, fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 6px', fontFamily: 'Sora, sans-serif' }}>
            {value}
          </p>
          {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
        </div>
        {icon && (
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--teal-light)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── StatusPill ───────────────────────────────────────────────────────────────
export function StatusPill({ status }) {
  const map = {
    EN_ESPERA:    { label: 'En espera',    variant: 'warning' },
    CONFIRMADO:   { label: 'Confirmado',   variant: 'success' },
    CANCELADO:    { label: 'Cancelado',    variant: 'danger'  },
    REASIGNADO:   { label: 'Reasignado',   variant: 'default' },
    ATENDIDO:     { label: 'Atendido',     variant: 'muted'   },
  }
  const { label, variant } = map[status] || { label: status, variant: 'muted' }
  return <Badge variant={variant}>{label}</Badge>
}

// ─── PriorityDot ──────────────────────────────────────────────────────────────
export function PriorityDot({ priority }) {
  const colors = { ALTA: '#ef4444', MEDIA: '#f59e0b', BAJA: '#22c55e' }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[priority] || '#94a3b8', display: 'inline-block' }} />
      {priority.charAt(0) + priority.slice(1).toLowerCase()}
    </span>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({ children, onClick, variant = 'primary', size = 'md', disabled, type = 'button' }) {
  const sizes = { sm: '6px 14px', md: '8px 20px', lg: '11px 28px' }
  const fontSize = { sm: 12, md: 13, lg: 15 }
  const base = {
    border: 'none', borderRadius: 20, cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
    padding: sizes[size], fontSize: fontSize[size],
    opacity: disabled ? 0.5 : 1, transition: 'all 0.15s ease',
  }
  const variants = {
    primary:  { background: 'var(--teal-primary)', color: '#fff' },
    outline:  { background: 'transparent', color: 'var(--teal-primary)', border: '1px solid var(--teal-primary)' },
    ghost:    { background: 'transparent', color: 'var(--text-secondary)' },
    danger:   { background: '#fee2e2', color: '#991b1b' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, title, action, className = '' }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.85)',
      border: '1px solid rgba(14,155,132,0.12)',
      borderRadius: '1rem', backdropFilter: 'blur(8px)',
    }} className={className}>
      {(title || action) && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid rgba(14,155,132,0.08)',
        }}>
          {title && <p style={{ margin: 0, fontWeight: 500, fontSize: 14, color: 'var(--text-primary)' }}>{title}</p>}
          {action}
        </div>
      )}
      <div style={{ padding: '16px 20px' }}>{children}</div>
    </div>
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ icon = '📋', title = 'Sin datos', description }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <p style={{ fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>{title}</p>
      {description && <p style={{ fontSize: 13 }}>{description}</p>}
    </div>
  )
}

// ─── LoadingSpinner ───────────────────────────────────────────────────────────
export function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        border: '2.5px solid var(--teal-light)',
        borderTopColor: 'var(--teal-primary)',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ─── FilterPills ──────────────────────────────────────────────────────────────
export function FilterPills({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            fontSize: 12, padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
            background: value === opt.value ? 'var(--teal-primary)' : 'rgba(255,255,255,0.8)',
            color: value === opt.value ? '#fff' : 'var(--text-secondary)',
            border: `1px solid ${value === opt.value ? 'var(--teal-primary)' : 'var(--border)'}`,
            fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
          }}
        >
          {opt.label}
          {opt.count !== undefined && (
            <span style={{ marginLeft: 6, opacity: 0.7 }}>({opt.count})</span>
          )}
        </button>
      ))}
    </div>
  )
}

// ─── PageHeader ───────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 500, fontFamily: 'Sora, sans-serif', color: 'var(--text-primary)' }}>
          {title}
        </h1>
        {subtitle && <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
