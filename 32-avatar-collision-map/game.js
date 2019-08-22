import {scene, renderer, camera, clock} from '../utils/scene.js'
import Avatar from '../classes/Avatar.js'
import Tilemap3D from '../classes/Tilemap3D.js'
import {nemesis as map} from '../data/maps.js'

const tilemap = new Tilemap3D(map, 100)
scene.add(tilemap.createFloor())
const walls = tilemap.createWalls()
scene.add(walls)

const avatar = new Avatar(25, 0, 25, 15)
scene.add(avatar.mesh)
avatar.addSurrounding(walls)

camera.position.z = 50
camera.position.y = 15
avatar.add(camera)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
