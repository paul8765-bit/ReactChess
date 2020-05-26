import React from 'react';
import { BoardContainer } from '../container/BoardContainer';
import PropTypes from 'prop-types';

export const Game = (props) => {
  return (
    <div className="game">
      <div className="game-board">
        <BoardContainer 
          nextTurn={props.nextTurn}
          squares={props.squares} 
          pieces={props.pieces}
          piecePositions={props.piecePositions}
          winner={props.winner}
          check={props.check} />
      </div>
    </div>
  );
}

Game.propTypes = {
  nextTurn: PropTypes.string.isRequired,
  squares: PropTypes.arrayOf(PropTypes.element).isRequired,
  pieces: PropTypes.arrayOf(PropTypes.object).isRequired,
  piecePositions: PropTypes.arrayOf(PropTypes.object).isRequired,
  winner: PropTypes.string.isRequired,
  check: PropTypes.bool.isRequired
};