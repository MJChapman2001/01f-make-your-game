import { LAYOUT, CLASSES } from './constants.js'
import { Board } from './board.js'
import { Pacman } from './pacman.js'
import { Ghost } from './ghosts.js'

const g = document.querySelector('#game')
const gb = Board.createBoard(g, LAYOUT)
const pacman = new Pacman(8, 657)

const ghosts = [
    new Ghost(5, 317, 'blinky'),
    new Ghost(4, 326, 'pinky'),
    new Ghost(3, 485, 'inky'),
    new Ghost(2, 494, 'clyde')
]

document.addEventListener('keydown', (e) => {
    pacman.handleKey(e, gb.classExists.bind(gb))
})

function gameLoop() {
    gb.moveChar(pacman)

    ghosts.forEach((ghost) => gb.moveChar(ghost))

    if (gb.classExists(pacman.pos, CLASSES[2])) {
        gb.removeClasses(pacman.pos, [CLASSES[2]])
        gb.dots--
        gb.updateScore(10)
    }

    if (gb.classExists(pacman.pos, CLASSES[3])) {
        gb.removeClasses(pacman.pos, [CLASSES[3]])
        gb.updateScore(20)
    }

    if (gb.classExists(pacman.pos, CLASSES[5])) {
        gb.removeClasses(pacman.pos, [CLASSES[7]])
        pacman.pos = 418
        gb.addClasses(418, [CLASSES[7]])
    }

    if (gb.classExists(pacman.pos, CLASSES[6])) {
        gb.removeClasses(pacman.pos, [CLASSES[7]])
        pacman.pos = 393
        gb.addClasses(393, [CLASSES[7]])
    }

    if (gb.dots != 0) {
        window.requestAnimationFrame(gameLoop)
    }

}

window.requestAnimationFrame(gameLoop)