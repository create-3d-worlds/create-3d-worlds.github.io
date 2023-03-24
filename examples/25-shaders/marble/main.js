import * as THREE from 'three'
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { material } from '/utils/shaders/marble.js'

createOrbitControls()

const geometry = new THREE.PlaneGeometry(10, 10)
const plane = new THREE.Mesh(geometry, material)
plane.rotateX(-Math.PI * 0.5)
scene.add(plane)

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()