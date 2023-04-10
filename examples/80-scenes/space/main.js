import { scene, camera, renderer, clock, setBackground, createOrbitControls } from '/utils/scene.js'
import { Stars } from '/utils/classes/Particles.js'
import { loadModel } from '/utils/loaders.js'
import { ambLight } from '/utils/light.js'

setBackground(0x000000)
createOrbitControls()
ambLight()

const stars = new Stars()
scene.add(stars.mesh)

const { mesh } = await loadModel({ file: 'space/arcology-ring/model.fbx', size: 400, shouldCenter: true })
scene.add(mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()

  renderer.render(scene, camera)
}()
