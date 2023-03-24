import * as THREE from 'three'
import { scene, camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { material, uniforms } from '/utils/shaders/ripple.js'

createOrbitControls()

const geometry = new THREE.PlaneGeometry(10, 10)
const plane = new THREE.Mesh(geometry, material)
plane.rotateX(-Math.PI * 0.5)
scene.add(plane)

void function loop() {
  requestAnimationFrame(loop)

  uniforms.u_time.value += clock.getDelta()
  renderer.render(scene, camera)
}()