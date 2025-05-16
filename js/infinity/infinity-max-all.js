let InfinityMaxAll = {
  anythingToBuy() {
    return this.anyUpgradesToBuy() || this.anyGeneratorsToBuy();
  },
  anyUpgradesToBuy() {
    return InfinityUpgrades.list.some(x => x.canBuy());
  },
  anyGeneratorsToBuy() {
    return InfinityGenerators.list.some(x => x.canBuy());
  },
  maxAll(types) {
    if (types === undefined) {
      types = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    }
    generalHighestSweep(() => InfinityGenerators.highest(), types);
    generalMaxAll(types.filter(x => x > 9).map(x => InfinityUpgrade(x - 9)), InfinityPoints);
    generalMaxAll(types.filter(x => x <= 9).map(x => InfinityGenerator(x)), InfinityPoints);
  },
  maxUpgrades() {
    this.maxAll([10, 11]);
  },
  maxGenerators() {
    this.maxAll([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  }
}
