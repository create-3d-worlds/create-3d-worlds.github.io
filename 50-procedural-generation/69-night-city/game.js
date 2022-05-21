import * as THREE from '/node_modules/three119/build/three.module.js'
import { scene, camera, renderer, createOrbitControls, hemLight } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { generateCity } from '/utils/city-deprecated.js'

hemLight({ intensity: 1.2 })

const size = 100

const controls = createOrbitControls()
scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0025)
scene.add(createGround({ size: size * 2, color: 0x101018 }))

scene.add(generateCity(size))

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
