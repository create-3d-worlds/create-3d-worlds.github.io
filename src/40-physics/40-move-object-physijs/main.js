import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'
import { camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { scene, createGround } from '/utils/physics.js'
import { dirLight, ambLight } from '/utils/light.js'
import keyboard from '/classes/Keyboard.js'

let ball
const forceAmount = 10

ambLight({ scene, color: 0x707070 })
dirLight({ scene, position: [-10, 18, 5] })

camera.position.set(0, 5, 10)
const controls = createOrbitControls()

const floor = createGround({ size: 50, friction: 1, bounciness: .3 })
scene.add(floor)

addBall(new THREE.Vector3(0, 5, 0))

function addBall(pos) {
  const geometry = new THREE.SphereGeometry(1, 32, 32)

  const friction = 0.8 // high friction
  const restitution = 0.8 // low restitution

  const material = Physijs.createMaterial(
    new THREE.MeshPhongMaterial({ color: 0xff0000 }),
    friction,
    restitution
  )

  ball = new Physijs.SphereMesh(geometry, material, 5)
  ball.position.copy(pos)
  ball.castShadow = true
  scene.add(ball)
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const deltaTime = clock.getDelta()
  controls.update(deltaTime)
  handleInput()
  scene.simulate()
  camera.lookAt(scene.position)
  renderer.render(scene, camera)
}()

/* EVENTS */

function handleInput() {
  const force = new THREE.Vector3(0, 0, 0)
  if (keyboard.up) force.z = -forceAmount

  if (keyboard.down) force.z = forceAmount

  if (keyboard.left) force.x = -forceAmount

  if (keyboard.right) force.x = forceAmount

  ball.applyCentralForce(force)
}

// ball.applyImpulse(movement, new THREE.Vector3(0, 1, 0)) zgodno za ispaljivanje
