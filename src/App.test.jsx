import React, { Component } from "react";
import {drills, App, DrillWindow} from './App.jsx';

import { appName } from './AppNavbar.jsx';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { shallow, mount, render } from 'enzyme';

describe('Integration tests: ', () => {
  test('It displayes the app name', () => {
    const wrapper = mount(<App />);
    expect(wrapper.text()).toContain(appName);
  });
});
