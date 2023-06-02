import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { getHeightData } from '/utils/terrain/heightmap.js'
import { createTerrain } from '/utils/physics/index.js'
import { createSphere, createTremplin } from '/utils/geometry.js'
import PhysicsWorld from '/utils/physics/PhysicsWorld.js'
import Humvee from '/utils/physics/Humvee.js'

scene.add(createSun({ planetColor: 0xB0E0E6 }))

const world = new PhysicsWorld()

const { data, width, depth } = await getHeightData('/assets/heightmaps/wiki.png', 5)
const terrain = await createTerrain({ data, width, depth, minHeight: -2, maxHeight: 16 })
world.add(terrain)

const tremplin = createTremplin({ color: 0xfffacd })
tremplin.position.set(-10, -4.5, 20)
world.add(tremplin, 0)

for (let i = 0; i < 3; i++) {
  const ball = createSphere({ color: 0xfffacd })
  ball.position.set(5 * Math.random(), 0, -20 * Math.random())
  world.add(ball, 1000)
}

/* VEHICLE */

const vehicle = new Humvee({ camera, physicsWorld: world.physicsWorld })
scene.add(vehicle.mesh, ...vehicle.wheelMeshes)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const dt = clock.getDelta()
  vehicle.update(dt)
  world.update(dt)
  renderer.render(scene, camera)
}()
