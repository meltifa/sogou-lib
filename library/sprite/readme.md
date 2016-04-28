为避免变量命名冲突，自动生成的变量均以 `$__sprite` 开头，在使用中，推荐将这些自动生成的变量当做不存在一样，不直接使用 `$__sprite-icon-coin` 这样的语法，而是使用公开的函数来取值。

###sprite-prop($name, $prop, $retina: false)###

 - $name: 图片名称
 - $prop: 属性名称，包括：
	 - `name`: 原图片名
	 - `namespace`: 所属命名空间
	 - `width`: 宽（无单位）
	 - `height`: 高（无单位）
	 - `offset_x`: 在雪碧图中的水平偏移（无单位）
	 - `offset_y`: 在雪碧图中的垂直偏移（无单位）
	 - `escaped_image`: 雪碧图地址
	 - `total_width`: 雪碧图总宽度
	 - `total_height`: 雪碧图总高度
 - $retina: 是否为查询高清雪碧图，当值不为布尔假的时候返回的雪碧图元素是高清元素

用法如：

	.icon-coin {
		// 使用图片名
		width: sprite-prop('icon-coin', 'width');
		// 或使用变量（不推荐这样写，但在遍历命名空间的时候可以这么用）
		height: sprite-prop($__sprite-icon-coin, 'height');
	}



###sprite-group($name, $retina: false)###

 - $name: 命名空间名称
 - $retina: 是否为查询高清雪碧图

在遍历中，如果临时参数只有一个，那么该参数是一个 SassList，如下用法：

	@each $list in sprite-group('icon') {
		$name: nth($list, 1);
		$sprite: nth($list, 2);
		// 或（注：此时用临时变量作为参数是推荐的）
		// $name: sprite-prop($sprite, 'name');
	}

以上用法是不推荐的，建议使用如下用法更便捷：

	@each $name, $sprite in sprite-group('icon') {
		$width: sprite-prop($sprite, 'width');
		$height: sprite-prop($sprite, 'height');
		$offset-x: sprite-prop($sprite, 'offset_x');
		$offset-y: sprite-prop($sprite, 'offset_y');

		// 创建一个选择器
		.#{$name} {
			// 继承某些公共属性
			@extend %-sprite-icon;
			// 设置某些私有属性
			width: #{$width}PX;
			height: #{$height}PX;
			background-position: #{$offset-x}PX #{$offset-y}PX;
		}
	}

###sprite-info($prop, $retina: false)###

查询雪碧图信息

 - $prop: 信息字段，可用的值有：
	 - `escaped_image`: 雪碧图地址
	 - `total_width`: 雪碧图总宽度
	 - `total_height`: 雪碧图总高度
 - $retina: 是否为查询高清雪碧图