define([
  'jquery',
  'underscore',
  'backbone',
  'clock',
  'clocks',
  'clockview',
  'dispatcher',
  'utils',
  'text!templates/mainviewtemplate.html',
  'sapp',
  'moment'
], function($,_, Backbone,Clock,Clocks,ClockView,dispatcher,Utils,mainviewTemplate,Sapp,moment) {
// The main view of the application
	var MainView = Backbone.View.extend({

		// Base the view on an existing element
		//el: $('#Wcontainer'),
		el: $("#main"),
		//template: chooserTemplate,
		idIterator: "",

		initialize: function(options){
			// this.router = options.router;
			this.clocks = options.collection;
			Sapp.collection = options.collection;
			this.clocks.on("reset", this.render, this);
			this.list = $('#services');
	        //this.render();
			
			this.listenTo(this.clocks, 'add', this.render);
			this.clocks.fetch();
			this.clocks.each(function(clock){
				clock.set('checked',false);
			});
			Sapp.clocks = this.clocks;
			dispatcher.on('insert', this.addClock, this);
			
			

		},
		events: { 
			'click #order': "orderMessage",
			'click #del': "delProducts",
			'click #showAdd': "toggleAddForm",
			//'click #addService': "addService"
		},
		 
		render: function(){
			this.list.empty();
			this.clocks.each(function(clock){
				var view = new ClockView({model:clock});
				this.list.append(view.render().el);
			},this);
			return this;
		},
		
		addClock: function(s){
		    console.log("trigger received")		
			var owner = s.owner || 'evans.thesee@ert.com',
				company = s.company,
				protocol = s.protocol;


			//this.createServiceViews();
			//this.protocols.trigger('change',{});
			var dateObject = new Date();
			var dstring = (dateObject.getMonth() + 1) + "-" + dateObject.getDay() + "-" + dateObject.getFullYear();
			var _timers = [];

			var atimer = {start: dstring,timer: 0};

			_timers.push(atimer);
			
			var controlla = { start: dstring, interval: 0, seconds:0, running: false};
			this.clocks.create({ company: company, protocol: protocol, owner: owner, timers: _timers, control: controlla});

			//Utils.activeLink('Home');
			//this.router.navigate();
			Sapp.router.navigate('', true);	
			
			
		},

		orderMessage: function(event){
			this.uncheckAll();
		},

		uncheckAll: function(){
			var total = 0;

			_.each(this.clocks.getChecked(), function(elem){
				elem.toggle();
			});
		},

		delProducts: function(event){
			
			var self = this;
			_.each(this.clocks.getChecked(), function(elem){
				
				var elemid = elem.get("_id");
				self.clocks.where({_id: elemid})[0].destroy();
				
			});
			this.createServiceViews();
			
			this.clocks.trigger('change',{});
			
		}

	});
	return MainView;

});