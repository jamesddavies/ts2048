import GameManager from './GameManager';

document.addEventListener('DOMContentLoaded', function(){
    let gridContainer = document.getElementById('grid-container');
    if (gridContainer){
        let game = new GameManager(gridContainer);
        game.init();
    }
});