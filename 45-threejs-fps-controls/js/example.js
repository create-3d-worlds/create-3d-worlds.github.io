var Harvest = (function () {

  // Instance stores a reference to the Singleton
  var instance;

  function startGame() {

    // Singleton

	var camera, scene, renderer;
	var geometry, material, mesh;
	var controls;
	var boxes = [];
	var objects = [];

	var WON = false;
	var timer;
    var fog = 100;


	init();
	animate();

	var prevTime = performance.now();
	var velocity = new THREE.Vector3();


	function init() {

		initialiseTimer();
		eventHandlers();
		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0xffffff, 0, fog + 1000 );

		// Sky
		var pwd = window.location.href.substring(0, window.location.href.indexOf('/'));
		var sky = new THREE.SphereGeometry(8000, 32, 32); // radius, widthSegments, heightSegments

		skyBox = new THREE.Mesh(sky);
		skyBox.scale.set(-1, 1, 1);
		skyBox.eulerOrder = 'XZY';
		skyBox.renderDepth = 1000.0;
		scene.add(skyBox);

		// Floor
		var floorHeight = 7000;
		geometry = new THREE.SphereGeometry(floorHeight, 10, 6, 0, (Math.PI * 2), 0, 0.8);
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, -floorHeight, 0) );

		var material = new THREE.MeshLambertMaterial( );

		floorMesh = new THREE.Mesh( geometry, material );
		objects.push( floorMesh );
		scene.add( floorMesh  );

		// Boxes
		var boxGeometry = new THREE.BoxGeometry( 20, 20, 20 );
		var boxTexture1 = new THREE.ImageUtils.loadTexture("img/block1.jpg");
		var boxTexture2 = new THREE.ImageUtils.loadTexture("img/block2.jpg");
		var boxTexture3 = new THREE.ImageUtils.loadTexture("img/block3.jpg");
		var boxTexture4 = new THREE.ImageUtils.loadTexture("img/block4.jpg");
		var boxMaterial1 = new THREE.MeshBasicMaterial( {map: boxTexture1, reflectivity: 0.8} );
		var boxMaterial2 = new THREE.MeshBasicMaterial( {map: boxTexture2, reflectivity: 0.8} );
		var boxMaterial3 = new THREE.MeshBasicMaterial( {map: boxTexture3, reflectivity: 0.8} );
		var boxMaterial4 = new THREE.MeshBasicMaterial( {map: boxTexture4, reflectivity: 0.8} );
		var items = [boxMaterial1 ,boxMaterial2, boxMaterial3, boxMaterial4];
		var boxZ;
		for ( var i = 0; i < 850; i ++ ) {

			var boxmesh = new THREE.Mesh( boxGeometry, items[Math.floor(Math.random()*items.length)] );

			boxZ = 50;
			boxmesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
			boxmesh.position.y = Math.floor( Math.random() * 20 ) * boxZ + 10;
			boxmesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;

			boxes.push( boxmesh );
			objects.push( boxmesh );
			scene.add( boxmesh );
		}


		camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 9000 );
		controls = new THREE.PointerLockControls( camera, 100, 30, true, objects );
		scene.add( controls.getPlayer() );

		renderer = new THREE.WebGLRenderer({ antialias: true }); //new THREE.WebGLRenderer();
		renderer.setClearColor( 0xffffff );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		ScreenOverlay(controls); //
		document.body.appendChild( renderer.domElement );

	}

	function animate() {

		requestAnimationFrame( animate );

		if ( controls.enabled ) {

            controls.updateControls();

		}
		renderer.render( scene, camera );

	}

	function randomTexture(maxTextures) {
		return Math.floor(Math.random() * maxTextures) + 1;
	}

	function initialiseTimer() {
		var sec = 0;
		function pad ( val ) { return val > 9 ? val : "0" + val; }

		timer = setInterval( function(){
			document.getElementById("seconds").innerHTML = String(pad(++sec%60));
			document.getElementById("minutes").innerHTML = String(pad(parseInt(sec/60,10)));
		}, 1000);
	}

	function eventHandlers() {

		// Keyboard press handlers
		var onKeyDown = function ( event ) { event.preventDefault(); event.stopPropagation(); handleKeyInteraction(event.keyCode, true); };
		var onKeyUp = function ( event ) { event.preventDefault(); event.stopPropagation(); handleKeyInteraction(event.keyCode, false); };
		document.addEventListener( 'keydown', onKeyDown, false );
		document.addEventListener( 'keyup', onKeyUp, false );

		// Resize Event
		window.addEventListener( 'resize', onWindowResize, false );
	}

	// HANDLE KEY INTERACTION
	function handleKeyInteraction(keyCode, boolean) {
		var isKeyDown = boolean;

		switch(keyCode) {
			case 38: // up
			case 87: // w
				controls.movements.forward = boolean;
				break;

			case 40: // down
			case 83: // s
				controls.movements.backward = boolean;
				break;

			case 37: // left
			case 65: // a
				controls.movements.left = boolean;
				break;

			case 39: // right
			case 68: // d
				controls.movements.right = boolean;
				break;

			case 32: // space
				if (!isKeyDown) {
					controls.jump();
				}
				break;

            case 16: // shift
                controls.walk(boolean);
                break;

            case 67: // crouch (CTRL + W etc destroys tab in Chrome!)
                controls.crouch(boolean);

		}
	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}


	function fallingBoxes(cube, pos, delay) {
		//console.log(cube,pos,delay)
		setTimeout(function() { cube.position.setY(pos); }, delay);
	}

    return {
		// Public methods and variables
		setFog: function (setFog) {
			fog = setFog;
		},
		setJumpFactor: function (setJumpFactor) {
			jumpFactor = setJumpFactor;
		}

    };

  };

  return {

    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function () {

      if ( !instance ) {
        instance = startGame();
      }

      return instance;
    }

  };

})();

harvest = Harvest.getInstance();
