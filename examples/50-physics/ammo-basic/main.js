import * as THREE from 'three'

import { Ammo, createRigidBody } from '/utils/physics.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import input from '/utils/classes/Input.js'
import PhysicsWorld from '/utils/classes/PhysicsWorld.js'
import { createGround } from '/utils/ground.js'
import { createSphere, createBox } from '/utils/geometry.js'
import { normalizeMouse } from '/utils/helpers.js'

const { pressed } = input

const world = new PhysicsWorld()
const raycaster = new THREE.Raycaster()

camera.position.set(0, 20, 50)
scene.add(createSun({ position: [10, 50, 20] }))

const ground = createGround()
world.add(ground, 0)

const box = createBox({ size: 10 })
box.position.set(40, 5, 5)
box.userData.body = createRigidBody({ mesh: box, mass: 1, friction: 4, kinematic: true })
world.add(box)

const bigBall = createSphere({ r: 2 })
bigBall.position.set(0, 4, 0)
bigBall.userData.body = createRigidBody({ mesh: bigBall, mass: 1, friction: 4 })
bigBall.userData.body.setRollingFriction(10)
world.add(bigBall)

/* FUNCTIONS */

function moveBall() {
  const scalingFactor = 10

  const moveX = +Boolean(pressed.KeyD) - +Boolean(pressed.KeyA)
  const moveZ = +Boolean(pressed.KeyS) - +Boolean(pressed.KeyW)

  if (moveX == 0 && moveZ == 0) return

  const impulse = new Ammo.btVector3(moveX, 0, moveZ).op_mul(scalingFactor)

  bigBall.userData.body.setLinearVelocity(impulse)
}

function moveBox() {
  const scalingFactor = 0.3

  const moveX = +Boolean(pressed.ArrowRight) - +Boolean(pressed.ArrowLeft)
  const moveZ = +Boolean(pressed.ArrowDown) - +Boolean(pressed.ArrowUp)

  const target = new THREE.Vector3().set(moveX, 0, moveZ).multiplyScalar(scalingFactor)

  box.translateX(target.x)
  box.translateZ(target.z)
}

/* LOOP */

void function renderFrame() {
  requestAnimationFrame(renderFrame)
  const dt = clock.getDelta()
  moveBall()
  moveBox()
  world.update(dt)
  renderer.render(scene, camera)
}()

/* EVENTS */

window.addEventListener('mousedown', e => {
  const mouse = normalizeMouse(e)
  raycaster.setFromCamera(mouse, camera)

  const mesh = createSphere({ color: 0x666666 })
  mesh.position.copy(raycaster.ray.origin)
  world.add(mesh, 1)

  const target = new THREE.Vector3().copy(raycaster.ray.direction).multiplyScalar(100)
  mesh.userData.body.setLinearVelocity(new Ammo.btVector3(target.x, target.y, target.z))
})
