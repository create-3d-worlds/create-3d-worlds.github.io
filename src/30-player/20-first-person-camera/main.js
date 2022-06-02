import * as THREE from '/node_modules/three127/build/three.module.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import keyboard from '/classes/Keyboard.js'
import { createFloor } from '/utils/ground.js'

const floor = createFloor({ file: 'sand-512.jpg', circle: false })
scene.add(floor)

const player = new THREE.Mesh()
player.position.set(0, 2, 0)
scene.add(player)

player.add(camera) // creates fps camera

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  const delta = clock.getDelta() // seconds
  const step = 5 * delta // pixels per second
  const angle = Math.PI / 4 * delta // radians per second

  if (keyboard.left) player.rotateY(angle)
  if (keyboard.right) player.rotateY(-angle)
  if (keyboard.up) player.translateZ(-step)
  if (keyboard.down) player.translateZ(step)
  if (keyboard.pressed.KeyQ) player.translateX(-step)
  if (keyboard.pressed.KeyE) player.translateX(step)
}()
