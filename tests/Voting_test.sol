// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
import "remix_tests.sol"; // this import is automatically injected by Remix.
import "remix_accounts.sol";
import "hardhat/console.sol";
import "../contracts/Voting.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

contract VotingTest is Voting {
    string _name = "Volksabstimmung vom 25. September 2022";

    Types.Affair[] _affairs;

    Voting votingTest;

    address acc0;
    address acc1;
    address acc2;
    address acc3;

    constructor() Voting(_name, _getAffairs()) {}

    function beforeAll() public {
        acc0 = TestsAccounts.getAccount(0);
        acc1 = TestsAccounts.getAccount(1);
        acc2 = TestsAccounts.getAccount(2);
        acc3 = TestsAccounts.getAccount(3);

        _affairs.push(
            Types.Affair({
                id: 20210044,
                ref: "21.044",
                topic: unicode"Keine Massentierhaltung in der Schweiz (Massentierhaltungsinitiative).\nVolksinitiative und direkter Gegenentwurf",
                date: "19.05.2021"
            })
        );

        _affairs.push(
            Types.Affair({
                id: 20210024,
                ref: "21.024",
                topic: unicode"Verrechnungssteuergesetz.\nStärkung des Fremdkapitalmarkts",
                date: "14.04.2021"
            })
        );

        _affairs.push(
            Types.Affair({
                id: 20190050,
                ref: "19.050",
                topic: unicode"Stabilisierung der AHV (AHV 21)\nBundesgesetz über die Alters- und Hinterlassenenversicherung (AHVG)\nBundesbeschluss über die Zusatzfinanzierung der AHV durch eine Erhöhung der Mehrwertsteuer",
                date: "28.08.2019"
            })
        );

        votingTest = new Voting(name, _affairs);
    }

    function _startVoting() public {
        console.log("Running startVoting");

        votingTest.startVoting();
        startVoting();
    }

    // function setVotingPeriod() public {
    //     console.log("Running setVotingPeriod");

    //     votingTest.setStartTime(block.timestamp);
    //     votingTest.setEndTime(block.timestamp + 1 days);
    // }

    /// #sender: account-1
    function voteYay() public {
        console.log("Running voteYay");

        Assert.equal(msg.sender, acc1, "wrong sender");

        uint256 _affairID = 20210044;

        {
            Types.Votes memory _votes = getVotes(_affairID);
            Assert.equal(_votes.yay, 0, "votes for yay should be zero");
            Assert.equal(_votes.nay, 0, "votes for nay should be zero");
        }

        vote(_affairID, true);
        Assert.equal(hasVoted(_affairID), true, "voter should have voted yay");

        Types.Vote memory _vote = getVote(_affairID);
        Assert.equal(
            _vote.id,
            _affairID,
            "voter's vote should have correct affair ID"
        );
        Assert.equal(_vote.voted, true, "voter's vote should have voted yay");

        {
            Types.Votes memory _votes = getVotes(_affairID);
            Assert.equal(_votes.yay, 1, "votes for yay should be one");
            Assert.equal(_votes.nay, 0, "votes for nay should be zero");
        }
    }

    /// #sender: account-2
    function voteNay() public {
        console.log("Running voteNay");

        Assert.equal(msg.sender, acc2, "wrong sender");

        uint256 _affairID = 20210024;

        {
            Types.Votes memory _votes = getVotes(_affairID);
            Assert.equal(_votes.yay, 0, "votes for yay should be zero");
            Assert.equal(_votes.nay, 0, "votes for nay should be zero");
        }

        vote(_affairID, false);
        Assert.equal(hasVoted(_affairID), false, "voter should have voted nay");

        Types.Vote memory _vote = getVote(_affairID);
        Assert.equal(
            _vote.id,
            _affairID,
            "voter's vote should have correct affair ID"
        );
        Assert.equal(_vote.voted, false, "voter's vote should have voted nay");

        {
            Types.Votes memory _votes = getVotes(_affairID);
            Assert.equal(_votes.yay, 0, "votes for yay should be zero");
            Assert.equal(_votes.nay, 1, "votes for nay should be one");
        }
    }

    /// #sender: account-1
    function voteYayAgain() public {
        console.log("Running voteYayAgain");

        Assert.equal(msg.sender, acc1, "wrong sender");

        uint256 _affairID = 20210044;

        {
            Types.Votes memory _votes = getVotes(_affairID);
            Assert.equal(_votes.yay, 1, "votes for yay should be one");
            Assert.equal(_votes.nay, 0, "votes for nay should be zero");
        }

        Types.Vote memory _vote = getVote(_affairID);
        Assert.equal(
            _vote.id,
            _affairID,
            "voter's vote should have correct affair ID"
        );
        Assert.equal(_vote.voted, true, "voter's vote should have voted yay");

        vote(_affairID, true);
        Assert.equal(hasVoted(_affairID), true, "voter should have voted yay");

        {
            Types.Votes memory _votes = getVotes(_affairID);
            Assert.equal(_votes.yay, 1, "votes for yay should be one");
            Assert.equal(_votes.nay, 0, "votes for nay should be zero");
        }
    }

    /// #sender: account-1
    function voteNayInstead() public {
        console.log("Running voteNayInstead");

        Assert.equal(msg.sender, acc1, "wrong sender");

        uint256 _affairID = 20210044;

        {
            Types.Votes memory _votes = getVotes(_affairID);
            Assert.equal(_votes.yay, 1, "votes for yay should be one");
            Assert.equal(_votes.nay, 0, "votes for nay should be zero");
        }

        Types.Vote memory _vote = getVote(_affairID);
        Assert.equal(
            _vote.id,
            _affairID,
            "voter's vote should have correct affair ID"
        );
        Assert.equal(_vote.voted, true, "voter's vote should have voted yay");

        vote(_affairID, false);
        Assert.equal(hasVoted(_affairID), false, "voter should have voted nay");

        {
            Types.Votes memory _votes = getVotes(_affairID);
            Assert.equal(_votes.yay, 0, "votes for yay should be zero");
            Assert.equal(_votes.nay, 1, "votes for nay should be one");
        }
    }

    // /// #sender: account-3
    // function checkUnvotedVote() public {
    //     console.log("Running checkUnvotedVote");

    //     Assert.equal(msg.sender, acc3, "wrong sender");

    //     uint256 _affairID = 20190050;

    //     try votingTest.hasVoted(_affairID) {
    //         Assert.ok(false, "voter should not have voted");
    //     } catch Error(string memory reason) {
    //         Assert.equal(
    //             reason,
    //             "vote does not exist",
    //             "vote should not exist"
    //         );
    //     }

    //     try votingTest.getVote(_affairID, msg.sender) {
    //         Assert.ok(false, "voter should not have voted");
    //     } catch Error(string memory reason) {
    //         Assert.equal(
    //             reason,
    //             "vote does not exist",
    //             "vote should not exist"
    //         );
    //     }
    // }

    /// #sender: account-3
    function voteYay3() public {
        console.log("Running voteYay3");

        Assert.equal(msg.sender, acc3, "wrong sender");

        uint256 _affairID = 20210044;

        vote(_affairID, true);
        Assert.equal(hasVoted(_affairID), true, "voter should have voted yay");

        Types.Vote memory _vote = getVote(_affairID);
        Assert.equal(
            _vote.id,
            _affairID,
            "voter's vote should have correct affair ID"
        );
        Assert.equal(_vote.voted, true, "voter's vote should have voted yay");
    }

    function _getResults() public {
        console.log("Running getResults");

        try votingTest.getResults() {
            Assert.ok(false, "voting should not have ended");
        } catch Error(string memory reason) {
            Assert.equal(
                reason,
                "voting not ended",
                "voting should not have ended"
            );

            votingTest.setEndTime(block.timestamp - 1 days);
        }

        {
            Types.Votes[] memory _votes = votingTest.getResults();

            for (uint256 i = 0; i < _votes.length; i++) {
                console.log(
                    string.concat(
                        "AffairID",
                        ": ",
                        Strings.toString(_votes[i].id),
                        "\t",
                        "Yay",
                        ": ",
                        Strings.toString(_votes[i].yay),
                        "\t",
                        "Nay",
                        ": ",
                        Strings.toString(_votes[i].nay)
                    )
                );
            }
        }

        {
            setEndTime(block.timestamp - 1 days);

            Types.Votes[] memory _votes = getResults();

            for (uint256 i = 0; i < _votes.length; i++) {
                console.log(
                    string.concat(
                        "AffairID",
                        ": ",
                        Strings.toString(_votes[i].id),
                        "\t",
                        "Yay",
                        ": ",
                        Strings.toString(_votes[i].yay),
                        "\t",
                        "Nay",
                        ": ",
                        Strings.toString(_votes[i].nay)
                    )
                );
            }
        }
    }

    function _getAffairs() private pure returns (Types.Affair[] memory) {
        Types.Affair[] memory affairs = new Types.Affair[](3);

        affairs[0] = Types.Affair({
            id: 20210044,
            ref: "21.044",
            topic: unicode"Keine Massentierhaltung in der Schweiz (Massentierhaltungsinitiative).\nVolksinitiative und direkter Gegenentwurf",
            date: "19.05.2021"
        });

        affairs[1] = Types.Affair({
            id: 20210024,
            ref: "21.024",
            topic: unicode"Verrechnungssteuergesetz.\nStärkung des Fremdkapitalmarkts",
            date: "14.04.2021"
        });

        affairs[2] = Types.Affair({
            id: 20190050,
            ref: "19.050",
            topic: unicode"Stabilisierung der AHV (AHV 21)\nBundesgesetz über die Alters- und Hinterlassenenversicherung (AHVG)\nBundesbeschluss über die Zusatzfinanzierung der AHV durch eine Erhöhung der Mehrwertsteuer",
            date: "28.08.2019"
        });

        return affairs;
    }
}
