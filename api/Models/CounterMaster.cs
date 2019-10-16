using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class CounterMaster
    {
        public int Id { get; set; }
        public string CounterName { get; set; }
        public int? BillNumber { get; set; }
        public int? FranchiseId { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }

        public virtual Franchise Franchise { get; set; }
    }
}
