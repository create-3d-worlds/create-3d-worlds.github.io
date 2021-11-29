import * as THREE from '/node_modules/three108/build/three.module.js'
import { createFullScene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import Zeppelin from '/classes/Zeppelin.js'
import { drawAxes } from '/utils/drawAxes.js'

const scene = createFullScene({ color:0xFFC880 }, undefined, undefined, { color: 0xE5C5AB })

drawAxes(scene)

const controls = createOrbitControls()

const zeppelin = new Zeppelin(() => {
  scene.add(zeppelin.mesh)
})

/* UPDATE */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  zeppelin.update()

  renderer.render(scene, camera)
}()
