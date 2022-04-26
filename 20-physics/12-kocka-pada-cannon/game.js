/* global CANNON */
import * as THREE from '/node_modules/three108/build/three.module.js'
import {camera, scene, renderer} from '/utils/scene.js'

let world
const dt = 1 / 60
const meshes = [], bodies = [] // To be synced

initCannon()

camera.position.set(5, 2, 0)
camera.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)

scene.add(new THREE.AmbientLight(0x666666))

const light = new THREE.DirectionalLight(0xffffff, 1.75)
light.position.set(20, 20, 20)
light.castShadow = true
scene.add(light)

const geometry = new THREE.PlaneGeometry(100, 100, 1, 1)
const material = new THREE.MeshLambertMaterial({ color: 0x777777 })
const floor = new THREE.Mesh(geometry, material)
floor.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)
floor.receiveShadow = true
scene.add(floor)

const cubeGeo = new THREE.BoxGeometry(1, 1, 1, 10, 10)
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 })
const cube = new THREE.Mesh(cubeGeo, cubeMaterial)
cube.castShadow = true
meshes.push(cube)
scene.add(cube)

function initCannon() {
  world = new CANNON.World()
  world.gravity.set(0, -10, 0)
  // box
  const mass = 5
  const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
  const boxBody = new CANNON.Body({ mass })
  boxBody.addShape(boxShape)
  boxBody.position.set(0, 5, 0)
  world.add(boxBody)
  bodies.push(boxBody)
  // plane
  const groundShape = new CANNON.Plane()
  const groundBody = new CANNON.Body({ mass: 0 })
  groundBody.addShape(groundShape)
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
  world.add(groundBody)
}

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
  updatePhysics()
  renderer.render(scene, camera)
}()