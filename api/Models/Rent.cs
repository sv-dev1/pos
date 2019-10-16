using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class Rent
    {
        public long RentId { get; set; }
        public long? ProductId { get; set; }
        public DateTime? RentedOn { get; set; }
        public DateTime? ReturnDate { get; set; }
        public decimal? Amount { get; set; }
        public string IsReturned { get; set; }
        public long? FranchiseId { get; set; }
        public long? IssuedBy { get; set; }
        public long? ReceivedBy { get; set; }
        public DateTime? ReceivedOn { get; set; }
        public bool? IsDamaged { get; set; }
        public decimal? DamageAdjustment { get; set; }
        public decimal? LateCharges { get; set; }
        public string BillNumber { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Discount { get; set; }
        public decimal? ReceivedAmount { get; set; }
        public decimal? BalanceAmount { get; set; }
        public decimal? RentTotalPrice { get; set; }
        public string Notes { get; set; }
        public int? CustomerId { get; set; }
        public string CouponCode { get; set; }
        public decimal? CouponValue { get; set; }
        public decimal? ShippingAmount { get; set; }
        public decimal? Security { get; set; }
        public decimal? AdditionalCharges { get; set; }
        public string Reason { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string Hips { get; set; }
        public string Bust { get; set; }
        public string SkirtLength { get; set; }
        public string Waist { get; set; }
    }
}
