import * as THREE from 'three'
import { material, uniforms } from '/core/shaders/lightning-led.js'
import { scene, camera, renderer, createOrbitControls } from '/core/scene.js'

createOrbitControls()
scene.background = new THREE.Color(0x000000)

const geometry = new THREE.BoxGeometry()
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

/* LOOP */

void function loop(time) {
  requestAnimationFrame(loop)

  uniforms.iTime.value = time * 0.001
  renderer.render(scene, camera)
}()
