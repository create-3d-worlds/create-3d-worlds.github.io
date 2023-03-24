import * as THREE from 'three'
import { camera, scene, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { material } from '/utils/shaders/waves.js'

createOrbitControls()
camera.position.set(1, 1, 1)

scene.background = new THREE.Color(0x8e99a2)

const geometry = new THREE.PlaneGeometry(12, 12, 512, 512)
const water = new THREE.Mesh(geometry, material)
water.rotation.x = -Math.PI * 0.5
scene.add(water)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)

  material.uniforms.uTime.value = clock.getElapsedTime()
  renderer.render(scene, camera)
}()