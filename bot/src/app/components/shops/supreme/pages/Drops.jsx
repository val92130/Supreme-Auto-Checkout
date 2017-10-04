import React, { Component } from 'react';
import { Link } from 'react-router';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import { Card, CardText } from 'material-ui/Card';
import Layout from '../../../../containers/Layout';
import DropsService from '../../../../../services/supreme/DropsService';

export default class Drops extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drops: {},
    };
    this.fetchDrops();
  }

  fetchDrops() {
    DropsService.fetchDrops().then(drops => this.setState({ drops }));
  }

  handleRequestClose() {
    this.setState({
      buyModalOpen: false,
    });
  }

  getDropCard(drop) {
    const style = {
      width: 200,
      minWidth: 250,
      flex: 1,
      margin: 20,
    };

    return (
      <Link to={`/supreme/drops/${drop.slug}/`} style={{ textDecoration: 'none' }}>
        <Card style={style}>
          <div style={{ textAlign: 'center' }}>
            <CardText>
              <p>{ drop.name }</p>
            </CardText>
          </div>
          <Divider />
        </Card>
      </Link>
    );
  }

  render() {
    const children = this.props.children;
    if (children) {
      return children;
    }
    const drops = this.state.drops;
    if (!drops.length) {
      return (
        <Layout>
          <div style={{ textAlign: 'center' }}>
            <p>Loading...</p>
            <CircularProgress />
          </div>
        </Layout>
      );
    }
    const cards = drops.map(x => this.getDropCard(x));
    const style = {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      flexWrap: 'wrap',
      cursor: 'pointer',
    };
    return (
      <Layout>
        <div style={style}>
          {cards}
        </div>
      </Layout>
    );
  }
}
