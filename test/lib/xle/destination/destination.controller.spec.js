'use strict';

const DestinationController = sut('lib/xle/destination/destination.controller');

describe('DestinationController', () => {

  it('should end sequence', () => {
    const ctrl = new DestinationController();
    ctrl.loop = false;

    ctrl.sequence = ['2 00001', '2 00002'];
    expect(ctrl.next()).to.deep.equal([1]);
    expect(ctrl.next()).to.deep.equal([1]);
    expect(ctrl.next()).to.deep.equal([2]);
    expect(ctrl.next()).to.deep.equal([2]);
    expect(ctrl.next()).to.not.be.ok;
  });

  it('should loop sequence', () => {
    const ctrl = new DestinationController();

    ctrl.sequence = ['2 00001', '2 00002'];
    expect(ctrl.next()).to.deep.equal([1]);
    expect(ctrl.next()).to.deep.equal([1]);
    expect(ctrl.next()).to.deep.equal([2]);
    expect(ctrl.next()).to.deep.equal([2]);
    expect(ctrl.next()).to.deep.equal([1]);
    expect(ctrl.next()).to.deep.equal([1]);
    expect(ctrl.next()).to.deep.equal([2]);
    expect(ctrl.next()).to.deep.equal([2]);
    ctrl.loop = false;
    expect(ctrl.next()).to.not.be.ok;
  });

  it('just in case :)', () => {
    const ctrl = new DestinationController();

    // something unparseable
    ctrl._sequence = ['2 00001', '2 00002'];
    expect(() => {
        ctrl.next();
    }).to.throw(/maximum/);
  });

});
