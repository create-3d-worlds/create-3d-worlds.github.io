import * as THREE from 'three'
import { createBox } from '/utils/geometry.js'

export const simpleCurve = new THREE.SplineCurve([
  new THREE.Vector2(-12, 0),
  new THREE.Vector2(6, 12),
  new THREE.Vector2(-6, 12),
  new THREE.Vector2(-12, -12),
  new THREE.Vector2(-18, -6),
  new THREE.Vector2(-12, 0),
])

export function createPathVisual(curve) {
  const points = curve.getPoints(50)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({ color: 0x333333 })
  const mesh = new THREE.Line(geometry, material)
  mesh.rotation.x = Math.PI * .5
  return mesh
}

export function followPath({ path, mesh, elapsedTime, speed = .05, y = 1 }) {
  const currPosition = new THREE.Vector2()
  const nextPosition = new THREE.Vector2()

  const speedTime = elapsedTime * speed

  path.getPointAt(speedTime % 1, currPosition)
  path.getPointAt((speedTime + 0.01) % 1, nextPosition)
  mesh.position.set(currPosition.x, y, currPosition.y)
  mesh.lookAt(nextPosition.x, y, nextPosition.y)
}

export function createEllipse({ xRadius, yRadius }) {
  const path = new THREE.EllipseCurve(0, 0, xRadius, yRadius, 0, 2 * Math.PI, false)
  const geometry = new THREE.BufferGeometry().setFromPoints(path.getPoints(256))
  const material = new THREE.LineBasicMaterial({ color: 0x333333 })
  const curve = new THREE.Line(geometry, material)
  curve.rotation.x = -Math.PI / 2
  curve.position.y = .01
  curve.userData.path = path
  return curve
}

export function createRailroadTracks(path, num) {
  const currPosition = new THREE.Vector2()
  const nextPosition = new THREE.Vector2()
  const track = createBox({ width: 1, height: .2, depth: .2, file: 'crate.gif' })
  const tracks = []

  for (let i = 0; i < num; i++) {
    const x = i * .005
    path.getPointAt(x % 1, currPosition)
    path.getPointAt((x + 0.01) % 1, nextPosition)

    const mesh = track.clone()
    mesh.position.set(currPosition.x, 0, currPosition.y)
    mesh.lookAt(nextPosition.x, 0, nextPosition.y)
    tracks.push(mesh)
  }
  return tracks
}
