import React, { Component } from 'react';
import './App.css';


function City(props) {
  return (<div className="cityContainer">
            <div className="cityHeader">
              {props.city}
            </div>
            <div>
              <ul>
                <li>State: {props.state}</li>
                <li>Location: ({props.location[0]}, {props.location[1]})</li>
                <li>Population (estimated): {props.population}</li>
                <li>Total Wages: {props.totalWages}</li>
              </ul>
            </div>
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
              city = {currentCity.City}
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
        <div className="contentContainer">
          <div className="contentContainerInner">
            <div className="city">
              <ZipSearchField getZipCode={(event) => this.getZipCode(event)} 
                              getZipCodeResult={(event) => this.getZipCodeResult(event)}/>
            </div>
            <div className="city">
              { jsxResult }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
