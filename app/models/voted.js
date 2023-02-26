import Model, { attr } from '@ember-data/model';

export default class VotedModel extends Model {
  @attr('boolean') voted;
}
