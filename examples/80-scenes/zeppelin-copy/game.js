import { camera, scene, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createSun, hemLight } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { createGround } from '/utils/ground.js'

hemLight()
const sun = createSun({ pos: [250, 1000, 100], far: 5000 })
scene.add(sun)

scene.add(createGround())

createOrbitControls()

const screw = await loadModel({ file: 'airship/aerial-screw/model.fbx' })
scene.add(screw)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()
