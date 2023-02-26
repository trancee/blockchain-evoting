import Service from '@ember/service';
import { service } from '@ember/service';

// https://docs.metamask.io/guide/ethereum-provider.html#chain-ids
const GOERLI_TEST_NETWORK = '0x5';

const CONTRACT_ADDRESS = '0x013593E754f8E56691Aa989403EBf463fa318445';
const executor = '0x18776a968667333f798AD6021c928AB5ACf6De39';

// const uri = 'https://web3.blockchain-evoting.ch/v1/goerli';

export default class Web3Service extends Service {
  @service store;

  chainId;
  provider;
  signer;
  contract;
  contractWithSigner;
  account = null;

  timeoutId = null;

  init() {
    console.info('web3::init');
    super.init(...arguments);

    this.store.createRecord('contract', {
      id: 0,
      isVoting: false,
    });

    this.store.createRecord('account', {
      id: 0,
      account: this.account,
      chainId: this.chainId,
    });

    if (window.ethereum) {
      this.handleEthereum();
    } else {
      window.addEventListener('ethereum#initialized', this.handleEthereum, {
        once: true,
      });

      // If the event is not dispatched by the end of the timeout,
      // the user probably doesn't have MetaMask installed.
      this.timeoutId = setTimeout(this.handleEthereum, 3000); // 3 seconds
    }
  }

  handleEthereum() {
    console.info('web3::handleEthereum');
    clearTimeout(this.timeoutId);

    const { ethereum } = window;

    // If Metamask is installed
    if (ethereum && ethereum.isMetaMask) {
      console.log('Ethereum successfully detected!');

      ethereum.removeListener('connect', this.handleConnect.bind(this));
      ethereum.on('connect', this.handleConnect.bind(this));
      ethereum.removeListener('disconnect', this.handleDisconnect.bind(this));
      ethereum.on('disconnect', this.handleDisconnect.bind(this));

      /**********************************************************/
      /* Handle chain (network) and chainChanged (per EIP-1193) */
      /**********************************************************/

      ethereum.request({ method: 'eth_chainId' }).then((chainId) => {
        console.warn('eth_chainId', chainId);

        if (chainId !== GOERLI_TEST_NETWORK) {
          alert('Diese Seite funktioniert nur mit dem Goerli Test Netzwerk.');
        }

        this.setChainId(chainId);
      });
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
      ethereum.removeListener(
        'chainChanged',
        this.handleChainChanged.bind(this)
      );
      ethereum.on('chainChanged', this.handleChainChanged.bind(this));

      /***********************************************************/
      /* Handle user accounts and accountsChanged (per EIP-1193) */
      /***********************************************************/

      ethereum
        .request({ method: 'eth_accounts' })
        .then(this.handleAccountsChanged.bind(this))
        .catch((err) => {
          // Some unexpected error.
          // For backwards compatibility reasons, if no accounts are available,
          // eth_accounts will return an empty array.
          console.error(err);
        });
      // Note that this event is emitted on page load.
      // If the array of accounts is non-empty, you're already
      // connected.
      ethereum.removeListener(
        'accountsChanged',
        this.handleAccountsChanged.bind(this)
      );
      ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
    } else {
      console.log('Please install MetaMask!');
    }
  }

  // The MetaMask provider emits this event when it first becomes able to submit RPC requests to a chain.
  // We recommend using a connect event handler and the ethereum.isConnected() method in order to determine when/if the provider is connected.
  handleConnect(connectInfo) {
    console.warn('connect', connectInfo);

    this.setChainId(connectInfo.chainId);
  }

  // The MetaMask provider emits this event if it becomes unable to submit RPC requests to any chain. In general, this will only happen due to network connectivity issues or some unforeseen error.
  handleDisconnect(error) {
    console.warn('disconnect', error);
  }

  handleChainChanged(chainId) {
    console.warn('chainChanged', chainId);

    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
  }

  handleAccountsChanged(accounts) {
    console.warn('accountsChanged', accounts);

    this.provider = new ethers.providers.Web3Provider(ethereum);
    console.warn('PROVIDER', this.provider);
    this.signer = this.provider.getSigner();
    console.warn('SIGNER', this.signer);
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, abi, this.provider);
    console.warn('CONTRACT', this.contract);
    this.contractWithSigner = this.contract.connect(this.signer);
    console.warn('CONTRACT SIGNER', this.contractWithSigner);

    this.contract.removeListener(
      'VotingStarted',
      this.handleVotingStarted.bind(this)
    );
    this.contract.on('VotingStarted', this.handleVotingStarted.bind(this));
    this.contract.removeListener(
      'VotingEnded',
      this.handleVotingEnded.bind(this)
    );
    this.contract.on('VotingEnded', this.handleVotingEnded.bind(this));
    this.contract.removeListener(
      'VotesUpdated',
      this.handleVotesUpdated.bind(this)
    );
    this.contract.on('VotesUpdated', this.handleVotesUpdated.bind(this));
    this.contract.removeListener('Voted', this.handleVoted.bind(this));
    this.contract.on('Voted', this.handleVoted.bind(this));

    let account;
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');

      for (const el of document.querySelectorAll(`button.vote`)) {
        el.classList.remove('yay');
        el.classList.remove('nay');
      }
    } else {
      account = accounts[0];
    }

    this.setAccount(account);
  }

  handleVotingStarted() {
    console.warn('VotingStarted');

    const record = this.store.peekRecord('contract', 0);
    if (record) record.isVoting = true;
  }

  handleVotingEnded() {
    console.warn('VotingEnded');

    const record = this.store.peekRecord('contract', 0);
    if (record) record.isVoting = false;
  }

  handleVotesUpdated(votes) {
    console.warn('VotesUpdated', votes);

    const affair = this.store.peekRecord('affair', votes.id.toNumber());

    affair.yay = votes.yay.toNumber();
    affair.nay = votes.nay.toNumber();
  }

  handleVoted(_address, _id, _voted) {
    console.warn('Voted', _address, _id, _voted);

    const [address, id, voted] = [
      _address.toLowerCase(),
      _id.toNumber(),
      _voted,
    ];

    if (this.account === address) {
      this.updateVoteButton(id, voted);
      const record = this.store.peekRecord('voted', id);
      if (record) record.voted = voted;
    }
  }

  setChainId(chainId) {
    this.chainId = chainId;
  }

  setAccount(account) {
    console.warn(
      'ACCOUNT',
      account,
      account === window.ethereum.selectedAddress
    );

    // if (account !== this.account)
    this.account = account;

    let isVoting = false;
    const contractRecord = this.store.peekRecord('contract', 0);
    if (contractRecord) isVoting = contractRecord.isVoting;

    const record = this.store.peekRecord('account', 0);
    record.account = this.account;
    record.chainId = this.chainId;

    for (const el of document.querySelectorAll(`button.vote`)) {
      if (account && isVoting) el.removeAttribute('disabled');
      else el.setAttribute('disabled', '');
    }

    this.getAffairs().then((affairs) => {
      for (const affair of affairs) {
        try {
          const id = Number(affair.id);
          const voted = this.hasVoted(id);

          const record = this.store.peekRecord('voted', id);
          if (record) record.voted = voted;
          else {
            this.store.createRecord('voted', {
              id: id,
              voted: voted,
            });
          }
        } catch (e) {
          console.error(e.error ? e.error.message : e.message);
        }
      }
    });

    const affairs = this.store.peekAll('affair');
    for (const affair of affairs) {
      try {
        this.getVotes(affair.id)
          .then((votes) => {
            // console.log(votes);

            affair.yay = votes.yay.toNumber();
            affair.nay = votes.nay.toNumber();
          })
          .catch((e) => {
            console.error(e.error ? e.error.message : e.message);
          });
      } catch (e) {
        console.error(e.error ? e.error.message : e.message);
      }
    }

    // this.init();
  }

  async hasContract() {
    const { ethereum } = window;
    if (ethereum) {
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      // console.info('web3::hasContract', chainId, chainId === GOERLI_TEST_NETWORK);
      return chainId === GOERLI_TEST_NETWORK;
    }
    return false;
  }
  hasSigner() {
    // console.info('web3::hasSigner', this.account, this.account !== null);
    return this.account !== null;
  }

  async getName() {
    console[(await this.hasContract()) ? 'info' : 'warn']('web3::getName');
    return (await this.hasContract()) ? this.contract.name() : undefined;
  }

  async getAffairs() {
    console[(await this.hasContract()) ? 'info' : 'warn']('web3::getAffairs');
    return (await this.hasContract()) ? this.contract.getAffairs() : [];
  }

  async getVote(ref) {
    console[this.hasSigner() ? 'info' : 'warn']('web3::getVote', ref);
    const vote = this.hasSigner
      ? this.contractWithSigner.getVote(ref)
      : undefined;
    this.updateVoteButton(ref, vote);
    return vote;
  }

  async getVotes(ref) {
    console[(await this.hasContract()) ? 'info' : 'warn'](
      'web3::getVotes',
      ref
    );
    try {
      return (await this.hasContract())
        ? this.contract.getVotes(ref)
        : undefined;
    } catch (e) {
      console.error(e.error ? e.error.message : e.message);
    }
  }

  async isVoting() {
    console[(await this.hasContract()) ? 'info' : 'warn']('web3::isVoting');
    return (await this.hasContract()) ? this.contract.isVoting() : undefined;
  }

  async vote(_id, _vote) {
    console[this.hasSigner() ? 'info' : 'warn']('web3::vote', _id, _vote);
    return this.hasSigner()
      ? this.contractWithSigner.vote(_id, _vote)
      : undefined;
  }

  async hasVoted(id) {
    console[this.hasSigner() ? 'info' : 'warn']('web3::hasVoted', id);
    let voted;
    try {
      voted = this.hasSigner()
        ? await this.contractWithSigner.hasVoted(id)
        : undefined;
    } catch (e) {
      console.error(e.error ? e.error.message : e.message);
    }
    this.updateVoteButton(id, voted);
    const record = this.store.peekRecord('voted', id);
    if (record) record.voted = voted;
    return voted;
  }

  updateVoteButton(id, hasVoted) {
    console.log('updateVoteButton', id, hasVoted);

    let isVoting = false;
    const record = this.store.peekRecord('contract', 0);
    if (record) isVoting = record.isVoting;

    for (const el of document.querySelectorAll(`button.vote`)) {
      if (this.account && isVoting) el.removeAttribute('disabled');
      else el.setAttribute('disabled', '');
    }

    if (typeof hasVoted !== 'boolean') {
      for (const el of document.querySelectorAll(`#affair-${id} button.vote`)) {
        el.classList.remove('yay');
        el.classList.remove('nay');
      }
    } else {
      const elYay = document.querySelector(
        `#affair-${id} button.vote:first-child`
      );
      if (elYay) elYay.classList[hasVoted ? 'add' : 'remove']('yay');
      const elNay = document.querySelector(
        `#affair-${id} button.vote:last-child`
      );
      if (elNay) elNay.classList[hasVoted ? 'remove' : 'add']('nay');
    }
  }
}
