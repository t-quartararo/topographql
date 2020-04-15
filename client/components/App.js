import React from 'react';
import { getIntrospectionQuery } from 'graphql';
import * as d3 from 'd3';
import TraceDisplay from './TraceDisplay';
import ControlPanelContainer from './ControlPanelContainer';
import VisualizerContainer from './VisualizerContainer';
import Header from './Header';
import drawNetworkGraph from './utilities/drawNetworkGraph';
import { drawTracerGraph, convertTraceData } from './utilities/drawTracerGraph';
import QueryResult from './QueryResult';
import { highlightQuery } from './utilities/highlighterFunction.js';


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      endpoint: '', // user's GraphQL endpoint
      query: '', // user's query string
      querydata: {}, // query results retrieved from server 
      schema: {}, // introspected schema 
      d3introspectdata: {}, // d3 file for introspected schema
      d3querydata: {}, // d3 info for query data
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmitEndpoint = this.onSubmitEndpoint.bind(this);
    this.onChangeQuery = this.onChangeQuery.bind(this);
    this.onSubmitQuery = this.onSubmitQuery.bind(this);
  }

  // onchange handler for endpoint input
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  // onChange handler for CodeMirror
  onChangeQuery(text) {
    this.setState({ query: text });
  }

  onSubmitEndpoint(e) {
    e.preventDefault();
    // clears previous query and query results from state
    this.setState({query: {}, querydata: {}});
    fetch('/gql/getschema', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: this.state.endpoint }),
    })
      .then((res) => res.json())
      .then((data) => {
        // set state, delete previous svg and draw new svg passing in data
        this.setState({ schema: data.schema, d3introspectdata: data.d3json });
        d3.select('#svg-network').remove();
        drawNetworkGraph(this.state.d3introspectdata);   
      });
  }

  onSubmitQuery(e) {
    e.preventDefault();
    const resetSchema = this.state.d3introspectdata;
    resetSchema.links.forEach((element) => {
      element.highlighted = false;
    });

    fetch(this.state.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({"query": this.state.query })
    })
      .then((res) => res.json())
      // stores the original result from posting a query into state
      .then((querydata) => this.setState({ querydata }))
      .then((res) => {
        const converted = convertTraceData(this.state.querydata);
        d3.select('#svg-trace').remove();
        drawTracerGraph(converted);
      })
      .then(data => {
        fetch('/gql/getquery', {
          method: "Post",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.state.querydata),
        })
          .then(res => res.json())
          // store the d3 file of the query results into state
          .then(data => {
            this.setState({ d3querydata: data });
          })
          // Updates d3 schema data with highlighted: true attributes based on query results
          .then(() => {
            const schemaCopy = this.state.d3introspectdata;
            const queryPath = this.state.d3querydata;
            const highlightedSchema = highlightQuery(schemaCopy, queryPath);
            this.setState({ d3introspectdata: highlightedSchema });
            d3.select('#svg-network').remove();
            drawNetworkGraph(this.state.d3introspectdata);
          });
      });
  }

  render() {
    return (
      <div>
        <Header
          onChange={this.onChange}
          onSubmitEndpoint={this.onSubmitEndpoint}
        />
        <div id='flex-wrapper-1'>
          <ControlPanelContainer
            onChange={this.onChange}
            onSubmitQuery={this.onSubmitQuery}
            onChangeQuery={this.onChangeQuery}
            query={this.state.query}
            schema={this.state.schema}
          />
          <div id="flex-wrapper-2">
            <QueryResult result={JSON.stringify(this.state.querydata.data)}/>
            <VisualizerContainer
              d3introspectdata={ this.state.d3introspectdata }
            />
            <TraceDisplay />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
