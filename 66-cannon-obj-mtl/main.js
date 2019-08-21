import { scene, renderer, camera, createOrbitControls} from '../utils/scene.js'
import {OBJLoader} from '../node_modules/three/examples/jsm/loaders/OBJLoader.js'
// import {FBXLoader} from '../node_modules/three/examples/jsm/loaders/FBXLoader.js'
import {MTLLoader} from '../node_modules/three/examples/jsm/loaders/MTLLoader.js'

const controls = createOrbitControls()

const mtlLoader = new MTLLoader()
mtlLoader.load('../assets/models/Wolf-Game-Ready/Wolf_obj.mtl', materials => {
  const objLoader = new OBJLoader()
  objLoader.setMaterials(materials)
  objLoader.load('../assets/models/Wolf-Game-Ready/Wolf_obj.obj', object => {
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

