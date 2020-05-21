import { Colour } from './Colour';

function internalIncrementColumn(currentPosition) {
    const currentColumn = currentPosition[0];
    const currentRow = +currentPosition[1];
    switch (currentColumn) {
      case 'A':
        return 'B' + currentRow;
      case 'B':
        return 'C' + currentRow;
      case 'C':
        return 'D' + currentRow;
      case 'D':
        return 'E' + currentRow;
      case 'E':
        return 'F' + currentRow;
      case 'F':
        return 'G' + currentRow;
      case 'G':
        return 'H' + currentRow;
      default: 
        return 'Z' + currentRow;
    }
  }

  export function IncrementColumn(currentPosition, distance = 1) {
    let newPosition = currentPosition;
    for (let distanceIndex = 1; distanceIndex <= distance; distanceIndex++) {
        newPosition = internalIncrementColumn(newPosition);
    }
    return newPosition;
  }

  function internalDecrementColumn(currentPosition) {
    const currentColumn = currentPosition[0];
    const currentRow = +currentPosition[1];
    switch (currentColumn) {
      case 'B':
        return 'A' + currentRow;
      case 'C':
        return 'B' + currentRow;
      case 'D':
        return 'C' + currentRow;
      case 'E':
        return 'D' + currentRow;
      case 'F':
        return 'E' + currentRow;
      case 'G':
        return 'F' + currentRow;
      case 'H':
        return 'G' + currentRow;
      default: 
        return 'Z' + currentRow;
    }
  }

  export function DecrementColumn(currentPosition, distance = 1) {
    let newPosition = currentPosition;
    for (let distanceIndex = 1; distanceIndex <= distance; distanceIndex++) {
        newPosition = internalDecrementColumn(newPosition);
    }
    return newPosition;
  }

  export function IncrementRow(currentPosition, side, distance) {
      const currentColumn = currentPosition[0];
      let currentRow = +currentPosition[1];
    // For white, increment is a movement up the board
    // For black, increment is a movement down the board
    if (side === Colour.WHITE) {
        currentRow += distance;
    }
    else {
        currentRow -= distance;
    }
    if (currentRow < 0) currentRow = 0;
    if (currentRow > 8) currentRow = 9;
    return currentColumn + currentRow;
  }

  export function DecrementRow(currentPosition, side, distance) {
    const currentColumn = currentPosition[0];
    let currentRow = +currentPosition[1];
    // For white, decrement is a movement down the board
    // For black, decrement is a movement up the board
    if (side === Colour.WHITE) {
        currentRow -= distance;
    }
    else {
        currentRow += distance;
    }
    if (currentRow < 0) currentRow = 0;
    if (currentRow > 8) currentRow = 9;
    return currentColumn + currentRow;
  }