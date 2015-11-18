var Backbone = require('backbone');
var WidgetModel = require('../widget_model');
var _ = require('underscore');

module.exports = WidgetModel.extend({

  url: function() {
    var params = [];

    if (_.isNumber(this.get('start'))) {
      params.push('start=' + this.get('start'));
    }
    if (_.isNumber(this.get('end'))) {
      params.push('end=' + this.get('end'));
    }
    if (_.isNumber(this.get('bins'))) {
      params.push('bins=' + this.get('bins'));
    }
    if (_.isNumber(this.get('own_filter'))) {
      params.push('own_filter=' + this.get('own_filter'));
    }
    if (this.get('boundingBox')) {
      params.push('bbox=' + this.get('boundingBox'));
    }

    var url = this.get('url');
    if (params.length > 0) {
        url += '?' + params.join('&');
    }
    return url;
  },

  initialize: function(attrs, opts) {
    this._data = new Backbone.Collection(this.get('data'));

    WidgetModel.prototype.initialize.call(this, attrs, opts);
  },

  _onChangeBinds: function() {
    this.bind('change:url', function(){
      if (this.get('sync')) {
        this._fetch();
      }
    }, this);
    this.bind('change:boundingBox', function() {
      if (this.get('bbox')) {
        this._fetch();
      }
    }, this);
  },

  getData: function() {
    return this._data.toJSON();
  },

  getSize: function() {
    return this._data.size();
  },

  parse: function(data) {

    this._data.reset(data.bins);

    return {
      data: data.bins,
      width: data.width
    };
  },

  // set bins for the histograms
  // @bins should be an array with the format [{ start: ..., end: ..., freq: ..., min: ..., max:   }, ...]
  //    - start, end: are the bucket bounds
  //    - min, max: the min and the max value for all the points in that bucket
  //    - freq: count 
  setBins: function(bins, options) {
    this._data.reset(bins, options);
    this.set('data', { bins: bins }, options);
    return this;
  },

  toJSON: function(d) {
    return {
      type: "histogram",
      options: {
        column: this.get('column'),
        bins: this.get('bins')
      }
    };
  }
});