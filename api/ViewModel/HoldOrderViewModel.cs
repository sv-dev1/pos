using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS.ViewModel
{
    public class HoldOrderViewModel
    {
        public int OrderId { get; set; }

        public int CustomerId { get; set; }
        public string CustomerNumber { get; set; }

        public decimal Amount { get; set; }

        public DateTime OrderDate { get; set; }

        public string OrderCode { get; set; }

        public string OrderName { get; set; }

        public int FranchiseId { get; set; }

        public int HoldBy { get; set; }

        public bool IsActive { get; set; }

        public bool IsHold { get; set; }

        public decimal Discount { get; set; }

        public int DiscountType { get; set; }

        public decimal ShippingCharges { get; set; }
        public bool IsRent { get; set; }

        public DateTime? RentedOn { get; set; }
        public DateTime? ReturnDate { get; set; }
        public string Notes { get; set; }

        public List<HoldOrderDetailsViewModel> HoldOrderDetailList { get; set; }
    }
}
