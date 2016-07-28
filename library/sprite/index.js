'use strict';

const fs = require('fs');

function toSCSS(data) {
	return JSON.stringify(data, null, '\t').replace(/\{/g, '(').replace(/\}/g, ')');
}

function parseSprites(options, sprites) {
	const byDir = options.byDir;
	const data = sprites.reduce(function(logger, sprite) {
		const filename = sprite.name;
		let group;
		if(byDir) {
			group = sprite.source_image.replace(/\\/g, '/').match(/\/([^\/]+)\/[^\/]+$/)[1];
		} else {
			const hyphen = filename.indexOf('-');
			group = (0 < hyphen) ? filename.substring(0, hyphen) : 'default';
		}
		const retina = filename.indexOf('@');
		const name = (0 < retina) ? filename.substring(0, retina) : filename;
		if(!logger.hasOwnProperty(group)) {
			logger[group] = Object.create(null);
		}
		logger[group][name] = {
			name: name,
			width: sprite.width,
			height: sprite.height,
			escaped_image: sprite.escaped_image,
			offset_x: sprite.offset_x,
			offset_y: sprite.offset_y,
			total_width: sprite.total_width,
			total_height: sprite.total_height,
			url: sprite.escaped_image
		};
		return logger;
	}, {});
	return toSCSS(data);
}

function parseSpritesheet(sheet) {
	const data = {
		width: sheet.width,
		height: sheet.height,
		total_width: sheet.width,
		total_height: sheet.height,
		escaped_image: sheet.escaped_image,
		url: sheet.escaped_image
	};
	return toSCSS(data);
}

function dataHandler(options, data) {
	const css = [];
	css.push('$__sprite-sheet__: ' + parseSpritesheet(data.spritesheet) + ';');
	css.push('$__sprite-group__: ' + parseSprites(options, data.sprites) + ';');
	if(data.retina_sprites) {
		css.push('$__sprite-sheet-2x__: ' + parseSpritesheet(data.retina_spritesheet) + ';');
		css.push('$__sprite-group-2x__: ' + parseSprites(options, data.retina_sprites) + ';');
	}
	css.push('\n\n');
	css.push(fs.readFileSync(__dirname + '/lib/function.scss').toString());
	return css.join('\n');
}

const defaultOptions = {
	byDir: false
};

module.exports = function(arg) {
	const data = Object(arg);
	if(data.spritesheet && data.sprites) {
		return dataHandler(defaultOptions, data);
	}
	return dataHandler.bind(null, Object.defineProperties(Object.create(null), {
		byDir: { value: Boolean(data.byDir) }
	}));
};