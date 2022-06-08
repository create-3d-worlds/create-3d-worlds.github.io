import * as THREE from '/node_modules/three127/build/three.module.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import {
  createEnemy, isWall, isHit, randomXZ, moveBullet, remove, hitEnemy, moveEnemy
} from './utils.js'
import { UNITSIZE, NUM_AI, INITIAL_HEALTH, mapWidth } from './constants.js'
import { dirLight } from '/utils/light.js'
import { createFloor } from '/utils/ground.js'
import { nemesis } from '/data/maps.js'
import { create3DMap } from '/utils/maps.js'
import FPSRenderer from '/classes/2d/FPSRenderer.js'
import { handleInput } from '/utils/player.js'
import { createBullet, createCrate } from '/utils/geometry.js'

const enemies = []
const bullets = []

let runGame = false
let kills = 0
let health = INITIAL_HEALTH

const fpsRenderer = new FPSRenderer({ targetY: 0.5 })
const player = createCrate({ size: 1 })
scene.add(player)

dirLight({ color: 0xF7EFBE, intensity: 0.7, position: [0.5, 1, 0.5] })
dirLight({ color: 0xF7EFBE, intensity: 0.5, position: [-0.5, -1, -0.5] })

const floor = createFloor({ size: mapWidth * UNITSIZE, file: 'ground.jpg' })
const walls = create3DMap({ matrix: nemesis, size: UNITSIZE })
scene.add(floor, walls)

camera.position.set(0, 1.5, 0)
player.add(camera)
scene.add(player)

/* FUNCTIONS */

const removeEnemy = (el, i) => remove(enemies, el, i)

const removeBullet = (el, i) => remove(bullets, el, i)

const addBullet = owner => {
  const bullet = createBullet()
  bullet.position.set(owner.position.x, owner.position.y + .5, owner.position.z)
  const vector = new THREE.Vector3(0, 0, 1) // center of the screen
  vector.unproject(camera)
  bullet.ray = new THREE.Ray(owner.position, vector.sub(owner.position).normalize())
  bullet.owner = owner
  bullets.push(bullet)
  scene.add(bullet)
}

function addEnemy() {
  const mesh = createEnemy(randomXZ())
  enemies.push(mesh)
  scene.add(mesh)
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

function updateBullets(delta) {
  bullets.forEach((bullet, i) => {
    if (isWall(bullet.position)) return removeBullet(bullet, i)
    if (!bulletHitEnemy(bullet, i)) moveBullet(bullet, delta)
  })
}

const killEnemy = (enemy, i) => {
  removeEnemy(enemy, i)
  kills++
  document.querySelector('#score').innerHTML = kills * 100
}

function updateEnemies(delta) {
  enemies.forEach((enemy, i) => {
    if (enemy.health <= 0) killEnemy(enemy, i)
    moveEnemy(enemy, delta)
  })
}

function reset() {
  enemies.forEach(x => scene.remove(x))
  bullets.forEach(x => scene.remove(x))
  enemies.length = bullets.length = kills = 0
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
  handleInput(player, delta)
  updateBullets(delta)
  updateEnemies(delta)
  fpsRenderer.render(clock.getElapsedTime())
  if (health <= 0)
    runGame = false
  renderer.render(scene, camera)
}

/* EVENTS */

document.addEventListener('click', e => {
  if (!runGame) reset()
  if (e.button === 0) addBullet(player)
})
