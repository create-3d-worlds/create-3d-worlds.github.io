import { FirstPersonControls } from '/node_modules/three119/examples/jsm/controls/FirstPersonControls.js'
import { nemesis as map } from '/data/maps.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import {
  getMapSector, createHealth, createEnemy, checkWallCollision, createFloor, createWalls, createBullet, distance, distanceTo, isHit, randomXZ, updateBullet, remove, hitEnemy
} from './utils.js'
import { UNITSIZE, MOVESPEED, LOOKSPEED, NUM_AI, INITIAL_HEALTH } from './constants.js'
import { translateMouse } from '/utils/helpers.js'
import { dirLight } from '/utils/light.js'

// TODO: fix collision

const mapW = map.length
const mapH = map[0].length

const enemies = []
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

const removeEnemy = (el, i) => remove(enemies, el, i)

const removeBullet = (el, i) => remove(bullets, el, i)

const shoot = (player, mouse) => {
  const mesh = createBullet(player, mouse)
  bullets.push(mesh)
  scene.add(mesh)
}

function addEnemy() {
  const mesh = createEnemy(randomXZ())
  enemies.push(mesh)
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

function checkBulletHitEnemy(bullet, i) {
  let hit = false
  for (const ai of enemies)
    if (isHit(bullet, ai)) {
      removeBullet(bullet, i)
      hitEnemy(ai)
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
    const hit = checkBulletHitEnemy(b, i)
    checkBulletHitPlayer(b, i)
    if (!hit) updateBullet(b, delta)
  })
}

function updateAI(delta) {
  const aispeed = delta * MOVESPEED
  enemies.forEach((ai, i) => {
    // kill enemies
    if (ai.health <= 0) {
      removeEnemy(ai, i)
      kills++
      document.querySelector('#score').innerHTML = kills * 100
    }
    // Move AI
    if (Math.random() > 0.995) {
      ai.lastRandomX = Math.random() * 2 - 1
      ai.lastRandomZ = Math.random() * 2 - 1
    }
    ai.translateX(aispeed * ai.lastRandomX)
    ai.translateZ(aispeed * ai.lastRandomZ)
    const c = getMapSector(ai.position)
    if (c.x < 0 || c.x >= mapW || c.y < 0 || c.y >= mapH || checkWallCollision(ai.position)) {
      ai.translateX(-2 * aispeed * ai.lastRandomX)
      ai.translateZ(-2 * aispeed * ai.lastRandomZ)
      ai.lastRandomX = Math.random() * 2 - 1
      ai.lastRandomZ = Math.random() * 2 - 1
    }
    if (c.x < -1 || c.x > mapW || c.z < -1 || c.z > mapH) {
      removeEnemy(ai, i)
      addEnemy()
    }
    const cc = getMapSector(camera.position)
    if (Date.now() > ai.lastShot + 750 && distance(c.x, c.z, cc.x, cc.z) < 2) {
      shoot(ai, mouse)
      ai.lastShot = Date.now()
    }
  })
}

function setupAI() {
  for (let i = 0; i < NUM_AI; i++) addEnemy()
}

function init() {
  health = INITIAL_HEALTH
  enemies.forEach(ai => scene.remove(ai))
  enemies.length = kills = lastHealthPickup = 0
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
