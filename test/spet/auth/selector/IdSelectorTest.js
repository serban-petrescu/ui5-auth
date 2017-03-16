sap.ui.define([
		"spet/auth/selector/IdSelector",
		"spet/auth/library"
	], function(IdSelector) {
		"use strict";
		
		QUnit.module("IdSelector");
		
		QUnit.test("Controls should be selected based on their ID", function (assert) {
			// Arrange
			var oView = sap.ui.xmlview({
					viewContent: "<mvc:View xmlns:mvc=\"sap.ui.core.mvc\" />"
				}),
				oPanel = new sap.m.Panel(oView.createId("panel")),
				oBox1 = new sap.m.HBox(),
				oBox2 = new sap.m.VBox();
			oPanel.addContent(oBox1);
			oPanel.addContent(oBox2);
			oView.addContent(oPanel);
			
			//Act
			var oSelector = new IdSelector({
				value: "panel"
			});
				
			// Assert
			assert.notOk(oSelector.check(oView, oView), "View was selected correctly.");
			assert.ok(oSelector.check(oView, oPanel), "Panel was selected correctly.");
			assert.notOk(oSelector.check(oView, oBox1), "Box1 was selected correctly.");
			assert.notOk(oSelector.check(oView, oBox2), "Box2 was selected correctly.");
		});
		
	}
);