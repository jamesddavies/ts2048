import GameManager from './GameManager';

document.addEventListener('DOMContentLoaded', function(){
    let gridContainer = document.getElementById('grid-container');
    let game: GameManager;
    if (gridContainer){
        game = new GameManager(gridContainer);
        game.init();
    }

    var newGameBtn = document.getElementById('new-game');
    newGameBtn.addEventListener('click', function(){
        game.destroy();
        game = null;
        game = new GameManager(gridContainer);
        game.init();
    })
});

