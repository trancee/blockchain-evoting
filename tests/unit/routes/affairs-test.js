import { module, test } from 'qunit';
import { setupTest } from 'blockchain-evoting/tests/helpers';

module('Unit | Route | affairs', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:affairs');
    assert.ok(route);
  });
});
