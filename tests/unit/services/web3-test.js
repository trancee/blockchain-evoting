import { module, test } from 'qunit';
import { setupTest } from 'blockchain-evoting/tests/helpers';

module('Unit | Service | web3', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:web3');
    assert.ok(service);
  });
});
