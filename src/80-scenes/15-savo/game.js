import { createGround } from '/utils/ground.js'
import { randomMatrix } from '/utils/maps.js'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import FPSRenderer from '/classes/2d/FPSRenderer.js'
import Map2DRenderer from '/classes/2d/Map2DRenderer.js'
import Savo from '/classes/Savo.js'
import Tilemap from '/classes/Tilemap.js'
import { hemLight } from '/utils/light.js'
import { createRain, addVelocity, updateRain } from '/utils/particles.js'

hemLight()

camera.position.y = 2
camera.position.z = 1
const fpsRenderer = new FPSRenderer()

const matrix = randomMatrix()
const map = new Tilemap(matrix, 20)
const smallMap = new Tilemap(matrix, 20)
const smallMapRenderer = new Map2DRenderer(smallMap)

scene.add(createGround({ file: 'ground.jpg' }))
const walls = map.create3DMap({ yModifier: 0.5 })
scene.add(walls)

const player = new Savo()
const { x, z } = map.randomEmptyPos
player.mesh.position.set(x, 0, z)
player.add(camera)
player.addSolids(walls)
scene.add(player.mesh)

const rain = createRain()
addVelocity({ particles: rain, min: 0.5, max: 3 })
scene.add(rain)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  const time = clock.getElapsedTime()

  player.update(delta)
  updateRain({ particles: rain, minY: 0, maxY: 200 })

  smallMapRenderer.render(player, map)
  fpsRenderer.render(time)
  renderer.render(scene, camera)
}()
