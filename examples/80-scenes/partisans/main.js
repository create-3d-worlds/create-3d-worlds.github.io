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
    range: {
      x: 10,
      y: 0,
      z: 10
    },
    origin: {
      x: 0,
      y: 0,
      z: 0
    },
    urls: [
      'https://vignette.wikia.nocookie.net/dont-starve-game/images/5/57/Evergreen.png/revision/latest/scale-to-width-down/340?cb=20140420093544',
      'https://vignette.wikia.nocookie.net/dont-starve-game/images/1/13/A_Lumpy_Evergreen.png/revision/latest/top-crop/width/360/height/450?cb=20130906135949',
      'https://vignette.wikia.nocookie.net/dont-starve-game/images/3/30/Totally_Normal_Tree.png/revision/latest?cb=20131017151301',
    ]
  },
  clouds: {
    number: 30,
    range: {
      x: 10,
      y: 0.5,
      z: 10
    },
    origin: {
      x: 0,
      y: 2,
      z: 0
    },
    urls: [
      'https://vignette.wikia.nocookie.net/dont-starve-game/images/b/bc/Gnat_Swarm.png/revision/latest?cb=20181028232026'
    ]
  },
  groundItems: {
    number: 20,
    range: {
      x: 10,
      y: 0,
      z: 10
    },
    origin: {
      x: 0,
      y: 0,
      z: 0
    },
    urls: [
      'https://vignette.wikia.nocookie.net/dont-starve-game/images/f/f1/Boulder_Flintless.png/revision/latest?cb=20130420195447',
    ]
  }
}
let width, height, camera, imagesToLoad
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

function outOfBounds(z, x, y, xl, yl) {
  return z <= camera.z || x < 0 || y < 0 || x >= width - xl || y >= height - yl
}

function signedRandom(n) {
  return n * (Math.random() - Math.random())
}

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
  ++loadedImages
  if (loadedImages === imagesToLoad) go()
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
  imagesToLoad = (() => {
    let total = 0
    for (const key in ELEMENTS)
      total += ELEMENTS[key].urls.length
    return total
  })()
  for (const key in ELEMENTS)
    preload(ELEMENTS[key])
}

const handleMouseMove = e => {
  const MOUSE_X = event.clientX - width / 2
  dWorldRot = (-MOUSE_X / width) * SENSITIVITY
}

/* INIT */

setDim()
updateSkyBox()
preloadImages()

/* LOOP */

/* EVENTS */

document.addEventListener('mousemove', handleMouseMove, false)
window.onresize = setDim
