sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
		'sap/ui/core/Fragment'
], function(Controller, JSONModel, MessageToast, Fragment) {
	"use strict";

	return Controller.extend("wipro.controller.create", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf wipro.view.create
		 */
		onInit: function() {
			debugger;
			var oModelLocal = new JSONModel({
				"product": {
					"PRODUCT_ID": "",
					"TYPE_CODE": "PR",
					"CATEGORY": "Notebooks",
					"NAME": "",
					"DESCRIPTION": "",
					"SUPPLIER_ID": "0100000000",
					"SUPPLIER_NAME": "",
					"PRICE": "",
					"CURRENCY_CODE": "USD"
				}
			});
			this.getView().setModel(oModelLocal, "local");
		},
		oView: null,
		onSupHelp: function(oEvent){
		debugger;
			var oView = this.getView();
			this.oView = this.getView();
			var that = this;
			this.sInputId = oEvent.getSource().getId();
			// create dialog lazily
			if (!this.oHelpDialog) {
				// load asynchronous XML fragment
				Fragment.load({

					id: 'helpDialog',
					name: "wipro.fragments.selectDialog",
					controller: this
				}).then(function(oHelpDialog) {
					debugger;
					that.oHelpDialog = oHelpDialog;
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(that.oHelpDialog);
                   that.oHelpDialog.setMultiSelect(false);



					var oListItem = new sap.m.DisplayListItem({
						
						label: "{BP_ID}"
					});

					that.oHelpDialog.bindAggregation("items", {

						path: "/SupplierSet",
						template: oListItem

					});
that.oHelpDialog.setTitle("Suppliers");
					that.oHelpDialog.open();
				});
		
		
		
			
		}
		{
				that.oHelpDialog.open();
		}
		},
		onSelectSupplier : function(oEvent) {

	
	var sSelectedItem = oEvent.getParameter("selectedItem").getProperty("label");
	
	this.getView().byId("idSupInput").setValue(sSelectedItem);
	
var oSupplierSet = this.getView().getModel().getProperty("/SupplierSet('" + sSelectedItem + "')");
 	this.getView().byId("idSupName").setValue(oSupplierSet.CITY);
 	debugger;
		},
		onSave: function(oEvent) {
		

			//	step 1 get the data from screen
			var productData = this.getView().getModel("local").getProperty("/product");

			//call ODATA to create product 
			var oModel = this.getView().getModel();

			oModel.create("/ProductSet", productData, {
				success: function(oSuccess) {
					MessageToast.show("Product Created");
				},
				error: function(oError) {
					debugger;
						var oResponse = JSON.parse(oError.responseText);
					var sMessage = oResponse.error.innererror.errordetails[0].message;
					MessageToast.show(sMessage);
			//		MessageToast.show("Product Creation Failed");
				}

			});

		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf wipro.view.create
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf wipro.view.create
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf wipro.view.create
		 */
		//	onExit: function() {
		//
		//	}

	});

});