using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS.ViewModel
{
    public class SupplierViewModel
    {
        public int SupplierId { get; set; }
        public string SupplierName { get; set; }
        public bool? IsActive { get; set; }
        public bool IsDelete { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime DeletedDate { get; set; }
        public int? FranchiseId { get; set; }
        public string SupplierAddress { get; set; }
        public string SupplierCity { get; set; }
        public string SupplierContactNo { get; set; }
        public string CompanyName { get; set; }
        public string Cellphone { get; set; }
        public string Email { get; set; }
    }
}
