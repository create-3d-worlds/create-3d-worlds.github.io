/* global dat */
import * as THREE from '/node_modules/three108/build/three.module.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { drawAxes } from './drawAxes.js'

let pivot
// const scene = createFullScene()

function createAirplane() {
  const airplane = new THREE.Object3D()
  const material = new THREE.MeshPhongMaterial({ shininess: 100 })

  const nose = new THREE.Mesh(new THREE.SphereGeometry(15, 32, 16), material)
  nose.rotation.x = 90 * Math.PI / 180
  nose.scale.y = 3
  nose.position.y = 0
  nose.position.z = 70
  airplane.add(nose)

  const body = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 180, 32), material)
  body.rotation.x = 90 * Math.PI / 180
  body.position.y = 0
  body.position.z = -20
  airplane.add(body)

  const wing = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 250, 32), material)
  wing.scale.x = 0.2
  wing.rotation.z = 90 * Math.PI / 180
  wing.position.y = 5
  airplane.add(wing)

  const tailWing = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 100, 32), material)
  tailWing.scale.x = 0.2
  tailWing.rotation.z = 90 * Math.PI / 180
  tailWing.position.y = 5
  tailWing.position.z = -90
  airplane.add(tailWing)

  const tail = new THREE.Mesh(new THREE.CylinderGeometry(10, 15, 40, 32), material)
  tail.scale.x = 0.15
  tail.rotation.x = -10 * Math.PI / 180
  tail.position.y = 20
  tail.position.z = -96
  airplane.add(tail)
  return airplane
}

/* INIT */

const controls = createOrbitControls(camera)

camera.position.set(0, 0, 100)
camera.lookAt(scene.position)

const light = new THREE.DirectionalLight(0xFFFFFF, 1.0)
light.position.set(-10, 10, 0)
scene.add(light)
drawAxes(scene)

const airplane = createAirplane()
// scene.add(airplane)

const gui = new dat.GUI()
const controller = { x: 0, y: 0, z: 0 }
gui.add(controller, 'x', -360, 360).name('Red: x (pitch)')
gui.add(controller, 'y', -360, 360).name('Green: y (yaw)')
gui.add(controller, 'z', -360, 360).name('Blue: z (roll)')

/* LOAD */

function normalizeModel(mesh) {
  mesh.scale.set(.3, .3, .3)
  mesh.rotateX(-Math.PI / 20)
  mesh.translateX(8)
  mesh.translateY(-20)
  // centar ose rotacije
  const box = new THREE.Box3().setFromObject(mesh)
  box.center(mesh.position) // re-sets the mesh position
  mesh.position.multiplyScalar(- 1)
  const group = new THREE.Group()
  group.add(mesh)
  return group
}

new ColladaLoader().load('/assets/models/s-e-5a/model.dae', collada => {
  pivot = normalizeModel(collada.scene)
  scene.add(pivot)
  animate()
})

/* LOOP */

function animate() {
  window.requestAnimationFrame(animate)
  controls.update()
  airplane.rotation.x = controller.x * Math.PI / 180 // pitch
  airplane.rotation.y = controller.y * Math.PI / 180 // yaw
  airplane.rotation.z = controller.z * Math.PI / 180 // roll

  pivot.rotation.x = controller.x * Math.PI / 180 // pitch
  pivot.rotation.y = controller.y * Math.PI / 180 // yaw
  pivot.rotation.z = controller.z * Math.PI / 180 // roll
  renderer.render(scene, camera)
}