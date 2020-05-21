import React from 'react';
import WhitePawn from './img/white-pawn.png';
import WhiteKing from './img/white-king.png';
import WhiteQueen from './img/white-queen.png';
import WhiteRook from './img/white-rook.png';
import WhiteBishop from './img/white-bishop.png';
import WhiteKnight from './img/white-knight.png';
import BlackKing from './img/black-king.png';
import BlackQueen from './img/black-queen.png';
import BlackRook from './img/black-rook.png';
import BlackBishop from './img/black-bishop.png';
import BlackKnight from './img/black-knight.png';
import BlackPawn from './img/black-pawn.png';
import { Colour } from './Colour';
import { PieceType } from './PieceType';

export class Piece extends React.Component {
    render() {
        const key = this.props.id;
        const id = this.props.id;
        const pieceType = this.props.pieceType;
        const colour = this.props.colour;
        if (colour === Colour.WHITE) {
            switch (pieceType) {
                case PieceType.KING:
                    return <img key={key} id={id} src={WhiteKing} alt="White King" height="50px" />
                case PieceType.QUEEN:
                    return <img key={key} id={id} src={WhiteQueen} alt="White Queen" height="50px" />
                case PieceType.ROOK:
                    return <img key={key} id={id} src={WhiteRook} alt="White Rook" height="50px" />
                case PieceType.BISHOP:
                    return <img key={key} id={id} src={WhiteBishop} alt="White Bishop" height="50px" />
                case PieceType.KNIGHT:
                    return <img key={key} id={id} src={WhiteKnight} alt="White Knight" height="50px" />
                case PieceType.PAWN:
                    return <img key={key} id={id} src={WhitePawn} alt="White Pawn" height="50px" />
                default:
                    return <p>{`Unable to find image for ${pieceType}`}</p>
            }
        }
        else {
            switch (pieceType) {
                case PieceType.KING:
                    return <img key={key} id={id} src={BlackKing} alt="Black King" height="50px" />
                case PieceType.QUEEN:
                    return <img key={key} id={id} src={BlackQueen} alt="Black Queen" height="50px" />
                case PieceType.ROOK:
                    return <img key={key} id={id} src={BlackRook} alt="Black Rook" height="50px" />
                case PieceType.BISHOP:
                    return <img key={key} id={id} src={BlackBishop} alt="Black Bishop" height="50px" />
                case PieceType.KNIGHT:
                    return <img key={key} id={id} src={BlackKnight} alt="Black Knight" height="50px" />
                case PieceType.PAWN:
                    return <img key={key} id={id} src={BlackPawn} alt="Black Pawn" height="50px" />
                default:
                    return <p>{`Unable to find image for ${pieceType}`}</p>
            }
        }
    }
}

export function GetPieces() {
    const pieces = [];

    // In order need to add:
    // One white king
    pieces.push(renderPiece('king_001', PieceType.KING, Colour.WHITE));

    // One white queen
    pieces.push(renderPiece('queen_001', PieceType.QUEEN, Colour.WHITE));

    // Two white rooks
    for (let index = 1; index <= 2; index++) {
      pieces.push(renderPiece(`rook_00${index}`, PieceType.ROOK, Colour.WHITE));
    }

    // Two white bishops
    for (let index = 1; index <= 2; index++) {
      pieces.push(renderPiece(`bishop_00${index}`, PieceType.BISHOP, Colour.WHITE));
    }

    // Two white knights
    for (let index = 1; index <= 2; index++) {
      pieces.push(renderPiece(`knight_00${index}`, PieceType.KNIGHT, Colour.WHITE));
    }

    // Eight white pawns
    for (let index = 1; index <= 8; index++) {
      pieces.push(renderPiece(`pawn_00${index}`, PieceType.PAWN, Colour.WHITE));
    }

    // One black king
    pieces.push(renderPiece('king_101', PieceType.KING, Colour.BLACK));

    // One black queen
    pieces.push(renderPiece('queen_101', PieceType.QUEEN, Colour.BLACK));

    // Two black rooks
    for (let index = 1; index <= 2; index++) {
      pieces.push(renderPiece(`rook_10${index}`, PieceType.ROOK, Colour.BLACK));
    }

    // Two black bishops
    for (let index = 1; index <= 2; index++) {
      pieces.push(renderPiece(`bishop_10${index}`, PieceType.BISHOP, Colour.BLACK));
    }

    // Two black knights
    for (let index = 1; index <= 2; index++) {
      pieces.push(renderPiece(`knight_10${index}`, PieceType.KNIGHT, Colour.BLACK));
    }

    // Eight black pawns
    for (let index = 1; index <= 8; index++) {
      pieces.push(renderPiece(`pawn_10${index}`, PieceType.PAWN, Colour.BLACK));
    }

    return pieces;
  }

  export function GetPieceTypeById(pieces, pieceId) {
    const piece = pieces.find(element => element.props.id === pieceId);
    return piece.props.pieceType;
  }

  export function GetPieceColourById(pieces, pieceId) {
    const piece = pieces.find(element => element.props.id === pieceId);
    return piece.props.colour;
  }

  export function GetPieceIdByPosition(position, piecePositions) {
    const pieceHere = piecePositions.find(element => element.position === position);
    return pieceHere ? pieceHere.pieceId : undefined;
  }

  function renderPiece(id, pieceType, colour) {
    return <Piece 
            id={id}
            pieceType={pieceType}
            colour={colour}
          />;
  }