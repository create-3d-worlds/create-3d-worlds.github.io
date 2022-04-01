import { scene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { createSunSky } from '/utils/sky.js'
import { cameraFollowObject } from '/utils/helpers.js'
import keyboard from '/classes/Keyboard.js'
import Airplane from '/classes/Airplane.js'

scene.add(createSunSky())
const controls = createOrbitControls()

// TODO: da ne slece kad nema tla

const avion = new Airplane(() => {
  scene.add(avion.mesh)
  controls.target = avion.mesh.position
})

/* UPDATE */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  avion.update()
  if (!keyboard.mouseDown) cameraFollowObject(camera, avion.mesh)

  renderer.render(scene, camera)
}()
