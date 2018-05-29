import Grid from './Grid';
import InputManager from './InputManager';
import { Modifiers } from './types';

export default class GameManager {

    gameArea: HTMLElement;
    grid: Grid;
    inputManager: InputManager;
    mobileBreakpoint: number;

    constructor (gameArea: HTMLElement, rows: number = 4, columns: number = 4, mobileBreakpoint = 600) {
        this.gameArea = gameArea;
        this.mobileBreakpoint = mobileBreakpoint;
        this.generateGrid(rows, columns);
        this.inputManager = new InputManager(this.handleInput, this.grid.domElement);
    }

    init(): void {
        this.grid.generateDomElement();
        this.grid.init();
    }

    generateGrid(rows: number, columns: number): void {
        if (this.isMobile()){
            let gutterWidth = (window.innerWidth / 100) * 2;
            let tileWidth = (window.innerWidth / rows) - (gutterWidth * 2);
            this.grid = new Grid(rows, columns, tileWidth, gutterWidth)
        } else {
            this.grid = new Grid(rows, columns);
        }
    }

    handleInput = (direction: number): void => {
        this.handleMove(direction);
    }

    handleMove(direction: number): void {
        this.grid.makeTileMoves(direction);
        this.grid.endTurn();
        if (this.grid.movedThisTurn) this.grid.addRandomTiles(1);
        let tile2048Exists = this.grid.tile2048Exists();
        if (this.grid.isGameOver() || tile2048Exists){
            this.grid.endGame(tile2048Exists);
        }
    }

    isMobile(): boolean {
        return window.innerWidth <= this.mobileBreakpoint;
    }

    destroy(): void {
        this.inputManager.destroy();
        this.grid.removeDomElement();        
    }
}