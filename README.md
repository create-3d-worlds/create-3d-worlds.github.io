# Create 3D worlds

Library of reusable Three.js components.

Za razliku od ostalih kul Three.js primera koje možete samo gledati, ovde možete kombinovati različite elemente i praviti nove scene. Možete uzeti junaka iz jedne scene, zgrade iz druge, prirodu iz treće, itd.

Nadam se da ćete se zabavljati kao ja dok sam ovo pravio.

Developed by [mudroljub](https://twitter.com/mudroljub).

## Start

```
npm i
npx live-server
```

## TODO

### Publish
- srediti root-relativne linkove da rade u podfolderu
  - manuelna zamena u relativne linkove (loše)
  - postaviti na github organizaciju (bolje, ali menja vlasnika i url)
  - probati build proces (vidi sun position)
- centralni ekran sa izborom scena 
  - srediti html titlove
- dokumentovati
- minimalni bekend za statistike / brojač poseta
- testirati na raznim uređajima nakon dizanja na server

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
