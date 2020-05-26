import { GetPieceColourById, GetPieceIdByPosition, GetPieceTypeById } from './PieceContainer';
import { PieceType } from '../model/PieceType';
import { IncrementColumn, IncrementRow, DecrementColumn, DecrementRow } from './ColumnAndRowManager';
import { Colour } from '../model/Colour';
import { CheckEval } from './GameContainer';
import { cloneDeep } from 'lodash';

export function GetPossibleMoves(pieceId, location, pieces, piecePositions, currentTurn, ongoingCheckEval = false) {
    // Firstly, let's find out which type this piece is
    const pieceType = GetPieceTypeById(pieces, pieceId);
    let possibleMoves;

    if (pieceType === PieceType.PAWN) {
      possibleMoves = getPossibleMovesPawn(pieceId, location, pieces, piecePositions, currentTurn);
    }
    else if (pieceType === PieceType.KNIGHT) {
      possibleMoves = getPossibleMovesKnight(pieceId, location, pieces, piecePositions, currentTurn);
    }
    else if (pieceType === PieceType.BISHOP) {
      possibleMoves = getPossibleMovesBishop(pieceId, location, pieces, piecePositions, currentTurn);
    }
    else if (pieceType === PieceType.ROOK) {
      possibleMoves = getPossibleMovesRook(pieceId, location, pieces, piecePositions, currentTurn);
    }
    else if (pieceType === PieceType.QUEEN) {
      possibleMoves = getPossibleMovesQueen(pieceId, location, pieces, piecePositions, currentTurn);
    }
    else if (pieceType === PieceType.KING) {
      possibleMoves = getPossibleMovesKing(pieceId, location, pieces, piecePositions, currentTurn);
    }

    // Break here is there is an ongoing eval function for check - otherwise we get into an infinite loop
    if (ongoingCheckEval) {
      return possibleMoves;
    }

    // Only moves which result in a negative value for check are allowed
    // Will this move resolve check?
    const possibleMovesForCheck = [];
    possibleMoves.forEach(move => {
      if (WillMoveResultInCheck(pieceId, piecePositions, currentTurn, move, pieces)) {
        //console.log(`Not allowing move to ${move} because this does not resolve check`);
      }
      else {
        //console.log(`Move to ${move} is fine as it resolves check`);
        possibleMovesForCheck.push(move);
      }
    });
    return possibleMovesForCheck;
    
  }

  function getPossibleMovesKing(pieceId, location, pieces, piecePositions, currentTurn) {
    const possibleMoves = [];

    // A king can move as follows:
    // 1 space only in any vertical or horizontal or diagonal direction, unless:
    //    the move goes over the edge of the board
    //    the move goes onto a friendly piece 
    // Four compass directions
    getStraightLineMovesForward(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn, 1);
    getStraightLineMovesRight(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn, 1);
    getStraightMovesBackward(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn, 1);
    getStraightMovesLeft(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn, 1);
    // Four diagonal directions
    getStraightLineMovesForwardRight(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn, 1);
    getStraightLineMovesBackwardRight(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn, 1);
    getStraightLineMovesBackwardLeft(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn, 1);
    getStraightLineMovesForwardLeft(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn, 1);

    return possibleMoves;
  }

  function getPossibleMovesQueen(pieceId, location, pieces, piecePositions, currentTurn) {
    const possibleMoves = [];

    // A queen can move as follows:
    // any number of spaces (up to a theoretical maximum of 7) in any vertical or horizontal or diagonal direction, until:
    //    it reaches the edge of the board
    //    it reaches a friendly piece (and stops short)
    //    it reaches a enemy piece and takes it
    // Four compass directions
    getStraightLineMovesForward(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn);
    getStraightLineMovesRight(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn);
    getStraightMovesBackward(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn);
    getStraightMovesLeft(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn);
    // Four diagonal directions
    getStraightLineMovesForwardRight(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn);
    getStraightLineMovesBackwardRight(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn);
    getStraightLineMovesBackwardLeft(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn);
    getStraightLineMovesForwardLeft(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn);

    return possibleMoves;
  }

  function getPossibleMovesRook(pieceId, location, pieces, piecePositions, currentTurn) {
    const possibleMoves = [];

    // A rook can move as follows:
    // any number of spaces (up to a theoretical maximum of 7) in any vertical or horizontal direction, until:
    //    it reaches the edge of the board
    //    it reaches a friendly piece (and stops short)
    //    it reaches a enemy piece and takes it
    getStraightLineMovesForward(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn);
    getStraightLineMovesRight(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn);
    getStraightMovesBackward(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn);
    getStraightMovesLeft(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn);

    return possibleMoves;
  }

  function getStraightLineMovesForward(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn, max = 7) {
    // Move a square at a time until we reach one of the conditions:
    //    it reaches the edge of the board
    //    it reaches a friendly piece (and stops short)
    //    it reaches a enemy piece and takes it
    let keepMovingInThisDirection = true;
    let nextPosition = location;
    let moveCount = 0;
    do {
      nextPosition = IncrementRow(nextPosition, currentTurn, 1);
      keepMovingInThisDirection = isStraightLineMoveValid(nextPosition, pieceId, piecePositions, pieces, currentTurn, possibleMoves);
      moveCount++;
    }
    while (keepMovingInThisDirection && moveCount < max);
  }

  function getStraightLineMovesRight(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn, max = 7) {
    // Move a square at a time until we reach one of the conditions:
    //    it reaches the edge of the board
    //    it reaches a friendly piece (and stops short)
    //    it reaches a enemy piece and takes it
    let keepMovingInThisDirection = true;
    let nextPosition = location;
    let moveCount = 0;
    do {
      nextPosition = IncrementColumn(nextPosition, 1);
      keepMovingInThisDirection = isStraightLineMoveValid(nextPosition, pieceId, piecePositions, pieces, currentTurn, possibleMoves);
      moveCount++;
    }
    while (keepMovingInThisDirection && moveCount < max);
  }

  function getStraightMovesBackward(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn, max = 7) {
    // Move a square at a time until we reach one of the conditions:
    //    it reaches the edge of the board
    //    it reaches a friendly piece (and stops short)
    //    it reaches a enemy piece and takes it
    let keepMovingInThisDirection = true;
    let nextPosition = location;
    let moveCount = 0;
    do {
      nextPosition = DecrementRow(nextPosition, currentTurn, 1);
      keepMovingInThisDirection = isStraightLineMoveValid(nextPosition, pieceId, piecePositions, pieces, currentTurn, possibleMoves);
      moveCount++;
    }
    while (keepMovingInThisDirection && moveCount < max);
  }

  function getStraightMovesLeft(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn, max = 7) {
    // Move a square at a time until we reach one of the conditions:
    //    it reaches the edge of the board
    //    it reaches a friendly piece (and stops short)
    //    it reaches a enemy piece and takes it
    let keepMovingInThisDirection = true;
    let nextPosition = location;
    let moveCount = 0;
    do {
      nextPosition = DecrementColumn(nextPosition, 1);
      keepMovingInThisDirection = isStraightLineMoveValid(nextPosition, pieceId, piecePositions, pieces, currentTurn, possibleMoves);
      moveCount++;
    }
    while (keepMovingInThisDirection && moveCount < max);
  }

  function getPossibleMovesBishop(pieceId, location, pieces, piecePositions, currentTurn) {
    const possibleMoves = [];

    // A bishop can move as follows:
    // any number of spaces (up to a theoretical maximum of 7) in any diagonal direction, until:
    //    it reaches the edge of the board
    //    it reaches a friendly piece (and stops short)
    //    it reaches a enemy piece and takes it
    getStraightLineMovesForwardRight(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn);
    getStraightLineMovesBackwardRight(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn);
    getStraightLineMovesBackwardLeft(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn);
    getStraightLineMovesForwardLeft(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn);

    return possibleMoves;
  }

  function getStraightLineMovesForwardRight(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn, max = 7) {
    // Move a square at a time until we reach one of the conditions:
    //    it reaches the edge of the board
    //    it reaches a friendly piece (and stops short)
    //    it reaches a enemy piece and takes it
    let keepMovingInThisDirection = true;
    let nextPosition = location;
    let moveCount = 0;
    do {
      nextPosition = IncrementColumn(IncrementRow(nextPosition, currentTurn, 1), 1);
      keepMovingInThisDirection = isStraightLineMoveValid(nextPosition, pieceId, piecePositions, pieces, currentTurn, possibleMoves);
      moveCount++;
    }
    while (keepMovingInThisDirection && moveCount < max);
  }

  function getStraightLineMovesBackwardRight(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn, max = 7) {
    // Move a square at a time until we reach one of the conditions:
    //    it reaches the edge of the board
    //    it reaches a friendly piece (and stops short)
    //    it reaches a enemy piece and takes it
    let keepMovingInThisDirection = true;
    let nextPosition = location;
    let moveCount = 0;
    do {
      nextPosition = IncrementColumn(DecrementRow(nextPosition, currentTurn, 1), 1);
      keepMovingInThisDirection = isStraightLineMoveValid(nextPosition, pieceId, piecePositions, pieces, currentTurn, possibleMoves);
      moveCount++;
    }
    while (keepMovingInThisDirection && moveCount < max);
  }

  function getStraightLineMovesBackwardLeft(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn, max = 7) {
    // Move a square at a time until we reach one of the conditions:
    //    it reaches the edge of the board
    //    it reaches a friendly piece (and stops short)
    //    it reaches a enemy piece and takes it
    let keepMovingInThisDirection = true;
    let nextPosition = location;
    let moveCount = 0;
    do {
      nextPosition = DecrementColumn(DecrementRow(nextPosition, currentTurn, 1), 1);
      keepMovingInThisDirection = isStraightLineMoveValid(nextPosition, pieceId, piecePositions, pieces, currentTurn, possibleMoves);
      moveCount++;
    }
    while (keepMovingInThisDirection && moveCount < max);
  }

  function getStraightLineMovesForwardLeft(possibleMoves, pieceId, location, pieces, piecePositions, currentTurn, max = 7) {
    // Move a square at a time until we reach one of the conditions:
    //    it reaches the edge of the board
    //    it reaches a friendly piece (and stops short)
    //    it reaches a enemy piece and takes it
    let keepMovingInThisDirection = true;
    let nextPosition = location;
    let moveCount = 0;
    do {
      nextPosition = DecrementColumn(IncrementRow(nextPosition, currentTurn, 1), 1);
      keepMovingInThisDirection = isStraightLineMoveValid(nextPosition, pieceId, piecePositions, pieces, currentTurn, possibleMoves);
      moveCount++;
    }
    while (keepMovingInThisDirection && moveCount < max);
  }

  function isStraightLineMoveValid(nextPosition, pieceId, piecePositions, pieces, currentTurn, possibleMoves) {
    let keepMovingInThisDirection = true;
    // Is this square outside the board?
    if (!isInBoundsOfBoard(nextPosition)) {
      //console.log(`${pieceId} cannot move to ${nextPosition} as it is outside of the board`);
      keepMovingInThisDirection = false;
    }
    // Is there a piece in this square already?
    else if (GetPieceIdByPosition(nextPosition, piecePositions)) {
      const pieceIdAlreadyInSquare = GetPieceIdByPosition(nextPosition, piecePositions);

      // If this piece is friendly, we cannot move here and must stop
      if (GetPieceColourById(pieces, pieceIdAlreadyInSquare) === currentTurn) {
        //console.log(`${pieceId} cannot move to ${nextPosition} as friendly piece ${pieceIdAlreadyInSquare} is already there`);
        keepMovingInThisDirection = false;
      }
      // Else an enemy piece here - this move is allowed but no further
      else {
        possibleMoves.push(nextPosition);
        keepMovingInThisDirection = false;
      }
    }
    // Else this is an empty square on the board and we're cool
    else {
      possibleMoves.push(nextPosition);
    }

    return keepMovingInThisDirection;
  }

  function getPossibleMovesKnight(pieceId, location, pieces, piecePositions, currentTurn) {
    const possibleMoves = [];

    // A knight will always have eight possible moves
    const knightMoveArray = getKnightPositions(location, currentTurn);

    // Evaluating them is fairly easy - if the space is on the board, and isn't taken by a friendly space,
    // it's good
    knightMoveArray.forEach(position => {
        if (isInBoundsOfBoard(position)) {
            const pieceInSpace = GetPieceIdByPosition(position, piecePositions);
            if (!pieceInSpace) {
                possibleMoves.push(position);
            }
            else {
                if (GetPieceColourById(pieces, pieceInSpace) !== currentTurn) {
                    possibleMoves.push(position);
                }
                else {
                    //console.log(`Not permitting move to ${position} for knight ${pieceInSpace} as a friendly piece is there (${pieceInSpace})`);
                }
            }
        }
        else {
            //console.log(`Not suggesting move to ${position} for knight ${pieceId} as it is not in bounds of board`);
        }
    });

    return possibleMoves;
  }

  function getKnightPositions(location, currentTurn) {
    const knightMoves = [];

    // Eight possibilities, going clockwise:
    //  Forward 2, right 1
    knightMoves.push(IncrementColumn(IncrementRow(location, currentTurn, 2), 1));
    //  Forward 1, right 2
    knightMoves.push(IncrementColumn(IncrementRow(location, currentTurn, 1), 2));
    //  BAckwards 1, right 2
    knightMoves.push(IncrementColumn(DecrementRow(location, currentTurn, 1), 2));
    //  Backwards 2, right 1
    knightMoves.push(IncrementColumn(DecrementRow(location, currentTurn, 2), 1));
    //  Backwards 2, left 1
    knightMoves.push(DecrementColumn(DecrementRow(location, currentTurn, 2), 1));
    //  Backwards 1, left 2
    knightMoves.push(DecrementColumn(DecrementRow(location, currentTurn, 1), 2));
    //  Forward 1, left 2
    knightMoves.push(DecrementColumn(IncrementRow(location, currentTurn, 1), 2));
    //  Forward 2, left 1
    knightMoves.push(DecrementColumn(IncrementRow(location, currentTurn, 2), 1));
    return knightMoves;
  }

  function getPossibleMovesPawn(pieceId, location, pieces, piecePositions, currentTurn) {
    const possibleMoves = [];

    // Pawns can move forwards one space at a time, unless this is the first move and there are
    // no pieces in the way
    const moveForwardsLocationArray = getPositionsMovingForwards(location, 2, currentTurn);
    if (moveForwardsLocationArray.length === 0) {
      //console.log(`No forward locations identified for piece ${pieceId}`);
    }
    else {
        const forwardPosition = moveForwardsLocationArray[0];
        const doubleForwardPosition = moveForwardsLocationArray.length === 2 ? moveForwardsLocationArray[1] : undefined;
        
        // For the standard single move, this is allowed if:
        // Into an empty space
        if (GetPieceIdByPosition(forwardPosition, piecePositions)) {
            // There is already a piece in this position so skip it
            //console.log(`getPossibleMoves: piece ${pieceId} is not able to move to ${forwardPosition} as 
            //                                piece ${GetPieceIdByPosition(forwardPosition, piecePositions)} is alreay there`);
        }
        else {
            possibleMoves.push(forwardPosition);
        }

        // For the double move, this is allowed if:
        //   The piece is on row 2 for white, row 7 for black
        //   There is no piece on the space inbetween
        //   There is no piece in the destination position 
        if (pawnIsOnStartingSpace(pieceId, location, pieces)) {
            if (!GetPieceIdByPosition(DecrementRow(doubleForwardPosition, currentTurn, 1), piecePositions)) {
                if (!GetPieceIdByPosition(doubleForwardPosition, piecePositions)) {
                    possibleMoves.push(doubleForwardPosition);
                }
                else {
                    //console.log(`No double-move to ${location} permitted for ${pieceId} as the destination square is not empty`);
                }
            }
            else {
                //console.log(`No double-move to ${location} permitted for ${pieceId} as the piece would have to travel through another piece`);
            }
        }
        else {
            //console.log(`No double-move permitted for ${pieceId} as it is not on its starting space (currently on ${location})`);
        }
    }

    // Unless they are taking an opponent piece, in which case they can move diagonally forward
    const moveDiagonallyLocation = getPositionMovingDiagonally(location, 1, currentTurn);
    if (moveDiagonallyLocation === 0) {
      //console.log(`No diagonal locations identified for piece ${pieceId}`);
    }
    else {
    moveDiagonallyLocation.forEach(diagonalPosition => {
        // can only move to a diagonal position if there is an opposing piece there
        const pieceInPossiblePosition = GetPieceIdByPosition(diagonalPosition, piecePositions);
        if (pieceInPossiblePosition && GetPieceColourById(pieces, pieceInPossiblePosition) !== 
                                                                            currentTurn) {
          //console.log(`Position ${diagonalPosition} DOES meet the criteria for a diagonal move`);
          possibleMoves.push(diagonalPosition);
        }
        else {
          //console.log(`Position ${diagonalPosition} does not meet the criteria for a diagonal move`);
        }
    });
    }
    
    return possibleMoves;
  }

  function pawnIsOnStartingSpace(pieceId, location, pieces) {
    const colour = GetPieceColourById(pieces, pieceId);
    if (colour === Colour.WHITE) {
        return +location[1] === 2;
    }
    else {
        return +location[1] === 7;
    }
  }

  function getPositionsMovingForwards(position, maxDistance, currentTurn) {
    const newPositions = [];
    for (let distanceIndex = 1; distanceIndex <= maxDistance; distanceIndex++) {
        const newPosition = IncrementRow(position, currentTurn, distanceIndex);
        if (isInBoundsOfBoard(newPosition)) newPositions.push(newPosition);
            //console.log(`Not suggesting position ${newPosition} as it is out of bounds of board`);
    }
    
    return newPositions;
  }

  function isInBoundsOfBoard(position) {
    // Firstly that the first char is A-H
    const firstPos = position[0];
    if (firstPos === 'A' || firstPos === 'B' || firstPos === 'C' || firstPos === 'D'
     || firstPos === 'E' || firstPos === 'F' || firstPos === 'G' || firstPos === 'H')
    {
      // Then that the second char is 1-8
      const secondPos = position[1];
      if (secondPos >= 1 && secondPos <= 8) {
        // Also anything else silly
        if (position.length === 2) {
          return true;
        }
      }
    }
    return false;      
  }

  function getPositionMovingDiagonally(position, maxDistance, currentTurn) {
    const newPositions = [];
    for (let distance = 1; distance <= maxDistance; distance++) {
      const newPositionToLeft = IncrementRow(DecrementColumn(position), currentTurn, 1);
      const newPositionToRight = IncrementRow(IncrementColumn(position), currentTurn, 1);
      if (isInBoundsOfBoard(newPositionToLeft)) newPositions.push(newPositionToLeft);  
            //console.log(`Not suggesting position ${newPositionToLeft} as it is out of bounds of board`);
      if (isInBoundsOfBoard(newPositionToRight)) newPositions.push(newPositionToRight); 
            //console.log(`Not suggesting position ${newPositionToRight} as it is out of bounds of board`);
    }
    return newPositions;
  }

  export function WillMoveResultInCheck(pieceId, piecePositions, currentTurn, move, pieces) {
    // Need to simulate this move going ahead        
    const simPiecePositions = cloneDeep(piecePositions);
    // Clear any existing pieces that will be taken
    const pieceIdAlreadyInSquare = simPiecePositions.find(piecePos => piecePos.position === move);
    if (pieceIdAlreadyInSquare) {
      pieceIdAlreadyInSquare.position = 'Z0';
    }

    // Now move our piece
    simPiecePositions.find(piecePos => piecePos.pieceId === pieceId).position = move;
    // The offensive team is the other team
    const offensiveTeam = currentTurn === Colour.WHITE ? Colour.BLACK : Colour.WHITE;
    return CheckEval(pieces, offensiveTeam, simPiecePositions);
  }