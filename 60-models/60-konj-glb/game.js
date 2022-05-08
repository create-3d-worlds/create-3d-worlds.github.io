import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import { dirLight } from '/utils/light.js'
import { loadGlb } from '/utils/loaders.js'

let theta = 0

dirLight({ color: 0xefefff, intensity: 1.5 })

const { model, mixer } = await loadGlb({ glb: 'horse.glb', scale: 1.5 })
scene.add(model)

// FUNCTIONS

function rotateCamera() {
  const radius = 600
  theta += 0.1
  camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta))
  camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta))
  camera.lookAt(new THREE.Vector3(0, 200, 0))
}

// LOOP

void function animate() {
  requestAnimationFrame(animate)
  rotateCamera()
  const delta = clock.getDelta()
  if (mixer) mixer.update(delta)
  renderer.render(scene, camera)
}()
