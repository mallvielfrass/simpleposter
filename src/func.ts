import express from 'express'

export function welcome(req: express.Request, w: express.Response) {
    w.send("welcome");
}

export function jsonType(req: express.Request, w: express.Response) {
    let item: BaseItem = {
        name: "test",
        price: 234
    }
    w.json(item);
}
export interface BaseItem {
    name: string;
    price: number;
    description?: string;
    image?: string;
}

export default welcome;