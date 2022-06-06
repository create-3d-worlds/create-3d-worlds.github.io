import * as THREE from '/node_modules/three127/build/three.module.js'
import { scene, camera, renderer } from '/utils/scene.js'
import Sheep from './Sheep.js'
import Cloud from './Cloud.js'
import Sky from './Sky.js'

let mouseDown,
  night = false

camera.lookAt(scene.position)
camera.position.set(0, 1.5, 8)

document.addEventListener('mousedown', onMouseDown)
document.addEventListener('mouseup', onMouseUp)
document.addEventListener('touchstart', onTouchStart)
document.addEventListener('touchend', onTouchEnd)

const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.9)
scene.add(light)

const directLight1 = new THREE.DirectionalLight(0xffd798, 0.8)
directLight1.castShadow = true
directLight1.position.set(9.5, 8.2, 8.3)
scene.add(directLight1)

const directLight2 = new THREE.DirectionalLight(0xc9ceff, 0.5)
directLight2.castShadow = true
directLight2.position.set(-15.8, 5.2, 8)
scene.add(directLight2)

const sheep = new Sheep()
scene.add(sheep.group)

const cloud = new Cloud()
scene.add(cloud.group)

const sky = new Sky()
sky.showNightSky(night)
scene.add(sky.group)

function onMouseDown(event) {
  mouseDown = true
}
function onTouchStart(event) {
  event.preventDefault()
  mouseDown = true
}

function onMouseUp() {
  mouseDown = false
}
function onTouchEnd(event) {
  event.preventDefault()
  mouseDown = false
}

void function animate() {
  requestAnimationFrame(animate)
  sheep.jumpOnMouseDown(mouseDown)
  if (sheep.group.position.y > 0.4) cloud.bend()
  sky.moveSky()
  renderer.render(scene, camera)
}()