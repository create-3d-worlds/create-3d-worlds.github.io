import * as THREE from 'three'

import defaultKeyboard from '/utils/classes/Input.js'
import { jumpStyles, attackStyles, reactions } from '/utils/constants.js'
import { getPlayerState } from './states/index.js'
import { findChildren } from '/utils/helpers.js'
import Actor from './Actor.js'
import ChaseCamera from '/utils/classes/ChaseCamera.js'

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

    if (useJoystick) {
      const promise = import('/utils/classes/JoyStick.js')
      promise.then(obj => {
        const JoyStick = obj.default
        this.input.joystick = new JoyStick()
      })
    }

    if (camera) {
      this.shouldAlignCamera = true
      this.chaseCamera = new ChaseCamera({ camera, mesh: this.mesh, height: this.height })

      const orbitPromise = import('/utils/scene.js')
      orbitPromise.then(obj => {
        const { createOrbitControls } = obj
        this.orbitControls = createOrbitControls()
        this.orbitControls.maxPolarAngle = Math.PI - Math.PI / 4
        this.orbitControls.mouseButtons = { RIGHT: THREE.MOUSE.ROTATE }
      })
    }
  }

  /* GETTERS & SETTERS */

  get enemies() {
    if (!this.scene) return []
    return findChildren(this.scene, 'enemy')
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

  updateMove(delta, reaction = reactions.STOP) {
    super.updateMove(delta, reaction)
  }

  updateCamera(delta) {
    const { x, y, z } = this.mesh.position
    const { lookAt } = this.chaseCamera

    if (this.input.pressed.mouse2)
      this.orbitControls.target = new THREE.Vector3(x, y + lookAt[1], z)
    else
      this.chaseCamera.update(delta, this.state)
  }

  update(delta = 1 / 60) {
    super.update(delta)
    if (this.chaseCamera && this.shouldAlignCamera) {
      this.chaseCamera.alignCamera()
      this.shouldAlignCamera = false
    }
    if (this.chaseCamera) this.updateCamera(delta)
  }
}
