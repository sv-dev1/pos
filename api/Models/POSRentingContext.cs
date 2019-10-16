using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace POS.Models
{
    public partial class POSRentingContext : DbContext
    {
        public POSRentingContext()
        {
        }

        public POSRentingContext(DbContextOptions<POSRentingContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Category> Category { get; set; }
        public virtual DbSet<CounterMaster> CounterMaster { get; set; }
        public virtual DbSet<Coupon> Coupon { get; set; }
        public virtual DbSet<Customer> Customer { get; set; }
        public virtual DbSet<Franchise> Franchise { get; set; }
        public virtual DbSet<GeneralSettings> GeneralSettings { get; set; }
        public virtual DbSet<GroupItem> GroupItem { get; set; }
        public virtual DbSet<HoldOrder> HoldOrder { get; set; }
        public virtual DbSet<HoldOrderDetails> HoldOrderDetails { get; set; }
        public virtual DbSet<Inventory> Inventory { get; set; }
        public virtual DbSet<Item> Item { get; set; }
        public virtual DbSet<ItemImport> ItemImport { get; set; }
        public virtual DbSet<MasterTax> MasterTax { get; set; }
        public virtual DbSet<RateHistory> RateHistory { get; set; }
        public virtual DbSet<Rent> Rent { get; set; }
        public virtual DbSet<RentDetails> RentDetails { get; set; }
        public virtual DbSet<Sale> Sale { get; set; }
        public virtual DbSet<SaleDetails> SaleDetails { get; set; }
        public virtual DbSet<Size> Size { get; set; }
        public virtual DbSet<SupplierDetails> SupplierDetails { get; set; }
        public virtual DbSet<UnitCategory> UnitCategory { get; set; }
        public virtual DbSet<UnitMeasurement> UnitMeasurement { get; set; }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<UserRole> UserRole { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=192.168.5.92;Initial Catalog=POSRenting;Persist Security Info=False;User ID=sa;Password=data@123;Trusted_Connection=false;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.4-servicing-10062");

            modelBuilder.Entity<Category>(entity =>
            {
                entity.Property(e => e.CategoryDescription).HasMaxLength(50);

                entity.Property(e => e.CategoryName).HasMaxLength(50);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.DeletedDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<CounterMaster>(entity =>
            {
                entity.ToTable("Counter_Master");

                entity.Property(e => e.BillNumber).HasDefaultValueSql("((0))");

                entity.Property(e => e.CounterName)
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.DeletedDate).HasColumnType("datetime");

                entity.HasOne(d => d.Franchise)
                    .WithMany(p => p.CounterMaster)
                    .HasForeignKey(d => d.FranchiseId)
                    .HasConstraintName("FK_Counter_Master_Counter_Master");
            });

            modelBuilder.Entity<Coupon>(entity =>
            {
                entity.HasIndex(e => e.CouponId)
                    .HasName("IX_Coupon")
                    .IsUnique();

                entity.Property(e => e.CouponType).HasMaxLength(10);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.DeletedDate).HasColumnType("datetime");

                entity.Property(e => e.ExpirationDate).HasColumnType("datetime");

                entity.Property(e => e.ProductId).HasColumnName("ProductID");

                entity.Property(e => e.StartDate).HasColumnType("datetime");

                entity.Property(e => e.Value).HasColumnType("decimal(18, 2)");
            });

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.Property(e => e.City)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ContactName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ContactTitle)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Country)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.CustomerAddress)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerContactNo)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.DateOfBirth).HasColumnType("date");

                entity.Property(e => e.DeletedDate).HasColumnType("datetime");

                entity.Property(e => e.Fax)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.NickName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.PostalCode)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Region)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Franchise>(entity =>
            {
                entity.Property(e => e.ContactPerson).HasMaxLength(50);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.DeletedDate).HasColumnType("datetime");

                entity.Property(e => e.FranchiseCity).HasMaxLength(50);

                entity.Property(e => e.FranchiseCode).HasMaxLength(50);

                entity.Property(e => e.FranchiseCurrencySymbol).HasMaxLength(10);

                entity.Property(e => e.FranchiseEmail).HasMaxLength(50);

                entity.Property(e => e.FranchiseIsocurrencyFormat)
                    .HasColumnName("FranchiseISOCurrencyFormat")
                    .HasMaxLength(20);

                entity.Property(e => e.FranchiseName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.FranchisePhone).HasMaxLength(25);

                entity.Property(e => e.FranchisePobox)
                    .HasColumnName("FranchisePOBox")
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<GeneralSettings>(entity =>
            {
                entity.Property(e => e.CurrencyFormat).HasMaxLength(20);

                entity.Property(e => e.CurrencySymbol).HasMaxLength(10);

                entity.Property(e => e.Pobox)
                    .HasColumnName("POBox")
                    .HasMaxLength(50);

                entity.Property(e => e.StoreCode).HasMaxLength(50);

                entity.Property(e => e.StoreEmail).HasMaxLength(50);

                entity.Property(e => e.StoreName).HasMaxLength(250);

                entity.Property(e => e.StorePhone).HasMaxLength(25);
            });

            modelBuilder.Entity<GroupItem>(entity =>
            {
                entity.HasKey(e => e.ItemGroupId);

                entity.Property(e => e.Barcode).HasMaxLength(50);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.DeletedDate).HasColumnType("datetime");

                entity.Property(e => e.Discount).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.ExpirationDate).HasColumnType("date");

                entity.Property(e => e.ItemGroupName).HasMaxLength(50);

                entity.Property(e => e.ItemRentPrice).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.ItemSalePrice).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.LateCharges).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.ManufacturedDate).HasColumnType("date");

                entity.Property(e => e.PackingDate).HasColumnType("date");

                entity.Property(e => e.Security).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Sku)
                    .HasColumnName("SKU")
                    .HasMaxLength(50);

                entity.Property(e => e.Tax).HasMaxLength(50);
            });

            modelBuilder.Entity<HoldOrder>(entity =>
            {
                entity.HasKey(e => e.OrderId);

                entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Discount).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Notes).HasColumnType("ntext");

                entity.Property(e => e.OrderCode).HasMaxLength(50);

                entity.Property(e => e.OrderDate).HasColumnType("datetime");

                entity.Property(e => e.OrderName).HasMaxLength(50);

                entity.Property(e => e.RentedOn).HasColumnType("datetime");

                entity.Property(e => e.ReturnDate).HasColumnType("datetime");

                entity.Property(e => e.ShippingCharges).HasColumnType("decimal(18, 2)");
            });

            modelBuilder.Entity<HoldOrderDetails>(entity =>
            {
                entity.HasKey(e => e.OrderDetailId);

                entity.Property(e => e.Discount).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.SecurityAmount).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.SubTotal).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 2)");

                entity.HasOne(d => d.Order)
                    .WithMany(p => p.HoldOrderDetails)
                    .HasForeignKey(d => d.OrderId)
                    .HasConstraintName("FK_HoldOrderDetails_HoldOrder");
            });

            modelBuilder.Entity<Inventory>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.CurrentDate).HasColumnType("datetime");

                entity.Property(e => e.CurrentQuantity).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.DeletedDate).HasColumnType("datetime");

                entity.Property(e => e.InitialValue).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.InitialValueDate).HasColumnType("datetime");

                entity.Property(e => e.Quantity).HasColumnType("decimal(18, 2)");

                entity.HasOne(d => d.Franchise)
                    .WithMany(p => p.Inventory)
                    .HasForeignKey(d => d.FranchiseId)
                    .HasConstraintName("FK_Inventory_Franchise");

                entity.HasOne(d => d.Item)
                    .WithMany(p => p.Inventory)
                    .HasForeignKey(d => d.ItemId)
                    .HasConstraintName("FK_Inventory_Item");
            });

            modelBuilder.Entity<Item>(entity =>
            {
                entity.Property(e => e.Barcode).HasMaxLength(50);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.DeletedDate).HasColumnType("datetime");

                entity.Property(e => e.Discount).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.ExpirationDate).HasColumnType("date");

                entity.Property(e => e.ItemRentPrice).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.ItemSalePrice).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.ItemTotalPrice).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.LateCharges).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.ManufacturedDate).HasColumnType("date");

                entity.Property(e => e.PackingDate).HasColumnType("date");

                entity.Property(e => e.Security).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Sku)
                    .HasColumnName("SKU")
                    .HasMaxLength(50);

                entity.Property(e => e.Tax).HasMaxLength(50);

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Item)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Item_Category");

                entity.HasOne(d => d.Franchise)
                    .WithMany(p => p.Item)
                    .HasForeignKey(d => d.FranchiseId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Item_Franchise");

                entity.HasOne(d => d.Supplier)
                    .WithMany(p => p.Item)
                    .HasForeignKey(d => d.SupplierId)
                    .HasConstraintName("FK_Item_SupplierDetails");

                entity.HasOne(d => d.UnitCategory)
                    .WithMany(p => p.Item)
                    .HasForeignKey(d => d.UnitCategoryId)
                    .HasConstraintName("FK_Item_UnitCategory");

                entity.HasOne(d => d.UnitMeasurement)
                    .WithMany(p => p.Item)
                    .HasForeignKey(d => d.UnitMeasurementId)
                    .HasConstraintName("FK_Item_UnitMeasurement");
            });

            modelBuilder.Entity<ItemImport>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.FileName).HasMaxLength(500);

                entity.Property(e => e.SupplyName).HasMaxLength(500);
            });

            modelBuilder.Entity<MasterTax>(entity =>
            {
                entity.HasKey(e => e.TaxId);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.DeletedDate).HasColumnType("datetime");

                entity.Property(e => e.TaxName).HasMaxLength(50);

                entity.Property(e => e.TaxType).HasMaxLength(50);

                entity.Property(e => e.TaxValues).HasMaxLength(50);
            });

            modelBuilder.Entity<RateHistory>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.ApplyFrom).HasColumnType("datetime");

                entity.Property(e => e.Discount).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Mrp)
                    .HasColumnName("MRP")
                    .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<Rent>(entity =>
            {
                entity.Property(e => e.RentId).HasColumnName("RentID");

                entity.Property(e => e.AdditionalCharges).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.BalanceAmount).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.BillNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Bust).HasMaxLength(50);

                entity.Property(e => e.CouponValue).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.DamageAdjustment).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Discount).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.FranchiseId).HasColumnName("FranchiseID");

                entity.Property(e => e.Hips).HasMaxLength(50);

                entity.Property(e => e.IsReturned).HasMaxLength(10);

                entity.Property(e => e.LateCharges).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Notes).HasColumnType("ntext");

                entity.Property(e => e.ProductId).HasColumnName("ProductID");

                entity.Property(e => e.Quantity).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Reason).HasColumnType("ntext");

                entity.Property(e => e.ReceivedAmount).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.ReceivedOn).HasColumnType("datetime");

                entity.Property(e => e.RentTotalPrice).HasColumnType("decimal(10, 2)");

                entity.Property(e => e.RentedOn).HasColumnType("datetime");

                entity.Property(e => e.ReturnDate).HasColumnType("datetime");

                entity.Property(e => e.Security).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.ShippingAmount).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.SkirtLength).HasMaxLength(50);

                entity.Property(e => e.Waist).HasMaxLength(50);
            });

            modelBuilder.Entity<RentDetails>(entity =>
            {
                entity.Property(e => e.BillNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.IsReturned).HasMaxLength(10);

                entity.Property(e => e.RentedOn).HasColumnType("datetime");

                entity.Property(e => e.ReturnDate).HasColumnType("datetime");

                entity.Property(e => e.Security).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.TotalPrice).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.TotalSecurity).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 2)");
            });

            modelBuilder.Entity<Sale>(entity =>
            {
                entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.BalanceAmount).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.BillNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CouponValue).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.CreditCardNo)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CreditCardReceiptNo)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.DeletedDate).HasColumnType("datetime");

                entity.Property(e => e.Discount).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Notes).HasColumnType("ntext");

                entity.Property(e => e.PaymentCardType).HasMaxLength(500);

                entity.Property(e => e.Quantity).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.ReceivedAmount).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Remark).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.SaleDate).HasColumnType("datetime");

                entity.Property(e => e.SaleTotalPrice).HasColumnType("decimal(10, 2)");

                entity.Property(e => e.ShippingAmount).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.TotalCreditAmount).HasColumnType("decimal(18, 2)");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Sale)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_Sale_Customer");

                entity.HasOne(d => d.Franchise)
                    .WithMany(p => p.Sale)
                    .HasForeignKey(d => d.FranchiseId)
                    .HasConstraintName("FK_Sale_Franchise");
            });

            modelBuilder.Entity<SaleDetails>(entity =>
            {
                entity.Property(e => e.BillNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TotalPrice).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 2)");
            });

            modelBuilder.Entity<Size>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.DeletedDate).HasColumnType("datetime");

                entity.Property(e => e.SizeCode)
                    .IsRequired()
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.SizeName)
                    .IsRequired()
                    .HasMaxLength(250)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<SupplierDetails>(entity =>
            {
                entity.HasKey(e => e.SupplierId);

                entity.Property(e => e.Cellphone).HasMaxLength(50);

                entity.Property(e => e.CompanyName).HasMaxLength(250);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.DeletedDate).HasColumnType("datetime");

                entity.Property(e => e.Email).HasMaxLength(250);

                entity.Property(e => e.SupplierAddress).HasMaxLength(250);

                entity.Property(e => e.SupplierCity).HasMaxLength(250);

                entity.Property(e => e.SupplierContactNo).HasMaxLength(50);

                entity.Property(e => e.SupplierName).HasMaxLength(50);
            });

            modelBuilder.Entity<UnitCategory>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.DeletedDate).HasColumnType("datetime");

                entity.Property(e => e.UnitCategoryName).HasMaxLength(50);
            });

            modelBuilder.Entity<UnitMeasurement>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.DeletedDate).HasColumnType("datetime");

                entity.Property(e => e.UnitMeasurementName).HasMaxLength(50);

                entity.HasOne(d => d.UnitCategory)
                    .WithMany(p => p.UnitMeasurement)
                    .HasForeignKey(d => d.UnitCategoryId)
                    .HasConstraintName("FK_UnitCategoryUnitMeasurement");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.DeletedDate).HasColumnType("datetime");

                entity.Property(e => e.FirstName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.LastName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Password)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Franchise)
                    .WithMany(p => p.User)
                    .HasForeignKey(d => d.FranchiseId)
                    .HasConstraintName("FK_User_Franchise");
            });

            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.HasKey(e => e.RoleId);

                entity.Property(e => e.RoleName).HasMaxLength(50);
            });
        }
    }
}
