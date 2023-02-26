import { module, test } from 'qunit';
import { setupRenderingTest } from 'blockchain-evoting/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | affairs-list', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<AffairsList />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <AffairsList>
        template block text
      </AffairsList>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
