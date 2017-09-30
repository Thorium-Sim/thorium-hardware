/**
 * Pulsing LED example.
 * Insert an LED into Pin 9 and run this example.
 */
import Raspi from 'raspi-io';
import React, {Component} from 'react';
import ReactHardware from 'react-hardware';

import five from 'johnny-five';

class BlinkingLed extends Component {
  static defaultProps = {
    port: 21,
    period: 500,
  };

  componentDidMount() {
    this.node = new five.Led(this.props.port);
    this.node.blink(this.props.period);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.period !== nextProps.period) {
      this.node.blink(nextProps.period);
    }
  }


  render() {
    return null;
  }
}

ReactHardware.render(
  <BlinkingLed port={"GPIO21"} period={500} />,
  new five.Board({
    io: new Raspi(),
    repl: false,
  }),
  (inst) => {
    console.log('Rendered <%s />', BlinkingLed.name);
  }
);
