/* global noise */
import { scene, camera, renderer, createOrbitControls } from '../utils/three-scene.js'

camera.position.set(100, 100, 100)
createOrbitControls()

const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(10, 300, 10)
scene.add(spotLight)

/* FUNCTIONS */

function create3DTerrain(width = 140, depth = 140, spacingX = 2.5, spacingZ = 2.5, height = 50) {
  const date = new Date()
  noise.seed(date.getMilliseconds())
  const geometry = new THREE.Geometry()
  const factor = 7
  for (let z = 0; z < depth; z++)
    for (let x = 0; x < width; x++) {
      // abs to make sure the value is positive, since perlin2 returns from - 1 to 1
      const y = Math.abs(noise.perlin2(x / factor, z / factor) * height)
      const vertex = new THREE.Vector3(x * spacingX, y, z * spacingZ)
      geometry.vertices.push(vertex)
    }

  for (let z = 0; z < depth - 1; z++)
    for (let x = 0; x < width - 1; x++) {
      const a = x + z * width
      const b = (x + 1) + (z * width)
      const c = x + ((z + 1) * width)
      const d = (x + 1) + ((z + 1) * width)

      const uva = new THREE.Vector2(x / (width - 1), 1 - z / (depth - 1))
      const uvb = new THREE.Vector2((x + 1) / (width - 1), 1 - z / (depth - 1))
      const uvc = new THREE.Vector2(x / (width - 1), 1 - (z + 1) / (depth - 1))
      const uvd = new THREE.Vector2((x + 1) / (width - 1), 1 - (z + 1) / (depth - 1))

      const face1 = new THREE.Face3(b, a, c)
      const face2 = new THREE.Face3(c, d, b)
      geometry.faces.push(face1)
      geometry.faces.push(face2)
      geometry.faceVertexUvs[0].push([uvb, uva, uvc])
      geometry.faceVertexUvs[0].push([uvc, uvd, uvb])
    }

  geometry.computeVertexNormals()
  // geometry.computeFaceNormals()
  const material = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load('../../assets/textures/ground.jpg')
  })
  const terrain = new THREE.Mesh(geometry, material)
  terrain.translateX(-width / 1.5)
  terrain.translateZ(-depth / 4)
  terrain.translateY(height)
  terrain.name = 'terrain'
  return terrain
}

/* INIT */

scene.add(create3DTerrain())

void function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
