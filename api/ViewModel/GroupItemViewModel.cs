using POS.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS.ViewModel
{
    public class GroupItemViewModel
    {
        public int ItemGroupId { get; set; }
        public int? ItemGrpId { get; set; }
        public int? CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int? SubCategoryId { get; set; }
        public string SubCategoryName { get; set; }
        public int? FranchiseId { get; set; }
        public string FranchiseName { get; set; }
        public string ItemGroupName { get; set; }
        public decimal? ItemSalePrice { get; set; }
        public string Sku { get; set; }
        public string Barcode { get; set; }
        public bool? IsDeleted { get; set; }
        public bool? IsActive { get; set; }
        public int? ItemId { get; set; }
        public DateTime? ManufacturedDate { get; set; }
        public DateTime? PackingDate { get; set; }
        public string Tax { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public int? UnitMeasurementId { get; set; }
        public string UnitMeasurementName { get; set; }
        public int? UnitCategoryId { get; set; }
        public string UnitCategoryName { get; set; }
        public bool? IsRented { get; set; }
        public decimal? ItemRentPrice { get; set; }
        public string Description { get; set; }
        public string ProductLogo { get; set; }
        public decimal? security { get; set; }
        public DateTime? returnDate { get; set; }
        public decimal ItemTotalPrice { get; set; }
        public decimal? Discount { get; set; }
        public int? QuantityStock { get; set; }
        public int? MinimumStock { get; set; }
        public int? QuantityStockValue { get; set; }

    }


    public class ItemQuanityViewModel
    {
        public int ItemId { get; set; }
        public int Quantity { get; set; }
    }
   
}
