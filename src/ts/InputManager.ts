import { Directions } from './enums';

export default class InputManager {

    handleInput: Function;
    keyMap: { [key: number]: number };

    constructor(handleInput: Function){
        this.handleInput = handleInput;
        this.keyMap = {
            //Arrow keys
            38: Directions.Up,
            39: Directions.Right,
            40: Directions.Down,
            37: Directions.Left
        }
        this.listen();
    }

    listen(): void {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.which !== 85){
                this.handleInput(this.keyMap[event.which]);
            }
        })
    }
}