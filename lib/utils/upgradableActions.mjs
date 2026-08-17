import * as HTMLParser from 'fast-html-parser';

// Extracts `{ from, to }` pairs from the "Upgrades <action> to <action>" text
// in a job's wiki traits table.
//
// The `to` name is what matters: some traits only swap an action out
// conditionally (DRK's Enhanced Delirium reads "Upgrades Bloodspiller and
// Quietus to Scarlet Delirium and Impalement respectively", but only while
// Delirium is active). Recording the replacement lets the action list check
// that it actually exists before hiding the original.
//
// Parsing is deliberately fail-safe: a row we mis-read yields a name that
// matches no action, so nothing gets hidden.

const UPGRADE_ROW = /^Upgrades /;
const CONDITIONAL = /\bwhen\b|executed by|while under|is upgraded/;
const SEPARATOR = /,\s*and\s+|,\s*|\s+and\s+/;
// Traits often tack a potency buff onto the upgrade clause: "Upgrades Ruin to
// Broil and increases the potency of Ruin II to 160". Everything from there on
// is numbers, not actions.
const POTENCY_TAIL = /\s+and\s+(?:also\s+)?increases the|\s+and\s+the potency of|\s+increases the potency of/i;

// Only the first sentence describes the upgrade; the rest is effect text
// ("Also increases…", "Duration: 20s").
function firstSentence(text) {
  return text.split(/\.(?:\s|$|[A-Z])/)[0].replace(/\.$/, '').trim();
}

function clean(name) {
  return name.replace(/\s+/g, ' ').replace(/[.,]$/, '').trim();
}

function parseClause(clause) {
  const segments = clause.replace(/\s+respectively$/, '').split(' to ');
  if (segments.length < 2) return [];

  // A single "to" joining two lists pairs them up by position:
  // "Upgrades Fire II and Blizzard II to High Fire II and High Blizzard II".
  if (segments.length === 2) {
    const sources = segments[0].split(' and ').map(clean);
    const targets = segments[1].split(' and ').map(clean);
    return sources.map((from, index) => ({ from, to: targets[index] ?? targets[0] }));
  }

  // Otherwise it is a list of discrete pairs: "Upgrades Bootshine to Leaping
  // Opo, True Strike to Rising Raptor, and Snap Punch to Pouncing Coeurl".
  return clause
    .split(SEPARATOR)
    .filter((part) => part.includes(' to '))
    .map((part) => {
      const [from, ...rest] = part.split(' to ');
      return { from: clean(from), to: clean(rest.join(' to ')) };
    });
}

export function parseUpgradeRows(rows) {
  return rows
    .map((row) => firstSentence(row.trim()))
    .filter((row) => UPGRADE_ROW.test(row) && !CONDITIONAL.test(row))
    .flatMap((row) => parseClause(row.replace(UPGRADE_ROW, '').split(POTENCY_TAIL)[0]))
    .filter(({ from, to }) => from && to && !/^\d+$/.test(to));
}

// The traits table is identified by its header rather than a class name — the
// wiki has renamed those before, and picking the wrong table pulls in action
// descriptions, which describe conditional swaps the same way traits do.
export function traitRows(html) {
  const traitsTable = HTMLParser.parse(html)
    .querySelectorAll('table')
    .find((table) => /\bTraits?\b/.test(table.querySelectorAll('tr')[0]?.text ?? ''));

  if (!traitsTable) return [];

  return traitsTable.querySelectorAll('tr').map((row) => {
    const cells = row.querySelectorAll('td');
    return (cells.length ? cells[cells.length - 1] : row.lastChild)?.text ?? '';
  });
}

export default parseUpgradeRows;
