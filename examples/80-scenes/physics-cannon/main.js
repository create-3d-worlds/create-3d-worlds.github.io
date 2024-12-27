import { scene, camera, renderer, clock } from '/core/scene.js'
import { createSun } from '/core/light.js'
import PhysicsWorld from '/core/physics/PhysicsWorld.js'
import { createGround } from '/core/ground.js'
import { createSideWall } from '/core/geometry/index.js'

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
  gui?.addScore(valid.length - countableCrates.length)
  countableCrates = valid

  if (!countableCrates.length)
    gui.renderText('Bravo!<br>You demolished everything.')

  renderer.render(scene, camera)
}()

/* LAZY LOAD */

const cannonFile = await import('/core/physics/Cannon.js')
cannon = new cannonFile.default({ world, camera })
scene.add(cannon.mesh, ...cannon.wheelMeshes)

const GUI = await import('/core/io/GUI.js')
const controls = {
  'Pointer down': 'add force',
  'Pointer up': 'shoot'
}
gui = new GUI.default({ scoreTitle: 'Blocks left', points: countableCrates.length, controls })

gui.showMessage('Demolish all blocks')