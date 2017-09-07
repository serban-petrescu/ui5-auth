sap.ui.define([
	"sap/ui/base/Object"
], function(UI5Object) {
	"use strict";
		
	return UI5Object.extend("VisitingAction", {
		metadata: {
			interfaces: ["spet.auth.IAction"]
		},
		
		_bValue: false,
		
		constructor: function(mSettings) {
			this._bValue = mSettings.value;
		},
		
		initialize: function(){},
		
		process: function(oV, oC){
			oC.visited = this._bValue;
		},
		
		finalize: function(){}
	}, false);

}, false);