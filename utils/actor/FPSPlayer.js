import Player from '/utils/actor/Player.js'
import FPSRenderer from '/utils/actor/FPSRenderer.js'
import { getCameraIntersects } from '/utils/helpers.js'
import { attackStyles, jumpStyles } from '/utils/constants.js'
import { createPlayerBox } from '/utils/geometry/index.js'

export default class FPSPlayer extends Player {
  constructor({
    camera,
    attackDistance = 100,
    mouseSensitivity = .002,
    attackSound = 'rifle.mp3',
    goals = [],
    ...rest
  } = {}) {
    super({
      mesh: createPlayerBox({ visible: false }),
      attackStyle: attackStyles.ONCE,
      jumpStyle: jumpStyles.FLY_JUMP,
      useRicochet: true,
      attackDistance,
      attackSound,
      ...rest,
    })
    this.mouseSensitivity = mouseSensitivity
    this.goals = goals
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

    this.addPointerLock()
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
    const goals = this.goals.map(goal => `<li>${goal}</li>`).join('')
    return /* html */`
      <ul>${goals}</ul>
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
      <p>Press Reload to play again</p>
    `
  }

  /* UTILS */

  showEndScreen() {
    this.window.style.display = 'block'
    this.window.innerHTML = this.endScreen
  }

  addPointerLock() {
    this.window = document.createElement('div')
    this.window.innerHTML = this.startScreen
    this.window.className = 'central-screen rpgui-container framed'
    document.body.appendChild(this.window)

    this.window.addEventListener('click', () => {
      if (this.dead) return
      document.body.requestPointerLock()
    })

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

  update(delta) {
    const { input } = this
    input.attack = input.pressed.mouse // shoot with mouse

    super.update(delta)

    if (!this.dead) {
      this.time += (input.run ? delta * this.runCoefficient : delta)
      if (this.mixer)
        this.fpsRenderer.renderTarget(this.time)
      else
        this.fpsRenderer.render(this.time)
    }

    if (this.dead) {
      document.exitPointerLock()
      this.fpsRenderer.clear()
      this.showEndScreen()
    }

    if (this.hurting) this.fpsRenderer.drawPain()
  }
}
