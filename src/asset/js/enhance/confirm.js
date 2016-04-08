import React from 'react';
import assign from 'lodash/object/assign';

export var ConfirmEnhance = ComposedComponent => class extends React.Component {
  static displayName = 'ComponentEnhancedWithConfirmAction';

  static defaultProps = {
    confirm: () => {},
    cancel: () => {}
  };

  state = {};

  constructor(props) {
    super(props);
  }

  show(states) {
    this.setState(assign({
      on: true
    }, states || {}));
  }

  close() {
    this.setState({
      on: false
    });
  }

  cancel() {
    this.props.cancel();
    this.close();
  }

  confirm(...args) {
    this.props.confirm.apply(this, args);
    this.close();
  }

  render() {
    return (
      <ComposedComponent
        {...this.props}
        {...this.state}
        show={this.show.bind(this)}
        close={this.close.bind(this)}
        cancel={this.cancel.bind(this)}
        confirm={this.confirm.bind(this)}
      />
    );
  }
}
