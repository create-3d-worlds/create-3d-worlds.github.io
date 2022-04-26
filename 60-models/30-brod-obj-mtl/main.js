import * as THREE from '/node_modules/three108/build/three.module.js'
import { OBJLoader } from '/node_modules/three108/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '/node_modules/three108/examples/jsm/loaders/MTLLoader.js'
import {scene, camera, renderer, createOrbitControls, initLights} from '/utils/scene.js'

const scale = 0.2

initLights()
createOrbitControls()

const objLoader = new OBJLoader()
const mtlLoader = new MTLLoader()
mtlLoader.setMaterialOptions({side: THREE.DoubleSide})

mtlLoader.load('/assets/models/BlackPearl/BlackPearl.mtl', materials => {
  objLoader.setMaterials(materials)
  objLoader.load('/assets/models/BlackPearl/BlackPearl.obj', object => {
    object.scale.set(scale, scale, scale)
    object.rotateY(Math.PI / 2)
    scene.add(object)
  })
})

/** LOOP **/

void function update() {
  requestAnimationFrame(update)
  camera.lookAt(scene.position)
  renderer.render(scene, camera)
}()
