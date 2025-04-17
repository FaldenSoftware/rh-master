import React from 'react';
import { render, screen } from '@testing-library/react';
import AnimalProfile from '../AnimalProfile';
import { Alert } from "@/components/ui/alert"

// Mock data for testing
const mockAnimal = {
  id: '1',
  name: 'Buddy',
  species: 'Dog',
  breed: 'Golden Retriever',
  age: 3,
  gender: 'Male',
  description: 'A friendly and playful dog looking for a loving home.',
  image_url: 'https://example.com/buddy.jpg',
  is_adopted: false,
  created_at: '2023-01-01T00:00:00.000Z',
};

describe('AnimalProfile Component', () => {
  it('renders animal details correctly', () => {
    render(<AnimalProfile animal={mockAnimal} />);

    expect(screen.getByText('Buddy')).toBeInTheDocument();
    expect(screen.getByText('Dog')).toBeInTheDocument();
    expect(screen.getByText('Golden Retriever')).toBeInTheDocument();
    expect(screen.getByText('3 years old')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('A friendly and playful dog looking for a loving home.')).toBeInTheDocument();
  });

  it('displays "Not Adopted" message when animal is not adopted', () => {
    render(<AnimalProfile animal={mockAnimal} />);
    expect(screen.getByText('Not Adopted')).toBeInTheDocument();
  });

  it('does not display adoption message when animal is not adopted', () => {
    render(<AnimalProfile animal={mockAnimal} />);
    expect(screen.queryByText('Congratulations!')).not.toBeInTheDocument();
  });

  it('displays adoption message when animal is adopted', () => {
    const adoptedAnimal = { ...mockAnimal, is_adopted: true };
    render(<AnimalProfile animal={adoptedAnimal} />);
    expect(screen.getByText('Congratulations!')).toBeInTheDocument();
  });

  it('renders a yellow alert when animal is adopted', () => {
    const adoptedAnimal = { ...mockAnimal, is_adopted: true };
    render(<AnimalProfile animal={adoptedAnimal} />);
    
    const alertElement = screen.getByText('Congratulations! Buddy has found a new home!');
    expect(alertElement).toBeInTheDocument();
  });
});
