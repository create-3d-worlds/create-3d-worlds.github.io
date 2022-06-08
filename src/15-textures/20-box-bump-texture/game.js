import { camera, scene, renderer } from '/utils/scene.js'
import { initLights } from '/utils/light.js'
import { createBox } from '/utils/geometry.js'

const rotSpeed = 0.005

camera.position.set(0, 10, 20)
camera.lookAt(scene.position)
initLights()

/* CUBE */

const cube = createBox({ size: 15, file: 'bricks.jpg' })
cube.position.set(-13, 0, -5)
scene.add(cube)

const bumpCube = createBox({ size: 15, file: 'bricks.jpg', bumpFile: 'gray-bricks.jpg' })
bumpCube.position.set(13, 0, -5)
scene.add(bumpCube)

/* LOOP */

void function render() {
  renderer.render(scene, camera)
  cube.rotation.y += rotSpeed
  bumpCube.rotation.y -= rotSpeed
  requestAnimationFrame(render)
}()
