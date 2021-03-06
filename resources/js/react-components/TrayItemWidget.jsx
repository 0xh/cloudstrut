import React from 'react';

export interface TrayItemWidgetProps {
    model: any,
        color?: string,
        name: string
}

export interface TrayItemWidgetState {}

export default class TrayItemWidget extends React.Component<TrayItemWidgetProps, TrayItemWidgetState> {
    constructor(props: TrayItemWidgetProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <li
                // style={{ background: this.props.color }}
                draggable={true}
                onDragStart={event => {
                    event.dataTransfer.setData('storm-diagram-node', JSON.stringify(this.props.model));
                }}
                className="list-group-item"
            >
                {this.props.name}
            </li>
        );
    }
}