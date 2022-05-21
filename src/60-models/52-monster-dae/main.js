import * as THREE from '/node_modules/three119/build/three.module.js'
import { scene, renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import { loadModel } from '/utils/loaders.js'

createOrbitControls()
camera.position.set(0, 10, 150)

const { mesh, animations } = await loadModel({ file: 'monster/monster.dae', size: 2 })
scene.add(mesh)

const mixer = new THREE.AnimationMixer(mesh)
mixer.clipAction(animations[0]).play()

void function render() {
  const delta = clock.getDelta()
  requestAnimationFrame(render)
  if (mixer) mixer.update(delta)
  renderer.render(scene, camera)
}()
