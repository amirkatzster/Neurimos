export enum OrderStatus {
    Created = 1,
    Payed = 2,
    Verify = 3,
    Shipped = 4,
    Delivered = 5,
    Cancel = 6,
}

export class Order {
    public shoe: any;
    public imageGroup: any;
    public size: String;
    public status: OrderStatus;
    public amount: number;

    constructor() {
        this.amount = 0;
    }
}
