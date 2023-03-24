import * as THREE from 'three'
import { SimplexNoise } from '/node_modules/three/examples/jsm/math/SimplexNoise.js'
import { getTexture, similarColor } from '/utils/helpers.js'
import chroma from '/libs/chroma.js'
import { material as lavaMaterial } from '/utils/shaders/lava.js'
import { material as marble } from '/utils/shaders/marble.js'

const { randFloat } = THREE.MathUtils
const simplex = new SimplexNoise()

export const groundColors = [0xA62A2A, 0x7a8a46, 0x228b22, 0xf0e68c]
export const sandColors = [0xc2b280, 0xF2D16B, 0xf0e68c, 0xfffacd]
export const cratersColors = [0x5C4033, 0xA62A2A, 0xc2b280]
export const desertPlanetColors = [0xB0E0E6, 0xCD853F, 0xEEE8AA, 0xA62A2A, 0x666666] // 0xbf8040

/* HILL */

export function createHill(r, height = r * .4) {
  const geometry = new THREE.ConeGeometry(r, height, 32)
  const material = new THREE.MeshPhongMaterial({ color: 0x509f53 })
  const cone = new THREE.Mesh(geometry, material)
  return cone
}

/* GROUND */

export function createGroundMaterial({ color = 0x509f53, file, repeat } = {}) {
  const params = { side: THREE.FrontSide }
  const material = file
    ? new THREE.MeshBasicMaterial({
      ...params,
      map: getTexture({ file, repeat }),
    })
    : new THREE.MeshToonMaterial({ ...params, color })
  return material
}

export function crateGroundGeometry({ size, circle = true, segments = circle ? 32 : 1 }) {
  const geometry = circle
    ? new THREE.CircleGeometry(size, segments)
    : new THREE.PlaneGeometry(size, size, segments, segments)

  geometry.rotateX(-Math.PI * 0.5)
  return geometry
}

export function createGround({ size = 1000, color, circle, file, repeat = size / 8 } = {}) {
  const material = createGroundMaterial({ file, color, repeat })
  const geometry = crateGroundGeometry({ size, circle })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  return mesh
}

export function createFloor({ color = 0x808080, circle = false, ...rest } = {}) {
  return createGround({ color, circle, ...rest })
}

/* SHADER MATERIALS */

export function createLava({ size = 100 } = {}) {
  const geometry = new THREE.CircleGeometry(size)
  geometry.rotateX(- Math.PI / 2)
  return new THREE.Mesh(geometry, lavaMaterial)
}

export function createMarble({ size = 100 } = {}) {
  const geometry = new THREE.PlaneGeometry(size, size)
  const mesh = new THREE.Mesh(geometry, marble)
  mesh.rotateX(-Math.PI * 0.5)
  return mesh
}

/* NOISE HELPERS */

function randomDeform(geometry, max = 5, min = 0) {
  const { position } = geometry.attributes
  for (let i = 0, l = position.count; i < l; i++) {
    const y = randFloat(min, max) * Math.random()
    position.setY(i, y)
  }
}

function cratersNoise(geometry) {
  const xZoom = 20
  const yZoom = 20
  const noiseStrength = 5

  const { position } = geometry.attributes
  const vertex = new THREE.Vector3()

  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i)
    let noise = simplex.noise(vertex.x / xZoom, vertex.z / yZoom) * noiseStrength
    noise = Math.round(noise)
    if (noise > 2.5) continue // cut mountain's peaks
    position.setY(i, noise)
  }
}

function dunesNoise(geometry) {
  const { position } = geometry.attributes
  const vertex = new THREE.Vector3()

  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i)
    const noise = simplex.noise(vertex.x * .05, vertex.z * .05)
    position.setY(i, noise * 1.5)
  }
}

function hillyNoise(geometry, segments, factorX, factorY, factorZ, aboveSea) {
  const { position } = geometry.attributes
  const vertex = new THREE.Vector3()
  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i)
    const dist = simplex.noise(vertex.x / segments / factorX, vertex.z / segments / factorZ)
    position.setY(i, factorY * (dist + aboveSea))
  }
}

/* COLOR HELPERS */

function randomShades(geometry, colorParam, range) { // h = .25, s = 0.5, l = 0.2
  const colors = []
  for (let i = 0, l = geometry.attributes.position.count; i < l; i++) {
    const color = similarColor(colorParam, range)
    colors.push(color.r, color.g, color.b)
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
}

export function heightColors({ geometry, maxY, minY = 0, domainColors = groundColors } = {}) {
  const { position } = geometry.attributes
  const f = chroma.scale(domainColors).domain([minY, maxY])
  const colors = []
  const vertex = new THREE.Vector3()

  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i)
    const nuance = new THREE.Color(f(vertex.y).hex())
    colors.push(nuance.r, nuance.g, nuance.b)
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
}

/* TERRAIN */

function createTerrainMesh({ size = 400, segments = 100 } = {}) {
  const geometry = crateGroundGeometry({ size, segments, circle: false })

  const material = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  return mesh
}

export function createTerrain({ size = 400, segments = 50, colorParam = 0x44aa44, factor = 7 } = {}) {
  const mesh = createTerrainMesh({ size, segments })
  randomDeform(mesh.geometry, factor, -1)
  randomShades(mesh.geometry, colorParam)
  return mesh
}

/* CRATERS */

export function createCraters({ size = 100, segments = 100 } = {}) {
  const mesh = createTerrainMesh({ size, segments })
  cratersNoise(mesh.geometry)
  heightColors({ geometry: mesh.geometry, minY: -2, maxY: 2, domainColors: cratersColors })
  return mesh
}

/* DUNES */

export function createDunes({ size = 400, segments = 100 } = {}) {
  const mesh = createTerrainMesh({ size, segments })
  dunesNoise(mesh.geometry)
  heightColors({ geometry: mesh.geometry, maxY: 2, minY: -1.75, domainColors: sandColors })

  return mesh
}

/* HILLY TERRAIN */

export const createHillyTerrain = (
  { size = 400, segments = size / 20, factorX = size / 20, factorZ = size / 40, factorY = size / 10, aboveSea = .5 } = {}
) => {
  const mesh = createTerrainMesh({ size, segments })
  hillyNoise(mesh.geometry, segments, factorX, factorY, factorZ, aboveSea)
  heightColors({ geometry: mesh.geometry, maxY: factorY * 1.25, minY: -factorY * .25 })
  mesh.name = 'terrain' // for mini-rpg
  return mesh
}

/* WATER */

export const createWater = ({ size = 1200, segments = 20, opacity = .6, file = 'water512.jpg' } = {}) => {
  const material = new THREE.MeshLambertMaterial({
    color: 0x6699ff,
    opacity,
    transparent: true,
    vertexColors: true,
    map: file ? getTexture({ file, repeat: 5 }) : null
  })
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments)
  geometry.rotateX(-Math.PI / 2)

  randomShades(geometry, 0x40E0D0, 0.15)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  mesh.name = 'water'
  return mesh
}

/* WAVE */

function setInitialHeight(geometry) {
  const { position } = geometry.attributes
  const initialHeight = []
  const vertex = new THREE.Vector3()
  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i)
    initialHeight.push(vertex.y)
  }
  geometry.setAttribute('initialHeight', new THREE.Float32BufferAttribute(initialHeight, 1))
}

export function wave({ geometry, time, amplitude = 1, frequency = 1, passage }) {
  if (!geometry.attributes.initialHeight) setInitialHeight(geometry)

  const { position, initialHeight } = geometry.attributes
  const vertex = new THREE.Vector3()

  for (let i = 0, l = position.count; i < l; i++)
    if (passage && i >= passage.start && i <= passage.end)
      position.setY(i, -10)
    else {
      vertex.fromBufferAttribute(position, i)
      const { x, z } = vertex

      let change = 0
      // change X
      change += 0.32 * amplitude * Math.sin(x * 1.9 * frequency + time)
      change += 3 * amplitude * Math.sin(x * 0.1 * frequency + time)
      // change Z
      change += .42 * amplitude * Math.sin(z * 2.1 * frequency + time)
      change += 2.8 * amplitude * Math.sin(z * 0.2 * frequency + time)
      change *= amplitude * 0.6

      position.setY(i, change + initialHeight.array[i])
    }

  position.needsUpdate = true
}

export function shake(geometry, t) {
  if (!geometry.attributes.initialHeight) setInitialHeight(geometry)

  const { position, initialHeight } = geometry.attributes
  for (let i = 0, l = position.count; i < l; i++) {
    const y = Math.sin(i + t) * initialHeight.array[i] * 0.5
    position.setY(i, y)
  }
  position.needsUpdate = true
}

/* TERRAIN WAVE */

export function createTerrainFromData({ data, width, height, widthSegments, heightSegments }) {
  const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
  geometry.rotateX(- Math.PI / 2)

  const vertices = geometry.attributes.position.array
  for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3)
    vertices[j + 1] = data[i] // j + 1: y component

  geometry.computeVertexNormals()

  const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xC7C7C7 })
  const terrain = new THREE.Mesh(geometry, groundMaterial)
  terrain.receiveShadow = terrain.castShadow = true
  return terrain
}
