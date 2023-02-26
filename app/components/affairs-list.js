import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';

export default class AffairsListComponent extends Component {
  @service web3;
  @service store;

  @tracked affairs = this.store.peekAll('affair');
  @tracked voted = this.store.peekAll('voted');
  @tracked contract = this.store.peekRecord('contract', 0);

  @action
  hasVotedEl(el, [affair]) {
    const record = this.store.peekRecord('voted', affair.id);
    if (record) this.web3.updateVoteButton(record.id, record.voted);
  }

  @action
  async voteYay(affair) {
    document.body.classList.remove('loading');
    document.body.classList.add('loading');
    try {
      await this.web3.vote(affair.id, true);
    } catch (e) {
      alert(e.error ? e.error.message : e.message);
    }
    document.body.classList.remove('loading');
  }

  @action
  async voteNay(affair) {
    document.body.classList.remove('loading');
    document.body.classList.add('loading');
    try {
      await this.web3.vote(affair.id, false);
    } catch (e) {
      alert(e.error ? e.error.message : e.message);
    }
    document.body.classList.remove('loading');
  }

  @action
  async checkVote(id) {
    let affair = this.store.peekRecord('affair', id);
    affair.yay++;

    try {
      const res = await this.web3.hasVoted(id);
    } catch (e) {
      this.web3.updateVoteButton(id);
      alert(e.error ? e.error.message : e.message);
    }
  }

  hasVoted(affair) {
    return this.web3.hasVoted(affair.id);
  }

  // {{if (this.hasVoted affair.id) " yay" "" }}
  // {{if (this.hasVoted affair.id) "" " nay"}}
  // hasVoted = async (ref) => {
  //   try {
  //     return await this.web3.hasVoted(ref);
  //   } catch (e) {
  //     console.error(e.error ? e.error.message : e.message);
  //   }
  // };

  // isYay = async (ref) => {
  //   try {
  //     const voted = await this.web3.hasVoted(ref);
  //     console.log('isYay', ref, voted);
  //     return voted ? 'yay' : '';
  //   } catch (e) {
  //     console.error(e.error ? e.error.message : e.message);
  //   }
  // };

  // isNay = async (ref) => {
  //   try {
  //     const voted = await this.web3.hasVoted(ref);
  //     console.log('isNay', ref, voted);
  //     return voted ? '' : 'nay';
  //   } catch (e) {
  //     console.error(e.error ? e.error.message : e.message);
  //   }
  // };

  isVoting = () => {
    return 'disabled';
  };

  sanitize = (text) => {
    return htmlSafe(text.replaceAll('\\n', '<br>'));
  };
}
