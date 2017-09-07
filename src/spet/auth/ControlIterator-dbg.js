sap.ui.define([
	"sap/ui/core/Element"
], function(Element) {
	
	/**
	 * Class responsible for iterating through the control tree.
	 * It performs a BFS ordered iteration of the tree, excluding
	 * the root control itself.
	 * @class
	 * @param	{sap.ui.core.Element}	oRoot	The root element.
	 * @name spet.auth.ControlIterator
	 */
	return function(oRoot) {
		var aQueue = [oRoot],
			iAIndex = 0,
			iIIndex = 0,
			aAggregations;
		
		function updateAggregations() {
			var mAggregations = aQueue[0].getMetadata().getAllAggregations();
			aAggregations = jQuery.map(mAggregations, function(oV){return oV; });
		}
		
		updateAggregations();
		
		/**
		 * Goes to the next element in the tree.
		 * @function
		 * @name spet.auth.ControlIterator#next
		 * @returns	{sap.ui.core.Element|null} Returns the next element
		 * or null if none exists.
		 */
		this.next = function() {
			var fnInner = function() {
				for (; iAIndex < aAggregations.length; ++iAIndex) {
					var oContents = aAggregations[iAIndex].get(aQueue[0]),
						oInfo;
					if (aAggregations[iAIndex].multiple) {
						if (oContents && iIIndex < oContents.length) {
							return oContents[iIIndex++];
						}
						else {
							oInfo = aQueue[0].getBindingInfo(aAggregations[iAIndex].name);
							if (iIIndex === 0 && oInfo && oInfo.template) {
								++iIIndex;
								return oInfo.template;
							}
						}
					}
					else {
						if (iIIndex === 0 && oContents) {
							++iIIndex;
							return oContents;
						}
					}
					iIIndex = 0;
				}
				return null;
			};
			
			do {
				var oResult = fnInner();
				if (oResult) {
					if (oResult instanceof Element) {
						aQueue.push(oResult);
						return oResult;
					}
				}
				else {
					iAIndex = 0;
					iIIndex = 0;
					aQueue.shift();
					if (aQueue.length) {
						updateAggregations();
					}
				}
			}while (aQueue.length);
			
			return null;
		};
		
		/**
		 * Removes the element which was previously returned
		 * by the `next` method.
		 * @function
		 * @name spet.auth.ControlIterator#remove
		 * @returns	{void}
		 */
		this.remove = function() {
			var oAggregation = aAggregations[iAIndex],
				oInfo;
			--iIIndex;
			aQueue.pop();
			if (oAggregation.multiple) {
				oInfo = aQueue[0].getBindingInfo(oAggregation.name);
				if (oInfo && oInfo.template) {
					aQueue[0].unbindAggregation(oAggregation.name);
				}
				else {
					aAggregations[iAIndex].remove(aQueue[0], iIIndex);
				}
			}
			else {
				aAggregations[iAIndex].set(aQueue[0], null);
			}
		};
		
	};
	
}, /* bExport = */ false);