import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';

export default class PolisComponent extends Component {
  @tracked affair = this.args.affair;

  polisYes = (/*yay, nay*/) => {
    let className = '';
    if (this.affair.yay) {
      className += ' polis-result__bar--yes';
      if (this.affair.nay) className += ' polis-result__bar--yes-with-border';
    } else if (this.affair.nay) {
      className += ' polis-result__bar--yesno';
    }
    return className;
  };
  polisNo = (/*yay, nay*/) => {
    let className = '';
    if (this.affair.nay) {
      className += ' polis-result__bar--no';
    } else if (this.affair.yay) {
      className += ' polis-result__bar--noyes';
    }
    return className;
  };

  number = (n) => {
    return n || 0;
  };

  isPlural = (n) => {
    return n !== 1;
  };

  percentage = (voted) => {
    const sum = this.affair.yay + this.affair.nay;
    const per = (100 / sum) * (voted ? this.affair.yay : this.affair.nay) || 0;
    return per.toFixed(1).replace('.0', '');
  };
  percentageStyle = (voted) => {
    const sum = this.affair.yay + this.affair.nay;
    const per = (100 / sum) * (voted ? this.affair.yay : this.affair.nay) || 0;
    return htmlSafe(
      voted
        ? 'width:calc(' + per.toFixed(1).replace('.0', '') + '% - 1px);'
        : 'width:' + per.toFixed(1).replace('.0', '') + '%;'
    );
  };
}
