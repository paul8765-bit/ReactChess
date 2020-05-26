import React from 'react';
import PropTypes from 'prop-types';

export const Board = (props) => {
  const status = `Next player: ${props.nextTurn}`;
  const winner = props.winner;
  const check = props.check;
  return (
    <div>
      {winner}
      {check}
      <div className="status">{status}</div>
      <div className="board-row">
        {props.squares[56]}
        {props.squares[57]}
        {props.squares[58]}
        {props.squares[59]}
        {props.squares[60]}
        {props.squares[61]}
        {props.squares[62]}
        {props.squares[63]}
      </div>
      <div className="board-row">
        {props.squares[48]}
        {props.squares[49]}
        {props.squares[50]}
        {props.squares[51]}
        {props.squares[52]}
        {props.squares[53]}
        {props.squares[54]}
        {props.squares[55]}
      </div>
      <div className="board-row">
        {props.squares[40]}
        {props.squares[41]}
        {props.squares[42]}
        {props.squares[43]}
        {props.squares[44]}
        {props.squares[45]}
        {props.squares[46]}
        {props.squares[47]}
      </div>
      <div className="board-row">
        {props.squares[32]}
        {props.squares[33]}
        {props.squares[34]}
        {props.squares[35]}
        {props.squares[36]}
        {props.squares[37]}
        {props.squares[38]}
        {props.squares[39]}
      </div>
      <div className="board-row">
        {props.squares[24]}
        {props.squares[25]}
        {props.squares[26]}
        {props.squares[27]}
        {props.squares[28]}
        {props.squares[29]}
        {props.squares[30]}
        {props.squares[31]}
      </div>
      <div className="board-row">
        {props.squares[16]}
        {props.squares[17]}
        {props.squares[18]}
        {props.squares[19]}
        {props.squares[20]}
        {props.squares[21]}
        {props.squares[22]}
        {props.squares[23]}
      </div>
      <div className="board-row">
        {props.squares[8]}
        {props.squares[9]}
        {props.squares[10]}
        {props.squares[11]}
        {props.squares[12]}
        {props.squares[13]}
        {props.squares[14]}
        {props.squares[15]}
      </div>
      <div className="board-row">
        {props.squares[0]}
        {props.squares[1]}
        {props.squares[2]}
        {props.squares[3]}
        {props.squares[4]}
        {props.squares[5]}
        {props.squares[6]}
        {props.squares[7]}
      </div>
    </div>
  );
}

Board.propTypes = {
  nextTurn: PropTypes.string.isRequired,
  winner: PropTypes.node.isRequired,
  check: PropTypes.node.isRequired,
  squares: PropTypes.arrayOf(PropTypes.element).isRequired
};
