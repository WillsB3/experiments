'use strict';

console.info('Loaded');

const container = document.querySelector('#stage');
const renderer = PIXI.autoDetectRenderer(container.clientWidth, 
    container.clientHeight, { transparent: true });

container.appendChild(renderer.view);

const MAX_PARTICLES = 100;
const MAX_PARTICLES_GL = 2500;
const SPRITE_NUM_VARIATIONS_PER_COLOUR = 8;
const SPRITE_COLOURS = [
  'blue',
  'green',
  'orange'
];

const TOTAL_PARTICLES = renderer instanceof PIXI.WebGLRenderer ? 
    MAX_PARTICLES_GL : MAX_PARTICLES;

var mouseX = container.clientWidth / 2;

// create the root of the scene graph.
const stage = new PIXI.Container();

// create the Particle Container and add it to the stage.
const particleContainers = {};

SPRITE_COLOURS.forEach(function (colour) {
  for (var i = 1; i <= SPRITE_NUM_VARIATIONS_PER_COLOUR; i++) {
    var totalParticles = Math.ceil(TOTAL_PARTICLES / SPRITE_COLOURS.length / 
        SPRITE_NUM_VARIATIONS_PER_COLOUR);

    var container = new PIXI.ParticleContainer(totalParticles, {
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true
    });

    particleContainers[colour + '-' + i] = container;
    stage.addChild(container);
  }
});

// create an array to store all the sprites.
const confetti = [];

for (var i = 0; i < TOTAL_PARTICLES; i++) {
  // pick a random colour and sprite number.
  var color = getRandArrayItem(SPRITE_COLOURS);
  var variant = Math.floor(getRandBetween(1, SPRITE_NUM_VARIATIONS_PER_COLOUR));
  var particleContainer = particleContainers[color + '-' + variant];

  // create a new sprite.
  var texturePath = `img/confetti/${color}-${variant}@2x.png`;
  var particle = PIXI.Sprite.fromImage(texturePath);

  // particle.tint = Math.random() * 0xE8D4CD;

  // set the anchor point so the texture is centerd on the sprite.
  particle.anchor.set(0.5);

  // set initial scale
  var scaleFactor = getRandBetween(0.3, 0.4) * 0.4;
  particle.scale.x = scaleFactor;
  particle.scale.y = scaleFactor;

  // set initial position
  var startMin = {
    x: -100,
    y: -renderer.height
  };

  var startMax = {
    x: renderer.width + 100,
    y: 0 
  };

  particle.initialX = getRandBetween(startMin.x, startMax.x);
  particle.initialY = getRandBetween(startMin.y, startMax.y);
  particle.x = particle.initialX;
  particle.y = particle.initialY;
  particle.seed = Math.random();
  particle.rotationScalar = getRandBetween(-1, 1) * 0.27;

  // particle.tint = Math.random() * 0x808080;

  // create a random direction in radians.
  particle.direction = Math.PI * 2;
  // 2 & Math.PI = 360 deg.
  

  // create a random speed between 0 - 2.
  particle.speed = (8 + Math.random() * 8) * 0.2;

  particle.offset = Math.random() * 100;

  // finally we push the particle into the particles array so it it can be 
  // easily accessed later.
  confetti.push(particle);

  particleContainer.addChild(particle);
}

// create a bounding box box for the particles.
var boundsPadding = 50;
var bounds = new PIXI.Rectangle(-boundsPadding, -boundsPadding, 
    renderer.width + boundsPadding * 2, renderer.height + boundsPadding * 2);

var tick = 0;

requestAnimationFrame(animate);

function animate() {
  var windowWidth = window.innerWidth;

  // iterate through the sprites and update their position
  for (var i = 0; i < confetti.length; i++) {
    var particle = confetti[i];
    var progress = particle.position.y / renderer.height;
    particle.alpha = 1 - progress;

    particle.position.x += Math.sin(particle.direction) * (particle.speed * particle.scale.y);
    particle.position.y += Math.cos(particle.direction) * (particle.speed * particle.scale.y);
    // particle.rotation = -particle.direction + Math.PI;
    
    particle.rotation = Math.PI * tick * particle.rotationScalar;

    // track towards mouse position
    var xDiff = particle.position.x - mouseX;
    // particle.position.x -= (xDiff * 0.001);
    particle.position.x -= Math.sin(particle.seed * tick) * 0.2;

    // wrap the particles when are out of view
    if (particle.position.y < bounds.y) {
      particle.position.y += bounds.height;
      particle.position.x = particle.initialX;
    } else if (particle.position.y > bounds.y + bounds.height) {
      particle.position.y -= bounds.height;
      particle.position.x = particle.initialX;
    }
  }

  // increment the ticker
  tick += 0.1;

  // time to render the stage !
  renderer.render(stage);

  // request another animation frame...
  requestAnimationFrame(animate);
}

// http://stackoverflow.com/a/5915122
function getRandArrayItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// http://stackoverflow.com/a/7228322
function getRandBetween(min, max) {
  return Math.random() * (max-min+1) + min;
}

document.addEventListener('mousemove', function (e) {
  mouseX = e.pageX; 
});
