sap.ui.define([
		"spet/auth/selector/CustomDataSelector",
		"spet/auth/library"
	], function(CustomDataSelector) {
		"use strict";
		
		QUnit.module("CustomDataSelector");
		
		QUnit.test("Controls should be selected based on custom data", function (assert) {
			// Arrange
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
			
			oPanel.data("something", "test");
			oBox1.data("something", "test");
			oBox2.data("something", "test-2");
			oText1.data("something", "test");
			
			//Act
			var oSelector = new CustomDataSelector({
				name: "something",
				value: "test"
			});
				
			// Assert
			assert.ok(oSelector.check(null, oPanel), "Panel was selected correctly.");
			assert.ok(oSelector.check(null, oBox1), "Box1 was selected correctly.");
			assert.notOk(oSelector.check(null, oBox2), "Box2 was selected correctly.");
			assert.ok(oSelector.check(null, oText1), "Text1 was selected correctly.");
			assert.notOk(oSelector.check(null, oText2), "Text2 was selected correctly.");
			assert.notOk(oSelector.check(null, oToolbar), "Toolbar was selected correctly.");
		});
		
	}
);