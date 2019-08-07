import { scene, renderer, camera, clock } from '../utils/three-scene.js'
import Avatar from '../classes/Avatar.js'
import Tilemap3D from '../classes/Tilemap3D.js'
import { nemesis as map } from '../data/maps.js'

const tilemap = new Tilemap3D(map, 100)
scene.add(tilemap.createFloor())
const walls = tilemap.createWalls()
scene.add(walls)

const avatar = new Avatar(25, 25, 0.1)
scene.add(avatar.mesh)

camera.position.z = 100
avatar.mesh.add(camera)

const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75)
scene.add(light)

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta, walls.children)
  renderer.render(scene, camera)
}()
