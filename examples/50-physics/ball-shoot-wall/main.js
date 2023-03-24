import * as THREE from 'three'
import { Ammo, } from '/utils/physics.js'
import { scene, camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { normalizeMouse } from '/utils/helpers.js'
import input from '/utils/classes/Input.js'
import PhysicsWorld from '/utils/classes/PhysicsWorld.js'
import { createGround } from '/utils/ground.js'
import { createSphere, create4Walls } from '/utils/geometry.js'

const world = new PhysicsWorld()
const raycaster = new THREE.Raycaster()

const impulse = document.getElementById('impulse')
const minImpulse = impulse.min = impulse.value = 75
const maxImpulse = impulse.max = 150

createOrbitControls()
camera.position.set(-10, 1.5, 0)
camera.lookAt(10, 0, 0)

const sun = createSun({ position: [-5, 10, 5] })
scene.add(sun)

const ground = createGround({ size: 40, color: 0xFFFFFF })
world.add(ground, 0)

create4Walls().forEach(mesh => world.add(mesh))

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  if (input.pressed.mouse && impulse.value < maxImpulse)
    impulse.value = parseFloat(impulse.value) + 1
  const dt = clock.getDelta()
  world.update(dt)
  renderer.render(scene, camera)
}()

/* EVENTS */

window.addEventListener('pointerup', e => {
  const mouse = normalizeMouse(e)
  raycaster.setFromCamera(mouse, camera)

  const ball = createSphere({ r: .4, color: 0x202020 })
  ball.position.copy(raycaster.ray.origin)
  world.add(ball, 5)

  const force = new THREE.Vector3().copy(raycaster.ray.direction).multiplyScalar(impulse.value)
  ball.userData.body.applyImpulse(new Ammo.btVector3(force.x, force.y, force.z))
  impulse.value = minImpulse
})