import * as THREE from '/node_modules/three127/build/three.module.js'
import { OBJLoader } from '/node_modules/three127/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '/node_modules/three127/examples/jsm/loaders/MTLLoader.js'
import { scene, camera, renderer, initLights, createOrbitControls } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'
import { CIRCLE } from '/utils/constants.js'

let selectedItem, draggedItem, CHEST

const items = []
const plane = new THREE.Plane()
const raycaster = new THREE.Raycaster()
const offset = new THREE.Vector3()
const intersection = new THREE.Vector3()

const mtlLoader = new MTLLoader()
mtlLoader.setPath('/assets/models/item/')

scene.background = new THREE.Color(0xe0e0e0)
initLights()

camera.position.set(0, 5, 5)
const controls = createOrbitControls()

loadOBJ('potion/potion.mtl', 'potion/potion.obj', model => placeModel(model, false, 4))
loadOBJ('potion/potion2.mtl', 'potion/potion.obj', model => placeModel(model, false, 4))
loadOBJ('potion/potion3.mtl', 'potion/potion.obj', model => placeModel(model, false, 4))
loadOBJ('money/money.mtl', 'money/money.obj', model => placeModel(model, false, 4))
loadOBJ('axe/axe.mtl', 'axe/axe.obj', model => placeModel(model, true, 2))
loadOBJ('hammer/hammer.mtl', 'hammer/hammer.obj', model => placeModel(model, true, 2))
loadOBJ('shield/shield.mtl', 'shield/shield.obj', model => placeModel(model, true))
loadOBJ('staff/staff.mtl', 'staff/staff.obj', model => placeModel(model, true))
loadOBJ('sword/sword.mtl', 'sword/sword.obj', model => placeModel(model, true))

loadOBJ('chest/chest.mtl', 'chest/chest.obj', model => {
  CHEST = model
  model.rotation.y = -Math.PI / 2
  scene.add(model)
})

/* FUNCTIONS */

function placeModel(model, shouldRotate = false, itemsNum = 1) {
  for (let i = 0; i < itemsNum; i++) {
    const object = model.clone() // to add multiple items
    object.position.set(randomInRange(-10, 10), 0, randomInRange(-5, 5))
    if (shouldRotate)
      object.rotation.z = Math.PI / 2
    object.rotation.y = Math.random() * CIRCLE
    scene.add(object)
    items.push(object)
  }
}

function loadOBJ(fileMaterial, fileOBJ, callback) {
  const objLoader = new OBJLoader() // mora nova instanca zbog setMaterials
  mtlLoader.load(fileMaterial, materials => {
    objLoader.setPath('/assets/models/item/')
    objLoader.setMaterials(materials)
    objLoader.load(fileOBJ, object => {
      callback(object.children[0])
    })
  })
}

/* EVENTS */

renderer.domElement.addEventListener('mousemove', onMouseMove, false)
renderer.domElement.addEventListener('mousedown', onMouseDown, false)
renderer.domElement.addEventListener('mouseup', onMouseUp, false)

function onMouseMove(e) {
  const x = e.clientX / window.innerWidth * 2 - 1
  const y = -e.clientY / window.innerHeight * 2 + 1

  raycaster.setFromCamera({ x, y }, camera) // mouse x, y

  if (draggedItem) {
    if (raycaster.ray.intersectPlane(plane, intersection))
      draggedItem.position.copy(intersection.sub(offset))
    return
  }

  const intersects = raycaster.intersectObjects(items)
  if (intersects.length > 0) {
    if (selectedItem != intersects[0].object) {
      selectedItem = intersects[0].object
      plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(plane.normal), selectedItem.position)
    }
    document.body.style.cursor = 'grab'
  } else {
    selectedItem = null
    document.body.style.cursor = 'pointer'
  }
}

function onMouseDown() {
  if (!selectedItem) return
  controls.enabled = false
  draggedItem = selectedItem
  document.body.style.cursor = 'grabbing'
  if (raycaster.ray.intersectPlane(plane, intersection))
    offset.copy(intersection).sub(draggedItem.position)
}

function onMouseUp() {
  controls.enabled = true
  document.body.style.cursor = 'pointer'
  if (draggedItem) {
    const intersects = raycaster.intersectObject(CHEST)
    if (intersects.length > 0) scene.remove(draggedItem)
    draggedItem = null
  }
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
