import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { expect } from 'vitest'
import App from '@/App.tsx'

describe('Page', () => {
  it('renders', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/test-softeno/i)).toBeInTheDocument()
    })
  })
  it('some logic', () => {
    expect(1).toEqual(1)
  })
})
