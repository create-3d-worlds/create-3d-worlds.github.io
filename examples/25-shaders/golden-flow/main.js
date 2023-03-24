import * as THREE from 'three'
import { material, uniforms } from '/utils/shaders/golden-flow.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'

createOrbitControls()
scene.background = new THREE.Color(0x000000)

const geometry = new THREE.PlaneGeometry(10, 10)
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
mesh.rotateX(-Math.PI * .5)

/* LOOP */

void function loop(time) {
  requestAnimationFrame(loop)
  uniforms.iTime.value = time * 0.0003
  renderer.render(scene, camera)
}()
