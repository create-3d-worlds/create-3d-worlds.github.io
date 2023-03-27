import * as THREE from 'three'

import JoyStick from '/utils/classes/JoyStick.js'
import defaultKeyboard from '/utils/classes/Input.js'
import { jumpStyles, attackStyles, reactions } from '/utils/constants.js'
import { getPlayerState } from './states/index.js'
import { createOrbitControls } from '/utils/scene.js'
import CameraFollow from '/utils/classes/CameraFollow.js'

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
    camera,
    ...params
  } = {}) {
    super({ input, jumpStyle, getState, shouldRaycastGround, attackDistance, ...params })
    this.name = 'player'

    if (useJoystick) this.input.joystick = new JoyStick()

    if (camera) {
      this.cameraFollow = new CameraFollow({ camera, mesh: this.mesh, height: this.height })
      this.orbitControls = createOrbitControls()
      this.orbitControls.mouseButtons = { RIGHT: THREE.MOUSE.ROTATE }
      this.shouldAlignCamera = true
    }
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

  updateCamera(delta) {
    const { x, y, z } = this.mesh.position
    const { lookAt } = this.cameraFollow

    if (this.input.pressed.mouse2)
      this.orbitControls.target = new THREE.Vector3(x, y + lookAt[1], z)
    else
      this.cameraFollow.update(delta, this.currentState.name)
  }

  update(delta) {
    super.update(delta)
    if (this.shouldAlignCamera) {
      this.cameraFollow.alignCamera()
      this.shouldAlignCamera = false
    }
    if (this.cameraFollow) this.updateCamera(delta)
  }
}
