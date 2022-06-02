import * as THREE from '/node_modules/three125/build/three.module.js'
import { randomInRange, randomGrayish, randomInCircle, randomInSquare } from '/utils/helpers.js'
import { BufferGeometryUtils } from '/node_modules/three125/examples/jsm/utils/BufferGeometryUtils.js'

function createWindow(wWidth, wHeight) {
  const lightColors = [0xffff00, 0xF5F5DC, 0xFFEA00, 0xFDDA0D, 0xFFFF8F, 0xFFFDD0]
  const lightColor = lightColors[Math.floor(Math.random() * lightColors.length)]
  const randColor = Math.random() > 0.5 ? 0x000000 : new THREE.Color(lightColor)

  const geometry = new THREE.PlaneBufferGeometry(wWidth, wHeight)

  const colors = []
  for (let i = 0, l = geometry.attributes.position.count; i < l; i ++) {
    const color = new THREE.Color(randColor)
    colors.push(color.r, color.g, color.b)
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const material = new THREE.MeshStandardMaterial({ vertexColors: THREE.FaceColors, side: THREE.DoubleSide })
  const window = new THREE.Mesh(geometry, material)
  return window
}

function createWindows(building, bWidth, bHeight) {
  const windows = new THREE.Group()
  const wWidth = bWidth / 8
  const wHeight = randomInRange(4, 8)
  const floors = Math.floor(bHeight / wHeight)
  const halfFloors = Math.floor(floors / 2)

  const createSideWindows = callback => {
    for (let i = 0; i < bWidth / wWidth / 2; i++)
      for (let j = 0; j < halfFloors; j++) {
        const win = createWindow(wWidth, wHeight)
        const currPos = building.position.x - bWidth / 2 + wWidth + i * wWidth * 2
        callback(win, currPos)
        win.position.y = j * wHeight * 2 - bHeight * (halfFloors - 1) / floors
        win.updateMatrix()
        windows.add(win)
      }
  }
  createSideWindows((win, currPos) => {
    win.position.x = currPos
    win.position.z = building.position.z + bWidth / 2
  })
  createSideWindows((win, currPos) => {
    win.position.x = currPos
    win.position.z = building.position.z - bWidth / 2
  })
  createSideWindows((win, currPos) => {
    win.rotation.y = Math.PI / 2
    win.position.x = building.position.z + bWidth / 2
    win.position.z = currPos
  })
  createSideWindows((win, currPos) => {
    win.rotation.y = Math.PI / 2
    win.position.x = building.position.z - bWidth / 2
    win.position.z = currPos
  })
  return windows
}

export function createBuilding({
  x = 0, z = 0, color = new THREE.Color(0x000000), bWidth = randomInRange(10, 20, true),
  bHeight = randomInRange(bWidth, bWidth * 4, true), y = bHeight * .5, addWindows = true, rotY = 0,
} = {}) {

  const geometry = new THREE.BoxBufferGeometry(bWidth, bHeight, bWidth)

  const colors = []
  for (let i = 0, l = geometry.attributes.position.count; i < l; i ++)
    colors.push(color.r, color.g, color.b)
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const building = new THREE.Mesh(geometry)
  // if (addWindows)
  //   building.add(createWindows(building, bWidth, bHeight))
  geometry.translate(x, y, z)
  building.position.set(x, y, z)
  if (rotY) building.rotateY(rotY)
  building.updateMatrix() // needed for merge
  return building
}

const shouldRotate = (rotateEvery, i) => rotateEvery && i % rotateEvery == 0

const shouldEnlarge = (enlargeEvery, i) => enlargeEvery && i % enlargeEvery == 0

export function createCity({
  numBuildings = 200, size = 200, circle = true, rotateEvery = 0, enlargeEvery = 0,
  addWindows = true, colorParams = { min: 0, max: .1, colorful: .1 }, addTexture = false,
  emptyCenter = 0, night = false,
} = {}) {
  const buildings = []
  for (let i = 0; i < numBuildings; i++) {
    const color = colorParams ? randomGrayish(colorParams) : new THREE.Color(0x000000)
    const { x, z } = circle ? randomInCircle(size * .9, emptyCenter) : randomInSquare(size, emptyCenter)
    const rotY = shouldRotate(rotateEvery, i) ? Math.random() * Math.PI : 0
    const bWidth = shouldEnlarge(enlargeEvery, i)
      ? randomInRange(10, 25, true)
      : randomInRange(10, 20, true)
    const bHeight = shouldEnlarge(enlargeEvery, i)
      ? randomInRange(bWidth * 4, bWidth * 6, true)
      : randomInRange(bWidth, bWidth * 4, true)

    const building = createBuilding({ color, x, z, rotY, addWindows, bWidth, bHeight, addTexture, night })
    buildings.push(building.geometry)
  }

  const merged = BufferGeometryUtils.mergeBufferGeometries(buildings)
  const material = addTexture
    ? new THREE.MeshLambertMaterial({ map: generateCityTexture(night), vertexColors: THREE.FaceColors })
    : new THREE.MeshStandardMaterial({ vertexColors: THREE.FaceColors, side: THREE.DoubleSide })

  const city = new THREE.Mesh(merged, material)
  return city
}

const windowColor = night => {
  const value = randomInRange(0, 84, true)
  if (night) {
    const chance = Math.random()
    if (chance > .98) return `rgb(${value * 3}, ${value}, ${value})`
    if (chance > .9) return `rgb(${value * 2}, ${value * 2}, ${value})`
    if (chance > .85) return `rgb(${value * 2}, ${value * 2}, ${value * 2})`
  }
  return `rgb(${value}, ${value}, ${value})`
}

function generateCityTexture(night) {
  // beli kvadrat
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 64
  const context = canvas.getContext('2d')
  context.fillStyle = night ? '#000000' : '#ffffff'
  context.fillRect(0, 0, 32, 64)
  // crno-sive nijanse
  for (let y = 2; y < 64; y += 2)
    for (let x = 0; x < 32; x += 2) {
      context.fillStyle = windowColor(night)
      context.fillRect(x, y, 2, 1)
    }
  const canvas2 = document.createElement('canvas')
  canvas2.width = 512
  canvas2.height = 1024
  const context2 = canvas2.getContext('2d')
  context2.imageSmoothingEnabled = false
  context2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height)

  const texture = new THREE.Texture(canvas2)
  texture.needsUpdate = true
  return texture
}
