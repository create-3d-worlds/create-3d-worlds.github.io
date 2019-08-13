/* global chroma */
import {scene, camera, renderer, createOrbitControls} from '../utils/three-scene.js'
import {getHighPoint} from '../utils/helpers.js'

createOrbitControls()

const scale = chroma.scale(['brown', 'green', 'gray']).domain([0, 50])

const light = new THREE.DirectionalLight()
light.position.set(1200, 1200, 1200)
scene.add(light)

function meshFromHeightmap(src, depth = 256, width = 256) {
  const img = new Image()
  img.src = src
  img.onload = function() {
    const spacingX = 3
    const spacingZ = 3
    const heightOffset = 2

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = depth
    const ctx = canvas.getContext('2d')

    ctx.drawImage(img, 0, 0)
    const pixel = ctx.getImageData(0, 0, width, depth)
    const geometry = new THREE.Geometry

    for (let x = 0; x < depth; x++)
      for (let z = 0; z < width; z++) {
        const yValue = pixel.data[z * 4 + (depth * x * 4)] / heightOffset
        const vertex = new THREE.Vector3(x * spacingX, yValue, z * spacingZ)
        geometry.vertices.push(vertex)
      }

    for (let z = 0; z < depth - 1; z++)
      for (let x = 0; x < width - 1; x++) {
        const a = x + z * width
        const b = (x + 1) + (z * width)
        const c = x + ((z + 1) * width)
        const d = (x + 1) + ((z + 1) * width)

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
    scene.add(mesh) // ne more return jer je u callbacku
  }
}

meshFromHeightmap('../assets/heightmaps/wiki.png')

/* INIT */

void function update() {
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()
