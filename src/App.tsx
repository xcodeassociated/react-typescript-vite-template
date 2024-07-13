import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import '@/App.css'
import { Button } from '@/components/ui/button.tsx'
import { ModeToggle } from '@/components/custom/mode-toggle.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1">
        <header className="sticky top-0 z-10 bg-muted/40">
          <div className="flex">
            <div className="p-4">
              <a href="https://vitejs.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
            </div>
            <div className="py-4">
              <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>
            <div className="ml-auto p-4">
              <ModeToggle />
            </div>
          </div>
        </header>
        <div className="m-4 my-10 flex flex-col items-center">
          <div className="flex-1 p-4">
            <h1 className="text-4xl">Vite + React</h1>
          </div>
          <div className="flex-1 p-4 text-center">
            <p className="py-2 text-xl text-muted-foreground">This is a template application for React and Vite.</p>
            <p className="py-2 text-xl text-muted-foreground">
              There are some test components on the site. Please clear the content and put down your code.
            </p>
          </div>
          <div className="m-4 flex-1"></div>
          <div className="flex-1 rounded border p-10">
            <div className="flex flex-col items-center">
              <div>
                <label className="text-xl">Counter: </label>
                <label className="text-xl">{count}</label>
              </div>
              <div className="py-4">
                <Button className="mx-4" onClick={() => setCount((count) => count + 1)}>
                  Increment
                </Button>
                <Button className="mx-4" onClick={() => setCount((count) => count - 1)}>
                  Decrement
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="flex h-16 w-full items-center bg-muted/40 pl-4">
        <p className="text-muted-foreground">test-softeno</p>
      </footer>
    </div>
  )
}

export default App
