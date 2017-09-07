sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/m/TextArea",
	"sap/ui/model/Filter"
], function(Controller, Button, Dialog, MessageToast, Text, TextArea, Filter) {
	"use strict";

	return Controller.extend("spet.auth.sample.controller.App", {
			
		onInit: function() {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			if (window.parent) {
				window.parent.sap.ui.core.BusyIndicator.hide();
			}
		},
		
		onAfterRendering: function() {
			if (this.getView().getModel("device").getProperty("/system/phone")) {
				this.byId("splitContainer").toMaster(this.getView().createId("master"));
			}
			else if (this.getView().getModel().getProperty("/CurrentUser/Complaints/length")) {
				this.byId("detail").bindElement("/CurrentUser/Complaints/0");
				this.byId("splitContainer").toDetail(this.getView().createId("detail"));
			}
			else {
				this.byId("splitContainer").toDetail(this.getView().createId("notFound"));
			}
		},
		
		goToMaster: function() {
			this.byId("splitContainer").backToPage(this.getView().createId("master"));
		},
		
		onSearch: function(oEvt) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("Title", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var list = this.getView().byId("lstMaster");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		
		onItemPressed: function(oEvent) {
			this.byId("detail").bindElement(oEvent.getSource().getBindingContext().getPath());
			this.byId("splitContainer").toDetail(this.getView().createId("detail"));
		},
		
		onSubmitDialog: function () {
			var dialog = new Dialog({
				title: "Resolve Complaint",
				type: "Message",
				content: [
					new TextArea("submitDialogTextarea", {
						liveChange: function(oEvent) {
							var sText = oEvent.getParameter("value");
							var parent = oEvent.getSource().getParent();

							parent.getBeginButton().setEnabled(sText.length > 0);
						},
						width: "100%",
						placeholder: "Write the reply here..."
					})
				],
				beginButton: new Button({
					text: "Submit",
					enabled: false,
					press: function () {
						var sText = sap.ui.getCore().byId("submitDialogTextarea").getValue();
						MessageToast.show("Complaint succesfully resolved!");
						this.getView().getModel().setProperty(this.byId("detail").getElementBinding().getPath() + "/Resolved", true);
						this.getView().getModel().setProperty(this.byId("detail").getElementBinding().getPath() + "/Reply", sText);
						this.getView().getModel().refresh();
						dialog.close();
					}.bind(this)
				}),
				endButton: new Button({
					text: "Cancel",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		}

	});
});