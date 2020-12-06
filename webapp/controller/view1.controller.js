sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'wipro/util/Formatter',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/ui/model/json/JSONModel",
	"sap/ui/layout/form/SimpleForm",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Label",
	"sap/m/Input"
], function(Controller, Formatter, Filter, FilterOperator, GroupHeaderListItem, MessageToast, Dialog, JSONModel, SimpleForm, Button,
	ButtonType, Label, Input) {
	"use strict";

	return Controller.extend("wipro.controller.view1", {

		formatter: Formatter,
		oRouter: null,
		onListItemPress: function(oEvent) {

		},
		onInit: function() {
			var oModel = this.getOwnerComponent().getModel();
			oModel.attachRequestFailed(this.onError, this);

			var oModelLocal = new JSONModel({
				"product": {
					"PRODUCT_ID": "",
					"TYPE_CODE": "",
					"CATEGORY": "",
					"NAME": "",
					"SUPPLIER_ID": "",
					"SUPPLIER_NAME": "",
					"PRICE": "",
					"CURRENCY_CODE": ""
				}
			});
			this.getView().setModel(oModelLocal, "local");
		},
		onCreate : function(oEvent) {
				//this.oRouter = this.getOwnerComponent().getRouter();
	
		this.getOwnerComponent().getRouter().navTo("create");
		},
		oSourceProduct: null,
		onproductRequest: function(oEvent) {
			this.oSourceProduct = oEvent.getSource();
		
			//step 1 read the product id entered from screen 
			//var product_id = this.getView().byId("idProduct").value;
			var product_id = this.getView().getModel("local").getProperty("/product/PRODUCT_ID");
			//step 2 construct the path to read from odata model
			var sPath = "/ProductSet('" + product_id + "')";
			//step 3 get ODATA model object
			var oModel = this.getView().getModel();
			//step 4read data from odata model
			var that = this;
			oModel.read(sPath, {
				success: function(oSuccess) {

					//step 5 set the recieved data back to screen
					that.getView().getModel("local").setProperty("/product", oSuccess);
						that.oSourceProduct.setValueState("None");
				},
				error: function(oError) {
					//step 6 Error Handling	
					
					that.oSourceProduct.setValueState("Error");
					var oResponse = JSON.parse(oError.responseText);
					var sMessage = oResponse.error.innererror.errordetails[0].message;
					MessageToast.show(sMessage);
				}
			});
		},
		
			onExpProduct: function(oEvent) {
				debugger;
			this.oSourceProduct = oEvent.getSource();
		
			//step 1 read the product id entered from screen 
			//var product_id = this.getView().byId("idProduct").value;
			var category = this.getView().getModel("local").getProperty("/product/CATEGORY");
			
			//step 2  get ODATA model object
				var oModel = this.getView().getModel();
			//step 3 read data from odata model using function import for expesive product
			var that = this;
			
			oModel.callFunction("/expProduct", {
			urlParameters : {
				  "I_CATEGORY" : category
			},
			success: function(oData){
					that.getView().getModel("local").setProperty("/product", oData);
			}
				
				});
			
			
			
		/*	//step 2 construct the path to read from odata model
			var sPath = "/ProductSet('" + product_id + "')";
			//step 3 get ODATA model object
			var oModel = this.getView().getModel();
			//step 4read data from odata model
			var that = this;
			oModel.read(sPath, {
				success: function(oSuccess) {

					//step 5 set the recieved data back to screen
					that.getView().getModel("local").setProperty("/product", oSuccess);
						that.oSourceProduct.setValueState("None");
				},
				error: function(oError) {
					//step 6 Error Handling	
					
					that.oSourceProduct.setValueState("Error");
					var oResponse = JSON.parse(oError.responseText);
					var sMessage = oResponse.error.innererror.errordetails[0].message;
					MessageToast.show(sMessage);
				}
			});*/
		},
		onLaunch: function() {
			if (!this.oDefaultDialog) {
				this.oDefaultDialog = new Dialog({
					title: "Search Product",
					content: new SimpleForm({

						content: [
						
							new Label({
								text: "Category"
							}),
							new Input({

								value: "{local>/product/CATEGORY}",
								id: "idCat",
								change: [this.onExpProduct, this]

							}),
							
							
							new Label({
								text: "Product Id"
							}),
							new Input({

								value: "{local>/product/PRODUCT_ID}",
								id: "idProduct",
								change: [this.onproductRequest, this]

							}),
							new Label({
								text: "NAME"
							}),
							new Input({
								value: "{local>/product/NAME}"
							}),
							new Label({
								text: "Supplier Id"
							}),
							new Input({
								value: "{local>/product/SUPPLIER_ID}"
							}),
							new Label({
								text: "PRICE"
							}),
							new Input({
								value: "{local>/product/PRICE}"
							})

						]

					}),
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "OK",
						press: function() {
							this.oDefaultDialog.close();
						}.bind(this)
					}),
					endButton: new Button({
						text: "Close",
						press: function() {
							this.oDefaultDialog.close();
						}.bind(this)
					})
				});

				// to get access to the controller's model
				this.getView().addDependent(this.oDefaultDialog);
			}

			this.oDefaultDialog.open();
		},
		onError: function(oError) {

			var sResponse = oError.getParameter('response').responseText;
			var parser = new DOMParser();
			var xmlDoc = parser.parseFromString(sResponse, "text/xml");

			var sMessage =
				xmlDoc.getElementsByTagName("message")[0].childNodes[0].nodeValue;

			MessageToast.show(sMessage);
		},
		onItemPress: function(oEvent) {

			var oSel = oEvent.getParameter("listItem");
			//Set the seconfd view title as selected list item name
			var oSel = this.byId("idList").getSelectedItem();
			var oTitle = oSel.getTitle();

			/*	var oAppCont = this.getView().getParent().getParent().getCurrentDetailPage();
				var oView2 = oAppCont.getContent(); //Get the view
			*/

			//	Get the router object and make it available gloablly for whole view
			this.oRouter = this.getOwnerComponent().getRouter();

			var oContext = oSel.getBindingContext();
			var sPath = oContext.getPath();
			// path looks like "/fruits/2"

			var sIndex = sPath.split("/")[sPath.split("/").length - 1];
			/*	var oFruitDetail = oAppCont.byId("idFruitsDetailsPanel");
				oFruitDetail.bindElement(sPath);*/
			//sPath = "/ProductSet('HT-1000')";

			this.onNext(sIndex);
		},
		getType: function(oContext) {
			return oContext.getProperty('type');
		},

		getGroupHeader: function(oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.key
			});
		},

		onSearch: function(oEvent) {
			// add filter for search
			var aFilters = [];
			//Get the value entered in search field
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {

				if (sQuery.indexOf("-") !== -1) {
					var oFilter = new Filter("PRODUCT_ID", FilterOperator.EQ, sQuery);
				} else {
					oFilter = new Filter("CATEGORY", FilterOperator.EQ, sQuery);
				}
				//Construct the filter with 2 operands and one operator

				// var filter2 = new Filter("CATEGORY", FilterOperator.EQ, sQuery);
				// // var filter3 = new Filter("color", FilterOperator.Contains, sQuery);
				// 	var oFilterFinal = new Filter({
				// 		filters: [
				// 			filter1,
				// 			 filter2

				// 		],
				// 		and: false
				// 	});

			}

			//Get LIST coontrol object
			var oList = this.byId("idList");

			// Get list items binding
			var oBinding = oList.getBinding("items");

			//Injet the filter
			oBinding.filter(oFilter);
		},
		onSelect: function(oEvent) {
			// get the LIST object from view or you can also get the source of the event trigger which is again LIST
			/*var osel = this.byId("idList").getSelectedItems();*/
			var osel = oEvent.getSource().getSelectedItems();

			var i;
			for (i = 0; i < osel.length; i++) {
				console.log(osel[i].getTitle());
			}

		},
		onNext: function(sPath) {

			//	var fruitIndex = sIndex;

			var productId = sPath;
			this.oRouter.navTo("detail", {
				productId: productId
			});
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf wipro.fiori.view.view1
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf wipro.fiori.view.view1
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf wipro.fiori.view.view1
		 */
		//	onExit: function() {
		//
		//	}

	});

});