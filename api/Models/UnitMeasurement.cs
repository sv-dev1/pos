using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class UnitMeasurement
    {
        public UnitMeasurement()
        {
            Item = new HashSet<Item>();
        }

        public int UnitMeasurementId { get; set; }
        public int? UnitCategoryId { get; set; }
        public string UnitMeasurementName { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }

        public virtual UnitCategory UnitCategory { get; set; }
        public virtual ICollection<Item> Item { get; set; }
    }
}
