import { createFloor } from '/utils/floor.js'
import { createMap } from '/utils/boxes.js'
import { scene, renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import matrix from '/data/small-map.js'
import Canvas from '/classes/2d/Canvas.js'
import Player from '/classes/Player.js'

createOrbitControls() // ne radi sa kanvasom??

const canvas = new Canvas('transparent')
canvas.renderMap(matrix, 30)
canvas.drawFirstPerson(document.getElementById('savo'))

const floor = createFloor()
scene.add(floor)
const walls = createMap(matrix, 20)
scene.add(walls)

camera.position.y = 15
camera.position.z = 5

const avatar = new Player(25, 0, 25, 10, true)
scene.add(avatar.mesh)
avatar.mesh.add(camera)
avatar.addSolids(walls)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  renderer.render(scene, camera)
}()
