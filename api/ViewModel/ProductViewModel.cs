using POS.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS.Model
{
    public class ItemsProductViewModel
    {
        public int ItemId { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int? SubCategoryId { get; set; }
        public string SubCategoryName { get; set; }
        public int FranchiseId { get; set; }
        public string FranchiseName { get; set; }
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
        public string UnitMeasurementName { get; set; }
        public int? UnitCategoryId { get; set; }
        public string UnitCategoryName { get; set; }
        public bool? IsRented { get; set; }
        public decimal? ItemRentPrice { get; set; }
        public string Description { get; set; }
        public int? SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string ProductLogo { get; set; }
        public int? MinimumStock { get; set; }
        public decimal? security { get; set; }
        public DateTime? returnDate { get; set; }
        public decimal? ItemTotalPrice { get; set; }
        public bool? IsGroup { get; set; }
        public decimal? LateCharges { get; set; }
        public List<GroupItemViewModel> GroupItemViewModelList { get; set; }
    }


    public class GetInventoryViewModel
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public int? QuantityStock { get; set; }
        public int? MinimumStockValue { get; set; }
        public string SKU { get; set; }
        public string UnitCategoryName { get; set; }
        public string UnitMeasurementName { get; set; }
        public string IsReturned { get; set; }
        public int TotalQuantity { get; set; }
        public int RentedQuantityStock { get; set; }
    }


    public class GetInventoryRentViewModel
    {
        public int FranchiseId { get; set; }
        public string FranchiseName { get; set; }
        public List<GetInventoryViewModel> InventoryRentList { get; set; }
    }


    public class GetInventorySaleViewModel
    {
        public int FranchiseId { get; set; }
        public string FranchiseName { get; set; }
        public List<GetInventoryViewModel> InventorySaleList { get; set; }
    }

    public class ExcelUploadViewModel
    {
        public int franchiseId { get; set; }
    }


    public class GetInventoryCustomerViewModel
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public string SKU { get; set; }
        public string UnitCategoryName { get; set; }
        public string UnitMeasurementName { get; set; }
        public decimal? Amount { get; set; }
        public decimal? Discount { get; set; }
        public decimal? LateCharges { get; set; }
    }

    public class ItemsProductViewModelList
    {
        public int FranchiseId { get; set; }
        public string FranchiseName { get; set; }
        public List<ItemsProductViewModel> ItemsViewlist { get; set; }
    }
}
