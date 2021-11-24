import {scene, renderer, camera, clock} from '/utils/scene-day.js'
import {PlayerAvatar} from '/classes/Player.js'
import Tilemap from '/classes/Tilemap.js'
import {nemesis as matrix} from '/data/maps.js'
import { createFloor } from '/utils/floor.js'

const map = new Tilemap(matrix, 100)
scene.add(createFloor())
const walls = map.create3DMap()
scene.add(walls)

const player = new PlayerAvatar(100, 0, 100, 15)
scene.add(player.mesh)
player.addSolids(walls)

camera.position.z = 50
camera.position.y = 15
player.add(camera)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
