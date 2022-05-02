import * as THREE from '/node_modules/three108/build/three.module.js'

import { scene, renderer, camera, createOrbitControls, createGradientSky, createSunLight } from '/utils/scene.js'
import { createTerrain } from '/utils/ground/index.js'
import { createFirTrees } from '/utils/trees.js'
import { cameraFollowObject } from '/utils/helpers.js'
import keyboard from '/classes/Keyboard.js'
import Airplane from '/classes/Airplane.js'

const terrain = createTerrain({ size: 8000, segments:200 })
const trees = createFirTrees(500, 4000, 25)

scene.fog = new THREE.Fog(0xE5C5AB, 1, 5000)
scene.add(createGradientSky(), createSunLight(), terrain, trees)

const controls = createOrbitControls()

const avion = new Airplane(() => {
  scene.add(avion.mesh)
  controls.target = avion.mesh.position
  scene.getObjectByName('sunLight').target = avion.mesh
  avion.addSolids(terrain)
})

/* UPDATE */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  avion.update()
  if (!keyboard.mouseDown) cameraFollowObject(camera, avion.mesh)

  renderer.render(scene, camera)
}()
