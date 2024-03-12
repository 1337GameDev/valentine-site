const glob = require('fast-glob');
const path = require('node:path');
const packageJson = require('./package.json');
const xorUtils = (require(path.join(
	__dirname,
	'src/_11ty/xorEncodeFunctions.js'
))) ();

const isProd = process.env.NODE_ENV === 'production';

module.exports = function (eleventyConfig) {
	// ------------------------------------------------------------------------
	// Shortcodes
	// ------------------------------------------------------------------------

	glob.sync('src/_11ty/shortcodes/*.js').forEach((file) => {
		let shortcodes = require('./' + file);
		Object.keys(shortcodes).forEach((name) => {
			eleventyConfig.addNunjucksShortcode(name, shortcodes[name]);
		});
	});

	// ------------------------------------------------------------------------
	// Plugins
	// ------------------------------------------------------------------------

	const responsiverConfig = require(path.join(
		__dirname,
		'src/_11ty/images-responsiver-config.js'
	));

	const pack11tyPluginOptions = {
		responsiver: isProd && responsiverConfig,
		minifyHtml: isProd,
		markdown: {
			firstLevel: 2,
			containers: ['success', 'warning', 'error'],
		},
		collectionsLimit: isProd ? false : 10,
	};

	const pack11ty = require('eleventy-plugin-pack11ty');
	eleventyConfig.addPlugin(pack11ty, pack11tyPluginOptions);

	eleventyConfig.setDataDeepMerge(true);
	eleventyConfig.setQuietMode(true);

	// ------------------------------------------------------------------------
	// Custom Filters
	// ------------------------------------------------------------------------

	/**
	 * Parses a file system path and returns either the file name or directory.
	 * @param {string} path
	 * @param {'name'|'dir'} key
	 */
	const pathParse = (path, key) => path.parse(path)[key];

	/**
	 * Joins an arbitrary number of paths using the OS separator.
	 * @param {string[]} paths
	 */
	const pathJoin = (...paths) => path.join(...paths);

	/** Converts the given date string to ISO8601 format. */
	const toISOString = (dateString) => new Date(dateString).toISOString();

	/** Formats a date using dayjs's conventions.
	 * Docs: https://day.js.org/docs/en/display/format
	 */
	const formatDate = (date, format) => dayjs(date).format(format);

	eleventyConfig.addFilter('pathParse', pathParse);
	eleventyConfig.addFilter('pathJoin', pathJoin);
	eleventyConfig.addFilter('fromJson', JSON.parse);
	eleventyConfig.addFilter('toJson', JSON.stringify);
	eleventyConfig.addFilter('toISOString', toISOString);
	eleventyConfig.addFilter('formatDate', formatDate);
	eleventyConfig.addFilter("excerpt", (post) => {
		const content = post.replace(/(<([^>]+)>)/gi, "");
		return content.substr(0, content.lastIndexOf(" ", 200)) + "...";
	});

	eleventyConfig.addFilter("addNbsp", (str) => {
		if (!str) {
			return;
		}

		let title = str.replace(/((.*)\s(.*))$/g, "$2&nbsp;$3");
		title = title.replace(/"(.*)"/g, '\\"$1\\"');

		return title;
	});

	eleventyConfig.addFilter("stripFilename", (file) => {
		return file.replace(/\.[^/.]+$/, "");
	});

	//Useage: {{ for item in collections.all | randomItem }}
	eleventyConfig.addFilter("randomItem", (arr) => {
		arr.sort(() => {
			return 0.5 - Math.random();
		});
		
		return arr.slice(0, 1);
	});

	//Useage: {{ for item in collections.all | limit(3) }}
	eleventyConfig.addFilter("limit", function (arr, limit) {
		return arr.slice(0, limit);
	});

	eleventyConfig.addFilter("debugger", (...args) => {
		console.log(...args);
		debugger;
	});

	eleventyConfig.addFilter("toBase64", function(str) {
		return xorUtils.XORCipher.b64_encode(str);
	});

	eleventyConfig.addFilter("fromBase64", function(str) {
		return xorUtils.XORCipher.b64_decode(str);
	});

	eleventyConfig.addFilter("xorEncrypt", function(str) {
		return xorUtils.XORCipher.xor_encrypt(packageJson.xor_secret, str);
	});

	eleventyConfig.addFilter("xorDecrypt", function(str) {
		return xorUtils.XORCipher.xor_decrypt(packageJson.xor_secret, str);
	});

	// ------------------------------------------------------------------------
	// Passthrough Copy
	// ------------------------------------------------------------------------

	eleventyConfig.addPassthroughCopy("src/static/**/*");
	eleventyConfig.addPassthroughCopy("src/assets/css/*.css");
	eleventyConfig.addPassthroughCopy("src/assets/js/*.js");

	eleventyConfig.addPassthroughCopy("node_modules/jquery/dist/jquery.min.js");
	eleventyConfig.addPassthroughCopy("node_modules/js-cookie/dist/js.cookie.min.js");
	eleventyConfig.addPassthroughCopy("node_modules/scrollreveal/dist/scrollreveal.min.js");
	eleventyConfig.addPassthroughCopy("node_modules/angular-material/angular-material.min.css");

	return {
		templateFormats: ['njk'],

		markdownTemplateEngine: 'njk',
		htmlTemplateEngine: 'njk',
		dataTemplateEngine: 'njk',
		dir: {
			output: '_site',
			input: 'src',
			includes: '_includes',
			layouts: '_layouts',
			data: '_data',
		},
	};
};
