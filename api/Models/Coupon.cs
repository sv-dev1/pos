using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class Coupon
    {
        public int CouponId { get; set; }
        public string CouponCode { get; set; }
        public decimal? Value { get; set; }
        public string CouponType { get; set; }
        public string ProductId { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public string Description { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public int? CreatedBy { get; set; }
        public bool? IsConsumed { get; set; }
        public int? FranchiseId { get; set; }
        public DateTime? StartDate { get; set; }
    }
}
