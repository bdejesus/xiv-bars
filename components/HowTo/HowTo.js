import I18n from 'lib/I18n/locale/en-US';

function HowTo() {
  return (
    <div className="section">
      <h2>{I18n.HowTo.how_to_use_this}</h2>
      <p>{I18n.HowTo.body}</p>

      <ol>
        <li>
          <h3>{I18n.HowTo.select_a_class}</h3>
          <p>{I18n.HowTo.plan_your_hotbars}</p>
        </li>

        <li>
          <h3>{I18n.HowTo.toggle_hotbars}</h3>
          <p>{I18n.HowTo.simulate_hotbars}</p>
        </li>

        <li>
          <h3>{I18n.HowTo.drag_and_drop}</h3>
          <p>{I18n.HowTo.slot_actions}</p>
        </li>

        <li>
          <h3>{I18n.HowTo.export_to_macro}</h3>
          <p>{I18n.HowTo.save_and_share}</p>
        </li>
      </ol>
    </div>
  );
}

export default HowTo;
