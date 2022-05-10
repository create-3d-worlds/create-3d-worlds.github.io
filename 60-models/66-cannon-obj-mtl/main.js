import { scene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { hemLight } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'

hemLight({ intensity: 2 })

const controls = createOrbitControls()

const { mesh } = await loadModel(
  { file: 'cannon/cannon.obj', mtl: 'cannon/cannon.mtl', rot: { axis: [1, 0, 0], angle: -Math.PI * .5 } })
scene.add(mesh)
controls.target = mesh.position

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()

