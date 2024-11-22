const { calculateRank, formatGameMessage, formatCards } = require('./ranks');

function calculatePoints(cards) {
  let points = 0;
  let aces = 0;

  for (let card of cards) {
    const value = card.slice(0, -1);
    if (value === "A") {
      points += 11;
      aces += 1;
    } else if (["K", "Q", "J"].includes(value)) {
      points += 10;
    } else {
      points += parseInt(value);
    }
  }

  while (points > 21 && aces > 0) {
    points -= 10;
    aces -= 1;
  }

  return points;
}

function drawCard(isDealer = false) {
  const suits = ["♥️", "♦️", "♣️", "♠️"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  
  if (isDealer) {
    const dealerValues = ["10", "J", "Q", "K", "A", "10", "J", "Q", "K"];
    const value = dealerValues[Math.floor(Math.random() * dealerValues.length)];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    return value + suit;
  }

  const value = values[Math.floor(Math.random() * values.length)];
  const suit = suits[Math.floor(Math.random() * suits.length)];
  return value + suit;
}

async function handleGameLogic(bot, message, user, userData) {
  const rank = calculateRank(userData.wallet);
  const houseEdge = rank.benefits.houseEdge;
  const maxBet = rank.benefits.maxBet;

  if (message.toLowerCase().startsWith('!bet ')) {
    const bet = parseInt(message.split(' ')[1]);
    
    if (isNaN(bet) || bet < 10 || bet > maxBet) {
      bot.whisper.send(user.id, `Bet must be between 10 and ${maxBet} chips`);
      return;
    }

    if (userData.wallet < bet) {
      bot.whisper.send(user.id, "Not enough chips!");
      return;
    }

    userData.status = 'playing';
    userData.currentBet = bet;
    userData.wallet -= bet;
    userData.cards = [drawCard(), drawCard()];
    userData.dealerCards = [drawCard(true)];

    const points = calculatePoints(userData.cards);
    
    // New message format
    bot.message.send(
      `[${rank.color}] @${user.username} ${formatCards(userData.cards)} = [${points}]\n` +
      `[🎲] Dealer: ${userData.dealerCards[0]}`
    );
  }

  if (message.toLowerCase() === '!hit' && userData.status === 'playing') {
    userData.cards.push(drawCard());
    const points = calculatePoints(userData.cards);
    
    bot.message.send(
      `[${rank.color}] @${user.username} ${formatCards(userData.cards)} = [${points}]`
    );

    if (points > 21) {
      bot.message.send(formatGameMessage('lose', user.username, `@${user.username} busts with [${points}]`));
      userData.status = 'idle';
    }
  }

  if (message.toLowerCase() === '!stand' && userData.status === 'playing') {
    const playerPoints = calculatePoints(userData.cards);
    userData.dealerCards.push(drawCard(true));
    let dealerPoints = calculatePoints(userData.dealerCards);
    
    while (dealerPoints < 17) {
      userData.dealerCards.push(drawCard(true));
      dealerPoints = calculatePoints(userData.dealerCards);
    }

    bot.message.send(
      `[🎲] Dealer: ${formatCards(userData.dealerCards)} = [${dealerPoints}]`
    );

    if (dealerPoints > 21 || playerPoints > dealerPoints) {
      bot.message.send(
        formatGameMessage('win', user.username, `@${user.username} wins with [${playerPoints}]`)
      );
      userData.wallet += userData.currentBet * 2;
    } else if (dealerPoints > playerPoints) {
      bot.message.send(
        formatGameMessage('lose', user.username, `@${user.username} loses with [${playerPoints}]`)
      );
    } else {
      bot.message.send(`Push! @${user.username} ties with [${playerPoints}]`);
      userData.wallet += userData.currentBet;
    }

    userData.status = 'idle';
  }
}

module.exports = {
  handleGameLogic,
  calculatePoints,
  drawCard
};