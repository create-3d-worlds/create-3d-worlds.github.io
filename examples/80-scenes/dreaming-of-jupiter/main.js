import * as THREE from 'three'

import { camera, scene, renderer, clock, setBackground } from '/utils/scene.js'
import { createPlanet } from '/utils/geometry/planets.js'
import { createTerrain, shake } from '/utils/ground.js'
import { Stars } from '/utils/classes/Particles.js'
import { createMoon as createMoonLight } from '/utils/light.js'
import Avatar from '/utils/actor/Avatar.js'
import { getShuffledCoords } from '/utils/helpers.js'

const { randFloat } = THREE.MathUtils

setBackground(0x000000)
scene.add(createMoonLight())

const mapSize = 400
const numPlanets = 20

const planets = []

const coords = getShuffledCoords({ mapSize: mapSize / 2, fieldSize: 30 })

for (let i = 0; i < numPlanets; i++) {
  const pos = coords.pop()
  const r = randFloat(2, 5)
  pos.y = r * randFloat(1.5, 5)
  const planet = createPlanet({ pos, i })
  planets.push(planet)
}

const terrain = createTerrain({ size: mapSize, wireframe: true })
scene.add(terrain)

const stars = new Stars({ num: 10000 })
scene.add(stars.mesh)

scene.add(...planets)

const player = new Avatar({ solids: [...planets, terrain], camera, skin: 'DISCO' })
scene.add(player.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  const time = clock.getElapsedTime()

  planets.forEach(planet => {
    planet.rotateY(planet.userData.angleSpeed * delta)
    if (planet.material.uniforms?.time)
      planet.material.uniforms.time.value = time
    if (planet.userData.moon)
      planet.userData.moon.rotateY(planet.userData.angleSpeed * delta)
  })

  shake({ geometry: terrain.geometry, time })
  stars.update({ delta: delta * .1 })
  player.update(delta)

  renderer.render(scene, camera)
}()
