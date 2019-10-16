import { rentdetails } from './rentdetails';

export class rent {
    RentId: Int16Array;
    ProductId: Int16Array;
    RentedOn: Date;
    ReturnDate: Date;
    Amount: number;
    IsReturned: string;
    FranchiseId: Int16Array;
    IssuedBy: Int16Array;
    ReceivedBy: Int16Array;
    ReceivedOn: Date;
    RentTotalPrice: number;
    BillNumber: String;
    Quantity: number;
    Discount: number;
    ReceivedAmount: number;
    BalanceAmount: number;
    Notes: string;
    CouponCode: string;
    CouponValue: number;
    CustomerId: Int16Array;
    Security: number;
    ShippingAmount: number;
    rentDetails: rentdetails[];
}