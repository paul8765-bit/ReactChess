import React from 'react';
import { Colour } from '../model/Colour';
import { PieceType } from '../model/PieceType';
import { Piece } from '../presentational/Piece';

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