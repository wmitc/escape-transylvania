import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Cipher } from './Cipher'
import type { CipherPuzzle } from '../data/puzzles'

const puzzle: CipherPuzzle = {
  id: 'test-cipher',
  type: 'cipher',
  title: 'Test Cipher',
  prompt: 'Decode it.',
  ciphertext: 'EORRG',
  solution: 'BLOOD',
  successMessage: 'Solved.',
}

describe('<Cipher>', () => {
  it('calls onSolved only for the correct (case-insensitive) answer', () => {
    const onSolved = vi.fn()
    render(<Cipher puzzle={puzzle} onSolved={onSolved} />)

    const input = screen.getByPlaceholderText('Decoded word')
    const submit = screen.getByRole('button', { name: 'Decode' })

    fireEvent.change(input, { target: { value: 'WRONG' } })
    fireEvent.click(submit)
    expect(onSolved).not.toHaveBeenCalled()
    expect(screen.getByText(/not the word/i)).toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'blood' } })
    fireEvent.click(submit)
    expect(onSolved).toHaveBeenCalledOnce()
  })
})
