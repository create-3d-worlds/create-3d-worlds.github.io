/* global chroma */
import {getHighPoint} from '../utils/helpers.js'

const scale = chroma.scale(['brown', 'green', 'gray']).domain([0, 50])

export default function meshFromHeightmap(src, callback, size = 256) {
  const img = new Image()
  img.src = src
  img.onload = function() {
    const spacingX = 3
    const spacingZ = 3
    const heightOffset = 2

    const canvas = document.createElement('canvas')
    canvas.size = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    ctx.drawImage(img, 0, 0)
    const pixel = ctx.getImageData(0, 0, size, size)
    const geometry = new THREE.Geometry

    for (let x = 0; x < size; x++)
      for (let z = 0; z < size; z++) {
        const yValue = pixel.data[z * 4 + (size * x * 4)] / heightOffset
        const vertex = new THREE.Vector3(x * spacingX, yValue, z * spacingZ)
        geometry.vertices.push(vertex)
      }

    for (let z = 0; z < size - 1; z++)
      for (let x = 0; x < size - 1; x++) {
        const a = x + z * size
        const b = (x + 1) + (z * size)
        const c = x + ((z + 1) * size)
        const d = (x + 1) + ((z + 1) * size)

        const face1 = new THREE.Face3(a, b, d)
        const face2 = new THREE.Face3(d, c, a)
        face1.color = new THREE.Color(scale(getHighPoint(geometry, face1)).hex())
        face2.color = new THREE.Color(scale(getHighPoint(geometry, face2)).hex())
        geometry.faces.push(face1)
        geometry.faces.push(face2)
      }

    geometry.computeVertexNormals(true)
    geometry.computeFaceNormals()
    geometry.computeBoundingBox()
    const {max} = geometry.boundingBox

    const mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
      vertexColors: THREE.FaceColors,
    }))
    mesh.translateX(-max.x / 2)
    mesh.translateZ(-max.z / 2)
    callback(mesh)
  }
}
