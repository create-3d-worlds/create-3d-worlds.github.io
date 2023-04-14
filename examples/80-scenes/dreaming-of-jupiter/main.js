import * as THREE from 'three'

import { camera, scene, renderer, clock, setBackground } from '/utils/scene.js'
import { createSphere } from '/utils/geometry.js'

import { createEarth, createSaturn, orbitAround, createRings } from '/utils/geometry/planets.js'
import { createTerrain, shake } from '/utils/ground.js'
import { Stars } from '/utils/classes/Particles.js'
import { createMoon } from '/utils/light.js'
import Avatar from '/utils/actor/Avatar.js'
import { sample, getShuffledCoords } from '/utils/helpers.js'

const { randInt } = THREE.MathUtils

setBackground(0x000000)

const mapSize = 400
const numPlanets = 30

const solids = []
const textures = ['jupiter.jpg', 'moon.jpg', 'saturn.jpg', 'venus.jpg', 'mars.jpg']

const coords = getShuffledCoords({ mapSize: mapSize / 2, emptyCenter: 30 })

for (let i = 0; i < numPlanets; i++) {
  const file = `planets/${sample(textures)}`
  const r = randInt(1.5, 3)
  const planet = Math.random() > .75 ? createRings(createSphere({ file, r })) : createSphere({ file, r })
  const pos = coords.pop()
  pos.y = r * randInt(1.5, 3)
  planet.position.copy(pos)
  solids.push(planet)
}

const earth = createEarth()
earth.position.set(0, 10, -20)

const saturn = createSaturn({ r: 5 })
saturn.position.set(-50, 3, -30)

const moon = createMoon({ file: 'planets/moon.jpg', r: 2 })
scene.add(moon)

const terrain = createTerrain({ size: mapSize, wireframe: true })

const stars = new Stars({ num: 1000 })
scene.add(stars.mesh)

solids.push(earth, saturn, terrain)
scene.add(...solids)

const player = new Avatar({ solids, camera, skin: 'DISCO' })
scene.add(player.mesh)

/* LOOP */

let time = 0

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()

  earth.rotation.y += 0.002
  moon.rotateY(-delta)

  orbitAround({ moon, planet: earth, time, radiusX: 15, radiusZ: 20 })

  shake({ geometry: terrain.geometry, time })
  stars.update()
  player.update(delta)

  time += 0.015
  renderer.render(scene, camera)
}()
