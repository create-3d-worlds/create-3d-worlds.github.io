const mountains = document.getElementsByClassName('sky-box')[0]
const canvas = document.getElementsByTagName('canvas')[0]
const ctx = canvas.getContext('2d')

const randSpread = range => range * (Math.random() - Math.random())

const elements = [
  {
    number: 50,
    range: { x: 10, y: 0, z: 10 },
    origin: { x: 0, y: 0, z: 0 },
    urls: [
      'images/evergreen.png',
      'images/A_Lumpy_Evergreen.png',
      'images/Totally_Normal_Tree.png',
      'images/Boulder_Flintless.png',
    ],
  },
  {
    number: 30,
    range: { x: 10, y: 0.5, z: 10 },
    origin: { x: 0, y: 2, z: 0 },
    urls: [
      'images/Gnat_Swarm.png'
    ],
  },
]

const totalImages = elements.reduce((acc, el) => acc + el.urls.length, 0)
const sprites = []
const sensitivity = 0.04
const cameraPos = { x: 0, y: -1.4, z: -2 }

let width, height
let worldRot = 0
let dWorldRot = 0
let loadedImages = 0

/* CLASSES */

class Vector {
  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }

  rotate(ang) {
    const cos = Math.cos(ang)
    const sin = Math.sin(ang)
    const { x } = this
    const { z } = this
    this.x = x * cos - z * sin
    this.z = x * sin + z * cos
  }
}

const camera = new Vector(cameraPos.x, cameraPos.y, cameraPos.z)

class Sprite {
  constructor(el) {
    const x = el.origin.x + randSpread(el.range.x)
    const y = el.origin.y + randSpread(el.range.y)
    const z = el.origin.z + randSpread(el.range.z)
    this.v = new Vector(x, y, z)

    this.image = new Image()
    this.image.src = el.urls[(Math.random() * el.urls.length) | 0]

    this.size = 2
    this.xl = this.image.naturalWidth * this.size
    this.yl = this.image.naturalHeight * this.size
  }

  rotate(ang) {
    this.v.rotate(ang)
  }

  outOfBounds(z, x, y, xl, yl) {
    return z <= camera.z || x < 0 || y < 0 || x >= width - xl || y >= height - yl
  }

  project() {
    const DZ = height / (camera.z - this.v.z)
    const PX = (camera.x + this.v.x) * DZ
    const PY = (camera.y + this.v.y) * DZ
    return {
      x: PX + width / 2,
      y: PY + height / 2,
      dz: DZ,
      z: this.v.z
    }
  }

  render() {
    const P = this.project()
    const SZ = P.dz / height
    const X_OFFS = this.xl / 6
    if (this.outOfBounds(P.z, P.x + X_OFFS, P.y, this.xl * SZ, this.yl * SZ)) return

    ctx.beginPath()
    ctx.drawImage(this.image, P.x + X_OFFS, P.y, this.xl * SZ, this.yl * SZ)
    ctx.closePath()
  }
}

/* FUNCTIONS */

const renderSprites = () => {
  sprites.sort((a, b) => b.v.z - a.v.z)
  for (const s of sprites) {
    s.rotate(dWorldRot)
    s.render()
  }
}

const updateBg = () => {
  mountains.style.backgroundPosition = -((worldRot / Math.PI) * 2) * 100 + '%'
}

const loop = () => {
  worldRot += dWorldRot
  ctx.clearRect(0, 0, width, height)
  updateBg()
  renderSprites()
  requestAnimationFrame(loop)
}

const createSprites = el => {
  for (let i = 0; i < el.number; ++i)
    sprites.push(new Sprite(el))
}

const resize = () => {
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = width * devicePixelRatio | 0
  canvas.height = height * devicePixelRatio | 0
  ctx.scale(devicePixelRatio, devicePixelRatio)
}

const init = () => {
  elements.forEach(createSprites)
  loop()
}

const preload = obj => {
  for (let i = 0; i < obj.urls.length; ++i) {
    const img = new Image()
    img.src = obj.urls[i]
    img.addEventListener('load', () => {
      if (++loadedImages === totalImages) init()
    })
  }
}

/* INIT */

resize()
updateBg()
elements.forEach(preload)

/* EVENTS */

document.addEventListener('mousemove', e => {
  const MOUSE_X = e.clientX - width / 2
  dWorldRot = (-MOUSE_X / width) * sensitivity
})

window.onresize = resize
