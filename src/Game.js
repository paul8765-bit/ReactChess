import React from 'react';
import { Winner } from './Winner';
import { Colour} from './Colour';
import { Board, GetBoard } from './Board';
import { GetPieces, GetPieceColourById, GetPieceTypeById, GetPieceIdByPosition,  } from './Piece';
import { RenderSquare } from './Square';
import { GetPiecePositions } from './PiecePositions';
import { GetPossibleMoves } from './MoveManager';
import { TakenPieces } from './TakenPieces';
import { cloneDeep } from 'lodash';
import { PieceType } from './PieceType';


export class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            turnNumber: 1,
            currentTurn: Colour.WHITE,
            winner: Winner.NONE,
            pieces: GetPieces(),
            piecePositions: GetPiecePositions(),
            board: GetBoard(GetPieces(), GetPiecePositions(), GetPieceTypeById, GetPieceColourById, 
                              i => this.handleClick(i)),
            touchedPieceId: undefined,
            isInCheck: false
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
      // So either the click is a 'touch',
      // or it is a move of a previously touched piece
      // We store in state which it is
      if (this === undefined || this.state === undefined) {
        return;
      }
      // Or if the game is over, no further moves allowed
      if (this.state.winner !== Winner.NONE) {
        return;
      }
      if (!this.state.touchedPieceId) {
        this.handleSelectPiece(e);
      }
      else {
        this.handleMovePiece(e);
      }
    }

    handleSelectPiece(e) {
      // Does this square have a piece on it already?
      const pieceOnClickedSquare = GetPieceIdByPosition(e, this.state.piecePositions);
      if (!pieceOnClickedSquare) {
        alert(`No piece is on the square you clicked: ${e}`);
        return;
      }

      // Does this piece belong to the correct player (i.e. whose turn it is?)
      if (this.state.currentTurn !== GetPieceColourById(this.state.pieces, pieceOnClickedSquare)) {
        alert(`Piece ${pieceOnClickedSquare} on square ${e} doesn't belong to you!`);
        return;
      }

      // Can this piece move (i.e. the list of squares this piece can move to is > 0)?
      const possibleMovesForPiece = GetPossibleMoves(pieceOnClickedSquare, e, this.state.pieces, 
                          this.state.piecePositions, this.state.currentTurn);
      if (possibleMovesForPiece === undefined || possibleMovesForPiece.length === 0) {
        alert(`Piece ${pieceOnClickedSquare} on square ${e} does not have any valid moves available`);
        return;
      }

      // If all of these are OK, set this piece as touched
      console.log(`Perfectly valid piece ${pieceOnClickedSquare} in position ${e} selected`);
      console.log('Possible moves are:');
      possibleMovesForPiece.forEach(location => {
        console.log(location);
      });

      // Want to highlight this square so that it is clear to the user that this has happened
      // TODO
      this.setState({touchedPieceId: pieceOnClickedSquare});
      this.setState({possibleMoves: possibleMovesForPiece});
    }

    handleMovePiece(e) {
      if (!this.state.touchedPieceId || !this.state.possibleMoves) {
        alert('A piece has been touched... but not stored?! Will try and fix, please try again');
        this.setState({touchedPieceId: undefined});
        this.setState({possibleMoves: undefined});
        return;
      }

      // The user has selected a destination square
      // IS this one of the possible highlighted moves (stored in state)?
      if (!this.state.possibleMoves.includes(e)) {
        alert(`Not possible to move ${this.state.touchedPieceId} to ${e}. Please select a valid destination square`);
        return;
      }

      // Move the piece
      const newBoard = this.updateBoardForPieceMove(e);

      //      Update PiecePositions
      const newPiecePositions = this.updatePositionsForPieceMove(e);

      // After this move, is the king of the opposing team in check?
      const newCheckState = CheckEval(this.state.pieces, this.state.currentTurn, newPiecePositions);
      
      this.setState({touchedPieceId: undefined,
                      possibleMoves: undefined,
                    currentTurn: this.state.currentTurn === Colour.WHITE ? Colour.BLACK : Colour.WHITE,
                    isInCheck: newCheckState,
                    board: newBoard,
                    piecePositions: newPiecePositions},
                    this.isGameOver);
    }

    updatePositionsForPieceMove(e) {
      const newPiecePositions = cloneDeep(this.state.piecePositions);
      // Does an opponent piece need to be removed? If so we need to do this
      if (newPiecePositions.find(piece => piece.position === e)) {
        const opponentPieceIdToRemove = newPiecePositions.find(piece => piece.position === e).pieceId;
        const opponentPiecePositionIndex = newPiecePositions.findIndex(piece => piece.pieceId === opponentPieceIdToRemove);
        console.log(`This move takes piece ${opponentPieceIdToRemove} on square ${e}`);

        // To remove the piece, the UI is already taken care of. Just need to update PiecePositions
        newPiecePositions[opponentPiecePositionIndex].position = 'Z0';
      }
      const piecePositionIndex = newPiecePositions.findIndex(piecePos => piecePos.pieceId === this.state.touchedPieceId);
      newPiecePositions[piecePositionIndex].position = e;
      return newPiecePositions;
    }

    updateBoardForPieceMove(e) {
      //      Set the destination square to include the image of this piece
      const newBoard = cloneDeep(this.state.board);
      const destinationSquareIndex = newBoard.findIndex(square => square.props.position === e);
      const destSquareColour = newBoard[destinationSquareIndex].props.colour;
      newBoard[destinationSquareIndex] = RenderSquare(e[0], e[1], destSquareColour, i => this.handleClick(i),
                                this.state.touchedPieceId, 
                                GetPieceTypeById(this.state.pieces, this.state.touchedPieceId),
                                GetPieceColourById(this.state.pieces, this.state.touchedPieceId));


      //      Set the source square to a blank square
      const sourceSquareLocation = this.state.piecePositions.find(piecePos => piecePos.pieceId === this.state.touchedPieceId).position;
      const sourceSquareIndex = newBoard.findIndex(square => square.props.position === sourceSquareLocation);
      const sourceSquareColour = newBoard[sourceSquareIndex].props.colour;
      newBoard[sourceSquareIndex] = RenderSquare(sourceSquareLocation[0], sourceSquareLocation[1],
                                                      sourceSquareColour, i => this.handleClick(i));

      return newBoard;
    }

    isGameOver() {
      // What happens next? game over or next players turn?
      let result;
      const checkmateOrStalemate = this.checkmateOrStalemate();
      if (checkmateOrStalemate !== Winner.NONE) {
        if (checkmateOrStalemate === Winner.DRAW) {
          result = `Game over! This game was a draw (presumably stalemate)`;
        }
        else {
          result = `Game over! This game was won by ${checkmateOrStalemate}`;
        }
        console.log(result);
      }
      else {
        result = 'Game continues';
      }

      console.log(result);
      this.setState({ winner: checkmateOrStalemate}, this.promotePawns);
    }

    checkmateOrStalemate() {
      if (this.checkmate()) {
        return this.state.currentTurn === Colour.WHITE ? Colour.BLACK : Colour.WHITE;
      }
      else if (this.stalemate()) {
        return Winner.DRAW;
      }
      else {
        return Winner.NONE;
      }
    }

    checkmate() {
      // Check occurs when the defensive team is in check, and has 0 moves which will cause check to become false
      // Return the winning team (or false)
      // So firstly lets check if we're currently in check, otherwise false
      if (!this.state.isInCheck) {
        return false;
      }
      
      return !this.canTeamGetOutOfCheck();
    }

    stalemate() {
      // Check occurs when the defensive team is NOT in check, and has 0 moves which will cause check to become false
      // So firstly lets check if we're currently in check, otherwise false
      if (this.state.isInCheck) {
        return false;
      }
      return !this.canTeamGetOutOfCheck();
    }

    canTeamGetOutOfCheck() {
      const defensiveTeam = this.state.currentTurn;
      const offensiveTeam = this.state.currentTurn === Colour.WHITE ? Colour.BLACK : Colour.WHITE;
      const allMovesForTeam = getAllPossibleMovesForTeam(defensiveTeam, this.state.pieces, this.state.piecePositions);

      // Validate each of these moves to see if any result in check becoming false
      // Implement this as a for loop rather than a foreach for performance
      for (let moveIndex = 0; moveIndex < allMovesForTeam.length; moveIndex++) {
        const pieceAndMove = allMovesForTeam[moveIndex];
        const simPiecePositions = cloneDeep(this.state.piecePositions);
        // Clear any other pieces that are in this position
        const takenPiece = simPiecePositions.find(piecePos => piecePos.position === pieceAndMove.position);
        if (takenPiece) {
          takenPiece.position = 'Z0';
        }

        // Move the enemy piece into the square
        simPiecePositions.find(piecePos => piecePos.pieceId === pieceAndMove.pieceId).position = pieceAndMove.position;
        if (!CheckEval(this.state.pieces, offensiveTeam, simPiecePositions)) {
          return true;
        }
      };
      // If none resolve the check, this is checkmate
      return false;
    }

    promotePawns() {
      // if the game is over, stop here
      if (this.state.winner !== Winner.NONE) {
        return;
      }
      // Find any white pawns on row 8, or black pawns on row 1
      const pawnsToPromote = this.state.piecePositions.filter(piecePos => {
        return (piecePos.position[1] === '1' && GetPieceColourById(this.state.pieces, piecePos.pieceId) === Colour.BLACK &&
                GetPieceTypeById(this.state.pieces, piecePos.pieceId) === PieceType.PAWN) || 
        (piecePos.position[1] === '8' && GetPieceColourById(this.state.pieces, piecePos.pieceId) === Colour.WHITE &&
        GetPieceTypeById(this.state.pieces, piecePos.pieceId) === PieceType.PAWN);
      });

      const newPieces = cloneDeep(this.state.pieces);
      const newBoard = cloneDeep(this.state.board);
      pawnsToPromote.forEach(pawnPiecePos => {
        // change the model to reflect this
        newPieces.find(piece => piece.props.id === pawnPiecePos.pieceId).props.pieceType = PieceType.QUEEN;
        
        const newBoard = cloneDeep(this.state.board);
        const destinationSquareIndex = newBoard.findIndex(square => square.props.position === pawnPiecePos.position);
        const destSquareColour = newBoard[destinationSquareIndex].props.colour;
        newBoard[destinationSquareIndex] = RenderSquare(pawnPiecePos.position[0], pawnPiecePos.position[1], 
                                  destSquareColour, i => this.handleClick(i),
                                  pawnPiecePos.pieceId, 
                                  PieceType.QUEEN,
                                  GetPieceColourById(this.state.pieces, pawnPiecePos.pieceId));
      });
      this.setState({ pieces: newPieces, board: newBoard}, this.moveAISelectPiece);
    }

    moveAISelectPiece() {
      // If it is black's turn, we need to:
      if (this.state.currentTurn === Colour.WHITE) {
        return;
      }
      // get all possible moves black can make
      const allMovesForBlack = getAllPossibleMovesForTeam(Colour.BLACK, this.state.pieces, this.state.piecePositions, false);

      // randomly select one
      const selectedMove = this.getRandomMove(allMovesForBlack);
      this.setState({
        touchedPieceId: selectedMove.pieceId,
        possibleMoves: [ selectedMove.position]
      }, this.moveAIMovePiece);
    }

    moveAIMovePiece() {
      // execute that move
      const newBoard = this.updateBoardForPieceMove(this.state.possibleMoves[0]);

      //      Update PiecePositions
      const newPiecePositions = this.updatePositionsForPieceMove(this.state.possibleMoves[0]);

      // After this move, is the king of the opposing team in check?
      const newCheckState = CheckEval(this.state.pieces, this.state.currentTurn, newPiecePositions);

      this.setState({touchedPieceId: undefined,
                    possibleMoves: undefined,
                  currentTurn: this.state.currentTurn === Colour.WHITE ? Colour.BLACK : Colour.WHITE,
                  isInCheck: newCheckState,
                  board: newBoard,
                  piecePositions: newPiecePositions},
                  () => this.isGameOver());
        // change state
    }

    getRandomMove(allMovesForBlack) {
      return allMovesForBlack[Math.floor(Math.random() * allMovesForBlack.length)];
    }
    
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              nextTurn={this.state.currentTurn}
              squares={this.state.board} 
              pieces={this.state.pieces}
              piecePositions={this.state.piecePositions}
              winner={this.state.winner}
              check={this.state.isInCheck} />
          </div>
          {/*<div className="game-info">
            <TakenPieces 
                piecePositions={this.state.piecePositions}
                pieces={this.state.pieces}/>
      </div>*/}
        </div>
      );
    }
  }

export function CheckEval(pieces, offensiveTeam, piecePositions) {
    // A king is in check if:
    //  Get all possible moves for the current team's pieces
    const allMovesAndPiecesForCurrentTeam = getAllPossibleMovesForTeam(offensiveTeam, pieces, piecePositions);
    const allMovesForCurrentTeam = allMovesAndPiecesForCurrentTeam.map(pieceAndMove => { return pieceAndMove.position });

    //  If any of them equal the opposing team's king, this returns true
    // else false
    const opposingKingId = offensiveTeam === Colour.WHITE ? 'king_101' : 'king_001';
    const opposingKingsPosition = piecePositions.find(piecePosition => piecePosition.pieceId === opposingKingId).position;

    return allMovesForCurrentTeam.includes(opposingKingsPosition);
}

function getAllPossibleMovesForTeam(colour, pieces, piecePositions, ongoingCheckEval = true) {
  const allMovesForCurrentTeam = [];
    const allCurrentTeamsPieces = pieces.filter(piece => piece.props.colour === colour);
    for (let pieceIndex = 0; pieceIndex < allCurrentTeamsPieces.length; pieceIndex++) {
      const currentPieceId = allCurrentTeamsPieces[pieceIndex].props.id;
      const currentPiecePosition = piecePositions.find(piecePosition => piecePosition.pieceId === currentPieceId).position;
      const movesForCurrentPiece = GetPossibleMoves(currentPieceId, currentPiecePosition, pieces, 
        piecePositions, colour, ongoingCheckEval);
      movesForCurrentPiece.forEach(movePos => {
        allMovesForCurrentTeam.push(
          { pieceId: currentPieceId,
            position: movePos}
          );
      });
    }
    return allMovesForCurrentTeam;
}