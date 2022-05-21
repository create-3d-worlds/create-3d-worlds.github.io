/* global THREE, SteeringEntity */
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'

const controls = createOrbitControls()

const light = new THREE.AmbientLight(0xffffff)
scene.add(light)

let entity1, entity2, entity3
let ball
let boundaries

camera.position.set(0, 1000, 1000)
camera.lookAt(new THREE.Vector3(0, 0, 0))

const floor = createFloor({ size: 10000 })
scene.add(floor)

// Ball
const ballGeometry = new THREE.SphereGeometry(50, 32, 32)
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xBCFF00 })
ball = new THREE.Mesh(ballGeometry, ballMaterial)
ball.position.set(Math.random() * (5000 - (-5000)) + (-5000), 50, Math.random() * (5000 - (-5000)) + (-5000))
scene.add(ball)

// Entity Mesh
const geometry = new THREE.BoxGeometry(100, 200, 50)
const material1 = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true })
const mesh1 = new THREE.Mesh(geometry, material1)
mesh1.position.setY(100)

const material2 = new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: true })
const mesh2 = new THREE.Mesh(geometry, material2)
mesh2.position.setY(100)

const material3 = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
const mesh3 = new THREE.Mesh(geometry, material3)
mesh3.position.setY(100)
// Entities

// #1
entity1 = new SteeringEntity(mesh1)
entity1.maxSpeed = 15
entity1.lookAtDirection = true
entity1.position.set(Math.random() * (5000 - (-5000)) + (-5000), 0, Math.random() * (5000 - (-5000)) + (-5000))
scene.add(entity1)

// #2
entity2 = new SteeringEntity(mesh2)
entity2.maxSpeed = 10
entity2.lookAtDirection = true
entity2.position.set(Math.random() * (5000 - (-5000)) + (-5000), 0, Math.random() * (5000 - (-5000)) + (-5000))
scene.add(entity2)

// #3
entity3 = new SteeringEntity(mesh3)
entity3.maxSpeed = 10
entity3.lookAtDirection = true
entity3.position.set(Math.random() * (5000 - (-5000)) + (-5000), 0, Math.random() * (5000 - (-5000)) + (-5000))
scene.add(entity3)

// Plane boundaries (do not cross)
boundaries = new THREE.Box3(new THREE.Vector3(-5000, 0, -5000), new THREE.Vector3(5000, 0, 5000))

animate()

function animate() {
  requestAnimationFrame(animate)
  controls.update()

  entity1.avoid([entity2, entity3])
  entity2.avoid([entity1, entity3])
  entity3.avoid([entity1, entity2])

  // entity 1
  if (entity1.position.distanceTo(ball.position) > 100) {
    entity1.seek(ball.position)
    if (entity1.lookAtDirection)
      entity1.lookWhereGoing(true)
    else
      entity1.rotation.set(0, 0, 0)
  } else {
    entity1.idle()
    if (entity1.lookAtDirection)
      entity1.lookAt(new THREE.Vector3(ball.position.x, entity1.position.y, ball.position.z))
    else
      entity1.rotation.set(0, 0, 0)
  }

  // entity 2
  if (entity2.position.distanceTo(entity1.position) > 200) {
    entity2.seek(entity1.position)
    if (entity2.lookAtDirection)
      entity2.lookWhereGoing(true)
    else
      entity2.rotation.set(0, 0, 0)
    entity2.bounce(boundaries)
  } else {
    entity2.idle()
    if (entity2.lookAtDirection)
      entity2.lookAt(entity1.position)
    else
      entity2.rotation.set(0, 0, 0)
  }

  // entity 3
  if (entity3.position.distanceTo(entity1.position) > 200) {
    entity3.pursue(entity1)
    if (entity3.lookAtDirection)
      entity3.lookWhereGoing(true)
    else
      entity3.rotation.set(0, 0, 0)
    entity3.bounce(boundaries)
  } else {
    entity3.idle()
    if (entity3.lookAtDirection)
      entity3.lookAt(entity1.position)
    else
      entity3.rotation.set(0, 0, 0)
  }

  entity1.update()
  entity2.update()
  entity3.update()

  renderer.render(scene, camera)
}

document.addEventListener('mousedown', onClick, true)
document.addEventListener('mousemove', onMouseMove, true)

function onClick(event) {
  if (event.altKey) {
    const mouse3D = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0)
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse3D, camera)
    const intersects = raycaster.intersectObjects(scene.children)
    if (intersects.length > 0) {
      entity1.position.set(Math.random() * (5000 - (-5000)) + (-5000), 0, Math.random() * (5000 - (-5000)) + (-5000))
      entity2.position.set(Math.random() * (5000 - (-5000)) + (-5000), 0, Math.random() * (5000 - (-5000)) + (-5000))
      entity3.position.set(Math.random() * (5000 - (-5000)) + (-5000), 0, Math.random() * (5000 - (-5000)) + (-5000))
    }
  }
}

function onMouseMove(event) {
  const mouse3D = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0)
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse3D, camera)
  const intersects = raycaster.intersectObjects(scene.children)
  if (intersects.length > 0)
    ball.position.set(intersects[0].point.x, 50, intersects[0].point.z)
}
