sap.ui.define([
		"spet/auth/ControlIterator"
	], function(ControlIterator) {
		"use strict";
		
		QUnit.module("ControlIterator");
		
		QUnit.test("All controls should be visited (without aggregation template)", function (assert) {
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
			
			//Act
			var oI = new ControlIterator(oPanel),
				oC;
			while((oC = oI.next()) !== null) {
				oC.visited = true;
			}

			// Assert
			assert.ok(oBox1.visited, "Box1 was visited.");
			assert.ok(oBox2.visited, "Box2 was visited.");
			assert.ok(oText1.visited, "Text1 was visited.");
			assert.ok(oText2.visited, "Text2 was visited.");
			assert.ok(oToolbar.visited, "Toolbar was visited.");
		});
		
		QUnit.test("All controls should be visited (with template)", function (assert) {
			// Arrange
			var oPanel = new sap.m.Panel(),
				oBox1 = new sap.m.HBox(),
				oBox2 = new sap.m.VBox(),
				oText1 = new sap.m.Text(),
				oText2 = new sap.m.Text(),
				oToolbar = new sap.m.Toolbar();
			
			oBox1.addItem(oText1);
			oBox2.bindAggregation("items", {
				path: "/",
				template: oText2
			});
			oPanel.addContent(oBox1);
			oPanel.addContent(oBox2);
			oPanel.setHeaderToolbar(oToolbar);
			
			//Act
			var oI = new ControlIterator(oPanel),
				oC;
			while((oC = oI.next()) !== null) {
				oC.visited = true;
			}

			// Assert
			assert.ok(oBox1.visited, "Box1 was visited.");
			assert.ok(oBox2.visited, "Box2 was visited.");
			assert.ok(oText1.visited, "Text1 was visited.");
			assert.ok(oText2.visited, "Text2 (template) was visited.");
			assert.ok(oToolbar.visited, "Toolbar was visited.");
		});
		
		QUnit.test("Control should be removed (not template).", function (assert) {
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
			
			//Act
			var oI = new ControlIterator(oPanel),
				oC;
			while((oC = oI.next()) !== null) {
				if (oC === oText1 || oC === oBox2 || oC === oToolbar) {
					oI.remove();
				}
			}

			// Assert
			assert.equal(oBox1.getItems().length, 0, "Box1 is empty.");
			assert.equal(oPanel.getContent().length, 1, "Panel has only 1 child.");
			assert.equal(oPanel.getContent()[0], oBox1, "Panel has only Box1 as child.");
			assert.notOk(oPanel.getHeaderToolbar(), "Panel has no toolbar.");
		});
		
		QUnit.test("Control aggregation should be unbinded.", function (assert) {
			// Arrange
			var oPanel = new sap.m.Panel(),
				oBox1 = new sap.m.HBox(),
				oBox2 = new sap.m.VBox(),
				oText1 = new sap.m.Text(),
				oText2 = new sap.m.Text();
			
			oBox1.addItem(oText1);
			oBox2.bindAggregation("items", {
				path: "/",
				template: oText2
			});
			oPanel.addContent(oBox1);
			oPanel.addContent(oBox2);
			
			//Act
			var oI = new ControlIterator(oPanel),
				oC;
			while((oC = oI.next()) !== null) {
				if (oC === oText2) {
					oI.remove();
				}
			}

			// Assert
			assert.notOk(oBox2.getBindingInfo("items"), "Box2 items were unbinded.");
		});
	}
);