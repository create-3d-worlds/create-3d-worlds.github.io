import * as THREE from '../node_modules/three/build/three.module.js'
import { scene, renderer, camera, clock, createOrbitControls} from '../utils/scene.js'
import {OBJLoader} from '../node_modules/three/examples/jsm/loaders/OBJLoader.js'
// import {FBXLoader} from '../node_modules/three/examples/jsm/loaders/FBXLoader.js'
import {MTLLoader} from '../node_modules/three/examples/jsm/loaders/MTLLoader.js'

const controls = createOrbitControls()

const mtlLoader = new MTLLoader()
mtlLoader.load('../assets/models/pirate-cannon/14054_Pirate_Ship_Cannon_on_Cart_v1_l3.mtl', materials => {
  const objLoader = new OBJLoader()
  objLoader.setMaterials(materials)
  objLoader.load('../assets/models/pirate-cannon/14054_Pirate_Ship_Cannon_on_Cart_v1_l3.obj', object => {
    console.log(object)
    scene.add(object)
    controls.target = object.position
  })
})

/* INIT */

void function render() {
  // const delta = clock.getDelta()
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()

