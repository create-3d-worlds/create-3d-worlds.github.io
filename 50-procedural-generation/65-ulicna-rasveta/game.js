import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/helpers.js'
import { createLampposts } from '/utils/streetlights.js'

const numLampposts = 15
const size = 200

camera.position.set(160, 40, 10)
createOrbitControls()

const ambient = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambient)

scene.add(createFloor({ size: size * 1.1 }))
scene.add(createLampposts({ size, numLampposts }))

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()