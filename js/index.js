import { LAYOUT } from './constants.js'
import { Board } from './board.js'

document.addEventListener('DOMContentLoaded', e => {
    const g = document.querySelector('#game')
    const gb = Board.createBoard(g, LAYOUT)
})