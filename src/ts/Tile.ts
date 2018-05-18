export default class Tile {
    value: number;
    position: { [key: string]: number }
    lastMovePosition: { [key: string]: number }
    width: number;
    gutterWidth: number;
    domRepresentation: boolean;
    domElement: HTMLDivElement;
    gridSection: number;
    mergedThisTurn: boolean;

    constructor (x: number, y: number, value?: number, width: number = 110, gutterWidth: number = 14){
        this.value = value || this.setNewValue();
        this.position = {
            x: x,
            y: y
        }
        this.lastMovePosition = this.position;
        this.width = width;
        this.gutterWidth = gutterWidth;
        this.gridSection = this.width + this.gutterWidth;
        this.domRepresentation = false;
        this.domElement = document.createElement('div');
        this.mergedThisTurn = false;
    }

    setNewValue(): number {
        let availableValues = [2, 4];
        return availableValues[Math.floor(Math.random() * (availableValues.length))];
    }

    updatePosition = (modifiers: {[key: string]: string}): void => {
        this.position.x += parseInt(modifiers.x, 10);
        this.position.y += parseInt(modifiers.y, 10);
    }

    updateValue = (): void => {
        this.value *= 2;
        this.mergedThisTurn = true;
    }

    generateDomElement = (): void => {
        let halfGutter = this.gutterWidth / 2;
        this.domElement.classList.add('tile');
        this.domElement.style.top = halfGutter.toString() + "px";
        this.domElement.style.left = halfGutter.toString() + "px";
        this.domElement.style.width = this.width.toString() + "px";
        this.domElement.style.height = this.width.toString() + "px";
        this.domElement.style.transform = "translate(" + this.position.x * this.gridSection + "px, " + this.position.y * this.gridSection + "px)";
        this.domElement.textContent = this.value.toString();
        let grid = document.querySelector("#grid-container > .grid");
        if (grid) {
            grid.appendChild(this.domElement);
            this.domRepresentation = true;
            setTimeout(() => this.domElement.classList.add('show'), 40);
        }
    }

    updateDomElement = (): void => {
        this.domElement.style.transform = "translate(" + (this.position.x) * this.gridSection + "px, " + (this.position.y) * this.gridSection + "px)";
        this.domElement.textContent = this.value.toString();
    }

    removeDomElement = (): void => {
        if (this.domElement) this.domElement.remove();
    }
}