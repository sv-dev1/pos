using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class HoldOrder
    {
        public HoldOrder()
        {
            HoldOrderDetails = new HashSet<HoldOrderDetails>();
        }

        public int OrderId { get; set; }
        public int? CustomerId { get; set; }
        public decimal? Amount { get; set; }
        public DateTime? OrderDate { get; set; }
        public string OrderCode { get; set; }
        public string OrderName { get; set; }
        public int FranchiseId { get; set; }
        public int? HoldBy { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsHold { get; set; }
        public decimal? Discount { get; set; }
        public int? DiscountType { get; set; }
        public decimal? ShippingCharges { get; set; }
        public bool? IsRent { get; set; }
        public DateTime? RentedOn { get; set; }
        public DateTime? ReturnDate { get; set; }
        public string Notes { get; set; }

        public virtual ICollection<HoldOrderDetails> HoldOrderDetails { get; set; }
    }
}
