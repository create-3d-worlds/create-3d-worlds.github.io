import { scene, renderer, camera, createOrbitControls, hemLight } from '/utils/scene.js'
import { create3DMap } from '/utils/maps.js'
import { createGround } from '/utils/ground.js'
import matrix from '/data/small-map.js'

hemLight()

camera.position.z = 10
camera.position.y = 7

const controls = createOrbitControls()
scene.add(createGround({ file: 'ground.jpg' }))

const map = create3DMap({ matrix, size: 1 })
scene.add(map)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  controls.update()
  renderer.render(scene, camera)
}()
