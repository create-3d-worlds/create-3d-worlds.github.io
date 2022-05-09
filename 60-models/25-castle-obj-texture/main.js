import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, renderer, camera, createOrbitControls, hemLight } from '/utils/scene.js'
import { createHillyTerrain } from '/utils/ground/createHillyTerrain.js'
import { createWater } from '/utils/ground.js'
import { createTreesOnTerrain } from '/utils/trees.js'
import { addTexture, getSize } from '/utils/helpers.js'
import { loadObj } from '/utils/loaders.js'

hemLight({ intensity: 1.2 })

const terrain = createHillyTerrain()
scene.add(terrain)
scene.add(createWater())
scene.add(createTreesOnTerrain({ terrain, n: 50, mapSize: 1000, size: 25 }))

createOrbitControls()
camera.position.y = 100

const directLight = new THREE.DirectionalLight(0xffeedd)
directLight.position.set(0, 0, 1)
scene.add(directLight)

const model = await loadObj({ obj: 'magic-castle.obj', scale: 8 })
model.translateY(getSize(model).y / 4)
addTexture({ model, file: 'concrete.jpg' })
scene.add(model)

/** FUNKCIJE **/

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
