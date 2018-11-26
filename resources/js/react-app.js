import * as React from "react";
import ReactDOM from 'react-dom';
import {
    DiagramWidget,
    DiagramEngine,
    DiagramModel,
    DefaultNodeModel,
    DefaultPortModel,
    DefaultNodeInstanceFactory,
    DefaultPortInstanceFactory,
    LinkInstanceFactory
} from 'storm-react-diagrams';

import CustomNodeModel from './react-components/CustomNodeModel';

require("storm-react-diagrams/dist/style.min.css");

import TrayWidget from './react-components/TrayWidget';
import TrayItemWidget from './react-components/TrayItemWidget';

class Datastrut extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.engine = new DiagramEngine();
        this.engine.installDefaultFactories();
        this.diagramModel = new DiagramModel();
        this.engine.setDiagramModel(this.diagramModel);

        axios.get('/settings/'+Spark.teamsPrefix+'/' + team + '/projects/' + project + '/getdiagram')
            .then(response => {
                if (response.data) {
                    this.diagramModel.deSerializeDiagram(response.data, this.engine);
                    this.engine.setDiagramModel(this.diagramModel);
                    this.engine.repaintCanvas();
                    this.forceUpdate();
                }
            });
    }

    updateDiagram() {
        var str = JSON.stringify(this.engine.getDiagramModel().serializeDiagram());
        axios.post('/settings/'+Spark.teamsPrefix+'/' + team + '/projects/' + project + '/updatediagram', {
            diagram: str,
        });
    }

    renderTray() {
        if (platform == 'aws') {
            return (
                <div>
                    <TrayItemWidget model={{ type: 'aws_vpc' }} name="VPC" color="maroon" />
                    <TrayItemWidget model={{ type: 'aws_subnet' }} name="Subnet" color="gold" />
                    <TrayItemWidget model={{ type: 'aws_ec2' }} name="EC2 Instance" color="grey" />
                    <TrayItemWidget model={{ type: 'aws_elb' }} name="Elastic Load Balancer" color="blue" />
                    <TrayItemWidget model={{ type: 'aws_asg' }} name="Autoscaling Group" color="orange" />
                    <TrayItemWidget model={{ type: 'aws_route53' }} name="Route53" color="purple" />
                </div>
            );
        }
    }

    onDropConfig(event) {
        var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
        var node = null;

        switch (data.type) {
            case 'aws_route53':
                node = new DefaultNodeModel('Route53', 'purple');
                node.addInPort('A');
                node.addOutPort('CNAME');
                break;

            case 'aws_vpc':
                node = new DefaultNodeModel('VPC', 'maroon');
                node.addOutPort('Subnets');
                node.addOutPort('VPN Connections');
                break;

            case 'aws_subnet':
                node = new DefaultNodeModel('Subnet', 'gold');
                node.addOutPort('Resources');
                node.addInPort('VPC');
                break;

            case 'aws_elb':
                node = new DefaultNodeModel('Elastic Load Balancer', 'blue');
                node.addOutPort('EC2 Instance');
                node.addInPort('DNS');
                node.addInPort('Subnet');
                break;

            case 'aws_asg':
                node = new DefaultNodeModel('Autoscaling Group', 'orange');
                node.addOutPort('EC2 Instance');
                break;

            case 'aws_ec2':
                node = new DefaultNodeModel('EC2 Instance', 'grey');
                node.addInPort('Scaling Group');
                node.addInPort('ELB');
                node.addInPort('VPC');
                node.addInPort('Subnet');
                node.addInPort('Security Group');
                node.addOutPort('AMI');
                node.addOutPort('Software');
                break;
        }

        var points = this.engine.getRelativeMousePoint(event);
        node.x = points.x;
        node.y = points.y;
        this.diagramModel.addNode(node);
        this.forceUpdate();
    }

    render() {
        return (
            <div className="content">
                <div className="row">
                    <div className="col-md-3 resource-palette">
                        <TrayWidget>
                            {this.renderTray()}
                        </TrayWidget>
                        <button onClick={this.updateDiagram.bind(this)}>Update diagram</button>
                    </div>

                    <div className="col-md-9 resource-diagram">
                        <div
                            className="diagram-layer"
                            onDrop={event => {
                                {this.onDropConfig(event)}
                            }}
                            onDragOver={event => {
                                event.preventDefault();
                            }}
                        >
                            <DiagramWidget diagramEngine={this.engine} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Datastrut />,
    document.getElementById('datastrut-app')
);