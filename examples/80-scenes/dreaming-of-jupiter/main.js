import { camera, scene, renderer, clock, setBackground } from '/utils/scene.js'
import { createPlanet } from '/utils/geometry/planets.js'
import { createTerrain, shake } from '/utils/ground.js'
import { Stars } from '/utils/classes/Particles.js'
import { createMoon as createMoonLight } from '/utils/light.js'
import { getShuffledCoords } from '/utils/helpers.js'
import Avatar from '/utils/actor/Avatar.js'
import Platform from '/utils/classes/Platform.js'

setBackground(0x000000)
scene.add(createMoonLight())

const planets = []
const mapSize = 400
const numPlanets = 20
const coords = getShuffledCoords({ mapSize: mapSize / 2, fieldSize: 30 })

const platform = new Platform()
scene.add(platform.mesh)

for (let i = 0; i < numPlanets; i++) {
  const pos = coords.pop()
  pos.y = Math.random() * 10 + 5
  const planet = createPlanet({ pos, i })
  planets.push(planet)
}

const terrain = createTerrain({ size: mapSize, wireframe: true })
scene.add(terrain)

const stars = new Stars({ num: 10000 })
scene.add(stars.mesh)

const player = new Avatar({ solids: [...planets, terrain, platform.mesh], camera, skin: 'DISCO' })
scene.add(player.mesh)

scene.add(...planets)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  const time = clock.getElapsedTime()

  planets.forEach(planet => {
    const { angleSpeed, moon } = planet.userData
    planet.rotateY(angleSpeed * delta)
    if (moon) moon.rotateY(angleSpeed * delta)
    if (planet.material.uniforms)
      planet.material.uniforms.time.value = time
  })

  shake({ geometry: terrain.geometry, time })
  stars.update({ delta: delta * .1 })
  player.update()
  platform.update(delta)

  renderer.render(scene, camera)
}()
