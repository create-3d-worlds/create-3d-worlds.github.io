import * as THREE from 'three'
import { scene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { createHillyTerrain, createWater } from '/utils/ground.js'
import { createTreesOnTerrain } from '/utils/geometry/trees.js'
import { addTexture } from '/utils/helpers.js'
import { loadModel } from '/utils/loaders.js'
import { hemLight } from '/utils/light.js'

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

const { mesh } = await loadModel({ file: 'building/castle/magic-castle.fbx', size: 50 })
mesh.translateY(20)
addTexture({ mesh, file: 'terrain/concrete.jpg' })
scene.add(mesh)

/** FUNKCIJE **/

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()
