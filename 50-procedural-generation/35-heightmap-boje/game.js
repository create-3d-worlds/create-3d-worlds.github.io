/* global chroma */
import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer } from '/utils/scene.js'

const scale = chroma.scale(['blue', 'green', 'red']).domain([0, 50])

const light = new THREE.DirectionalLight()
light.position.set(300, 250, 300)
scene.add(light)

camera.position.set(300, 250, 300)
camera.lookAt(scene.position)

function getHighPoint(geometry, face) {
  const v1 = geometry.vertices[face.a].y
  const v2 = geometry.vertices[face.b].y
  const v3 = geometry.vertices[face.c].y
  return Math.max(v1, v2, v3)
}

function createGeometryFromMap() {
  const depth = 256
  const width = 256

  const spacingX = 3
  const spacingZ = 3
  const heightOffset = 2

  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  const img = new Image()
  img.src = '/assets/heightmaps/wiki.png'
  img.onload = function() {
    ctx.drawImage(img, 0, 0)
    const pixel = ctx.getImageData(0, 0, width, depth)
    const geom = new THREE.Geometry

    for (let x = 0; x < depth; x++)
      for (let z = 0; z < width; z++) {
        const yValue = pixel.data[z * 4 + (depth * x * 4)] / heightOffset
        const vertex = new THREE.Vector3(x * spacingX, yValue, z * spacingZ)
        geom.vertices.push(vertex)
      }

    for (let z = 0; z < depth - 1; z++)
      for (let x = 0; x < width - 1; x++) {
        const a = x + z * width
        const b = (x + 1) + (z * width)
        const c = x + ((z + 1) * width)
        const d = (x + 1) + ((z + 1) * width)

        const face1 = new THREE.Face3(a, b, d)
        const face2 = new THREE.Face3(d, c, a)
        face1.color = new THREE.Color(scale(getHighPoint(geom, face1)).hex())
        face2.color = new THREE.Color(scale(getHighPoint(geom, face2)).hex())
        geom.faces.push(face1)
        geom.faces.push(face2)
      }

    geom.computeVertexNormals(true)
    geom.computeFaceNormals()
    geom.computeBoundingBox()

    const zMax = geom.boundingBox.max.z
    const xMax = geom.boundingBox.max.x

    const mesh = new THREE.Mesh(geom, new THREE.MeshLambertMaterial({
      vertexColors: THREE.FaceColors,
      color: 0x666666,
      flatShading: false
    }))
    mesh.translateX(-xMax / 2)
    mesh.translateZ(-zMax / 2)
    scene.add(mesh)
  }
}

createGeometryFromMap()

void function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
