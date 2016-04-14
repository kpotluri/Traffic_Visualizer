define(["underscore",
        "marionette",
        "text!../../../templates/search.html"
    ],
    function (_, Marionette, SearchTemplate) {
        'use strict';
        var SearchView = Marionette.ItemView.extend({
            ENTER_KEY: 13,
            events: {
            //     "keyup #search-term": "handleKeypress",
                "click #submitSearch": "submitSearch",
                "click #clearSearch": "clearSearch"
            //     "click #filter-menu": "clickFilterArea"
            },
            initialize: function (opts) {
                _.extend(this, opts);
                // additional initialization logic goes here...
                this.options = opts;
            },

            template: function () {
                return _.template(SearchTemplate);
            },

            submitSearch: function(){
              var sql = this.buildSQL();
              this.app.vent.trigger("get-results", sql);

            },
            clearSearch: function(){
              this.$el.find('input:text').val('');
              this.$el.find('select').val('=');
            },
            buildSQL: function () {
                var elements = [],
                    sql;
                var that = this;

                $.each(this.$el.find('input:text'), function () {
                    if ($(this).val().length > 0) {
                        var columnName = $(this).attr('id').replace("search-", "");
                        var tempName = "#operation-" + columnName;
                        var operation = that.$el.find(tempName).val();
                        var dataType = $(this).attr('data-type');

                        switch(operation) {
                                case "=":
                                    if (dataType == "text") {
                                        elements.push(columnName + " LIKE '%" + $(this).val() + "%'");
                                    }
                                    else {
                                        elements.push(columnName + " "+ operation+ " " + $(this).val());
                                    }
                                    break;
                                case "IN":
                                    if (dataType == "text") {
                                      var ranges = $(this).val().split(",");
                                      var query = columnName + " " + operation+ " (";
                                      ranges.forEach(function(entry){
                                          query +=  "'" + entry + "',";
                                      });
                                      query = query.substring(0, query.length - 1);
                                      query += ")";
                                      elements.push(query);

                                    }
                                    else {
                                      elements.push(columnName + " " + operation+ " ("+ $(this).val()+ ")");
                                    }
                                    break;
                                case "BETWEEN":
                                    if (dataType == "text") {
                                        var ranges = $(this).val().split(",");
                                        elements.push(columnName + " " + operation+ " '"+ ranges[0]+ "' and '" + ranges[1] + "'");
                                    }
                                    else {
                                        var ranges = $(this).val().split(",");
                                        elements.push(columnName + " " + operation+ " "+ ranges[0]+ " and " + ranges[1]);
                                    }
                                    break;
                                default:
                                    elements.push(columnName + " " + operation+ " "+ $(this).val());
                                    break;
                            }
                    }
                });
                if (elements.length > 0) {
                    sql = "where " + elements.join(" and ");
                } else {
                    sql = '';
                }
                return sql;

            }
        });
        return SearchView;
    });
