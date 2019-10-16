using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS.ViewModel
{
    public class ItemImportViewModel
    {
        public int Id { get; set; }
        public long? FranchiseId { get; set; }
        public string FranchiseName { get; set; }
        public string CreatedName { get; set; }
        public long? CreatedBy { get; set; }
        public string SupplyName { get; set; }
        public string SupplierName { get; set; }
        public long? SupplierId { get; set; }
        public string FileName { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
