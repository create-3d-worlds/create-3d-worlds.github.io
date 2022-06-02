import * as THREE from '/node_modules/three125/build/three.module.js'
import { scene, renderer, camera, clock, createOrbitControls, hemLight } from '/utils/scene.js'
import { loadModel } from '/utils/loaders.js'

let a = 0

hemLight()
const controls = createOrbitControls()
camera.position.set(1, 2, 3)

const { mesh, animations } = await loadModel({ file: 'character-girl-fighter/girl-walk.fbx', size: 2 })
scene.add(mesh)

const mixer = new THREE.AnimationMixer(mesh)
let clip = animations[0]
mixer.clipAction(clip).play()

document.addEventListener('click', () => {
  if (clip) mixer.clipAction(clip).stop()
  clip = animations[++a % animations.length]
  console.log(clip.name)
  mixer.clipAction(clip.name).play()
})

// LOOP

void function render() {
  requestAnimationFrame(render)
  const delta = clock.getDelta()
  if (mixer) mixer.update(delta)
  controls.update()
  renderer.render(scene, camera)
}()
