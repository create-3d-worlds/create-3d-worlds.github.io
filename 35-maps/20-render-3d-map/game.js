import { scene, renderer, camera, createOrbitControls, hemLight } from '/utils/scene.js'
import { create3DMap } from '/utils/maps.js'
import { createGround } from '/utils/ground.js'
import matrix from '/data/small-map.js'

hemLight()

camera.position.z = 15
camera.position.y = 10

const controls = createOrbitControls()
scene.add(createGround({ file: 'ground.jpg' }))
scene.add(create3DMap(matrix))

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  controls.update()
  renderer.render(scene, camera)
}()
