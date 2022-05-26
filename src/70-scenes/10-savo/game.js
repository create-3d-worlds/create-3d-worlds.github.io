import { createGround } from '/utils/ground.js'
import { randomMatrix } from '/utils/maps.js'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import FirstPersonRenderer from '/classes/2d/FirstPersonRenderer.js'
import Map2DRenderer from '/classes/2d/Map2DRenderer.js'
import Player from '/classes/Player.js'
import Tilemap from '/classes/Tilemap.js'
import { hemLight } from '/utils/light.js'

hemLight()
camera.position.y = 10
camera.position.z = 5
const fpsRenderer = new FirstPersonRenderer()

const matrix = randomMatrix()
const map = new Tilemap(matrix, 80, { x: -400, z: -400 })
const smallMap = new Tilemap(matrix, 20)
const smallMapRenderer = new Map2DRenderer(smallMap)

scene.add(createGround({ file: 'ground.jpg' }))
const walls = map.create3DMap({ yModifier: 0.5 })
scene.add(walls)

const { x, z } = map.randomEmptyPos
const player = new Player({ x, z, speed: 20, transparent: true, cameraFollow: false })
player.add(camera)
player.addSolids(walls)
scene.add(player.mesh)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  const time = clock.getElapsedTime()
  player.update(delta)
  renderer.render(scene, camera)
  smallMapRenderer.render(player, map)
  fpsRenderer.render(time)
}()
