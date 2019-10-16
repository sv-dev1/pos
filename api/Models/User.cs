using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class User
    {
        public int UserId { get; set; }
        public int? FranchiseId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int UserRole { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }

        public virtual Franchise Franchise { get; set; }
    }
}
