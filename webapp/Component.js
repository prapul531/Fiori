sap.ui.define(["sap/ui/core/UIComponent"],
	function(UIComponent) {

		return UIComponent.extend("wipro.Component", {
			metadata: {
				"manifest": "json"
			},
			init: function() {
				UIComponent.prototype.init.apply(this);
				var oRouter = this.getRouter();
				oRouter.initialize();
			},

			/*	createContent : function() {
				var oAppView = new sap.ui.view("idAPPView", {
				viewName: "wipro.view.App",
				type: "XML" });
				
				
				var oView1 = new sap.ui.view("idView1", {
				viewName: "wipro.view.view1",
				type: "XML"
				});
				
					var oView2 = new sap.ui.view("idView2", {
				viewName: "wipro.view.view2",
				type: "XML"
				});
				

			var oAppCont =	oAppView.byId("idAppCont");
			oAppCont.addMasterPage(oView1).addDetailPage(oView2);
				
				return oAppView;
				
				
			},*/

			destroy: function() {
	UIComponent.prototype.destroy.apply(this);
			}

		});

	});