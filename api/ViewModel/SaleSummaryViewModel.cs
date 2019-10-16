using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS.ViewModel
{
    public class SaleSummaryViewModel
    {
        public decimal DailySales { get; set; }
        public decimal WeeklySales { get; set; }
        public decimal MonthlySales { get; set; }
        public decimal YearlySales { get; set; }
        public decimal DailyRent { get; set; }
        public decimal WeeklyRent { get; set; }
        public decimal MonthlyRent { get; set; }
        public decimal YearlyRent { get; set; }
    }


    public class SaleSummaryMonthlyViewModel
    {
        public decimal MonthlySales { get; set; }
        public string MonthName { get; set; }
        public int MonthNumber { get; set; }
        public string FranchiseName { get; set; }
        public List<MonSalesdata> Data { get; set; }

    }
    public class MonSalesdata
    {
        public string Salesdata { get; set; }
    }

    public class SaleSummaryMonthlyvViewModel
    {
        public string FranchiseName { get; set; }
        public List<SaleSummaryMonthlyViewModel> SaleSummaryDetails { get; set; }
    }


    public class SaleSummaryFranchisesAndSalesAgent
    {
        public decimal MonthlySales { get; set; }
        public decimal MName { get; set; }
        public decimal MonthNumber { get; set; }
        public decimal FranchiseName { get; set; }
    }
}
