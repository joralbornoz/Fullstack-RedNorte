import Topbar from './Topbar'

export default function PageWrapper({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-3)' }}>
      <Topbar />
      <main className="max-w-screen-xl mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  )
}
