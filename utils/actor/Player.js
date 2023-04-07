import * as THREE from 'three'

import JoyStick from '/utils/classes/JoyStick.js'
import defaultKeyboard from '/utils/classes/Input.js'
import { jumpStyles, attackStyles, reactions } from '/utils/constants.js'
import { getPlayerState } from './states/index.js'
import { createOrbitControls } from '/utils/scene.js'
import { findChildren } from '/utils/helpers.js'
import CameraFollow from '/utils/classes/CameraFollow.js'
import Actor from './Actor.js'

export default class Player extends Actor {
  #enemiesAdded = false

  constructor({
    input = defaultKeyboard,
    useJoystick,
    attackStyle = attackStyles.LOOP,
    jumpStyle = jumpStyles.FALSE_JUMP,
    getState = name => getPlayerState(name, jumpStyle, attackStyle),
    shouldRaycastGround = true,
    attackDistance = 1.5,
    camera,
    ...params
  } = {}) {
    super({ name: 'player', input, jumpStyle, getState, shouldRaycastGround, attackDistance, ...params })

    if (useJoystick) this.input.joystick = new JoyStick()

    if (camera) {
      this.cameraFollow = new CameraFollow({ camera, mesh: this.mesh, height: this.height })
      this.orbitControls = createOrbitControls()
      this.orbitControls.mouseButtons = { RIGHT: THREE.MOUSE.ROTATE }
      this.shouldAlignCamera = true
    }
  }

  /* GETTERS */

  get enemies() {
    return findChildren(this.scene, 'enemy')
  }

  get coins() {
    return findChildren(this.scene, 'coin')
  }

  get solids() {
    if (!this.#enemiesAdded) {
      this.addSolids(this.enemies)
      this.#enemiesAdded = true
    }
    return super.solids
  }

  /* COMBAT */

  enterAttack(name = 'enemy', height) {
    super.enterAttack(name, height)
  }

  hit(mesh, damage = [35, 55]) {
    super.hit(mesh, damage)
  }

  areaDamage() {
    const near = this.enemies.filter(mesh => this.distanceTo(mesh) < 3)
    near.forEach(mesh => this.hit(mesh, [89, 135]))
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

  checkCoins() {
    this.coins.forEach(mesh => {
      const distance = this.distanceTo(mesh)
      if (distance <= 1.1) this.dispose(mesh)
    })
  }

  updateMove(delta, reaction = reactions.STOP) {
    super.updateMove(delta, reaction)
  }

  updateCamera(delta) {
    const { x, y, z } = this.mesh.position
    const { lookAt } = this.cameraFollow

    if (this.input.pressed.mouse2)
      this.orbitControls.target = new THREE.Vector3(x, y + lookAt[1], z)
    else
      this.cameraFollow.update(delta, this.state)
  }

  update(delta = 1 / 60) {
    super.update(delta)
    if (this.shouldAlignCamera) {
      this.cameraFollow.alignCamera()
      this.shouldAlignCamera = false
    }
    if (this.cameraFollow) this.updateCamera(delta)
    if (this.coins) this.checkCoins()
  }
}
