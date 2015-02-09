/*
	uiModalService
	@description - service responsible to communicate
	between directive and initiater
*/
(function(){
	angular.module('uimodal.box',[])
	.service('uiModalService',function(){

		// template to display
		this.template = null,

		// controller to attach
		this.controller = null,

		// actions to attach
		// Good to have if you don't attach controllers
		this.actions = [],

		// is modal visible
		// Use on templates to show or hide modal
		this.visible = false,

		// Data to pass from modal
		this.modalData = false,

		// Initiating modalService
		this.init = function(template,controller,data) {

			// Resetting old stuff , before starting new one
	  this._reset();

	  // assigning template
	  this.template = template;

	  // assigning controller
	  this.controller = controller || '';

	  // assigning data
	  this.modalData = data || {};
	},

	// Adding actions to modal service
	this.addAction = function(actionId, actionLabel, cssClass, cb) {

	  this.actions.push({
	    uid: actionId,
	    label: actionLabel,
	    method: cb,
	    cssClass: cssClass || ''
	  });

	},

	// Showing modal by setting visible to true
	this.show = function() {
	    this.visible = true;
	},

	// Resetting properties
	this._reset = function() {

	  this.template = null;

			this.controller = null;

			this.actions = [];

			this.visible = false;

			this.modalData = false;
	}
	})
	
	.directive('uiModalBox',function(uiModalService,$http,$templateCache,$compile){
		return{
			restrict: 'AE',
			replace: true,
			link: function($scope,$elem,$attr){

				// Assigning uiModalSetvice to local $scope
				$scope.modal = uiModalService;

				// watch for changes
				$scope.$watch('modal',function(){

					// If template has been provider
					// then continue with other stuff
					if($scope.modal.template){

						// Grabbing template url
						var template = $scope.modal.template;

						// making http call to get template
						$http.get(template,{cache:$templateCache})
						.success(function(response){

							// Fetching content from response
							var contents = $elem.html(response).contents();

							// If controller is specified
							if($scope.modal.controller){

								// Assign controller as ng-controller
								$elem.attr('ng-controller',$scope.modal.controller);

							}

							// Removing attr to stay away from infinite loop
							$elem.removeAttr('ui-modal-box');

							// Recompiling directive
							$compile($elem)($scope);

						});
					}
				},true);
			}
		}
	});
}).call(this);
