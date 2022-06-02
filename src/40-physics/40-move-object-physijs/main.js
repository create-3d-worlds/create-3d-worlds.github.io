import * as THREE from '/node_modules/three127/build/three.module.js'
import { camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { scene, createGround, createBall } from '/utils/physics.js'
import { dirLight, ambLight } from '/utils/light.js'
import keyboard from '/classes/Keyboard.js'

const forceAmount = 10

ambLight({ scene, color: 0x707070 })
dirLight({ scene, position: [-10, 18, 5] })

camera.position.set(0, 5, 10)
const controls = createOrbitControls()

const floor = createGround({ size: 50, friction: 1, bounciness: .3 })
scene.add(floor)

const ball = createBall({ size: 1, color: 0xff0000, mass: 5 })
ball.position.set(0, 2, 0)
scene.add(ball)

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

  ball.applyCentralForce(force) // ball.applyImpulse(force, new THREE.Vector3(0, 1, 0))
}
