import { FirstPersonControls } from '/node_modules/three119/examples/jsm/controls/FirstPersonControls.js'
import { nemesis as map } from '/data/maps.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import {
  getMapSector, createHealth, createAi, checkWallCollision, createFloor, createWalls, createBullet, distance, distanceTo, isHit, randomXZ, updateBullet
} from './utils.js'
import { UNITSIZE, MOVESPEED, LOOKSPEED } from './constants.js'
import { translateMouse } from '/utils/helpers.js'
import { dirLight } from '/utils/light.js'

// TODO: fix collision

const mapW = map.length
const mapH = map[0].length

const NUM_AI = 5
const PROJECTILEDAMAGE = 20
const INITIAL_HEALTH = 100

const ai = []
const bullets = []
let mouse = { x: 0, y: 0 }

let runGame = false
let kills = 0
let health = INITIAL_HEALTH
let lastHealthPickup = 0

/* INIT */

dirLight({ color: 0xF7EFBE, intensity: 0.7, position: [0.5, 1, 0.5] })
dirLight({ color: 0xF7EFBE, intensity: 0.5, position: [-0.5, -1, -0.5] })

scene.add(createFloor())
scene.add(createWalls())

camera.position.y = UNITSIZE * .2

const controls = new FirstPersonControls(camera, document)
controls.movementSpeed = MOVESPEED
controls.lookSpeed = LOOKSPEED
controls.lookVertical = false

const healthBox = createHealth()
scene.add(healthBox)

/* FUNCTIONS */

const remove = (arr, el, i) => {
  const index = i ? i : arr.findIndex(x => el.uuid == x.uuid)
  arr.splice(index, 1)
  scene.remove(el)
}

const removeAi = (a, i) => remove(ai, a, i)
const removeBullet = (b, i) => remove(bullets, b, i)

const shoot = (camera, mouse) => {
  const sphere = createBullet(camera, mouse)
  bullets.push(sphere)
  scene.add(sphere)
}

function addAI() {
  const mesh = createAi(randomXZ())
  ai.push(mesh)
  scene.add(mesh)
}

function updateHealthBox() {
  healthBox.rotation.x += 0.004
  healthBox.rotation.y += 0.008
  const refillTime = Date.now() - lastHealthPickup > 60000 // 1 minute
  healthBox.material.wireframe = !refillTime
  if (refillTime && distanceTo(camera, healthBox) < 20 && health < INITIAL_HEALTH) {
    health = INITIAL_HEALTH
    document.querySelector('#health').innerHTML = health
    lastHealthPickup = Date.now()
  }
}

function checkBulletHitAI(bullet, i) {
  let hit = false
  for (const a of ai)
    if (isHit(bullet, a) && bullet.owner != a) {
      removeBullet(bullet, i)
      a.health -= PROJECTILEDAMAGE
      const { color } = a.material
      const percent = a.health / 100
      color.setRGB(percent * color.r, percent * color.g, percent * color.b)
      hit = true
      break
    }
  return hit
}

function checkBulletHitPlayer(b, i) {
  if (distanceTo(b, camera) > 25 || b.owner == camera) return
  health -= 10
  if (health < 0) health = 0
  document.querySelector('#health').innerHTML = health
  removeBullet(b, i)
}

function updateBullets(delta) {
  bullets.forEach((b, i) => {
    if (checkWallCollision(b.position)) {
      removeBullet(b, i)
      return
    }
    const hit = checkBulletHitAI(b, i)
    checkBulletHitPlayer(b, i)
    if (!hit) updateBullet(b, delta)
  })
}

function updateAI(delta) {
  const aispeed = delta * MOVESPEED
  ai.forEach((a, i) => {
    // kill ai
    if (a.health <= 0) {
      removeAi(a, i)
      kills++
      document.querySelector('#score').innerHTML = kills * 100
    }
    // Move AI
    if (Math.random() > 0.995) {
      a.lastRandomX = Math.random() * 2 - 1
      a.lastRandomZ = Math.random() * 2 - 1
    }
    a.translateX(aispeed * a.lastRandomX)
    a.translateZ(aispeed * a.lastRandomZ)
    const c = getMapSector(a.position)
    if (c.x < 0 || c.x >= mapW || c.y < 0 || c.y >= mapH || checkWallCollision(a.position)) {
      a.translateX(-2 * aispeed * a.lastRandomX)
      a.translateZ(-2 * aispeed * a.lastRandomZ)
      a.lastRandomX = Math.random() * 2 - 1
      a.lastRandomZ = Math.random() * 2 - 1
    }
    if (c.x < -1 || c.x > mapW || c.z < -1 || c.z > mapH) {
      removeAi(a, i)
      addAI()
    }
    const cc = getMapSector(camera.position)
    if (Date.now() > a.lastShot + 750 && distance(c.x, c.z, cc.x, cc.z) < 2) {
      shoot(a, mouse)
      a.lastShot = Date.now()
    }
  })
}

function setupAI() {
  for (let i = 0; i < NUM_AI; i++) addAI()
}

function init() {
  health = INITIAL_HEALTH
  ai.forEach(a => scene.remove(a))
  ai.length = kills = lastHealthPickup = 0
  setupAI()
  runGame = true
  gameLoop()
}

/* LOOP */

function gameLoop() {
  if (runGame)
    requestAnimationFrame(gameLoop)
  const delta = clock.getDelta()
  controls.update(delta) // Move camera
  updateHealthBox()
  updateBullets(delta)
  updateAI(delta)
  if (health <= 0)
    runGame = false
  renderer.render(scene, camera)
}

/* EVENTS */

document.addEventListener('mousemove', e => {
  mouse = translateMouse(e)
})

document.addEventListener('click', e => {
  if (!runGame) init()
  if (e.button === 0) shoot(null, mouse) // left click
})
