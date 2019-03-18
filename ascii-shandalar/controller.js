/*
	Copyright (©) 2018 Tom J Demuyt
	Available under the terms of the GNU/LGPL-3.0
	See LICENSE file for more informations.

	controller.js contains generic controller (MVC) routines
*/

//Evil globals
var appStack = [];
var app;
var data;

var controller = {
	
	default: function controllerDefault(e){
		app.controller(e);
	},
	
	back: function controllerBack(e){
		appStack.pop();
		app = appStack.last();
		return controller;
	},
	
	resume: function controllerResume(...args){
		let f = app.resume || app.ui;
		f(...args);
	},
	
	doNothing: function doNothing(){
		
	},
	
	load: function load(_app){
		app = _app;
		appStack.push(app);
		app.ui();
	}
	
}
