import ava from 'ava';
import _isArray from 'lodash/isArray';

import FixModel from '../../../src/assets/scripts/client/navigationLibrary/Fix/FixModel';
import PositionModel from '../../../src/assets/scripts/client/base/PositionModel';
import WaypointModel from '../../../src/assets/scripts/client/aircraft/FlightManagementSystem/WaypointModel';

import { airportPositionFixtureKSFO } from '../../fixtures/airportFixtures';
import {
    FIXNAME_MOCK,
    FIX_COORDINATE_MOCK
} from './_mocks/fixMocks';

ava('does not throw when instantiated with invalid parameters', t => {
    t.notThrows(() => new FixModel());
    t.notThrows(() => new FixModel([]));
    t.notThrows(() => new FixModel(''));
    t.notThrows(() => new FixModel(42));
    t.notThrows(() => new FixModel(false));
});

ava('returns early when instantiated with incorrect parameters', t => {
    let model;

    model = new FixModel(FIXNAME_MOCK);
    t.true(model.name === '');
    t.true(model._fixPosition === null);

    model = new FixModel(FIXNAME_MOCK, FIX_COORDINATE_MOCK);
    t.true(model.name === '');
    t.true(model._fixPosition === null);

    model = new FixModel(null, FIX_COORDINATE_MOCK, airportPositionFixtureKSFO);
    t.true(model.name === '');
    t.true(model._fixPosition === null);

    model = new FixModel(FIXNAME_MOCK, null, airportPositionFixtureKSFO);
    t.true(model.name === '');
    t.true(model._fixPosition === null);

    model = new FixModel(null, null, airportPositionFixtureKSFO);
    t.true(model.name === '');
    t.true(model._fixPosition === null);
});

ava('accepts a `fixName`, an array `fixCoordinate` and an `airportPosition` as its parameters', t => {
    const model = new FixModel(FIXNAME_MOCK, FIX_COORDINATE_MOCK, airportPositionFixtureKSFO);

    t.true(model.name === FIXNAME_MOCK);
    t.true(model._fixPosition instanceof PositionModel);
});

ava('.init() sets name in upperCase', t => {
    let model = new FixModel('uppercase', FIX_COORDINATE_MOCK, airportPositionFixtureKSFO);
    t.true(model.name === 'UPPERCASE');

    model = new FixModel('u443rcas3', FIX_COORDINATE_MOCK, airportPositionFixtureKSFO);
    t.true(model.name === 'U443RCAS3');
});

ava('.clonePosition() returns a PositionModel with the position information of the FixModel', t => {
    const model = new FixModel(FIXNAME_MOCK, FIX_COORDINATE_MOCK, airportPositionFixtureKSFO);
    const result = model.clonePosition();

    t.true(result instanceof PositionModel);
    t.true(result.latitude === result.latitude);
    t.true(result.longitude === result.longitude);
});

ava('.toWaypointModel() returns a new WaypointModel instance', (t) => {
    const model = new FixModel(FIXNAME_MOCK, FIX_COORDINATE_MOCK, airportPositionFixtureKSFO);
    const result = model.toWaypointModel();

    t.true(result instanceof WaypointModel);
    t.true(result.name === FIXNAME_MOCK.toLowerCase());
    t.true(_isArray(result.position.relativePosition));
    t.true(result.altitudeRestriction === -1);
    t.true(result.speedRestriction === -1);
});

ava('.toWaypointModel() returns a new WaypointModel instance with hold properties', (t) => {
    const model = new FixModel(FIXNAME_MOCK, FIX_COORDINATE_MOCK, airportPositionFixtureKSFO);
    const result = model.toWaypointModel(true);

    t.true(result instanceof WaypointModel);
    t.true(result.name === FIXNAME_MOCK.toLowerCase());
    t.true(_isArray(result.position.relativePosition));
    t.true(result.altitudeRestriction === -1);
    t.true(result.speedRestriction === -1);
    t.true(result._turnDirection === 'right');
    t.true(result._legLength === '1min');
    t.true(result.timer === -1);
});

ava('.toWaypointModel() returns a new WaypointModel instance with specific hold properties', (t) => {
    const model = new FixModel(FIXNAME_MOCK, FIX_COORDINATE_MOCK, airportPositionFixtureKSFO);
    const holdPropsMock = {
        turnDirection: 'right',
        legLength: '3min'
    };
    const result = model.toWaypointModel(true, holdPropsMock);

    t.true(result instanceof WaypointModel);
    t.true(result.name === FIXNAME_MOCK.toLowerCase());
    t.true(_isArray(result.position.relativePosition));
    t.true(result.altitudeRestriction === -1);
    t.true(result.speedRestriction === -1);
    t.true(result._turnDirection === holdPropsMock.turnDirection);
    t.true(result._legLength === holdPropsMock.legLength);
    t.true(result.timer === -1);
});
