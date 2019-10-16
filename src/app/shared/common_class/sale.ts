import { saledetails } from './saledetails';

export class sale
{
    BillNumber: String;
    SaleDate: Date;
    SaleTotalPrice: number;
    Amount: number;
    ReceivedAmount: number;
    BalanceAmount: number;
    Quantity: number;
    PaymentCardType: string;
    Discount: number;
    CustomerId: Int16Array;
    FranchiseId: Int16Array;
    Notes: string;
    CouponCode: string;
    CouponValue: number;
    saledetails: saledetails[];
    CreatedBy: Int16Array;
    ShippingAmount: number;
}