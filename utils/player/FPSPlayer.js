import Player from '/utils/player/Player.js'
import { camera as defaultCamera } from '/utils/scene.js'
import { getCameraIntersects, getScene, belongsTo, getParent, shakeCamera } from '/utils/helpers.js'
import FPSRenderer from '/utils/classes/2d/FPSRenderer.js'
import { shootDecals } from '/utils/decals.js'
import Particles from '/utils/classes/Particles.js'
import config from '/config.js'
import input from '/utils/classes/Input.js'
import { jumpStyles } from '/utils/constants.js'
import { createPlayerBox } from '/utils/geometry.js'

export default class FPSPlayer extends Player {
  constructor({
    camera = defaultCamera,
    mouseSensitivity = .002,
    rifleBurst = false,
    pointerLockId,
    ...rest
  } = {}) {
    super({
      mesh: createPlayerBox({ visible: false }),
      jumpStyle: jumpStyles.FLY,
      attackDistance: 100,
      ...rest,
    })
    this.mouseSensitivity = mouseSensitivity
    this.pointerLockId = pointerLockId
    this.rifleBurst = rifleBurst
    this.time = 0
    this.energy = 100
    this.hurting = false

    const file = rifleBurst ? 'rifle-burst' : 'rifle'
    this.audio = new Audio(`/assets/sounds/${file}.mp3`)
    this.audio.volume = config.volume

    this.fpsRenderer = new FPSRenderer()
    this.camera = camera
    const cameraX = this.mixer ? -.05 : 0
    const cameraZ = this.mixer ? -.25 : this.height / 4
    camera.position.set(cameraX, this.cameraHeight, cameraZ)
    camera.rotation.set(0, 0, 0)
    this.mesh.add(camera)

    this.ricochet = new Particles({ num: 100, size: .05, unitAngle: 0.2 })

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
    if (!this.pointerLockId) this.camera.lookAt(this.cameraTarget)
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

    const shoots = this.rifleBurst ? 5 : 1
    for (let i = 0; i < shoots; i++)
      setTimeout(() => this.shoot(), i * 100)
  }

  shoot() {
    const intersects = getCameraIntersects(this.camera, this.solids)
    if (!intersects.length) return

    const { point, object } = intersects[0]
    const scene = getScene(object)

    let ricochetColor = 0xcccccc

    if (belongsTo(object, 'enemy')) {
      const mesh = getParent(object, 'enemy')
      this.hit(mesh)
      ricochetColor = mesh.userData.hitColor
    } else
      shootDecals(intersects[0], { scene, color: 0x000000 })

    this.ricochet.reset({ pos: point, unitAngle: 0.2, color: ricochetColor })
    scene.add(this.ricochet.mesh)

    this.time += 5
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
      if (!this.mixer)
        this.fpsRenderer.render(this.time)
    } else
      this.fpsRenderer.clear()

    if (this.hurting) this.fpsRenderer.drawPain()

    this.ricochet.expand({ velocity: 1.2, maxRounds: 5, gravity: .02 })

    this.updateCamera()
  }
}
