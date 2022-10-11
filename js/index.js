import { LAYOUT, CLASSES } from './constants.js'
import { Board } from './board.js'
import { Pacman } from './pacman.js'
import { Ghost } from './ghosts.js'

var g, gb, pacman, ghosts, startTime, scaredTime

window.addEventListener('keypress', handleStart, true)

let isPaused = false;
let pausedTime, unPausedTime

const t = document.querySelector('#title-div')
const h = document.querySelector('#header-div')

var playMsg = `Use the arrow keys to change direction.\nPress 'Space' to pause.`
var pauseMsg = `Press 'Space' to unpause.\nPress 'R' to restart.`

function gameLoop(currTime) {

    var currTime = currTime || new Date().getTime()
    var runTime = currTime - startTime
    gb.updateTime(runTime)

    if (gb.ghostScared) {
        if ((currTime - scaredTime) > 5000) {
            gb.ghostScared = false

            ghosts.forEach((g) => {
                g.scared = false
                gb.removeClasses(g.pos, ['scared'])
            })
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
            gameOver()
            return
        }
    }

    if (gb.classExists(pacman.pos, CLASSES[10]) && gb.ghostScared == true) {
        const eaten = ghosts.filter((ghost) => ghost.pos === pacman.pos)
        eaten.forEach((ghost) => {
            gb.removeClasses(pacman.pos, [CLASSES[10], ghost.name, 'scared'])
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

        ghosts.forEach((g) => {
            g.scared = true
            gb.removeClasses(g.pos, [g.name])
        })
    }

    if (gb.dots != 0 && !isPaused) {
        window.requestAnimationFrame(function(currTime) {
            gameLoop(currTime)
        })
    }

    if (gb.dots === 0) {
        gameOver()
        return
    }

}

function startGame() {
    window.removeEventListener('keypress', handleStart, true)
    window.addEventListener('keypress', pauseGame)

    h.innerText = playMsg

    g = document.querySelector('#game')
    gb = Board.createBoard(g, LAYOUT)
    pacman = new Pacman(8, 657)

    g.style.opacity = '1'

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

function pauseGame(e) {
    if (e.code === 'Space' && isPaused === false) {
        g.style.opacity = '0.5'
        document.querySelector('.score').style.opacity = '0.5'
        document.querySelector('.lives').style.opacity = '0.5'
        document.querySelector('.time').style.opacity = '0.5'

        isPaused = true;
        pausedTime = new Date().getTime()

        t.innerText = 'Paused'
        h.innerText = pauseMsg

        document.addEventListener('keypress', restartGame, true)
    } else if (e.code === 'Space' && isPaused === true) {
        g.style.opacity = '1'
        document.querySelector('.score').style.opacity = '1'
        document.querySelector('.lives').style.opacity = '1'
        document.querySelector('.time').style.opacity = '1'

        isPaused = false;
        unPausedTime = new Date().getTime()

        t.innerText = 'Pacman'
        h.innerText = playMsg

        window.requestAnimationFrame(function (currTime) {
            startTime += (unPausedTime - pausedTime)
            scaredTime += (unPausedTime - pausedTime)

            gameLoop(currTime);
        });
    }
}

function restartGame(e) {
    if (e.code === 'KeyR') {
        g.style.opacity = '1'
        document.querySelector('.score').style.opacity = '1'
        document.querySelector('.lives').style.opacity = '1'
        document.querySelector('.time').style.opacity = '1'

        if (gb.ghostScared) {
            gb.ghostScared = false
            scaredTime = null
        }

        gb.dots = 0
        gb.lives = 3
        gb.score = 0
        gb.initBoard(LAYOUT)

        g.style.opacity = '1'

        pacman.setPos(pacman.start)
        pacman.dir = null
        ghosts.forEach((g) => {
            g.setPos(g.start)
            gb.addClasses(g.pos, [CLASSES[10], g.name])
        })

        document.removeEventListener('keypress', restartGame, true)

        isPaused = false

        t.innerText = 'Pacman'
        h.innerText = playMsg

        window.requestAnimationFrame(function(currTime) {
            startTime = currTime || new Date().getTime()
            gameLoop(currTime)
        })
    }
}

function gameOver() {
    document.addEventListener('keypress', restartGame, true)

    g.style.opacity = '0'
    document.querySelector('.score').style.opacity = '0'
    document.querySelector('.lives').style.opacity = '0'
    document.querySelector('.time').style.opacity = '0'

    t.innerText = (gb.dots == 0) ? 'Congratulations' : 'Game Over'
    h.innerText = `Final score: ${gb.score}\nPress 'R' to play again!`
}