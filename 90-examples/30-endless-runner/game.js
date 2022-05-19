import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, scene, renderer, clock, addScoreUI } from '/utils/scene.js'
import { createBall, createWorldSphere } from '/utils/spheres.js'
import { createSun } from './helpers/createSun.js'
import { createFir } from '/utils/trees.js'
import { createParticles } from '/utils/particles.js'
import { hemLight } from '/utils/light.js'
import { randomInRange } from '/utils/helpers.js'
import keyboard from '/classes/Keyboard.js'

const rollingSpeed = 0.008
const worldRadius = 26
const heroRadius = 0.2
const heroBaseY = 1.8
const treeReleaseInterval = 0.5
const treesInPool = 10
const treesPool = []
const laneTrees = []
const lanes = [-1, 0, 1]
const heroRollingSpeed = (rollingSpeed * worldRadius / heroRadius) / 5

let explosionPower
let laneIndex = 1
let jumping = false
let bounceValue = 0.1

/* LIGHT & CAMERA */

scene.add(createSun())
hemLight({ skyColor: 0xfffafa, groundColor: 0x000000, intensity: .9 })

scene.fog = new THREE.FogExp2(0xf0fff0, 0.14)

camera.position.set(0, 3, 6.5)
clock.start()

/* INIT */

const player = createBall({ radius: heroRadius })
player.position.set(lanes[laneIndex], heroBaseY, 4.8)
scene.add(player)

const earth = createWorldSphere({ radius: worldRadius })
earth.position.set(0, -24, 2)
scene.add(earth)

const particles = createParticles({ num: 30 })
scene.add(particles)

for (let i = 0; i < treesInPool; i++) treesPool.push(createFir({ size: 1 }))

const numTrees = 36
const gap = 6.28 / numTrees
for (let i = 0; i < numTrees; i++) {
  addSideTree(i * gap, true)
  addSideTree(i * gap, false)
}

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
  const forestAreaAngle = isLeft ? 1.68 + Math.random() * 0.1 : 1.46 - Math.random() * 0.1
  spherical.set(worldRadius - 0.3, forestAreaAngle, theta)
  addTree(tree, spherical)
}

function addTree(tree, spherical) {
  tree.position.setFromSpherical(spherical)
  const worldVector = earth.position.clone().normalize()
  const treeVector = tree.position.clone().normalize()
  tree.quaternion.setFromUnitVectors(treeVector, worldVector)
  tree.rotation.x += Math.random() * (2 * Math.PI / 10) - Math.PI / 10
  earth.add(tree)
}

function addTreeOrTwo() {
  const lanes = [0, 1, 2]
  const lane = Math.floor(Math.random() * 3)
  addLaneTree(lane)
  lanes.splice(lane, 1)
  if (Math.random() > 0.5) {
    const anotherLane = Math.floor(Math.random() * 2)
    addLaneTree(lanes[anotherLane])
  }
}

const hit = tree => {
  explode()
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

function updateExplosion() {
  if (!particles.visible) return
  particles.geometry.vertices.forEach(vertex => {
    vertex.multiplyScalar(explosionPower)
  })
  if (explosionPower > 1.005) explosionPower -= 0.001
  else particles.visible = false
  particles.geometry.verticesNeedUpdate = true
}

function explode() {
  particles.position.set(player.position.x, 2, 4.8)
  particles.geometry.vertices.forEach(vertex => {
    vertex.x = randomInRange(-0.2, 0.2)
    vertex.y = randomInRange(-0.2, 0.2)
    vertex.z = randomInRange(-0.2, 0.2)
  })
  explosionPower = 1.07
  particles.visible = true
}

function updatePlayer() {
  const gravity = 0.005
  player.rotation.x -= heroRollingSpeed
  if (player.position.y <= heroBaseY) {
    jumping = false
    bounceValue = (Math.random() * 0.04) + 0.005
  }
  player.position.y += bounceValue
  player.position.x = THREE.Math.lerp(player.position.x, lanes[laneIndex], 2 * clock.getDelta())
  bounceValue -= gravity
}

const jump = val => {
  jumping = true
  bounceValue = val
}

function handleInput() {
  if (jumping) return
  if (keyboard.left && laneIndex > 0) {
    laneIndex--
    jump(0.06)
  }
  if (keyboard.right && laneIndex < 2) {
    laneIndex++
    jump(0.06)
  }
  if (keyboard.up) jump(0.1)
}

/* LOOP */

void function update() {
  earth.rotation.x += rollingSpeed
  handleInput()
  updatePlayer()
  if (clock.getElapsedTime() > treeReleaseInterval) {
    clock.start()
    addTreeOrTwo()
  }
  updateTrees()
  updateExplosion()
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()
