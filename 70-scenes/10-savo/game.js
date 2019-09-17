import { createFloor } from '/utils/floor.js'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import matrix from '/data/small-map.js'
import Canvas from '/classes/2d/Canvas.js'
import Player from '/classes/Player.js'
import Tilemap3D from '/classes/Tilemap3D.js'

const canvas = new Canvas('transparent')
canvas.drawTarget('/assets/images/crosshair.png')
// document.addEventListener('click', () => canvas.requestPointerLock())

const map = new Tilemap3D(matrix, 100)
scene.add(createFloor())
const walls = map.createWalls()
scene.add(walls)

camera.position.y = 10
camera.position.z = 5

const player = new Player(25, 0, 25, 10, true)
scene.add(player.mesh)
player.add(camera)
player.addSolids(walls)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  player.update(delta)
  canvas.renderMap(matrix, 20)
  canvas.renderPlayerFrom3D(player, map)
  canvas.drawFirstPerson('/assets/images/savo.png')
  renderer.render(scene, camera)
}()
