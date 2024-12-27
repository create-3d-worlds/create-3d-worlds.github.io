import * as THREE from 'three'
import { material } from '/core/shaders/heightmap-shader.js'
import { heightColors, desertPlanetColors } from '/core/ground.js'

const textureLoader = new THREE.TextureLoader()

const geometryFromData = ({ data, width, depth }) => {
  const geometry = new THREE.PlaneGeometry(width, depth, width - 1, depth - 1)
  geometry.rotateX(-Math.PI * .5)

  const { position } = geometry.attributes
  for (let i = 0, l = position.count; i < l; i++)
    position.setY(i, data[i])

  return geometry
}

/**
 * @param heightFactor: height scale factor
 * @param seaLevel number: coloring margin
 * @param snow boolean: add white on top
 */
export async function terrainFromHeightmap({
  file = 'wiki.png', heightFactor = 1, seaLevel = 0.001, snow = true } = {}
) {
  const { data, width, depth } = await getHeightData(`/assets/images/heightmaps/${file}`, heightFactor)

  material.uniforms.heightmap.value = await textureLoader.loadAsync(`/assets/images/heightmaps/${file}`)
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
  heightColors({ geometry, minY: minHeight, maxY: maxHeight, terrainColors: desertPlanetColors })
  return mesh
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

  const data = new Float32Array(img.width * img.height)

  context.drawImage(img, 0, 0)

  const imageData = context.getImageData(0, 0, img.width, img.height)
  const pix = imageData.data

  let j = 0
  for (let i = 0; i < pix.length; i += 4) {
    const all = pix[i] + pix[i + 1] + pix[i + 2]
    data[j++] = all / (12 * scale)
  }

  return { data, width, depth: height }
}
