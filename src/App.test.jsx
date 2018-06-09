import React, { Component } from "react";
import {drills, App, DrillWindow} from './App.jsx';

import { appName } from './AppNavbar.jsx';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { emptyDrill, nextIndex } from './helpers.jsx';

configure({ adapter: new Adapter() });
import { shallow, mount, render } from 'enzyme';

describe('Integration tests: ', () => {
  test('It displayes the app name', () => {
    const wrapper = mount(<App />);
    expect(wrapper.text()).toContain(appName);
  });
});

const getDummyData = () => {
  const indices = [1,2,3,4,5];
  const drills = indices.map(index => {});
  const results = drills.map(emptyDrill);
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

