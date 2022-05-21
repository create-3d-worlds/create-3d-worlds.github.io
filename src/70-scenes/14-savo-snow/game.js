import { createGround } from '/utils/ground.js'
import { randomMatrix } from '/utils/maps.js'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import FirstPersonRenderer from '/classes/2d/FirstPersonRenderer.js'
import Map2DRenderer from '/classes/2d/Map2DRenderer.js'
import Player from '/classes/Player.js'
import Tilemap from '/classes/Tilemap.js'
import { hemLight } from '/utils/light.js'
import { createSnow, addVelocity, updateRain } from '/utils/particles.js'

hemLight({ intensity: 1.2 })

camera.position.y = 10
camera.position.z = 5
const fpsRenderer = new FirstPersonRenderer()

const matrix = randomMatrix()
const map = new Tilemap(matrix, 80)
const smallMap = new Tilemap(matrix, 20)
const smallMapRenderer = new Map2DRenderer(smallMap)
smallMapRenderer.hide()

scene.add(createGround(1000, 'snow-512.jpg'))
const walls = map.create3DMap({ yModifier: 0.5 })
scene.add(walls)

const { x, z } = map.randomEmptyPos
const player = new Player({ x, z, speed: 20, transparent: true })
player.add(camera)
player.addSolids(walls)
scene.add(player.mesh)

const snow = createSnow()
scene.add(snow)

addVelocity({ particles: snow, min: 0.5, max: 3 })

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  const time = clock.getElapsedTime()
  player.update(delta)
  updateRain({ particles: snow, minY: -1000, maxY: 300 })
  snow.rotateY(.003)
  renderer.render(scene, camera)
  smallMapRenderer.render(player, map)
  fpsRenderer.render(time)
}()
