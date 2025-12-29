import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PassPopup } from '../PassPopup';

describe('PassPopup Component', () => {
  it('renders nothing when passType is null', () => {
    const { container } = render(<PassPopup passType={null} onAcknowledge={() => { }} gameMode="ai" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders AI pass message in AI mode when passType is PLAYER1', () => {
    render(<PassPopup passType="PLAYER1" onAcknowledge={() => { }} gameMode="ai" />);
    expect(screen.getByText('PASS')).toBeInTheDocument();
    expect(screen.getByText('AI cannot move. Turn passes to you.')).toBeInTheDocument();
  });

  it('renders User pass message in AI mode when passType is PLAYER0', () => {
    render(<PassPopup passType="PLAYER0" onAcknowledge={() => { }} gameMode="ai" />);
    expect(screen.getByText('PASS')).toBeInTheDocument();
    expect(screen.getByText('You cannot move. Turn passes to AI.')).toBeInTheDocument();
  });

  it('renders Black pass message in human mode when passType is PLAYER0', () => {
    render(<PassPopup passType="PLAYER0" onAcknowledge={() => { }} gameMode="human" />);
    expect(screen.getByText('PASS')).toBeInTheDocument();
    expect(screen.getByText('Black cannot move. Turn passes to White.')).toBeInTheDocument();
  });

  it('renders White pass message in human mode when passType is PLAYER1', () => {
    render(<PassPopup passType="PLAYER1" onAcknowledge={() => { }} gameMode="human" />);
    expect(screen.getByText('PASS')).toBeInTheDocument();
    expect(screen.getByText('White cannot move. Turn passes to Black.')).toBeInTheDocument();
  });

  it('calls onAcknowledge when OK button is clicked', () => {
    const mockAcknowledge = jest.fn();
    render(<PassPopup passType="PLAYER1" onAcknowledge={mockAcknowledge} gameMode="ai" />);

    const button = screen.getByRole('button', { name: 'OK' });
    fireEvent.click(button);

    expect(mockAcknowledge).toHaveBeenCalledTimes(1);
  });

  it('calls onAcknowledge when overlay is clicked', () => {
    const mockAcknowledge = jest.fn();
    render(<PassPopup passType="PLAYER1" onAcknowledge={mockAcknowledge} gameMode="ai" />);

    // The overlay is the outer div. We can find it by looking for the one with the click handler needed.
    // Or just check that clicking outside the modal content triggers it.
    // In our component, the outer div has the onClick.
    // Using a test-id or just assumption of structure. Let's add test-id if needed, but for now getting by text logic might miss the overlay.
    // Let's assume the first div in container is the overlay.
    // Actually, screen.getByText('PASS').parentElement?.parentElement should be the overlay.

    const modalContent = screen.getByText('PASS').parentElement;
    const overlay = modalContent?.parentElement;

    if (overlay) {
      fireEvent.click(overlay);
      expect(mockAcknowledge).toHaveBeenCalledTimes(1);
    } else {
      throw new Error("Overlay not found");
    }
  });

  it('does NOT call onAcknowledge when modal content is clicked', () => {
    const mockAcknowledge = jest.fn();
    render(<PassPopup passType="PLAYER1" onAcknowledge={mockAcknowledge} gameMode="ai" />);

    const modalContent = screen.getByText('PASS').parentElement;

    if (modalContent) {
      fireEvent.click(modalContent);
      expect(mockAcknowledge).not.toHaveBeenCalled();
    }
  });
});
