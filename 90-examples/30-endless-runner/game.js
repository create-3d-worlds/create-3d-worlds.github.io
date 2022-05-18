import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, scene, renderer, clock, addScoreUI } from '/utils/scene.js'
import { createBall, createWorldSphere } from '/utils/spheres.js'
import { createSun } from './helpers/createSun.js'
import { createFir } from './helpers/createTree.js'
import { createParticles } from './helpers/createParticles.js'
import { hemLight } from '/utils/light.js'

const rollingSpeed = 0.008
const worldRadius = 26
const heroRadius = 0.2
const heroBaseY = 1.8
const treeReleaseInterval = 0.5
const treesInPool = 10
const treesPool = []
const treesInPath = []
const lanes = [-1, 0, 1]
const heroRollingSpeed = (rollingSpeed * worldRadius / heroRadius) / 5
const pathAngleValues = [1.52, 1.57, 1.62]

let laneIndex = 1
let jumping = false
let explosionPower = 1.06
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

const world = createWorldSphere({ radius: worldRadius })
world.position.set(0, -24, 2)
scene.add(world)

const particles = createParticles(30)
scene.add(particles)

for (let i = 0; i < treesInPool; i++) treesPool.push(createFir())

// side trees
const numTrees = 36
const gap = 6.28 / numTrees
for (let i = 0; i < numTrees; i++) {
  addTree(false, i * gap, true)
  addTree(false, i * gap, false)
}

const updateScore = addScoreUI({ title: 'Pogotaka' })

/* FUNCTIONS */

function addTree(inPath, row, isLeft) {
  const sphericalHelper = new THREE.Spherical()
  let newTree
  if (inPath) {
    if (treesPool.length == 0) return
    newTree = treesPool.pop()
    newTree.visible = true
    treesInPath.push(newTree)
    sphericalHelper.set(worldRadius - 0.3, pathAngleValues[row], -world.rotation.x + 4)
  } else {
    newTree = createFir()
    const forestAreaAngle = isLeft ? 1.68 + Math.random() * 0.1 : 1.46 - Math.random() * 0.1
    sphericalHelper.set(worldRadius - 0.3, forestAreaAngle, row)
  }
  newTree.position.setFromSpherical(sphericalHelper)
  const worldVector = world.position.clone().normalize()
  const treeVector = newTree.position.clone().normalize()
  newTree.quaternion.setFromUnitVectors(treeVector, worldVector)
  newTree.rotation.x += Math.random() * (2 * Math.PI / 10) - Math.PI / 10
  world.add(newTree)
}

function addPathTree() {
  const options = [0, 1, 2]
  const lane = Math.floor(Math.random() * 3)
  addTree(true, lane)
  options.splice(lane, 1)
  if (Math.random() > 0.5) {
    const secondLane = Math.floor(Math.random() * 2)
    addTree(true, options[secondLane])
  }
}

function updateTrees() {
  const treePos = new THREE.Vector3()
  const treesToRemove = []
  treesInPath.forEach(tree => {
    if (!tree.visible) return
    treePos.setFromMatrixPosition(tree.matrixWorld)
    if (treePos.z > 6) // gone out of view
      treesToRemove.push(tree)
    else if (treePos.distanceTo(player.position) <= 0.6) {
      explode()
      updateScore()
      tree.visible = false
      setTimeout(() => {
        tree.visible = true
      }, 100)
    }
  })
  treesToRemove.forEach(tree => {
    const fromWhere = treesInPath.indexOf(tree)
    treesInPath.splice(fromWhere, 1)
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
  particles.position.y = 2
  particles.position.z = 4.8
  particles.position.x = player.position.x
  particles.geometry.vertices.forEach(vertex => {
    vertex.x = -0.2 + Math.random() * 0.4
    vertex.y = -0.2 + Math.random() * 0.4
    vertex.z = -0.2 + Math.random() * 0.4
  })
  explosionPower = 1.07
  particles.visible = true
}

const jump = val => {
  jumping = true
  bounceValue = val
}

function movePlayer(e) {
  if (jumping) return
  // left
  if (e.keyCode === 37 && laneIndex > 0) {
    laneIndex--
    jump(0.06)
  }
  // right
  if (e.keyCode === 39 && laneIndex < 2) {
    laneIndex++
    jump(0.06)
  }
  // up
  if (e.keyCode === 38)
    jump(0.1)
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

/* LOOP */

void function update() {
  world.rotation.x += rollingSpeed
  updatePlayer()
  if (clock.getElapsedTime() > treeReleaseInterval) {
    clock.start()
    addPathTree()
  }
  updateTrees()
  updateExplosion()
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()

/* EVENTS */

document.onkeydown = movePlayer
