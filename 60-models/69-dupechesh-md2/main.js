// https://threejs.org/examples/webgl_loader_md2.html
// https://threejs.org/examples/webgl_loader_md2_control.html
import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, renderer, camera, clock, createOrbitControls, hemLight } from '/utils/scene.js'
import { loadModel } from '/utils/loaders.js'

let a = 0

hemLight()
createOrbitControls()
camera.position.set(10, 10, 50)

const { mesh, animations } = await loadModel({ file: 'ogro/ogro.md2', texture: 'ogro/skins/arboshak.png' })
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

void function render() {
  const delta = clock.getDelta()
  if (mixer) mixer.update(delta)
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()
