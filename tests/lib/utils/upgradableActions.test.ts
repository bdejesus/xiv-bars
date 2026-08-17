import { parseUpgradeRows } from 'lib/utils/upgradableActions.mjs';

describe('parseUpgradeRows', () => {
  it('parses a single upgrade', () => {
    expect(parseUpgradeRows(['Upgrades Blood Weapon to Delirium.']))
      .toEqual([{ from: 'Blood Weapon', to: 'Delirium' }]);
  });

  it('pairs up two lists joined by a single "to"', () => {
    expect(parseUpgradeRows([
      'Upgrades Flood of Darkness and Edge of Darkness to Flood of Shadow and Edge of Shadow respectively.',
      'Upgrades Fire II and Blizzard II to High Fire II and High Blizzard II.'
    ])).toEqual([
      { from: 'Flood of Darkness', to: 'Flood of Shadow' },
      { from: 'Edge of Darkness', to: 'Edge of Shadow' },
      { from: 'Fire II', to: 'High Fire II' },
      { from: 'Blizzard II', to: 'High Blizzard II' }
    ]);
  });

  it('parses a comma-separated list of discrete pairs', () => {
    expect(parseUpgradeRows([
      'Upgrades Bootshine to Leaping Opo, True Strike to Rising Raptor, Snap Punch to Pouncing Coeurl, and Elixir Field to Elixir Burst.'
    ])).toEqual([
      { from: 'Bootshine', to: 'Leaping Opo' },
      { from: 'True Strike', to: 'Rising Raptor' },
      { from: 'Snap Punch', to: 'Pouncing Coeurl' },
      { from: 'Elixir Field', to: 'Elixir Burst' }
    ]);
  });

  it('ignores potency buffs tacked onto the upgrade clause', () => {
    expect(parseUpgradeRows([
      'Upgrades Ruin to Broil and increases the potency of Ruin II to 160, and Art of War to 165.',
      'Upgrades Broil II to Broil III and the potency of Ruin II is increased to 200.',
      'Upgrades Jolt to Jolt II. Also increases the potency of Verthunder and Veraero to 360.'
    ])).toEqual([
      { from: 'Ruin', to: 'Broil' },
      { from: 'Broil II', to: 'Broil III' },
      { from: 'Jolt', to: 'Jolt II' }
    ]);
  });

  it('drops conditional replacements', () => {
    expect(parseUpgradeRows([
      'Upgrades Summon Bahamut to Summon Phoenix when Demi-Bahamut returns from summoning.',
      'Upgrades Flood of Shadow executed by your simulacrum to Shadowbringer, which delivers an attack.',
      'Upgrades Sole Survivor to Last Stand while under the effect of Grit.'
    ])).toEqual([]);
  });

  it('stops at the end of the first sentence', () => {
    expect(parseUpgradeRows([
      'Upgrades Blood of the Dragon to Life of the Dragon.Life of the Dragon Effect: Increases damage dealt by 15%.'
    ])).toEqual([{ from: 'Blood of the Dragon', to: 'Life of the Dragon' }]);
  });

  it('ignores rows that are not upgrades', () => {
    expect(parseUpgradeRows([
      'Increases the potency of Fast Blade to 220.',
      'Effect',
      ''
    ])).toEqual([]);
  });
});
