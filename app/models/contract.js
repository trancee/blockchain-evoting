import Model, { attr } from '@ember-data/model';

export default class ContractModel extends Model {
  @attr('boolean') isVoting;
}
