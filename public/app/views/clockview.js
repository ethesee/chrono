define([
  'jquery',
  'underscore',
  'backbone',
  'dispatcher',
  'sapp',
  'text!templates/clocktemplate.html'
  //'text!templates/serviceTemplate.html'
], function($,_, Backbone, dispatcher,sapp,clockTemplate) {
// This view turns a Service model into HTML
	var ClockView = Backbone.View.extend({
		tagName: 'li',
		//tagName: 'div',
		template: clockTemplate,
		events:{
			//'click [type="checkbox"]': 'toggleService'
			//'click' : 'selectThumb',
			// 'click #swipe-right': "swipeRight",
			// 'click #swipe-left': "swipeLeft",
			//'click': 'showme',
			'click': 'toggleService',
		},

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
			//dispatcher.on('showim', this.toggleDiv, this);
		},

		// render: function(){
  //           var tmpl = _.template(this.template);
  //           if ( this.model.get('id')){
  //           	this.$el.html(tmpl(this.model.toJSON()));
  //           	//this.$('input').prop('checked', this.model.get('checked'));
  //           }
		// 	return this;
		// },
		render: function(){

			// Create the HTML

			this.$el.html('<input type="checkbox" value="1" name="' + this.model.get('company') + '" /><span style="width:40px;">' + this.model.get('protocol') + '</span><span id="control_' + this.model.get("id") + '">' + (this.model.get('control')).seconds + '</span>');
			this.$('input').prop('checked', this.model.get('checked'));


			// Returning the object is a good practice
			// that makes chaining possible
			return this;
		},

		toggleService: function(e){	
			this.model.toggle();			
		},
		
		showme : function(e){
			e.preventDefault();
			this.toggleService(e);
		}
	});
	return ClockView;
});
