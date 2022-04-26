/* global Tree */
import * as THREE from '/node_modules/three108/build/three.module.js'
import {scene, camera, renderer} from '/utils/scene.js'

camera.position.set(3, 5, 4)
camera.lookAt(new THREE.Vector3(1, 5, 0))

const textureLoader = new THREE.TextureLoader()

const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(10, 150, 10)
spotLight.castShadow = true
scene.add(spotLight)
scene.add(new THREE.AmbientLight(0x252525))

const config = {
  seed: 262,
  segments: 6,
  levels: 5,
  vMultiplier: 2.36,
  twigScale: 0.1,
  initalBranchLength: 0.49,
  lengthFalloffFactor: 0.85,
  lengthFalloffPower: 0.99,
  clumpMax: 0.454,
  clumpMin: 0.404,
  branchFactor: 2.45,
  dropAmount: -0.1,
  growAmount: 0.235,
  sweepAmount: 0.01,
  maxRadius: 0.139,
  climbRate: 0.371,
  trunkKink: 0.093,
  treeSteps: 10,
  taperRate: 0.947,
  radiusFalloffRate: 0.73,
  twistRate: 3.02,
  trunkLength: 2.4,
}

createTree(config)

function createTree(config) {
  const twig = scene.getObjectByName('twig')
  const trunk = scene.getObjectByName('trunk')

  if (twig) scene.remove(twig)
  if (trunk) scene.remove(trunk)

  const myTree = new Tree(config)

  const trunkGeom = new THREE.Geometry()
  const leaveGeom = new THREE.Geometry()

  myTree.verts.forEach(v => {
    trunkGeom.vertices.push(new THREE.Vector3(v[0], v[1], v[2]))
  })

  myTree.vertsTwig.forEach(v => {
    leaveGeom.vertices.push(new THREE.Vector3(v[0], v[1], v[2]))
  })

  myTree.faces.forEach(f => {
    trunkGeom.faces.push(new THREE.Face3(f[0], f[1], f[2]))
  })

  myTree.facesTwig.forEach(f => {
    leaveGeom.faces.push(new THREE.Face3(f[0], f[1], f[2]))
  })

  myTree.facesTwig.forEach(f => {
    const uva = myTree.uvsTwig[f[0]]
    const uvb = myTree.uvsTwig[f[1]]
    const uvc = myTree.uvsTwig[f[2]]

    const vuva = new THREE.Vector2(uva[0], uva[1])
    const vuvb = new THREE.Vector2(uvb[0], uvb[1])
    const vuvc = new THREE.Vector2(uvc[0], uvc[1])

    leaveGeom.faceVertexUvs[0].push([vuva, vuvb, vuvc])
  })

  myTree.faces.forEach(f => {
    const uva = myTree.UV[f[0]]
    const uvb = myTree.UV[f[1]]
    const uvc = myTree.UV[f[2]]

    const vuva = new THREE.Vector2(uva[0], uva[1])
    const vuvb = new THREE.Vector2(uvb[0], uvb[1])
    const vuvc = new THREE.Vector2(uvc[0], uvc[1])

    trunkGeom.faceVertexUvs[0].push([vuva, vuvb, vuvc])
  })

  const leaveMat = new THREE.MeshLambertMaterial()
  leaveMat.map = textureLoader.load('/assets/textures/leaf2.png')
  leaveMat.doubleSided = true
  leaveMat.transparent = true

  const trunkMat = new THREE.MeshLambertMaterial()
  trunkMat.map = textureLoader.load('/assets/textures/birch.jpg')
  trunkMat.doubleSided = true
  trunkMat.transparent = true

  trunkGeom.computeFaceNormals()
  leaveGeom.computeFaceNormals()
  trunkGeom.computeVertexNormals(true)
  leaveGeom.computeVertexNormals(true)

  const trunkMesh = new THREE.Mesh(trunkGeom, trunkMat)
  trunkMesh.name = 'trunk'

  const twigMesh = new THREE.Mesh(leaveGeom, leaveMat)
  twigMesh.name = 'twig'

  scene.add(trunkMesh)
  scene.add(twigMesh)
}

void function render() {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}()
