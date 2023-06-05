const CANVAS = document.getElementsByTagName('canvas')[0]
const SKY_BOX = document.getElementsByClassName('sky-box')[0]
const CTX = CANVAS.getContext('2d')

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
    ]
  },
  clouds: {
    number: 30,
    range: { x: 10, y: 0.5, z: 10 },
    origin: { x: 0, y: 2, z: 0 },
    urls: [
      'images/Gnat_Swarm.png'
    ]
  },
  groundItems: {
    number: 20,
    range: { x: 10, y: 0, z: 10 },
    origin: { x: 0, y: 0, z: 0 },
    urls: [
      'images/Boulder_Flintless.png',
    ]
  }
}

let width, height, camera
let worldRot = 0
let dWorldRot = 0
let loadedImages = 0

let imagesToLoad = 0
for (const key in ELEMENTS)
  imagesToLoad += ELEMENTS[key].urls.length

/* CLASSES */

class Vector {
  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }
  project() {
    const DZ = height / (camera.z - this.z)
    const PX = (camera.x + this.x) * DZ
    const PY = (camera.y + this.y) * DZ
    return {
      x: PX + width / 2,
      y: PY + height / 2,
      dz: DZ,
      z: this.z
    }
  }
  rotate(ang) {
    const COS = Math.cos(ang)
    const SIN = Math.sin(ang)
    const X = this.x
    const Y = this.y
    const Z = this.z
    this.x = X * COS - Z * SIN
    this.z = X * SIN + Z * COS
  }
}

class Sprite {
  constructor(v, images) {
    this.sz = 2
    this.v = v
    this.image = images[(Math.random() * images.length) | 0]
    this.xl = this.image.naturalWidth * this.sz
    this.yl = this.image.naturalHeight * this.sz
  }
  rotate(ang) {
    this.v.rotate(ang)
  }
  render() {
    const P = this.v.project()
    const SZ = P.dz / height
    const X_OFFS = this.xl / 6
    if (outOfBounds(P.z, P.x + X_OFFS, P.y, this.xl * SZ, this.yl * SZ)) return
    CTX.beginPath()
    CTX.drawImage(this.image, P.x + X_OFFS, P.y, this.xl * SZ, this.yl * SZ)
    CTX.closePath()
  }
}

/* FUNCTIONS */

const outOfBounds = (z, x, y, xl, yl) =>
  z <= camera.z || x < 0 || y < 0 || x >= width - xl || y >= height - yl

const signedRandom = n => n * (Math.random() - Math.random())

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

const create = e => {
  for (let i = 0; i < e.number; ++i) {
    const X = e.origin.x + signedRandom(e.range.x)
    const Y = e.origin.y + signedRandom(e.range.y)
    const Z = e.origin.z + signedRandom(e.range.z)
    SPRITES.push(new Sprite(new Vector(X, Y, Z), e.images))
  }
}

const go = () => {
  camera = new Vector(CAMERA_INIT.x, CAMERA_INIT.y, CAMERA_INIT.z)
  for (const key in ELEMENTS) create(ELEMENTS[key])
  loop()
}

const setDim = () => {
  width = window.innerWidth
  height = window.innerHeight
  CANVAS.width = width * devicePixelRatio | 0
  CANVAS.height = height * devicePixelRatio | 0
  CTX.scale(devicePixelRatio, devicePixelRatio)
}

const handleLoadImage = () => {
  if (++loadedImages === imagesToLoad) go()
}

const preload = function(o) {
  o.images = []
  for (let i = 0; i < o.urls.length; ++i) {
    o.images.push(new Image())
    o.images[o.images.length - 1].src = o.urls[i]
    o.images[o.images.length - 1].addEventListener('load', handleLoadImage)
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
