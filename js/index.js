import { LAYOUT, CLASSES } from './constants.js'
import { Board } from './board.js'
import { Pacman } from './pacman.js'
import { Ghost } from './ghosts.js'

var g, gb, pacman, ghosts, startTime, scaredTime

window.addEventListener('keypress', handleStart, true)

let isPaused = false;
let pausedTime, unPausedTime

window.addEventListener("keypress", (e) => {
    if (e.code === 'KeyP' && isPaused === false) {
        isPaused = true;
        pausedTime = new Date().getTime()
    } else if (e.code === 'KeyP' && isPaused === true) {
        isPaused = false;
        unPausedTime = new Date().getTime()
        window.requestAnimationFrame(function () {
            startTime += (unPausedTime - pausedTime)
            gameLoop();
        });
    }
});

function gameLoop(currTime) {

    var currTime = currTime || new Date().getTime()
    var runTime = currTime - startTime
    gb.updateTime(runTime)

    if (gb.ghostScared) {
        if ((currTime - scaredTime) > 5000) {
            gb.ghostScared = false
        }
    }

    gb.moveChar(pacman)

    ghosts.forEach((ghost) => gb.moveChar(ghost))

    if (gb.classExists(pacman.pos, CLASSES[10]) && gb.ghostScared == false) {
        gb.removeClasses(pacman.pos, [CLASSES[7]])
        ghosts.forEach((ghost) => {
            gb.removeClasses(ghost.pos, [CLASSES[10], ghost.name])
            ghost.time = 0
        })
        gb.lives -= 1
        gb.updateLives()

        if (gb.lives >= 1) {
            pacman.dir = null
            pacman.setPos(pacman.start)
            gb.addClasses(pacman.pos, [CLASSES[7]])
            ghosts.forEach((ghost) => ghost.pos = ghost.start)
        } else {
            return
        }
    }

    if (gb.classExists(pacman.pos, CLASSES[10]) && gb.ghostScared == true) {
        const eaten = ghosts.filter((ghost) => ghost.pos === pacman.pos)
        eaten.forEach((ghost) => {
            gb.removeClasses(pacman.pos, [CLASSES[10], ghost.name])
            ghost.pos = ghost.start
            ghost.time = 0
            gb.updateScore(50)
        })
    }

    if (gb.classExists(pacman.pos, CLASSES[2])) {
        gb.removeClasses(pacman.pos, [CLASSES[2]])
        gb.dots--
        gb.updateScore(10)
    }

    if (gb.classExists(pacman.pos, CLASSES[3])) {
        gb.removeClasses(pacman.pos, [CLASSES[3]])
        gb.updateScore(20)
        gb.ghostScared = true
        scaredTime = currTime
    }

    if (gb.dots != 0 && !isPaused) {
        window.requestAnimationFrame(function(currTime) {
            gameLoop(currTime)
        })
    }

}

function startGame() {
    window.removeEventListener('keypress', handleStart, true)

    const h = document.querySelector('#header-div')
    h.innerText = 'Pacman'

    g = document.querySelector('#game')
    gb = Board.createBoard(g, LAYOUT)
    pacman = new Pacman(8, 657)

    ghosts = [
        new Ghost(11, 317, 'blinky'),
        new Ghost(10, 326, 'pinky'),
        new Ghost(9, 485, 'inky'),
        new Ghost(8, 494, 'clyde')
    ]

    document.addEventListener('keydown', (e) => {
        pacman.handleKey(e, gb.classExists.bind(gb))
    })

    window.requestAnimationFrame(function(currTime) {
        startTime = currTime || new Date().getTime()
        gameLoop(currTime)
    })
}

function handleStart(e) {
    if (e.code === 'KeyS') startGame()
}