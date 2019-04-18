/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import XIVAPI from 'xivapi-js';
import { connect } from 'react-redux';
import { storeAction } from '../../actions';
import styles from './styles.scss';

function mapDispatchToProps(dispatch) {
  return {
    storeAction: action => dispatch(storeAction(action))
  };
}

class Action extends Component {
  constructor(props) {
    super(props);
    this.api = new XIVAPI();
    this.state = {
      details: ''
    };
  }

  async getActionDetails() {
    const { action } = this.props;
    let details = await this.api.data.get('Action', action.ID);
    details = await details;
    console.log(details.Description);
    this.setState({ details });
  }

  render() {
    const { action } = this.props;
    const { details } = this.state;

    const handleDragStart = (selectedAction) => {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.storeAction({ selectedAction });
    };

    const setDescription = () => {
      if (details) {
        const description = details.Description;
        return { __html: description.trim() };
      }
      return { __html: '' };
    };

    return (
      <React.Fragment>
        <div
          className={styles.action}
          draggable
          onDragStart={() => { handleDragStart(action); }}
          onMouseOver={() => { this.getActionDetails(); }}
        >
          <img src={action.Icon} alt="" />
        </div>
        <div className={styles.tooltip}>
          <h4 className={styles.title}>{action.Name}</h4>
          <p
            className={styles.description}
            dangerouslySetInnerHTML={setDescription()}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, mapDispatchToProps)(Action);

Action.propTypes = {
  action: PropTypes.shape().isRequired,
  storeAction: PropTypes.func.isRequired
};
