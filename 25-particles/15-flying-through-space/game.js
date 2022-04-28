import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'

const stars = []
const numberOfStars = 2000
camera.position.z = numberOfStars

for (let i = 0; i < numberOfStars; i += 20) {
  const geometry = new THREE.SphereGeometry(1)
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const sphere = new THREE.Mesh(geometry, material)
  sphere.position.x = randomInRange(-500, 500)
  sphere.position.y = randomInRange(-500, 500)
  sphere.position.z = i
  scene.add(sphere)
  stars.push(sphere)
}

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  camera.position.z--
  renderer.render(scene, camera)
}()
