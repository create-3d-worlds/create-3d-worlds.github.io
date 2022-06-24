/* global CANNON */
import * as THREE from '/node_modules/three127/build/three.module.js'
import { GLTFLoader } from '/node_modules/three127/examples/jsm/loaders/GLTFLoader.js'
import keyboard from '/classes/Keyboard.js'
import { scene, renderer, clock, createSkyBox } from '/utils/scene.js'
import { ambLight, dirLight } from '/utils/light.js'
import { createGround } from '/utils/ground.js'

ambLight({ intensity: 2 })
dirLight({ intensity: 5 })

let activeCamera

const gltfloader = new GLTFLoader()

const stonesBody = [], stones = [], catapultsBody = [], catapultsMesh = []
const standsBody = [], standsMesh = [], collidables = []
const numEnemies = 1
const xPositions = [-46, -40, -28, -18, -5]

let pause = true
let lastEnemyAttack = 0
let userShootVelocity = 4
let catapultModel
let countStones = 0

gltfloader.load('models/catapult2/scene.gltf', createCatapults)
gltfloader.load('models/tower1/scene.gltf', createTower)

const ground = createGround({ size: 512, file: 'grass-512.jpg' })
scene.add(ground)

scene.background = createSkyBox()

const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.set(-64, 14, 7)
camera.lookAt(new THREE.Vector3(-47, 10, 0))

const camera2 = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000)
camera2.position.set(-62, 16, 0)
camera2.lookAt(new THREE.Vector3(-47, 14, 0))

activeCamera = camera

const world = new CANNON.World()
world.quatNormalizeSkip = 0
world.quatNormalizeFast = false
const solver = new CANNON.GSSolver()
solver.iterations = 10
solver.tolerance = 0.1
world.defaultContactMaterial.contactEquationStiffness = 1e8
world.defaultContactMaterial.contactEquationRelaxation = 3
world.solver = new CANNON.SplitSolver(solver)
world.gravity.set(0, -9.82, 0)
world.broadphase = new CANNON.NaiveBroadphase()

const physicsMaterial = new CANNON.Material('groundMaterial')
const physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
  physicsMaterial,
  {
    friction: 200.6,
    frictionEquationStiffness: 1e8,
    frictionEquationRegularizationTime: 3,
    restitution: 0.3,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3
  }
)

world.addContactMaterial(physicsContactMaterial)

const groundShape = new CANNON.Plane()
const groundBody = new CANNON.Body({ mass: 0, material: physicsMaterial })
groundBody.addShape(groundShape)
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.add(groundBody)

const mainStandSize = new CANNON.Vec3(2, 7, 3)
const mainStandShape = new CANNON.Box(mainStandSize)
const mainStandBody = new CANNON.Body({ mass: 0, material: physicsMaterial })
mainStandBody.addShape(mainStandShape)
mainStandBody.position.set(-60, 5, 0)
world.add(mainStandBody)

createStones()
createStands()

/* FUNCTIONS */

function checkCollison(stone, collidables) {
  for (let vertexIndex = 0; vertexIndex < stone.geometry.attributes.position.array.length; vertexIndex++) {
    const localVertex = new THREE.Vector3().fromBufferAttribute(stone.geometry.attributes.position, vertexIndex).clone()
    const globalVertex = localVertex.applyMatrix4(stone.matrix)
    const directionVector = globalVertex.sub(stone.position)

    const ray = new THREE.Raycaster(stone.position, directionVector.clone().normalize())
    const collisionResults = ray.intersectObjects(collidables)
    if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length())
      removeCatapult(collisionResults[0].object.name, stone.name)
  }
}

function createCatapults(gltf) {
  catapultModel = gltf.scene
  catapultModel.scale.set(1 / 3, 1 / 3, 1 / 3)
  const halfExt = new CANNON.Vec3(0.2, 0.8, 0.8)
  for (let i = 0; i < numEnemies + 1; i++) {
    const catapultShape = new CANNON.Box(halfExt)
    const catapultBody = new CANNON.Body({ mass: 0 })
    catapultBody.addShape(catapultShape)

    catapultsBody.push(catapultBody)
    catapultsMesh.push(catapultModel.clone())
  }
  createCollidables()
  positionUser()
}

function positionUser() {
  world.add(catapultsBody[0])
  scene.add(catapultsMesh[0])
  catapultsBody[0].position.set(mainStandBody.position.x - 1.5, mainStandBody.position.y + mainStandSize.y, mainStandBody.position.z + 1)
  collidables[0].position.set(mainStandBody.position.x - 0.3, mainStandBody.position.y + mainStandSize.y + 1, mainStandBody.position.z)
  scene.add(collidables[0])
}

function createCollidables() {
  for (let i = 0; i < numEnemies + 1; i++) {
    const geometry = new THREE.BoxGeometry(3.2, 1.5, 3)
    const material = new THREE.MeshBasicMaterial({
      opacity: 0,
      side: THREE.FrontSide,
    })
    material.transparent = true
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = i
    collidables.push(mesh)
  }
}

function removeCatapult(catapultName, stoneName) {
  if ((stoneName === 'enemy' && catapultName == 0) || (stoneName === 'user' && catapultName > 0)) {
    scene.remove(collidables[catapultName])
    scene.remove(catapultsMesh[catapultName])
    catapultsBody[catapultName].position.set(100, -100, 100)
    scene.remove(standsMesh[catapultName])
    standsBody[catapultName].position.set(100, -100, 100)
  }
}

function createTower(gltf) {
  const tower = gltf.scene
  tower.scale.set(1 / 26, 1 / 15, 1 / 26)
  tower.position.set(mainStandBody.position.x, mainStandBody.position.y - 4, mainStandBody.position.z)
  tower.castShadow = true
  scene.add(tower)
}

function createStands() {
  const standTexture = new THREE.TextureLoader().load('texture/brick_stone_wall.jpg')
  standTexture.repeat.set(1, 1)
  standTexture.wrapS = standTexture.wrapT = THREE.RepeatWrapping
  standTexture.magFilter = THREE.NearestFilter
  standTexture.minFilter = THREE.LinearMipMapLinearFilter

  for (let i = 0; i < numEnemies + 1; i++) {
    const halfExt = new CANNON.Vec3(3, 0.6, 3)
    const standShape = new CANNON.Box(halfExt)
    const standBody = new CANNON.Body({ mass: 0 })
    standBody.addShape(standShape)
    standsBody.push(standBody)

    const standGeometry = new THREE.BoxGeometry(halfExt.x * 2, halfExt.y * 2, halfExt.z * 2)
    const material = new THREE.MeshPhongMaterial({ color: 0x232426, map: standTexture })
    const standMesh = new THREE.Mesh(standGeometry, material)
    standsMesh.push(standMesh)
  }
}

function createStones() {
  const stoneTexture = new THREE.TextureLoader().load('texture/stoneTexture1.jpg')
  stoneTexture.repeat.set(1, 1)
  stoneTexture.wrapS = THREE.RepeatWrapping
  stoneTexture.wrapT = THREE.RepeatWrapping
  stoneTexture.magFilter = THREE.NearestFilter
  stoneTexture.minFilter = THREE.LinearMipMapLinearFilter

  for (let i = 0; i < 20; i++) {
    const stoneShape = new CANNON.Sphere(0.3)
    const stoneBody = new CANNON.Body({ mass: 80, material: physicsMaterial })
    stoneBody.addShape(stoneShape)
    stonesBody.push(stoneBody)

    const stoneGeometry = new THREE.SphereGeometry(stoneShape.radius, 8, 8)
    const material = new THREE.MeshLambertMaterial({
      color: 0x232426,
      side: THREE.FrontSide,
      map: stoneTexture
    })
    const stoneMesh = new THREE.Mesh(stoneGeometry, material)
    stoneMesh.castShadow = true
    stones.push(stoneMesh)
  }
}

function getRandPosition(index) {
  const position = new THREE.Vector3()
  const x = xPositions[index]
  const y = Math.floor(Math.random() * 20) + 5
  position.set(x, y, 0.7)
  return position
}

function positioningEnemies() {
  for (let i = 1; i < numEnemies + 1; i++) {
    const pos = getRandPosition(i)
    world.add(catapultsBody[i])
    scene.add(catapultsMesh[i])
    catapultsBody[i].position.copy(pos)

    collidables[i].position.set(pos.x + 1, pos.y + 1, pos.z)
    scene.add(collidables[i])

    standsBody[i].position.set(pos.x + 1, pos.y - 0.9, pos.z - 0.5)
    world.add(standsBody[i])
    scene.add(standsMesh[i])
  }
}

function throwStone(catapultBody, shootDirection, shootVelocity, name) {
  if (countStones > 19) countStones = 0

  const stoneBody = stonesBody[countStones]
  const stoneMesh = stones[countStones]
  scene.add(stoneMesh)
  world.add(stoneBody)

  stoneBody.velocity.set(
    shootDirection.x * shootVelocity,
    shootDirection.y * shootVelocity,
    shootDirection.z * shootVelocity
  )
  let { x, y, z } = catapultBody.position
  x += shootDirection.x * (2)
  y += shootDirection.y * (3)
  z += shootDirection.z * (2)

  stoneBody.position.set(x, y, z)
  stoneMesh.position.set(x, y, z)
  stoneMesh.name = name
  userShootVelocity = 0
  countStones++
}

function victory() {
  document.getElementById('game').innerHTML = 'Victory'
  document.getElementById('game').style.color = '#0AB408'
  document.getElementById('game').style.display = 'block'
}

function gameOver() {
  document.getElementById('game').innerHTML = 'Game over'
  document.getElementById('game').style.color = 'red'
  document.getElementById('game').style.display = 'block'
  positionUser()
}

const checkVictory = () => {
  if (catapultsMesh[0].parent == null) gameOver()

  let check = 0
  for (let i = 1; i < numEnemies + 1; i++)
    if (catapultsMesh[i].parent == scene)
      check++

  if (check === 0) victory()
}

function enemyAttack() {
  for (let i = 1; i < numEnemies + 1; i++)
    if (catapultsBody[i].world === world)
      throwStone(catapultsBody[i], new THREE.Vector3(-1, 1, 0), Math.random() * 12.5 + 8, 'enemy')
  checkVictory()
}

function attack() {
  throwStone(catapultsBody[0], new THREE.Vector3(1, 1, 0), userShootVelocity, 'user')
  checkVictory()
}

function updatePhysics() {
  world.step(1 / 60)
  stonesBody.forEach((stoneBody, i) => {
    stones[i].position.copy(stoneBody.position)
    stones[i].quaternion.copy(stoneBody.quaternion)
  })

  catapultsBody.forEach((catapultBody, i) => {
    catapultsMesh[i].position.copy(catapultBody.position)
    catapultsMesh[i].quaternion.copy(catapultBody.quaternion)
  })

  standsBody.forEach((standBody, i) => {
    standsMesh[i].position.copy(standBody.position)
    standsMesh[i].quaternion.copy(standBody.quaternion)
  })
}

/* LOOP */

function update() {
  requestAnimationFrame(update)
  if (pause) return

  if (keyboard.pressed.KeyA && userShootVelocity < 50) {
    document.getElementById('power').innerHTML = 'power :' + userShootVelocity
    userShootVelocity += 0.5
  }

  updatePhysics()

  for (let i = 0; i < stones.length; i++)
    checkCollison(stones[i], collidables)

  if (clock.getElapsedTime() > lastEnemyAttack + 3) {
    lastEnemyAttack = clock.getElapsedTime()
    enemyAttack()
  }
  renderer.render(scene, activeCamera)
}

/* EVENTS */

window.addEventListener('load', update)

window.addEventListener('keyup', e => {
  if (e.code == 'KeyA') attack()

  if (e.code == 'KeyC')
    activeCamera = activeCamera === camera ? camera2 : camera

  if (e.code == 'Space') {
    positioningEnemies()
    activeCamera = camera
    document.getElementById('instruction').style.display = 'none'
    document.getElementById('game').style.display = 'none'
    document.getElementById('game').innerHTML = ''
    pause = false
  }
})
