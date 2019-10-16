using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS.ViewModel
{
    public class TaxViewModel
    {
        public int TaxId { get; set; }
        public string TaxName { get; set; }
        public string TaxDescription { get; set; }
        public string TaxType { get; set; }
        public string TaxValues { get; set; }
        public int FranchiseId { get; set; }
        public string FranchiseName { get; set; }
        public bool? IsActive { get; set; }
    }
}
