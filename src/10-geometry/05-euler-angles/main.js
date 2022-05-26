/* global dat */
import * as THREE from '/node_modules/three119/build/three.module.js'
import { scene, camera, renderer } from '/utils/scene.js'
import { DEGREE } from '/utils/constants.js'
import { drawAxes } from './drawAxes.js'

function createAirplane() {
  const airplane = new THREE.Object3D()
  const material = new THREE.MeshPhongMaterial({ shininess: 100 })

  const nose = new THREE.Mesh(new THREE.SphereGeometry(15, 32, 16), material)
  nose.rotation.x = 90 * DEGREE
  nose.scale.y = 3
  nose.position.y = 0
  nose.position.z = 70
  airplane.add(nose)

  const body = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 180, 32), material)
  body.rotation.x = 90 * DEGREE
  body.position.y = 0
  body.position.z = -20
  airplane.add(body)

  const wing = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 250, 32), material)
  wing.scale.x = 0.2
  wing.rotation.z = 90 * DEGREE
  wing.position.y = 5
  airplane.add(wing)

  const tailWing = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 100, 32), material)
  tailWing.scale.x = 0.2
  tailWing.rotation.z = 90 * DEGREE
  tailWing.position.y = 5
  tailWing.position.z = -90
  airplane.add(tailWing)

  const tail = new THREE.Mesh(new THREE.CylinderGeometry(10, 15, 40, 32), material)
  tail.scale.x = 0.15
  tail.rotation.x = -10 * DEGREE
  tail.position.y = 20
  tail.position.z = -96
  airplane.add(tail)
  return airplane
}

/* INIT */

camera.position.set(-350, 250, 100)
camera.lookAt(scene.position)

const light = new THREE.DirectionalLight(0xFFFFFF, 1.0)
light.position.set(-10, 10, 0)
scene.add(light)
drawAxes(scene)

const airplane = createAirplane()
scene.add(airplane)

const gui = new dat.GUI()
const controller = { x: 0, y: 0, z: 0 }
gui.add(controller, 'x', -360, 360).name('Rotate x (pitch)')
gui.add(controller, 'y', -360, 360).name('Rotate y (yaw)')
gui.add(controller, 'z', -360, 360).name('Rotate z (roll)')

/* LOOP */

void function update() {
  window.requestAnimationFrame(update)
  airplane.rotation.x = controller.x * DEGREE // pitch
  airplane.rotation.y = controller.y * DEGREE // yaw
  airplane.rotation.z = controller.z * DEGREE // roll
  renderer.render(scene, camera)
}()
