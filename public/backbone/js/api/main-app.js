define([
    "marionette",
    "underscore",
    "views/mainView",
    "views/searchView",
], function (Marionette, _, MainView, SearchView) {
    "use strict";
    var ProfileApp = Marionette.Application.extend();
    ProfileApp = ProfileApp.extend({
        regions: {
            searchRegion: "#region1",
            mainRegion: "#region2",
            // sideBarRegion : "#region3"
        },
        start: function (options) {
            this.options = options;
            this.options.app = this;

            // create child views:
            this.searchView = new SearchView(options);
            this.mainView = new MainView(options);
            // this.sideBarView = new SideBarView(options);

            // inject them into the regions:
            this.searchRegion.show(this.searchView);
            this.mainRegion.show(this.mainView);
            // this.sideBarRegion.show(this.sideBarView);
        }
    });

    return ProfileApp;
});
