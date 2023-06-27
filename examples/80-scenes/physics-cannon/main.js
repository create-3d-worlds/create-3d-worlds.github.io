import * as THREE from 'three'
import { Ammo } from '/utils/physics/index.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import input from '/utils/io/Input.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import PhysicsWorld from '/utils/physics/PhysicsWorld.js'
import { createGround } from '/utils/ground.js'
import { createSphere, createSideWall } from '/utils/geometry/index.js'
import Cannon from '/utils/physics/Cannon.js'

let score

const world = new PhysicsWorld()
const impulse = document.getElementById('impulse')
const minImpulse = impulse.value = 15
const maxImpulse = 25

const sun = createSun({ pos: [-5, 10, 5] })
scene.add(sun)

const ground = createGround({ size: 40 })
world.add(ground)

const boxes = createSideWall({ brickMass: 3, friction: 5, z: 7 })
boxes.forEach(mesh => world.add(mesh, -1))
let countableCrates = boxes.filter(mesh => mesh.position.y > .5)

const cannon = new Cannon({ physicsWorld: world.physicsWorld, camera})
scene.add(cannon.mesh, ...cannon.wheelMeshes)

/* FUNCTIONS */

function shoot() {
  const angle = cannon.mesh.rotation.y // + Math.PI * .5
  const x = impulse.value * Math.sin(angle)
  const z = impulse.value * Math.cos(angle)

  const distance = .7
  const cannonTop = new THREE.Vector3(distance * Math.sin(angle), 0, distance * Math.cos(angle))

  const pos = cannon.mesh.position.clone()
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
  if (input.pressed.mouse && impulse.value < maxImpulse)
    impulse.value = parseFloat(impulse.value) + .2
}

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()
  handleInput()
  cannon.update(dt)
  world.update(dt)

  const valid = countableCrates.filter(mesh => mesh.position.y > .5)
  score?.update(valid.length - countableCrates.length)
  countableCrates = valid

  if (!countableCrates.length)
    score.renderText('Bravo!<br>You demolished everything.')

  renderer.render(scene, camera)
}()

/* EVENTS */

document.addEventListener('mouseup', shoot)

/* LAZY LOAD */

const scoreFile = await import('/utils/io/Score.js')
score = new scoreFile.default({ title: 'Blocks left', points: countableCrates.length })