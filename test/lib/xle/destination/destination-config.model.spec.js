'use strict';

const DestinationConfig = sut('lib/xle/destination/destination-config.model');

// TODO: negative tests!
describe('DestinationConfig', () => {

  it('parse wildcard count', () => {
    var config = DestinationConfig.fromText('* 00001');
    expect(config.count).to.equal(Infinity);
    expect(config.destination).to.deep.equal([1]);
  });

  it('parse specific count', () => {
    var config = DestinationConfig.fromText('1 00001');
    expect(config.count).to.equal(1);
    expect(config.destination).to.deep.equal([1]);
  });

  it('parse multiple dest', () => {
    var config = DestinationConfig.fromText('1 00001,00002,00003');
    expect(config.count).to.equal(1);
    expect(config.destination).to.deep.equal([1,2,3]);
  });

  it('skip invalid dest', () => {
    var config = DestinationConfig.fromText('1 00001,abcd,00003');
    expect(config.count).to.equal(1);
    expect(config.destination).to.deep.equal([1,3]);
  });

});
