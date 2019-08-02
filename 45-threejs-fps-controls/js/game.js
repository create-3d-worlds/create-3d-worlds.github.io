import {askPointerLock} from './pointerlock.js'

const boxes = []
const objects = []

const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 9000)
const controls = new THREE.PointerLockControls(camera, 100, 30, true, objects)

const scene = new THREE.Scene()
scene.add(controls.getPlayer())

const floorHeight = 7000
const geometry = new THREE.SphereGeometry(floorHeight, 10, 6, 0, (Math.PI * 2), 0, 0.8)
geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -floorHeight, 0))
const material = new THREE.MeshLambertMaterial()
const floorMesh = new THREE.Mesh(geometry, material)
objects.push(floorMesh)
scene.add(floorMesh)

// Boxes
const boxGeometry = new THREE.BoxGeometry(20, 20, 20)
const boxTexture1 = new THREE.ImageUtils.loadTexture('img/block1.jpg')
const boxTexture2 = new THREE.ImageUtils.loadTexture('img/block2.jpg')
const boxTexture3 = new THREE.ImageUtils.loadTexture('img/block3.jpg')
const boxTexture4 = new THREE.ImageUtils.loadTexture('img/block4.jpg')
const boxMaterial1 = new THREE.MeshBasicMaterial({ map: boxTexture1, reflectivity: 0.8 })
const boxMaterial2 = new THREE.MeshBasicMaterial({ map: boxTexture2, reflectivity: 0.8 })
const boxMaterial3 = new THREE.MeshBasicMaterial({ map: boxTexture3, reflectivity: 0.8 })
const boxMaterial4 = new THREE.MeshBasicMaterial({ map: boxTexture4, reflectivity: 0.8 })
const items = [boxMaterial1, boxMaterial2, boxMaterial3, boxMaterial4]
let boxZ

for (let i = 0; i < 850; i++) {
  const boxmesh = new THREE.Mesh(boxGeometry, items[Math.floor(Math.random() * items.length)])
  boxZ = 50
  boxmesh.position.x = Math.floor(Math.random() * 20 - 10) * 20
  boxmesh.position.y = Math.floor(Math.random() * 20) * boxZ + 10
  boxmesh.position.z = Math.floor(Math.random() * 20 - 10) * 20
  boxes.push(boxmesh)
  objects.push(boxmesh)
  scene.add(boxmesh)
}

const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0xffffff)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
askPointerLock(controls) //

/* FUNCTIONS */

function handleKeyInteraction(keyCode, isKeyDown) {
  switch (keyCode) {
    case 87: // w
      controls.movements.forward = isKeyDown
      break
    case 83: // s
      controls.movements.backward = isKeyDown
      break
    case 65: // a
      controls.movements.left = isKeyDown
      break
    case 68: // d
      controls.movements.right = isKeyDown
      break
    case 32: // space
      controls.jump()
      break
    case 16: { // shift
      controls.crouch(isKeyDown)
      controls.walk(isKeyDown)
    }
  }
}

/* EVENTS */

const handleKeyDown = function(event) {
  event.preventDefault()
  handleKeyInteraction(event.keyCode, true)
}

const handleKeyUp = function(event) {
  event.preventDefault()
  handleKeyInteraction(event.keyCode, false)
}

document.addEventListener('keydown', handleKeyDown)
document.addEventListener('keyup', handleKeyUp)

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  if (controls.enabled)
    controls.updateControls()
  renderer.render(scene, camera)
}()
