import * as THREE from '/node_modules/three108/build/three.module.js'
import { OBJLoader } from '/node_modules/three108/examples/jsm/loaders/OBJLoader.js'
import { scene, renderer, camera, createOrbitControls} from '/utils/scene.js'
import {createHillyTerrain} from '/utils/createHillyTerrain.js'
import {createWater} from '/utils/floor.js'
import {createTreesOnTerrain} from '/utils/trees.js'

const terrain = createHillyTerrain()
scene.add(terrain)
scene.add(createWater())
scene.add(createTreesOnTerrain(terrain, 50, 500, 25))

createOrbitControls()
camera.position.y = 100

const directLight = new THREE.DirectionalLight(0xffeedd)
directLight.position.set(0, 0, 1)
scene.add(directLight)

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/assets/textures/concrete.jpg')

const loader = new OBJLoader()
loader.load('models/magic-castle.obj', model => {
  model.scale.set(8, 8, 8)
  const box = new THREE.Box3().setFromObject(model)
  model.translateY(box.getSize().y / 4)
  model.traverse(child => {
    if (child.isMesh) child.material.map = texture
  })
  scene.add(model)
})

/** FUNKCIJE **/

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
