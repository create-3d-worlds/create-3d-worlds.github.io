import Player from '/utils/actor/Player.js'
import FPSRenderer from '/utils/actor/FPSRenderer.js'
import { camera as defaultCamera } from '/utils/scene.js'
import { getCameraIntersects } from '/utils/helpers.js'
import { attackStyles, jumpStyles } from '/utils/constants.js'
import { createPlayerBox } from '/utils/geometry/index.js'

export default class FPSPlayer extends Player {
  constructor({
    camera = defaultCamera,
    mouseSensitivity = .002,
    attackSound = 'rifle.mp3',
    usePointerLock = true,
    goal = '',
    ...rest
  } = {}) {
    super({
      mesh: createPlayerBox({ visible: false }),
      attackStyle: attackStyles.ONCE,
      jumpStyle: jumpStyles.FLY_JUMP,
      attackDistance: 100,
      useRicochet: true,
      attackSound,
      ...rest,
    })
    this.mouseSensitivity = mouseSensitivity
    this.usePointerLock = usePointerLock
    this.goal = goal
    this.time = 0
    this.energy = 100
    this.hurting = false
    this.fpsRenderer = new FPSRenderer()
    this.camera = camera
    const cameraX = this.mixer ? -.05 : 0
    const cameraZ = this.mixer ? -.25 : this.height / 4
    camera.position.set(cameraX, this.cameraHeight, cameraZ)
    camera.rotation.set(0, 0, 0)
    this.mesh.add(camera)

    if (usePointerLock) this.addPointerLock()
  }

  /* GETTERS */

  get cameraHeight() {
    return this.height * .82
  }

  get cameraTarget() {
    const pos = this.mesh.position.clone()
    pos.y += this.cameraHeight
    return pos
  }

  get startScreen() {
    const goal = this.goal ? `<div>${this.goal}</div>` : ''
    return /* html */`
      ${goal}
      <h2 class="pointer">Click to START!</h2>
      <p>
        Shoot: MOUSE<br />
        Move: WASD or ARROWS<br />
        Run: CAPSLOCK
      </p>
    `
  }

  get endScreen() {
    return /* html */`
      <h2>You are dead.</h2>
      <p>Reload to play again</p>
    `
  }

  /* UTILS */

  addPointerLock() {
    this.window = document.createElement('div')
    this.window.innerHTML = this.startScreen
    this.window.className = 'central-screen rpgui-container framed'
    document.body.appendChild(this.window)

    this.window.addEventListener('click', document.body.requestPointerLock)

    document.addEventListener('pointerlockchange', () => {
      this.window.style.display = document.pointerLockElement ? 'none' : 'block'
      this.window.innerHTML = this.dead ? this.endScreen : this.startScreen
    })

    document.addEventListener('mousemove', e => this.moveCursor(e))
  }

  moveCursor(e) {
    if (this.hurting || this.dead || !document.pointerLockElement) return

    this.mesh.rotateY(-e.movementX * this.mouseSensitivity)
    this.camera.rotateX(-e.movementY * this.mouseSensitivity)
    const lowerRotation = -Math.PI / 10
    const upperRotation = Math.PI / 8
    this.camera.rotation.x = Math.max(lowerRotation, Math.min(upperRotation, this.camera.rotation.x))
  }

  /* COMBAT */

  // parent method overriding
  intersect() {
    return getCameraIntersects(this.camera, this.solids)
  }

  enterAttack() {
    super.enterAttack()
    this.time += 5 // recoil
  }

  painEffect() {
    this.hurting = true
    setTimeout(() => {
      this.hurting = this.dead // red screen if dead
    }, 300)
  }

  checkHit() {
    if (this.hitAmount) this.painEffect()
    super.checkHit()
  }

  /* UPDATES */

  updateCamera() {
    if (!this.usePointerLock && !this.mixer) this.camera.lookAt(this.cameraTarget)
  }

  update(delta) {
    const { input } = this
    if (this.usePointerLock) input.attack = input.pressed.mouse // shoot with mouse

    super.update(delta)

    if (!this.dead) {
      this.time += (input.run ? delta * this.runCoefficient : delta)
      if (this.mixer)
        this.fpsRenderer.renderTarget(this.time)
      else
        this.fpsRenderer.render(this.time)
    }

    if (this.dead) this.fpsRenderer.clear()

    if (this.hurting) this.fpsRenderer.drawPain()

    this.updateCamera()
  }
}
