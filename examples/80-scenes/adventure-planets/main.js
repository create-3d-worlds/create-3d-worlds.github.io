import { camera, scene, renderer, clock, setBackground } from '/utils/scene.js'
import { Planet } from '/utils/geometry/planets.js'
import { createTerrain, shake } from '/utils/ground.js'
import { Stars } from '/utils/Particles.js'
import { createMoon } from '/utils/light.js'
import { getEmptyCoords } from '/utils/helpers.js'
import Avatar from '/utils/actor/Avatar.js'
import Platform from '/utils/objects/Platform.js'

setBackground(0x000000)
scene.add(createMoon())

const objects = []
const mapSize = 400
const coords = getEmptyCoords({ mapSize: mapSize / 2, fieldSize: 30 })

coords.forEach((pos, i) => {
  pos.y = Math.random() * 10 + 5
  const planet = Math.random() > .25 ? new Planet({ pos, i }) : new Platform({ pos })
  objects.push(planet)
  scene.add(planet.mesh)
})

const terrain = createTerrain({ size: mapSize, wireframe: true })
scene.add(terrain)

const stars = new Stars({ num: 10000 })
scene.add(stars.mesh)

const solids = [...objects.map(o => o.mesh), terrain]
const player = new Avatar({ solids, camera, skin: 'DISCO', showHealthBar: false })
scene.add(player.mesh)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  const time = clock.getElapsedTime()

  objects.forEach(planet => planet.update(delta))

  shake({ geometry: terrain.geometry, time })
  stars.update({ delta: delta * .1 })
  player.update()

  renderer.render(scene, camera)
}()
