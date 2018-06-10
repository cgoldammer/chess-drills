import React, { Component } from "react";
import {drills, App, DrillWindow} from './App.jsx';
import { Button } from 'react-bootstrap';

import { appName } from './AppNavbar.jsx';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { emptyResultsFromDrill, nextIndex } from './helpers.jsx';

configure({ adapter: new Adapter() });
import { shallow, mount, render } from 'enzyme';

describe('Integration tests: ', () => {

  test('It displayes the app name', () => {
    const wrapper = mount(<App />);
    expect(wrapper.text()).toContain(appName);
  });

  test('The drill window is available only when the active set is set', () => {
    const wrapper = mount(<App />);

    expect(wrapper.find(DrillWindow)).toHaveLength(0);

    wrapper.instance().setActiveSet({value: 'endgames'});
    wrapper.update();

    expect(wrapper.find(DrillWindow)).toHaveLength(1);
  });

  test('The mounted app initiates sensibly', () => {
    const wrapper = mount(<App />);
    wrapper.instance().setActiveSet({value: 'endgames'});
    wrapper.update();
    const drillWindow = wrapper.find(DrillWindow).first();
    expect(drillWindow.props().index).not.toEqual(0);
  });

  test('If I click "next", the index changes', () => {
    const wrapper = mount(<App />);
    wrapper.instance().setActiveSet({value: 'endgames'});
    wrapper.update();
    const drillWindow = wrapper.find(DrillWindow).first();
    const initialIndex = wrapper.state().index;
    drillWindow.instance().next();
    wrapper.update();
    const newIndex = wrapper.state().index;
    expect(newIndex).not.toEqual(initialIndex);
  });

  test('If I click "show answer", the "Wrong" button becomes enabled', () => {
    const wrapper = mount(<App />);
    wrapper.instance().setActiveSet({value: 'endgames'});
    wrapper.update();
    const getWrongDisabled = wrapper => {
      const drillWindow = wrapper.find(DrillWindow).first();
      return drillWindow.find(Button).at(1).props().disabled;
    }

    expect(getWrongDisabled(wrapper)).toEqual(true);

    const drillWindow = wrapper.find(DrillWindow).first();
    drillWindow.instance().showAnswer();
    wrapper.update();

    expect(getWrongDisabled(wrapper)).toEqual(false);
  });
});

const getDummyData = () => {
  const indices = [1,2,3,4,5];
  const drills = indices.map(index => {});
  const results = drills.map(emptyResultsFromDrill);
  return { drills: drills, results: results }
}

describe('Unit tests', () => {
  describe('For the function to get the nextIndex', () => {
    test('the index never repeats', () => {
      const { drills, results } = getDummyData();
      const repeats = 10;
      var index = 0;
      for (var i=0; i<repeats; i++){
        var newIndex = nextIndex(index, drills, results);
        expect(newIndex).not.toEqual(index);
        index = newIndex;
      }
    });
  });
});

