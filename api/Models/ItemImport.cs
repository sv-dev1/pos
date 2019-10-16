using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class ItemImport
    {
        public int Id { get; set; }
        public long? FranchiseId { get; set; }
        public long? CreatedBy { get; set; }
        public string SupplyName { get; set; }
        public long? SupplierId { get; set; }
        public string FileName { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
