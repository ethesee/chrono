define([
  'underscore',
  'backbone',
  'clock'
], function(_, Backbone, Clock) {
// Create a collection of services
	var Clocks = Backbone.Collection.extend({

		// Will hold objects of the Service model
		model: Clock,
		url:'/api/clocks',
		// initialize: function(){
		// 	this.on('sync', function () { console.log('synced!'); });
		// 	this.on('remove', function () { console.log('removed!'); });
			
		// },
		// parse: function(data) {
		// 	console.log("parse called")
		//     return data.clocks;
		// },

		// Return an array only with the checked services
		getChecked: function(){
			return this.where({checked:true});
		},
		initialize: function(){
			//this.on("change:timers",this.changeTimers,this);
			//this.listenTo(this,"change:timers",this.changeTimers);

		},
		// changeTimers: function(model,val,options){
		// 	console.log("model:" + model.get("id") + " just changed");
		// 	var activeClock = model.get("id");
		// 	this.each(function(clock){
		// 		var id = clock.get("id");
		// 		if ( id !== activeClock ){
		// 			if ( clock.get('checked') ){
		// 				//clock.set('checked', false);
		// 				console.log("pausing clock:" + id);
		// 				clock.pause();
		// 			}
					
		// 		}
		// 	});
		// }

	});
	return Clocks;
});