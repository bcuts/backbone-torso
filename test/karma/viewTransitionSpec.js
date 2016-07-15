var $ = require('jquery');
var _ = require('underscore');
var ParentView = require('./helpers/TransitionUsingParentView');
var setupInjectionSite = require('./helpers/setupInjectionSite');

describe('A View that can transition in tracked views', function() {

  setupInjectionSite.apply(this);

  it('can transition in the first view into an injection site', function(done) {
    var parentView = new ParentView();
    parentView.attachTo(this.$app);
    expect(parentView.$el).toBeDefined();
    parentView.transitionPromise.done(function() {
      var childViewDom = parentView.$el.find('.transition-child');
      expect(_.size(childViewDom)).toBe(1);
      expect(childViewDom.html()).toBe('0');
      expect(parentView.getCurrentView().get('index')).toBe(0);
      expect(parentView.getCurrentView().get('transitioning-in')).toBe(false);
      done();
    });
    var childViewDom = parentView.$el.find('.transition-child');
    expect(_.size(childViewDom)).toBe(0);
    expect(parentView.getCurrentView().get('index')).toBe(0);
    expect(parentView.getCurrentView().get('transitioning-in')).toBe(true);
  });

  it('can transition in a new view into an injection site with a previous view already there', function(done) {
    var parentView = new ParentView();
    parentView.attachTo(this.$app);
    parentView.transitionPromise.done(function() {
      parentView.set('current', 1);
      parentView.transitionPromise.done(function() {
        var childViewDom = parentView.$el.find('.transition-child');
        expect(_.size(childViewDom)).toBe(1);
        expect(childViewDom.html()).toBe('1');
        expect(parentView.getCurrentView().get('index')).toBe(1);
        expect(parentView.getCurrentView().get('transitioning-in')).toBe(false);
        expect(parentView.myChildViews[0].get('transitioning-out')).toBe(false);
        done();
      });
      var childViewDom = parentView.$el.find('.transition-child');
      expect(_.size(childViewDom)).toBe(1);
      expect(childViewDom.html()).toBe('0');
      expect(parentView.getCurrentView().get('index')).toBe(1);
      expect(parentView.getCurrentView().get('transitioning-in')).toBe(true);
      expect(parentView.myChildViews[0].get('transitioning-out')).toBe(true);
    });
  });
});