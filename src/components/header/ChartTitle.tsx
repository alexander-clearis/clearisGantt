import { Component, createElement } from "react";


interface HeaderTitleProps {
  title: string;
}

export class ChartTitle extends Component<HeaderTitleProps> {

  render() {
    return <h2 className="d-inline-block">{this.props.title}</h2>;
  }
}