import React from 'react';

type CellValue = -1 | 0 | 1; // -1: Empty, 0: Black, 1: White

interface CellProps {
  value: CellValue;
  onClick?: () => void;
  disabled?: boolean;
}

export const Cell: React.FC<CellProps> = ({ value, onClick, disabled }) => {
  // Always render the empty cell background
  const bgImage = '/assets/game/cell_empty.png';

  // Determine stone image (with transparency)
  let stoneImage = null;
  if (value === 0) stoneImage = '/assets/game/stone_black.png';
  if (value === 1) stoneImage = '/assets/game/stone_white.png';

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`
        w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20
        flex items-center justify-center
        cursor-pointer
        relative
        bg-[#2F5D40]
        border border-white/10
      `}
    >
      {/* Background Layer: Always the seamless empty cell */}
      <img
        src={bgImage}
        alt="Cell"
        className="absolute inset-0 w-full h-full object-cover block"
        draggable={false}
        onError={(e) => {
          console.error("Image failed to load:", bgImage);
          e.currentTarget.style.display = 'none';
        }}
      />

      {/* Stone Layer: Overlay on top */}
      {stoneImage && (
        <img
          src={stoneImage}
          alt={value === 0 ? "Black" : "White"}
          className="absolute inset-0 w-full h-full object-contain block z-10"
          draggable={false}
        />
      )}
    </div>
  );
};
