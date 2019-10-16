using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class UnitCategory
    {
        public UnitCategory()
        {
            Item = new HashSet<Item>();
            UnitMeasurement = new HashSet<UnitMeasurement>();
        }

        public int UnitCategoryId { get; set; }
        public string UnitCategoryName { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }

        public virtual ICollection<Item> Item { get; set; }
        public virtual ICollection<UnitMeasurement> UnitMeasurement { get; set; }
    }
}
