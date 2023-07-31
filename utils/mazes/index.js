import * as THREE from 'three'
import * as BufferGeometryUtils from '/node_modules/three/examples/jsm/utils/BufferGeometryUtils.js'
import { createTexture } from '/utils/helpers.js'
import { createBuildingTexture, createBuildingGeometry } from '/utils/city.js'
import chroma from '/libs/chroma.js'

const { Vector2, Vector3 } = THREE
const { randInt, randFloat } = THREE.MathUtils

const textureLoader = new THREE.TextureLoader()

/* HELPERS */

export const tileToPosition = (tilemap, [row, column], cellSize = 1) => {
  const x = column * cellSize + cellSize / 2 - tilemap[0].length / 2 * cellSize
  const z = row * cellSize + cellSize / 2 - tilemap.length / 2 * cellSize
  return { x, y: 0, z }
}

// different from geometry.center(), not adjusting height
const centerGeometry = geometry => {
  const _offset = new THREE.Vector3()
  geometry.computeBoundingBox()
  geometry.boundingBox.getCenter(_offset).negate()
  geometry.translate(_offset.x, 0, _offset.z)
}

/* MESH FROM TILEMAP */

const scale = (value, range1, range2) =>
  (value - range1[0]) * (range2[1] - range2[0]) / (range1[1] - range1[0]) + range2[0]

const isRing = (row, j, i, ringIndex) => i == ringIndex || j == ringIndex || j == row.length - (1 + ringIndex) || i == row.length - (1 + ringIndex)

export const calcPyramidHeight = (row, j, i, size, maxHeight) => {
  const flatRoof = 2
  const cityCenter = row.length / 2 - flatRoof
  let height = size
  for (let ringIndex = 0; ringIndex < cityCenter; ringIndex++) {
    height = scale(ringIndex, [0, cityCenter], [size, maxHeight])
    if (isRing(row, j, i, ringIndex)) return height
  }
  return height
}

const randomHeight = (row, j, i, size, maxHeight) => isRing(row, j, i, 0) ? size : randFloat(size, maxHeight)

const addColors = ({ geometry, color, height, maxHeight } = {}) => {
  const f = chroma.scale([0x999999, 0xffffff]).domain([0, maxHeight])
  const shade = new THREE.Color(color || f(height).hex())
  const colors = []
  for (let i = 0, l = geometry.attributes.position.count; i < l; i++)
    colors.push(shade.r, shade.g, shade.b)
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
}

const createBoxGeometry = ({ size, height, maxHeight, texture }) => {
  const geometry = new THREE.BoxGeometry(size, height, size)
  if (!texture) addColors({ geometry, height, maxHeight })
  return geometry
}

export function meshFromTilemap({ tilemap, cellSize = 1, maxHeight = cellSize, texture, bumpFile, calcHeight = randomHeight, material, city = false, cityTexture = false, renderPath = false } = {}) {
  const geometries = []
  tilemap.forEach((row, j) => row.forEach((val, i) => {
    if (Object.is(val, 0)) return
    if (val > 0) {
      const height = maxHeight ?
        calcHeight(row, j, i, cellSize, maxHeight) :
        randInt(cellSize, cellSize * 4)
      const block = city
        ? createBuildingGeometry({ width: cellSize, height })
        : createBoxGeometry({ size: cellSize, height, maxHeight, texture })
      block.translate(i * cellSize, city ? 0 : height * .5, j * cellSize)
      geometries.push(block)
    } else if (renderPath) {
      // render path if exists
      const ball = new THREE.SphereGeometry(cellSize * .1)
      ball.translate(i * cellSize, cellSize * .05, j * cellSize)
      if (!texture && !city) addColors({ geometry: ball, color: 0xff0000 })
      geometries.push(ball)
    }
  }))

  const geometry = BufferGeometryUtils.mergeGeometries(geometries)
  centerGeometry(geometry)

  const options = {
    vertexColors: !texture,
    map: cityTexture ? createBuildingTexture() : texture ? textureLoader.load(`/assets/textures/${texture}`) : null,
    bumpMap: bumpFile ? textureLoader.load(`/assets/textures/${bumpFile}`) : null,
  }
  const mesh = new THREE.Mesh(geometry, material || new THREE.MeshPhongMaterial(options))
  return mesh
}

/* MESH FROM GRID */

const turnTo = (geometry, p1, p2) => {
  const mesh = new THREE.Mesh(geometry)
  mesh.position.set(p1.x, 0, p1.z)
  mesh.lookAt(p2)
  mesh.updateMatrix()
  geometry.applyMatrix4(mesh.matrix)
}

export function createPipe(p1, p2, radius = 2) {
  const distance = p1.distanceTo(p2)
  const geometry = new THREE.CylinderGeometry(radius, radius, distance, 12)
  geometry.translate(0, -distance / 2, 0)
  geometry.rotateX(-Math.PI / 2)

  turnTo(geometry, p1, p2)
  return geometry
}

export function createWall(p1, p2, width = randFloat(2, 4), height = randFloat(2, 8)) {
  const depth = p1.distanceTo(p2)
  const geometry = new THREE.BoxGeometry(width, height, depth)
  geometry.translate(0, height / 2, depth / 2)

  turnTo(geometry, p1, p2)
  return geometry
}

export function createCityWall(p1, p2) {
  const distanceToCenter = new Vector2(0, 0).distanceTo(new Vector2(p1.x, p1.z))
  const width = randFloat(2, 4)
  const height = (21 - distanceToCenter / 10) * 5
  const depth = p1.distanceTo(p2)
  const geometry = new THREE.BoxGeometry(width, height, depth)
  geometry.translate(0, height / 2, depth / 2)

  turnTo(geometry, p1, p2)
  return geometry
}

export function meshFromMaze({ maze, cellSize = 10, connect = createWall, color = 'white', texture } = {}) {
  const geometries = []

  for (const row of maze.grid)
    for (const cell of row) {
      const x1 = cell.column * cellSize
      const y1 = cell.row * cellSize
      const x2 = (cell.column + 1) * cellSize
      const y2 = (cell.row + 1) * cellSize

      if (!cell.north) {
        const p1 = new Vector3(x1, 0, y1)
        const p2 = new Vector3(x2, 0, y1)
        geometries.push(connect(p1, p2))
      }
      if (!cell.west) {
        const p1 = new Vector3(x1, 0, y1)
        const p2 = new Vector3(x1, 0, y2)
        geometries.push(connect(p1, p2))
      }
      if ((cell.east && !cell.linked(cell.east)) || !cell.east) {
        const p1 = new Vector3(x2, 0, y1)
        const p2 = new Vector3(x2, 0, y2)
        geometries.push(connect(p1, p2))
      }
      if ((cell.south && !cell.linked(cell.south)) || !cell.south) {
        const p1 = new Vector3(x1, 0, y2)
        const p2 = new Vector3(x2, 0, y2)
        geometries.push(connect(p1, p2))
      }
    }

  const geometry = BufferGeometryUtils.mergeGeometries(geometries)
  geometry.translate(0, .5, 0)
  centerGeometry(geometry)
  const material = new THREE.MeshLambertMaterial({
    color,
    map: texture ? createTexture({ file: texture }) : null
  })
  const mesh = new THREE.Mesh(geometry, material)
  return mesh
}

/* MESH FROM POLAR GRID */

export function meshFromPolarMaze({ maze, cellSize = 10, connect = createPipe, color = 'gray', texture } = {}) {
  const center = 0
  const geometries = []

  for (const row of maze.grid)
    for (const cell of row) {
      if (cell.row == 0) continue // center cell is empty

      const cell_count = maze.grid[cell.row].length
      const theta = 2 * Math.PI / cell_count
      const inner_radius = cell.row * cellSize
      const outer_radius = (cell.row + 1) * cellSize
      const theta_ccw = cell.column * theta // counter-clockwise wall
      const theta_cw = (cell.column + 1) * theta // clockwise wall

      const ax = Math.round(center + (inner_radius * Math.cos(theta_ccw)))
      const ay = Math.round(center + (inner_radius * Math.sin(theta_ccw)))
      const bx = Math.round(center + (outer_radius * Math.cos(theta_ccw)))
      const by = Math.round(center + (outer_radius * Math.sin(theta_ccw)))
      const cx = Math.round(center + (inner_radius * Math.cos(theta_cw)))
      const cy = Math.round(center + (inner_radius * Math.sin(theta_cw)))
      const dx = Math.round(center + (outer_radius * Math.cos(theta_cw)))
      const dy = Math.round(center + (outer_radius * Math.sin(theta_cw)))

      if (!cell.linked(cell.inward)) {
        const p1 = new Vector3(ax, 0, ay)
        const p2 = new Vector3(cx, 0, cy)
        geometries.push(connect(p1, p2))
      }
      if (!cell.linked(cell.cw)) {
        const p1 = new Vector3(cx, 0, cy)
        const p2 = new Vector3(dx, 0, dy)
        geometries.push(connect(p1, p2))
      }

      // last ringIndex with entrance
      if (cell.row === maze.size - 1 && cell.column !== row.length * 0.75) {
        const p1 = new Vector3(bx, 0, by)
        const p2 = new Vector3(dx, 0, dy)
        geometries.push(connect(p1, p2))
      }
    }

  const geometry = BufferGeometryUtils.mergeGeometries(geometries)
  geometry.translate(0, .5, 0)
  const material = new THREE.MeshLambertMaterial({
    color,
    map: texture ? createTexture({ file: texture }) : null
  })
  const mesh = new THREE.Mesh(geometry, material)
  return mesh
}
