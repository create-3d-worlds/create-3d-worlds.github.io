import { scene, renderer, camera } from '../utils/three-scene.js'
import PlayerBox from '../classes/PlayerBox.js'

const characterSize = 50
const outlineSize = characterSize * 0.05

const colliders = []

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

const playerSpeed = 5

const container = document.createElement('div')
document.body.appendChild(container)

scene.background = new THREE.Color(0xccddff)
scene.fog = new THREE.Fog(0xccddff, 500, 2000)

const ambient = new THREE.AmbientLight(0xffffff)
scene.add(ambient)

const hemisphereLight = new THREE.HemisphereLight(0xdddddd, 0x000000, 0.5)
scene.add(hemisphereLight)

const player = new PlayerBox(characterSize)
scene.add(player.mesh)

camera.position.z = -300
camera.position.y = 200
player.add(camera)

const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enablePan = true
controls.enableZoom = true
controls.maxDistance = 1000
controls.minDistance = 60
controls.target.copy(new THREE.Vector3(0, characterSize / 2, 0))

/* FUNCTIONS */

function move(obj, destination) {
  const {position} = obj
  const newPosX = destination.x
  const newPosZ = destination.z

  const diffX = Math.abs(position.x - newPosX)
  const diffZ = Math.abs(position.z - newPosZ)
  const distance = Math.sqrt(diffX * diffX + diffZ * diffZ)

  const multiplierX = position.x > newPosX ? -1 : 1
  const multiplierZ = position.z > newPosZ ? -1 : 1
  position.x += (playerSpeed * (diffX / distance)) * multiplierX
  position.z += (playerSpeed * (diffZ / distance)) * multiplierZ

  if (Math.floor(position.x) <= Math.floor(newPosX) + 15 &&
      Math.floor(position.x) >= Math.floor(newPosX) - 15 &&
      Math.floor(position.z) <= Math.floor(newPosZ) + 15 &&
      Math.floor(position.z) >= Math.floor(newPosZ) - 15
  ) {
    position.x = Math.floor(position.x)
    position.z = Math.floor(position.z)
    player.movements = []
  }
}

function addCollisionPoints(mesh) {
  const bbox = new THREE.Box3().setFromObject(mesh)
  const bounds = {
    xMin: bbox.min.x,
    xMax: bbox.max.x,
    yMin: bbox.min.y,
    yMax: bbox.max.y,
    zMin: bbox.min.z,
    zMax: bbox.max.z,
  }
  colliders.push(bounds)
}

function createFloor() {
  const geometry = new THREE.PlaneBufferGeometry(100000, 100000)
  const material = new THREE.MeshToonMaterial({color: 0x336633})
  const plane = new THREE.Mesh(geometry, material)
  plane.rotation.x = -1 * Math.PI / 2
  plane.position.y = 0
  return plane
}

function createTree(posX, posZ) {
  const randomScale = (Math.random() * 3) + 0.8
  const randomRotateY = Math.PI / (Math.floor((Math.random() * 32) + 1))

  let geometry = new THREE.CylinderGeometry(characterSize / 3.5, characterSize / 2.5, characterSize * 1.3, 8)
  let material = new THREE.MeshToonMaterial({color: 0x664422})
  const trunk = new THREE.Mesh(geometry, material)
  trunk.position.set(posX, ((characterSize * 1.3 * randomScale) / 2), posZ)
  trunk.scale.x = trunk.scale.y = trunk.scale.z = randomScale
  addCollisionPoints(trunk)

  let outline_geo = new THREE.CylinderGeometry(characterSize / 3.5 + outlineSize, characterSize / 2.5 + outlineSize, characterSize * 1.3 + outlineSize, 8)
  let outline_mat = new THREE.MeshBasicMaterial({
    color : 0x0000000,
    side: THREE.BackSide
  })
  const outlineTrunk = new THREE.Mesh(outline_geo, outline_mat)
  trunk.add(outlineTrunk)

  geometry = new THREE.DodecahedronGeometry(characterSize)
  material = new THREE.MeshToonMaterial({ color: 0x44aa44 })
  const treeTop = new THREE.Mesh(geometry, material)
  treeTop.position.y = characterSize * randomScale + randomScale
  treeTop.scale.x = treeTop.scale.y = treeTop.scale.z = randomScale
  treeTop.rotation.y = randomRotateY
  trunk.add(treeTop)

  outline_geo = new THREE.DodecahedronGeometry(characterSize + outlineSize)
  outline_mat = new THREE.MeshBasicMaterial({
    color : 0x0000000,
    side: THREE.BackSide
  })
  const outlineTreeTop = new THREE.Mesh(outline_geo, outline_mat)
  treeTop.add(outlineTreeTop)
  return trunk
}

/* INIT */

const plane = createFloor()
scene.add(plane)
scene.add(createTree(300, 300))
scene.add(createTree(800, -300))
scene.add(createTree(-300, 800))
scene.add(createTree(-800, -800))

void function animate() {
  requestAnimationFrame(animate)
  if (player.movements.length > 0) move(player.mesh, player.movements[0])
  if (camera.position.y < 10) camera.position.y = 10
  player.detectCollisions(colliders)
  renderer.render(scene, camera)
}()

/* EVENTS */

function handleMouseDown(event) {
  event.preventDefault()
  player.movements = []

  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
  mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects([plane]) // must be array
  if (intersects.length > 0) player.movements.push(intersects[0].point)
}

document.addEventListener('mousedown', handleMouseDown)
