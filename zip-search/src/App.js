import React, { Component } from 'react';
import './App.css';


function City(props) {
  return (<div>
            {props.state}<br/>
            {props.location}<br/>
            {props.population}<br/>
            {props.totalWages}<br/><br/>
          </div>
  );
}

function ZipSearchField(props) {
  return (<div>
            <label>Zip Code: </label>
            <input type="text" onChange={(event) => props.getZipCode(event)}></input>
            <button onClick={(event) => props.getZipCodeResult(event)}>Click Here!</button>
          </div>
  );
}


class App extends Component {

  state = {
    zipcode: "",
    cities: {}
  }

  getZipCode(event) {
    let zipCode = event.target.value;
    this.setState({
      zipcode: zipCode
    });
  }

  getZipCodeResult(event) { 
    if (this.state.zipcode.length < 5) {
      this.setState({
        cities: {}
      });
      return;
    }
    let url = `http://ctp-zip-api.herokuapp.com/zip/` + this.state.zipcode;
    fetch(url)
      .then(response => response.json())
      .then(jsonData => {
        this.setState({
          cities: jsonData
        });
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    let jsxResult = [];
    for(let i = 0; i < this.state.cities.length; i++){
      let currentCity = this.state.cities[i];
      jsxResult.push(
        <City key = {i} 
              state = {currentCity.State}
              location = {[currentCity.Lat, currentCity.Long]}
              population = {currentCity.EstimatedPopulation}
              totalWages = {currentCity.TotalWages}
        />
      );
    }
    if (jsxResult.length === 0) {
      jsxResult.push(
        <div key={jsxResult.length}>No Results...</div>
      );
    }
    return (
      <div className="App">
        <div className="App-header">
          <h2>Zip Code Search</h2>
        </div>
        <div className="city">
          <ZipSearchField getZipCode={(event) => this.getZipCode(event)} 
                          getZipCodeResult={(event) => this.getZipCodeResult(event)}/>
        </div>
        <div className="city">
          { jsxResult }
        </div>
      </div>
    );
  }
}

export default App;
