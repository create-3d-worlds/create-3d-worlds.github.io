import { camera, scene, renderer, clock, setBackground } from '/utils/scene.js'
import { createJupiter, createEarth, createSaturn, orbitAround } from '/utils/geometry/planets.js'
import { createTerrain, shake } from '/utils/ground.js'
import { Stars } from '/utils/classes/Particles.js'
import { createMoon } from '/utils/light.js'
import Avatar from '/utils/actor/Avatar.js'

const solids = []

setBackground(0x000000)

const earth = createEarth()
earth.position.set(60, 10, -30)

const saturn = createSaturn({ r: 5 })
saturn.position.set(-50, 3, -30)

const jupiter = createJupiter()
jupiter.position.set(0, 8, -20)

const moon = createMoon({ file: 'planets/moon.jpg', r: 2 })
scene.add(moon)

const terrain = createTerrain() // { colorParam: 'purple' }
terrain.material.wireframe = true

const stars = new Stars({ num: 1000 })
scene.add(stars.mesh)

solids.push(earth, saturn, jupiter, terrain)
scene.add(...solids)

const player = new Avatar({ solids, camera, skin: 'DISCO' })
scene.add(player.mesh)

/* LOOP */

let time = 0

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()

  jupiter.rotation.y += 0.002
  moon.rotateY(-delta)

  orbitAround({ moon, planet: jupiter, time, radiusX: 15, radiusZ: 20 })

  shake({ geometry: terrain.geometry, time })
  stars.update()
  player.update(delta)

  time += 0.015
  renderer.render(scene, camera)
}()
