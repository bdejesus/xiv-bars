import React, { Component } from 'react';
import styles from './styles.scss';

class Slot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props
    }
  }

  handleClick(e) {
    this.setState( state => ({value: {name: 'clicked'}}) )
  }

  render() {
    const { value } = this.state;

    const getTitle = () => {
      if (value) {
        return value.name;
      } else {
        return '';
      };
    }

    return (
      <div 
        className={styles.slot}
        title={getTitle()}
        onClick={(e) => this.handleClick(e)}
      > 
        {value.name}
      </div>
    )
  }
}

export default Slot;
