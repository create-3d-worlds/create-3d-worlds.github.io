import * as THREE from 'three'
import { Ammo } from '/utils/physics/index.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import input from '/utils/io/Input.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import PhysicsWorld from '/utils/physics/PhysicsWorld.js'
import { createGround } from '/utils/ground.js'
import { createSphere, createSideWall } from '/utils/geometry.js'
import Vehicle from '/utils/physics/Vehicle.js'

const world = new PhysicsWorld()

const impulse = document.getElementById('impulse')
const minImpulse = impulse.value = 15
const maxImpulse = 25

const sun = createSun({ pos: [-5, 10, 5] })
scene.add(sun)

const ground = createGround({ size: 40 })
world.add(ground)

createSideWall({ brickMass: 3, friction: 5, z: 7 }).forEach(mesh => world.add(mesh, -1))

const mesh = await loadModel({ file: 'weapon/cannon/mortar/mortar.obj', mtl: 'weapon/cannon/mortar/mortar.mtl', size: 1, angle: Math.PI * .5 })

const cannon = new Vehicle({ physicsWorld: world.physicsWorld, mesh, defaultRadius: .18, wheelFront: { x: .3, y: .12, z: .32 }, wheelBack: { x: .3, y: .18, z: -.56 }, maxEngineForce: 20, mass: 100, camera })
cannon.chaseCamera.offset = [0, 1, -2.5]
cannon.chaseCamera.lookAt = [0, 1, 0]

scene.add(mesh, ...cannon.wheelMeshes)

/* FUNCTIONS */

function shoot() {
  const angle = mesh.rotation.y // + Math.PI * .5
  const x = impulse.value * Math.sin(angle)
  const z = impulse.value * Math.cos(angle)

  const distance = .7
  const cannonTop = new THREE.Vector3(distance * Math.sin(angle), 0, distance * Math.cos(angle))

  const pos = mesh.position.clone()
  pos.y += 0.5
  pos.add(cannonTop)

  const ball = createSphere({ r: .2, color: 0x202020 })
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
  cannon.update(dt)
  world.update(dt)
  renderer.render(scene, camera)
}()

/* EVENTS */

document.addEventListener('mouseup', shoot)