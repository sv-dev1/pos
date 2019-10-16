using System;
using System.Collections.Generic;

namespace POS.Models
{
    public partial class Size
    {
        public int SizeId { get; set; }
        public string SizeName { get; set; }
        public string SizeCode { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
    }
}
