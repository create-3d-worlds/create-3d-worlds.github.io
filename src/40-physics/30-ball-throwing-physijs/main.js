import * as THREE from '/node_modules/three127/build/three.module.js'
import { renderer, camera } from '/utils/scene.js'
import { normalizeMouse } from '/utils/helpers.js'
import { ambLight, dirLight } from '/utils/light.js'
import { scene, createGround, createBall, createCrateWall } from '/utils/physics.js'

ambLight({ scene, color: 0x707070 })
dirLight({ scene })

camera.position.z = 15

const floor = createGround({ size: 50 })
scene.add(floor)

const crates = createCrateWall()
crates.forEach(crate => scene.add(crate))

const throwBall = ({ coords, scalar = 60 } = {}) => {
  const ball = createBall({ color: 0x202020 })
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(coords, camera)
  ball.position
    .copy(raycaster.ray.direction)
    .add(raycaster.ray.origin)

  scene.add(ball)

  const velocity = new THREE.Vector3()
  velocity
    .copy(raycaster.ray.direction)
    .multiplyScalar(scalar)
  ball.setLinearVelocity(velocity)
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  scene.simulate()
  camera.lookAt(scene.position)
  renderer.render(scene, camera)
}()

window.addEventListener('mousedown', e => {
  const coords = normalizeMouse(e)
  throwBall({ coords })
})
