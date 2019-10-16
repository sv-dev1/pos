using System;
using System.Collections.Generic;

namespace POS.Entity
{
    public partial class Franchise
    {
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
    }
}
