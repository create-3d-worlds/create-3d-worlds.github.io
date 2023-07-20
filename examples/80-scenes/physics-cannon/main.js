import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import PhysicsWorld from '/utils/physics/PhysicsWorld.js'
import { createGround } from '/utils/ground.js'
import { createSideWall } from '/utils/geometry/index.js'

let gui, cannon

const world = new PhysicsWorld()

const sun = createSun({ pos: [-5, 10, 5] })
scene.add(sun)

const ground = createGround({ size: 40 })
world.add(ground, 0)

const boxes = createSideWall({ brickMass: 3, friction: 5, z: 7 })
boxes.forEach(mesh => world.add(mesh))
let countableCrates = boxes.filter(mesh => mesh.position.y > .5)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()
  cannon?.update(dt)
  world.update(dt)

  const valid = countableCrates.filter(mesh => mesh.position.y > .5)
  gui?.update(valid.length - countableCrates.length)
  countableCrates = valid

  if (!countableCrates.length)
    gui.renderText('Bravo!<br>You demolished everything.')

  renderer.render(scene, camera)
}()

/* LAZY LOAD */

const cannonFile = await import('/utils/physics/Cannon.js')
cannon = new cannonFile.default({ world, camera })
scene.add(cannon.mesh, ...cannon.wheelMeshes)

const scoreFile = await import('/utils/io/GUI.js')
gui = new scoreFile.default({ title: 'Blocks left', points: countableCrates.length })