import React from 'react';
import { Colour } from './Colour';
import { RenderSquare } from './Square';
import { Winner } from './Winner';

export class Board extends React.Component {
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
      const status = `Next player: ${this.props.nextTurn}`;
      
  
      return (
        <div>
          {this.getWinner()}
          {this.getCheck()}
          <div className="status">{status}</div>
          <div className="board-row">
            {this.props.squares[56]}
            {this.props.squares[57]}
            {this.props.squares[58]}
            {this.props.squares[59]}
            {this.props.squares[60]}
            {this.props.squares[61]}
            {this.props.squares[62]}
            {this.props.squares[63]}
          </div>
          <div className="board-row">
            {this.props.squares[48]}
            {this.props.squares[49]}
            {this.props.squares[50]}
            {this.props.squares[51]}
            {this.props.squares[52]}
            {this.props.squares[53]}
            {this.props.squares[54]}
            {this.props.squares[55]}
          </div>
          <div className="board-row">
            {this.props.squares[40]}
            {this.props.squares[41]}
            {this.props.squares[42]}
            {this.props.squares[43]}
            {this.props.squares[44]}
            {this.props.squares[45]}
            {this.props.squares[46]}
            {this.props.squares[47]}
          </div>
          <div className="board-row">
            {this.props.squares[32]}
            {this.props.squares[33]}
            {this.props.squares[34]}
            {this.props.squares[35]}
            {this.props.squares[36]}
            {this.props.squares[37]}
            {this.props.squares[38]}
            {this.props.squares[39]}
          </div>
          <div className="board-row">
            {this.props.squares[24]}
            {this.props.squares[25]}
            {this.props.squares[26]}
            {this.props.squares[27]}
            {this.props.squares[28]}
            {this.props.squares[29]}
            {this.props.squares[30]}
            {this.props.squares[31]}
          </div>
          <div className="board-row">
            {this.props.squares[16]}
            {this.props.squares[17]}
            {this.props.squares[18]}
            {this.props.squares[19]}
            {this.props.squares[20]}
            {this.props.squares[21]}
            {this.props.squares[22]}
            {this.props.squares[23]}
          </div>
          <div className="board-row">
            {this.props.squares[8]}
            {this.props.squares[9]}
            {this.props.squares[10]}
            {this.props.squares[11]}
            {this.props.squares[12]}
            {this.props.squares[13]}
            {this.props.squares[14]}
            {this.props.squares[15]}
          </div>
          <div className="board-row">
            {this.props.squares[0]}
            {this.props.squares[1]}
            {this.props.squares[2]}
            {this.props.squares[3]}
            {this.props.squares[4]}
            {this.props.squares[5]}
            {this.props.squares[6]}
            {this.props.squares[7]}
          </div>
        </div>
      );
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

