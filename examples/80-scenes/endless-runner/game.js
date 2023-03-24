import * as THREE from 'three'
import { camera, scene, renderer, clock, addScoreUI } from '/utils/scene.js'
import { createBall, createWorldSphere } from '/utils/geometry.js'
import { createFir } from '/utils/geometry/trees.js'
import { hemLight } from '/utils/light.js'
import input from '/utils/classes/Input.js'
import Particles from '/utils/classes/Particles.js'

const { randFloat, randInt } = THREE.MathUtils
const { random } = Math

const heroSpeed = 4
const worldSpeed = 0.007
const worldRadius = 26
const heroRadius = 0.2
const heroBaseY = 1.8
const treeReleaseInterval = 0.5
const treesInPool = 10

const treesPool = []
const laneTrees = []
const lanes = [-1, 0, 1]

let laneIndex = 1
let jumping = false
let bounceValue = 0.1

/* LIGHT & CAMERA */

hemLight({ skyColor: 0xfffafa, groundColor: 0x000000, intensity: .9 })

scene.fog = new THREE.FogExp2(0xf0fff0, 0.1)

camera.position.set(0, 3, 6.5)
clock.start()

/* INIT */

const player = createBall({ r: heroRadius })
player.position.set(lanes[laneIndex], heroBaseY, 4.8)
scene.add(player)

const earth = createWorldSphere({ r: worldRadius })
earth.position.set(0, -24, 2)
scene.add(earth)

const explosion = new Particles({ num: 50, size: 0.07, unitAngle: 0.1 })
scene.add(explosion.mesh)

for (let i = 0; i < treesInPool; i++)
  treesPool.push(createFir({ size: 1 }))

const numTrees = 64
const gap = 6.28 / numTrees
for (let i = 0; i < numTrees; i++)
  addSideTree(i * gap, i % 2)

const updateScore = addScoreUI({ title: 'Pogotaka' })

/* FUNCTIONS */

function addLaneTree(lane) {
  if (treesPool.length == 0) return
  const pathAngleValues = [1.52, 1.57, 1.62]
  const spherical = new THREE.Spherical()
  const tree = treesPool.pop()
  tree.visible = true
  laneTrees.push(tree)
  spherical.set(worldRadius - 0.3, pathAngleValues[lane], -earth.rotation.x + 4)
  addTree(tree, spherical)
}

function addSideTree(theta, isLeft) {
  const spherical = new THREE.Spherical()
  const tree = createFir({ size: 5 })
  const forestAreaAngle = isLeft ? (1.68 + random() * .1) : (1.46 - random() * .1)
  spherical.set(worldRadius - 0.3, forestAreaAngle, theta)
  addTree(tree, spherical)
}

function addTree(tree, spherical) {
  tree.position.setFromSpherical(spherical)
  const worldVector = earth.position.clone().normalize()
  const treeVector = tree.position.clone().normalize()
  tree.quaternion.setFromUnitVectors(treeVector, worldVector)
  tree.rotation.x += randFloat(-Math.PI / 10, Math.PI / 10)
  earth.add(tree)
}

function addTreeOrTwo() {
  const available = [0, 1, 2]
  const lane = randInt(0, 2)
  addLaneTree(lane)
  available.splice(lane, 1)
  if (random() > 0.5) {
    const anotherLane = randInt(0, 1)
    addLaneTree(available[anotherLane])
  }
}

const hit = tree => {
  explosion.reset({ pos: [player.position.x, 2, 4.8], unitAngle: 0.2 })
  updateScore()
  tree.visible = false
  setTimeout(() => {
    tree.visible = true
  }, 100)
}

function updateTrees() {
  const treePos = new THREE.Vector3()
  const distantTrees = []
  laneTrees.forEach(tree => {
    if (!tree.visible) return
    treePos.setFromMatrixPosition(tree.matrixWorld)
    if (treePos.z > 6) // gone out of view
      distantTrees.push(tree)
    else if (treePos.distanceTo(player.position) <= 0.6)
      hit(tree)
  })
  distantTrees.forEach(tree => {
    laneTrees.splice(laneTrees.indexOf(tree), 1)
    treesPool.push(tree)
    tree.visible = false
  })
}

function updatePlayer() {
  const gravity = 0.007
  const heroRotation = (worldSpeed * worldRadius / heroRadius) / 5
  player.rotation.x -= heroRotation
  if (player.position.y <= heroBaseY) {
    jumping = false
    bounceValue = random() * 0.04 + 0.005
  }
  player.position.y += bounceValue
  player.position.x = THREE.MathUtils.lerp(player.position.x, lanes[laneIndex], heroSpeed * clock.getDelta())
  bounceValue -= gravity
}

const jump = val => {
  jumping = true
  bounceValue = val
}

function handleInput() {
  if (jumping) return
  if (input.left && laneIndex > 0) {
    laneIndex--
    jump(0.05)
  }
  if (input.right && laneIndex < 2) {
    laneIndex++
    jump(0.05)
  }
  if (input.up || input.pressed.Space) jump(0.1)
}

/* LOOP */

void function update() {
  earth.rotation.x += worldSpeed
  handleInput()
  updatePlayer()
  if (clock.getElapsedTime() > treeReleaseInterval) {
    clock.start()
    addTreeOrTwo()
  }
  updateTrees()
  explosion.expand()
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()
