import React, { Component } from 'react';
import Group from './Group';
import styles from './styles.scss';

class Xbar extends Component {
  render() {
    const { bar, id } = this.props;
    return(
      <div className={styles.xbar}>
        {Object.keys(bar).map((group) => {
          return (
            <Group 
              slots={bar[group]} 
              key={`${id}-${group}`} 
              id={`${id}-${group}`}  
            />
          )
        })}
      </div>
    )
  }
}

export default Xbar;
