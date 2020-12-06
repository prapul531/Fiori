sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	'sap/ui/model/json/JSONModel',
	'sap/m/Dialog',
	'sap/m/Image',
	'sap/m/Button',
	'sap/ui/core/Fragment',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
	//'sap/ui/model/Model'

], function(Controller, MessageBox, MessageToast, JSONModel, Dialog, Image, Button, Fragment,
	Filter, FilterOperator) {
	"use strict";

	return Controller.extend("wipro.controller.view2", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf wipro.fiori.view.view2
		 */
		oRouter: null,
		oModel: null,
		onInit: function() {

			this.oRouter = this.getOwnerComponent().getRouter();

			this.oRouter.getRoute("detail").attachMatched(this._onRouteMatched, this);

			//Bind Table with ITEMS aggregation

			/*	var oTable = this.getView().byId("idColumnList");
				this.getView().byId("idTable").bindAggregation("items", "/ProductSet", oTable);*/

			this.oModel = new JSONModel({
					"product": {}
				}, "local"

			);
			this.getView().setModel(this.oModel, "local");
		},
		oDialog: null,
		oHelpDialog: null,
		sInputId: null,
		oView: null,
		onDelete: function(oEvent) {
			var that = this;

			MessageBox.confirm("TDo you rellay want to delete ?", {
				title: "Confirmation", // default
				onClose: function(oAction) {

					if (oAction === 'OK') {

						var oModel = that.getView().getModel();
						oModel.remove(that.sPath, {
								success: function() {
									MessageBox.success("Deleted");
								},
								error: function() {
									MessageBox.error("Failed to Delete");
								}
							}

						);

					}

				}, // default
				styleClass: "", // default
				// actions: [ MessageBox.Action.OK,
				//            MessageBox.Action.Cancel ],         // default
				emphasizedAction: MessageBox.Action.CANCEL, // default
				initialFocus: null, // default
				textDirection: sap.ui.core.TextDirection.Inherit // default
			});

		},
		onHelp: function(oEvent) {
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
					that.oHelpDialog = oHelpDialog;
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(that.oHelpDialog);
					that.oHelpDialog.setMultiSelect(false);

					var oListItem = new sap.m.DisplayListItem({

						label: "{city}"
					});

					that.oHelpDialog.bindAggregation("items", {

						path: "/suppliers",
						template: oListItem

					});
					that.oHelpDialog.setTitle("cities");
					that.oHelpDialog.open();
				});

			} else {
				this.oHelpDialog.setTitle("cities");
				this.oHelpDialog.open();
			}
		},
		onFilter: function() {
			var oView = this.getView();
			var that = this;
			// create dialog lazily
			if (!this.oDialog) {
				// load asynchronous XML fragment
				Fragment.load({

					id: "supplier",
					name: "wipro.fragments.selectDialog",
					controller: this
				}).then(function(oDialog) {
					that.oDialog = oDialog;
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(that.oDialog);

					var oListItem = new sap.m.DisplayListItem({
						label: "{name}",
						value: "{city}"
					});

					that.oDialog.bindAggregation("items", {

						path: "/suppliers",
						template: oListItem

					});

					that.oDialog.open();
					oDialog.setTitle("suppliers");
					oDialog.setRememberSelections(true);
				});

			} else {
				this.oDialog.open();
				this.oDialog.setTitle("suppliers");
				this.oDialog.setRememberSelections(true);
			}
		},
		onSelectSupplier: function(oEvent) {

			//	var sTitle = 	oEvent.getSource.getProperty("title");
			var sTitle = oEvent.getSource().mProperties.title;
			if (sTitle === "cities") {
				var sSearch = oEvent.getParameter("selectedItem").getProperty("label");
				///	var	oInput = this.oView.byId(this.sInputId);
				//	oInput.setvalue(sSearch);	
				sap.ui.getCore().byId(this.sInputId).setValue(sSearch);

			} else {

				var sSearch = oEvent.getParameter("selectedItems");
				var aFilter = [];
				for (var i = 0; i < sSearch.length; i++) {
					var oFilter = new Filter("name", FilterOperator.EQ, sSearch[i].getProperty("label"));
					aFilter.push(oFilter);

				}

				var oTableBinding = this.getView().byId("idTable").getBinding("items");
				oTableBinding.filter(aFilter);

				var oFilterFinal = new Filter({
					filters: aFilter,
					//type:	"Application",
					and: false
				});
			}

		},
		onCancel: function(oEvent) {

			//	var sSearch = oEvent.getParameter("selectedItem").getProperty("label");
			/*	var oFilter = new Filter("name", FilterOperator.Contains, "");

				var oTableBinding = this.getView().byId("idTable").getBinding("items");
				oTableBinding.filter([oFilter]);*/
		},
		onSearch: function(oEvent) {

			var sSearch = oEvent.getParameter("value");

			var oFilter = new Filter("name", FilterOperator.Contains, sSearch);

			var oDialogBinding = oEvent.getSource().getBinding("items");
			oDialogBinding.filter([oFilter]);

		},

		onListItemPress: function(oEvent) {

			var oSel = oEvent.getParameter("listItem");

			this.oRouter = this.getOwnerComponent().getRouter();

			var oContext = oSel.getBindingContext();
			var sPath = oContext.getPath();
			// path looks like "/suppler/2"

			var sIndex = sPath.split("/")[sPath.split("/").length - 1];

			this.oRouter.navTo("supDetail", {
				supIndex: sIndex
			});

		},
		sPath: null,
		_onRouteMatched: function(oEvent) {

			var oArgs, oView;
			var that = this;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

			//	oView.byId("idForm").bindElement("/fruits/" + oArgs.productDetail);
			//	oView.byId("idForm").bindElement("/" + oArgs.productId);
			this.sPath = "/" + oArgs.productId;
			oView.bindElement({
				path: "/" + oArgs.productId,
				parameters: {
					expand: 'ToSupplier'
				},
				//"/fruits/" + oArgs.productDetail,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function(oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function(oEvent) {

						that.getView().getModel("local").setProperty("/product", oEvent.mParameters.data);
						oView.setBusy(false);
					}
				}
			});
		},
		_onBindingChange: function(oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},

		handlePress: function(evt) {
			/*	var sSrc = evt.getSource().getTarget();*/
			var sSrc = 'https://image.shutterstock.com/image-photo/ripe-red-apple-fruit-half-260nw-699645961.jpg';
			var oDialog = new Dialog({
				content: new Image({
					src: sSrc
				}),
				beginButton: new Button({
					text: 'Close',
					press: function() {
						oDialog.close();
					}
				}),
				afterClose: function() {
					oDialog.destroy();
				}
			});
			oDialog.open();
		},

		onSave: function(oSave) {
			debugger;
			//Earlier getting screen data from ODATA model
			var oModel = this.getView().getModel();
			// var sSelectedData = oModel.getProperty(this.sPath);

			//Now get the data from local model of screen
			var oModelLocal = this.getView().getModel("local");
			var sSelectedData = oModelLocal.getProperty("/product");

			oModel.update(this.sPath, sSelectedData, {
				success: function() {

					MessageBox.success("Updated");

				},
				error: function(oError) {

					MessageBox.error("Update Failed");
				}
			});

			var oAppCont = this.getView().getParent();
			/*	var oView1 = oAppCont.byId("idView1");
		    var oView1 = oAppCont.getPages()[0];
			var oSearch = oView1.byId("idSearch");
			var oVal = oSearch.getValue();*/

			// MessageBox.confirm("Entered Text is :" + oVal, {
			// 	actions: ["OK, Thanks", MessageBox.Action.CLOSE],
			// 	emphasizedAction: "Manage Products",
			// 	onClose: function(sAction) {
			// 		MessageToast.show("Action selected: " + sAction);
			// 	}
			// });
		},
		onBack: function() {
				/*	var oAppCont = this.getView().getParent();
					oAppCont.to("idView1");*/

				this.oRouter.navTo("default");
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf wipro.fiori.view.view2
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf wipro.fiori.view.view2
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf wipro.fiori.view.view2
		 */
		//	onExit: function() {
		//
		//	}

	});

});