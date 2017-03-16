sap.ui.define([
		"spet/auth/selector/ElementTypeSelector",
		"spet/auth/library"
	], function(ElementTypeSelector) {
		"use strict";
		
		QUnit.module("ElementTypeSelector");
		
		QUnit.test("Controls should be selected based on their ID", function (assert) {
			// Arrange
			var oView = sap.ui.xmlview({
					viewContent: "<mvc:View xmlns:mvc=\"sap.ui.core.mvc\" />"
				}),
				oPanel = new sap.m.Panel(oView.createId("panel")),
				oBox1 = new sap.m.HBox(),
				oBox2 = new sap.m.VBox(),
				oText1 = new sap.m.Text({text: "test"}),
				oText2 = new sap.m.Text(),
				oText3 = new sap.m.Text(),
				oLabel = new sap.m.Label({text: "test"}),
				oToolbar = new sap.m.Toolbar();
			oBox1.addItem(oText1);
			oBox2.addItem(oText2);
			oBox2.addItem(oText3);
			oBox2.addItem(oLabel);
			oPanel.addContent(oBox1);
			oPanel.addContent(oBox2);
			oPanel.setHeaderToolbar(oToolbar);
			oView.addContent(oPanel);
			
			//Act
			var oSelector = new ElementTypeSelector({
				value: "sap.m.Text"
			});
				
			// Assert
			assert.notOk(oSelector.check(null, oView), "View was selected correctly.");
			assert.notOk(oSelector.check(null, oPanel), "Panel was selected correctly.");
			assert.notOk(oSelector.check(null, oBox1), "Box1 was selected correctly.");
			assert.notOk(oSelector.check(null, oBox2), "Box2 was selected correctly.");
			assert.ok(oSelector.check(null, oText1), "Text1 was selected correctly.");
			assert.ok(oSelector.check(null, oText2), "Text2 was selected correctly.");
			assert.ok(oSelector.check(null, oText3), "Text3 was selected correctly.");
			assert.notOk(oSelector.check(null, oToolbar), "Toolbar was selected correctly.");
			assert.notOk(oSelector.check(null, oLabel), "Label was selected correctly.");
		});
		
	}
);