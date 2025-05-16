let ComplexityMaxAll = {
  anythingToBuy() {
    return ComplexityGenerators.list.some(x => x.canBuy());
  },
  maxAll(types) {
    if (types === undefined) {
      types = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
    generalHighestSweep(() => ComplexityGenerators.highest(), types);
    generalMaxAll(types.filter(x => x <= 9).map(x => ComplexityGenerator(x)), ComplexityPoints);
    generalMaxAll(types.filter(x => x > 9 && x <= 12).map(x => PowerUpgrade(x - 8)), ComplexityPoints);
    generalMaxAll(types.filter(x => x > 12).map(x => PowerShardUpgrade(x - 11)), PowerShards);
  },
  maxUpgrades() {
    this.maxAll([10, 11, 12]);
  },
  maxGenerators() {
    this.maxAll([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  }
}
