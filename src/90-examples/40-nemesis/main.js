import { FirstPersonControls } from '/node_modules/three119/examples/jsm/controls/FirstPersonControls.js'
import { nemesis as map } from '/data/maps.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import {
  UNITSIZE, getMapSector, drawRadar, createHealth, createAi, checkWallCollision, createFloor, createMap, createBullet, distance
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

const ai = []
const bullets = []
const mouse = { x: 0, y: 0 }

let runAnim = false
let kills = 0
let health = 100
let lastHealthPickup = 0
let intervalId

/* INIT */

dirLight({ color: 0xF7EFBE, intensity: 0.7, position: [0.5, 1, 0.5] })
dirLight({ color: 0xF7EFBE, intensity: 0.5, position: [-0.5, -1, -0.5] })

scene.add(createFloor())
scene.add(createMap())

camera.position.y = UNITSIZE * .2

const controls = new FirstPersonControls(camera, document)
controls.movementSpeed = MOVESPEED
controls.lookSpeed = LOOKSPEED
controls.lookVertical = false

const healthcube = createHealth()
scene.add(healthcube)

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

function update(delta) {
  const speed = delta * BULLETMOVESPEED
  const aispeed = delta * MOVESPEED

  healthcube.rotation.x += 0.004
  healthcube.rotation.y += 0.008
  // health once per minute
  if (Date.now() > lastHealthPickup + 60000) {
    if (distance(camera.position.x, camera.position.z, healthcube.position.x, healthcube.position.z) < 15 && health != 100) {
      health = Math.min(health + 50, 100)
      document.querySelector('#health').innerHTML = health
      lastHealthPickup = Date.now()
    }
    healthcube.material.wireframe = false
  } else
    healthcube.material.wireframe = true

  // Update bullets. Walk backwards through the list so we can remove items.
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
    if (distance(p.x, p.z, camera.position.x, camera.position.z) < 25 && b.owner != camera) {
      // TODO: handle hurt
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

  // Update AI.
  for (let i = ai.length - 1; i >= 0; i--) {
    const a = ai[i]
    if (a.health <= 0) {
      ai.splice(i, 1)
      scene.remove(a)
      kills++
      document.querySelector('#score').innerHTML = kills * 100
      addAI()
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
  }

  if (health <= 0) {
    runAnim = false
    clearInterval(intervalId)
    // TODO: handle death
  }
}

function handleMouseMove(e) {
  e.preventDefault()
  const {x, y} = translateMouse(e)
  mouse.x = x
  mouse.y = y
}

function setupAI() {
  for (let i = 0; i < NUM_AI; i++) addAI()
}

function init() {
  ai.length = 0
  // TODO: reset health, score
  runAnim = true
  setupAI()
  intervalId = setInterval(() => {
    drawRadar(ai)
  }, 1000)
  animate()
}

/* LOOP */

function animate() {
  if (runAnim)
    requestAnimationFrame(animate)
  const delta = clock.getDelta()
  controls.update(delta) // Move camera
  update(delta)
  renderer.render(scene, camera)
}

/* EVENTS */

document.addEventListener('mousemove', handleMouseMove, false)

document.addEventListener('click', e => {
  if (!runAnim) init()
  if (e.button === 0) shoot(null, mouse) // left click
})
