using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS.Model
{
    public class CategoryViewModel
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string CategoryDescription { get; set; }
        public int? ParentCategoryId { get; set; }
        public int SubCategoryId { get; set; }
        public string SubCategoryName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
        public bool? IsActive { get; set; }
        public int? FranchiseId { get; set; }
        public string FranchiseName { get; set; }

        //public string description { get; set; }
        //public Nullable<System.DateTime> created { get; set; }
        //public Nullable<System.DateTime> updated { get; set; }

    }
}
