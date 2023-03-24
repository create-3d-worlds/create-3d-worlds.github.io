import * as THREE from 'three'
import { Ammo } from '/utils/physics.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import input from '/utils/classes/Input.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import PhysicsWorld from '/utils/classes/PhysicsWorld.js'
import { createGround } from '/utils/ground.js'
import { createSphere, createSideWall } from '/utils/geometry.js'
import Vehicle from '/utils/classes/Vehicle.js'
import VehicleCamera from '/utils/classes/VehicleCamera.js'

const world = new PhysicsWorld()

const impulse = document.getElementById('impulse')
const minImpulse = impulse.value = 15
const maxImpulse = 25

const cameraFollow = new VehicleCamera({ camera, offsetCamera: [0, 1, -3], lookatCamera: [0, 2, 4] })

const sun = createSun({ position: [-5, 10, 5] })
scene.add(sun)

const ground = createGround({ size: 40, color: 0x509f53 })
world.add(ground, 0)

createSideWall({ brickMass: 3, friction: 5, z: 7 }).forEach(mesh => world.add(mesh))

const { mesh: chassisMesh } = await loadModel({ file: 'weapon/cannon/mortar/mortar.obj', mtl: 'weapon/cannon/mortar/mortar.mtl', size: 1, angle: Math.PI * .5 })

const wheelFront = { x: .3, y: .12, z: .32 }
const wheelBack = { x: .3, y: .18, z: -.56 }
const cannon = new Vehicle({ physicsWorld: world.physicsWorld, chassisMesh, defaultRadius: .18, wheelFront, wheelBack, maxEngineForce: 20, mass: 100 })
scene.add(chassisMesh, ...cannon.wheelMeshes)

/* FUNCTIONS */

function shoot() {
  const angle = chassisMesh.rotation.y // + Math.PI * .5
  const x = impulse.value * Math.sin(angle)
  const z = impulse.value * Math.cos(angle)

  const distance = .7
  const cannonTop = new THREE.Vector3(distance * Math.sin(angle), 0, distance * Math.cos(angle))

  const pos = chassisMesh.position.clone()
  pos.y += 0.9
  pos.add(cannonTop)

  const ball = createSphere({ r: .22, color: 0x202020 })
  ball.position.copy(pos)
  world.add(ball, 4)

  ball.userData.body.setLinearVelocity(new Ammo.btVector3(x, impulse.value * .2, z))
  cannon.backward(impulse.value)
  impulse.value = minImpulse
}

function handleInput() {
  if ((input.pressed.mouse) && impulse.value < maxImpulse)
    impulse.value = parseFloat(impulse.value) + .2
}

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()
  handleInput()
  cannon.update()
  cannon.break(.5)
  cameraFollow.update(chassisMesh)
  world.update(dt)
  renderer.render(scene, camera)
}()

/* EVENTS */

document.addEventListener('mouseup', shoot)