// Runs before each test file. Adds jest-dom matchers (toBeInTheDocument, ...)
// and clears persisted state so tests don't leak into one another.
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  localStorage.clear()
})
