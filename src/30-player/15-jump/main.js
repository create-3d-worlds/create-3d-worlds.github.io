import { scene, camera, renderer } from '/utils/scene.js'
import { createCrate } from '/utils/boxes.js'
import { initLights } from '/utils/light.js'
import { createFloor } from '/utils/ground.js'

initLights()
camera.position.z = 7

const player = createCrate()
scene.add(player)

const floor = createFloor({ size: 100 })
scene.add(floor)

let velocityY = 0.0
const gravity = -0.2
let onGround = false

function startJump() {
  if (!onGround) return
  velocityY = 1.5
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

window.addEventListener('keydown', e => {
  if (e.code == 'Space') startJump()
})
window.addEventListener('keyup', e => {
  if (e.code == 'Space') endJump()
})