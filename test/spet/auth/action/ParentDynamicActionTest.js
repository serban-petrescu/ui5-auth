sap.ui.define([
		"./VisitingAction",
		"spet/auth/Factory",
		"spet/auth/action/ParentDynamicAction",
		"spet/auth/library"
	], function(VisitingAction, Factory, ParentDynamicAction) {
		"use strict";
		
		QUnit.module("ParentDynamicAction");
		
		QUnit.test("Dynamic action should work on view.", function (assert) {
			// Arrange
			var oView = sap.ui.xmlview({
					viewContent: "<mvc:View xmlns:mvc=\"sap.ui.core.mvc\" />"
				}),
				oPanel = new sap.m.Panel(),
				oBox1 = new sap.m.HBox(),
				oBox2 = new sap.m.VBox(),
				oText1 = new sap.m.Text(),
				oText2 = new sap.m.Text();
			oBox1.addItem(oText1);
			oBox2.addItem(oText2);
			oPanel.addContent(oBox1);
			oPanel.addContent(oBox2);
			oView.addContent(oPanel);
			Factory.getInstance().registerActionProvider("custom", function(mSettings) {
				return new VisitingAction(mSettings);
			});
			
			//Act
			var oAction = new ParentDynamicAction({
				value: true,
				"when-missing": {
					type: "custom",
					value: false
				},
				"when-present": {
					type: "custom",
					value: true
				}
			});
			oAction.initialize(oView);
			oAction.process(oView, oBox2);
			oAction.process(oView, oText1);
			oAction.finalize();

			// Assert
			assert.ok(oBox2.visited, "Box2 was visited.");
			assert.ok(oBox2.getDependents(), "Box2 dependents initialized.");
			assert.ok(oBox2.getDependents().length, "Box2 has dependents.");
			assert.ok(oBox2.getDependents()[0].getRole(), "Box2 Helper role is present.");
			assert.ok(oBox2.getDependents()[0].getWhenMissing() instanceof VisitingAction, "Box2 Helper when-mising action is ok.");
			assert.ok(oBox2.getDependents()[0].getWhenPresent() instanceof VisitingAction, "Box2 Helper when-present action is ok.");
			assert.ok(oText1.visited, "Box2 was visited.");
			assert.ok(oText1.getDependents(), "Text1 dependents initialized.");
			assert.ok(oText1.getDependents().length, "Text1 has dependents.");
			assert.ok(oText1.getDependents()[0].getRole(), "Text1 Helper role is present.");
			assert.ok(oText1.getDependents()[0].getWhenMissing() instanceof VisitingAction, "Text1 Helper when-mising action is ok.");
			assert.ok(oText1.getDependents()[0].getWhenPresent() instanceof VisitingAction, "Text1 Helper when-present action is ok.");
			
			//Act
			oBox2.getDependents()[0].setRole(false);
			oText1.getDependents()[0].setRole(false);
			
			// Assert
			assert.notOk(oBox2.visited, "Box2 was not visited (after change).");
			assert.notOk(oText1.visited, "Text1 was not visited (after change).");
		});
		
	}
);