import React from 'react';
import { Cell } from './Cell';

type CellValue = -1 | 0 | 1;

interface BoardProps {
  board: CellValue[];
  onCellClick: (index: number) => void;
  disabled?: boolean;
}

export const Board: React.FC<BoardProps> = ({ board, onCellClick, disabled }) => {
  return (
    <div className="p-0 rounded-2xl overflow-hidden shadow-2xl">
      <div className="grid grid-cols-8 gap-0 bg-[var(--color-board-base)]">
        {board.map((cellValue, index) => (
          <Cell
            key={index}
            value={cellValue}
            onClick={() => onCellClick(index)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};
