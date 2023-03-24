import * as THREE from 'three'
import * as CANNON from '/libs/cannon-es.js'
import input from '/utils/classes/Input.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import { ambLight, createSun } from '/utils/light.js'
import { createGround } from '/utils/physics-cannon.js'
import { loadModel } from '/utils/loaders.js'
import { gameOver, victory } from './utils.js'

ambLight({ intensity: 2 })
scene.add(createSun())
scene.background = new THREE.Color(0x8FBCD4)

const stones = []
const towerPosition = { x: -60, y: 5, z: 0 }
const maxVelocity = 50

let activeCamera
let lastEnemyAttack = 0
let userShootVelocity = 4
let stoneIndex = 0
let pause = true

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)

const ground = createGround({ size: 512, file: 'terrain/grass.jpg' })
scene.add(ground)
world.addBody(ground.body)

camera.position.set(-64, 14, 7)
camera.lookAt(new THREE.Vector3(-47, 10, 0))

const fpsCamera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000)
fpsCamera.position.set(-62, 16, 0)
fpsCamera.lookAt(new THREE.Vector3(-47, 14, 0))

activeCamera = camera

const { mesh: tower } = await loadModel({ file: 'tower/round/tower2.obj', mtl: 'tower/round/tower2.mtl', size: 12 })
tower.position.set(towerPosition.x, towerPosition.y - 4, towerPosition.z)
tower.castShadow = true
scene.add(tower)

const { mesh: catapult } = await loadModel({ file: 'catapult/scene.gltf', size: 1.75 })
const playerCatapult = catapult.clone()
playerCatapult.rotateY(Math.PI / 2)
const enemyCatapult = catapult.clone()
enemyCatapult.rotateY(-Math.PI / 2)

playerCatapult.position.set(towerPosition.x - 1.5, towerPosition.y + 7, towerPosition.z + 1)

createStones()

/* FUNCTIONS */

function createStones() {
  for (let i = 0; i < 20; i++) {
    const shape = new CANNON.Sphere(0.3)
    const body = new CANNON.Body({ mass: 80, material: new CANNON.Material() })
    body.addShape(shape)
    const geometry = new THREE.SphereGeometry(shape.radius, 8, 8)
    const material = new THREE.MeshLambertMaterial({
      color: 0x232426,
      side: THREE.FrontSide,
    })
    const stone = new THREE.Mesh(geometry, material)
    stone.castShadow = true
    stone.body = body
    stones.push(stone)
  }
}

function getRandPosition() {
  const y = Math.floor(Math.random() * 20)
  return new THREE.Vector3(-46, y, 0.7)
}

function positioningEnemy() {
  if (enemyCatapult.parent == null)
    scene.add(enemyCatapult)
  enemyCatapult.position.copy(getRandPosition())
}

function throwStone(catapult, shootDirection, shootVelocity, name) {
  if (stoneIndex > 19) stoneIndex = 0
  const stone = stones[stoneIndex]
  scene.add(stone)
  world.addBody(stone.body)

  // REFACTOR: should apply force not set velocity
  stone.body.velocity.set(
    shootDirection.x * shootVelocity,
    shootDirection.y * shootVelocity,
    shootDirection.z * shootVelocity
  )

  let { x, y, z } = catapult.position
  x += shootDirection.x * (2)
  y += shootDirection.y * (3)
  z += shootDirection.z * (2)
  stone.body.position.set(x, y, z)

  stone.name = name
  userShootVelocity = 0
  stoneIndex++
}

const checkVictory = () => {
  if (playerCatapult.parent == null) {
    gameOver()
    pause = true
  }
  let check = 0
  if (enemyCatapult.parent == scene)
    check++

  if (check === 0) {
    pause = true
    victory()
  }
}

function enemyAttack() {
  throwStone(enemyCatapult, new THREE.Vector3(-1, 1, 0), Math.random() * 12.5 + 8, 'enemy')
  checkVictory()
}

function attack() {
  throwStone(playerCatapult, new THREE.Vector3(1, 1, 0), userShootVelocity, 'player')
  checkVictory()
}

function checkHit(stone, catapult) {
  if (stone.position.distanceTo(catapult.position) < 1.5)
    scene.remove(catapult)
}

function checkCollison(stone) {
  if (stone.name == 'enemy') checkHit(stone, playerCatapult)
  if (stone.name == 'player') checkHit(stone, enemyCatapult)
}

function restart() {
  positioningEnemy()
  if (playerCatapult.parent == null) scene.add(playerCatapult)
  document.getElementById('msg').innerHTML = ''
  activeCamera = camera
  pause = false
}

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, activeCamera)
  if (pause) return

  if (input.pressed.Space && userShootVelocity < maxVelocity)
    userShootVelocity += 0.5

  world.step(1 / 60)
  stones.forEach(stone => {
    stone.position.copy(stone.body.position)
  })

  for (let i = 0; i < stones.length; i++)
    checkCollison(stones[i], [playerCatapult, enemyCatapult])

  if (clock.getElapsedTime() > lastEnemyAttack + 3) {
    lastEnemyAttack = clock.getElapsedTime()
    enemyAttack()
  }
}()

/* EVENTS */

window.addEventListener('keyup', e => {
  if (e.code == 'Space') attack()

  if (e.code == 'KeyC')
    activeCamera = activeCamera === camera ? fpsCamera : camera

  if (e.code == 'KeyR') restart()
})
