import ava from 'ava';
import sinon from 'sinon';
import _isArray from 'lodash/isArray';
import _isEqual from 'lodash/isEqual';

import LegModel from '../../../src/assets/scripts/client/aircraft/FlightManagementSystem/LegModel';
import WaypointModel from '../../../src/assets/scripts/client/aircraft/FlightManagementSystem/WaypointModel';
import { navigationLibraryFixture } from '../../fixtures/navigationLibraryFixtures';

import { HOLD_AT_PRESENT_LOCATION } from '../_mocks/aircraftMocks';

const holdRouteSegmentMock = '@COWBY';
const directRouteSegmentMock = 'COWBY';
const cowbyFixFixture = navigationLibraryFixture.findFixByName('COWBY');
const arrivalProcedureRouteSegmentMock = 'DAG.KEPEC3.KLAS';
const departureProcedureRouteSegmentMock = 'KLAS.COWBY6.DRK';
const runwayMock = '19L';
const arrivalFlightPhaseMock = 'arrival';
const departureFlightPhaseMock = 'departure';

ava('throws when passed invalid parameters', (t) => {
    t.throws(() => new LegModel());
});

ava('does not throw when passed valid parameters', (t) => {
    t.notThrows(() => new LegModel(arrivalProcedureRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture));
    t.notThrows(() => new LegModel(directRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture));
    t.notThrows(() => new LegModel(holdRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture));
    t.notThrows(() => new LegModel(HOLD_AT_PRESENT_LOCATION.name, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture, HOLD_AT_PRESENT_LOCATION));
});

ava('#currentWaypoint returns the first item in #waypointCollection', (t) => {
    const model = new LegModel(arrivalProcedureRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture);

    t.true(_isEqual(model.waypointCollection[0], model.currentWaypoint));
});

ava('.init() calls ._buildWaypointCollection()', (t) => {
    const model = new LegModel(arrivalProcedureRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture);
    const _buildWaypointCollectionSpy = sinon.spy(model, '_buildWaypointCollection');

    model.init(arrivalProcedureRouteSegmentMock, runwayMock, arrivalFlightPhaseMock);

    t.true(_buildWaypointCollectionSpy.calledWithExactly(arrivalProcedureRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, undefined));
});

ava('.destroy() calls ._destroyWaypointCollection()', (t) => {
    const model = new LegModel(arrivalProcedureRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture);
    const _destroyWaypointCollectionSpy = sinon.spy(model, '_destroyWaypointCollection');

    model.destroy();

    t.true(_destroyWaypointCollectionSpy.calledOnce);
});

ava('.skipToWaypointAtIndex() drops n number of WaypointModels from  the left of #waypointCollection', (t) => {
    const model = new LegModel(arrivalProcedureRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture);

    model.skipToWaypointAtIndex(3);

    t.true(model.waypointCollection.length === 9);
    t.true(model.currentWaypoint.name === 'skebr');
});

ava('.getProcedureTopAltitude() returns -1 if a leg when #_isProcedure is false', (t) => {
    const model = new LegModel(directRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture);
    const result = model.getProcedureTopAltitude();

    t.true(result === -1);
});

ava('.getProcedureTopAltitude() calls `._findMinOrMaxAltitudeInProcedure()`', (t) => {
    const model = new LegModel(arrivalProcedureRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture);
    const _findMinOrMaxAltitudeInProcedureSpy = sinon.spy(model, '_findMinOrMaxAltitudeInProcedure');

    model.getProcedureTopAltitude();

    t.true(_findMinOrMaxAltitudeInProcedureSpy.calledWithExactly(true));
});

ava('.getProcedureTopAltitude() returns the largest altitudeRestriction value in the #waypointCollection when #_isProcedure is true', (t) => {
    const model = new LegModel(arrivalProcedureRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture);
    const result = model.getProcedureTopAltitude();

    t.true(result === 24000);
});

ava('.getProcedureBottomAltitude() returns -1 if a leg when #_isProcedure is false', (t) => {
    const model = new LegModel(directRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture);
    const result = model.getProcedureBottomAltitude();

    t.true(result === -1);
});

ava('.getProcedureBottomAltitude() calls `._findMinOrMaxAltitudeInProcedure()`', (t) => {
    const model = new LegModel(arrivalProcedureRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture);
    const _findMinOrMaxAltitudeInProcedureSpy = sinon.spy(model, '_findMinOrMaxAltitudeInProcedure');

    model.getProcedureBottomAltitude();

    t.true(_findMinOrMaxAltitudeInProcedureSpy.calledWithExactly(false));
});

ava('.getProcedureBottomAltitude() returns the largest altitudeRestriction value in the #waypointCollection when #_isProcedure is true', (t) => {
    const model = new LegModel(arrivalProcedureRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture);
    const result = model.getProcedureBottomAltitude();

    t.true(result === 8000);
});

ava('.hasWaypoint() returns false when a waypointName is not found within the #waypointCollection', (t) => {
    const model = new LegModel(arrivalProcedureRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture);

    t.false(model.hasWaypoint('ABC'));
});

ava('.hasWaypoint() returns true when a waypointName is found within the #waypointCollection', (t) => {
    const model = new LegModel(arrivalProcedureRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture);

    t.true(model.hasWaypoint('SUNST'));
});

ava('._buildWaypointForDirectRoute() returns an array with a single instance of a WaypointModel', (t) => {
    const model = new LegModel(directRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture);
    const result = model._buildWaypointForDirectRoute(directRouteSegmentMock);

    t.true(_isArray(result));
    t.true(result[0] instanceof WaypointModel);
    t.true(result[0].name === 'cowby');
});

ava('._buildWaypointForHoldingPattern() returns an array with a single instance of a WaypointModel with hold properties for a Fix', (t) => {
    const model = new LegModel(directRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture);
    const result = model._buildWaypointForHoldingPattern(holdRouteSegmentMock);

    t.true(_isArray(result));
    t.true(result[0] instanceof WaypointModel);
    t.true(result[0].name === 'cowby');
    t.true(result[0].altitudeRestriction === -1);
    t.true(result[0].speedRestriction === -1);
    t.true(result[0]._turnDirection === 'right');
    t.true(result[0]._legLength === '1min');
    t.true(result[0].timer === -1);
});

ava('._buildWaypointForHoldingPatternAtPosition() returns an array with a single instance of a WaypointModel with hold properties for GPS', (t) => {
    const model = new LegModel(HOLD_AT_PRESENT_LOCATION.name, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture, HOLD_AT_PRESENT_LOCATION);
    const result = model._buildWaypointForHoldingPatternAtPosition(HOLD_AT_PRESENT_LOCATION);

    t.true(_isArray(result));
    t.true(result[0] instanceof WaypointModel);
    t.true(result[0].name === 'gps');
    t.true(result[0].altitudeRestriction === -1);
    t.true(result[0].speedRestriction === -1);
    t.true(result[0]._turnDirection === 'left');
    t.true(result[0]._legLength === '3min');
    t.true(result[0].timer === -1);
});

ava('._buildWaypointForHoldingPatternAtPosition() returns the same position for a hold Waypoint at a fix vs position', (t) => {
    const model = new LegModel(HOLD_AT_PRESENT_LOCATION.name, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture, HOLD_AT_PRESENT_LOCATION);
    const fixResult = model._buildWaypointForHoldingPattern(holdRouteSegmentMock);
    const positionalHoldingProps = Object.assign(HOLD_AT_PRESENT_LOCATION, { position: cowbyFixFixture.position });
    const positionResult = model._buildWaypointForHoldingPatternAtPosition(positionalHoldingProps);

    t.true(_isEqual(fixResult[0].position.relativePosition, positionResult[0].position.relativePosition));
});

ava('._buildWaypointCollectionForProcedureRoute() returns a list of WaypointModels', (t) => {
    const model = new LegModel(arrivalProcedureRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture);
    const result = model._buildWaypointCollectionForProcedureRoute(arrivalProcedureRouteSegmentMock, runwayMock);

    t.plan(result.length);
    for (let i = 0; i < result.length; i++) {
        t.true(result[i] instanceof WaypointModel);
    }
});

ava('._buildProcedureType() returns early when #routeString is a directRouteSegment', (t) => {
    const model = new LegModel(directRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture);

    t.true(model.procedureType === '');
});

ava('._buildProcedureType() sets #procedureType as `SID` the #routeString is a procedureType and #flightPhase is departure', (t) => {
    const model = new LegModel(departureProcedureRouteSegmentMock, runwayMock, departureFlightPhaseMock, navigationLibraryFixture);

    t.true(model.procedureType === 'SID');
});

ava('._buildProcedureType() sets #procedureType as `STAR` the #routeString is a procedureType and #flightPhase is arrival', (t) => {
    const model = new LegModel(arrivalProcedureRouteSegmentMock, runwayMock, arrivalFlightPhaseMock, navigationLibraryFixture);

    t.true(model.procedureType === 'STAR');
});
