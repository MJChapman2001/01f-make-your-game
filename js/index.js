import { LAYOUT, CLASSES } from './constants.js'
import { Board } from './board.js'
import { Pacman } from './pacman.js'
import { Ghost } from './ghosts.js'

var g, gb, pacman, ghosts

window.addEventListener('keypress', (e) => {
    if (e.code === 'KeyS') startGame()
})

function gameLoop() {
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
    }

    if (gb.dots != 0) {
        window.requestAnimationFrame(gameLoop)
    }

}

function startGame() {
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

    window.requestAnimationFrame(gameLoop)
}