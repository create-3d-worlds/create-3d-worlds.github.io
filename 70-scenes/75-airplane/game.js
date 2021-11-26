import * as THREE from '/node_modules/three108/build/three.module.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import { createFullScene, renderer, camera, createOrbitControls} from '/utils/scene.js'
import { createTerrain } from '/utils/ground.js'
import keyboard from '/classes/Keyboard.js'
import Avion from './Avion.js'

let avionMesh

const scene = createFullScene({ color:0xFFC880 }, undefined, undefined, { color: 0xE5C5AB })
scene.add(createTerrain(4000, 200))

const controls = createOrbitControls()

/* UPDATE */

const animate = () => {
  requestAnimationFrame(animate)
  controls.update()
  avionMesh.update()
  avionMesh.normalizePlane()
  avionMesh.position.z -= .5
  if (!keyboard.mouseDown)
    camera.position.lerp({ ...avionMesh.position, z: avionMesh.position.z + 100 }, 0.05)
  // camera.lookAt(avionMesh.position)
  renderer.render(scene, camera)
}

/* LOAD */

function normalizeModel(mesh) {
  mesh.scale.set(.2, .2, .2)
  mesh.rotateX(-Math.PI / 20)
  mesh.translateX(8)
  mesh.translateY(-20)
  // centar ose rotacije
  const box = new THREE.Box3().setFromObject(mesh)
  box.center(mesh.position) // re-sets the mesh position
  mesh.position.multiplyScalar(- 1)
  const group = new THREE.Group()
  group.traverse(child => child.castShadow = true) // eslint-disable-line no-return-assign
  group.add(mesh)
  return group
}

new ColladaLoader().load('/assets/models/s-e-5a/model.dae', collada => {
  const group = normalizeModel(collada.scene)
  avionMesh = new Avion(group) // dodaje komande
  avionMesh.position.y = 15
  scene.getObjectByName('sunLight').target = avionMesh
  controls.target = avionMesh.position
  scene.add(avionMesh)
  animate()
})

