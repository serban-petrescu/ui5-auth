sap.ui.define([
		"spet/auth/selector/PropertySelector",
		"spet/auth/library"
	], function(PropertySelector) {
		"use strict";
		
		QUnit.module("PropertySelector");
		
		QUnit.test("Controls should be selected based on a property", function (assert) {
			// Arrange
			var oPanel = new sap.m.Panel(),
				oBox1 = new sap.m.HBox(),
				oBox2 = new sap.m.VBox(),
				oText1 = new sap.m.Text({text: "test"}),
				oText2 = new sap.m.Text(),
				oLabel = new sap.m.Label({text: "test"}),
				oToolbar = new sap.m.Toolbar();
			oBox1.addItem(oText1);
			oBox2.addItem(oText2);
			oBox2.addItem(oLabel);
			oPanel.addContent(oBox1);
			oPanel.addContent(oBox2);
			oPanel.setHeaderToolbar(oToolbar);
			
			//Act
			var oSelector = new PropertySelector({
				name: "text",
				value: "test"
			});
				
			// Assert
			assert.notOk(oSelector.check(null, oPanel), "Panel was selected correctly.");
			assert.notOk(oSelector.check(null, oBox1), "Box1 was selected correctly.");
			assert.notOk(oSelector.check(null, oBox2), "Box2 was selected correctly.");
			assert.ok(oSelector.check(null, oText1), "Text1 was selected correctly.");
			assert.notOk(oSelector.check(null, oText2), "Text2 was selected correctly.");
			assert.notOk(oSelector.check(null, oToolbar), "Toolbar was selected correctly.");
			assert.ok(oSelector.check(null, oLabel), "Label was selected correctly.");
		});
		
	}
);