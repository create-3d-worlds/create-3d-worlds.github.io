import { createFloor } from '/utils/floor.js'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import matrix from '/data/small-map.js'
import Canvas from '/classes/2d/Canvas.js'
import Player from '/classes/Player.js'
import Tilemap3D from '/classes/Tilemap3D.js'

const canvas = new Canvas('transparent')

const map = new Tilemap3D(matrix, 100)
scene.add(createFloor())
const walls = map.createWalls()
scene.add(walls)

camera.position.y = 10
camera.position.z = 5

const player = new Player(120, 0, 90, 10, true)
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
  canvas.drawTarget('/assets/images/crosshair.png', time)
  canvas.drawWeapon('/assets/images/savo.png', time)
  canvas.renderMap(matrix, 20)
  canvas.renderPlayerFrom3D(player, map)
  renderer.render(scene, camera)
}()
