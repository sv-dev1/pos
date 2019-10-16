using System;
using System.Collections.Generic;

namespace POS.Entity
{
    public partial class Inventory
    {
        public int InventoryId { get; set; }
        public int? ProductId { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? InitialValue { get; set; }
        public DateTime? InitialValueDate { get; set; }
        public decimal? CurrentQuantity { get; set; }
        public DateTime? CurrentDate { get; set; }
        public string BranchId { get; set; }
        public bool? Updated { get; set; }
    }
}
