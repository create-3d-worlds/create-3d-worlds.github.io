/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera, mass, playerHeight, doubleJump, worldObjects ) {

	var scope = this;

	scope.worldObjects = worldObjects;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = playerHeight;
	yawObject.add( pitchObject );

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	scope.dispose = function() {

		document.removeEventListener( 'mousemove', onMouseMove, false );

	};

	document.addEventListener( 'mousemove', onMouseMove, false );

	scope.enabled = false;

	scope.getPlayer = function () {

		return yawObject;

	};

	scope.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, - 1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		};

	}();

	// FPS Controls Additions

	scope.updatePlayerHeight = function(height) {
		yawObject.position.y = height;
	};

	scope.raycasters = {

		down : new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 20 ),
		up : new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 1, 0 ), 0, 20 ),
		forward : new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0, 15 ),
		backward : new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 15 ),
		left : new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 15 ),
		right : new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 15 ),
		rightStrafe : new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 30 ),
		leftStrafe : new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 30 ),

		updateRaycasters : function() {

			this.up.ray.origin.copy(scope.playersPosition);
			this.down.ray.origin.copy(scope.playersPosition);
			this.forward.ray.set(scope.playersPosition, scope.camDir);
			this.backward.ray.set(scope.playersPosition, scope.camDir.negate());
			this.left.ray.set(scope.playersPosition, scope.camDir.applyMatrix4( new THREE.Matrix4().makeRotationY(- (Math.PI / 2) )));
			this.right.ray.set(scope.playersPosition, scope.camDir.applyMatrix4( new THREE.Matrix4().makeRotationY( Math.PI )));
			this.rightStrafe.ray.set(scope.playersPosition, scope.camDir.applyMatrix4( new THREE.Matrix4().makeRotationY(  (Math.PI / 4) ))); // Working
			this.leftStrafe.ray.set(scope.playersPosition, scope.camDir.applyMatrix4( new THREE.Matrix4().makeRotationY(  (Math.PI / 4) )));

		}

	};

	scope.intersections = {

		down :  scope.raycasters.down.intersectObjects(worldObjects),
		up :  scope.raycasters.up.intersectObjects(worldObjects ),
		forward : scope.raycasters.forward.intersectObjects(worldObjects ),
		backward : scope.raycasters.backward.intersectObjects(worldObjects ),
		left : scope.raycasters.left.intersectObjects(worldObjects ),
		right :  scope.raycasters.right.intersectObjects(worldObjects ),
		rightStrafe : scope.raycasters.rightStrafe.intersectObjects(worldObjects ),
		leftStrafe : scope.raycasters.leftStrafe.intersectObjects(worldObjects ),

		checkIntersections : function() {

			this.down =  scope.raycasters.down.intersectObjects(worldObjects);
			this.up =  scope.raycasters.up.intersectObjects(worldObjects );
			this.forward = scope.raycasters.forward.intersectObjects(worldObjects );
			this.backward = scope.raycasters.backward.intersectObjects(worldObjects );
			this.left = scope.raycasters.left.intersectObjects(worldObjects );
			this.right =  scope.raycasters.right.intersectObjects(worldObjects );
			this.rightStrafe = scope.raycasters.rightStrafe.intersectObjects(worldObjects );
			this.leftStrafe = scope.raycasters.leftStrafe.intersectObjects(worldObjects);

		}

	};

	scope.movements = {

		forward : false,
		backward : false,
		left : false,
		right : false,

		locks : {
			forward : true,
			backward : true,
			left : true,
			right : true,
		},

		lock : function() {
			var intersections = scope.intersections;
			for (var direction in intersections) {
			  if (intersections[direction].length > 0) {
				  //console.log(direction, "lock");
				  this.locks[direction] = true;
			  }
			}
		},

		unlock : function() {
			this.locks.forward = false;
			this.locks.backward = false;
			this.locks.left = false;
			this.locks.right = false;
		}

	};

	scope.doubleJump = doubleJump;
	scope.baseHeight = 0; // The minimum plane height
	scope.mass = mass || 100;
	scope.originalMass = mass;
	scope.walkingSpeed = 3000; // Higher = slower
	scope.speed = 900; // Movement speed
	scope.jumpFactor = 90; // Jump height
	scope.velocity = new THREE.Vector3(1, 1, 1);

	scope.jumps = 0;
	scope.firstJump = true;
	scope.walking = false;

	// Crouched
	scope.crouching = false;
	var halfHeight;
	var fullHeight;
	var crouchSmoothing;
	var smoothedHeight;
	var crouched = false;

	// Jump Variables
	scope.jumping = false;

	scope.jump = function() {
		scope.jumping = true;
	};

	scope.crouch = function(boolean) {
		scope.crouching = boolean;
	};

	scope.walk = function(boolean) {
		scope.walking = boolean;
	};

	// So you can update the world objects when they change
	scope.updateWorldObjects = function(worldObjects) {
		scope.worldObjects = worldObjects;
	};

	scope.updateControls = function() {

		scope.time = performance.now();

		scope.movements.unlock();

		// Check change and if Walking?
		scope.delta = (scope.walking) ? ( scope.time - scope.prevTime ) / scope.walkingSpeed : ( scope.time - scope.prevTime ) / scope.speed;
		var validDelta = isNaN(scope.delta) === false;
		if (validDelta) {

			// Velocities
			scope.velocity.x -= scope.velocity.x * 8.0 * scope.delta; // Left and right
			scope.velocity.z -= scope.velocity.z * 8.0 * scope.delta; // Forward and back
			scope.velocity.y -= (scope.walking) ?  9.8 * scope.mass * scope.delta : 5.5 * scope.mass * scope.delta;  // Up and Down

			scope.camDir = scope.getPlayer().getWorldDirection().negate(); //
			scope.playersPosition = scope.getPlayer().position.clone();

			scope.raycasters.updateRaycasters();
			scope.intersections.checkIntersections();
			scope.movements.lock();

			// If your head hits an object, turn your mass up to make you fall back to earth
			scope.isBelowObject = scope.intersections.up.length > 0;
			scope.mass = (scope.isBelowObject === true ) ? 500 : scope.originalMass;

			scope.isOnObject = scope.intersections.down.length > 0;
			if ( scope.isOnObject === true ) {
				scope.velocity.y = Math.max( 0, scope.velocity.y );
				scope.jumps = 0;

				//If we start to fall through an object
				// if ((this.getPlayer().position.y  < playerHeight) &&
				// 	 scope.downwardsIntersection &&
				// 	 scope.downwardsIntersection[0].distance < (playerHeight / 2) ) {
				//
				// 	 this.getPlayer().position.y += 0.1;
				// }

			} else {
				this.walking = false;
			}

			// Crouched



			if (!crouched && scope.isOnObject) {
				console.log("Not Crouched");
				halfHeight = scope.getPlayer().position.y - (playerHeight * 0.2);
				fullHeight = scope.getPlayer().position.y + (playerHeight * 0.2);
			}

			if (scope.crouching && scope.isOnObject) {

				scope.walking = true;
				if (!crouched && !scope.justCrouched) {
					scope.updatePlayerHeight(halfHeight);
					crouchSmoothing = 0;
					smoothedHeight = 0;
					crouched = true;

					 // Stop people from crouching through the floor
					scope.justCrouched = true;
					setTimeout(function() { scope.justCrouched = false; }, 300);
				}

			} else if (!scope.crouching && smoothedHeight <= fullHeight ){

				// Smooth out of crouching
				console.log("finished");
				smoothedHeight = halfHeight + crouchSmoothing;
				scope.updatePlayerHeight(smoothedHeight);
				crouchSmoothing += 2;
					//console.log(smoothedHeight)
				crouched = false;
				scope.walking = false;

			}

			// Jumping - must come after isBelowObject but before isOnObject
			if (scope.jumping) {

				scope.walking = false;
				scope.crouching = false;

				if (scope.jumps === 0 && !scope.isBelowObject) {
					scope.velocity.y += scope.jumpFactor * 2.3;
					scope.velocity.z *= 2; // Jumping also increases our forward velocity a little
					scope.jumps = 1;
				}
				else if (scope.doubleJump && scope.jumps === 1 && !scope.isOnObject && !scope.isBelowObject) {
					scope.velocity.y += scope.jumpFactor * 1.5;
					scope.jumps = 2;
				}

			}

			// Movements

			if ( scope.movements.forward && !scope.walking && !scope.movements.locks.forward) scope.velocity.z -= 400.0 * scope.delta;
			if ( scope.movements.forward && scope.walking && !scope.movements.locks.forward) scope.velocity.z -= 1000.0 * scope.delta;
			if ( scope.movements.backward && !scope.movements.locks.backward ) scope.velocity.z += 400.0 * scope.delta;
			if ( scope.movements.left && !scope.movements.locks.left ) scope.velocity.x -= 400.0 * scope.delta;
			if ( scope.movements.right && !scope.movements.locks.right ) scope.velocity.x += 400.0 * scope.delta;


			// Velocity translations
			scope.getPlayer().translateX( scope.velocity.x * scope.delta );
			scope.getPlayer().translateY( scope.velocity.y * scope.delta );
			scope.getPlayer().translateZ( scope.velocity.z * scope.delta );

			scope.jumping = false;

		}

		scope.prevTime = scope.time; // Set the previous time to the time we set at the begining

	};

};
