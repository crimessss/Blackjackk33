const ranks = {
  GOLD: {
    name: "Gold",
    minChips: 0,
    maxChips: 9999,
    color: "⚜️",
    benefits: {
      maxBet: 500,
      dailyBonus: 50,
      houseEdge: 0.05
    }
  },
  PLATINUM: {
    name: "Platinum",
    minChips: 10000,
    maxChips: 49999,
    color: "💠",
    benefits: {
      maxBet: 2000,
      dailyBonus: 200,
      houseEdge: 0.045
    }
  },
  DIAMOND: {
    name: "Diamond",
    minChips: 50000,
    maxChips: 99999,
    color: "💎",
    benefits: {
      maxBet: 5000,
      dailyBonus: 500,
      houseEdge: 0.04
    }
  },
  NOIR: {
    name: "Noir",
    minChips: 100000,
    maxChips: Infinity,
    color: "🎩",
    benefits: {
      maxBet: 10000,
      dailyBonus: 1000,
      houseEdge: 0.035
    }
  }
};

function calculateRank(chips) {
  for (const [rankKey, rankData] of Object.entries(ranks)) {
    if (chips >= rankData.minChips && chips <= rankData.maxChips) {
      return { ...rankData, key: rankKey };
    }
  }
  return ranks.GOLD;
}

function getNextRank(currentChips) {
  for (const [rankKey, rankData] of Object.entries(ranks)) {
    if (rankData.minChips > currentChips) {
      return {
        ...rankData,
        chipsNeeded: rankData.minChips - currentChips,
        key: rankKey
      };
    }
  }
  return null;
}

function formatGameMessage(type, username, content) {
  const emoji = {
    dealer: "🎲",
    win: "🃏",
    lose: "💀",
    join: "🎮",
    cards: "🎴"
  };
  
  return `[${emoji[type]}] ${content}`;
}

function formatCards(cards) {
  return cards.join(' ');
}

module.exports = {
  ranks,
  calculateRank,
  getNextRank,
  formatGameMessage,
  formatCards
};