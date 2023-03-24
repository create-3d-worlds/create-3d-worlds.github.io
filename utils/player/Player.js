import JoyStick from '/utils/classes/JoyStick.js'
import defaultKeyboard from '/utils/classes/Input.js'
import { jumpStyles, attackStyles, reactions } from '/utils/constants.js'
import { getPlayerState } from './states/index.js'

import Actor from './Actor.js'

function addCameraButton(player) {
  const style = `
    top: 20px;
    right: 20px;
    position: absolute;
    cursor: pointer;
    background-color: transparent;
    border: none;
    outline: none;
  `
  let aerialView = false
  const initial = player.cameraFollow.offset

  const button = document.createElement('button')
  button.setAttribute('id', 'change-camera')
  button.style.cssText = style

  const image = document.createElement('img')
  image.setAttribute('src', '/assets/images/change-camera.png')
  image.setAttribute('alt', 'change camera')
  button.appendChild(image)

  button.addEventListener('click', () => {
    aerialView = !aerialView
    player.cameraFollow.offset = aerialView ? player.cameraFollow.aerial : initial
  })
  document.body.appendChild(button)
}

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
    this.shouldAlignCamera = Boolean(this.cameraFollow)

    if (useJoystick) this.input.joystick = new JoyStick()

    if (this.cameraFollow) addCameraButton(this)
  }

  updateMove(delta, reaction = reactions.STOP) {
    super.updateMove(delta, reaction)
  }

  attackAction(name = 'enemy') {
    super.attackAction(name)
  }

  hit(mesh, range = [35, 55]) {
    super.hit(mesh, range)
  }

  update(delta) {
    super.update(delta)
    if (this.shouldAlignCamera) {
      this.cameraFollow.alignCamera()
      this.shouldAlignCamera = false
    }
  }
}
