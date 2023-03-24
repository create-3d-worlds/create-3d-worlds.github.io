// https://2pha.com/demos/threejs/shaders/voronoi_with_borders.html
import * as THREE from 'three'
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { material } from '/utils/shaders/voronoi.js'

const controls = createOrbitControls()
camera.position.set(0, 0, 2)

material.uniforms.color = { value: new THREE.Color(0xFFC00F) }

const geometry = new THREE.BoxGeometry()
const box = new THREE.Mesh(geometry, material)
scene.add(box)

void function loop() {
  requestAnimationFrame(loop)
  controls.update()
  renderer.render(scene, camera)
}()