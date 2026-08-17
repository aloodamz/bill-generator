import POSMachine from './components/POSMachine'

export default function App() {
  return (
    <main className="noise-overlay flex min-h-svh w-full items-center justify-center bg-neutral-300/60 px-4 py-10 [background-blend-mode:overlay]">
      <POSMachine />
    </main>
  )
}
