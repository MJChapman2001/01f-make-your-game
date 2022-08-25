import { LAYOUT, CLASSES } from './constants.js'
import { Board } from './board.js'
import { Pacman } from './pacman.js'

const g = document.querySelector('#game')
const gb = Board.createBoard(g, LAYOUT)
const pacman = new Pacman(8, 657)

document.addEventListener('keydown', (e) => {
    pacman.handleKey(e, gb.classExists.bind(gb))
})

function gameLoop() {
    gb.moveChar(pacman)

    if (gb.classExists(pacman.pos, CLASSES[2])) {
        gb.removeClasses(pacman.pos, [CLASSES[2]])
    }

    if (gb.classExists(pacman.pos, CLASSES[3])) {
        gb.removeClasses(pacman.pos, [CLASSES[3]])
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

    window.requestAnimationFrame(gameLoop)
}

window.requestAnimationFrame(gameLoop)