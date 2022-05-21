import * as THREE from '/node_modules/three119/build/three.module.js'
import { scene, renderer, camera, createOrbitControls, createGradientSky, createSunLight } from '/utils/scene.js'
import { createTerrain } from '/utils/ground.js'
import { createFirTrees } from '/utils/trees.js'
import { cameraFollowObject } from '/utils/helpers.js'
import keyboard from '/classes/Keyboard.js'
import Airplane from '/classes/aircrafts/Airplane.js'
import { loadModel } from '/utils/loaders.js'

const terrain = createTerrain({ size: 8000, segments: 200 })
const trees = createFirTrees({ n: 500, mapSize: 4000, size: 25 })

scene.fog = new THREE.Fog(0xE5C5AB, 1, 5000)
scene.add(createGradientSky(), createSunLight(), terrain, trees)

const controls = createOrbitControls()

const { mesh } = await loadModel({ file: 's-e-5a/model.dae', size: .75, rot: { axis: [1, 0, 0], angle: -Math.PI / 20 }, shouldCenter: true, shouldAdjustHeight: true })
const avion = new Airplane({ mesh })
scene.add(avion.mesh)
avion.addSolids(terrain)

controls.target = avion.mesh.position
scene.getObjectByName('sunLight').target = avion.mesh

/* UPDATE */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  avion.update()
  if (!keyboard.pressed.mouse) cameraFollowObject(camera, avion.mesh)

  renderer.render(scene, camera)
}()
