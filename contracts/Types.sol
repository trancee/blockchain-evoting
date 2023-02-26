// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

library Types {
    struct Affair {
        uint256 id; // AffairID, e.g. 20210044
        string ref; // AffairID, e.g. 21.044
        string topic; // Thema, e.g. Keine Massentierhaltung in der Schweiz (Massentierhaltungsinitiative). Volksinitiative und direkter Gegenentwurf
        string date; // Einreichungsdatum, e.g. 19.05.2021
    }

    struct Vote {
        uint256 id; // AffairID
        bool voted; // Ja oder Nein
        uint256 votedAt; // Wann wurde die Stimme abgegeben?
    }

    struct Votes {
        uint256 id; // AffairID
        uint256 yay; // Ja-Stimmen
        uint256 nay; // Nein-Stimmen
    }
}
