import { createGround } from '/utils/ground/index.js'
import { create3DMap } from '/utils/maps.js'
import { scene, renderer, camera, clock, hemLight } from '/utils/scene.js'
import { PlayerAvatar } from '/classes/Player.js'
import matrix from '/data/small-map.js'

hemLight()

const avatar = new PlayerAvatar(25, 0, 25, 10, 2)
const floor = createGround({ file: 'ground.jpg' })
const walls = create3DMap(matrix, 20)

scene.add(avatar.mesh, floor, walls)

camera.position.z = 20
camera.position.y = 15

avatar.mesh.add(camera)
avatar.addSolids(walls)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
