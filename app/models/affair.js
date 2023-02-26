import Model, { attr } from '@ember-data/model';

export default class AffairModel extends Model {
  @attr('string') ref;
  @attr('date') date;
  @attr('string') topic;

  @attr('number', { defaultValue: 0 }) yay;
  @attr('number', { defaultValue: 0 }) nay;
}
