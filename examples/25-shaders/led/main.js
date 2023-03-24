import * as THREE from 'three'
import { camera, scene, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { material } from '/utils/shaders/led.js'

createOrbitControls()
scene.background = new THREE.Color(0x000000)

const geometry = new THREE.BoxGeometry()
const box = new THREE.Mesh(geometry, material)

scene.add(box)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const time = clock.getElapsedTime()
  material.uniforms.time.value = time * 3
  renderer.render(scene, camera)
}()