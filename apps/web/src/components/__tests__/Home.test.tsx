import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Home } from '../Home'
import { BrowserRouter } from 'react-router-dom'

describe('Home Component', () => {
  it('renders the hero title correctly', () => {
    render(
      <BrowserRouter>
        <Home isAuthenticated={false} />
      </BrowserRouter>
    )
    
    // Check for the main heading text in the Hero section
    const speedOf = screen.getAllByText(/The Speed of/i)[0]
    expect(speedOf).toBeInTheDocument()
    
    const elysia = screen.getAllByText(/Elysia/i)[0]
    expect(elysia).toBeInTheDocument()
  })

  it('renders authentication buttons correctly', () => {
    render(
      <BrowserRouter>
        <Home isAuthenticated={false} />
      </BrowserRouter>
    )
    
    // Use part of the text that's unique to the buttons
    expect(screen.getByText(/Sign In to/i)).toBeInTheDocument()
    expect(screen.getByText(/Get Running/i)).toBeInTheDocument()
  })

  it('renders dashboard link when authenticated', () => {
    render(
      <BrowserRouter>
        <Home isAuthenticated={true} />
      </BrowserRouter>
    )
    
    expect(screen.getByText(/Go to Profile/i)).toBeInTheDocument()
  })

  it('renders core technology highlights', () => {
     render(
      <BrowserRouter>
        <Home isAuthenticated={false} />
      </BrowserRouter>
    )
    
    // Technology identifiers
    expect(screen.getAllByText(/Bun/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/ElysiaJS/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/React 19/i).length).toBeGreaterThan(0)
  })
})
