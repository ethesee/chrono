define([
  'underscore',
  'backbone',
  'sapp',
  'moment'
], function(_, Backbone,Sapp,moment) {
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

				var control = this.control;
				if ( control && control.seconds){
					s = control.seconds;
				}else{
					//find last control
					var s = 0;
					var _timers = this.get("timers");
					for(var i=0; _timers && i < _timers.length; i++){
						s = _timers[i].seconds;
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
				
				if ( typeof s === 'undefined' ){
					s = "00";
				}
				controlId.html(h + ":" + m + ":" + s);

			},
			controlClock: function(){
				if ( this.get('checked') ){
					var checkedClocks = Sapp.clocks.getChecked();
					var activeClock = this.get("id");
					_.each(checkedClocks,function(clock){
						var id = clock.get("id");
						if ( id !== activeClock ){
							if ( clock.get('checked') ){
								//clock.set('checked', false);
								console.log("pausing clock:" + id);
								clock.pause();
							}
							
						}
					});
					this.start();
					//this.trigger('change:timers', this,{});
				}else{
					this.pause();

				}
			},

			setControl: function(){
				// var dateObject = new Date();
				// var dstring = (dateObject.getMonth() + 1) + "-" + dateObject.getDay() + "-" + dateObject.getFullYear();
				var dstring = moment().format("MM-DD-YYYY");
				console.log("dstring:" + dstring);
				var lastDate = 0;
				var seconds = 0;
				var interval = 0;
				console.log("dstring:" + dstring);

				//var control = { start: dstring, interval: 0, seconds:0};
				if ( !this.control ){
					this.control = { start: dstring, interval: 0, seconds:0, running : false};
				}
				var _timers = this.get('timers');

				if ( _timers && _timers.length > 1 ){
					console.log("getting last element of timers")
					for(var i=0; i < _timers.length; i++){
						lastDate = _timers[i].start;
						seconds = _timers[i].timer;
					}
					console.log("lastDate:" + lastDate	+ " dstring:" + dstring)
					if ( lastDate == dstring){
						console.log("they are equal")
						this.control.start = lastDate;
						this.control.seconds = seconds;
					}
				}

			},
			start : function(){
				var self = this;
				//self.control = { interval: 0, seconds: 0};

				//var control = this.getControl();
				//var retval = self.getControl();
				self.setControl(); //{ start: retval.start, interval: retval.interval, seconds: retval.seconds};
				//var controlId = $('#control_' + self.get("id"));
				self.control.running = true;
				var savedCycle = 0;
				var intval = setInterval(function(){
					self.control.seconds = (self.control.seconds) ? (self.control.seconds + 1) : 1;
					savedCycle++;
					if ( savedCycle == 60){
						
						console.log("savingCyle:" + savedCycle + " save will be forced.");
						savedCycle = 0;
						//self.saveMe();
					}
					self.showTime();
					
				},1000);
				self.control.interval = intval;

			},
			saveMe: function(){
					//this.set('checked',false);
					if ( this.control && this.control.start && this.control.seconds ){
						//this.timers.push({start: this.control.start, timer: this.control.seconds});
						//this.control.running = false;
						var _timers = this.get("timers");
						_timers.push({start: this.control.start, timer: this.control.seconds});
						this.set('timers', _timers);
						this.save({});

					}
					//this.set('checked',true);
			},
			pause: function(){
				if ( !this.control ){
					this.setControl();
				}
				
				
				if ( this.control && this.control.interval ){
					clearInterval(this.control.interval);
					this.set('checked',false);
					if ( this.control && this.control.start && this.control.seconds ){
						//this.timers.push({start: this.control.start, timer: this.control.seconds});
						//this.control.running = false;
						var _timers = this.get("timers");
						console.log("saving with start:" + this.control.start);
						_timers.push({start: this.control.start, timer: this.control.seconds});
						this.set('timers', _timers);
						this.save({});

					}
					
				}
				//this.showTime();
			},
			
			toggle: function(){				
				this.set('checked', !this.get('checked'));
				this.controlClock();
				
			}
			
	});
	return Clock;
});