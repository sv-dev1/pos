using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class Franchise
    {
        public Franchise()
        {
            CounterMaster = new HashSet<CounterMaster>();
            Inventory = new HashSet<Inventory>();
            Item = new HashSet<Item>();
            Sale = new HashSet<Sale>();
            User = new HashSet<User>();
        }

        public int FranchiseId { get; set; }
        public string FranchiseName { get; set; }
        public string FranchiseAddress { get; set; }
        public string FranchisePhone { get; set; }
        public string FranchiseCode { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public string ImageLogo { get; set; }
        public string FranchiseEmail { get; set; }
        public string FranchisePobox { get; set; }
        public string FranchiseAdditionalDetails { get; set; }
        public string FranchiseCurrencySymbol { get; set; }
        public string FranchiseIsocurrencyFormat { get; set; }
        public string FranchiseCity { get; set; }
        public string FranchiseAddress2 { get; set; }
        public string ContactPerson { get; set; }
        public int? LanguageId { get; set; }

        public virtual ICollection<CounterMaster> CounterMaster { get; set; }
        public virtual ICollection<Inventory> Inventory { get; set; }
        public virtual ICollection<Item> Item { get; set; }
        public virtual ICollection<Sale> Sale { get; set; }
        public virtual ICollection<User> User { get; set; }
    }
}
