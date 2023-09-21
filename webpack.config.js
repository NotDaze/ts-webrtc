

//const webpack = require("webpack")
const path = require("path");

module.exports = {
	
	mode: "none",
	
	entry: "./dist/Public/index.js",
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "dist/Public/"),
	},
	
};