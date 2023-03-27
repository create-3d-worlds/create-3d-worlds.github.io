import Player from '/utils/player/Player.js'
import { camera as defaultCamera } from '/utils/scene.js'
import { getCameraIntersects, shakeCamera } from '/utils/helpers.js'
import FPSRenderer from '/utils/classes/2d/FPSRenderer.js'
import config from '/config.js'
import input from '/utils/classes/Input.js'
import { jumpStyles } from '/utils/constants.js'
import { createPlayerBox } from '/utils/geometry.js'

export default class FPSPlayer extends Player {
  constructor({
    camera = defaultCamera,
    mouseSensitivity = .002,
    pointerLockId,
    ...rest
  } = {}) {
    super({
      mesh: createPlayerBox({ visible: false }),
      jumpStyle: jumpStyles.FLY,
      attackDistance: 100,
      useShootEffects: true,
      ...rest,
    })
    this.mouseSensitivity = mouseSensitivity
    this.pointerLockId = pointerLockId
    this.time = 0
    this.energy = 100
    this.hurting = false

    this.audio = new Audio('/assets/sounds/rifle.mp3')
    this.audio.volume = config.volume

    this.fpsRenderer = new FPSRenderer()
    this.camera = camera
    const cameraX = this.mixer ? -.05 : 0
    const cameraZ = this.mixer ? -.25 : this.height / 4
    camera.position.set(cameraX, this.cameraHeight, cameraZ)
    camera.rotation.set(0, 0, 0)
    this.mesh.add(camera)

    if (pointerLockId) {
      const domElement = document.getElementById(pointerLockId)
      domElement.addEventListener('click', () => document.body.requestPointerLock())

      document.addEventListener('pointerlockchange', () => {
        domElement.style.display = document.pointerLockElement ? 'none' : 'block'
      })

      document.addEventListener('mousemove', e => this.moveCursor(e))
    }
  }

  get cameraHeight() {
    return this.height * .82
  }

  get cameraTarget() {
    const pos = this.mesh.position.clone()
    pos.y += this.cameraHeight
    return pos
  }

  updateCamera() {
    if (!this.pointerLockId && !this.mixer) this.camera.lookAt(this.cameraTarget)
  }

  moveCursor(e) {
    if (this.hurting || this.isDead || !document.pointerLockElement) return

    this.mesh.rotateY(-e.movementX * this.mouseSensitivity)
    this.camera.rotateX(-e.movementY * this.mouseSensitivity)
    this.camera.rotation.x = Math.max(-0.1, Math.min(Math.PI / 8, this.camera.rotation.x))
  }

  attackAction() {
    this.audio.currentTime = 0
    this.audio.play()
    super.attackAction()
    this.time += 5 // recoil
  }

  intersect() {
    return getCameraIntersects(this.camera, this.solids)
  }

  painEffect() {
    this.hurting = true
    shakeCamera(this.camera, this.hitAmount * .009, () => {
      this.hurting = this.isDead // red screen if dead
    })
  }

  checkHit() {
    if (this.hitAmount) this.painEffect()
    super.checkHit()
  }

  update(delta) {
    input.attack = input.pressed.mouse // attack with mouse
    super.update(delta)

    if (this.isAlive) {
      this.time += (input.run ? delta * this.runCoefficient : delta)
      if (this.mixer)
        this.fpsRenderer.renderTarget(this.time)
      else
        this.fpsRenderer.render(this.time)
    }

    if (this.isDead) this.fpsRenderer.clear()

    if (this.hurting) this.fpsRenderer.drawPain()

    this.updateCamera()
  }
}
