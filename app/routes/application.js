import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AffairsRoute extends Route {
  @service web3;
  @service store;

  name = this.web3.getName();

  async model() {
    const isVoting = await this.web3.isVoting();
    console.log('isVoting', isVoting);

    const record = this.store.peekRecord('contract', 0);
    if (record) record.isVoting = isVoting;

    for (const affair of await this.web3.getAffairs()) {
      // console.log(affair);

      const item = {
        id: affair.id.toNumber(),
        ref: affair.ref,
        date: affair.date,
        topic: affair.topic,
      };

      try {
        const votes = await this.web3.getVotes(affair.id.toNumber());
        console.log('VOTES', votes);

        if (votes) {
          item.yay = votes.yay.toNumber();
          item.nay = votes.nay.toNumber();
        }
      } catch (e) {
        console.error(e.error ? e.error.message : e.message);
      }

      this.store.createRecord('affair', item);
      console.log('AFFAIR', item);

      // this.affairs.push(item);
    }

    console.log('AFFAIRS', this.store.peekAll('affair'));

    return {
      name: await this.name,
    };
  }
}
