import { FirstPersonControls } from '/node_modules/three119/examples/jsm/controls/FirstPersonControls.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import {
  getMapCell, createHealth, createEnemy, isWall, createFloor, createWalls, createBullet, distance, isHit, randomXZ, moveBullet, remove, hitEnemy, moveEnemy
} from './utils.js'
import { UNITSIZE, LOOKSPEED, MOVESPEED, NUM_AI, INITIAL_HEALTH } from './constants.js'
import { translateMouse } from '/utils/helpers.js'
import { dirLight } from '/utils/light.js'

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

const addBullet = (acter, target) => {
  const mesh = createBullet(acter, target)
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
  if (refillTime && distance(camera.position, healthBox.position) < 25 && health < INITIAL_HEALTH) {
    health = INITIAL_HEALTH
    document.querySelector('#health').innerHTML = health
    lastHealthPickup = Date.now()
  }
}

function bulletHitEnemy(bullet, i) {
  for (const enemy of enemies)
    if (isHit(bullet, enemy)) {
      removeBullet(bullet, i)
      hitEnemy(enemy)
      return true
    }
  return false
}

function checkBulletHitPlayer(bullet, i) {
  if (distance(bullet.position, camera.position) > 25 || bullet.owner == camera) return
  health = (health - 10 < 0) ? 0 : health - 10
  document.querySelector('#health').innerHTML = health
  removeBullet(bullet, i)
}

function updateBullets(delta) {
  bullets.forEach((bullet, i) => {
    if (isWall(bullet.position)) return removeBullet(bullet, i)
    checkBulletHitPlayer(bullet, i)
    if (!bulletHitEnemy(bullet, i)) moveBullet(bullet, delta)
  })
}

const killEnemy = (enemy, i) => {
  removeEnemy(enemy, i)
  kills++
  document.querySelector('#score').innerHTML = kills * 100
}

const checkEnemyFire = enemy => {
  const enemyCell = getMapCell(enemy.position)
  const playerCell = getMapCell(camera.position)
  if (Date.now() - enemy.lastShot < 750 || distance(enemyCell, playerCell) > 1) return
  addBullet(enemy)
  enemy.lastShot = Date.now()
}

function updateEnemies(delta) {
  enemies.forEach((enemy, i) => {
    if (enemy.health <= 0) killEnemy(enemy, i)
    moveEnemy(enemy, delta)
    checkEnemyFire(enemy)
  })
}

function reset() {
  enemies.forEach(x => scene.remove(x))
  bullets.forEach(x => scene.remove(x))
  enemies.length = bullets.length = kills = lastHealthPickup = 0
  health = INITIAL_HEALTH
  for (let i = 0; i < NUM_AI; i++) addEnemy()
  runGame = true
  gameLoop()
}

/* LOOP */

function gameLoop() {
  if (!runGame) return
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
  if (!runGame) reset()
  if (e.button === 0) addBullet(camera, mouse)
})
