import * as THREE from 'three'
import { material } from '/utils/shaders/heightmap-shader.js'
import { heightColors, desertPlanetColors } from '/utils/ground.js'

const textureLoader = new THREE.TextureLoader()

export async function terrainFromHeightmap({
  file = 'wiki.png', scale = 1, seaLevel = 0.001, snow = true } = {}
) {
  const { data, width, depth } = await getHeightData(`/assets/heightmaps/${file}`, scale)

  material.uniforms.heightmap.value = await textureLoader.loadAsync(`/assets/heightmaps/${file}`)
  material.uniforms.seaLevel.value = seaLevel
  material.uniforms.snow.value = snow

  const geometry = geometryFromData({ data, width, depth })
  const mesh = new THREE.Mesh(geometry, material)
  return mesh
}

export function meshFromData({ data, width, depth, minHeight, maxHeight }) {
  const geometry = geometryFromData({ data, width, depth })
  const material = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  heightColors({ geometry, minY: minHeight, maxY: maxHeight, domainColors: desertPlanetColors })
  return mesh
}

export function geometryFromData({ data, width, depth }) {
  const geometry = new THREE.PlaneGeometry(width, depth, width - 1, depth - 1)
  geometry.rotateX(-Math.PI * .5)

  const { position } = geometry.attributes
  for (let i = 0, l = position.count; i < l; i++)
    position.setY(i, data[i])

  return geometry
}

/* FUNCTIONS */

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', () => reject())
  })
}

// http://danni-three.blogspot.com/2013/09/threejs-heightmaps.html
export async function getHeightData(url, scale = 1) {
  const img = await loadImage(url)
  const { width, height } = img

  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const context = canvas.getContext('2d')

  const size = img.width * img.height
  const data = new Float32Array(size)

  context.drawImage(img, 0, 0)

  const imgd = context.getImageData(0, 0, img.width, img.height)
  const pix = imgd.data

  let j = 0
  for (let i = 0; i < pix.length; i += 4) {
    const all = pix[i] + pix[i + 1] + pix[i + 2]
    data[j++] = all / (12 * scale)
  }

  return { data, width, depth: height }
}
