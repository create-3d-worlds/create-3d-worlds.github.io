/* global $, THREE */

const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ], // 0
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, ], // 1
    [1, 1, 0, 0, 2, 0, 0, 0, 0, 1, ], // 2
    [1, 0, 0, 0, 0, 2, 0, 0, 0, 1, ], // 3
    [1, 0, 0, 2, 0, 0, 2, 0, 0, 1, ], // 4
    [1, 0, 0, 0, 2, 0, 0, 0, 1, 1, ], // 5
    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, ], // 6
    [1, 1, 1, 0, 0, 1, 0, 0, 1, 1, ], // 7
    [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, ], // 8
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ], // 9
  ], mapW = map.length, mapH = map[0].length

const WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  ASPECT = WIDTH / HEIGHT,
  UNITSIZE = 250,
  WALLHEIGHT = UNITSIZE / 3,
  MOVESPEED = 100,
  LOOKSPEED = 0.075,
  BULLETMOVESPEED = MOVESPEED * 5,
  NUMAI = 5,
  PROJECTILEDAMAGE = 20

const ai = []
const mouse = { x: 0, y: 0 }
let runAnim = true
let kills = 0
let health = 100
let lastHealthPickup = 0

const clock = new THREE.Clock()
const scene = new THREE.Scene()
const textureLoader = new THREE.TextureLoader()

const camera = new THREE.PerspectiveCamera(60, ASPECT, 1, 10000) // FOV, aspect, near, far
camera.position.y = UNITSIZE * .2
scene.add(camera)

const controls = new THREE.FirstPersonControls(camera)
controls.movementSpeed = MOVESPEED
controls.lookSpeed = LOOKSPEED
controls.lookVertical = false // Temporary solution; play on flat surfaces only
controls.noFly = true

const renderer = new THREE.WebGLRenderer()
renderer.setSize(WIDTH, HEIGHT)

renderer.domElement.style.backgroundColor = '#D6F1FF' // easier to see
document.body.appendChild(renderer.domElement)

const healthcube = new THREE.Mesh(
  new THREE.BoxGeometry(30, 30, 30),
  new THREE.MeshBasicMaterial({map: textureLoader.load('images/health.png')})
)
healthcube.position.set(-UNITSIZE - 15, 35, -UNITSIZE - 15)
scene.add(healthcube)

const bullets = []
const sphereMaterial = new THREE.MeshBasicMaterial({color: 0x333333})
const sphereGeo = new THREE.SphereGeometry(2, 6, 6)
const aiGeo = new THREE.BoxGeometry(40, 40, 40)

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
}

function getMapSector(v) {
  const x = Math.floor((v.x + UNITSIZE / 2) / UNITSIZE + mapW / 2)
  const z = Math.floor((v.z + UNITSIZE / 2) / UNITSIZE + mapW / 2)
  return {x, z}
}

// Check whether a Vector3 is inside a wall
function checkWallCollision(v) {
  const c = getMapSector(v)
  return map[c.x][c.z] > 0
}

function getRandBetween(lo, hi) {
  return parseInt(Math.floor(Math.random() * (hi - lo + 1)) + lo, 10)
}

function addAI() {
  let x, z
  const c = getMapSector(camera.position)
  const aiMaterial = new THREE.MeshBasicMaterial({/* color: 0xEE3333,*/map: textureLoader.load('images/face.png')})
  const o = new THREE.Mesh(aiGeo, aiMaterial)
  do {
    x = getRandBetween(0, mapW - 1)
    z = getRandBetween(0, mapH - 1)
  } while (map[x][z] > 0 || (x == c.x && z == c.z))
  x = Math.floor(x - mapW / 2) * UNITSIZE
  z = Math.floor(z - mapW / 2) * UNITSIZE
  o.position.set(x, UNITSIZE * 0.15, z)
  o.health = 100
  o.pathPos = 1
  o.lastRandomX = Math.random()
  o.lastRandomZ = Math.random()
  o.lastShot = Date.now() // Higher-fidelity timers aren'THREE a big deal here.
  ai.push(o)
  scene.add(o)
}

function createBullet(obj) {
  if (obj === undefined) 
    obj = camera // eslint-disable-line

  const sphere = new THREE.Mesh(sphereGeo, sphereMaterial)
  sphere.position.set(obj.position.x, obj.position.y * 0.8, obj.position.z)
  let vector
  if (obj instanceof THREE.Camera) {
    vector = new THREE.Vector3(mouse.x, mouse.y, 1)
    vector.unproject(obj)
  } else 
    vector = camera.position.clone()
  
  sphere.ray = new THREE.Ray(obj.position, vector.sub(obj.position).normalize())
  sphere.owner = obj
  bullets.push(sphere)
  scene.add(sphere)
  return sphere
}

function render() {
  const delta = clock.getDelta(), speed = delta * BULLETMOVESPEED
  const aispeed = delta * MOVESPEED
  controls.update(delta) // Move camera

  healthcube.rotation.x += 0.004
  healthcube.rotation.y += 0.008
  // health once per minute
  if (Date.now() > lastHealthPickup + 60000) {
    if (distance(camera.position.x, camera.position.z, healthcube.position.x, healthcube.position.z) < 15 && health != 100) {
      health = Math.min(health + 50, 100)
      $('#health').html(health)
      lastHealthPickup = Date.now()
    }
    healthcube.material.wireframe = false
  }
  else 
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
      // console.log(Math.round(p.x), Math.round(p.z), c.x, c.z, x, z);
      if (p.x < c.x + x && p.x > c.x - x &&
					p.z < c.z + z && p.z > c.z - z &&
					b.owner != a) {
        bullets.splice(i, 1)
        scene.remove(b)
        a.health -= PROJECTILEDAMAGE
        const {color} = a.material, percent = a.health / 100
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
      $('#hurt').fadeIn(75)
      health -= 10
      if (health < 0) health = 0
      const val = health < 25 ? '<span style="color: darkRed">' + health + '</span>' : health
      $('#health').html(val)
      bullets.splice(i, 1)
      scene.remove(b)
      $('#hurt').fadeOut(350)
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
      $('#score').html(kills * 100)
      addAI()
    }
    // Move AI
    const r = Math.random()
    if (r > 0.995) {
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
      createBullet(a)
      a.lastShot = Date.now()
    }
  }

  renderer.render(scene, camera)

  // Death
  if (health <= 0) {
    runAnim = false
    $(renderer.domElement).fadeOut()
    $('#radar, #hud, #credits').fadeOut()
    $('#intro').fadeIn()
    $('#intro').html('Ouch! Click to restart...')
    $('#intro').one('click', () => {
      location = location
    })
  }
}

function setupScene() {
  const UNITSIZE = 250, units = mapW
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(units * UNITSIZE, 10, units * UNITSIZE),
    new THREE.MeshLambertMaterial({color: 0xEDCBA0})
  )
  scene.add(floor)

  const cube = new THREE.BoxGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE)
  const materials = [
    new THREE.MeshLambertMaterial({ map: textureLoader.load('images/wall-1.jpg')}),
    new THREE.MeshLambertMaterial({ map: textureLoader.load('images/wall-2.jpg')}),
    new THREE.MeshLambertMaterial({color: 0xFBEBCD}),
  ]
  for (let i = 0; i < mapW; i++) 
    for (let j = 0, m = map[i].length; j < m; j++) 
      if (map[i][j]) {
        const wall = new THREE.Mesh(cube, materials[map[i][j] - 1])
        wall.position.x = (i - units / 2) * UNITSIZE
        wall.position.y = WALLHEIGHT / 2
        wall.position.z = (j - units / 2) * UNITSIZE
        scene.add(wall)
      }

  const directionalLight1 = new THREE.DirectionalLight(0xF7EFBE, 0.7)
  directionalLight1.position.set(0.5, 1, 0.5)
  scene.add(directionalLight1)
  const directionalLight2 = new THREE.DirectionalLight(0xF7EFBE, 0.5)
  directionalLight2.position.set(-0.5, -1, -0.5)
  scene.add(directionalLight2)
}

function drawRadar() {
  const c = getMapSector(camera.position)
  const context = document.getElementById('radar').getContext('2d')
  for (let i = 0; i < mapW; i++) 
    for (let j = 0, m = map[i].length; j < m; j++) {
      let d = 0
      for (let k = 0, n = ai.length; k < n; k++) {
        const e = getMapSector(ai[k].position)
        if (i == e.x && j == e.z) d++
      }
      if (i == c.x && j == c.z && d == 0) {
        context.fillStyle = '#0000FF'
        context.fillRect(i * 20, j * 20, (i + 1) * 20, (j + 1) * 20)
      }
      else if (i == c.x && j == c.z) {
        context.fillStyle = '#AA33FF'
        context.fillRect(i * 20, j * 20, (i + 1) * 20, (j + 1) * 20)
        context.fillStyle = '#000000'
        context.fillText('' + d, i * 20 + 8, j * 20 + 12)
      }
      else if (d > 0 && d < 10) {
        context.fillStyle = '#FF0000'
        context.fillRect(i * 20, j * 20, (i + 1) * 20, (j + 1) * 20)
        context.fillStyle = '#000000'
        context.fillText('' + d, i * 20 + 8, j * 20 + 12)
      }
      else if (map[i][j] > 0) {
        context.fillStyle = '#666666'
        context.fillRect(i * 20, j * 20, (i + 1) * 20, (j + 1) * 20)
      }
      else {
        context.fillStyle = '#CCCCCC'
        context.fillRect(i * 20, j * 20, (i + 1) * 20, (j + 1) * 20)
      }
    }
}

function handleMouseMove(e) {
  e.preventDefault()
  mouse.x = (e.clientX / WIDTH) * 2 - 1
  mouse.y = - (e.clientY / HEIGHT) * 2 + 1
}

function setupAI() {
  for (let i = 0; i < NUMAI; i++) addAI()
}

function animate() {
  if (runAnim)
    requestAnimationFrame(animate)	
  render()
}

/* INIT */

$('#intro').on('click', () => {
  $('#intro').hide()
  setupScene()
  setupAI()
  setInterval(drawRadar, 1000)
  animate()
})

/* EVENTS */

document.addEventListener('mousemove', handleMouseMove, false)

document.addEventListener('click', e => {
  if (e.which === 1) createBullet() // Left click only
})
