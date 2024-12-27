import * as THREE from 'three'
import { scene, camera, renderer, clock, createOrbitControls, setBackground } from '/core/scene.js'
import { material, uniforms } from '/core/shaders/fractal-planet.js'

createOrbitControls()
setBackground(0x00000)

const mesh = new THREE.Mesh(
  new THREE.SphereGeometry(2, 200, 100),
  material
)
scene.add(mesh)

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  const time = clock.getElapsedTime()

  uniforms.time.value = time
  renderer.render(scene, camera)
}()