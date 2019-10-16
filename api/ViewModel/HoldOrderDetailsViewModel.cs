using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS.ViewModel
{
    public class HoldOrderDetailsViewModel
    {
        public int HoldOrderId { get; set; }

        public int OrderId { get; set; }

        public int ItemId { get; set; }

        public string ItemName { get; set; }

        public string ItemLogo { get; set; }

        public decimal UnitPrice { get; set; }

        public int Quantity { get; set; }

        public decimal Discount { get; set; }

        public decimal SubTotal { get; set; }

        public int RemainingItem { get; set; }

        public decimal SecurityAmount { get; set; }
    }
}
