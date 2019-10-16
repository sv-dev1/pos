using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class Inventory
    {
        public int InventoryId { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? InitialValue { get; set; }
        public DateTime? InitialValueDate { get; set; }
        public decimal? CurrentQuantity { get; set; }
        public DateTime? CurrentDate { get; set; }
        public int? FranchiseId { get; set; }
        public int? ItemId { get; set; }
        public bool? IsDeleted { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }

        public virtual Franchise Franchise { get; set; }
        public virtual Item Item { get; set; }
    }
}
