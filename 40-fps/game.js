import { scene, camera, renderer, clock } from '../utils/3d-scene.js'
import { createFloor, createPlayerBox } from '../utils/3d-helpers.js'
import keyboard from '../classes/Keyboard.js'

const cameraDistance = [0, 50, 200]
const cube = createPlayerBox(0, 0, 50)

scene.add(createFloor(1000, 1000))
scene.add(cube)

function update() {
  const delta = clock.getDelta()
  const moveDistance = 200 * delta // 200 pixels per second
  const rotateAngle = Math.PI / 2 * delta // 90 degrees per second

  if (keyboard.pressed.KeyW) cube.translateZ(-moveDistance)
  if (keyboard.pressed.KeyS) cube.translateZ(moveDistance)
  if (keyboard.pressed.KeyA) cube.rotateY(rotateAngle)
  if (keyboard.pressed.KeyD) cube.rotateY(-rotateAngle)

  // TODO: kad gleda gore da ne moze da radi nista drugo, i da se nakon toga automatski vrati u normalu
  // if (keyboard.pressed.ArrowUp) cube.rotateX(-rotateAngle)
  // if (keyboard.pressed.ArrowDown) cube.rotateX(rotateAngle)

  const {x, y, z} = new THREE.Vector3(...cameraDistance).applyMatrix4(cube.matrixWorld)
  camera.position.set(x, y, z)
  camera.lookAt(cube.position)
}

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  update()
  renderer.render(scene, camera)
}()
