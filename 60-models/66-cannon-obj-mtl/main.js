import { scene, renderer, camera, createOrbitControls} from '/utils/scene.js'
import {OBJLoader} from '/node_modules/three108/examples/jsm/loaders/OBJLoader.js'
// import {FBXLoader} from '/node_modules/three108/examples/jsm/loaders/FBXLoader.js'
import {MTLLoader} from '/node_modules/three108/examples/jsm/loaders/MTLLoader.js'

const controls = createOrbitControls()

const mtlLoader = new MTLLoader()
mtlLoader.load('/assets/models/cannon/14054_Pirate_Ship_Cannon_on_Cart_v1_l3.mtl', materials => {
  const objLoader = new OBJLoader()
  objLoader.setMaterials(materials)
  objLoader.load('/assets/models/cannon/14054_Pirate_Ship_Cannon_on_Cart_v1_l3.obj', object => {
    console.log(object)
    scene.add(object)
    controls.target = object.position
  })
})

/* LOOP */

void function render() {
  // const delta = clock.getDelta()
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()

