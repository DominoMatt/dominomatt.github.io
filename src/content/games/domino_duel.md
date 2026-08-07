---
title: Domino Duel
order: 1
category: Trick-taking
players: "2 players"
age: ages 9+
time: 20 min
accent: "#b171ae"
ink: "#dde4d8"
art: sword.svg
description: "Duel your friends in this 2 player trick-taker."
mechanics: [Trick-taking]
license: CC BY-NC
contents: Rules Sheet
spec: Double 6 Dominoes
downloads:
  - title: Domino Tray for 3D Printing
    file: stl/domino_tray.stl
    description: "Holds 6 dominos"
    spec: 0.2-0.3 resolution ~ 25% infill ~ brim helpful ~ no rafts/supports needed
# attributions: []
# relatedGames: []
# published: false
---

Doubles rank highest in their 'suit', followed by heaviest weight of the Power and so on... (e.g. 2-2, 2-6, 2-5, 2-4, 2-3, 2-1, 2-0). This same ranking pattern is true of each suit.

## Set-up:

- Shuffle the dominoes face-down or in a bag (boneyard).
- Each player gets 3 HP (health) at the start of the game. (same as best of 5 play)
- First player can be randomly determined and after drawing up decides whether to Attack or Defend.

## Gameplay:

- The domino end played towards your opponent is the Attack Type/'suit'.
- The end closest you is it's Power/'rank'.
- When a trick is played the domino ends that 'match' each other is the Attack Type/'suit'.

### Attack

Play any domino, with a 1-6 as an end value. The attacking/'lead' player continues to Attack until:

  <ol type="a">
    <li>Dealing 1 HP of damage,</li>
    <li>Until Countered, or</li>
    <li>The attacker has no more tiles to attack with, see Round End.</li>
  </ol>

### Defend:

Play a domino with an end that matches the Attack's Type or has a 0/blank on one (or more) of it's ends, thereby...

<ol type="a">
  <li>Block:
    <ul>
      <li>Play any domino with a 0/blank on one (or more) of it's ends.</li>
      <li>Play a domino that matches the Attack's Value and has Power less than the attacking domino's Power. (A 2-1 would Block an attacking 2-6 domino)</li>
    </ul>
  </li>
  <li>Counter:
    <ul>
      <li>Play a domino that matches the Attack's Value and has Power greater than the attacking domino's Power. (A 2-6 Counters a 2-5)</li>
      <li>The defender would now becomes the attacker.</li>
    </ul>
  </li>
</ol>

### Lose 1 health... triggering Round End.

- Play any non-matching, non-blank domino ('junk'); effectively improving your hand.
- Refuse to defend with a domino; to save the rest your hand for the next round.

## Round end:

The round ends after either a player loses 1 health or 12 plays/tricks.

- If someone lost HP during the round:
  1. Players keep all of the dominoes left in their hand (if any).
  2. All other tiles are shuffled face-down.
  3. Players then draw up until they reach their hand size of 6.
  4. If someone lost HP, they decide if they want to start Attacking or Defending the next round.

- If after 6 plays, no one lost HP, the attacker continues to Attack in the 7th trick.
  1. both players draw 6 more tiles from the boneyard's remaining tiles.
  2. Tricks 7-12 ensue, when the extra round ends, do 1-4 above.
     -If no lost HP during this 'extra' round, the Attacker will continue to attack in the next round.

## Game end

If a player hits 0 HP, they lose. Another game could start and the loser starts as 1st player.

## Special case

The 0-0 domino can 'Attack', only if it's the 6th or 12th play of the round; but can be Countered by any non-0/blank domino end played against it, taking lead; or Blocked w/ a blank end.

## Optional Ability

Short rest: Before drawing up, if you have >= 4 tiles left in hand, you may discard them all, shuffle them into the boneyard and then each player draws up to 6 (their hand size).

## 'Line' of play:

For consistency sake, when starting a round the attacker makes the first Play and the 'line' of play (the duel) gets played left to right from the attacking players perspective until the round is complete. 
