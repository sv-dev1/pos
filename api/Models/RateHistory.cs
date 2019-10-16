using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class RateHistory
    {
        public int Id { get; set; }
        public decimal? Mrp { get; set; }
        public decimal? UnitPrice { get; set; }
        public DateTime? ApplyFrom { get; set; }
        public decimal? Discount { get; set; }
        public int? UserId { get; set; }
        public int? ItemId { get; set; }
    }
}
