'use strict';

var calculateCacheKeyForTree = require('./index');
var cacheKeyForStableTree = calculateCacheKeyForTree.cacheKeyForStableTree;
var chai = require('chai');
var expect = chai.expect;

describe('calculateCacheKeyForTree', function() {
  it('should return same value for same input', function() {
    var addon = {
      root: 'hoy',
      pkg: { some: 'parsed', value: { goes: 'here' }}
    };

    var first = calculateCacheKeyForTree('app', addon);
    var second = calculateCacheKeyForTree('app', addon);

    expect(first).to.equal(second);
  });

  it('should return different value for different addons', function() {
    var firstAddon = {
      name: 'derp',
      root: 'hoy',
      pkg: { some: 'other', value: { goes: 'elsewhere' }}
    };

    var secondAddon = {
      name: 'huzzah',
      root: 'hoy',
      pkg: { some: 'parsed', value: { goes: 'here' }}
    };

    var first = calculateCacheKeyForTree('app', firstAddon);
    var second = calculateCacheKeyForTree('app', secondAddon);

    expect(first).to.not.equal(second);
  });

  it('should not return same value for same addon with different tree type', function() {
    var addon = {
      root: 'hoy',
      pkg: { some: 'parsed', value: { goes: 'here' }}
    };

    var first = calculateCacheKeyForTree('addon', addon);
    var second = calculateCacheKeyForTree('app', addon);

    expect(first).not.to.equal(second);
  });

  it('should allow additional custom values to be passed', function() {
    var addon = {
      root: 'hoy',
      pkg: { some: 'parsed', value: { goes: 'here' }}
    };

    var first = calculateCacheKeyForTree('addon', addon);
    var second = calculateCacheKeyForTree('addon', addon, ['foo']);

    expect(first).not.to.equal(second);
  });

  it('cache key parts are stable sorted', function() {
    var addon = {
      root: 'hoy',
      pkg: { some: 'parsed', value: { goes: 'here' }}
    };

    var first = calculateCacheKeyForTree('addon', addon, [ { foo: 'bar', baz: 'derp' }]);
    var second = calculateCacheKeyForTree('addon', addon, [ { baz: 'derp', foo: 'bar' }]);

    expect(first).to.equal(second);
  });
});

describe('cacheKeyForStableTree', function() {
  it('should pass the tree type to calculateCacheKeyForTree', function() {
    var addon = {
      cacheKeyForTree: cacheKeyForStableTree
    };
    var firstKey = addon.cacheKeyForTree('foo');
    var secondKey = addon.cacheKeyForTree('bar');
    var thirdKey = addon.cacheKeyForTree('foo');

    expect(firstKey).not.to.equal(secondKey);
    expect(firstKey).to.equal(thirdKey);
  });

  it('should use the context as the addon argument to calculateCacheKeyForTree', function() {
    var addon = {
      name: 'derp',
      root: 'hoy',
      pkg: { some: 'other', value: { goes: 'elsewhere' }},
      cacheKeyForTree: cacheKeyForStableTree
    };
    var firstKey = addon.cacheKeyForTree('foo');

    addon.name = 'herp';
    var secondKey = addon.cacheKeyForTree('foo');

    expect(firstKey).not.to.equal(secondKey);
  });
});
