import * as THREE from 'three'
import { randomGray } from '../helpers.js'

const { randFloat, randFloatSpread } = THREE.MathUtils

const textureLoader = new THREE.TextureLoader()

const translateY = (mesh, y) => {
  mesh.translateY(y)
  mesh.updateMatrix()
  mesh.geometry.applyMatrix4(mesh.matrix)
}

/* BOXES */

export function createBox({ size = 1, width = size, height = size, depth = size, file, bumpFile, normalFile, color = randomGray(), castShadow = true, receiveShadow = true, translateHeight = true, pos, quat } = {}) {
  const geometry = new THREE.BoxGeometry(width, height, depth)
  const options = {
    map: file ? textureLoader.load(`/assets/textures/${file}`) : null,
    color: !file ? color : null,
    bumpMap: bumpFile ? textureLoader.load(`/assets/textures/${bumpFile}`) : null,
    normalMap: normalFile ? textureLoader.load(`/assets/textures/${normalFile}`) : null,
  }
  const material = new THREE.MeshPhongMaterial(options)
  const mesh = new THREE.Mesh(geometry, material)

  if (translateHeight) translateY(mesh, height / 2)
  else mesh.translateY(height / 2)

  if (pos) mesh.position.copy(pos)
  if (quat) mesh.quaternion.copy(quat)

  mesh.castShadow = castShadow
  mesh.receiveShadow = receiveShadow
  return mesh
}

export const createPlayerBox = ({ visible = true, ...params } = {}) => {
  const mesh = createBox({ height: 1.78, width: .4, depth: .4, ...params })
  mesh.visible = visible
  return mesh
}

export const createCrate = ({ file = 'crate.gif', ...params } = {}) =>
  createBox({ file, ...params })

export function createTremplin({ width = 8, height = 4, depth = 12, y = -1.5, color } = {}) {
  const jumpBoard = createBox({ width, height, depth, translateHeight: false, color })
  jumpBoard.position.y = y
  jumpBoard.rotateX(-Math.PI / 15)
  return jumpBoard
}

/* SPHERES */

export function createSphere({
  r = 1, segments = 32, color = null, castShadow = true, receiveShadow = false, file, bumpFile } = {}
) {
  const geometry = new THREE.SphereGeometry(r, segments, segments)
  const material = new THREE.MeshStandardMaterial({
    color,
    map: file ? textureLoader.load(`/assets/textures/${file}`) : null,
    bumpMap: bumpFile ? textureLoader.load(`/assets/textures/${bumpFile}`) : null,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = receiveShadow
  mesh.castShadow = castShadow
  return mesh
}

export const createBullet = ({ color = 0x333333, r = .1, widthSegments = 6 } = {}) =>
  createSphere({ r, color, widthSegments, castShadow: true, receiveShadow: false })

export const createMoonSphere = () => createSphere({ r: .5, file: 'planets/moon.jpg' })

/* BARRELS */

export function createRustyBarrel({ r = .5, height = 1.5, segments = 32, file = 'metal/rust.jpg', topFile = 'barrel/rust-top.jpg', translateHeight = true } = {}) {
  const geometry = new THREE.CylinderGeometry(r, r, height, segments)
  const sideMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load(`/assets/textures/${file}`),
    bumpMap: textureLoader.load(`/assets/textures/${file}`),
    bumpScale: .02
  })
  const topMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load(`/assets/textures/${topFile || file}`),
    bumpMap: textureLoader.load(`/assets/textures/${topFile || file}`),
    bumpScale: .02
  })
  const materials = [
    sideMaterial,
    topMaterial,
    topMaterial, // bottom
  ]
  const mesh = new THREE.Mesh(geometry, materials)
  if (translateHeight) translateY(mesh, height / 2)
  mesh.castShadow = mesh.receiveShadow = true
  return mesh
}

export const createMetalBarrel = param => createRustyBarrel({ file: 'barrel/metal-barrel-side.jpg', topFile: 'metal/metal01.jpg', ...param })

export function createWoodBarrel({ r = .4, R = .5, h = 1 } = {}) {
  const geometry = new THREE.CylinderGeometry(1, 1, 2, 24, 32)
  const v3 = new THREE.Vector3()
  const v2 = new THREE.Vector2()
  const pos = geometry.attributes.position
  const rDiff = R - r
  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i)
    const y = Math.abs(v3.y)
    const rShift = Math.pow(Math.sqrt(1 - (y * y)), 2) * rDiff + r
    v2.set(v3.x, v3.z).setLength(rShift)
    v3.set(v2.x, v3.y, v2.y)
    pos.setXYZ(i, v3.x, v3.y, v3.z)
  }
  geometry.scale(1, h * 0.5, 1)

  const sideMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load('/assets/textures/barrel/WoodBarrel-side.jpg'),
    specularMap: textureLoader.load('/assets/textures/barrel/WoodBarrel-side-s.jpg'),
  })
  const topMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load('/assets/textures/barrel/WoodBarrel-top.jpg'),
    specularMap: textureLoader.load('/assets/textures/barrel/WoodBarrel-top-s.jpg'),
  })

  const materials = [
    sideMaterial,
    topMaterial,
    topMaterial, // bottom
  ]

  const mesh = new THREE.Mesh(geometry, materials)
  mesh.castShadow = mesh.receiveShadow = true
  translateY(mesh, h / 2)
  return mesh
}

/* STRUCTURES */

export function createRandomBoxes({ n = 100, size = 5, mapSize = 100 } = {}) {
  const arr = []
  for (let i = 0; i < n; i++) {
    const color = randomGray()
    const x = randFloatSpread(mapSize), y = randFloat(-5, mapSize * .25), z = randFloatSpread(mapSize)
    const box = createBox({ size, color })
    box.position.set(x, y, z)
    arr.push(box)
  }
  return arr
}

export function createCrates({ width = 8, height = 6, depth = 2, size = 1, x = 0, z = 0 } = {}) {
  const box = createCrate({ size, translateHeight: false })
  const boxes = []
  for (let w = 0; w < width; w++)
    for (let h = 0; h < height; h++)
      for (let d = 0; d < depth; d++) {
        const mesh = box.clone()

        mesh.position.x = (w - width / 2 + 0.5) * size + x
        mesh.position.y = (h - height / 2 + 0.5) * size
        mesh.position.z = (d - depth / 2 + 0.5) * size + z

        mesh.position.y += height / 2 * size
        mesh.position.z += 6

        boxes.push(mesh)
      }
  return boxes
}

export function createWall({ brickWidth = 0.6, brickDepth = 1, rows = 8, columns = 6, brickMass = 2, friction, x = 0 } = {}) {
  const bricks = []
  const brickHeight = brickDepth * 0.5
  const z = -columns * brickDepth * 0.5
  const pos = new THREE.Vector3()
  pos.set(x, brickHeight * 0.5, z)

  for (let j = 0; j < rows; j++) {
    const oddRow = (j % 2) == 1
    const nRow = oddRow ? columns + 1 : columns

    pos.z = oddRow ? z - brickDepth * .25 : z

    for (let i = 0; i < nRow; i++) {
      const firstOrLast = oddRow && (i == 0 || i == nRow - 1)
      const depth = firstOrLast ? brickDepth * .5 : brickDepth
      const mass = firstOrLast ? brickMass * .5 : brickMass
      const brick = createBox({ width: brickWidth, height: brickHeight, depth, mass, pos, friction, translateHeight: false })

      bricks.push(brick)

      pos.z = oddRow && (i == 0 || i == nRow - 2)
        ? pos.z + brickDepth * .75
        : pos.z + brickDepth
    }

    pos.y += brickHeight
  }
  return bricks
}

export function createSideWall({ brickWidth = 0.6, brickDepth = 1, rows = 8, columns = 6, brickMass = 2, friction, z = 0 } = {}) {
  const bricks = []
  const brickHeight = brickDepth * 0.5
  const x = -columns * brickDepth * 0.5
  const pos = new THREE.Vector3()
  pos.set(x, brickHeight * 0.5, z)

  for (let j = 0; j < rows; j++) {
    const oddRow = (j % 2) == 1
    const nRow = oddRow ? columns + 1 : columns

    pos.x = oddRow ? x - brickDepth * .25 : x

    for (let i = 0; i < nRow; i++) {
      const firstOrLast = oddRow && (i == 0 || i == nRow - 1)
      const depth = firstOrLast ? brickDepth * .5 : brickDepth
      const mass = firstOrLast ? brickMass * .5 : brickMass
      const brick = createBox({ width: depth, height: brickHeight, depth: brickWidth, mass, pos, friction, translateHeight: false })

      bricks.push(brick)

      pos.x = oddRow && (i == 0 || i == nRow - 2)
        ? pos.x + brickDepth * .75
        : pos.x + brickDepth
    }

    pos.y += brickHeight
  }
  return bricks
}

export function create4Walls({ rows = 10, columns = 6, brickMass = 5, friction = 5 } = {}) {
  const frontWall = createWall({ rows, columns, brickMass, friction, x: -3.2 })
  const backWall = createWall({ rows, columns, brickMass, friction, x: 2.2 })
  const leftWall = createSideWall({ rows, columns, brickMass, friction, z: -3.8 })
  const rightWall = createSideWall({ rows, columns, brickMass, friction, z: 2.8 })

  return [...frontWall, ...backWall, ...leftWall, ...rightWall]
}

export function createFlag({ file = 'prva-proleterska.jpg', scale = 1 } = {}) {
  const group = new THREE.Group()
  group.rotateY(-Math.PI * .5)

  const texture = new THREE.TextureLoader().load(`/assets/images/${file}`)
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 430, 20, 20, true),
    new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }))
  plane.scale.set(.0025, .0025, .0025)
  plane.position.set(.75, 3.5, 0)
  plane.castShadow = true
  plane.name = 'canvas'
  group.add(plane)

  const geometry = new THREE.CylinderGeometry(.03, .03, 4, 32)
  const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(0x654321) })
  const pole = new THREE.Mesh(geometry, material)
  pole.translateY(2)
  pole.castShadow = true
  group.add(pole)

  group.scale.set(scale, scale, scale)
  return group
}
