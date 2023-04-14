import * as THREE from 'three'

import { camera, scene, renderer, clock, setBackground } from '/utils/scene.js'
import { createSphere } from '/utils/geometry.js'
import { createMoon, orbitAround, addRings } from '/utils/geometry/planets.js'
import { createTerrain, shake } from '/utils/ground.js'
import { Stars } from '/utils/classes/Particles.js'
import { createMoon as createMoonLight } from '/utils/light.js'
import Avatar from '/utils/actor/Avatar.js'
import { sample, getShuffledCoords } from '/utils/helpers.js'

const { randInt } = THREE.MathUtils

setBackground(0x000000)
scene.add(createMoonLight())

const textures = ['jupiter.jpg', 'saturn.jpg', 'venus.jpg', 'mars.jpg']
const mapSize = 400
const numPlanets = 30

const planets = []
const orbits = []

const coords = getShuffledCoords({ mapSize: mapSize / 2, fieldSize: 30 })

for (let i = 0; i < numPlanets; i++) {
  const file = `planets/${sample(textures)}`
  const r = randInt(2, 4)
  const planet = createSphere({ file, r })
  const pos = coords.pop()
  pos.y = r * randInt(1.5, 3)
  planet.position.copy(pos)
  planet.userData.angleSpeed = randInt(-.5, .5)
  planets.push(planet)

  if (r > 3 && Math.random() > .5) {
    const moon = createMoon({ r: r * .33 })
    moon.userData.angleSpeed = randInt(-1, 1)
    planets.push(moon)
    const factor = randInt(.5, 1.5)
    const orbit = time => orbitAround({ moon, planet, time: time * factor, radiusX: r * 2 })
    orbits.push(orbit)
  } else if (Math.random() > .75)
    addRings(planet)
}

const terrain = createTerrain({ size: mapSize, wireframe: true })
scene.add(terrain)

const stars = new Stars({ num: 10000 })
scene.add(stars.mesh)

scene.add(...planets)

const player = new Avatar({ solids: [...planets, terrain], camera, skin: 'DISCO' })
scene.add(player.mesh)

/* LOOP */

let time = 0

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()

  planets.forEach(planet => planet.rotateY(planet.userData.angleSpeed * delta))
  orbits.forEach(orbit => orbit(time))

  shake({ geometry: terrain.geometry, time })
  stars.update({ delta: delta * .01 })
  player.update(delta)

  time += 0.015
  renderer.render(scene, camera)
}()
