/* global CANNON */
import * as THREE from '/node_modules/three127/build/three.module.js'
import { GLTFLoader } from '/node_modules/three127/examples/jsm/loaders/GLTFLoader.js'
import keyboard from '/classes/Keyboard.js'
import { scene, renderer, clock, createSkyBox } from '/utils/scene.js'
import { ambLight, dirLight } from '/utils/light.js'
import { createGround } from '/utils/ground.js'

const gltfloader = new GLTFLoader()

ambLight({ intensity: 2 })
dirLight({ intensity: 5 })

const stones = [], stonesBody = []

let activeCamera
let lastEnemyAttack = 0
let userShootVelocity = 4
let countStones = 0
let pause = true
let playerCatapult, enemyCatapult, playerBox, enemyBox, playerBody, enemyBody

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

/* FUNCTIONS */

function createCatapults(gltf) {
  const model = gltf.scene
  model.scale.set(.33, .33, .33)
  const halfExt = new CANNON.Vec3(0.2, 0.8, 0.8)

  const catapultShape = new CANNON.Box(halfExt)
  playerBody = new CANNON.Body({ mass: 0 })
  playerBody.addShape(catapultShape)

  enemyBody = new CANNON.Body({ mass: 0 })
  enemyBody.addShape(catapultShape)

  playerCatapult = model.clone()
  enemyCatapult = model.clone()

  playerBox = createCollidable('player')
  enemyBox = createCollidable('enemy')

  positionUser()
}

function positionUser() {
  world.add(playerBody)
  scene.add(playerCatapult)
  playerBody.position.set(mainStandBody.position.x - 1.5, mainStandBody.position.y + mainStandSize.y, mainStandBody.position.z + 1)
  playerBox.position.set(mainStandBody.position.x - 0.3, mainStandBody.position.y + mainStandSize.y + 1, mainStandBody.position.z)
  scene.add(playerBox)
}

function createCollidable(name) {
  const geometry = new THREE.BoxGeometry(3.2, 1.5, 3)
  const material = new THREE.MeshBasicMaterial({
    opacity: 0,
    side: THREE.FrontSide,
  })
  material.transparent = true
  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = name
  return mesh
}

function createTower(gltf) {
  const tower = gltf.scene
  tower.scale.set(1 / 26, 1 / 15, 1 / 26)
  tower.position.set(mainStandBody.position.x, mainStandBody.position.y - 4, mainStandBody.position.z)
  tower.castShadow = true
  scene.add(tower)
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
    const stone = new THREE.Mesh(stoneGeometry, material)
    stone.castShadow = true
    stones.push(stone)
  }
}

function getRandPosition() {
  const position = new THREE.Vector3()
  const x = -46
  const y = Math.floor(Math.random() * 20) + 5
  position.set(x, y, 0.7)
  return position
}

function positioningEnemy() {
  const pos = getRandPosition()
  world.add(enemyBody)
  scene.add(enemyCatapult)
  enemyBody.position.copy(pos)

  enemyBox.position.set(pos.x + 1, pos.y + 1, pos.z)
  scene.add(enemyBox)
}

function throwStone(catapultBody, shootDirection, shootVelocity, name) {
  if (countStones > 19) countStones = 0

  const stoneBody = stonesBody[countStones]
  const stone = stones[countStones]
  scene.add(stone)
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
  stone.position.set(x, y, z)
  stone.name = name
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
  if (playerCatapult.parent == null) gameOver()

  let check = 0
  if (enemyCatapult.parent == scene)
    check++

  if (check === 0) victory()
}

function enemyAttack() {
  if (enemyBody.world === world)
    throwStone(enemyBody, new THREE.Vector3(-1, 1, 0), Math.random() * 12.5 + 8, 'enemy')
  checkVictory()
}

function attack() {
  throwStone(playerBody, new THREE.Vector3(1, 1, 0), userShootVelocity, 'player')
  checkVictory()
}

function updatePhysics() {
  world.step(1 / 60)
  stonesBody.forEach((stoneBody, i) => {
    stones[i].position.copy(stoneBody.position)
    stones[i].quaternion.copy(stoneBody.quaternion)
  })

  playerCatapult.position.copy(playerBody.position)
  playerCatapult.quaternion.copy(playerBody.quaternion)

  enemyCatapult.position.copy(enemyBody.position)
  enemyCatapult.quaternion.copy(enemyBody.quaternion)
}

function checkCollison(stone) {
  if (stone.name == 'enemy' && stone.position.distanceTo(playerCatapult.position) < 1.5) {
    scene.remove(playerCatapult)
    scene.remove(playerBox)
    playerBody.position.set(100, -100, 100)
  }
  if (stone.name == 'player' && stone.position.distanceTo(enemyCatapult.position) < 1.5) {
    scene.remove(enemyCatapult)
    scene.remove(enemyBox)
    enemyBody.position.set(100, -100, 100)
  }
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
    checkCollison(stones[i], [playerCatapult, enemyCatapult])

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
    positioningEnemy()
    activeCamera = camera
    document.getElementById('instruction').style.display = 'none'
    document.getElementById('game').style.display = 'none'
    document.getElementById('game').innerHTML = ''
    pause = false
  }
})
