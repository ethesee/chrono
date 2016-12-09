define([
  'jquery',
  'underscore',
  'backbone',
  'clock',
  'clocks',
  'clockview',
  'text!templates/addClock.html',
  'dispatcher'
], function($,_, Backbone,Clock,Clocks,ClockView,addClockTemplate,dispatcher) {
// The main view of the application
	var AddClockView = Backbone.View.extend({

		// Base the view on an existing element
		el: $('#addForm'),
		//el: $('#Wcontainer'),
		template: addClockTemplate,

		initialize: function(){
			//this.render();
		},

		render: function(){

			var tmpl = _.template(this.template); //tmpl is a function that takes a JSON object and returns html
        	this.$el.html(tmpl(/*this.model.toJSON()*/));
        	
            return this;

		},

		events: { 
			'click #addClock': "addNewProtocol",
			// 'change #coverImage': "processUpload"
			//'change #coverImage': "processUpload"
		},
		
       
		addNewProtocol: function(event){
			console.log("add Entry called")
			var _this = this;
			var s = { company: $("#company").val(), protocol: $("#protocol").val()};
			
			if ( s.company && s.protocol){
				dispatcher.trigger("insert",s);
			}
			
			
			$("#company").val("");
			$("#protocol").val("");
			
			
			
		},

        
	});
	return AddClockView;

});