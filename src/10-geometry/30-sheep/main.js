import * as THREE from 'three'
import { camera, scene, renderer } from '/utils/scene.js'
import { createSheep } from '/utils/shapes.js'

camera.position.z = 10

const light = new THREE.AmbientLight(0xffffff)
scene.add(light)

const mesh = createSheep()
scene.add(mesh)

void function update() {
  mesh.rotation.y += 0.01
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()
