// Renders the audio scene into something to render.


function AudioScene(audioScene) {
  // Set the scene size.
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, 1, 0.001, 700);
  var renderer = new THREE.WebGLRenderer();
  var effect = new THREE.StereoEffect(renderer);
  effect.separation = 0.2;

  renderer.setClearColor(0x000000, 1);
  //camera.position.set(0,-5);
  //camera.up = new THREE.Vector3(0,0,-1);
  //camera.lookAt(new THREE.Vector3(0,0,0));
  camera.position.z = 3;

  // TODO(smus): Make the light more appealing.
  var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
  scene.add(light);

  var controls = new DeviceOrientationController(camera, renderer.domElement);
  controls.connect();

  this.scene = scene;
  this.renderer = renderer;
  this.camera = camera;
  this.effect = effect;
  this.observerObject = this.addObserver();
  this.controls = controls;

  // Handle resizing.
  window.addEventListener('resize', this.onResize.bind(this), false);
  this.onResize();

  var container = document.querySelector('#container');
  container.appendChild(renderer.domElement);
}

AudioScene.prototype.addSource = function(x, y, opt_color) {
  var color = opt_color || 0xff0000;
  var geometry = new THREE.BoxGeometry(0.3,0.3,0.3);
  var material = new THREE.MeshBasicMaterial({color: color});
  var cube = new THREE.Mesh(geometry, material);
  cube.position.x = x;
  cube.position.y = y;

  // Add the sphere to the scene.
  this.scene.add(cube);
  return cube;
};

AudioScene.prototype.addObserver = function() {
  // top: 0, bottom radius: 0.5, height: 1.
  var geometry = new THREE.CylinderGeometry(0, 0.5, 1, 32, 1, false);
  var material = new THREE.MeshBasicMaterial({color: 0xffffff});
  var object = new THREE.Mesh(geometry, material);
  this.scene.add(object);
  return object;
}

AudioScene.prototype.moveObserver = function(x, y) {
  this.observerObject.position.x = x;
  this.observerObject.position.y = y;
};

AudioScene.prototype.turnObserver = function(angle) {
  this.observerObject.rotation.z = angle + Math.PI/2;
};

AudioScene.prototype.render = function() {
  // Update the observer object position based on the audio DOM.
  var observer = document.querySelector('audio-observer');
  if (observer.position) {
  this.moveObserver(observer.position.x, observer.position.y);
  this.turnObserver(observer.getAngle());
  } else {
    console.log('Observer position not set yet.');
  }
  this.effect.render(this.scene, this.camera);
  this.controls.update();
  //this.renderer.render(this.scene, this.camera);
  requestAnimationFrame(this.render.bind(this));
}

AudioScene.prototype.createOrbitControls = function() {
  controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
  controls.rotateLeft(-Math.PI / 2);
  controls.target.set(
    this.camera.position.x + 0.1,
    this.camera.position.y,
    this.camera.position.z
  );
  controls.noZoom = true;
  controls.noPan = true;
  controls.noKeys = true;
  controls.autoRotate = true;
  return controls;
};

AudioScene.prototype.onClick = function() {
  var container = document.querySelector('#container');
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
};

AudioScene.prototype.onResize = function() {
  var container = document.querySelector('#container');
  var width = container.offsetWidth;
  var height = container.offsetHeight;

  this.camera.aspect = width / height;
  this.camera.updateProjectionMatrix();

  this.renderer.setSize(width, height);
  this.effect.setSize(width, height);
};

window.addEventListener('polymer-ready', function() {
  as = new AudioScene();
  as.addSource(1, 0, 0xff0000);
  as.addSource(0, 1, 0x00ff00);
  as.addSource(-1, 0, 0x0000ff);
  as.render();
});
