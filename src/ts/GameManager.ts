import Grid from './Grid';
import InputManager from './InputManager';

export default class GameManager {

    gameArea: HTMLElement;
    grid: Grid;
    inputManager: InputManager;

    constructor (gameArea: HTMLElement, rows: number = 4, columns: number = 4) {
        this.gameArea = gameArea;
        this.grid = new Grid(rows, columns);
        this.inputManager = new InputManager(this.handleInput, this.forceUpdate);
    }

    init = (): void => {
        this.grid.generateDomElement();
        this.grid.init();
    }

    forceUpdate = () => {
        this.grid.updateBoard();
    }

    handleInput = (direction: number): void => {
        this.handleMove(direction, this.getVector(direction));
    }

    handleMove = (direction: number, modifiers: {[key: string]: string}): void => {
        this.grid.makeTileMoves(direction, modifiers);
        this.grid.endTurn();
        if (this.grid.movedThisTurn) this.grid.addRandomTiles(1);
        //if (this.grid.gameOver()) this.grid.endGame(this.grid.tile2048Exists());
    }

    getVector(direction: number): { [key: string]: string } {
        let vectorMap = [
            { x: '0', y: '-1' }, // Up
            { x: '1', y: '0' },  // Right
            { x: '0', y: '1' },  // Down
            { x: '-1', y : '0' } // Left
        ];
        return vectorMap[direction]
    }
}