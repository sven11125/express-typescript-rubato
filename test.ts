import test from 'ava';
import { init } from '.';
import * as supertest from 'supertest'
import { registerTests } from './src/routes/register';

export let appLoaded;

// Init App, load mongo, load config.
test.before('Init App', async t => {
    appLoaded = await init();
})

// Check API is running
test('api', async t => {
    await supertest(appLoaded)
        .get('/api/')
        .expect(200)
    t.pass();
});

registerTests()