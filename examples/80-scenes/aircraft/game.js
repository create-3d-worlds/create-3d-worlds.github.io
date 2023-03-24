import * as THREE from 'three'
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js'

import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { createGround, rotateGround } from '/utils/terrain/cylinder-ground.js'
import { updatePlane, normalizePlane } from './utils/airplane.js'

scene.fog = new THREE.Fog(0xE5C5AB, 200, 950)

scene.add(
  new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .9),
  createSun({ x: 150, y: 350, z: -150 })
)

camera.position.set(-68, 143, -90)

const controls = new OrbitControls(camera, renderer.domElement)

const ground = createGround({ r: 3000, color: 0x91A566 })

// const { mesh, mixer } = await loadModel({ file: '/aircraft_junkers_ju_87_stuka/scene.gltf', size: 30 })

const { mesh, mixer } = await loadModel({ file: '/aircraft/messerschmitt-bf-109/scene.gltf', size: 20 })

mesh.position.y = 100

scene.add(mesh, ground)

/* FUNCTIONS */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()
  controls.update()
  rotateGround(ground)
  updatePlane(mesh, delta)
  normalizePlane(mesh, delta)
  if (mixer) mixer.update(0.016)
  camera.lookAt(mesh.position)
  renderer.render(scene, camera)
}()
