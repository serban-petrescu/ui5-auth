sap.ui.define([
		"sap/ui/model/json/JSONModel",
		"spet/auth/action/RemoveAction",
		"spet/auth/ControlIterator",
		"spet/auth/library"
	], function(JSONModel, RemoveAction, ControlIterator) {
		"use strict";
		
		QUnit.module("RemoveAction");
		
		QUnit.test("Controls should be removed when action is called.", function (assert) {// Arrange
			var oPanel = new sap.m.Panel(),
				oBox1 = new sap.m.HBox(),
				oBox2 = new sap.m.VBox(),
				oText1 = new sap.m.Text(),
				oText2 = new sap.m.Text(),
				oToolbar = new sap.m.Toolbar();
			
			oBox1.addItem(oText1);
			oBox2.addItem(oText2);
			oPanel.addContent(oBox1);
			oPanel.addContent(oBox2);
			oPanel.setHeaderToolbar(oToolbar);
			
			//Act
			var oI = new ControlIterator(oPanel),
				oA = new RemoveAction(),
				oC;
			oA.initialize(null);
			while((oC = oI.next()) !== null) {
				if (oC === oText1 || oC === oBox2 || oC === oToolbar) {
					oA.process(null, oC, oI);
				}
			}
			oA.finalize();

			// Assert
			assert.equal(oBox1.getItems().length, 0, "Box1 is empty.");
			assert.equal(oPanel.getContent().length, 1, "Panel has only 1 child.");
			assert.equal(oPanel.getContent()[0], oBox1, "Panel has only Box1 as child.");
			assert.notOk(oPanel.getHeaderToolbar(), "Panel has no toolbar.");
		});
	}
);