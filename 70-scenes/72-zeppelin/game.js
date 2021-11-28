import * as THREE from '/node_modules/three108/build/three.module.js'
import { createFullScene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { createTerrain } from '/utils/ground.js'
import { cameraFollowObject } from '/utils/helpers.js'
import keyboard from '/classes/Keyboard.js'
import Zeppelin from '/classes/Zeppelin.js'
import { drawAxes } from '/utils/drawAxes.js'

const scene = createFullScene({ color:0xFFC880 }, undefined, undefined, { color: 0xE5C5AB })
// scene.add(createTerrain(4000, 200))

const hemisphereLight = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75)
hemisphereLight.position.set(0.5, 1, 0.75)
scene.add(hemisphereLight) // puca procedural terrain
drawAxes(scene)

const controls = createOrbitControls()

const zeppelin = new Zeppelin(() => {
  scene.add(zeppelin.mesh)
  // controls.target = zeppelin.mesh.position
  scene.getObjectByName('sunLight').target = zeppelin.mesh
})

/* UPDATE */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  zeppelin.update()
  // if (!keyboard.mouseDown)
  //   cameraFollowObject(camera, zeppelin.mesh, 100)

  renderer.render(scene, camera)
}()
