import * as THREE from '/node_modules/three127/build/three.module.js'
import { FBXLoader } from '/node_modules/three127/examples/jsm/loaders/FBXLoader.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'

const ambientLight = new THREE.AmbientLight()
scene.add(ambientLight)

const controls = createOrbitControls()
controls.target.set(0, 1, 0)

const fbxLoader = new FBXLoader()
fbxLoader.load('/assets/models/character-girl-fighter/girl-walk.fbx', object => {
  object.scale.set(.02, .02, .02)
  scene.add(object)
})

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()