var FS = require('fs');

var trimSpaces = function(str) {
	return str.replace(/\s+/g, ' ').trim();
};

var parseSprites = function(sprites, prefix) {

	var nsLogger = {};
	var PRENAME = '$__sprite';
	var RETINA = prefix ? ('-' + prefix) : '';
		
	var css = sprites.map(function(sprite) {
		var iname;
		var vname = iname = sprite.name;
		var at = vname.indexOf('@');
		if(at > 0) {
			vname = vname.replace('@', '-');
			iname = iname.substring(0, at);
		}
		var exec = /^(\w+)\-/.exec(vname);
		var namespace = exec ? exec[1] : 'default';
			
		if(!nsLogger.hasOwnProperty(namespace)) {
			nsLogger[namespace] = [];
				
		}
		nsLogger[namespace].push([vname, iname]);

		return (`
			${PRENAME}-${vname}: (
				'name': '${iname}',
				'namespace': '${namespace}',
				'width': ${sprite.width},
				'height': ${sprite.height},
				'escaped_image': '${sprite.escaped_image}',
				'offset_x': ${sprite.offset_x},
				'offset_y': ${sprite.offset_y},
				'total_width': ${sprite.total_width},
				'total_height': ${sprite.total_height}
			);
		`);
	});

	var namespace = Object.keys(nsLogger)
		.map(function(name) {
			var subs = this[name].map(function(spr) {
				return `'${spr[1]}': ${PRENAME}-${spr[0]}`;
			}).join();
			return `'${name}': (${subs})`;
		}, nsLogger)
		.join();

	css.push(`
		${PRENAME}-namespace${RETINA}: (${namespace});
	`);

	var sprite = sprites[0];
	css.push(`
		${PRENAME}-spritesheet${RETINA}: (
			'escaped_image': '${sprite.escaped_image}',
			'total_width': ${sprite.total_width},
			'total_height': ${sprite.total_height}
		);
	`);
	return css.map(trimSpaces).join('\n');
};

module.exports = function(data) {
	var css = parseSprites(data.sprites);
	if(data.retina_sprites) {
		css += '\n';
		css += parseSprites(data.retina_sprites, '2x');
	}
	css += '\n\n\n\n';
	css += FS.readFileSync(__dirname + '/lib/function.scss').toString();
	return css;
};