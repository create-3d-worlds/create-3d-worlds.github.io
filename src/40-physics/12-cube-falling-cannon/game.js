/* global CANNON */
import * as THREE from '/node_modules/three119/build/three.module.js'
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { RIGHT_ANGLE } from '/utils/constants.js'
import { dirLight } from '/utils/light.js'

const dt = 1 / 60
const meshes = [], bodies = [] // To be synced

const world = new CANNON.World()
world.gravity.set(0, -10, 0)

const controls = createOrbitControls()
camera.position.set(5, 1, 0)

dirLight({ intensity: 1.75 })
scene.add(new THREE.AmbientLight(0x343434))

// THREE plane
const geometry = new THREE.PlaneGeometry(100, 100, 1, 1)
const material = new THREE.MeshLambertMaterial({ color: 0x777777 })
const floor = new THREE.Mesh(geometry, material)
geometry.rotateX(-RIGHT_ANGLE)
floor.receiveShadow = true
scene.add(floor)

// CANNON plane
const groundShape = new CANNON.Plane()
const groundBody = new CANNON.Body({ mass: 0 })
groundBody.addShape(groundShape)
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -RIGHT_ANGLE) // rotateX(-RIGHT_ANGLE)
world.add(groundBody)

// THREE box
const cubeGeo = new THREE.BoxGeometry(1, 1, 1, 10, 10)
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 })
const cube = new THREE.Mesh(cubeGeo, cubeMaterial)
cube.castShadow = true
meshes.push(cube)
scene.add(cube)

// CANNON box
const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
const boxBody = new CANNON.Body({ mass: 5 })
boxBody.addShape(boxShape)
boxBody.position.set(0, 5, 0)
world.add(boxBody)
bodies.push(boxBody)

/* LOOP */

function updatePhysics() {
  world.step(dt)
  meshes.forEach((mesh, i) => {
    mesh.position.copy(bodies[i].position)
    mesh.quaternion.copy(bodies[i].quaternion)
  })
}

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  updatePhysics()
  renderer.render(scene, camera)
}()