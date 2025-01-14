import i18n from 'lib/utils/i18n.mjs';

describe('lib/utils/i18n.mjs', () => {
  describe('sanitizeName', () => {
    it('sanitizes Name strings', () => {
      const name = '<If(GreaterThan(PlayerParameter(75),0))>Action Name<Else>Not Visible</EndIf>';
      const sanitizedName = i18n.sanitizeName(name);
      expect(sanitizedName).toEqual('Action Name');
    });
  });

  describe('localizeKey', () => {
    const key = 'Name';

    it('returns a localized key', () => {
      const locale = 'ja';
      const localizedKey = i18n.localizeKey(key, locale);
      expect(localizedKey).toEqual('Name@ja');
    });

    it('handles default locale key', () => {
      const localizedKey = i18n.localizeKey(key);
      expect(localizedKey).toEqual(key);
    });
  });

  describe('localizeKeys', () => {
    it('returns all localized keys', () => {
      const key = 'Description';
      const localizedKeys = i18n.localizeKeys(key);
      expect(localizedKeys).toEqual([
        'Description',
        'Description@ja',
        'Description@de',
        'Description@fr'
      ]);
    });
  });

  describe('translateData', () => {
    const key = 'Abbreviation';
    const data = {
      Abbreviation: 'BRD',
      'Abbreviation@fr': 'BRD_FR'
    };

    it('returns the localized data key value', () => {
      const locale = 'fr';
      const translatedData = i18n.translateData(key, data, locale);
      expect(translatedData).toEqual(data['Abbreviation@fr']);
    });

    it('returns a default data key value', () => {
      const locale = 'es';
      const translatedData = i18n.translateData(key, data, locale);
      expect(translatedData).toEqual(data.Abbreviation);
    });
  });

  describe('localizePath', () => {
    const path = '/job/id/path/';

    it('returns a localized path', () => {
      const locale = 'de';
      const localizedPath = i18n.localizePath(path, locale);
      expect(localizedPath).toEqual('/de/job/id/path/');
    });

    it('handles default locale path', () => {
      const localizedPath = i18n.localizePath(path);
      expect(localizedPath).toEqual(path);
    });
  });
});
