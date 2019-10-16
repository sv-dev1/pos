using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class MasterTax
    {
        public int TaxId { get; set; }
        public int? FranchiseId { get; set; }
        public string TaxName { get; set; }
        public string TaxDescription { get; set; }
        public string TaxType { get; set; }
        public string TaxValues { get; set; }
        public bool? IsDeleted { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
    }
}
