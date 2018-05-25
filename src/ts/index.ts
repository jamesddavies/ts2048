import GameManager from './GameManager';

document.addEventListener('DOMContentLoaded', function(){
    let gridContainer = document.getElementById('grid-container');
    let game;
    if (gridContainer){
        let game = new GameManager(gridContainer);
        game.init();
    }

    var newGameBtn = document.getElementById('new-game');
    newGameBtn.addEventListener('click', function(){
        game.destroy();
        gridContainer.innerHTML = '';
        game = new GameManager(gridContainer);
        game.init();
    })
});

