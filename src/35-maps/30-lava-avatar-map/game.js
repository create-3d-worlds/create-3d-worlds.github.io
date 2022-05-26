import { createGround } from '/utils/ground.js'
import { create3DMap } from '/utils/maps.js'
import { scene, renderer, camera, clock } from '/utils/scene.js'
import Avatar from '/classes/Avatar.js'
import matrix from '/data/small-map.js'
import { hemLight } from '/utils/light.js'

hemLight()

const avatar = new Avatar({ size: 1, skin: 'lava' })
avatar.position.set(12, 0, 12)

const floor = createGround({ file: 'ground.jpg' })
const walls = create3DMap({ matrix, size: 4 })

scene.add(avatar.mesh, floor, walls)

avatar.addSolids(walls)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
