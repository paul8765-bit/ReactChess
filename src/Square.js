import React from 'react';
import { Colour } from './Colour';
import { Piece } from './Piece';

export class Square extends React.Component {
    render() {
        const position = this.props.position;
        const colour = this.props.colour;
        const pieceId = this.props.pieceId;
        const pieceType = this.props.pieceType;
        const pieceColour = this.props.pieceColour;
        if (colour === Colour.WHITE) {
            return <button id={position} 
                    className="square-white"
                    onClick={() => this.props.onClick(position)}>
                {pieceId ? <Piece id={pieceId}
                                pieceType={pieceType}
                                colour={pieceColour}
                 /> : null}
            </button>
        }
        else {
            return <button id={position} 
                    className="square-black"
                    onClick={() => this.props.onClick(position)}>
                {pieceId ? <Piece id={pieceId}
                                pieceType={pieceType}
                                colour={pieceColour}
                 /> : null}
            </button>
        }
    }
  }

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