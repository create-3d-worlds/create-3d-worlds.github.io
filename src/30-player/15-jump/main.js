import { scene, camera, renderer } from '/utils/scene.js'
import { createCrate } from '/utils/boxes.js'
import { initLights } from '/utils/light.js'

initLights()
camera.position.z = 7

const player = createCrate()
scene.add(player)

let velocityY = 0.0
const gravity = -0.3
let onGround = false

function startJump() {
  if (!onGround) return
  velocityY = 2.0
  onGround = false
}

function endJump() {
  if (velocityY > .5)
    velocityY = .5
}

const checkGround = () => {
  if (player.position.y < 0.0) {
    player.position.y = 0.0
    velocityY = 0.0
    onGround = true
  }
}

/* LOOP */

void function mainLoop() {
  requestAnimationFrame(mainLoop)
  velocityY += gravity
  player.position.y += velocityY
  checkGround()
  renderer.render(scene, camera)
}()

/* EVENTS */

window.addEventListener('mousedown', startJump, false)
window.addEventListener('mouseup', endJump, false)