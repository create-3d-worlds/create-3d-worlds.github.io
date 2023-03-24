import * as THREE from 'three'
import { material, uniforms } from '/utils/shaders/fireball.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'

createOrbitControls()
scene.background = new THREE.Color(0x000000)

const circle = new THREE.Mesh(new THREE.CircleGeometry(2, 32), material)
circle.translateX(2)
scene.add(circle)

const sphere = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), material)
sphere.translateX(-2)
scene.add(sphere)

/* LOOP */

void function loop(time) {
  requestAnimationFrame(loop)
  uniforms.iTime.value = time * 0.0005
  renderer.render(scene, camera)
}()
