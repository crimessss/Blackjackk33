const { ranks } = require('./ranks');

function formatHelpMessage() {
  return [
    "🎰 Casino Commands 🎰",
    "",
    "💰 Basic Commands:",
    "!help - Show this help message",
    "!bal - Check your chip balance",
    "!daily - Claim daily bonus",
    "!rank - Check your current rank",
    "!ranks - View all ranks and benefits",
    "",
    "🎲 Game Commands:",
    "!bet <amount> - Start a game (!b)",
    "!hit - Draw another card (!h)",
    "!stand - End your turn (!s)",
    "!double - Double your bet (!d)",
    "",
    "💎 Other Commands:",
    "!give <username> <amount> - Give chips to another player",
    "!cashout <amount> - Convert chips to gold",
    "",
    "💫 Rank Benefits:",
    ...Object.entries(ranks).map(([_, rank]) => 
      `${rank.color} ${rank.name}: Max bet ${rank.benefits.maxBet}, Daily +${rank.benefits.dailyBonus}`
    ),
    "",
    "💡 Tip: 1 Gold = 1 Chip"
  ].join('\n');
}

async function handleHelpCommand(bot, user) {
  const helpMessage = formatHelpMessage();
  const parts = helpMessage.match(/.{1,500}/g) || [];
  
  for (const part of parts) {
    await bot.whisper.send(user.id, part);
  }
}

module.exports = {
  handleHelpCommand
};