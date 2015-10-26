/**
 *  Default widget model
 *
 */

cdb.geo.ui.Widget.Model = cdb.core.Model.extend({

  defaults: {
    data: [],
    columns: []
  },

  initialize: function() {
    this._initBinds();
  },

  _initBinds: function() {
    this.bind('change:dashboardBaseURL', function(){
      var self = this;
      this.fetch({
        error: function() {
          self.trigger('error');
        }
      });
    }, this);
  },

  _createUrlOptions: function() {
    return _.compact(_(this.options).map(
      function(v, k) {
        return k + "=" + encodeURIComponent(v);
      }
    )).join('&');
  },

  getData: function() {
    return this.get('data');
  },

  fetch: function(opts) {
    this.trigger("loading", this);
    return cdb.core.Model.prototype.fetch.call(this,opts);
  }

});
