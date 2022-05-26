import { createWorldScene, renderer, camera, clock } from '/utils/scene.js'
import Avatar from '/classes/Avatar.js'
import Tilemap from '/classes/Tilemap.js'
import { nemesis } from '/data/maps.js'

const scene = createWorldScene({ file: 'ground.jpg' })
const map = new Tilemap(nemesis, 10)
const walls = map.create3DMap()
scene.add(walls)

const player = new Avatar()
scene.add(player.mesh)
player.addSolids(walls)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
