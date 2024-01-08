import * as THREE from 'three'
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js'

const { randFloat } = THREE.MathUtils
const textureLoader = new THREE.TextureLoader()

/* SHOOT */

const decalMaterial = new THREE.MeshPhongMaterial({
  color: 0x000000,
  map: textureLoader.load('/assets/textures/decal-diffuse.png'),
  // normalMap: textureLoader.load('/assets/textures/decal-normal.jpg'),
  transparent: true,
  depthTest: true,
  polygonOffset: true,
  polygonOffsetFactor: -4,
  opacity: .8
})

const helper = new THREE.Object3D()

export function shootDecals(intersect, { scene, color } = {}) {
  const { face, point, object } = intersect

  const normal = face.normal.clone()
  normal.transformDirection(object.matrixWorld)
  normal.add(point)

  helper.position.copy(point)
  helper.lookAt(normal)
  helper.rotation.z = Math.random() * 2 * Math.PI

  const randSize = randFloat(.15, .3)
  const size = new THREE.Vector3(randSize, randSize, randSize)

  const geometry = new DecalGeometry(object, point, helper.rotation, size)
  const material = decalMaterial.clone()
  if (color !== undefined) // it can be 0
    material.color = new THREE.Color(color)
  const decal = new THREE.Mesh(geometry, material)
  scene.add(decal)
}
