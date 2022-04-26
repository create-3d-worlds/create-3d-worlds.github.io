/* global dat */
import * as THREE from '/node_modules/three108/build/three.module.js'
import { OBJLoader } from '/node_modules/three108/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '/node_modules/three108/examples/jsm/loaders/MTLLoader.js'
import {scene, camera, renderer, initLights} from '/utils/scene.js'

let tower
const scale = 1.5

renderer.setClearColor(0x63adef, 1.0)
renderer.gammaInput = true
renderer.gammaOutput = true

const planeGeometry = new THREE.CircleGeometry(50, 32)
const planeMaterial = new THREE.MeshPhongMaterial({color:0x23ef13})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -0.5 * Math.PI
scene.add(plane)

camera.lookAt(new THREE.Vector3(0, 2.5, 0))
initLights()

const params = {
  side: THREE.DoubleSide,
  cameraPos: 0
}
addControlGui(params)

const mtlLoader = new MTLLoader()
const objLoader = new OBJLoader()
mtlLoader.load('/assets/models/houses02/house2-02.mtl', materials => {
  objLoader.setMaterials(materials)
  objLoader.load('/assets/models/houses02/house2-02.obj', object => {
    object.scale.set(scale, scale, scale)
    scene.add(object)
    tower = object
    render()
  })
})

function addControlGui(params) {
  const gui = new dat.GUI()
  gui.add(params, 'side', {
    'THREE.FrontSide' : THREE.FrontSide,
    'THREE.DoubleSide' : THREE.DoubleSide
  })
  gui.add(params, 'cameraPos', {
    'inside' : 0,
    'outside' : 1
  })
}

function render() {
  tower.traverse(child => {
    if (child instanceof THREE.Mesh) child.material.side = params.side
  })

  if (params.cameraPos == 0) {
    camera.position.set(1.5, 2.5, -6.5)
    camera.lookAt(new THREE.Vector3(0, 2.5, 0))
  } else {
    camera.position.set(10, 20, 25)
    camera.lookAt(scene.position)
  }

  requestAnimationFrame(render)
  renderer.render(scene, camera)
}
