import { createFloor } from '/utils/floor.js'
import { randomMatrix } from '/utils/maps.js'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import Canvas from '/classes/2d/Canvas.js'
import Player from '/classes/Player.js'
import Tilemap from '/classes/Tilemap.js'

const canvas = new Canvas('transparent')
const matrix = randomMatrix()

const smallMap = new Tilemap(matrix, 20)
const map = new Tilemap(matrix, 100, {x: -500, z: -500})

scene.add(createFloor())
const walls = map.create3DMap(0.5)
scene.add(walls)

camera.position.y = 10
camera.position.z = 5

const player = new Player(0, 0, 0, 10, true)
scene.add(player.mesh)
player.add(camera)
player.addSolids(walls)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  const time = clock.getElapsedTime()
  player.update(delta)
  canvas.clear()
  canvas.drawWeapon('/assets/images/savo.png', time)
  canvas.drawTarget('/assets/images/crosshair.png', time)
  canvas.drawMap(matrix, smallMap.cellSize)
  canvas.draw3DPlayerOnMap(player, map, smallMap)
  renderer.render(scene, camera)
}()
