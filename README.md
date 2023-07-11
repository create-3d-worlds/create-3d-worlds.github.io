# Create 3D worlds

Library of reusable Three.js components to play with.

## Start

```
npm i
npx live-server
```

## TODO

### Polishing

DODATI SVUDA:
  - GUI kontrole
    - proširivati po potrebi (pause, attack, jump, run, desni miš rotiranje kamere, spell cast...)
    - igrač ako baca magiju da renderuje dugme
    - toggle camera na C
    - promeniti special sa control, često se pritiska slučajno
    - srediti boje, senku, bold, itd
    - negde controls dugme?
  - komande za telefone (strelice i dugmiće), testirati
    - renderovati virtuelni joystick https://en.wikipedia.org/wiki/File:Vg_graphics.svg
  - reload button u end screen (ili kad igrač umre)
  - full screen btn
  - volume / mute btn
- pauzirati scenu na tab unfocus
- po završetku partije upisivanje imena pored poena za top listu
- centralni ekran sa izborom scena 
  - jedan index.html i dinamički import na klik
  - ili odvojene html stranice
- dodati svuda svoj potpis i kontakt (developed by mudroljub)

### Publish
- napraviti index.js za export svega postojećeg (vidi threejs)
- srediti root-relativne linkove da rade u podfolderu
- možda build proces, minifikacija, i sl.
- sve dobro dokumentovati
- minimalni bekend za statistike i pamćenje poena ili bar brojač poseta
  - možda server na rosberyju
- testirati sve nivoe na serveru

## Helpers

Raycaster helper:

```js
scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300))
```

Box helper:

```js
const box = new THREE.BoxHelper(mesh, 0xffff00)
scene.add(box)
```

Axes helper (X axis is red, Y is green, Z is blue):

```js
scene.add(new THREE.AxesHelper(50))
```

Ako je teren jednobojan, bez svetla, uraditi:

```js
geometry.computeVertexNormals()
```

Stats:

```js
import Stats from '/node_modules/three/examples/jsm/libs/stats.module.js'
const stats = new Stats()
document.body.appendChild(stats.dom)
```

### Ammo Physics

Some methods:

```js
body.setFriction(.9)
body.setRollingFriction(10)
body.setRestitution(.95)
body.setAngularVelocity(btVector3)
body.setLinearVelocity(btVector3)

// apply a force to the x-axis of the rigid body
const force = new Ammo.btVector3(10, 0, 0);
body.applyForce(force, new Ammo.btVector3(0, 0, 0));

// apply an impulse (very short duration force, like a punch or a kick) to the x-axis
body.applyImpulse(new Ammo.btVector3(10, 0, 0))

// jump
body.applyCentralImpulse(new Ammo.btVector3(0, mass * .5, 0))
```

## Sources

Examples are from theese great books and tutorials:

* 3D Game Programming for Kids (Chris Strom)
* [Interactive 3D Graphics](https://in.udacity.com/course/interactive-3d-graphics--cs291/) (Eric Haines)
* [Three.js tutorials by example](http://stemkoski.github.io/Three.js/) (Lee Stemkoski)
* [WebGL and Three.js Fundamentals](https://github.com/alexmackey/threeJsBasicExamples) (Alex Mackey)
* [Examples created by Yomotsu using THREE.js](http://yomotsu.github.io/threejs-examples/) (Akihiro Oyamada)
* [Learning Threejs](https://github.com/josdirksen/learning-threejs) (Jos Dirksen)
* [Essential Three.js](https://github.com/josdirksen/essential-threejs) (Jos Dirksen)
* [Three.js Cookbook](https://github.com/josdirksen/threejs-cookbook) (Jos Dirksen)
* [How to Design 3D Games with Web Technology - Book 01: Three. Js - HTML5 and WebGL](https://thefiveplanets.org/b01/) (Jordi Josa)

Free 3D Models are from: 
- 3dwarehouse.sketchup.com
- sketchfab.com
- turbosquid.com 
- mixamo.com
- archive3d.net
- rigmodels.com
and other respected sites.

Game UI: https://ronenness.github.io/RPGUI/

Geodata:
- visinske mape za ceo svet https://tangrams.github.io/heightmapper/#8.3724/43.3401/19.5293
- weighted random https://pixelero.wordpress.com/2008/04/24/various-functions-and-various-distributions-with-mathrandom/

Ako sam propustio da navedem neki izvor, molim vas da mi javite. Već 10 godina pratim razne knjige, kurseve, repozitorije i druge materijale vezano za Three.js, više ni sam ne znam gde sam nešto našao.

## Manifest

Pravim 3D scene iz čistog zadovoljstva, ali sve vreme imam na umu reusability - da neko drugi može iskoristiti delove igara i razne funkcije za svoje potrebe.
