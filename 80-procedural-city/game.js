const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0xd8e7ff)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 3000)
camera.position.y = 80

const controls = new THREE.FirstPersonControls(camera)
controls.movementSpeed = 20
controls.lookSpeed = 0.05

const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0025)

const light = new THREE.HemisphereLight(0xfffff0, 0x101020, 1.25)
scene.add(light)

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(2000, 2000),
  new THREE.MeshBasicMaterial({color: 0x101018}))
plane.rotation.x = -90 * Math.PI / 180
scene.add(plane)

function generateBuildings(num = 10000) {
  const city = new THREE.Geometry()
  const lightColor = new THREE.Color(0xffffff)
  const shadow = new THREE.Color(0x303050)
  const box = new THREE.CubeGeometry(1, 1, 1)
  box.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0))
  box.faces.splice(3, 1)
  box.faceVertexUvs[0].splice(3, 1)
  box.faceVertexUvs[0][2][0].set(0, 0)
  box.faceVertexUvs[0][2][1].set(0, 0)
  box.faceVertexUvs[0][2][2].set(0, 0)
  box.faceVertexUvs[0][2][3].set(0, 0)
  const building = new THREE.Mesh(box)

  for (let i = 0; i < num; i++) {
    const value = 1 - Math.random() * Math.random()
    const color = new THREE.Color().setRGB(value + Math.random() * 0.1, value, value + Math.random() * 0.1)

    const top = color.clone().multiply(lightColor)
    const bottom = color.clone().multiply(shadow)

    building.position.x = Math.floor(Math.random() * 200 - 100) * 10
    building.position.z = Math.floor(Math.random() * 200 - 100) * 10
    building.rotation.y = Math.random()
    building.scale.x = building.scale.z = Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10
    building.scale.y = (Math.random() * Math.random() * Math.random() * building.scale.x) * 8 + 8

    const {geometry} = building
    for (let j = 0, jl = geometry.faces.length; j < jl; j++)
      if (j === 2)
        geometry.faces[j].vertexColors = [color, color, color, color]
      else
        geometry.faces[j].vertexColors = [top, bottom, bottom, top]

    THREE.GeometryUtils.merge(city, building)
  }
  return city
}

function generateTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 64
  const context = canvas.getContext('2d')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, 32, 64)
  for (let y = 2; y < 64; y += 2)
    for (let x = 0; x < 32; x += 2) {
      const value = Math.floor(Math.random() * 64)
      context.fillStyle = 'rgb(' + [value, value, value].join(',') + ')'
      context.fillRect(x, y, 2, 1)
    }

  const canvas2 = document.createElement('canvas')
  canvas2.width = 512
  canvas2.height = 1024
  const context2 = canvas2.getContext('2d')
  context2.imageSmoothingEnabled = false
  context2.webkitImageSmoothingEnabled = false
  context2.mozImageSmoothingEnabled = false
  context2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height)
  return canvas2
}

const city = generateBuildings(10000)
const texture = new THREE.Texture(generateTexture())
texture.anisotropy = renderer.getMaxAnisotropy()
texture.needsUpdate = true

const cityMesh = new THREE.Mesh(city, new THREE.MeshLambertMaterial({
  map: texture,
  vertexColors: THREE.VertexColors
}))
scene.add(cityMesh)

const clock = new THREE.Clock()

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  controls.update(delta)
  renderer.render(scene, camera)
}()
