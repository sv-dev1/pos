using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class Sale
    {
        public long SaleId { get; set; }
        public int? CustomerId { get; set; }
        public string BillNumber { get; set; }
        public DateTime? SaleDate { get; set; }
        public decimal? SaleTotalPrice { get; set; }
        public int? FranchiseId { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Amount { get; set; }
        public decimal? Discount { get; set; }
        public decimal? ReceivedAmount { get; set; }
        public decimal? BalanceAmount { get; set; }
        public string CreditCardReceiptNo { get; set; }
        public decimal? TotalCreditAmount { get; set; }
        public bool? RequestedbyCard { get; set; }
        public string CreditCardNo { get; set; }
        public decimal? Remark { get; set; }
        public string PaymentCardType { get; set; }
        public string Notes { get; set; }
        public int? CreatedBy { get; set; }
        public string CouponCode { get; set; }
        public decimal? CouponValue { get; set; }
        public decimal? ShippingAmount { get; set; }
        public List<SaleDetails> SaleDetails { get; set; }
        public virtual Customer Customer { get; set; }
        public virtual Franchise Franchise { get; set; }
    }
}
