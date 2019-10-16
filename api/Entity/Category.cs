using System;
using System.Collections.Generic;

namespace POS.Entity
{
    public partial class Category
    {
        public Category()
        {
            Product = new HashSet<Product>();
        }

        public int Id { get; set; }
        public string CatName { get; set; }
        public string Description { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Updated { get; set; }

        public virtual ICollection<Product> Product { get; set; }
    }
}
