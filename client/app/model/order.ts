

export class Order {
    public shoe: any;
    public imageGroup: any;
    public size: String;
    public amount: number;

    constructor() {
        this.amount = 0;
    }
}

// export enum Delivery {
//     SelfPick = 1,
//     Mail = 2,
//     Delivery = 3
// }

export class OrderContainer {
    public orders: Array<Order>;
    public delivery: String;

    public name: String;
    public email: String;
    public address1: String;
    public address2: String;
    public city: String;
    public zip: String;
    public phone: String;

    constructor() {
        this.orders = [];
        this.delivery = 'Mail';
    }
}
