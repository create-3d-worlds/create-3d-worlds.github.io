import * as THREE from '/node_modules/three119/build/three.module.js'
import { OrbitControls } from '/node_modules/three119/examples/jsm/controls/OrbitControls.js'

import { scene, renderer, camera, clock } from '/utils/scene.js'
import ground from './actors/ground.js'
import Avion from './actors/Avion.js'
import { createSunLight } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'

scene.fog = new THREE.Fog(0xE5C5AB, 200, 950)

scene.add(
  new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .9),
  createSunLight({ x: 150, y: 350, z: -150 })
)

camera.position.set(-68, 143, -90)

const controls = new OrbitControls(camera, renderer.domElement)

const { mesh, animations, mixer } = await loadModel({ file: '/aircraft-messerschmitt-109/scene.gltf', rot: { angle: -Math.PI * .5, axis: [0, 1, 0] } })
mesh.rotateX(Math.PI * .1)

// const { mesh, animations, mixer } = await loadModel({ file: '/me-109/model.dae' })
const avion = new Avion(mesh)

scene.add(avion, ground)

/* FUNCTIONS */

void function update() {
  requestAnimationFrame(update)
  controls.update()
  ground.rotate()
  // avion.normalizePlane()
  const delta = clock.getDelta()
  if (mixer) mixer.update(1)
  camera.lookAt(avion.position)
  renderer.render(scene, camera)
}()
