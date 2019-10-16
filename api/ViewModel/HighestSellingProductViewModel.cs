using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS.ViewModel
{
    public class HighestSellingProductViewModel
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public string SKU { get; set; }
        public string FranchiseName { get; set; }
        public string ProductLogo { get; set; }
    }

    public class HighestSellingProductByFranchiseViewModel
    {
        public int FranchiseId { get; set; }
        public string FranchiseName { get; set; }
        public List<HighestSellingProductViewModel> HighestSellingProductViewModellst { get; set; }
    }
}
