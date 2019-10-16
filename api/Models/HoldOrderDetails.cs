using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class HoldOrderDetails
    {
        public int OrderDetailId { get; set; }
        public int? OrderId { get; set; }
        public int? ItemId { get; set; }
        public decimal? UnitPrice { get; set; }
        public int? Quantity { get; set; }
        public decimal? Discount { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? SecurityAmount { get; set; }

        public virtual HoldOrder Order { get; set; }
    }
}
