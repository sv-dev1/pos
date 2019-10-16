using POS.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS.Model
{
    public class FranchiseViewModel
    {
        public int FranchiseId { get; set; }
        public string FranchiseName { get; set; }
        public string FranchiseAddress { get; set; }
        public string FranchisePhone { get; set; }
        public string FranchiseCode { get; set; }
        public string FranchiseEmail { get; set; }
        public string FranchisePobox { get; set; }
        public string FranchiseAdditionalDetails { get; set; }
        public string FranchiseCurrencySymbol { get; set; }
        public string FranchiseIsocurrencyFormat { get; set; }
        public string FranchiseCity { get; set; }
        public string FranchiseAddress2 { get; set; }
        public string ContactPerson { get; set; }
        public int? LanguageId { get; set; }
        public string LanguageName { get; set; }


        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<System.DateTime> DeletedDate { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public string ImageLogo { get; set; }
    }
}
