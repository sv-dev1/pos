using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class Item
    {
        public Item()
        {
            Inventory = new HashSet<Inventory>();
        }

        public int ItemId { get; set; }
        public int CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public int FranchiseId { get; set; }
        public string ItemName { get; set; }
        public decimal? ItemSalePrice { get; set; }
        public DateTime? ManufacturedDate { get; set; }
        public DateTime? PackingDate { get; set; }
        public decimal? Discount { get; set; }
        public int? QuantityStock { get; set; }
        public string Sku { get; set; }
        public string Barcode { get; set; }
        public string Tax { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public bool? IsDeleted { get; set; }
        public bool? IsActive { get; set; }
        public int? UnitMeasurementId { get; set; }
        public int? UnitCategoryId { get; set; }
        public bool? IsRented { get; set; }
        public decimal? ItemRentPrice { get; set; }
        public string Description { get; set; }
        public int? SupplierId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string ProductLogo { get; set; }
        public int? MinimumStockValue { get; set; }
        public decimal? Security { get; set; }
        public decimal? LateCharges { get; set; }
        public bool? IsGroup { get; set; }
        public decimal? ItemTotalPrice { get; set; }

        public virtual Category Category { get; set; }
        public virtual Franchise Franchise { get; set; }
        public virtual SupplierDetails Supplier { get; set; }
        public virtual UnitCategory UnitCategory { get; set; }
        public virtual UnitMeasurement UnitMeasurement { get; set; }
        public virtual ICollection<Inventory> Inventory { get; set; }
    }
}
