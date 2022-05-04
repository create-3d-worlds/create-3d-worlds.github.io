import { createWorld, renderer, camera, clock } from '/utils/scene.js'
import { PlayerAvatar } from '/classes/Player.js'
import Tilemap from '/classes/Tilemap.js'
import { nemesis } from '/data/maps.js'

const scene = createWorld({ file: 'ground.jpg' })
const map = new Tilemap(nemesis, 100)
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
