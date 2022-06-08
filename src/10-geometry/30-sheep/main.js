import * as THREE from 'three'
import { camera, scene, renderer } from '/utils/scene.js'
import { createSheep, createCloud } from '/utils/shapes.js'

camera.position.z = 10

const light = new THREE.AmbientLight(0xffffff)
scene.add(light)

const sheep = createSheep()
scene.add(sheep)

const cloud = createCloud()
scene.add(cloud)


void function update() {
  sheep.rotation.y += 0.01
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()
