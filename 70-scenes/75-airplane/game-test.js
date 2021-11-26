import { createFullScene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { createTerrain } from '/utils/ground.js'
import { cameraFollowObject } from '/utils/helpers.js'
import keyboard from '/classes/Keyboard.js'
import Airplane from './Airplane.js'

const scene = createFullScene({ color:0xFFC880 }, undefined, undefined, { color: 0xE5C5AB })
scene.add(createTerrain(4000, 200))

const controls = createOrbitControls()

const player = new Airplane(() => {
  scene.add(player.mesh)
  controls.target = player.mesh.position
  scene.getObjectByName('sunLight').target = player.mesh
})

/* UPDATE */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  player.update()
  if (!keyboard.mouseDown)
    cameraFollowObject(camera, player.mesh)
  renderer.render(scene, camera)
}()
