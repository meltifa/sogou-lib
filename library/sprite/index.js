'use strict';

const fs = require('fs');
const prefix = '$__sprite-';

function mapSprite(group) {
	// $__sprite-delete: ("name": "delete");
	let suffix = this.retina ? '-2x' : '';
	let json = this[group].map(function(sprite) {
		let stringify = JSON.stringify(sprite).replace('{', '(').replace('}', ')');
		return prefix + sprite.name + suffix + ': ' + stringify + ';';
	});
	return json.join('\n');
}

function mapGroup(group) {
	// "delete": $__sprite-delete
	let suffix = this.retina ? '-2x' : '';
	let json = this[group].map(function(sprite) {
		return '"' + sprite.name + '"' + ': ' + prefix + sprite.name + suffix;
	});
	// $__sprite-default: ("delete": $__sprite-delete);
	return prefix + group + suffix + ': (' + json.join(', ') + ');';
}

function generateNamespace(data) {
	let groups = Object.keys(data);
	let suffix = data.retina ? '-2x' : '';
	let stringify = Object.keys(data).map(function(group) {
		return '"' + group + '": ' + prefix + group + suffix;
	}).join(', ');
	// $__sprite-namespace-2x: ("icon": $__sprite-icon-2x)
	return prefix + 'namespace' + suffix + ': (' + stringify + ');';
}

function parseSprites(sprites) {
	const data = sprites.reduce(function(logger, sprite) {
		let filename = sprite.name;
		let hyphen = filename.indexOf('-');
		const retina = filename.indexOf('@');
		const group = (hyphen > 0) ? filename.substring(0, hyphen) : 'default';
		const name = (retina > 0) ? filename.substring(0, retina) : filename;
		if(!logger.hasOwnProperty('retina')) {
			Object.defineProperty(logger, 'retina', {
				value: Boolean(retina > 0)
			});
		}
		if(!logger.hasOwnProperty(group)) {
			Object.defineProperty(logger, group, {
				value: [],
				enumerable: true
			});
		}
		logger[group].push({
			name: name,
			width: sprite.width,
			height: sprite.height,
			escaped_image: sprite.escaped_image,
			offset_x: sprite.offset_x,
			offset_y: sprite.offset_y,
			total_width: sprite.total_width,
			total_height: sprite.total_height
		});
		return logger;
	}, {});

	let groups = Object.keys(data);
	const css = [
		groups.map(mapSprite, data).join('\n'),
		groups.map(mapGroup, data).join('\n'),
		generateNamespace(data)
	];
	return css.join('\n');
}

function parseSpritesheet(spritesheet, retina) {
	let suffix = retina ? '-2x' : '';
	let info = {
		width: spritesheet.width,
		height: spritesheet.height,
		total_width: spritesheet.width,
		total_height: spritesheet.height,
		escaped_image: spritesheet.escaped_image
	};
	let stringify = JSON.stringify(info).replace('{', '(').replace('}', ')');
	// $__sprite-spritesheet: ("total_width": 20)
	return prefix + 'spritesheet' + suffix + ': ' + stringify + ';';
}

module.exports = function(data) {
	const css = [];
	css.push(parseSprites(data.sprites));
	css.push(parseSpritesheet(data.spritesheet));
	if(data.retina_sprites) {
		css.push(parseSprites(data.retina_sprites));
		css.push(parseSpritesheet(data.retina_spritesheet, true));
	}
	css.push('\n\n');
	css.push(fs.readFileSync(__dirname + '/lib/function.scss').toString());
	return css.join('\n');
};