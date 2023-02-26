import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ConnectComponent extends Component {
  @service web3;
  @service store;

  @tracked account = this.store.peekRecord('account', 0);

  @action
  disconnect() {
    this.web3.handleVotingStarted();
    // this.account = null;
  }

  @action
  async connect() {
    const { ethereum } = window;

    // If Metamask is installed
    if (ethereum && ethereum.isMetaMask) {
      console.log('Ethereum successfully detected!');

      ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(this.web3.handleAccountsChanged.bind(this.web3))
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log('Please connect to MetaMask.');

            alert(
              'Damit abgestimmt werden kann, muss eine Verbindung mit Metamask hergestellt werden.'
            );
          } else {
            console.error(err);
          }
        });
    } else {
      alert(
        'Eine digitale Wallet wird für diese Seite vorausgesetzt.\n\nWir empfehlen die Verwendung von Metamask.'
      );
    }
  }
}
