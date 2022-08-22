/* eslint-disable max-len */
import I18n from 'lib/I18n/locale/en-US';

export function Articles() {
  return (
    <div className="container">
      <h2>{I18n.Articles.guides}</h2>

      <div className="mt-md">
        <h3>
          <a href="https://josebenedicto.com/ffxiv/cross-hotbar-settings--auto-switching-for-battle">
            {I18n.Articles.configure_the_ui}
          </a>
        </h3>

        <p>{I18n.Articles.how_to_configure}</p>

        <p>{I18n.Articles.controller_mode}</p>

        <p>
          <a href="https://josebenedicto.com/ffxiv/cross-hotbar-settings--auto-switching-for-battle">
            {I18n.Articles.read_more}
          </a>
        </p>
      </div>
    </div>
  );
}

export default Articles;
