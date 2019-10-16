using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class GroupItem
    {
        public int ItemGroupId { get; set; }
        public int? ItemId { get; set; }
        public int? ItemGrpId { get; set; }
        public int? CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public int? FranchiseId { get; set; }
        public string ItemGroupName { get; set; }
        public decimal? ItemSalePrice { get; set; }
        public string Sku { get; set; }
        public string Barcode { get; set; }
        public bool? IsDeleted { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string Tax { get; set; }
        public decimal? Discount { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public bool? IsRented { get; set; }
        public decimal? ItemRentPrice { get; set; }
        public string ProductLogo { get; set; }
        public decimal? Security { get; set; }
        public decimal? LateCharges { get; set; }
        public DateTime? ManufacturedDate { get; set; }
        public DateTime? PackingDate { get; set; }
        public int? UnitCategoryId { get; set; }
        public int? UnitMeasurementId { get; set; }
        public int? QuantityStock { get; set; }
        public int? MinimumStockValue { get; set; }
    }
}
