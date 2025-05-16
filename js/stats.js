let Stats = {
  addToTimeStats(diff, isOnline) {
    player.stats.timeSincePurchase += diff;
    player.stats.timeSinceSacrifice += diff;
    player.stats.timeSincePrestige += diff;
    player.stats.timeSinceInfinity += diff;
    player.stats.timeSinceEternity += diff;
    player.stats.timeSinceComplexity += diff;
    player.stats.timeSinceFinality += diff;
    player.stats.timeSinceAutoECCompletion += diff;
    player.stats.timeSincePermanenceGain += diff;
    player.stats.timeSincePowerGain += diff;
    player.stats.timeSinceOraclePrediction += diff;
    player.stats.timeSinceGameStart += diff;
    player.stats.timeSinceLastPeakIPPerSec += diff;
    player.stats.timeSinceLastPeakEPPerSec += diff;
    player.stats.timeSinceLastPeakCPPerSec += diff;
    player.stats.timeSinceLastPeakLogIPPerSec += diff;
    player.stats.timeSinceLastPeakLogEPPerSec += diff;
    player.stats.timeSinceLastPeakLogCPPerSec += diff;
    player.stats.timeSinceSacrificePossible += diff;
    player.stats.timeSincePrestigePossible += diff;
    player.stats.timeSinceIPGainWasAmount += diff;
    player.stats.timeSinceEPGainWasAmount += diff;
    player.stats.timeSinceCPGainWasAmount += diff;
    player.stats.timeSinceIPGainWasTotal += diff;
    player.stats.timeSinceEPGainWasTotal += diff;
    player.stats.timeSinceCPGainWasTotal += diff;
    player.stats.timeSinceExport += diff;
    ComplexityChallenge.addToTimeStats(diff);
    if (isOnline !== false) {
      // Note that this happens in the default case where isOnline is undefined.
      // Note also that if the game is being throttled, this makes sure each tick
      // is at most 0.128 seconds (recall that a tick generally happens
      // every 64 milliseconds).
      player.stats.onlineTimeSinceGameStart += Math.min(diff, 0.128);
    }
  },
  recordPurchase(i, n) {
    player.stats.timeSincePurchase = 0;
    player.stats.purchasesThisInfinity += n;
    player.stats.purchasesThisInfinityByType[i] += n;
  },
  addInfinity(time, gain, total) {
    player.stats.fastestInfinity = Math.min(time, player.stats.fastestInfinity);
    player.stats.lastTenInfinities.unshift([time, gain, gain.div(Math.max(time, 1 / 16)), total]);
    player.stats.lastTenInfinities.pop();
  },
  addEternity(time, gain, total) {
    player.stats.fastestEternity = Math.min(time, player.stats.fastestEternity);
    player.stats.lastTenEternities.unshift([time, gain, gain.div(Math.max(time, 1 / 16)), total]);
    player.stats.lastTenEternities.pop();
  },
  addComplexity(time, gain, total) {
    player.stats.fastestComplexity = Math.min(time, player.stats.fastestComplexity);
    player.stats.lastTenComplexities.unshift([time, gain, gain.div(Math.max(time, 1 / 16)), total]);
    player.stats.lastTenComplexities.pop();
  },
  addFinality(time, pointGain, shardGain, total) {
    player.stats.fastestFinality = Math.min(time, player.stats.fastestFinality);
    player.stats.lastTenFinalities.unshift([time, pointGain, shardGain, total]);
    player.stats.lastTenFinalities.pop();
  },
  lastRunsToShow() {
    return player.stats.lastRunsToShow;
  },
  setLastRunsToShow(x) {
    player.stats.lastRunsToShow = Math.min(20, Math.max(0, Math.floor(x || 0)));
  },
  setShowRunType(layer, b) {
    player.stats.lastRunTypesToShow[layer] = b;
  },
  timeSinceKey(layer) {
    return 'timeSince' + layer[0].toUpperCase() + layer.slice(1);
  },
  lastTenKey(layer) {
    return 'lastTen' + layer[0].toUpperCase() + (layer[layer.length - 1] === 'y' ? layer.slice(1, -1) + 'ies' : layer.slice(1) + 's');
  },
  showAnyRuns(x) {
    return this.lastRunsToShow() >= x;
  },
  showRunType(layer) {
    return player.stats.lastRunTypesToShow[layer];
  },
  showRunBreak(layer) {
    let layers = ['infinity', 'eternity', 'complexity', 'finality'];
    return this.showRun(1, layer) && layers.slice(0, layers.indexOf(layer)).some(x => this.showRunType(x));
  },
  showRun(x, layer) {
    return this.showAnyRuns(x) && this.showRunType(layer) &&
      player.stats[this.lastTenKey(layer)][x - 1][0] !== -1;
  },
  getLogPerSec(t, a, b, useBase) {
    // Default value for last ten, should never appear elsewhere.
    if (b.eq(-1)) {
      return 0;
    }
    let c = a.plus(b).log2() - Math.max(b.log2(), 0);
    if (c < Math.pow(2, -16)) {
      c = 0;
    }
    let r = c / Math.max(t, 1 / 16);
    return useBase ? r / Math.log2(NotationOptions.exponentBase()) : r;
  },
  showCheatStats() {
    // We just check for truthy values of generation, since things like null behave exactly like false
    // (including display).
    return player.cheats.gameSpeed !== 1 || player.cheats.extraAchievements !== 0 ||
    player.cheats.achievementExtraMultiplier !== 1 || player.cheats.normalGeneratorPower !== 1 ||
    player.cheats.infinityPointGeneration || player.cheats.eternityPointGeneration ||
    player.cheats.complexityPointGeneration;
  }
}

// This is here since it's vaguely stats-related and adding a new file just for this didn't seem wise.
let FastResetText = {
  layers: ['sacrifice', 'prestige', 'infinity', 'eternity', 'complexity', 'finality'],
  layersReversed: ['finality', 'complexity', 'eternity', 'infinity', 'prestige', 'sacrifice'],
  
  autobuyerIndices: [10, 11, 12, 13, 15, 16],
  getTextForLayer(x, altered) {
    if (altered) {
      return 'you\'re currently doing fast ' + (x[x.length - 1] === 'y' ? x.slice(0, -1) + 'ies' : x + 's') + ' due to ' + this.getCauseForLayer(x);
    } else {
      return ' You are currently doing fast ' + (x[x.length - 1] === 'y' ? x.slice(0, -1) + 'ies' : x + 's') + ' due to ' + this.getCauseForLayer(x);
    }
  },
  getCauseForLayer(x) {
    if (lastHotkeyUse[x] >= Date.now() / 1000 - 1) {
      return 'holding the ' + x[0].toUpperCase() + ' hotkey.';
    } else if (Autobuyer(this.autobuyerIndices[this.layers.indexOf(x)]).isActive()) {
      return 'your ' + x + ' autobuyer.';
    } else {
      return 'an unknown cause (perhaps clicking the button quickly).';
    }
  },
  isLonger: {'sacrifice': false, 'prestige': false, 'infinity': true, 'eternity': true, 'complexity': true, 'finality': true},
  cache: {'sacrifice': null, 'prestige': null, 'infinity': null, 'eternity': null, 'complexity': null, 'finality': null},
  // We might end up calling this a lot.
  isDoingFast(x) {
    // Cache, and clear cache every time we reset.
    if (this.cache[x] === null) {
      let info = player.stats[Stats.lastTenKey(x)];
      let times = this.isLonger[x] ? info.map(x => x[0]) : info;
      this.cache[x] = player.stats[Stats.timeSinceKey(x)] <= 1 &&
        times.every(x => x !== -1 && x <= 1);
    }
    return this.cache[x];
  },
  clearCache() {
    this.cache = {'sacrifice': null, 'prestige': null, 'infinity': null, 'eternity': null, 'complexity': null, 'finality': null};
  },
  isDoingFastBeyond(x) {
    return this.layers.slice(this.layers.indexOf(x)).some(y => this.isDoingFast(y));
  },
  getText(x, altered) {
    for (let i of this.layersReversed.slice(0, this.layersReversed.indexOf(x) + 1)) {
      if (this.isDoingFast(i)) {
        return this.getTextForLayer(i, altered);
      }
    }
    return '';
  },
  shortButtonExplanation() {
    for (let i of this.layersReversed) {
      if (this.isDoingFast(i)) {
        return 'doing fast ' + i.slice(0, -1) + 'ies';
      }
    }
    return '';
  }
}

// Why do we have an object here rather than a standalone function? What else is it going to do?
let Cache = {
  clearDisplayCaches() {
    FastResetText.clearCache();
  }
}
