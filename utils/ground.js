import * as THREE from '/node_modules/three127/build/three.module.js'
import { randomInRange, randomNuance, getTexture, similarColor } from '/utils/helpers.js'

/* GROUND */

export function createGroundMaterial({ size, color = 0x509f53, file } = {}) {
  const params = { side: THREE.DoubleSide }
  const material = file
    ? new THREE.MeshBasicMaterial({ ...params, map: getTexture({ file, repeat: size / 10 }) })
    : new THREE.MeshPhongMaterial({ ...params, color }) // MeshLambertMaterial ne radi rasveta
  return material
}

export function crateGroundGeometry({ size, circle = true }) {
  const geometry = circle
    ? new THREE.CircleGeometry(size, 32)
    : new THREE.PlaneGeometry(size, size)

  geometry.rotateX(-Math.PI * 0.5)
  return geometry
}

export function createGround({ size = 1000, color, circle, file } = {}) {
  const material = createGroundMaterial({ size, file, color })
  const geometry = crateGroundGeometry({ size, circle })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  return mesh
}

/* TERRAIN */

export function createTerrain({ size = 400, segments = 50, colorParam, factor = 2 } = {}) {
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments)
  geometry.rotateX(- Math.PI / 2)

  const { position } = geometry.attributes
  const vertex = new THREE.Vector3()

  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i)
    vertex.y += randomInRange(-factor * 5, factor * 7.5) * Math.random() * Math.random()
    vertex.z += randomInRange(-factor, factor)
    position.setXYZ(i, vertex.x, vertex.y, vertex.z)
  }

  const colors = []
  for (let i = 0, l = position.count; i < l; i++) {
    const color = randomNuance(colorParam)
    colors.push(color.r, color.g, color.b)
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const material = new THREE.MeshLambertMaterial({ vertexColors: THREE.VertexColors })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  return mesh
}

/* WATER */

export const createWater = ({ size = 1200, segments = 20, opacity = .6, file= 'water512.jpg' } = {}) => {
  const material = new THREE.MeshLambertMaterial({
    color: 0x6699ff,
    opacity,
    transparent: true,
    vertexColors: THREE.FaceColors,
    map: file ? getTexture({ file, repeat: 5 }) : null
  })
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments)
  geometry.dynamic = true
  geometry.verticesNeedUpdate = true

  const colors = []
  for (let i = 0, l = geometry.attributes.position.count; i < l; i++) {
    const nuance = similarColor(0x40E0D0, .15)
    colors.push(nuance.r, nuance.g, nuance.b)
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const water = new THREE.Mesh(geometry, material)
  water.receiveShadow = true
  water.name = 'water'
  water.rotateX(-Math.PI / 2)
  return water
}

/* ALIASES */

export function createFloor({ color = 0x808080, circle = false, ...rest } = {}) {
  return createGround({ color, circle, ...rest })
}
