import * as THREE from '/node_modules/three119/build/three.module.js'
import { nemesis as map } from '/data/maps.js'

const textureLoader = new THREE.TextureLoader()
const mapW = map.length

export const UNITSIZE = 250

export function createHealth() {
  const healthcube = new THREE.Mesh(
    new THREE.BoxGeometry(30, 30, 30),
    new THREE.MeshBasicMaterial({ map: textureLoader.load('images/health.png') })
  )
  healthcube.position.set(-UNITSIZE - 15, 35, -UNITSIZE - 15)
  return healthcube
}

export function getMapSector(v) {
  const x = Math.floor((v.x + UNITSIZE / 2) / UNITSIZE + mapW / 2)
  const z = Math.floor((v.z + UNITSIZE / 2) / UNITSIZE + mapW / 2)
  return { x, z }
}

export function drawRadar(ai, camera) {
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
      } else if (i == c.x && j == c.z) {
        context.fillStyle = '#AA33FF'
        context.fillRect(i * 20, j * 20, (i + 1) * 20, (j + 1) * 20)
        context.fillStyle = '#000000'
        context.fillText('' + d, i * 20 + 8, j * 20 + 12)
      } else if (d > 0 && d < 10) {
        context.fillStyle = '#FF0000'
        context.fillRect(i * 20, j * 20, (i + 1) * 20, (j + 1) * 20)
        context.fillStyle = '#000000'
        context.fillText('' + d, i * 20 + 8, j * 20 + 12)
      } else if (map[i][j] > 0) {
        context.fillStyle = '#666666'
        context.fillRect(i * 20, j * 20, (i + 1) * 20, (j + 1) * 20)
      } else {
        context.fillStyle = '#CCCCCC'
        context.fillRect(i * 20, j * 20, (i + 1) * 20, (j + 1) * 20)
      }
    }
}