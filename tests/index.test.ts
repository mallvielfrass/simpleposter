import { expect } from 'chai';
import app from '../src/index';
import { agent as request } from 'supertest';



// describe("Index Test", () => {
//     it('should always pass', function () {
//         expect(true).to.equal(true);
//     });
// });
describe("/api", () => {

    it('/api POST GOOD', async function () {
        const res = await request(app)
            .post('/api').send();
        expect(res.status).to.equal(200);

        expect(res.body).not.to.be.empty;
        expect(res.body).to.deep.equal({ "method": "api" });

    });


});

