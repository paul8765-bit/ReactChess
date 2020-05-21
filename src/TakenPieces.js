import React from 'react';
import { Piece, GetPieceColourById, GetPieceTypeById } from './Piece';

export class TakenPieces extends React.Component {
    render() {
        return (
        <div>
            <p>Taken Pieces: </p>
            <ul>
                { this.getTakenPieces() }
            </ul>
        </div>);
    }

    getTakenPieces() {
        const piecePositions = this.props.piecePositions;
        const pieces = this.props.pieces;
        const takenPieces = this.findTakenPieces(piecePositions);
        
        if (takenPieces.length === 0) {
            return 'None (yet!)';
        }
        else {
            const takenPiecesImages = [];
            for (let pieceIndex = 0; pieceIndex < takenPieces.length; pieceIndex++) {
                const takenPiece = takenPieces[pieceIndex];
                takenPiecesImages.push(<li key={takenPiece.pieceId}><Piece 
                                            id={takenPiece.pieceId}
                                            pieceType={GetPieceTypeById(pieces, takenPiece.pieceId)}
                                            colour={GetPieceColourById(pieces, takenPiece.pieceId)}/></li>);
            }
            return takenPiecesImages;
        }
    }

    findTakenPieces(piecePositions) {
        return piecePositions.filter(piecePosition => { return piecePosition.position === 'Z0'});
    }
}