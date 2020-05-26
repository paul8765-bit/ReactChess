import React from 'react';
import WhitePawn from '../img/white-pawn.png';
import WhiteKing from '../img/white-king.png';
import WhiteQueen from '../img/white-queen.png';
import WhiteRook from '../img/white-rook.png';
import WhiteBishop from '../img/white-bishop.png';
import WhiteKnight from '../img/white-knight.png';
import BlackKing from '../img/black-king.png';
import BlackQueen from '../img/black-queen.png';
import BlackRook from '../img/black-rook.png';
import BlackBishop from '../img/black-bishop.png';
import BlackKnight from '../img/black-knight.png';
import BlackPawn from '../img/black-pawn.png';
import { Colour } from '../model/Colour';
import { PieceType } from '../model/PieceType';
import PropTypes from 'prop-types';

export const Piece = (props) => {
  const [key, id] = props.id;
  const pieceType = props.pieceType;
  const colour = props.colour;
  if (colour === Colour.WHITE) {
      switch (pieceType) {
          case PieceType.KING:
              return <img key={key} id={id} src={WhiteKing} alt="White King" height="45vw" />
          case PieceType.QUEEN:
              return <img key={key} id={id} src={WhiteQueen} alt="White Queen" height="45vw" />
          case PieceType.ROOK:
              return <img key={key} id={id} src={WhiteRook} alt="White Rook" height="45vw" />
          case PieceType.BISHOP:
              return <img key={key} id={id} src={WhiteBishop} alt="White Bishop" height="45vw" />
          case PieceType.KNIGHT:
              return <img key={key} id={id} src={WhiteKnight} alt="White Knight" height="45vw" />
          case PieceType.PAWN:
              return <img key={key} id={id} src={WhitePawn} alt="White Pawn" height="45vw" />
          default:
              return <p>{`Unable to find image for ${pieceType}`}</p>
      }
  }
  else {
      switch (pieceType) {
          case PieceType.KING:
              return <img key={key} id={id} src={BlackKing} alt="Black King" height="45vw" />
          case PieceType.QUEEN:
              return <img key={key} id={id} src={BlackQueen} alt="Black Queen" height="45vw" />
          case PieceType.ROOK:
              return <img key={key} id={id} src={BlackRook} alt="Black Rook" height="45vw" />
          case PieceType.BISHOP:
              return <img key={key} id={id} src={BlackBishop} alt="Black Bishop" height="45vw" />
          case PieceType.KNIGHT:
              return <img key={key} id={id} src={BlackKnight} alt="Black Knight" height="45vw" />
          case PieceType.PAWN:
              return <img key={key} id={id} src={BlackPawn} alt="Black Pawn" height="45vw" />
          default:
              return <p>{`Unable to find image for ${pieceType}`}</p>
      }
  }
};

Piece.propTypes = {
    id: PropTypes.string.isRequired,
    pieceType: PropTypes.string.isRequired,
    colour: PropTypes.string.isRequired
};