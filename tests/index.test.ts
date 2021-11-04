import { expect } from 'chai';
import app from '../src/index';
import { agent as request } from 'supertest';
import { user } from '../src/modules/user'
import { cryptographic } from '../src/modules/crypto'
import { UserSession } from '../src/modules/types'
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
describe("/api/createUser", () => {

    it('/createUser POST GOOD', async function () {
        // "status": "ok", "user": {
        //     "name": userData.name,
        //         "expired": userData.expiredDate,
        //             "uuid": userData.uuid

        // }
        let name: string = "kek";
        let password: string = "kek";
        const res = await request(app)
            .post('/api/createuser').send({ name: name, password: password });
        expect(res.status).to.equal(200);

        expect(res.body).not.to.be.empty;
        expect(res.body.status).to.equal("ok");
        expect(res.body.user.name).to.equal(name);
        expect((Date.now() < res.body.user.expired) && (res.body.user.expired < (Date.now() + 2629800))).to.equal(true);
        console.log(`test> User: ${JSON.stringify(res.body.user)}`)
    });
});
describe("/api/createPost", () => {

    it('/createPost POST GOOD', async function () {
        // "status": "ok", "user": {
        //     "name": userData.name,
        //         "expired": userData.expiredDate,
        //             "uuid": userData.uuid

        // }
        let name: string = "postman";
        let password: string = "psotman";
        let hash: string = await cryptographic.hashPassword(password);
        let userSession: UserSession = await user.register(name, hash);
        expect(userSession.name).to.equal(name);
        const res = await request(app)
            .post('/api/createpost').set('Cookie', [`name=${userSession.name}`, `uuid=${userSession.uuid}`, `expired=${userSession.expiredDate}`]).send({ "post": "newpost" });
        expect(res.status).to.equal(200);
        console.log(`test>body: ${JSON.stringify(res.body)}`)
        expect(res.body).not.to.be.empty;
        expect(res.body.status).to.equal("ok");
        // expect(res.body.user.name).to.equal(name);
        // expect((Date.now() < res.body.user.expired) && (res.body.user.expired < (Date.now() + 2629800))).to.equal(true);
        // console.log(`test> User: ${JSON.stringify(res.body.user)}`)
    });
});

