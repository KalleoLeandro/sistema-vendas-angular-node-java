// src/App.test.tsx
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import App from './App'

vi.mock('./routes/AppRoutes', () => {
  return {
    __esModule: true,
    default: () => <div>Mocked AppRoutes</div>,
  }
})

describe('App', () => {
  it('renders AppRoutes component', () => {
    render(<App />)
    expect(screen.getByText('Mocked AppRoutes')).toBeInTheDocument()
  })
})
