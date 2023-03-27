import * as THREE from 'three'

import JoyStick from '/utils/classes/JoyStick.js'
import defaultKeyboard from '/utils/classes/Input.js'
import { jumpStyles, attackStyles, reactions } from '/utils/constants.js'
import { getPlayerState } from './states/index.js'

import Actor from './Actor.js'

export default class Player extends Actor {
  constructor({
    input = defaultKeyboard,
    useJoystick,
    attackStyle = attackStyles.ONCE,
    jumpStyle = jumpStyles.FALSE_JUMP,
    getState = name => getPlayerState(name, jumpStyle, attackStyle),
    shouldRaycastGround = true,
    attackDistance = 1.5,
    ...params
  } = {}) {
    super({ input, jumpStyle, getState, shouldRaycastGround, attackDistance, ...params })
    this.name = 'player'

    if (useJoystick) this.input.joystick = new JoyStick()
  }

  /* COMBAT */

  attackAction(name = 'enemy') {
    super.attackAction(name)
  }

  hit(mesh, range = [35, 55]) {
    super.hit(mesh, range)
  }

  /* UTILS */

  putInMaze(maze, tile = [1, 1]) {
    this.position = maze.tilePosition(...tile)
    this.mesh.lookAt(0, 0, 0)
    this.mesh.rotateY(Math.PI)
  }

  putInPolarMaze(maze) {
    const mazeSize = maze.rows * maze.cellSize
    this.position = { x: maze.cellSize * .5, y: 0, z: -mazeSize - maze.cellSize }
    this.mesh.lookAt(0, 0, -mazeSize * 2)
  }

  /* UPDATES */

  updateMove(delta, reaction = reactions.STOP) {
    super.updateMove(delta, reaction)
  }

  update(delta) {
    super.update(delta)
    if (this.shouldAlignCamera) {
      this.cameraFollow.alignCamera()
      this.shouldAlignCamera = false
    }
  }
}
