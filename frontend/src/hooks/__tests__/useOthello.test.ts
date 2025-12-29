import { renderHook, act, waitFor } from '@testing-library/react';
import { useOthello } from '../useOthello';
import { gameApi } from '../../utils/gameApi';
import * as othelloLogic from '../../utils/othelloLogic';

// Mock proxies
jest.mock('../../utils/gameApi', () => ({
  gameApi: {
    fetchNextMove: jest.fn(),
  },
}));

jest.mock('../../utils/othelloLogic', () => ({
  getFlippedIndices: jest.fn(),
  boardToString: jest.fn(),
  hasValidMoves: jest.fn(),
}));

describe('useOthello Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementations
    (othelloLogic.hasValidMoves as jest.Mock).mockReturnValue(true);
    (othelloLogic.getFlippedIndices as jest.Mock).mockReturnValue([]);
    (othelloLogic.boardToString as jest.Mock).mockReturnValue("mockBoardString");
    (gameApi.fetchNextMove as jest.Mock).mockResolvedValue(10); // Default AI move
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useOthello());

    expect(result.current.turn).toBe(0);
    expect(result.current.winner).toBeNull();
    expect(result.current.passPopup).toBeNull();
    expect(result.current.gameMode).toBe('ai');
  });

  it('executes user move and triggers AI turn', async () => {
    (othelloLogic.getFlippedIndices as jest.Mock).mockReturnValue([20]); // Mock flipped stones

    const { result } = renderHook(() => useOthello());

    // Execute User Move
    await act(async () => {
      result.current.executeMove(19);
    });

    // Verify Board Update
    expect(result.current.board[19]).toBe(0); // User placed
    expect(result.current.board[20]).toBe(0); // Flipped

    // Verify turn switched to AI
    expect(result.current.turn).toBe(1);

    // Verify AI API call triggered
    await waitFor(() => {
      expect(gameApi.fetchNextMove).toHaveBeenCalled();
    });
  });

  it('handles AI pass correctly (-1 from API)', async () => {
    // Setup AI turn
    // We can simulate this by running a user move first
    (othelloLogic.getFlippedIndices as jest.Mock).mockReturnValue([20]);
    (gameApi.fetchNextMove as jest.Mock).mockResolvedValue(-1); // AI Pass

    const { result } = renderHook(() => useOthello());

    await act(async () => {
      result.current.executeMove(19);
    });

    // Wait for AI response processing
    await waitFor(() => {
      expect(result.current.passPopup).toBe('PLAYER1');
    });

    // Turn should be back to User (0) but popup is showing
    expect(result.current.turn).toBe(0);

    // Acknowledge Pass
    act(() => {
      result.current.acknowledgePass();
    });

    expect(result.current.passPopup).toBeNull();
    expect(result.current.turn).toBe(0);
  });

  it('handles User pass correctly (no valid moves)', async () => {
    // user turn, valid moves = false
    (othelloLogic.hasValidMoves as jest.Mock).mockImplementation((board, turn) => {
      if (turn === 0) return false; // User cannot move
      return true; // AI can move (so game not over)
    });

    const { result } = renderHook(() => useOthello());

    // Initial render should trigger checkPassCondition in useEffect
    await waitFor(() => {
      expect(result.current.passPopup).toBe('PLAYER0');
    });

    // Acknowledge Pass
    act(() => {
      result.current.acknowledgePass();
    });

    // Should switch to AI turn
    expect(result.current.passPopup).toBeNull();
    expect(result.current.turn).toBe(1);

    // AI should start thinking
    await waitFor(() => {
      expect(gameApi.fetchNextMove).toHaveBeenCalled();
    });
  });

  it('switches to human vs human mode', () => {
    const { result } = renderHook(() => useOthello());

    act(() => {
      result.current.setGameMode('human');
    });

    expect(result.current.gameMode).toBe('human');
  });

  it('executes moves for both players in human mode', async () => {
    (othelloLogic.getFlippedIndices as jest.Mock).mockReturnValue([20]); // Mock flipped stones

    const { result } = renderHook(() => useOthello());

    // Switch to human mode
    act(() => {
      result.current.setGameMode('human');
    });

    // Execute Black's move
    await act(async () => {
      result.current.executeMove(19);
    });

    // Verify Board Update
    expect(result.current.board[19]).toBe(0); // Black placed
    expect(result.current.board[20]).toBe(0); // Flipped

    // Verify turn switched to White (not AI)
    expect(result.current.turn).toBe(1);

    // Verify AI API NOT called in human mode
    await waitFor(() => {
      expect(gameApi.fetchNextMove).not.toHaveBeenCalled();
    }, { timeout: 1000 });

    // Mock for White's move
    (othelloLogic.getFlippedIndices as jest.Mock).mockReturnValue([28]);

    // Execute White's move
    await act(async () => {
      result.current.executeMove(21);
    });

    // Verify White's move
    expect(result.current.board[21]).toBe(1); // White placed
    expect(result.current.board[28]).toBe(1); // Flipped

    // Verify turn switched back to Black
    expect(result.current.turn).toBe(0);
  });

  it('handles pass in human vs human mode', async () => {
    (othelloLogic.hasValidMoves as jest.Mock).mockImplementation((board, turn) => {
      if (turn === 0) return false; // Black cannot move
      return true; // White can move
    });

    const { result } = renderHook(() => useOthello());

    // Switch to human mode
    act(() => {
      result.current.setGameMode('human');
    });

    // Initial render should trigger checkPassCondition for Black
    await waitFor(() => {
      expect(result.current.passPopup).toBe('PLAYER0');
    });

    // Acknowledge Pass
    act(() => {
      result.current.acknowledgePass();
    });

    // Should switch to White's turn (not AI)
    expect(result.current.passPopup).toBeNull();
    expect(result.current.turn).toBe(1);

    // Verify AI API NOT called
    await waitFor(() => {
      expect(gameApi.fetchNextMove).not.toHaveBeenCalled();
    }, { timeout: 1000 });
  });
});
