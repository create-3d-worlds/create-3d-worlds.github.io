const CANVAS = document.getElementsByTagName('canvas')[0]
const SKY_BOX = document.getElementsByClassName('sky-box')[0]
const CTX = CANVAS.getContext('2d')

const randSpread = range => range * (Math.random() - Math.random())

const SENSITIVITY = 0.04
const SPRITES = []
const CAMERA_INIT = {
  x: 0,
  y: -1.4,
  z: -2
}

const ELEMENTS = {
  trees: {
    number: 50,
    range: { x: 10, y: 0, z: 10 },
    origin: { x: 0, y: 0, z: 0 },
    urls: [
      'images/evergreen.png',
      'images/A_Lumpy_Evergreen.png',
      'images/Totally_Normal_Tree.png',
      'images/Boulder_Flintless.png',
    ],
    images: []
  },
  clouds: {
    number: 30,
    range: { x: 10, y: 0.5, z: 10 },
    origin: { x: 0, y: 2, z: 0 },
    urls: [
      'images/Gnat_Swarm.png'
    ],
    images: []
  },
}

let width, height
let worldRot = 0
let dWorldRot = 0
let loadedImages = 0

let totalImages = 0
for (const key in ELEMENTS)
  totalImages += ELEMENTS[key].urls.length

/* CLASSES */

class Vector {
  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }

  rotate(ang) {
    const COS = Math.cos(ang)
    const SIN = Math.sin(ang)
    const X = this.x
    const Z = this.z
    this.x = X * COS - Z * SIN
    this.z = X * SIN + Z * COS
  }
}

const camera = new Vector(CAMERA_INIT.x, CAMERA_INIT.y, CAMERA_INIT.z)

class Sprite {
  constructor(el) {
    const X = el.origin.x + randSpread(el.range.x)
    const Y = el.origin.y + randSpread(el.range.y)
    const Z = el.origin.z + randSpread(el.range.z)
    this.v = new Vector(X, Y, Z)
    this.sz = 2
    this.image = el.images[(Math.random() * el.images.length) | 0]
    this.xl = this.image.naturalWidth * this.sz
    this.yl = this.image.naturalHeight * this.sz
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

    CTX.beginPath()
    CTX.drawImage(this.image, P.x + X_OFFS, P.y, this.xl * SZ, this.yl * SZ)
    CTX.closePath()
  }
}

/* FUNCTIONS */

const renderSprites = () => {
  SPRITES.sort((a, b) => b.v.z - a.v.z)
  for (const s of SPRITES) {
    s.rotate(dWorldRot)
    s.render()
  }
}

const updateSkyBox = () => {
  SKY_BOX.style.backgroundPosition = -((worldRot / Math.PI) * 2) * 100 + '%'
}

const loop = () => {
  worldRot += dWorldRot
  CTX.clearRect(0, 0, width, height)
  updateSkyBox()
  renderSprites()
  requestAnimationFrame(loop)
}

const create = el => {
  for (let i = 0; i < el.number; ++i)
    SPRITES.push(new Sprite(el))
}

const setDim = () => {
  width = window.innerWidth
  height = window.innerHeight
  CANVAS.width = width * devicePixelRatio | 0
  CANVAS.height = height * devicePixelRatio | 0
  CTX.scale(devicePixelRatio, devicePixelRatio)
}

const init = () => {
  for (const key in ELEMENTS) create(ELEMENTS[key])
  loop()
}

const preload = obj => {
  for (let i = 0; i < obj.urls.length; ++i) {
    const img = new Image()
    img.src = obj.urls[i]
    img.addEventListener('load', () => {
      if (++loadedImages === totalImages) init()
    })
    obj.images.push(img)
  }
}

const preloadImages = () => {
  for (const key in ELEMENTS)
    preload(ELEMENTS[key])
}

/* INIT */

setDim()
updateSkyBox()
preloadImages()

/* LOOP */

/* EVENTS */

document.addEventListener('mousemove', e => {
  const MOUSE_X = e.clientX - width / 2
  dWorldRot = (-MOUSE_X / width) * SENSITIVITY
})

window.onresize = setDim
