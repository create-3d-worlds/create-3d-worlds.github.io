/* global CANNON, THREE, PointerLockControls */
import { camera, scene, renderer } from '/utils/scene.js'
import { dirLight } from '/utils/light.js'

const step = 1 / 60
const balls = []
const ballMeshes = []
const boxes = []
const boxMeshes = []

camera.position.z = 5

const world = new CANNON.World()
world.gravity.set(0, -20, 0)

dirLight({ position: [10, 30, 20], intensity: .9 })

const playerShape = new CANNON.Sphere(1.3)  // radius
const player = new CANNON.Body({ mass: 5 })
player.addShape(playerShape)
player.position.set(0, 3, 0)
world.addBody(player)

const controls = new PointerLockControls(camera, player)
controls.enabled = true
scene.add(controls.getObject())

addGround()

for (let i = 0; i < 10; i++) addBox()

/* HELPERS */

function addGround() {
  const groundShape = new CANNON.Plane()
  const ground = new CANNON.Body({ mass: 0 })
  ground.addShape(groundShape)
  ground.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
  world.addBody(ground)

  const floorGeometry = new THREE.PlaneGeometry(300, 300)
  floorGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2))
  const floor = new THREE.Mesh(floorGeometry, new THREE.MeshNormalMaterial())
  floor.receiveShadow = true
  scene.add(floor)
}

// TODO: napraviti zidine
function addBox() {
  const box = new CANNON.Body({ mass: 5 })
  const boxShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1))
  box.addShape(boxShape)
  box.position.set(
    (Math.random() - 0.5) * 20,
    1 + Math.random() - 0.5,
    (Math.random() - 0.5) * 20
  )
  const geometry = new THREE.BoxGeometry(2, 2, 2)
  const mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial())
  mesh.position.copy(box.position)
  mesh.castShadow = mesh.receiveShadow = true
  world.addBody(box)
  scene.add(mesh)
  boxes.push(box)
  boxMeshes.push(mesh)
}

function getShootDirection() {
  const vector = new THREE.Vector3(0, 0, 1)
  vector.unproject(camera)
  const ray = new THREE.Ray(player.position, vector.sub(player.position).normalize())
  return ray.direction
}

function shootBall(velocity = 15) {
  const ball = new CANNON.Body({ mass: 3 })
  const ballShape = new CANNON.Sphere(0.4)
  ball.addShape(ballShape)
  world.addBody(ball)
  balls.push(ball)
  const { x, y, z } = getShootDirection()
  ball.position.set(
    player.position.x + x,
    player.position.y + y,
    player.position.z + z
  )
  ball.velocity.set(x * velocity, y * velocity, z * velocity)
  const ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32)
  const ballMesh = new THREE.Mesh(ballGeometry, new THREE.MeshLambertMaterial())
  ballMesh.position.copy(ball.position)
  ballMesh.castShadow = ballMesh.receiveShadow = true
  scene.add(ballMesh)
  ballMeshes.push(ballMesh)
}

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  world.step(step)
  balls.forEach((b, i) => {
    ballMeshes[i].position.copy(b.position)
    ballMeshes[i].quaternion.copy(b.quaternion)
  })
  boxes.forEach((b, i) => {
    boxMeshes[i].position.copy(b.position)
    boxMeshes[i].quaternion.copy(b.quaternion)
  })
  controls.update()
  renderer.render(scene, camera)
}()

/* EVENTS */

document.body.addEventListener('click', document.body.requestPointerLock)

window.addEventListener('click', () => shootBall())
