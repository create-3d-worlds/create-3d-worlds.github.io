import { FirstPersonControls } from '/node_modules/three119/examples/jsm/controls/FirstPersonControls.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import {
  getMapCell, createHealth, createEnemy, isWall, createFloor, createWalls, createBullet, distance, distanceTo, isHit, randomXZ, updateBullet, remove, hitEnemy
} from './utils.js'
import { UNITSIZE, MOVESPEED, LOOKSPEED, NUM_AI, INITIAL_HEALTH } from './constants.js'
import { translateMouse } from '/utils/helpers.js'
import { dirLight } from '/utils/light.js'

// TODO: fix collision

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
  for (const enemy of enemies)
    if (isHit(bullet, enemy)) {
      removeBullet(bullet, i)
      hitEnemy(enemy)
      return true
    }
  return false
}

function checkBulletHitPlayer(b, i) {
  if (distanceTo(b, camera) > 25 || b.owner == camera) return
  health = (health - 10 < 0) ? 0 : health - 10
  document.querySelector('#health').innerHTML = health
  removeBullet(b, i)
}

function updateBullets(delta) {
  bullets.forEach((b, i) => {
    if (isWall(b.position)) return removeBullet(b, i)
    const hit = checkBulletHitEnemy(b, i)
    checkBulletHitPlayer(b, i)
    if (!hit) updateBullet(b, delta)
  })
}

const killEnemy = (enemy, i) => {
  removeEnemy(enemy, i)
  kills++
  document.querySelector('#score').innerHTML = kills * 100
}

const moveEnemy = (enemy, delta) => {
  const speed = delta * MOVESPEED
  if (Math.random() > 0.995) {
    enemy.lastRandomX = Math.random() * 2 - 1
    enemy.lastRandomZ = Math.random() * 2 - 1
  }
  enemy.translateX(speed * enemy.lastRandomX)
  enemy.translateZ(speed * enemy.lastRandomZ)
  if (isWall(enemy.position)) {
    enemy.translateX(-2 * speed * enemy.lastRandomX)
    enemy.translateZ(-2 * speed * enemy.lastRandomZ)
    enemy.lastRandomX = Math.random() * 2 - 1
    enemy.lastRandomZ = Math.random() * 2 - 1
  }
}

const checkEnemyFire = enemy => {
  const enemyCell = getMapCell(enemy.position)
  const playerCell = getMapCell(camera.position)
  if (Date.now() - enemy.lastShot > 750 && distance(enemyCell, playerCell) < 2) {
    shoot(enemy, mouse)
    enemy.lastShot = Date.now()
  }
}

function updateEnemies(delta) {
  enemies.forEach((enemy, i) => {
    if (enemy.health <= 0) killEnemy(enemy, i)
    moveEnemy(enemy, delta)
    checkEnemyFire(enemy)
  })
}

function setupEnemies() {
  for (let i = 0; i < NUM_AI; i++) addEnemy()
}

function init() {
  health = INITIAL_HEALTH
  enemies.forEach(enemy => scene.remove(enemy))
  enemies.length = kills = lastHealthPickup = 0
  setupEnemies()
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
  updateEnemies(delta)
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
  if (e.button === 0) shoot(camera, mouse) // left click
})
