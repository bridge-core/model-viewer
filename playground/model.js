export const sleepAnimation = {
	loop: true,
	animation_length: 2,
	bones: {
		body: {
			rotation: [60, 0, 90],
			position: [0, -5.5, 0],
			scale: {
				'0.0': [1, 1, 1],
				'1.0': [1.025, 1.025, 1.025],
				'2.0': [1, 1, 1],
			},
		},
		left_front_leg: {
			rotation: [70, -2, 120],
			position: [-6, -12, -3],
		},
		right_front_leg: {
			rotation: [25, -280, 40],
			position: {
				'0.0': [1, -4, 0],
				'1.0': [0.75, -3.75, 0],
				'2.0': [1, -4, 0],
			},
		},
		left_back_leg: {
			rotation: [30, 30, 50],
			position: {
				'0.0': [-8, 3, 7],
				'1.0': [-8.25, 3.25, 7],
				'2.0': [-8, 3, 7],
			},
		},
		right_back_leg: {
			rotation: [0, 0, 95],
			position: [-1, -2, 7],
		},
		head: {
			rotation: {
				'0.0': [25, -15, 90],
				'1.0': [25, -14.5, 90],
				'2.0': [25, -15, 90],
			},
			position: [0, -12, -5],
		},
		tail: {
			rotation: {
				'0.0': [-20, 15, 60],
				'1.0': [-20.5, 14.75, 60.5],
				'2.0': [-20, 15, 60],
			},
			position: {
				'0.0': [0, -1, 3],
				'1.0': [0, -1, 3.25],
				'2.0': [0, -1, 3],
			},
		},
		left_wing: {
			rotation: {
				'0.0': [75, 0, 15],
				'1.0': [75, 0, 17],
				'2.0': [75, 0, 15],
			},
			position: [3, -11, -4],
		},
		right_wing: {
			rotation: {
				'0.0': [70, 0, -190],
				'1.0': [70, 0, -192],
				'2.0': [70, 0, -190],
			},
			position: [6, -8, -5],
		},
	},
}
export const animation = {
	loop: true,
	animation_length: 2,
	bones: {
		body: {
			position: {
				'0.0': [0, 0, 0],
				'1.0': [0, 4, 0],
				'2.0': [0, 0, 0],
			},
		},
		left_front_leg: {
			rotation: {
				'0.0': [0, 0, 0],
				'1.0': [20, -10, -20],
				'2.0': [0, 0, 0],
			},
			position: {
				'0.0': [0, 0, 0],
				'1.0': [0, 4, 0],
				'2.0': [0, 0, 0],
			},
		},
		right_front_leg: {
			rotation: {
				'0.0': [0, 0, 0],
				'1.0': [20, 10, 20],
				'2.0': [0, 0, 0],
			},
			position: {
				'0.0': [0, 0, 0],
				'1.0': [0, 4, 0],
				'2.0': [0, 0, 0],
			},
		},
		left_back_leg: {
			rotation: {
				'0.0': [0, 0, 0],
				'1.0': [10, -15, -7],
				'2.0': [0, 0, 0],
			},
			position: {
				'0.0': [0, 0, 0],
				'1.0': [0, 4, 0],
				'2.0': [0, 0, 0],
			},
		},
		right_back_leg: {
			rotation: {
				'0.0': [0, 0, 0],
				'1.0': [10, 15, 7],
				'2.0': [0, 0, 0],
			},
			position: {
				'0.0': [0, 0, 0],
				'1.0': [0, 4, 0],
				'2.0': [0, 0, 0],
			},
		},
		head: {
			rotation: {
				'0.0': [0, 0, 0],
				'1.0': [10, 0, 0],
				'2.0': [0, 0, 0],
			},
			position: {
				'0.0': [0, 0, 0],
				'1.0': [0, 4, 0],
				'2.0': [0, 0, 0],
			},
		},
		tail: {
			rotation: {
				'0.0': [0, 0, 0],
				'1.0': [-15, 0, 0],
				'2.0': [0, 0, 0],
			},
			position: {
				'0.0': [0, 0, 0],
				'1.0': [0, 4, 0],
				'2.0': [0, 0, 0],
			},
		},
		left_wing: {
			rotation: {
				'0.0': [0, 0, 0],
				0.25: [0, -40, 0],
				0.5: [0, 0, 0],
				0.75: [0, -40, 0],
				'1.0': [0, 0, 0],
				1.25: [0, -40, 0],
				1.75: [0, -40, 0],
				'2.0': [0, 0, 0],
			},
			position: {
				'0.0': [0, 0, 0],
				'1.0': [0, 4, 0],
				'2.0': [0, 0, 0],
			},
		},
		right_wing: {
			rotation: {
				'0.0': [0, 0, 0],
				0.25: [0, 40, 0],
				0.4833: [0, 0, 0],
				0.75: [0, 40, 0],
				'1.0': [0, 0, 0],
				1.25: [0, 40, 0],
				1.75: [0, 40, 0],
				'2.0': [0, 0, 0],
			},
			position: {
				'0.0': [0, 0, 0],
				'1.0': [0, 4, 0],
				'2.0': [0, 0, 0],
			},
		},
	},
}

export const model = {
	description: {
		identifier: 'geometry.pesky_dragon',
		texture_width: 64,
		texture_height: 64,
	},

	bones: [
		{
			name: 'body',
			pivot: [0, 9.5, 0],
			rotation: [15, 0, 0],
			cubes: [
				{
					origin: [-4, 3, -3],
					size: [8, 13, 6],
					uv: [0, 1],
				},
			],
		},
		{
			name: 'left_front_leg',
			pivot: [3.5, 12.5, -3.5],
			rotation: [-20, 0, 0],
			cubes: [
				{
					origin: [2, 8, -5],
					size: [3, 5, 3],
					uv: [0, 32],
				},
			],
		},
		{
			name: 'right_front_leg',
			pivot: [-3.5, 12.5, -3.5],
			rotation: [-20, 0, 0],
			cubes: [
				{
					origin: [-5, 8, -5],
					size: [3, 5, 3],
					uv: [26, 28],
				},
			],
		},
		{
			name: 'left_back_leg',
			pivot: [3.5, 3.5, -1.5],
			cubes: [
				{
					origin: [2, 0, -3],
					size: [3, 5, 3],
					uv: [32, 6],
				},
			],
		},
		{
			name: 'right_back_leg',
			pivot: [-3.5, 3.5, -1.5],
			cubes: [
				{
					origin: [-5, 0, -3],
					size: [3, 5, 3],
					uv: [12, 32],
				},
			],
		},
		{
			name: 'head',
			pivot: [0, 16.5, -2.5],
			cubes: [
				{
					origin: [-3, 15, -8],
					size: [6, 5, 7],
					uv: [0, 20],
				},
			],
		},
		{
			name: 'tail',
			pivot: [0, 5, 4.5],
			rotation: [-15, 0, 0],
			cubes: [
				{
					origin: [-1, 4, 3],
					size: [2, 2, 7],
					uv: [21, 13],
				},
			],
		},
		{
			name: 'left_wing',
			pivot: [1, 13.5, 2],
			rotation: [15, -15, -5],
			cubes: [
				{
					origin: [0, 10, 2],
					size: [10, 6, 0],
					uv: [26, 22],
				},
			],
		},
		{
			name: 'right_wing',
			pivot: [-1, 13.5, 2],
			rotation: [15, 15, 5],
			cubes: [
				{
					origin: [-10, 10, 2],
					size: [10, 6, 0],
					uv: [22, 0],
				},
			],
		},
	],
}
