import * as THREE from 'three'
import { scene, renderer, camera, clock, setBackground } from '/core/scene.js'
import { material, uniforms } from '/core/shaders/lava.js'

setBackground(0x00000)
camera.position.set(0, 0, 2)

const geometry = new THREE.SphereGeometry()
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  uniforms.time.value = clock.getElapsedTime()
  renderer.render(scene, camera)
}()