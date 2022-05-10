import * as THREE from '/node_modules/three108/build/three.module.js'
import { OBJLoader } from '/node_modules/three108/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from '/node_modules/three108/examples/jsm/loaders/MTLLoader.js'
import { TrackballControls } from '/node_modules/three108/examples/jsm/controls/TrackballControls.js'
import {scene, camera, renderer, initLights} from '/utils/scene.js'

let SELECTED, DRAGGED, CHEST

const items = []
const plane = new THREE.Plane()
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
const offset = new THREE.Vector3()
const intersection = new THREE.Vector3()
const mtlLoader = new MTLLoader()
mtlLoader.setPath('/assets/models/items/')

scene.background = new THREE.Color(0xe0e0e0)
camera.position.z = 6
camera.position.y = 4

const controls = new TrackballControls(camera)
initLights()

loadOBJ('potion.mtl', 'potion.obj', potion => placeModel(potion, false, 4))
loadOBJ('potion2.mtl', 'potion.obj', potion2 => placeModel(potion2, false, 4))
loadOBJ('potion3.mtl', 'potion.obj', potion3 => placeModel(potion3, false, 4))
loadOBJ('money.mtl', 'money.obj', money => placeModel(money, false, 4))
loadOBJ('axe.mtl', 'axe.obj', axe => placeModel(axe, true, 2))
loadOBJ('hammer.mtl', 'hammer.obj', hammer => placeModel(hammer, true, 2))
loadOBJ('shield.mtl', 'shield.obj', shield => placeModel(shield, true))
loadOBJ('sword.mtl', 'sword.obj', sword => placeModel(sword, true))
loadOBJ('staff.mtl', 'staff.obj', staff => placeModel(staff, true))

loadOBJ('chest.mtl', 'chest.obj', chest => {
  CHEST = chest
  chest.position.x = 0
  chest.position.z = 0
  chest.rotation.y = -Math.PI / 2
  scene.add(chest)
})

/* FUNCTIONS */

function placeModel(model, shouldRotate = false, itemsNum = 1) {
  for (let i = 0; i < itemsNum; i++) {
    const object = model.clone()
    object.position.x = Math.random() * 20 - 10
    object.position.z = Math.random() * 10 - 10
    object.rotation.y = Math.random() * 2 * Math.PI
    if (shouldRotate) {
      object.rotation.z = Math.PI / 2
      object.rotation.y = Math.random() * 2 * Math.PI
    }
    scene.add(object)
    items.push(object)
  }
}

function loadOBJ(fileMaterial, fileOBJ, callback) {
  mtlLoader.load(fileMaterial, materials => {
    const objLoader = new OBJLoader() // mora nova instanca zbog setMaterials
    objLoader.setPath('/assets/models/items/')
    objLoader.setMaterials(materials)
    objLoader.load(fileOBJ, object => {
      callback(object.children[0])
    })
  })
};

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()

/* EVENTS */

renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false)
renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false)
renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false)

function onDocumentMouseMove(e) {
  e.preventDefault()
  mouse.x = e.clientX / window.innerWidth * 2 - 1
  mouse.y = -e.clientY / window.innerHeight * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  if (DRAGGED) {
    if (raycaster.ray.intersectPlane(plane, intersection))
      DRAGGED.position.copy(intersection.sub(offset))
    return
  }

  const intersects = raycaster.intersectObjects(items)
  if (intersects.length > 0) {
    if (SELECTED != intersects[0].object) {
      SELECTED = intersects[0].object
      plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(plane.normal), SELECTED.position)
    }
    document.body.style.cursor = 'pointer'
  } else {
    SELECTED = null
    document.body.style.cursor = 'auto'
  }
}

function onDocumentMouseDown(e) {
  e.preventDefault()
  if (SELECTED) {
    controls.enabled = false
    DRAGGED = SELECTED
    if (raycaster.ray.intersectPlane(plane, intersection))
      offset.copy(intersection).sub(DRAGGED.position)
    document.body.style.cursor = 'move'
  }
}

function onDocumentMouseUp(e) {
  e.preventDefault()
  controls.enabled = true
  if (DRAGGED) {
    const intersects = raycaster.intersectObject(CHEST)
    if (intersects.length > 0) scene.remove(DRAGGED)
    DRAGGED = null
  }
  document.body.style.cursor = 'auto'
}
