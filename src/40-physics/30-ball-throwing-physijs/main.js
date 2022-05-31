import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'
import { renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import { normalizeMouse } from '/utils/helpers.js'
import { ambLight, dirLight } from '/utils/light.js'
import { createGround, createBall, createCrateWall } from '/utils/physics.js'

const scene = new Physijs.Scene
scene.setGravity({ x: 0, y: -10, z: 0 })

ambLight({ scene, color: 0x707070 })
dirLight({ scene })

camera.position.z = 20
camera.position.y = 5

const controls = createOrbitControls()

const floor = createGround({ size: 50 })
scene.add(floor)

const crates = createCrateWall()
crates.forEach(crate => scene.add(crate))

const throwBall = ({ coords, scalar = 60 } = {}) => {
  const ball = createBall()
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(coords, camera)
  ball.position.copy(raycaster.ray.direction).add(raycaster.ray.origin)

  scene.add(ball)

  const velocity = new THREE.Vector3()
  velocity.copy(raycaster.ray.direction).multiplyScalar(scalar)
  ball.setLinearVelocity(velocity)
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const deltaTime = clock.getDelta()
  controls.update(deltaTime)
  scene.simulate()
  camera.lookAt(scene.position)
  renderer.render(scene, camera)
}()

window.addEventListener('mousedown', e => {
  const coords = normalizeMouse(e)
  throwBall({ coords })
})
