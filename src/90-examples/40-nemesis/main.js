import { FirstPersonControls } from '/node_modules/three119/examples/jsm/controls/FirstPersonControls.js'
import { nemesis as map } from '/data/maps.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import {
  UNITSIZE, getMapSector, createHealth, createAi, checkWallCollision, createFloor, createWalls, createBullet, distance, distanceTo
} from './utils.js'
import { randomInt, translateMouse } from '/utils/helpers.js'
import { dirLight } from '/utils/light.js'

// TODO: fix collision

const mapW = map.length
const mapH = map[0].length

const MOVESPEED = 100
const LOOKSPEED = 0.1
const BULLETMOVESPEED = MOVESPEED * 5
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

const shoot = (camera, mouse) => {
  const sphere = createBullet(camera, mouse)
  bullets.push(sphere)
  scene.add(sphere)
}

function addAI() {
  let x, z
  const c = getMapSector(camera.position)
  do {
    x = randomInt(0, mapW - 1)
    z = randomInt(0, mapH - 1)
  } while (map[x][z] > 0 || (x == c.x && z == c.z))

  x = Math.floor(x - mapW / 2) * UNITSIZE
  z = Math.floor(z - mapW / 2) * UNITSIZE
  const mesh = createAi({ x, z })
  ai.push(mesh)
  scene.add(mesh)
}

function updateHealthBox() {
  healthBox.rotation.x += 0.004
  healthBox.rotation.y += 0.008
  const refillAvailable = Date.now() - lastHealthPickup > 60000 // 1 minute
  healthBox.material.wireframe = !refillAvailable
  if (refillAvailable && distanceTo(camera, healthBox) < 20 && health < INITIAL_HEALTH) {
    health = INITIAL_HEALTH
    document.querySelector('#health').innerHTML = health
    lastHealthPickup = Date.now()
  }
}

function updateBullets(delta) {
  const speed = delta * BULLETMOVESPEED
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i], p = b.position, d = b.ray.direction
    if (checkWallCollision(p)) {
      bullets.splice(i, 1)
      scene.remove(b)
      continue
    }
    // Collide with AI
    let hit = false
    for (let j = ai.length - 1; j >= 0; j--) {
      const a = ai[j]
      const v = a.geometry.vertices[0]
      const c = a.position
      const x = Math.abs(v.x), z = Math.abs(v.z)
      if (p.x < c.x + x && p.x > c.x - x &&
					p.z < c.z + z && p.z > c.z - z &&
					b.owner != a) {
        bullets.splice(i, 1)
        scene.remove(b)
        a.health -= PROJECTILEDAMAGE
        const { color } = a.material, percent = a.health / 100
        a.material.color.setRGB(
          percent * color.r,
          percent * color.g,
          percent * color.b
        )
        hit = true
        break
      }
    }
    // Bullet hits player
    if (distanceTo(b, camera) < 25 && b.owner != camera) {
      health -= 10
      if (health < 0) health = 0
      const val = health < 25 ? '<span style="color: darkRed">' + health + '</span>' : health
      document.querySelector('#health').innerHTML = val
      bullets.splice(i, 1)
      scene.remove(b)
    }
    if (!hit) {
      b.translateX(speed * d.x)
      b.translateZ(speed * d.z)
    }
  }
}

function updateAI(delta) {
  const aispeed = delta * MOVESPEED
  ai.forEach((a, i) => {
    // kill ai
    if (a.health <= 0) {
      ai.splice(i, 1)
      scene.remove(a)
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
      ai.splice(i, 1)
      scene.remove(a)
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
