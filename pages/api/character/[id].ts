import { NextApiRequest, NextApiResponse } from 'next';
import * as HTMLParser from 'fast-html-parser';
import type { HTMLElement } from 'fast-html-parser';
import type { Character } from 'types/Character';
import db from 'lib/db';

function getProfile(character:HTMLElement) {
  const frame = character.querySelector('.frame__chara__box');
  // Checks if the title element appears before the character name
  const titleTop = frame?.childNodes[1].classNames.includes('frame__chara__title');

  const profileData = {
    face: character.querySelector('.frame__chara__face img')?.attributes.src,
    portrait: character.querySelector('.character__detail__image img')?.attributes.src,
    name: character.querySelector('.frame__chara__name')?.rawText,
    title: character.querySelector('.frame__chara__title')?.rawText,
    titleTop,
    world: character.querySelector('.frame__chara__world')?.rawText
  };

  return profileData;
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

  const [race] = raceClanGenderNode?.childNodes[1].childNodes[1].childNodes
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
  // Get Mainhand slot
  const [mainhandImageNode, , mainhandGlamourNode, mainhandItemName] = character.querySelector('.character__class__arms')?.childNodes[0].childNodes || [];

  const mainhand = {
    name: mainhandItemName?.querySelector('.db-tooltip__item__name')?.rawText,
    image: mainhandImageNode?.attributes.src,
    glamour: {
      name: mainhandGlamourNode?.querySelector('.db-tooltip__item__mirage__ic')
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
  }, { mainhand, offhand: null });

  return gearSlotItems;
}

function parseCharacterData(characterId:number, character:HTMLElement) {
  const profile = getProfile(character);
  const details = getDetails(character);
  const activeClassJob = getActiveClassJob(character);
  const gearSlots = getGearSlots(character);

  return {
    id: characterId,
    ...profile,
    ...details,
    activeClassJob,
    gearSlots,
    updatedAt: new Date().toISOString()
  };
}

async function readCharacter(characterId:number) {
  if (!characterId) throw new Error('characterId is required');

  const characterSheet = await db.character.findUnique({
    where: { id: characterId }
  });
  return characterSheet;
}

async function saveCharacter(character:Character) {
  const shouldUpdate = await db.character.findUnique({ where: { id: character.id } });

  if (shouldUpdate) {
    return db.character.update({ where: { id: character.id }, data: character });
  }

  return db.character.create({ data: character });
}

function errorMessageHandler(errorCode:number, error:object|null) {
  switch (errorCode) {
    case 404: {
      return { status: 404, message: 'Not Found' };
    }
    case 500: {
      return { status: 500, message: 'Something went wrong', error };
    }
    default: {
      return null;
    }
  }
}

export default async function characterHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.id) res.status(404).json(errorMessageHandler(404, null));

  const characterId = parseInt(req.query.id as string, 10);
  const lodestoneURL = `https://na.finalfantasyxiv.com/lodestone/character/${characterId}`;
  const characterData = await readCharacter(characterId);

  if (!characterData) {
    fetch(lodestoneURL)
      .then((response) => response.text())
      .then((content) => {
        // Parse HTML content
        const character:HTMLElement | null = HTMLParser.parse(content).querySelector('#character');
        if (!character) {
          res.status(404).json(errorMessageHandler(404, null));
        } else {
          // Scrape Character html and format into JSON
          const data:Character = parseCharacterData(characterId, character);
          saveCharacter(data)
            .catch((error) => res.status(500).json(errorMessageHandler(500, error)))
            .then(() => res.status(200).json({ status: 200, character: data }));
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(404).json(errorMessageHandler(404, null));
      });
  } else {
    res.status(200).json({ status: 200, character: characterData });
  }
}
