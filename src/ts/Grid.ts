import Tile from './Tile';
import { GridStateArray, Modifiers } from './types';

enum Directions {
    Up,
    Right,
    Down,
    Left
}

export default class Grid {
    size: { [key: string]: number };
    state: GridStateArray;
    previousState: GridStateArray;
    tiles: Tile[];
    startTiles: number;
    tileWidth: number;
    gutterWidth: number;
    movedThisTurn: boolean;

    constructor (across: number, down: number, tileWidth?: number, gutterWidth?: number) {
        this.size = {across: across, down: down}
        this.tiles = [];
        this.state = [];
        this.previousState = [];
        this.startTiles = 2;
        this.tileWidth = tileWidth || 110;
        this.gutterWidth = gutterWidth || 14;
        this.movedThisTurn = false;
    }

    init(): void {
        this.updateBoard();
        this.addStartTiles();
    }

    buildRepresentation(): GridStateArray {
        let gridState = [];
        
        for (let i = 0; i < this.size.across; i++){
            let tempArray = [];
            for (let j = 0; j < this.size.down; j++){
                let existingTile = this.tiles.filter((tile: Tile) => tile.position.y === i && tile.position.x === j)
                tempArray.push(existingTile[0] || null);
            }
            gridState[i] = tempArray;
        }
        
        return gridState;
    }

    updateBoard(): void {
        this.updateState(this.buildRepresentation());
    }

    updateState(updateBoard: GridStateArray): void {
        this.previousState = this.state;
        this.state = updateBoard;
        this.tiles.forEach((tile: Tile) => !tile.domRepresentation ? tile.generateDomElement() : tile.updateDomElement())
    }

    addStartTiles(): void {
        this.addRandomTiles(this.startTiles);
    }

    addRandomTiles(count: number): void {
        let available = this.availableCells();
        for (let i = 0; i < count; i++){
            let rand = Math.floor(Math.random() * available.length);
            let cell = available[rand];
            this.tiles.push(new Tile(cell.y, cell.x));
            available.splice(rand, 1);
        }
        this.updateBoard();
    }

    availableCells(): Array<{[key: string]: number}> {
        let availableCells: Array<{[key: string]: number}> = [];

        for (let i = 0; i < this.size.across; i++){
            for (let j = 0; j < this.size.down; j++){
                if (this.state[i][j] === null){
                    availableCells.push({x: i, y: j});
                }
            }
        }

        return availableCells;
    }

    makeTileMoves = (direction: number, modifiers: Modifiers): void => {
        this.movedThisTurn = false;
        this.getDirectionalArrays(direction).forEach((arr: (Tile|null)[]) => {
            arr.forEach((tile: Tile|null) => {
                if (tile){
                    
                    while (this.nextTileIsAvailable(tile.position, modifiers)){
                        tile.updatePosition(modifiers);
                        if (!this.movedThisTurn) this.movedThisTurn = true;
                    }

                    this.updateBoard();
                   
                    let nextTile = this.nextTile(tile.position, modifiers);
                    this.checkForMerge(nextTile, tile, modifiers);
                    
                }
            })
        })
    }

    checkForMerge = (nextTile: Tile, tile: Tile, modifiers: Modifiers): void => {
        if (nextTile instanceof Tile){
            if (!nextTile.mergedThisTurn && nextTile.value === tile.value){

                nextTile.updateValue();
                
                this.tiles = this.tiles.filter((arrayTile: Tile) => !(arrayTile.position.x === tile.position.x && arrayTile.position.y === tile.position.y)) 
                this.updateBoard();
                
                tile.removeDomElement();

                if (!this.movedThisTurn) this.movedThisTurn = true;
            
            }
        }
    }

    getDirectionalArrays = (direction: number): (Tile|null)[][] => {
        switch (Directions[direction]){
            case 'Up':
            case 'Left':
                return this.buildDirectionalArrays(direction)
            case 'Down':
            case 'Right':
                return this.buildDirectionalArrays(direction).map((arr: (Tile|null)[]) => arr.reverse())
            default: //Statement should never reach this, satisfies TS compiler
                return this.buildDirectionalArrays(direction)
        }
    }

    buildDirectionalArrays = (direction: number): (Tile|null)[][] => {
        var dir = Directions[direction];
        var collection = [];
        var outer = dir === 'Up' || dir === 'Down' ? this.size.across : this.size.down;
        var inner = dir === 'Left' || dir === 'Right' ? this.size.across : this.size.down;
        for (let i = 0; i < outer; i++){
            let arr = [];
            for (let j = 0; j < inner; j++){
                dir === 'Up' || dir === 'Down' ? arr.push(this.state[j][i]) : arr.push(this.state[i][j])
            }
            collection.push(arr)
        }
        return collection;
    }

    nextTileIsAvailable = (tilePosition: {[key: string]: number}, modifiers: Modifiers): boolean => {
        let check = this.nextTile(tilePosition, modifiers);
        
        return check === null || !check === undefined;
    }

    nextTile = (tilePosition: {[key: string]: number}, modifiers: Modifiers): Tile|null|undefined => {
        let nextPos = {
            across: tilePosition.x + parseInt(modifiers.x, 10),
            down: tilePosition.y + parseInt(modifiers.y, 10)
        }

        if (this.state[nextPos.down]){
            return this.state[nextPos.down][nextPos.across];
        } else {
            return undefined;
        }        
    }

    endTurn = (): void => {
        this.tiles.forEach((tile: Tile) => tile.mergedThisTurn = false)
    }

    generateDomElement = () => {
        var gridElement = document.createElement('div');
        gridElement.classList.add('grid');
        var fragment = document.createDocumentFragment();
        var tileWidth = this.tileWidth.toString() + "px";
        var tileMargin = (this.gutterWidth / 2).toString() + "px";
        for (let i = 0; i < this.size.across; i++){
            for (let j = 0; j < this.size.down; j++){
                let content = document.createElement('div');
                content.classList.add('tile-holder');
                content.style.width = tileWidth;
                content.style.height = tileWidth;
                content.style.margin = tileMargin;
                fragment.appendChild(content);
            }
        }
        gridElement.style.width = (this.size.across * this.tileWidth + (this.gutterWidth * (this.size.across))).toString() + "px";
        gridElement.style.height = (this.size.down * this.tileWidth + (this.gutterWidth * (this.size.down))).toString() + "px";
        gridElement.style.borderWidth = tileMargin;
        gridElement.appendChild(fragment);
        let gridContainer = document.querySelector("#grid-container");
        if (gridContainer) gridContainer.appendChild(gridElement);
    }
}