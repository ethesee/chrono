// Filename: router.js
define([
  'jquery',
  'async',
  'underscore',
  'backbone',
  'mainview',
  'addclockview',
  'flashmessageview',
  'clocks',
  'utils'
], function($, async, _, Backbone, MainView, AddClockView,FlashMessageView,Clocks,Utils) {
  
  
  var AppRouter = Backbone.Router.extend({
          routes: {
            // Define some URL routes
            'home' : 'defaultHome',
            'about': 'showAbout',
            'contact': 'showContact',
            'protocol/:id': 'showClock',
            
            // Default
            '*actions': 'defaultAction',
            '': 'defaultAction'
          },
          initialize: function(){
          	this.flashView = new FlashMessageView();
          	this.clocks = new Clocks();
          	//this.mainView = new ChooserView({collection: this.services});
            this.mainView = new MainView({collection: this.clocks});
          	
          	this.on('route:showAbout', function(){
      	      Utils.activeLink('Add');
      	      $("#Wcontainer").empty();
      	      (new AddClockView()).render();
      	    });

      	    this.on('route:showContact', function () {
      	      Utils.activeLink('Contact');
      	      
      	      //var mainView = new ChooserView({collection: services, router: this});
      	      this.mainView.render();
      	    });
      	    
            this.on('route:showClock', function(id){
              //console.log("showProtocol called with id:" + id);
              Utils.activeLink('Timeline');
              //find the protocol
              // var pr = this.protocols.get(id);
              // console.log("got back:", pr);
              var timeline = new TimelineView({model: this.protocols.get(id)});
              timeline.render();
              timeline.afterRender();
            });

      	    this.on('route:defaultHome',function(){
      	      $("#Wcontainer").empty();
      	      Utils.activeLink('Home');
      	      this.mainView.render();
      	    });
      	    
      	    this.on('route:defaultAction', function (actions) {
      	      Utils.activeLink('Home');
      	      this.mainView.render();   
      		    
      		  });
          }
          
          
        });
        
        return AppRouter;
});
