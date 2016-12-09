define([
  'underscore',
  'backbone',
  'sapp'
], function(_, Backbone,Sapp) {
	var Clock = Backbone.Model.extend({
			defaults:{
				company: 'My company',
				protocol: 'company protocol',
				checked: false,
				owner: '',
				timers: [],
				control: {interval:0,seconds:0}
			},
			idAttribute: "_id",
			parse:function (response) {
		        //console.log(response);
		        response.id = response._id;
		        
		        return response;
		    },

		    initialize: function(){
		    	this.control = {
		    		interval: 0,
		    		seconds: 0
		    	};

		    	this.timers = [];
		    },
		    
			// Helper function for checking/unchecking a service

			showTime: function(){
				var controlId = $('#control_' + this.get("id"));
				controlId.css({
					"float": "right",
					"border-radius":"25px",
				    "background":"#73AD21",
				    "padding":"5px",
				    "width":"60px",
				    "height":"30px",


				});
				//controlId.html(" Timer:" + self.control.seconds);
				var h = 0,m =0,s = 0;

				s = this.control.seconds;
				if ( s > 60){
					m = parseInt(s/60);
					s = s%60;
				}
				if ( m > 60){
					h = parseInt(m/60);
					m=m%60;
				}
				if ( m < 10){
					m = "0" + m;
				}
				if ( h < 10){
					h = "0" + h;

				}
				if ( s < 10){
					s = "0" + s;
				}
				controlId.html(h + ":" + m + ":" + s);

			},
			controlClock: function(){
				if ( this.get('checked') ){
					this.start();
					var activeClock = this.get("id");
					Sapp.collection.each(function(clock){
						var id = clock.get("id");
						if ( id !== activeClock ){
							if ( clock.get('checked') ){
								clock.set('checked', false);
								clock.pause();
							}
							
						}
					});
				}else{
					this.pause();
				}
			},
			start : function(){
				var self = this;
				self.control = { interval: 0, seconds: 0};

				//var controlId = $('#control_' + self.get("id"));
				var intval = setInterval(function(){
					self.control.seconds += 1;
					// if ( self.seconds == 60){
					// 	self.time += 1;
					// 	self.seconds = 0;
					// }
					//self.updateTime();
					self.showTime();
					// console.log("adding:" + self.control.seconds + " to span")
					// controlId.html(" Timer:" + self.control.seconds);
				},1000);
				self.control.interval = intval;
			},
			pause: function(){
				clearInterval(this.control.interval);
				if ( !this.timers ){
					this.timers = [];
				}
				this.timers.push({start: new Date(), timer: this.control.seconds});
				this.showTime();
				this.set('checked',false);
				//this.control.interval = 0;
				//this.control.seconds = 0;
			},
			
			toggle: function(){				
				this.set('checked', !this.get('checked'));
				this.controlClock();
				
			}
			
	});
	return Clock;
});