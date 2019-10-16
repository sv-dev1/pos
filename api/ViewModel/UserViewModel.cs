using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POS.ViewModel
{
    public class UserViewModel
    {
        public int UserId { get; set; }
        public int FranchiseId { get; set; }
        public string FranchiseName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int UserRole { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime DeletedDate { get; set; }
        public string UserRoleName { get; set; }
    }

    public class UserLoginViewModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        
    }

    public class APIResponse
    {
        public string Version { get; set; }
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public object Result { get; set; }

    }
}

