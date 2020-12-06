sap.ui.define([
	"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
	"sap/m/MessageToast"

], function(Controller,MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("wipro.controller.App", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf wipro.fiori.view.App
		 */
		
			onInit: function() {
		
		
		
			},
				onInfoMessageBoxPress: function () {
			MessageBox.information("Your booking will be reserved for 24 hours.");
		}


		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf wipro.fiori.view.App
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf wipro.fiori.view.App
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf wipro.fiori.view.App
		 */
		//	onExit: function() {
		//
		//	}

	});

});