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
			dispatcher.on('insert', this.addClock, this);
			
			

		},
		events: { 
			'click #order': "orderMessage",
			'click #del': "delProducts",
			'click #showAdd': "toggleAddForm",
			//'click #addService': "addService"
		},
		// createServiceViews: function(){
		// 	this.list.empty();
		// 	this.total = $('#total span');
		// 	var showNext = false;

		// 	var grouped = this.clocks.groupBy("owner");

		// 	//console.log("grouped:", grouped);
		// 	for(var i in grouped){
		// 		var details = $("<details></details>");
		// 		var summary = $("<summary>" + i + "</summary>");
		// 		details.append(summary);

		// 		var ul = $("<ul id='" + i + "'></ul>");
		// 		var views = grouped[i];

		// 		for(var x=0; x < views.length; x++){
		// 			var clock = views[x];
		// 			var view = new ClockView({model: clock});
		// 			ul.append(view.render().el);
				
		// 		}
		// 		details.append(ul);
		// 		this.list.append(details);
		// 		// $("#" + i + " div>li").on('click',function(){
		// 		// 	console.log("clicked company list:", $(this).attr('id'));
		// 		// 	Sapp.router.navigate('protocol/' + $(this).attr('id'), true);
		// 		// })

		// 	}
			
		// },

		// render: function(){
		// 	this.template = _.template(mainviewTemplate);
		// 	this.$el.html(this.template());
		// 	this.list = $('#clocks');
		// 	this.createServiceViews();          
		// 	return this;

		// },
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

			this.clocks.create({ company: company, protocol: protocol, owner: owner});

			Utils.activeLink('Home');
			//this.router.navigate();
			Sapp.router.navigate('Home', true);	
			
			
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