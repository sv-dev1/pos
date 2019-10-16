using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS.ViewModel
{
    public class SaleViewModel
    {
        public int SaleId { get; set; }
        public int? CustomerId { get; set; }
        public string BillNumber { get; set; }
        public DateTime? SaleDate { get; set; }
        public decimal? SaleTotalPrice { get; set; }
        public string BranchId { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Amount { get; set; }
        public decimal? Vat { get; set; }
        public decimal? Discount { get; set; }
        public bool? Status { get; set; }
        public bool? Updated { get; set; }
        public decimal? ReceivedAmount { get; set; }
        public decimal? BalanceAmount { get; set; }
        public string CreditCardReceiptNo { get; set; }
        public decimal? TotalCreditAmount { get; set; }
        public bool? RequestedbyCard { get; set; }
        public string CreditCardNo { get; set; }
        public decimal? Remark { get; set; }
        public string PaymentCardType { get; set; }
        public string Notes { get; set; }
        public int? CreatedBy { get; set; }
        public List<SaleDetailViewModel> SaleDetails { get; set; }
    }

    public class DateSaleViewModel
    {
        public int SaleId { get; set; }
        public string BillNumber { get; set; }
        public DateTime? SaleDate { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Discount { get; set; }
        public decimal? BalanceAmount { get; set; }
        public decimal CouponValue { get; set; }
        public decimal? ShippingAmount { get; set; }
        public string CustomerName { get; set; }
        public string CustomerNumber { get; set; }
        public string Notes { get; set; }
        public List<SaleDetailViewModel> SaleDetails { get; set; }
    }

    public class SaleDateWiseReport
    {
        public int FranchiseId { get; set; }
        public string FranchiseName { get; set; }
        public List<SaleAgentDateWiseReport> SaleAgentlist { get; set; }
    }

    public class SaleAgentDateWiseReport
    {
        public int? AgentId { get; set; }
        public string AgentName { get; set; }
        public List<DateSaleViewModel> Salelist { get; set; }
    }

    public class SaleDateWiseReport1
    {
        public int FranchiseId { get; set; }
        public string FranchiseName { get; set; }
        public List<SaleCustomerDateWiseReport> SaleAgentlist { get; set; }
    }

    public class SaleCustomerDateWiseReport
    {
        public int? CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }
        public List<DateSaleViewModel> Salelist { get; set; }
    }

}

