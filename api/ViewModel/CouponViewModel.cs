using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS.ViewModel
{
    public class CouponViewModel
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
        public int FranchiseId { get; set; }
        public DateTime? StartDate { get; set; }
    }

    public class CouponItemviewModel
    {
        public string CouponCode { get; set; }
        public string ProductId { get; set; }
    }

}
