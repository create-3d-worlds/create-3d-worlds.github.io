/* global THREE, SteeringEntity */
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'

const controls = createOrbitControls()

const light = new THREE.AmbientLight(0xffffff)
scene.add(light)

let entity1
let boundaries
let params

let followers

camera.position.set(0, 1000, 1000)

const floor = createFloor({ size: 10000 })
scene.add(floor)

// Entity Mesh
const geometry = new THREE.BoxGeometry(100, 200, 50)
const material1 = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true })
const mesh1 = new THREE.Mesh(geometry, material1)
mesh1.position.setY(100)

// Entities
entity1 = new SteeringEntity(mesh1)
entity1.maxSpeed = 15
entity1.lookAtDirection = true
entity1.position.set(Math.random() * (2500 - (-2500)) + (-2500), 0, Math.random() * (2500 - (-2500)) + (-2500))
entity1.wanderDistance = 10
entity1.wanderRadius = 5
entity1.wanderRange = 1
scene.add(entity1)

const material3 = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })

params = { maxSpeed: 15, maxForce: 5, lookAtDirection: true, wanderDistance: 10, wanderRadius: 5, wanderRange: 1, numFollowers: 20, distance: 400, separationRadius: 300, maxSeparation: 500, leaderSightRadius: 1000, arrivalThreshold: 200 }

followers = []

for (let i = 0;i < params.numFollowers;i++) {
  const mesh = new THREE.Mesh(geometry, material3)
  mesh.position.setY(100)
  const entity = new SteeringEntity(mesh)
  entity.position.set(Math.random() * (2500 - (-2500)) + (-2500), 0, Math.random() * (2500 - (-2500)) + (-2500))
  entity.maxSpeed = params.maxSpeed
  entity.maxForce = params.maxForce
  followers.push(entity)
  scene.add(entity)
}

// Plane boundaries (do not cross)
boundaries = new THREE.Box3(new THREE.Vector3(-5000, 0, -5000), new THREE.Vector3(5000, 0, 5000))

// Gui

animate()
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  entity1.wander()

  if (entity1.lookAtDirection)
    entity1.lookWhereGoing(true)
  else
    entity1.rotation.set(0, 0, 0)

  for (let i = 0;i < followers.length;i++) {
    followers[i].maxSpeed = params.maxSpeed
    followers[i].maxForce = params.maxForce
    followers[i].followLeader(entity1, followers, params.distance, params.separationRadius, params.maxSeparation, params.leaderSightRadius, params.arrivalThreshold)
    if (params.lookAtDirection)
      followers[i].lookWhereGoing(true)
    else
      followers[i].rotation.set(0, 0, 0)
    followers[i].update()
    followers[i].bounce(boundaries)
  }

  entity1.update()
  entity1.bounce(boundaries)

  renderer.render(scene, camera)
}

document.addEventListener('mousedown', onClick, true)

function onClick(event) {
  if (event) {
    const mouse3D = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0)
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse3D, camera)
    const intersects = raycaster.intersectObjects(scene.children)
    if (intersects.length > 0)
      entity1.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z)
  }
}
