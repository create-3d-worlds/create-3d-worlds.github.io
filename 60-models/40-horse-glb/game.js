import * as THREE from '/node_modules/three119/build/three.module.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import { dirLight } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'

let theta = 0

dirLight({ color: 0xefefff, intensity: 1.5 })

const { mesh, animations } = await loadModel({ file: 'horse.glb', size: 2 })
scene.add(mesh)

const mixer = new THREE.AnimationMixer(mesh)
const action = mixer.clipAction(animations[0])
action.play()

// FUNCTIONS

function rotateCamera() {
  const radius = 3
  theta += 0.2
  camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta))
  camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta))
  camera.lookAt(new THREE.Vector3(0, 2, 0))
}

// LOOP

void function animate() {
  requestAnimationFrame(animate)
  rotateCamera()
  const delta = clock.getDelta()
  if (mixer) mixer.update(delta)
  renderer.render(scene, camera)
}()
