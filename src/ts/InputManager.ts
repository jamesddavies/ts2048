import { Directions } from './enums';
import { KeyMap, Position } from './types';

export default class InputManager {

    handleInput: Function;
    keyMap: KeyMap;
    touchStartPosition: Position;
    touchEndPosition: Position;
    domElement: HTMLDivElement;

    constructor(handleInput: Function, domElement: HTMLDivElement){
        this.handleInput = handleInput;
        this.keyMap = {
            //Arrow keys
            '38': Directions.Up,
            '39': Directions.Right,
            '40': Directions.Down,
            '37': Directions.Left
        }
        this.domElement = domElement;
        this.listen();
    }

    calculateDirection(position1: Position, position2: Position, value1: string, value2: string): boolean {
        return ((position1[value1] > (position2[value1] + 100)) && 
                  (position1[value2] < (position2[value2] + 50)) && 
                    (position1[value2] > (position2[value2] - 50)))
    }

    getTouchDirection(): number | null {
        if (this.calculateDirection(this.touchEndPosition, this.touchStartPosition, 'x', 'y')){
            return Directions.Right;
        } else if (this.calculateDirection(this.touchStartPosition, this.touchEndPosition, 'x', 'y')){
            return Directions.Left;
        } else if (this.calculateDirection(this.touchEndPosition, this.touchStartPosition, 'y', 'x')){
            return Directions.Down;
        } else if (this.calculateDirection(this.touchStartPosition, this.touchEndPosition, 'y', 'x')){
            return Directions.Up;
        } else {
            return null;
        }
    }

    keydownHandler = (event: KeyboardEvent): void => {
        if (this.keyMap.hasOwnProperty(event.which.toString())){
            this.handleInput(this.keyMap[event.which]);
        }
    }

    touchEndHandler = (event: TouchEvent): void => {
        this.touchEndPosition = {
            x: event.changedTouches[0].pageX,
            y: event.changedTouches[0].pageY
        }

        var touchDirection = this.getTouchDirection();
        if (touchDirection !== null) this.handleInput(touchDirection);
    }

    touchStartHandler = (event: TouchEvent): void => {
        this.touchStartPosition = {
            x: event.changedTouches[0].pageX,
            y: event.changedTouches[0].pageY
        }
    }

    listen(): void {
        document.addEventListener('keydown', this.keydownHandler);
        this.domElement.addEventListener('touchstart', this.touchStartHandler);
        this.domElement.addEventListener('touchend', this.touchEndHandler);
    }

    destroy(): void {
        document.removeEventListener('keydown', this.keydownHandler);
        this.domElement.removeEventListener('touchstart', this.touchStartHandler);
        this.domElement.removeEventListener('touchend', this.touchEndHandler);
    }

}