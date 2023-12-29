import { NextApiRequest, NextApiResponse } from 'next';
import * as HTMLParser from 'fast-html-parser';

export default async function characterHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
        // Get Profile
        const profile = {
          image: character.querySelector('.frame__chara__face img')?.attributes.src,
          name: character.querySelector('.frame__chara__name')?.rawText,
          title: character.querySelector('.frame__chara__title')?.rawText,
          world: character.querySelector('.frame__chara__world')?.rawText,
        };

        // Get character details
        // Race/Clan/Gender
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

        // ClassJob Data
        const characterClass = character.querySelector('.character__class__data');
        const classLevel = characterClass
          ? parseInt(characterClass.childNodes[0].rawText.split(' ')[1], 10)
          : undefined;
        const classIcon = characterClass?.querySelector('.character__class_icon img')?.attributes.src;
        const classJob = characterClass?.querySelector('.character__classjob')?.attributes.src;

        // Gear
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
              image: slot.querySelector('.db-tooltip__item__icon img')?.attributes.src,
              glamour
            }
          };

          return { ...equipment, ...gearSlot };
        }, { offhand: null });

        const data = {
          profile,
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
          gearSlotsKeys: gearSlots,
          gear,
          gearSlots: {
            image: character.querySelector('.character__detail__image img')?.attributes.src,
            mainhand,
            ...gearSlotItems
          }
        };

        res.status(200).json({ data });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(404).json({ status: 'error', message: error });
    });
}
