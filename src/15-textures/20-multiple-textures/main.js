import * as THREE from '/node_modules/three127/build/three.module.js'
import { camera, scene, renderer } from '/utils/scene.js'

camera.position.z = 100

const loader = new THREE.TextureLoader()

/* CUBE */

const materials = []
for (let i = 1; i < 7; i++) materials.push(
  new THREE.MeshBasicMaterial({ map: loader.load(`img/Dice-Blue-${i}.png`) })
)
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(40, 40, 40),
  materials
)
scene.add(cube)

/* LOOP */

void function update() {
  window.requestAnimationFrame(update)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
}()
