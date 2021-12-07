import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { cameraFollowObject } from '/utils/helpers.js'
import { createStars } from '/utils/stars.js'
import { createGradientSky } from '/utils/sky.js'
import { createGround } from '/utils/ground/index.js'
import { createHillyTerrain } from '/utils/ground/createHillyTerrain.js'
import Zeppelin from '/classes/Zeppelin.js'
import keyboard from '/classes/Keyboard.js'

const controls = createOrbitControls()

const stars = createStars({ radiusMin: 5000, radius: 10000, numberOfStars: 100000 })
scene.add(stars)

scene.add(createGradientSky({ r: 5000, bottomColor: 0x000000, topColor: 0x002266 }))
// scene.add(createGround({ color: 0x007577 }))

const ground = createHillyTerrain(
  { size: 10000, y: 100, color: 0x33aa33, factorX : 5, factorZ : 2.5, factorY : 200 })
scene.add(ground)

const zeppelin = new Zeppelin(mesh => {
  scene.add(mesh)
  mesh.position.y = 256
  controls.target = mesh.position
})

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  zeppelin.update()

  if (!keyboard.mouseDown)
    cameraFollowObject(camera, zeppelin.mesh, { y: 30 })
  renderer.render(scene, camera)
}()
