/* global noise */
// https://github.com/josdirksen/essential-threejs/blob/master/chapter-05/05.02-3D-plane-from-scratch-perlin.html
const MAX_HEIGHT = 10

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0x000000, 1.0)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMapEnabled = true

camera.position.x = 100
camera.position.y = 100
camera.position.z = 100
camera.lookAt(scene.position)

const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(10, 300, 10)
scene.add(spotLight)
scene.add(new THREE.AmbientLight(0x252525))

document.body.appendChild(renderer.domElement)

/* FUNCTIONS */

function create3DTerrain(width, depth, spacingX, spacingZ, height) {
  const date = new Date()
  noise.seed(date.getMilliseconds())

  const geometry = new THREE.Geometry()
  for (let z = 0; z < depth; z++)
    for (let x = 0; x < width; x++) {
      const yValue = Math.abs(noise.perlin2(x / 7, z / 7) * height * 2)
      const vertex = new THREE.Vector3(x * spacingX, yValue, z * spacingZ)
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

  geometry.computeVertexNormals(true)
  geometry.computeFaceNormals()

  const mat = new THREE.MeshPhongMaterial()
  mat.map = THREE.ImageUtils.loadTexture('../../assets/textures/wood_1024x1024.png')

  const groundMesh = new THREE.Mesh(geometry, mat)
  groundMesh.translateX(-width / 1.5)
  groundMesh.translateZ(-depth / 4)
  groundMesh.translateY(50)
  groundMesh.name = 'terrain'
  return groundMesh
}

/* INIT */

scene.add(create3DTerrain(140, 140, 2.5, 2.5, MAX_HEIGHT))

void function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()