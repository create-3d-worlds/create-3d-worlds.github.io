import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, scene, renderer, clock, createOrbitControls } from '/utils/scene.js'
import {createBall} from './helpers/createBall.js'
import {createWorld} from './helpers/createWorld.js'
import {createSun} from './helpers/createSun.js'
import {createTree} from './helpers/createTree.js'
import {createParticles} from './helpers/createParticles.js'

const rollingSpeed = 0.008
const worldRadius = 26
const heroRadius = 0.2
const heroBaseY = 1.8
const leftLane = -1
const rightLane = 1
const middleLane = 0
const treeReleaseInterval = 0.5
const treesInPath = []
const treesPool = []

let currentLane = 0
let jumping = false
let explosionPower = 1.06
let bounceValue = 0.1
let score = 0

/* INIT */

clock.start()

const heroRollingSpeed = (rollingSpeed * worldRadius / heroRadius) / 5
const pathAngleValues = [1.52, 1.57, 1.62]

scene.fog = new THREE.FogExp2(0xf0fff0, 0.14)
camera.position.z = 6.5
camera.position.y = 3
renderer.setClearColor(0xfffafa, 1)

const orbitControl = createOrbitControls() // helper to rotate around in scene
orbitControl.enableKeys = false
orbitControl.enableZoom = false
orbitControl.minPolarAngle = 1.1
orbitControl.maxPolarAngle = 1.1

const scoreText = document.createElement('div')
scoreText.style.position = 'absolute'
scoreText.style.width = 100
scoreText.style.height = 100
scoreText.innerHTML = '0'
scoreText.style.top = scoreText.style.left = 20 + 'px'
document.body.appendChild(scoreText)

const player = createBall(heroRadius, middleLane, heroBaseY)
scene.add(player)

const world = createWorld(worldRadius)
scene.add(world)

const particles = createParticles(25)
scene.add(particles)

createTreesPool()
addWorldTrees()
addLight()

/* FUNCTIONS */

function createTreesPool() {
  const maxTreesInPool = 10
  for (let i = 0; i < maxTreesInPool; i++)
    treesPool.push(createTree())
}

function addLight() {
  const hemisphereLight = new THREE.HemisphereLight(0xfffafa, 0x000000, .9)
  scene.add(hemisphereLight)
  const sun = createSun()
  scene.add(sun)
}

function addPathTree() {
  const options = [0, 1, 2]
  let lane = Math.floor(Math.random() * 3)
  addTree(true, lane)
  options.splice(lane, 1)
  if (Math.random() > 0.5) {
    lane = Math.floor(Math.random() * 2)
    addTree(true, options[lane])
  }
}

function addWorldTrees() {
  const numTrees = 36
  const gap = 6.28 / 36
  for (let i = 0; i < numTrees; i++) {
    addTree(false, i * gap, true)
    addTree(false, i * gap, false)
  }
}

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
    newTree = createTree()
    const forestAreaAngle = isLeft ? 1.68 + Math.random() * 0.1 : 1.46 - Math.random() * 0.1
    sphericalHelper.set(worldRadius - 0.3, forestAreaAngle, row)
  }
  newTree.position.setFromSpherical(sphericalHelper)
  const worldVector = world.position.clone().normalize()
  const treeVector = newTree.position.clone().normalize()
  newTree.quaternion.setFromUnitVectors(treeVector, worldVector)
  newTree.rotation.x += (Math.random() * (2 * Math.PI / 10)) + -Math.PI / 10
  world.add(newTree)
}

function updateTrees() {
  const treePos = new THREE.Vector3()
  const treesToRemove = []
  treesInPath.forEach(tree => {
    treePos.setFromMatrixPosition(tree.matrixWorld)
    if (treePos.z > 6 && tree.visible) // gone out of our view zone
      treesToRemove.push(tree)
    else if (treePos.distanceTo(player.position) <= 0.6) {
      console.log('hit')
      score += 1
      scoreText.innerHTML = score.toString()
      explode()
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

function movePlayer(e) {
  if (jumping) return
  let validMove = true
  if (e.keyCode === 37) // left
    if (currentLane == middleLane) {
      currentLane = leftLane
    } else if (currentLane == rightLane) {
      currentLane = middleLane
    } else {
      validMove = false
    } else if (e.keyCode === 39) // right
    if (currentLane == middleLane) {
      currentLane = rightLane
    } else if (currentLane == leftLane) {
      currentLane = middleLane
    } else {
      validMove = false
    } else {
    if (e.keyCode === 38) { // up, jump
      bounceValue = 0.1
      jumping = true
    }
    validMove = false
  }
  if (validMove) {
    jumping = true
    bounceValue = 0.06
  }
}

function updatePlayer() {
  const gravity = 0.005
  player.rotation.x -= heroRollingSpeed
  if (player.position.y <= heroBaseY) {
    jumping = false
    bounceValue = (Math.random() * 0.04) + 0.005
  }
  player.position.y += bounceValue
  player.position.x = THREE.Math.lerp(player.position.x, currentLane, 2 * clock.getDelta())
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
