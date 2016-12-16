define([
  'jquery',
  'underscore',
  'backbone',
  'dispatcher',
  'sapp',
  'moment',
  'text!templates/clocktemplate.html'
  //'text!templates/serviceTemplate.html'
], function($,_, Backbone, dispatcher,sapp,moment,clockTemplate) {
// This view turns a Service model into HTML
	var ClockView = Backbone.View.extend({
		tagName: 'li',
		//tagName: 'div',
		template: clockTemplate,
		events:{
			
			'click [type="checkbox"]': 'toggleService',
			'click #showReport': "showReport"
		},

		initialize: function(){
			this.listenTo(this.model, 'change', this.render);
			//dispatcher.on('showim', this.toggleDiv, this);
		},

		render: function(){
			// Create the HTML
			this.$el.html('<span id="showReport"><button style="color:#cccccc;">Report</button></span> &nbsp;&nbsp;<input type="checkbox" value="1" name="' + this.model.get('company') + '" /><span style="width:40px;">' + this.model.get('company') + ":" + this.model.get('protocol') + '</span><span id="control_' + this.model.get("id") + '">' + (this.model.get('control')).seconds + '</span>');
			this.$('input').prop('checked', this.model.get('checked'));
			
			this.model.showTime();
			
			return this;
		},
		
		toggleService: function(e){	
			this.model.toggle();			
		},
		
		showme : function(e){
			e.preventDefault();
			this.toggleService(e);
		},
		
		showReport: function(){
		        $("#week").empty();
				//var weekday = moment().weekday();
				
				//$("#week").append("<li>weekday:" + weekday + "</li>");
				var monday = moment().startOf('isoWeek');
				//var sunday = moment().endOf('isoWeek');
				var tuesday = moment(monday).add(1,'days');
				var wednesday = moment(monday).add(2,'days');
				var thursday = moment(monday).add(3,'days');
				var friday = moment(monday).add(4,'days');
				var saturday = moment(monday).add(5,'days');
				var sunday = moment(monday).add(6,'days');
				

				var days = {
					"Monday": monday.format("MM-DD-YYYY"),
					"Tuesday": tuesday.format("MM-DD-YYYY"),
					"Wednesday": wednesday.format("MM-DD-YYYY"),
					"Thursday": thursday.format("MM-DD-YYYY"),
					"Friday": friday.format("MM-DD-YYYY"),
					"Saturday": saturday.format("MM-DD-YYYY"),
					"Sunday": sunday.format("MM-DD-YYYY")
				}

				//$("#week").append("<li>" + days[0] + ":" + dSeconds + "</li>");
				$("#d4").text(this.model.get('protocol'));
				var formatSeconds = function (secs){
					if ( secs == 0)
						return 0;
					var h =0, m = 0, s=0;

					s = secs;
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

					return h + "h:" + m + "m:" + s + "s";
				};
				var totalTime = 0;
				var _timers = this.model.get('timers');
				for (var i in days){
					var dmom = days[i];
					
					
					var dSeconds = this.daySeconds(_timers,dmom);
					totalTime += dSeconds;
					var secondTime = formatSeconds(dSeconds);
					
					$("#week").append("<li>" + i + ":<span style='font-color=blue;'>" + secondTime	 + "</span></li>");
				}
				$("#total span").empty();
				$("#total span").text( formatSeconds(totalTime));
			},

			daySeconds: function(_timers,mom){
				var seconds = 0;
				for(var i=0; i < _timers.length; i++){
					var start = _timers[i].start;
					var secs = _timers[i].timer;
					
					if ( start == mom){
						seconds += secs;
					}
				}
				return seconds;				
			},
	});
	return ClockView;
});
