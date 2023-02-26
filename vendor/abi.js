abi=[{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"ref","type":"string"},{"internalType":"string","name":"topic","type":"string"},{"internalType":"string","name":"date","type":"string"}],"internalType":"struct Types.Affair[]","name":"_affairs","type":"tuple[]"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"},{"indexed":false,"internalType":"bool","name":"","type":"bool"}],"name":"Voted","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"yay","type":"uint256"},{"internalType":"uint256","name":"nay","type":"uint256"}],"indexed":false,"internalType":"struct Types.Votes","name":"","type":"tuple"}],"name":"VotesUpdated","type":"event"},{"anonymous":false,"inputs":[],"name":"VotingEnded","type":"event"},{"anonymous":false,"inputs":[],"name":"VotingStarted","type":"event"},{"inputs":[],"name":"executor","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAffairs","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"ref","type":"string"},{"internalType":"string","name":"topic","type":"string"},{"internalType":"string","name":"date","type":"string"}],"internalType":"struct Types.Affair[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getResults","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"yay","type":"uint256"},{"internalType":"uint256","name":"nay","type":"uint256"}],"internalType":"struct Types.Votes[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getVote","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"bool","name":"voted","type":"bool"},{"internalType":"uint256","name":"votedAt","type":"uint256"}],"internalType":"struct Types.Vote","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getVotes","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"yay","type":"uint256"},{"internalType":"uint256","name":"nay","type":"uint256"}],"internalType":"struct Types.Votes","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"hasVoted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isVoting","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_endTime","type":"uint256"}],"name":"setEndTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_startTime","type":"uint256"}],"name":"setStartTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startVoting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stopVoting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"bool","name":"_vote","type":"bool"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"}]