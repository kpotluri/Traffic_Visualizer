define(["underscore",
        "marionette",
        "text!../../../templates/main.html"
    ],
    function (_, Marionette, MainTemplate) {
        'use strict';
        var SearchView = Marionette.ItemView.extend({
            ENTER_KEY: 13,
            events: {
            //     "keyup #search-term": "handleKeypress",
                "click #submitSearch": "applyFilter",
                "click #clearSearch": "clearFilter"
            //     "click #filter-menu": "clickFilterArea"
            },
            initialize: function (opts) {
                _.extend(this, opts);
                // additional initialization logic goes here...
                this.options = opts;
                this.app.vent.on("get-results", this.getResults);
            },

            template: function () {
                return _.template(MainTemplate);
            },
            getResults: function(sql){
              console.log(sql);
              $.ajax({
                    url:"/results/"+sql,
                    success:function(data) {
                      alert(data);
                    }
                  });
            }
        });
        return SearchView;
    });
