using System;
using System.Collections.Generic;

namespace POS.Entity
{
    public partial class Customer
    {
        public int CustomerId { get; set; }
        public string FirstName { get; set; }
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }
        public string CustomerContactNo { get; set; }
        public string CustomerEmail { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string PostCode { get; set; }
        public string Description { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime DeletedDate { get; set; }
    }
}
