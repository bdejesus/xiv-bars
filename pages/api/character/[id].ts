import { NextApiRequest, NextApiResponse } from 'next';
import { Character } from '@xivapi/nodestone';
import * as HTMLParser from 'fast-html-parser';

export default async function characterHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const characterId = req.query.id;

  // const characterSearch = new Character();

  // const character = await characterSearch.parse({ params: { characterId } } as never);

  const lodestoneURL = `https://na.finalfantasyxiv.com/lodestone/character/${characterId}`;
  fetch(lodestoneURL)
    .then((response) => response.text())
    .then((content) => {
      const character = HTMLParser.parse(content).querySelector('#character');
      const characterDetails = character.querySelector('.character__profile__data__detail');

      // Race/Clan/Gender
      const [raceClanGenderNode, namedayGuardianNode, cityStateNode, grandCompanyNode, freeCompanyNode] = characterDetails.querySelectorAll('.character-block');
      const [race, clan, gender] = raceClanGenderNode.childNodes[1].childNodes[1].childNodes
        .reduce((nodes, child) => ((child.rawText) ? [...nodes, child.rawText.replace(' / ', ',')] : nodes), [])
        .join(',').split(',');

      // Nameday
      const [, nameday, , guardian] = namedayGuardianNode.childNodes[1].childNodes.map((node) => node.rawText);

      // City-state
      const [, cityState] = cityStateNode.childNodes[1].childNodes.map((node) => node.rawText);
      const [, grandCompany] = grandCompanyNode ? grandCompanyNode.childNodes[1].childNodes.map((node) => node.rawText) : [null, null];
      const [grandCompanyName, grandCompanyRank] = grandCompany.split(' / ');
      const freeCompany = freeCompanyNode?.querySelector('.character__freecompany__name').childNodes[1].rawText;

      // ClassJob Data
      const characterClass = character.querySelector('.character__class__data');
      const classLevel = parseInt(characterClass.childNodes[0].rawText.split(' ')[1], 10);
      const classIcon = characterClass.querySelector('.character__class_icon img').attributes.src;
      const classJob = characterClass.querySelector('.character__classjob').attributes.src;

      // Gear
      const [mainhandImageNode, , mainhandGlamourNode, mainhandItemName] = character.querySelector('.character__class__arms').childNodes[0].childNodes;
      const mainhand = {
        name: mainhandItemName.querySelector('.db-tooltip__item__name').rawText,
        image: mainhandImageNode.attributes.src,
        glamour: {
          name: mainhandGlamourNode.querySelector('.db-tooltip__item__mirage__ic')
        }
      };
      const gears = character.querySelectorAll('.character__detail__icon .db-tooltip__l_main');

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

      const gearSlotItems = gears.reduce((equipment, slot, index) => ({
        ...equipment,
        [gearSlots[index]]: {
          name: slot.querySelector('.db-tooltip__item__name').rawText,
          image: slot.querySelector('.db-tooltip__item__icon img').attributes.src,
          glamour: slot.querySelector('.db-tooltip__item__mirage') ? {
            name: slot.querySelector('.db-tooltip__item__mirage p').rawText,
            image: slot.querySelector('.db-tooltip__item__mirage__ic img')?.attributes.src
          } : null
        }
      }), {});

      const data = {
        profile: {
          image: character.querySelector('.frame__chara__face img').attributes.src,
          name: character.querySelector('.frame__chara__name').rawText,
          title: character.querySelector('.frame__chara__title')?.rawText,
          world: character.querySelector('.frame__chara__world').rawText,
        },
        details: {
          race,
          clan,
          gender,
          nameday,
          guardian,
          cityState,
          grandCompanyName,
          grandCompanyRank,
          freeCompany,
        },
        activeClassJob: {
          level: classLevel,
          icon: classIcon,
          textImage: classJob
        },
        gearSlots: {
          mainhand,
          ...gearSlotItems
        }
      };

      res.status(200).json({ data });
    })
    .catch((error) => {
      console.error(error);
      res.status(404).json({ status: 'error', message: error });
    });
}
