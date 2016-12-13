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
				control: {start:0,interval:0,seconds:0}
			},
			idAttribute: "_id",
			parse:function (response) {
		        //console.log(response);
		        response.id = response._id;
		        
		        return response;
		    },

		    intialize: function(){
		    	this.control = { start: 0, interval: 0, seconds: 0};
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

				if ( this.control && this.control.seconds){
					s = this.control.seconds;
				}else{
					//find last control
					var s = 0;

					for(var i=0; this.timers && i < this.timers.length; i++){
						s = this.timers[i].seconds;
					}
				}
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
					this.trigger('change:timers', this,{});
				}else{
					this.pause();

				}
			},
			getControl: function(){
				var dateObject = new Date();
				var dstring = (dateObject.getMonth() + 1) + "-" + dateObject.getDay() + "-" + dateObject.getFullYear();
				var lastDate = 0;
				var seconds = 0;
				console.log("dstring:" + dstring);
				var control = { start: dstring, interval: 0, seconds:0};
				if ( this.timers && this.times.length > 1 ){
					for(var i=0; i < this.timers.length; i++){
						lastDate = this.timers[i].start;
						seconds = this.timers[i].seconds;
					}

					if ( lastDate == dstring){
						control.start = lastDate;
						control.seconds = seconds;
					}
				}
				
				return control;
				
			},
			start : function(){
				var self = this;
				//self.control = { interval: 0, seconds: 0};

				//var control = this.getControl();
				var retval = self.getControl();
				self.control = { start: retval.start, interval: 0, seconds: retval.seconds};
				//var controlId = $('#control_' + self.get("id"));
				var intval = setInterval(function(){
					self.control.seconds = (self.control.seconds) ? self.control.seconds++ : 1;
					self.showTime();
					
				},1000);
				self.control.interval = intval;

			},
			pause: function(){
				console.log("pause called on:" + this.get("id"))
				if ( this.control && this.control.interval ){
					clearInterval(this.control.interval);
					if ( !this.timers ){
						console.log("setting timers to empty")
						this.timers = [];
					}
					if ( this.control && this.control.start && this.control.seconds ){
						this.timers.push({start: this.control.start, timer: this.control.seconds});
					}
					
					
					this.set('checked',false);
					this.save({
						success: function(obj,response){
							console.log("saved successfully")
						},
						error: function(obj,err){
							console.log("error saving")
						}
					});
				}
				
				this.showTime();
				
				

			},
			
			toggle: function(){				
				this.set('checked', !this.get('checked'));
				this.controlClock();
				
			}
			
	});
	return Clock;
});