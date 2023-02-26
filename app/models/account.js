import Model, { attr } from '@ember-data/model';

export default class AccountModel extends Model {
  @attr('string') account;
  @attr('string') chainId;
}
