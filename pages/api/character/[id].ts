import { NextApiRequest, NextApiResponse } from 'next';
import * as HTMLParser from 'fast-html-parser';
import type { HTMLElement } from 'fast-html-parser';

function getProfile(character:HTMLElement) {
  return {
    image: character.querySelector('.frame__chara__face img')?.attributes.src,
    name: character.querySelector('.frame__chara__name')?.rawText,
    title: character.querySelector('.frame__chara__title')?.rawText,
    world: character.querySelector('.frame__chara__world')?.rawText,
  };
}

function getDetails(character:HTMLElement) {
  const characterDetails = character.querySelector('.character__profile__data__detail');
  const [
    raceClanGenderNode,
    namedayGuardianNode,
    cityStateNode,
    grandCompanyNode,
    freeCompanyNode
  ] = characterDetails
    ? characterDetails.querySelectorAll('.character-block')
    : [undefined, undefined, undefined, undefined, undefined];

  const [race, clan, gender] = raceClanGenderNode?.childNodes[1].childNodes[1].childNodes
    .reduce((nodes:string[], child) => {
      if (child.rawText) return [...nodes, child.rawText.replace(' / ', ',')];
      return nodes;
    }, []).join(',').split(',') || [];

  // Nameday
  const [, nameday, , guardian] = namedayGuardianNode?.childNodes[1].childNodes
    .map((node) => node.rawText) || [];

  // City-state
  const [, cityState] = cityStateNode?.childNodes[1].childNodes.map((node) => node.rawText) || [];

  // Grand Company
  const [, grandCompany] = grandCompanyNode?.childNodes[1].childNodes.map((node) => node.rawText) || [];
  const [grandCompanyName, grandCompanyRank] = grandCompany?.split(' / ') || [];
  const freeCompany = freeCompanyNode?.querySelector('.character__freecompany__name')?.childNodes[1].rawText || undefined;

  return {
    race,
    clan,
    gender,
    nameday,
    guardian,
    cityState,
    grandCompanyName,
    grandCompanyRank,
    freeCompany,
  };
}

function getActiveClassJob(character:HTMLElement) {
  const characterClass = character.querySelector('.character__class__data');
  const classLevel = characterClass
    ? parseInt(characterClass.childNodes[0].rawText.split(' ')[1], 10)
    : undefined;
  const classIcon = characterClass?.querySelector('.character__class_icon img')?.attributes.src;
  const classJob = characterClass?.querySelector('.character__classjob')?.attributes.src;

  return {
    level: classLevel,
    icon: classIcon,
    textImage: classJob
  };
}

function getGearSlots(character:HTMLElement) {
  // Gear
  const image = character.querySelector('.character__detail__image img')?.attributes.src;

  // Get Mainhand slot
  const [mainhandImageNode, , mainhandGlamourNode, mainhandItemName] = character.querySelector('.character__class__arms')?.childNodes[0].childNodes || [];
  const mainhand = {
    name: mainhandItemName.querySelector('.db-tooltip__item__name')?.rawText,
    image: mainhandImageNode.attributes.src,
    glamour: {
      name: mainhandGlamourNode.querySelector('.db-tooltip__item__mirage__ic')
    }
  };

  // Get Slot Items
  const gear = character.querySelectorAll('.character__detail__icon .db-tooltip__l_main');

  // Define slot keys
  const gearSlots = [
    'head',
    'body',
    'hands',
    'legs',
    'feet',
    'earrings',
    'necklace',
    'bracelets',
    'ring1',
    'ring2',
    'soulstone'
  ];

  // Insert offhand if it enough items are returned
  if (gear.length > 11) gearSlots.splice(5, 0, 'offhand');

  // Format gear slot items into JSON
  const gearSlotItems = gear.reduce((equipment, slot, index) => {
    const gearSlotKey = gearSlots[index];
    const glamour = slot.querySelector('.db-tooltip__item__mirage')
      ? {
        name: slot.querySelector('.db-tooltip__item__mirage p')?.rawText,
        image: slot.querySelector('.db-tooltip__item__mirage__ic img')?.attributes.src
      }
      : null;
    const gearSlot = {
      [gearSlotKey]: {
        name: slot.querySelector('.db-tooltip__item__name')?.rawText,
        image: slot.querySelector('.db-tooltip__item__icon__item_image')?.attributes.src,
        glamour
      }
    };

    return { ...equipment, ...gearSlot };
  }, { offhand: null });

  return {
    image,
    mainhand,
    ...gearSlotItems
  };
}

export default async function characterHandler(req: NextApiRequest, res: NextApiResponse) {
  const characterId = req.query.id;
  const lodestoneURL = `https://na.finalfantasyxiv.com/lodestone/character/${characterId}`;

  fetch(lodestoneURL)
    .then((response) => response.text())
    .then((content) => {
      // Parse HTML content
      const character = HTMLParser.parse(content).querySelector('#character');

      if (!character) {
        res.status(404).json({ status: '404', message: 'Not Found' });
      } else {
        const data = {
          profile: getProfile(character),
          details: getDetails(character),
          activeClassJob: getActiveClassJob(character),
          gearSlots: getGearSlots(character)
        };

        res.status(200).json({ character: data });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(404).json({ status: '404', message: 'Not Found' });
    });
}
