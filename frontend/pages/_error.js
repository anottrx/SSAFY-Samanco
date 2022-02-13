import React, { Component } from 'react';
import Layout from '../components/Layout';

export default class RootError extends Component {
  render() {
    return (
      <Layout>
        <h2>요청하신 페이지가 존재하지 않습니다.</h2>
      </Layout>
    );
  }
}
