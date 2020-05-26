import React from 'react';
import { Colour } from '../model/Colour';
import { Piece } from './Piece';
import PropTypes from 'prop-types';

export const Square = (props) => {
    const position = props.position;
    const colour = props.colour;
    const pieceId = props.pieceId;
    const pieceType = props.pieceType;
    const pieceColour = props.pieceColour;
    if (colour === Colour.WHITE) {
        return <button id={position} 
                className="square-white"
                onClick={() => props.onClick(position)}>
            {pieceId ? <Piece id={pieceId}
                            pieceType={pieceType}
                            colour={pieceColour}
             /> : null}
        </button>
    }
    else {
        return <button id={position} 
                className="square-black"
                onClick={() => props.onClick(position)}>
            {pieceId ? <Piece id={pieceId}
                            pieceType={pieceType}
                            colour={pieceColour}
             /> : null}
        </button>
    }
};

Square.propTypes = {
    position: PropTypes.string.isRequired,
    colour: PropTypes.string.isRequired,
    pieceId: PropTypes.string,
    pieceType: PropTypes.string,
    pieceColour: PropTypes.string,
    onClick: PropTypes.func.isRequired
};