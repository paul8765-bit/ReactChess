import React from 'react';
import { Square } from '../presentational/Square';
  export function RenderSquare(column, row, squareColour, handleClick, pieceId, pieceType, pieceColour) {
    return <Square 
                  position={column + row}
                  colour={squareColour}
                  // Optionally a piece
                  pieceId={pieceId}
                  pieceType={pieceType}
                  pieceColour={pieceColour}
                  onClick={(i) => handleClick(i)} />;
  }