import * as THREE from '/node_modules/three127/build/three.module.js'
import { scene, camera, renderer, createOrbitControls, clock } from '/utils/scene.js'
import { dirLight } from '/utils/light.js'
import Sheep from './Sheep.js'
import { createCloud, updateCloud } from '/utils/shapes.js'
import Sky from './Sky.js'

createOrbitControls()
camera.lookAt(scene.position)
camera.position.set(0, 1.5, 8)

const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.9)
scene.add(light)

dirLight({ color: 0xffd798, intensity: 0.8 })

const sheep = new Sheep()
scene.add(sheep.group)

const cloud = createCloud()
cloud.position.y = -2
scene.add(cloud)

const sky = new Sky()
sky.showNightSky(false)
scene.add(sky.group)

void function animate() {
  requestAnimationFrame(animate)
  sheep.updateJump()
  updateCloud(cloud, clock.getElapsedTime())
  sky.moveSky()
  renderer.render(scene, camera)
}()