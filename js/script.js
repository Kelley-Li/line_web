var stats,
	particles = [];

Math.range = function(min, max) {
	if (!max) {
		max = min;
		min = 0;
	}
	return min + Math.random() * (max - min);
};

Math.chance = function(probability) {
	if (!probability) {
		probability = 0.5;
	}
	return Math.random() < probability;
};

function toRGB(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function Particle() {
	this.isActive = (Math.chance(0.5));
}

Particle.COLORS = ['#ff0000', '#daede6', '#a3d9cc', '#738076', '#734357', '#f5496b', '#e3b1be'];

Particle.prototype.init = function() {
	this.radius = 1;
	this.color = toRGB(Particle.COLORS[Math.round(Math.random() * (Particle.COLORS.length - 1))]);
	this.alpha = 1;
	this.fade = Math.range(0.005, 0.25);
	this.grow = (this.fade > 0.01) ? Math.range(0.25, 0.5) : Math.range(0.05, 0.4);

	if (!this.isActive) {
		this.x += Math.range(-10, 10);
		this.y += Math.range(-10, 10);
	}
};

Particle.prototype.update = function() {
	if (this.isActive) {
		this.alpha -= this.fade;
		this.radius += this.grow;
	}
	if (this.alpha <= 0) {
		this.init();
	}
};

Particle.prototype.draw = function(ctx) {
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
	ctx.fillStyle = 'rgba(' + this.color.r + ', ' + this.color.g + ', ' + this.color.b + ', ' + this.alpha + ')';
	ctx.fill();
};

Sketch.create({

	setup: function() {

		var particle,
			center = {
				x: this.width / 2,
				y: (this.height / 2) - 50
			};

		for (var i = 0; i < 400; i++) {
			particle = new Particle();
			particle.x = center.x + 180 * Math.pow(Math.sin(i), 3);
			particle.y = center.y + 10 * (-(15 * Math.cos(i) - 5 * Math.cos(2 * i) - 2 * Math.cos(3 * i) - Math.cos(4 * i)));
			particle.init();
			particles.push(particle);
		}

		// stats = new Stats();
		// this.container.appendChild(stats.domElement);
	},

	draw: function() {

		var particle;

		for (var i = 0, length = particles.length; i < length; i++) {
			particle = particles[i];
			particle.update();
			particle.draw(this);
		}

		// stats.update();
	},

	keyup: function(event) {
		var key = event.which || event.keyCode;
		if (key == 32) {
			this.toggle();
		}
	}
});