/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import XIVAPI from 'xivapi-js';
import { storeAction, updateTooltip } from '../../actions';
import styles from './styles.scss';

function mapDispatchToProps(dispatch) {
  return {
    storeAction: action => dispatch(storeAction(action)),
    updateTooltip: action => dispatch(updateTooltip(action))
  };
}

const api = new XIVAPI();

class Action extends Component {
  constructor(props) {
    super(props);

    this.el = React.createRef();
  }

  async showTooltip(action, event) {
    const content = await api.data.get('Action', action.ID);
    const elRect = this.el.current.getBoundingClientRect();
    const position = {
      left: elRect.left,
      right: elRect.left + elRect.width,
      top: elRect.top,
      bottom: elRect.top + elRect.height
    };

    const details = {
      content,
      position
    };

    // eslint-disable-next-line react/destructuring-assignment
    this.props.updateTooltip({ event, details });
  }

  handleMouseEnter(action, event) {
    this.showTooltip(action, event);
  }

  handleMouseLeave() {
    this.hideTooltip();
  }

  hideTooltip() {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.updateTooltip({ event: null, details: null });
  }

  render() {
    const { action } = this.props;

    const handleDragStart = (selectedAction) => {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.storeAction({ selectedAction });
    };

    return (
      <React.Fragment>
        <div
          className={styles.action}
          draggable
          onDragStart={() => { handleDragStart(action); }}
          onMouseEnter={(event) => { this.handleMouseEnter(action, event); }}
          onMouseLeave={() => { this.handleMouseLeave(); }}
          ref={this.el}
        >
          <img src={action.Icon} alt="" />
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, mapDispatchToProps)(Action);

Action.propTypes = {
  action: PropTypes.shape().isRequired,
  storeAction: PropTypes.func.isRequired,
  updateTooltip: PropTypes.func.isRequired
};

// onMouseOver
// > Get and store ActionData
// > Show tooltip
// mouseout
// > Hide tooltip
