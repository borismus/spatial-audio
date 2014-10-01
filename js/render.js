// Renders the audio scene into something to render.


function AudioScene(audioScene) {
  this.isCardboard = this.isMobile();

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

  var observer = this.createObserver();
  scene.add(observer);

  this.scene = scene;
  this.renderer = renderer;
  this.camera = camera;
  this.effect = effect;
  this.observerObject = observer;

  if (this.isCardboard) {
    var controls = new DeviceOrientationController(camera, renderer.domElement);
    controls.connect();
    this.controls = controls;
  }

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

AudioScene.prototype.createObserver = function() {
  // top: 0, bottom radius: 0.5, height: 1.
  var geometry = new THREE.CylinderGeometry(0, 0.5, 1, 32, 1, false);
  var material = new THREE.MeshBasicMaterial({color: 0xffffff});
  var object = new THREE.Mesh(geometry, material);
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
  this.moveObserver(observer.position.x, observer.position.y);
  this.turnObserver(observer.getAngle());
  if (this.isCardboard) {
    this.effect.render(this.scene, this.camera);
    this.controls.update();
  } else {
    this.renderer.render(this.scene, this.camera);
  }
  requestAnimationFrame(this.render.bind(this));
}

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

AudioScene.prototype.isMobile = function() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

var COLORS = [0xff0000, 0x00ff00, 0x0000ff];
window.addEventListener('polymer-ready', function() {
  as = new AudioScene();
  var panners = document.querySelectorAll('audio-panner');
  for (var i = 0; i < panners.length; i++) {
    var panner = panners[i];
    as.addSource(panner.position.x, panner.position.y, COLORS[i % COLORS.length]);
  }
  as.render();
});
