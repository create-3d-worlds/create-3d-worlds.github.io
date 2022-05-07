import * as THREE from '/node_modules/three108/build/three.module.js'
import { OBJLoader } from '/node_modules/three108/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '/node_modules/three108/examples/jsm/loaders/MTLLoader.js'
import { scene, camera, renderer, initLights, createOrbitControls, addControlUI } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { keyboard } from '/classes/index.js'

const scale = 1.5

camera.position.set(1.5, 2.5, -6.5)
const controls = createOrbitControls()

renderer.setClearColor(0x63adef, 1.0)
renderer.gammaInput = renderer.gammaOutput = true

const ground = createGround({ size: 50, color: 0x23ef13 })
scene.add(ground)

initLights()

const objLoader = new OBJLoader()
const mtlLoader = new MTLLoader()
mtlLoader.setMaterialOptions({ side: THREE.DoubleSide })

mtlLoader.load('/assets/models/houses02/house2-02.mtl', materials => {
  objLoader.setMaterials(materials)
  objLoader.load('/assets/models/houses02/house2-02.obj', object => {
    object.scale.set(scale, scale, scale)
    scene.add(object)
  })
})

addControlUI({ commands: {
  '1': 'inside',
  '2': 'outside',
}, title: 'Change camera' })

/* FUNCTIONS */

const updateCamera = () => {
  if (keyboard.pressed.Digit1) camera.position.set(1.5, 2.5, -6.5)
  if (keyboard.pressed.Digit2) camera.position.set(10, 20, 25)
}

/* LOOP */

void function update() {
  controls.update()
  updateCamera()
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()