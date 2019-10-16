using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class RentDetails
    {
        public long Id { get; set; }
        public string BillNumber { get; set; }
        public int? ItemId { get; set; }
        public int? Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? TotalPrice { get; set; }
        public long? RentId { get; set; }
        public DateTime? RentedOn { get; set; }
        public DateTime? ReturnDate { get; set; }
        public string IsReturned { get; set; }
        public decimal? Security { get; set; }
        public decimal? TotalSecurity { get; set; }
    }
}
