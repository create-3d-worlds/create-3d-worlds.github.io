import * as THREE from 'three'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import { material, uniforms } from '/utils/shaders/lava.js'

camera.position.set(0, 0, 2)

const geometry = new THREE.SphereGeometry()
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const time = clock.getElapsedTime()

  uniforms.time.value = time
  renderer.render(scene, camera)
}()