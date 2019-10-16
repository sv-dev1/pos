using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class GeneralSettings
    {
        public int Id { get; set; }
        public string StoreName { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string Pobox { get; set; }
        public string StoreCode { get; set; }
        public string StorePhone { get; set; }
        public string StoreEmail { get; set; }
        public string AdditionalDetails { get; set; }
        public string CurrencySymbol { get; set; }
        public string CurrencyFormat { get; set; }
        public int? UserId { get; set; }
    }
}
