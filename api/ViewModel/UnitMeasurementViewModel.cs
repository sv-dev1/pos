using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS.ViewModel
{
    public class UnitMeasurementViewModel
    {
        public int UnitMeasurementId { get; set; }
        public int? UnitCategoryId { get; set; }
        public string UnitCategoryName { get; set; }
        public string UnitMeasurementName { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
    }
}
