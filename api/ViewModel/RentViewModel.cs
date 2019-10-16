using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS.ViewModel
{
    public class RentViewModel
    {
        public long RentID { get; set; }
        public string ItemName { get; set; }
        public DateTime? RentedOn { get; set; }
        public DateTime? ReturnDate { get; set; }
        public string ProductLogo { get; set; }
        public int FranchiseId { get; set; }
        public string FranchiseName { get; set; }
        public int IssuedBy { get; set; }
        public string IssuedName { get; set; }
        public string BillNumber { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? RentTotalPrice { get; set; }
        public decimal? Discount { get; set; }
        public decimal? ReceivedAmount { get; set; }
        public decimal? BalanceAmount { get; set; }
        public Nullable<decimal> Amount { get; set; }
        public string Notes { get; set; }
        public int? CustomerId { get;set;}
        public string CouponCode { get; set; }
        public decimal? CouponValue { get; set; }
        public decimal? ShippingAmount { get; set; }
        public decimal? Security { get; set; }
        public List<RentDetailsViewModel> rentDetails { get; set; }
        public List<RentDetailslistViewModel> rentItems { get; set; }
        public string Hips { get; set; }
        public string Bust { get; set; }
        public string SkirtLength { get; set; }
        public string Waist { get; set; }
        public string SKU { get; set; }
    }

    public class RentDetailslistViewModel
    {
        public string ItemName { get; set; }
    }

    public class DateRentViewModel
    {
        public int RentId { get; set; }
        public string BillNumber { get; set; }
        public DateTime? RentedOn { get; set; }
        public DateTime? RentedDate { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Discount { get; set; }
        public decimal? BalanceAmount { get; set; }
        public decimal? LateCharges { get; set; }
        public decimal CouponValue { get; set; }
        public decimal? Security { get; set; }
        public decimal? ShippingAmount { get; set; }
        public string CustomerName { get; set; }
        public string CustomerAddress{ get; set; }
        public string Notes { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CustomerNumber { get; set; }
        public DateTime? ReturnDate { get; set; }
        public string Hips { get; set; }
        public string Bust { get; set; }
        public string SkirtLength { get; set; }
        public string Waist { get; set; }
        public List<RentDetailsViewModel> RentDetails { get; set; }
    }

    public class RentDateWiseReport
    {
        public int FranchiseId { get; set; }
        public string FranchiseName { get; set; }
        public List<RentAgentDateWiseReport> RentAgentlist { get; set; }
    }

    public class RentAgentDateWiseReport
    {
        public int? AgentId { get; set; }
        public string AgentName { get; set; }

        public List<DateRentViewModel> Rentlist { get; set; }
    }

    public class RentDateWiseReport1
    {
        public int FranchiseId { get; set; }
        public string FranchiseName { get; set; }
        public List<RentCustomerDateWiseReport> RentAgentlist { get; set; }
    }

    public class RentCustomerDateWiseReport
    {
        public int? CustomerId { get; set; }
        public string CustomerName { get; set; }
        public int? AgentId { get; set; }
        public string AgentName { get; set; }
        public List<DateRentViewModel> Rentlist { get; set; }
    }


    public class RentFranchiseViewModel
    {
        public int FranchiseId { get; set; }
        public string FranchiseName { get; set; }
        public List<RentViewModel> RentViewlist { get; set; }
    }

}
