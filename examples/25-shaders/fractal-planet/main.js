import * as THREE from 'three'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { material, uniforms } from '/utils/shaders/fractal-planet.js'

createOrbitControls()
const start = Date.now()

const mesh = new THREE.Mesh(
  new THREE.SphereGeometry(2, 200, 100),
  material
)
scene.add(mesh)

/* LOOP */

void function render() {
  requestAnimationFrame(render)

  uniforms.u_time.value = Date.now() - start
  renderer.render(scene, camera)
}()