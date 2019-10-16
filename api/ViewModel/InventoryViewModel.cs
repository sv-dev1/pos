using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS.ViewModel
{
    public class InventoryViewModel
    {
        public int InventoryId { get; set; }
        public int? ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? InitialValue { get; set; }
        public DateTime? InitialValueDate { get; set; }
        public decimal? CurrentQuantity { get; set; }
        public DateTime? CurrentDate { get; set; }
        public int? FranchiseId { get; set; }
        public string FranchiseName { get; set; }
    }
}
