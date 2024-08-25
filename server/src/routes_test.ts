import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import {save, load, list, reset, saveScores, listScores} from './routes';


describe('routes', function() {


  it('save', function() {
    // First branch, straight line code, error case (only one possible input)
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {value: ["hi", "hi"]}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "name" was missing');

    // Second branch, straight line code, error case (only one possible input)
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "A"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        'required argument "value" was missing');

    // Third branch, straight line code

    const req3 = httpMocks.createRequest({method: 'POST', url: '/save',
      body: {name: "A", value: ["hi", "hi"]}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), {replaced: false});

    const req4 = httpMocks.createRequest({method: 'POST', url: '/save',
      body: {name: "A", value: ["hi", "hi2"]}});
    const res4 = httpMocks.createResponse();
    save(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {replaced: true});

    // Called to clear all saved transcripts created in this test
    //    to not effect future tests
    reset();
  });

  it('load', function() {
    //Subdomain 3 test # 1: successful save/load
    let saveReq = httpMocks.createRequest({method: 'POST', url: '/save',
      body: {name: "key", value: ["hi", "hi2"]}});
    let saveResp = httpMocks.createResponse();
    save(saveReq, saveResp);
    let loadReq = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "key"}});
    let loadRes = httpMocks.createResponse();
    load(loadReq, loadRes);
    assert.strictEqual(loadRes._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes._getData(), {value: ["hi", "hi2"]});

    reset();

    //Subdomain 3 test # 2: successful load
    saveReq = httpMocks.createRequest({method: 'POST', url: '/save',
      body: {name: "hihi", value: ["hi", "hi3"]}});
    saveResp = httpMocks.createResponse();
    save(saveReq, saveResp);
    // Now we can actually (mock a) request to load the transcript
    loadReq = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "hihi"}});
    loadRes = httpMocks.createResponse();
    load(loadReq, loadRes);
    // Validate that both the status code and the output is as expected
    assert.strictEqual(loadRes._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes._getData(), {value: ["hi", "hi3"]});

    reset();

    //Subdomain 1: no name in query/not string:
    saveReq = httpMocks.createRequest({method: 'POST', url: '/save',
      body: {name: "hihi", value: ["hi", "hi2"]}});
    saveResp = httpMocks.createResponse();
    save(saveReq, saveResp);
    loadReq = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: undefined}});
    loadRes = httpMocks.createResponse();
    load(loadReq, loadRes);
    assert.strictEqual(loadRes._getStatusCode(), 400);

    reset();

    saveReq = httpMocks.createRequest({method: 'POST', url: '/save',
      body: {name: "hihi", value: ["hi", "hi2"]}});
    saveResp = httpMocks.createResponse();
    save(saveReq, saveResp);
    loadReq = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name:1}});
    loadRes = httpMocks.createResponse();
    load(loadReq, loadRes);
    assert.strictEqual(loadRes._getStatusCode(), 400);

    reset();


    //Subdomain 2: name not found in saved names
    saveReq = httpMocks.createRequest({method: 'POST', url: '/save',
      body: {name: "hihi", value: ["hi", "hi2"]}});
    saveResp = httpMocks.createResponse();
    save(saveReq, saveResp);
    loadReq = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "key"}});
    loadRes = httpMocks.createResponse();
    load(loadReq, loadRes);
    assert.strictEqual(loadRes._getStatusCode(), 404);

    reset();

    saveReq = httpMocks.createRequest({method: 'POST', url: '/save',
      body: {name: "hihi", value: ["hi", "hi2"]}});
    saveResp = httpMocks.createResponse();
    save(saveReq, saveResp);
    loadReq = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "aowdhaowd"}});
    loadRes = httpMocks.createResponse();
    load(loadReq, loadRes);
    assert.strictEqual(loadRes._getStatusCode(), 404);

    reset();
  });




  it('list', function() {
    //Successful list
    let saveReq = httpMocks.createRequest({method: 'POST', url: '/save',
      body: {name: "key", value: ["hi", "hi2"]}});
    let saveResp = httpMocks.createResponse();
    save(saveReq, saveResp);
    let listReq = httpMocks.createRequest();
    let listRes = httpMocks.createResponse();
    list(listReq, listRes);
    assert.strictEqual(listRes._getStatusCode(), 200);
    assert.deepStrictEqual(listRes._getData(), {keys: ["key"]});

    saveReq = httpMocks.createRequest({method: 'POST', url: '/save',
    body: {name: "hi", value: ["hi", "hi2"]}});
    saveResp = httpMocks.createResponse();
    save(saveReq, saveResp);

    listReq = httpMocks.createRequest();
    listRes = httpMocks.createResponse();
    list(listReq, listRes);
    assert.strictEqual(listRes._getStatusCode(), 200);
    assert.deepStrictEqual(listRes._getData(), {keys: ["key", "hi"]});

  });



  it('saveScores', function() {

    //Missing Value / not string

    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/saveScores', body: {value:1}});
    const res1 = httpMocks.createResponse();
    saveScores(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "value" was missing');
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/saveScores', body: {}});
    const res2 = httpMocks.createResponse();
    saveScores(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        'required argument "value" was missing');

    //Success
    const req3 = httpMocks.createRequest({method: 'POST', url: '/saveScores',
      body: {value: "hi"}});
    const res3 = httpMocks.createResponse();
    saveScores(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);

    const req4 = httpMocks.createRequest({method: 'POST', url: '/saveScores',
      body: {name: "A", value: "hi"}});
    const res4 = httpMocks.createResponse();
    saveScores(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 200);

    reset();
  });

  it('listScores', function() {
    //Successful list
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/saveScores', body: {value: "hi"}});
    const res2 = httpMocks.createResponse();
    saveScores(req2, res2);

    let listReq = httpMocks.createRequest();
    let listRes = httpMocks.createResponse();
    listScores(listReq, listRes);
    assert.strictEqual(listRes._getStatusCode(), 200);
    assert.deepStrictEqual(listRes._getData(), {keys: ["hi"]});

    const req4 = httpMocks.createRequest({method: 'POST', url: '/saveScores',
      body: { value: "hihi"}});
    const res4 = httpMocks.createResponse();
    saveScores(req4, res4);

    listScores(listReq, listRes);
    assert.strictEqual(listRes._getStatusCode(), 200);
    assert.deepStrictEqual(listRes._getData(), {keys: ["hi", "hihi"]});
  });
});
