/* global TWEEN */
/* metod kolizije: svakom drvetu se dodaje krug koji sluzi za koliziju */
import Avatar from '../classes/Avatar.js'
import {scene, renderer, camera, clock} from '../utils/3d-scene.js'
import {randomInRange} from '../utils/helpers.js'
import {createTree} from '../utils/3d-helpers.js'

const solids = []

const avatar = new Avatar(0, 0, 1)
scene.add(avatar.mesh)

camera.position.z = 500
avatar.add(camera)

/* INIT */

const coords = Array(5).fill().map(() => [randomInRange(-1000, 1000), randomInRange(-1000, 1000)])
coords.map(coord => {
  const tree = createTree(...coord, 200)
  scene.add(tree)
})

scene.traverse(child => {
  if (child.name == 'collider') solids.push(child)
})

void function animate() {
  requestAnimationFrame(animate)
  TWEEN.update()
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()

/* EVENTS */

document.addEventListener('keydown', event => {
  if (avatar.isCollide(solids)) avatar.respondCollision()
})
