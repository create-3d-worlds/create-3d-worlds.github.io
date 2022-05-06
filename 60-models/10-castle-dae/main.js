import * as THREE from '/node_modules/three108/build/three.module.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import { scene, camera, renderer, createOrbitControls, hemLight } from '/utils/scene.js'
import { addTexture } from '/utils/helpers.js'

const scale = 0.1

hemLight()
const directLight = new THREE.DirectionalLight(0xffeedd)
directLight.position.set(0, 0, 1)
scene.add(directLight)

createOrbitControls()
camera.position.set(3, 2, 10)

const loader = new ColladaLoader()
loader.load('/assets/models/tvrdjava.dae', data => {
  const model = data.scene
  model.scale.set(scale, scale, scale)
  model.rotateX(Math.PI / 2)
  addTexture(model, 'brick.png')
  scene.add(model)
})

/** LOOP **/

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
