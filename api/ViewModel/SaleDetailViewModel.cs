﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS.ViewModel
{
    public class SaleDetailViewModel
    {
        public long Id { get; set; }
        public string BillNumber { get; set; }
        public int? ItemId { get; set; }
        public string ItemName { get; set; }
        public int? Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? TotalPrice { get; set; }
        public long? SaleId { get; set; }
    }
}
