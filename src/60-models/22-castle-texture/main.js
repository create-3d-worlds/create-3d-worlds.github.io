import * as THREE from '/node_modules/three127/build/three.module.js'
import { scene, renderer, camera, createOrbitControls, hemLight } from '/utils/scene.js'
import { createHillyTerrain } from '/utils/ground/createHillyTerrain.js'
import { createWater } from '/utils/ground.js'
import { createTreesOnTerrain } from '/utils/trees.js'
import { addTexture, getHeight } from '/utils/helpers.js'
import { loadModel } from '/utils/loaders.js'

hemLight({ intensity: 1.2 })

const terrain = createHillyTerrain()
scene.add(terrain)
scene.add(createWater({ size: 400 }))
scene.add(createTreesOnTerrain({ terrain, n: 100, mapSize: 400, size: 5 }))

createOrbitControls()
camera.position.y = 100

const directLight = new THREE.DirectionalLight(0xffeedd)
directLight.position.set(0, 0, 1)
scene.add(directLight)

const { mesh } = await loadModel({ file: 'castle/magic-castle.obj', size: 50, shouldAdjust: true })
mesh.translateY(getHeight(mesh) / 4)
addTexture({ mesh, file: 'concrete.jpg' })
scene.add(mesh)

/** FUNKCIJE **/

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
