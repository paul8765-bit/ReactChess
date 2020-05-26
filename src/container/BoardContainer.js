import React from 'react';
import { Colour } from '../model/Colour';
import { RenderSquare } from './SquareContainer';
import { Winner } from '../model/Winner';
import { Board } from '../presentational/Board';
import PropTypes from 'prop-types';

export class BoardContainer extends React.Component {
  getWinner() {
    const winner = this.props.winner;
    if (winner !== Winner.NONE) {
      if (winner === Winner.DRAW) {
        return <div className="status-important">Game Status: Game over: This game was a draw</div>
      }
      else {
        return <div className="status-important">Game Status: Game over: Winner is {winner}</div>
      }
    }
    else {
      return <div className="status">Game Status: Game in progress</div>
    }
  }

  getCheck() {
    const check = this.props.check;
    if (check) {
      return <div className="status-important">Check Status: Check!</div>
    }
    else {
      return <div className="status">Check Status: Neither king in check</div>
    }
  }

  render() {
    return <Board 
      nextTurn={this.props.nextTurn}
      winner={this.getWinner()}
      check={this.getCheck()}
      squares={this.props.squares}
      />;
  }
}

export function GetBoard(pieces, piecePositions, getPieceTypeById, getPieceColourById, handleClick) {
  const board = [];
  let firstTileInRowIsWhite = true;
  for (let row = 1; row <= 8; row++) {
    // Within this row, the first colour is taken from above boolean
    firstTileInRowIsWhite = !firstTileInRowIsWhite;
    let nextSquareIsWhite = firstTileInRowIsWhite ? false : true;
    for (let column = 1; column <= 8; column++) {
      const columnLetter = mapColumnNumberToLetter(column);
      nextSquareIsWhite = !nextSquareIsWhite;

      // We also need to work out if a square has a piece on it, before we render
      const piecePosition = doesSquareHavePieceOnIt(piecePositions, columnLetter + row);
      if (piecePosition) {
        // Render the Square with a Piece
        if (nextSquareIsWhite) {
          board.push(RenderSquare(columnLetter, row, Colour.WHITE, handleClick,
                                    piecePosition.pieceId,
                                    getPieceTypeById(pieces, piecePosition.pieceId),
                                    getPieceColourById(pieces, piecePosition.pieceId),
                                    ));
        }
        else {
          board.push(RenderSquare(columnLetter, row, Colour.BLACK, handleClick,
            piecePosition.pieceId,
            getPieceTypeById(pieces, piecePosition.pieceId),
            getPieceColourById(pieces, piecePosition.pieceId),
            ));
        }
      }
      // else we render a blank square
      else {
        if (nextSquareIsWhite) {
          board.push(RenderSquare(columnLetter, row, Colour.WHITE, handleClick));
        }
        else {
          board.push(RenderSquare(columnLetter, row, Colour.BLACK, handleClick));
        }
      }
    }
  }
  return board;
}

function mapColumnNumberToLetter(columnNumber) {
  switch (columnNumber) {
    case 1:
      return 'A';
    case 2:
      return 'B';
    case 3:
      return 'C';
    case 4:
      return 'D';
    case 5:
      return 'E';
    case 6:
      return 'F';
    case 7:
      return 'G';
    case 8:
      return 'H';
    default:
      return 'could not map ' + columnNumber;
  }
}

function doesSquareHavePieceOnIt(piecePositions, squareId) {
  if (piecePositions === undefined) {
    return false;
  }
  return piecePositions.find(element => element.position === squareId);
}

BoardContainer.propTypes = {
  nextTurn: PropTypes.string.isRequired,
  squares: PropTypes.arrayOf(PropTypes.element).isRequired,
  pieces: PropTypes.arrayOf(PropTypes.object).isRequired,
  piecePositions: PropTypes.arrayOf(PropTypes.object).isRequired,
  winner: PropTypes.string.isRequired,
  check: PropTypes.bool.isRequired
};