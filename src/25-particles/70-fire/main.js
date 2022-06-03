import * as THREE from '/node_modules/three127/build/three.module.js'

import { Fire } from './Fire.js'

let camera, scene, renderer
let fire

const params = {
  color1: '#ffffff',
  color2: '#ffa000',
  color3: '#000000',
  colorBias: 0.8,
  burnRate: 0.35,
  diffuse: 1.33,
  viscosity: 0.25,
  expansion: - 0.25,
  swirl: 50.0,
  drag: 0.35,
  airSpeed: 12.0,
  windX: 0.0,
  windY: 0.75,
  speed: 500.0,
  massConservation: false
}

init()
animate()

function init() {

  const width = window.innerWidth
  const height = window.innerHeight

  camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000)
  camera.position.z = 25

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xffffff, 0.8)
  camera.add(pointLight)
  scene.add(camera)

  const plane = new THREE.PlaneBufferGeometry(20, 20)
  fire = new Fire(plane, {
    textureWidth: 512,
    textureHeight: 512,
    debug: false
  })
  fire.position.z = - 2
  scene.add(fire)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.autoClear = false
  document.body.appendChild(renderer.domElement)

  function updateColor1(value) {

    fire.color1.set(value)

  }

  function updateColor2(value) {

    fire.color2.set(value)

  }

  function updateColor3(value) {

    fire.color3.set(value)

  }

  function updateColorBias(value) {

    fire.colorBias = value

  }

  function updateBurnRate(value) {

    fire.burnRate = value

  }

  function updateDiffuse(value) {

    fire.diffuse = value

  }

  function updateViscosity(value) {

    fire.viscosity = value

  }

  function updateExpansion(value) {

    fire.expansion = value

  }

  function updateSwirl(value) {

    fire.swirl = value

  }

  function updateDrag(value) {

    fire.drag = value

  }

  function updateAirSpeed(value) {

    fire.airSpeed = value

  }

  function updateWindX(value) {

    fire.windVector.x = value

  }

  function updateWindY(value) {

    fire.windVector.y = value

  }

  function updateSpeed(value) {

    fire.speed = value

  }

  function updateMassConservation(value) {

    fire.massConservation = value

  }

  params.Single = function() {

    fire.clearSources()
    fire.addSource(0.5, 0.1, 0.1, 1.0, 0.0, 1.0)

  }

  params.Multiple = function() {

    fire.clearSources()
    fire.addSource(0.45, 0.1, 0.1, 0.5, 0.0, 1.0)
    fire.addSource(0.55, 0.1, 0.1, 0.5, 0.0, 1.0)

  }

  params.Text = function() {

    const text = 'Three JS'
    const size = 180
    const color = '#FF0040'
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const context = canvas.getContext('2d')
    context.font = size + 'pt Arial'

    context.strokeStyle = 'black'
    context.strokeRect(0, 0, canvas.width, canvas.height)
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.lineWidth = 5
    context.strokeStyle = color
    context.fillStyle = 'black'

    context.strokeText(text, canvas.width / 2, canvas.height * 0.75)
    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true

    fire.setSourceMap(texture)

  }

  function updateAll() {
    updateColor1(params.color1)
    updateColor2(params.color2)
    updateColor3(params.color3)
    updateColorBias(params.colorBias)
    updateBurnRate(params.burnRate)
    updateDiffuse(params.diffuse)
    updateViscosity(params.viscosity)
    updateExpansion(params.expansion)
    updateSwirl(params.swirl)
    updateDrag(params.drag)
    updateAirSpeed(params.airSpeed)
    updateWindX(params.windX)
    updateWindY(params.windY)
    updateSpeed(params.speed)
    updateMassConservation(params.massConservation)
  }

  params.Candle = function() {

    params.color1 = 0xffffff
    params.color2 = 0xffa000
    params.color3 = 0x000000
    params.windX = 0.0
    params.windY = 0.5
    params.colorBias = 0.3
    params.burnRate = 1.6
    params.diffuse = 1.33
    params.viscosity = 1.33
    params.expansion = 0.0
    params.swirl = 0.0
    params.drag = 0.0
    params.airSpeed = 8.0
    params.speed = 500.0
    params.massConservation = false

    updateAll()
  }

  params.Torch = function() {

    params.color1 = 0xffdcaa
    params.color2 = 0xffa000
    params.color3 = 0x000000
    params.windX = 0.0
    params.windY = 0.75
    params.colorBias = 0.9
    params.burnRate = 1.0
    params.diffuse = 1.33
    params.viscosity = 0.25
    params.expansion = 0.0
    params.swirl = 50.0
    params.drag = 0.35
    params.airSpeed = 10.0
    params.speed = 500.0
    params.massConservation = false

    updateAll()

  }

  params.Campfire = function() {

    params.color1 = 0xffffff
    params.color2 = 0xffa000
    params.color3 = 0x000000
    params.windX = 0.0
    params.windY = 0.75
    params.colorBias = 0.8
    params.burnRate = 0.3
    params.diffuse = 1.33
    params.viscosity = 0.25
    params.expansion = - 0.25
    params.swirl = 50.0
    params.drag = 0.35
    params.airSpeed = 12.0
    params.speed = 500.0
    params.massConservation = false

    updateAll()

  }

  params.Fireball = function() {

    params.color1 = 0xffffff
    params.color2 = 0xffa000
    params.color3 = 0x000000
    params.windX = 0.0
    params.windY = 0.75
    params.colorBias = 0.8
    params.burnRate = 1.2
    params.diffuse = 3.0
    params.viscosity = 0.0
    params.expansion = 0.0
    params.swirl = 6.0
    params.drag = 0.0
    params.airSpeed = 20.0
    params.speed = 500.0
    params.massConservation = false

    updateAll()

  }

  params.Iceball = function() {

    params.color1 = 0x00bdf7
    params.color2 = 0x1b3fb6
    params.color3 = 0x001869
    params.windX = 0.0
    params.windY = - 0.25
    params.colorBias = 0.25
    params.burnRate = 2.6
    params.diffuse = 5.0
    params.viscosity = 0.5
    params.expansion = 0.75
    params.swirl = 30.0
    params.drag = 0.0
    params.airSpeed = 40.0
    params.speed = 500.0
    params.massConservation = false

    updateAll()

  }

  params.Smoke = function() {

    params.color1 = 0xd2d2d2
    params.color2 = 0xd7d7d7
    params.color3 = 0x000000
    params.windX = - 0.05
    params.windY = 0.15
    params.colorBias = 0.95
    params.burnRate = 0.0
    params.diffuse = 1.5
    params.viscosity = 0.25
    params.expansion = 0.2
    params.swirl = 3.75
    params.drag = 0.4
    params.airSpeed = 18.0
    params.speed = 500.0
    params.massConservation = false

    updateAll()

  }

  params.Cigar = function() {

    params.color1 = 0xc5c5c5
    params.color2 = 0x787878
    params.color3 = 0x000000
    params.windX = 0.0
    params.windY = 0.3
    params.colorBias = 0.55
    params.burnRate = 0.0
    params.diffuse = 1.3
    params.viscosity = 0.05
    params.expansion = - 0.05
    params.swirl = 3.7
    params.drag = 0.6
    params.airSpeed = 6.0
    params.speed = 500.0
    params.massConservation = false

    updateAll()

  }

  params.Campfire()
  params.Single()
}

function animate() {
  requestAnimationFrame(animate)

  renderer.clear()
  renderer.render(scene, camera)
}