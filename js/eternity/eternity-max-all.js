let EternityMaxAll = {
  anythingToBuy() {
    return this.anyUpgradesToBuy() || this.anyGeneratorsToBuy();
  },
  anyUpgradesToBuy() {
    return EternityUpgrades.list.some(x => x.canBuy());
  },
  anyGeneratorsToBuy() {
    return EternityGenerators.list.some(x => x.canBuy());
  },
  maxAll(types) {
    if (types === undefined) {
      types = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    }
    generalHighestSweep(() => EternityGenerators.highest(), types);
    generalMaxAll(types.filter(x => x > 9 && x <= 12).map(x => EternityUpgrade(x - 8)), EternityPoints);
    generalMaxAll(types.filter(x => x <= 9).map(x => EternityGenerator(x)), EternityPoints);
    generalMaxAll(types.filter(x => x > 12 & x <= 14).map(x => EternityProducerUpgrade(x - 11)), EternityPoints);
    for (let i of [0, 1, 2]) {
      if (types.includes(i + 15)) {
        Studies.buyMax(i);
      }
    }
    generalMaxAll(types.filter(x => x > 16).map(x => PermanenceUpgrade(x - 16)), Permanence);
  },
  maxUpgrades() {
    this.maxAll([10, 11, 12]);
  },
  maxGenerators() {
    this.maxAll([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  }
}
