import { CLASSES, DIR } from "./constants.js"

export class Pacman {
    constructor(speed, start) {
        this.start = start
        this.pos = start
        this.speed = speed
        this.time = 0
        this.dir = null
        this.power = false
    }

    shouldMove() {
        if (!this.dir) return

        if (this.time === this.speed) {
            this.time = 0
            return true
        }
        
        this.time++
    }

    nextMove(classExists) {
        let nextPos = this.pos + this.dir

        if (classExists(nextPos, CLASSES[1]) || classExists(nextPos, CLASSES[4])) {
            nextPos = this.pos
        } else if (classExists(nextPos, CLASSES[5])) {
            nextPos = 418
        } else if (classExists(nextPos, CLASSES[6])) {
            nextPos = 393
        }

        return { nextPos, direction: this.dir }
    }

    move() {
        const classRem = [CLASSES[7]]
        const classAdd = [CLASSES[7]]

        return { classRem, classAdd }
    }

    setPos(nextPos) {
        this.pos = nextPos
    }

    handleKey = (e, classExists) => {
        let dir

        if (e.keyCode >= 37 && e.keyCode <= 40) {
            dir = DIR[e.keyCode]
        } else {
            return
        }

        const nextPos = this.pos + dir
        if (classExists(nextPos, CLASSES[1]) || classExists(nextPos, CLASSES[4])) return
        this.dir = dir
    }
}