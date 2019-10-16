using System;
using System.Collections.Generic;

namespace POS.Entity
{
    public partial class Product
    {
        public int ProdId { get; set; }
        public string ProductName { get; set; }
        public decimal? Price { get; set; }
        public bool? Isdeleted { get; set; }
        public DateTime? ManufacturedDate { get; set; }
        public DateTime? PackingDate { get; set; }
        public decimal? Discount { get; set; }
        public int? QtyStock { get; set; }
        public int? CategoryId { get; set; }

        public virtual Category Category { get; set; }
    }
}
