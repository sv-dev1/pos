using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ExcelDataReader;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using POS.Model;
using POS.Models;
using POS.ViewModel;

namespace POS.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("MyPolicy")]
    public class POSApiController : ControllerBase
    {
        APIResponse aPIResponse = new APIResponse();
        #region CategoryRegion
        #endregion

        #region FranchiseRegion

        [HttpPost]
        [Route("addFranchiseDetails")]
        public IActionResult AddFranchiseDetails(FranchiseViewModel franchiseModel)
        {
            try
            {
                using (var db = new POSRentingContext())
                {


                    if (franchiseModel.FranchiseId > 0)
                    {

                        var franchise = db.Franchise.Where(w => w.FranchiseId == franchiseModel.FranchiseId).FirstOrDefault();

                        var data = db.Franchise.Where(s => s.FranchiseName.Equals(franchiseModel.FranchiseName) && s.FranchiseId != franchise.FranchiseId && s.IsDeleted == false).FirstOrDefault();
                        if (data != null)
                        {
                            aPIResponse.StatusCode = 4001;
                            aPIResponse.Message = "Franchise Name already exists";

                            return Ok(aPIResponse);

                        }

                        else
                        {


                            franchise.FranchiseName = franchiseModel.FranchiseName == null ? franchise.FranchiseName : franchiseModel.FranchiseName;
                            franchise.FranchiseAddress = franchiseModel.FranchiseAddress == null ? franchise.FranchiseAddress : franchiseModel.FranchiseAddress;
                            franchise.FranchiseCode = franchiseModel.FranchiseCode == null ? franchise.FranchiseCode : franchiseModel.FranchiseCode;
                            franchise.CreatedDate = DateTime.Now;
                            //franchise.IsActive = true;
                            franchise.IsDeleted = false;
                            franchise.FranchisePhone = franchiseModel.FranchisePhone == null ? franchise.FranchisePhone : franchiseModel.FranchisePhone;
                            franchise.ImageLogo = franchiseModel.ImageLogo == null ? franchise.ImageLogo : franchiseModel.ImageLogo;
                            franchise.FranchiseEmail = franchiseModel.FranchiseEmail == null ? franchise.FranchiseEmail : franchiseModel.FranchiseEmail;
                            franchise.FranchisePobox = franchiseModel.FranchisePobox == null ? franchise.FranchisePobox : franchiseModel.FranchisePobox;
                            franchise.FranchiseAdditionalDetails = franchiseModel.FranchiseAdditionalDetails == null ? franchise.FranchiseAdditionalDetails : franchiseModel.FranchiseAdditionalDetails;
                            franchise.FranchiseCurrencySymbol = franchiseModel.FranchiseCurrencySymbol == null ? franchise.FranchiseCurrencySymbol : franchiseModel.FranchiseCurrencySymbol;
                            franchise.FranchiseIsocurrencyFormat = franchiseModel.FranchiseIsocurrencyFormat == null ? franchise.FranchiseIsocurrencyFormat : franchiseModel.FranchiseIsocurrencyFormat;
                            franchise.FranchiseCity = franchiseModel.FranchiseCity == null ? franchise.FranchiseCity : franchiseModel.FranchiseCity;
                            franchise.FranchiseAddress2 = franchiseModel.FranchiseAddress2 == null ? franchise.FranchiseAddress2 : franchiseModel.FranchiseAddress2;
                            franchise.ContactPerson = franchiseModel.ContactPerson;
                            franchise.LanguageId = franchiseModel.LanguageId;
                            db.SaveChanges();
                            franchise.IsActive = true;
                            aPIResponse.StatusCode = 200;
                            aPIResponse.Message = "Franchise Updated Successfully";
                            aPIResponse.Result = franchise;
                            return Ok(aPIResponse);
                        }
                    }
                    else
                    {
                        //var franchise_rec = db.Franchise.Where(w => w.FranchiseId == franchiseModel.FranchiseId).FirstOrDefault();

                        //var data = db.Franchise.SingleOrDefault(s => s.FranchiseName.Equals(franchiseModel.FranchiseName)  && s.IsDeleted == false);
                        var data = db.Franchise.Where(s => s.FranchiseName.Equals(franchiseModel.FranchiseName) && s.IsDeleted == false).FirstOrDefault();
                        if (data != null)
                        {
                            aPIResponse.StatusCode = 4001;
                            aPIResponse.Message = "Franchise Name already exists";

                            return Ok(aPIResponse);

                        }

                        else
                        {

                            Franchise franchise = new Franchise();
                            franchise.FranchiseName = franchiseModel.FranchiseName;
                            franchise.FranchiseAddress = franchiseModel.FranchiseAddress;
                            franchise.FranchiseCode = franchiseModel.FranchiseCode;
                            franchise.CreatedDate = DateTime.Now;
                            franchise.IsActive = true;
                            franchise.IsDeleted = false;
                            franchise.FranchisePhone = franchiseModel.FranchisePhone;
                            franchise.ImageLogo = franchiseModel.ImageLogo;
                            franchise.FranchiseEmail = franchiseModel.FranchiseEmail;
                            franchise.FranchisePobox = franchiseModel.FranchisePobox;
                            franchise.FranchiseAdditionalDetails = franchiseModel.FranchiseAdditionalDetails;
                            franchise.FranchiseCurrencySymbol = franchiseModel.FranchiseCurrencySymbol;
                            franchise.FranchiseIsocurrencyFormat = franchiseModel.FranchiseIsocurrencyFormat;
                            franchise.FranchiseCity = franchiseModel.FranchiseCity;
                            franchise.FranchiseAddress2 = franchiseModel.FranchiseAddress2;
                            franchise.ContactPerson = franchiseModel.ContactPerson;
                            franchise.LanguageId = franchiseModel.LanguageId;
                            db.Franchise.Add(franchise);
                            db.SaveChanges();
                            CustomerViewModel obj = new CustomerViewModel();
                            obj.CustomerName = franchiseModel.FranchiseName + " " + "Guest";
                            obj.FranchiseId = franchise.FranchiseId;
                            obj.CustomerContactNo = franchise.FranchisePhone;
                            AddGuestCustomers(obj);
                            franchise.IsActive = true;
                            aPIResponse.StatusCode = 200;
                            aPIResponse.Message = "Franchise Inserted Successfully";
                            aPIResponse.Result = franchise;
                            return Ok(aPIResponse);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }


        [HttpGet]
        [Route("AllBranchDetails")]
        public IActionResult GetBranch(int FranchiseId)
        {
            List<FranchiseViewModel> lst = new List<FranchiseViewModel>();
            try
            {
                using (var db = new POSRentingContext())
                {
                    var currency = db.Franchise.Where(w => w.FranchiseId == 1).FirstOrDefault();
                    if (FranchiseId == 0)
                    {
                        var data = db.Franchise.Where(w => w.IsActive == true && w.IsDeleted == false).ToList();
                        foreach (var item in data)
                        {
                            FranchiseViewModel objFranchiseViewModel = new FranchiseViewModel();
                            objFranchiseViewModel.FranchiseId = item.FranchiseId;
                            objFranchiseViewModel.FranchiseName = item.FranchiseName;
                            objFranchiseViewModel.FranchiseAddress = item.FranchiseAddress;
                            objFranchiseViewModel.FranchisePhone = item.FranchisePhone;
                            objFranchiseViewModel.FranchiseCode = item.FranchiseCode;
                            objFranchiseViewModel.CreatedDate = item.CreatedDate;
                            objFranchiseViewModel.DeletedDate = item.DeletedDate;
                            objFranchiseViewModel.IsActive = item.IsActive.Value;
                            objFranchiseViewModel.IsDeleted = item.IsDeleted;
                            objFranchiseViewModel.ImageLogo = item.ImageLogo;
                            objFranchiseViewModel.FranchiseEmail = item.FranchiseEmail;
                            objFranchiseViewModel.FranchisePobox = item.FranchisePobox;
                            objFranchiseViewModel.FranchiseAdditionalDetails = item.FranchiseAdditionalDetails;
                            objFranchiseViewModel.FranchiseCurrencySymbol = currency.FranchiseCurrencySymbol;
                            objFranchiseViewModel.FranchiseIsocurrencyFormat = currency.FranchiseIsocurrencyFormat;
                            objFranchiseViewModel.FranchiseCity = item.FranchiseCity;
                            objFranchiseViewModel.FranchiseAddress2 = item.FranchiseAddress2;
                            objFranchiseViewModel.ContactPerson = item.ContactPerson;
                            objFranchiseViewModel.LanguageId = item.LanguageId;
                            objFranchiseViewModel.LanguageName = item.LanguageId == 1 ? "English" : "Spanish";
                            lst.Add(objFranchiseViewModel);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = lst;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        //var data = db.Franchise.Join(db.User, u => u.FranchiseId, fran => fran.FranchiseId,(u, fran) => new { u, fran }).Where(w => w.u.IsActive == true && w.u.IsDeleted == false && w.fran.UserRole == UserRole).ToList();
                        var data = db.Franchise.Where(w => w.FranchiseId == FranchiseId && w.IsDeleted == false).FirstOrDefault();
                        //foreach (var item in data)
                        //{
                        if (data != null)
                        {

                            FranchiseViewModel objFranchiseViewModel = new FranchiseViewModel();
                            objFranchiseViewModel.FranchiseId = data.FranchiseId;
                            objFranchiseViewModel.FranchiseName = data.FranchiseName;
                            objFranchiseViewModel.FranchiseAddress = data.FranchiseAddress;
                            objFranchiseViewModel.FranchisePhone = data.FranchisePhone;
                            objFranchiseViewModel.FranchiseCode = data.FranchiseCode;
                            objFranchiseViewModel.CreatedDate = data.CreatedDate;
                            objFranchiseViewModel.DeletedDate = data.DeletedDate;
                            objFranchiseViewModel.IsActive = data.IsActive.Value;
                            objFranchiseViewModel.IsDeleted = data.IsDeleted;
                            objFranchiseViewModel.ImageLogo = data.ImageLogo;
                            objFranchiseViewModel.FranchiseEmail = data.FranchiseEmail;
                            objFranchiseViewModel.FranchisePobox = data.FranchisePobox;
                            objFranchiseViewModel.FranchiseAdditionalDetails = data.FranchiseAdditionalDetails;
                            objFranchiseViewModel.FranchiseCurrencySymbol = currency.FranchiseCurrencySymbol;
                            objFranchiseViewModel.FranchiseIsocurrencyFormat = currency.FranchiseIsocurrencyFormat;
                            objFranchiseViewModel.FranchiseCity = data.FranchiseCity;
                            objFranchiseViewModel.FranchiseAddress2 = data.FranchiseAddress2;
                            objFranchiseViewModel.ContactPerson = data.ContactPerson;
                            objFranchiseViewModel.LanguageId = data.LanguageId;
                            objFranchiseViewModel.LanguageName = data.LanguageId == 1 ? "English" : "Spanish";
                            lst.Add(objFranchiseViewModel);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = lst;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception exception)
            {

                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
            }
        }

        [HttpDelete]
        [Route("DeleteFranchise")]
        public IActionResult DeleteFranchise(int franchiseId = 0)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var franchise = db.Franchise.Where(w => w.FranchiseId == franchiseId && w.IsActive == true && w.IsDeleted == false).FirstOrDefault();
                    franchise.IsDeleted = true;
                    franchise.IsActive = false;
                    franchise.DeletedDate = DateTime.Now;
                    db.SaveChanges();

                    //delete Category for particular franchise
                    var category = db.Category.Where(w => w.FranchiseId == franchiseId && w.IsActive == true && w.IsDeleted == false).ToList();
                    foreach (var ite in category)
                    {
                        ite.IsDeleted = true;
                        ite.IsActive = false;
                        ite.DeletedDate = DateTime.Now;
                        db.SaveChanges();
                    }

                    // delete item for particular franchise
                    var items = db.Item.Where(w => w.FranchiseId == franchiseId).ToList();
                    foreach (var ite in items)
                    {
                        ite.IsDeleted = true;
                        ite.IsActive = false;
                        ite.DeletedDate = DateTime.Now;
                        db.SaveChanges();
                    }

                    var customer = db.Customer.Where(w => w.FranchiseId == franchiseId).ToList();
                    foreach (var item in customer)
                    {
                        item.IsDeleted = true;
                        item.IsActive = false;
                        item.DeletedDate = DateTime.Now;
                        db.SaveChanges();
                    }

                    var suppliers = db.SupplierDetails.Where(w => w.FranchiseId == franchiseId).ToList();
                    foreach (var item in suppliers)
                    {
                        item.IsDelete = true;
                        item.IsActive = false;
                        item.DeletedDate = DateTime.Now;
                        db.SaveChanges();
                    }

                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Deleted Successfully";
                    aPIResponse.Result = category;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }

        }

        #endregion

        #region UserRegion
        [HttpPost]
        [Route("AddEditUserDetail")]
        public IActionResult AddUser(UserViewModel userViewModel)
        {
            try
            {
                Common common = new Common();
                using (var db = new POSRentingContext())
                {
                    var userrecord = db.User.Where(w => w.UserId == userViewModel.UserId).FirstOrDefault();

                    if (userViewModel.UserId > 0)
                    {
                        var duplicateusr = db.User.Where(w => w.UserName == userViewModel.UserName && w.UserId != userViewModel.UserId).Any();
                        if (!duplicateusr)
                        {
                            userrecord.FranchiseId = userViewModel.FranchiseId;
                            userrecord.UserName = userViewModel.UserName;
                            userrecord.Password = userViewModel.Password == null ? userrecord.Password : common.Encrypt(userViewModel.Password);
                            userrecord.IsActive = true;
                            userrecord.IsDeleted = false;
                            userrecord.FirstName = userViewModel.FirstName;
                            userrecord.LastName = userViewModel.LastName;
                            userrecord.UserRole = userViewModel.UserRole;//Role for Franchise
                            db.SaveChanges();
                            userViewModel.IsActive = true;
                            userViewModel.UserRoleName = db.UserRole.Where(w => w.RoleId == userViewModel.UserRole).Select(s => s.RoleName).FirstOrDefault();
                            aPIResponse.StatusCode = 200;
                            aPIResponse.Message = "User Updated Successfully";
                            aPIResponse.Result = userViewModel;
                            return Ok(aPIResponse);
                        }
                        else
                        {
                            aPIResponse.StatusCode = 10003;
                            aPIResponse.Message = "Duplication User!";
                            return Ok(aPIResponse);
                        }

                    }
                    else
                    {
                        var duplicateusr = db.User.Where(w => w.UserName == userViewModel.UserName).Any();
                        if (!duplicateusr)
                        {
                            User user = new User();
                            user.FranchiseId = userViewModel.FranchiseId;
                            user.UserName = userViewModel.UserName;
                            user.Password = userViewModel.Password == null ? null : common.Encrypt(userViewModel.Password);
                            user.IsActive = true;
                            user.IsDeleted = false;
                            user.FirstName = userViewModel.FirstName;
                            user.LastName = userViewModel.LastName;
                            user.UserRole = userViewModel.UserRole;//Role for Franchise
                            userViewModel.UserRoleName = db.UserRole.Where(w => w.RoleId == userViewModel.UserRole).Select(s => s.RoleName).FirstOrDefault();
                            db.User.Add(user);
                            db.SaveChanges();
                            userViewModel.UserId = user.UserId;
                            aPIResponse.StatusCode = 200;
                            aPIResponse.Message = "User Inserted Successfully";
                            aPIResponse.Result = userViewModel;

                            return Ok(aPIResponse);
                        }
                        else
                        {
                            aPIResponse.StatusCode = 10003;
                            aPIResponse.Message = "Duplication User!";
                            return Ok(aPIResponse);
                        }
                        //User franchise = new Franchise();
                    }
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }

        [HttpDelete]
        [Route("DeleteUser")]
        public IActionResult DeleteUser(int userid = 0)
        {
            try
            {


                using (var db = new POSRentingContext())
                {
                    var userrecord = db.User.Where(w => w.UserId == userid).FirstOrDefault();
                    userrecord.IsDeleted = true;
                    userrecord.DeletedDate = DateTime.Now;
                    userrecord.IsActive = false;
                    db.SaveChanges();
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Deleted Successfully";
                    aPIResponse.Result = userrecord;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }

        [HttpGet]
        [Route("GetUserDetails")]
        public IActionResult GetUserDetails(int FranchiseId)
        {
            List<UserViewModel> ObjListUserViewModel = new List<UserViewModel>();
            try
            {
                using (var db = new POSRentingContext())
                {
                    var userlist = db.User.Where(w => w.IsDeleted == false && w.IsActive == true && w.FranchiseId == FranchiseId).ToList();
                    foreach (var item in userlist)
                    {
                        UserViewModel userViewModel = new UserViewModel();
                        userViewModel.UserName = item.UserName;
                        userViewModel.FirstName = item.FirstName;
                        userViewModel.FranchiseId = item.FranchiseId.Value;
                        userViewModel.LastName = item.LastName;
                        userViewModel.UserId = item.UserId;
                        userViewModel.UserRoleName = db.UserRole.Where(w => w.RoleId == item.UserRole).Select(s => s.RoleName).FirstOrDefault();
                        var franchise = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).FirstOrDefault();
                        userViewModel.UserRole = item.UserRole;
                        userViewModel.FranchiseName = franchise.FranchiseCode + " " + franchise.FranchiseName;
                        ObjListUserViewModel.Add(userViewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjListUserViewModel;
                    return Ok(aPIResponse);

                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }


        [HttpGet]
        [Route("GetUserRoles")]
        public IActionResult GetUserRoles()
        {
            try
            {
                List<UserRolesViewModel> listuserroles = new List<UserRolesViewModel>();
                using (var db = new POSRentingContext())
                {
                    var roles = db.UserRole.Where(w => w.RoleId > 1).ToList();
                    foreach (var items in roles)
                    {
                        UserRolesViewModel userRolesViewModel = new UserRolesViewModel();
                        userRolesViewModel.RoleId = items.RoleId;
                        userRolesViewModel.RoleName = items.RoleName;
                        listuserroles.Add(userRolesViewModel);
                    }
                }
                aPIResponse.StatusCode = 200;
                aPIResponse.Message = "Request Successful";
                aPIResponse.Result = listuserroles;
                return Ok(aPIResponse);
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }

        #endregion

        #region InventoryRegion

        [HttpPost]
        [Route("AddInventory")]
        public IActionResult AddInventory(InventoryViewModel ObjInventoryViewModel)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var inventoryresult = db.Inventory.Where(w => w.InventoryId == ObjInventoryViewModel.InventoryId).FirstOrDefault();
                    if (inventoryresult.InventoryId > 0)
                    {
                        inventoryresult.FranchiseId = ObjInventoryViewModel.FranchiseId;
                        inventoryresult.ItemId = ObjInventoryViewModel.ProductId;
                        inventoryresult.Quantity = ObjInventoryViewModel.Quantity;
                        inventoryresult.InitialValue = ObjInventoryViewModel.InitialValue;
                        inventoryresult.InitialValueDate = ObjInventoryViewModel.InitialValueDate;
                        inventoryresult.CurrentDate = ObjInventoryViewModel.CurrentDate;
                        inventoryresult.CurrentQuantity = ObjInventoryViewModel.CurrentQuantity;
                        inventoryresult.CreatedDate = DateTime.Now;
                        db.SaveChanges();
                        inventoryresult.IsActive = true;
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = inventoryresult;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        Inventory inventory = new Inventory();
                        inventory.FranchiseId = ObjInventoryViewModel.FranchiseId;
                        inventory.ItemId = ObjInventoryViewModel.ProductId;
                        inventory.Quantity = ObjInventoryViewModel.Quantity;
                        inventory.InitialValue = ObjInventoryViewModel.InitialValue;
                        inventory.InitialValueDate = ObjInventoryViewModel.InitialValueDate;
                        inventory.CurrentDate = ObjInventoryViewModel.CurrentDate;
                        inventory.CurrentQuantity = ObjInventoryViewModel.CurrentQuantity;
                        inventory.CreatedDate = DateTime.Now;
                        db.Inventory.Add(inventory);
                        db.SaveChanges();
                        inventoryresult.IsActive = true;
                        inventoryresult.InventoryId = inventory.InventoryId;
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = inventoryresult;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }


        [HttpDelete]
        [Route("DeleteInventory")]
        public IActionResult DeleteInventory(int inventoryId = 0)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var inventoryrecord = db.Inventory.Where(w => w.InventoryId == inventoryId).FirstOrDefault();
                    inventoryrecord.IsDeleted = true;
                    inventoryrecord.IsActive = false;
                    inventoryrecord.DeletedDate = DateTime.Now;
                    db.SaveChanges();
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Deleted Successfully";
                    return Ok(aPIResponse);
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }


        [HttpPost]
        [Route("LoginUser")]
        public IActionResult LoginUsers(UserLoginViewModel userViewModel)
        {
            Common common = new Common();
            if (!String.IsNullOrEmpty(userViewModel.UserName) && (!String.IsNullOrEmpty(common.Encrypt(userViewModel.Password))))
            {
                using (var db = new POSRentingContext())
                {
                    var userResult = db.User.Where(w => w.UserName == userViewModel.UserName && w.Password == common.Encrypt(userViewModel.Password)).FirstOrDefault();
                    if (userResult != null)
                    {
                        if (userResult.UserRole == 1)
                        {
                            userResult.FranchiseId = 0;
                        }
                    }
                    if (userResult != null)
                    {
                        UserViewModel ObjUserViewModel = new UserViewModel();
                        ObjUserViewModel.FranchiseId = userResult.FranchiseId.Value;
                        ObjUserViewModel.UserName = userResult.UserName;
                        ObjUserViewModel.FirstName = userResult.FirstName;
                        ObjUserViewModel.LastName = userResult.LastName;
                        ObjUserViewModel.UserRole = userResult.UserRole;
                        ObjUserViewModel.UserId = userResult.UserId;
                        ObjUserViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == userResult.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Login Successfully";
                        aPIResponse.Result = ObjUserViewModel;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        aPIResponse.StatusCode = 10001;
                        aPIResponse.Message = "Invalid Credentials";
                        return Ok(aPIResponse);
                    }
                }
            }
            else
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = "Please enter UserName and Password!";
                return Ok(aPIResponse);
            }
        }

        #endregion

        #region ImageUpload
        [HttpPost]
        [Route("uploadImage")]
        public async Task<IActionResult> uploadImage()
        {
            try
            {
                string imageName = null;
                var httpRequest = HttpContext.Request.Form;
                var file = httpRequest.Files[0];
                if (file == null || file.Length == 0)
                {
                    aPIResponse.StatusCode = 404;
                    aPIResponse.Message = "File not selected";
                    return Ok(aPIResponse);
                }

                imageName = file.FileName;
                Guid guid;
                guid = Guid.NewGuid();
                var path = "Images/Franchise/" + guid + ".png";

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                aPIResponse.Message = "Image upload successfully";
                aPIResponse.StatusCode = 200;
                aPIResponse.Result = JsonConvert.SerializeObject(guid + ".png");
                return Ok(aPIResponse);
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }
        #endregion


        #region ItemProducts

        [HttpGet]
        [Route("GetItemsProducts")]
        public IActionResult GetItemsProducts(int FranchiseId, string SaleType)
        {
            try
            {
                List<ItemsProductViewModel> ObjListItemsProductViewModel = new List<ItemsProductViewModel>();
                if (FranchiseId == 0)
                {

                    using (var db = new POSRentingContext())
                    {
                        List<Item> itemsproduct = new List<Item>();
                        if (SaleType == "Sale")
                        {
                            itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.IsActive == true && w.IsRented == false).ToList();
                        }
                        else if (SaleType == "Rent")
                        {
                            itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.IsActive == true && w.IsRented == true).ToList();
                        }
                        else
                        {
                            itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.IsActive == true).ToList();
                        }
                        //var itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.IsActive == true).ToList();
                        foreach (var item in itemsproduct)
                        {
                            ItemsProductViewModel ObjItemsProductViewModel = new ItemsProductViewModel();
                            ObjItemsProductViewModel.CategoryId = item.CategoryId;
                            ObjItemsProductViewModel.CategoryName = db.Category.Where(w => w.CategoryId == item.CategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            ObjItemsProductViewModel.SubCategoryId = item.SubCategoryId == 0 ? 0 : item.SubCategoryId.Value;
                            ObjItemsProductViewModel.SubCategoryName = db.Category.Where(w => w.CategoryId == item.SubCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            ObjItemsProductViewModel.FranchiseId = item.FranchiseId;
                            ObjItemsProductViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                            ObjItemsProductViewModel.ItemSalePrice = item.ItemSalePrice;
                            ObjItemsProductViewModel.ManufacturedDate = item.ManufacturedDate;
                            ObjItemsProductViewModel.PackingDate = item.PackingDate;
                            ObjItemsProductViewModel.Discount = item.Discount;
                            ObjItemsProductViewModel.QuantityStock = item.QuantityStock;
                            ObjItemsProductViewModel.Sku = item.Sku;
                            ObjItemsProductViewModel.Barcode = item.Barcode;
                            ObjItemsProductViewModel.Tax = item.Tax;
                            ObjItemsProductViewModel.ExpirationDate = item.ExpirationDate;
                            ObjItemsProductViewModel.IsDeleted = item.IsDeleted;
                            ObjItemsProductViewModel.IsActive = item.IsActive;
                            ObjItemsProductViewModel.UnitCategoryId = item.UnitCategoryId;
                            ObjItemsProductViewModel.UnitCategoryName = db.UnitCategory.Where(w => w.UnitCategoryId == item.UnitCategoryId).Select(s => s.UnitCategoryName).FirstOrDefault();
                            ObjItemsProductViewModel.UnitMeasurementId = item.UnitMeasurementId;
                            ObjItemsProductViewModel.UnitMeasurementName = db.UnitMeasurement.Where(w => w.UnitMeasurementId == item.UnitMeasurementId).Select(s => s.UnitMeasurementName).FirstOrDefault();
                            ObjItemsProductViewModel.IsRented = item.IsRented;
                            ObjItemsProductViewModel.ItemRentPrice = item.ItemRentPrice;
                            ObjItemsProductViewModel.Description = item.Description;
                            ObjItemsProductViewModel.SupplierId = item.SupplierId;
                            ObjItemsProductViewModel.SupplierName = db.SupplierDetails.Where(w => w.SupplierId == item.SupplierId).Select(s => s.SupplierName).FirstOrDefault();
                            ObjItemsProductViewModel.ItemName = item.ItemName;
                            ObjItemsProductViewModel.Tax = item.Tax;
                            ObjItemsProductViewModel.Discount = item.Discount;
                            ObjItemsProductViewModel.Barcode = item.Barcode;
                            ObjItemsProductViewModel.ItemId = item.ItemId;
                            ObjItemsProductViewModel.returnDate = null;
                            ObjItemsProductViewModel.ProductLogo = item.ProductLogo;
                            ObjItemsProductViewModel.MinimumStock = item.MinimumStockValue == null ? 0 : item.MinimumStockValue.Value;
                            ObjItemsProductViewModel.security = item.Security == null ? 0 : item.Security.Value;
                            ObjListItemsProductViewModel.Add(ObjItemsProductViewModel);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListItemsProductViewModel;
                        return Ok(aPIResponse);
                    }
                }
                else
                {
                    using (var db = new POSRentingContext())
                    {
                        List<Item> itemsproduct = new List<Item>();
                        if (SaleType == "Sale")
                        {
                            itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.IsActive == true && w.IsRented == false && w.FranchiseId == FranchiseId).ToList();
                        }
                        else if (SaleType == "Rent")
                        {
                            itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.IsActive == true && w.IsRented == true && w.FranchiseId == FranchiseId).ToList();
                        }
                        else
                        {
                            itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.IsActive == true && w.FranchiseId == FranchiseId).ToList();
                        }
                        //var itemsproduct = db.Item.Where(w => w.IsActive == true && w.IsDeleted == false && w.FranchiseId == FranchiseId).ToList();
                        //var itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.FranchiseId == FranchiseId).ToList();
                        foreach (var item in itemsproduct)
                        {
                            ItemsProductViewModel ObjItemsProductViewModel = new ItemsProductViewModel();
                            ObjItemsProductViewModel.CategoryId = item.CategoryId;
                            ObjItemsProductViewModel.CategoryName = db.Category.Where(w => w.CategoryId == item.CategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            ObjItemsProductViewModel.SubCategoryId = item.SubCategoryId == 0 ? 0 : item.SubCategoryId.Value;
                            ObjItemsProductViewModel.SubCategoryName = db.Category.Where(w => w.CategoryId == item.SubCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            ObjItemsProductViewModel.FranchiseId = item.FranchiseId;
                            ObjItemsProductViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                            ObjItemsProductViewModel.ItemSalePrice = item.ItemSalePrice;
                            ObjItemsProductViewModel.ManufacturedDate = item.ManufacturedDate;
                            ObjItemsProductViewModel.PackingDate = item.PackingDate;
                            ObjItemsProductViewModel.Discount = item.Discount;
                            ObjItemsProductViewModel.QuantityStock = item.QuantityStock;
                            ObjItemsProductViewModel.Sku = item.Sku;
                            ObjItemsProductViewModel.Barcode = item.Barcode;
                            ObjItemsProductViewModel.Tax = item.Tax;
                            ObjItemsProductViewModel.ExpirationDate = item.ExpirationDate;
                            ObjItemsProductViewModel.IsDeleted = item.IsDeleted;
                            ObjItemsProductViewModel.IsActive = item.IsActive;
                            ObjItemsProductViewModel.UnitCategoryId = item.UnitCategoryId;
                            ObjItemsProductViewModel.UnitCategoryName = db.UnitCategory.Where(w => w.UnitCategoryId == item.UnitCategoryId).Select(s => s.UnitCategoryName).FirstOrDefault();
                            ObjItemsProductViewModel.UnitMeasurementId = item.UnitMeasurementId;
                            ObjItemsProductViewModel.UnitMeasurementName = db.UnitMeasurement.Where(w => w.UnitMeasurementId == item.UnitMeasurementId).Select(s => s.UnitMeasurementName).FirstOrDefault();
                            ObjItemsProductViewModel.IsRented = item.IsRented;
                            ObjItemsProductViewModel.ItemRentPrice = item.ItemRentPrice;
                            ObjItemsProductViewModel.Description = item.Description;
                            ObjItemsProductViewModel.SupplierId = item.SupplierId;
                            ObjItemsProductViewModel.SupplierName = db.SupplierDetails.Where(w => w.SupplierId == item.SupplierId).Select(s => s.SupplierName).FirstOrDefault();
                            ObjItemsProductViewModel.ItemName = item.ItemName;
                            ObjItemsProductViewModel.Discount = item.Discount;
                            ObjItemsProductViewModel.Barcode = item.Barcode;
                            ObjItemsProductViewModel.ItemId = item.ItemId;
                            ObjItemsProductViewModel.MinimumStock = item.MinimumStockValue == null ? 0 : item.MinimumStockValue.Value;
                            ObjItemsProductViewModel.security = item.Security == null ? 0 : item.Security.Value;
                            ObjItemsProductViewModel.ProductLogo = item.ProductLogo;
                            ObjListItemsProductViewModel.Add(ObjItemsProductViewModel);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListItemsProductViewModel;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }

        [HttpGet]
        [Route("GetItemsProductsByCategory")]
        public IActionResult GetItemsProductsByCategory(int CategoryId, int FranchiseId, string SaleType)
        {
            try
            {
                List<ItemsProductViewModel> ObjListItemsProductViewModel = new List<ItemsProductViewModel>();
                if (FranchiseId == 0)
                {

                    using (var db = new POSRentingContext())
                    {
                        List<Item> itemsproduct = new List<Item>();
                        if (SaleType == "Sale")
                        {
                            itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.IsActive == true && w.IsRented == false && w.CategoryId==CategoryId).ToList();
                        }
                        else if (SaleType == "Rent")
                        {
                            itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.IsActive == true && w.IsRented == true && w.CategoryId == CategoryId).ToList();
                        }
                        else
                        {
                            itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.IsActive == true && w.CategoryId == CategoryId).ToList();
                        }
                        //var itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.IsActive == true).ToList();
                        foreach (var item in itemsproduct)
                        {
                            ItemsProductViewModel ObjItemsProductViewModel = new ItemsProductViewModel();
                            ObjItemsProductViewModel.CategoryId = item.CategoryId;
                            ObjItemsProductViewModel.CategoryName = db.Category.Where(w => w.CategoryId == item.CategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            ObjItemsProductViewModel.SubCategoryId = item.SubCategoryId == 0 ? 0 : item.SubCategoryId.Value;
                            ObjItemsProductViewModel.SubCategoryName = db.Category.Where(w => w.CategoryId == item.SubCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            ObjItemsProductViewModel.FranchiseId = item.FranchiseId;
                            ObjItemsProductViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                            ObjItemsProductViewModel.ItemSalePrice = item.ItemSalePrice;
                            ObjItemsProductViewModel.ManufacturedDate = item.ManufacturedDate;
                            ObjItemsProductViewModel.PackingDate = item.PackingDate;
                            ObjItemsProductViewModel.Discount = item.Discount;
                            ObjItemsProductViewModel.QuantityStock = item.QuantityStock;
                            ObjItemsProductViewModel.Sku = item.Sku;
                            ObjItemsProductViewModel.Barcode = item.Barcode;
                            ObjItemsProductViewModel.Tax = item.Tax;
                            ObjItemsProductViewModel.ExpirationDate = item.ExpirationDate;
                            ObjItemsProductViewModel.IsDeleted = item.IsDeleted;
                            ObjItemsProductViewModel.IsActive = item.IsActive;
                            ObjItemsProductViewModel.UnitCategoryId = item.UnitCategoryId;
                            ObjItemsProductViewModel.UnitCategoryName = db.UnitCategory.Where(w => w.UnitCategoryId == item.UnitCategoryId).Select(s => s.UnitCategoryName).FirstOrDefault();
                            ObjItemsProductViewModel.UnitMeasurementId = item.UnitMeasurementId;
                            ObjItemsProductViewModel.UnitMeasurementName = db.UnitMeasurement.Where(w => w.UnitMeasurementId == item.UnitMeasurementId).Select(s => s.UnitMeasurementName).FirstOrDefault();
                            ObjItemsProductViewModel.IsRented = item.IsRented;
                            ObjItemsProductViewModel.ItemRentPrice = item.ItemRentPrice;
                            ObjItemsProductViewModel.Description = item.Description;
                            ObjItemsProductViewModel.SupplierId = item.SupplierId;
                            ObjItemsProductViewModel.SupplierName = db.SupplierDetails.Where(w => w.SupplierId == item.SupplierId).Select(s => s.SupplierName).FirstOrDefault();
                            ObjItemsProductViewModel.ItemName = item.ItemName;
                            ObjItemsProductViewModel.Tax = item.Tax;
                            ObjItemsProductViewModel.Discount = item.Discount;
                            ObjItemsProductViewModel.Barcode = item.Barcode;
                            ObjItemsProductViewModel.ItemId = item.ItemId;
                            ObjItemsProductViewModel.returnDate = null;
                            ObjItemsProductViewModel.ProductLogo = item.ProductLogo;
                            ObjItemsProductViewModel.MinimumStock = item.MinimumStockValue == null ? 0 : item.MinimumStockValue.Value;
                            ObjItemsProductViewModel.security = item.Security == null ? 0 : item.Security.Value;
                            ObjListItemsProductViewModel.Add(ObjItemsProductViewModel);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListItemsProductViewModel;
                        return Ok(aPIResponse);
                    }
                }
                else
                {
                    using (var db = new POSRentingContext())
                    {
                        List<Item> itemsproduct = new List<Item>();
                        if (SaleType == "Sale")
                        {
                            itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.IsActive == true && w.IsRented == false && w.FranchiseId == FranchiseId && w.CategoryId == CategoryId).ToList();
                        }
                        else if (SaleType == "Rent")
                        {
                            itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.IsActive == true && w.IsRented == true && w.FranchiseId == FranchiseId && w.CategoryId == CategoryId).ToList();
                        }
                        else
                        {
                            itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.IsActive == true && w.FranchiseId == FranchiseId && w.CategoryId == CategoryId).ToList();
                        }
                        //var itemsproduct = db.Item.Where(w => w.IsActive == true && w.IsDeleted == false && w.FranchiseId == FranchiseId).ToList();
                        //var itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.FranchiseId == FranchiseId).ToList();
                        foreach (var item in itemsproduct)
                        {
                            ItemsProductViewModel ObjItemsProductViewModel = new ItemsProductViewModel();
                            ObjItemsProductViewModel.CategoryId = item.CategoryId;
                            ObjItemsProductViewModel.CategoryName = db.Category.Where(w => w.CategoryId == item.CategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            ObjItemsProductViewModel.SubCategoryId = item.SubCategoryId == 0 ? 0 : item.SubCategoryId.Value;
                            ObjItemsProductViewModel.SubCategoryName = db.Category.Where(w => w.CategoryId == item.SubCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            ObjItemsProductViewModel.FranchiseId = item.FranchiseId;
                            ObjItemsProductViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                            ObjItemsProductViewModel.ItemSalePrice = item.ItemSalePrice;
                            ObjItemsProductViewModel.ManufacturedDate = item.ManufacturedDate;
                            ObjItemsProductViewModel.PackingDate = item.PackingDate;
                            ObjItemsProductViewModel.Discount = item.Discount;
                            ObjItemsProductViewModel.QuantityStock = item.QuantityStock;
                            ObjItemsProductViewModel.Sku = item.Sku;
                            ObjItemsProductViewModel.Barcode = item.Barcode;
                            ObjItemsProductViewModel.Tax = item.Tax;
                            ObjItemsProductViewModel.ExpirationDate = item.ExpirationDate;
                            ObjItemsProductViewModel.IsDeleted = item.IsDeleted;
                            ObjItemsProductViewModel.IsActive = item.IsActive;
                            ObjItemsProductViewModel.UnitCategoryId = item.UnitCategoryId;
                            ObjItemsProductViewModel.UnitCategoryName = db.UnitCategory.Where(w => w.UnitCategoryId == item.UnitCategoryId).Select(s => s.UnitCategoryName).FirstOrDefault();
                            ObjItemsProductViewModel.UnitMeasurementId = item.UnitMeasurementId;
                            ObjItemsProductViewModel.UnitMeasurementName = db.UnitMeasurement.Where(w => w.UnitMeasurementId == item.UnitMeasurementId).Select(s => s.UnitMeasurementName).FirstOrDefault();
                            ObjItemsProductViewModel.IsRented = item.IsRented;
                            ObjItemsProductViewModel.ItemRentPrice = item.ItemRentPrice;
                            ObjItemsProductViewModel.Description = item.Description;
                            ObjItemsProductViewModel.SupplierId = item.SupplierId;
                            ObjItemsProductViewModel.SupplierName = db.SupplierDetails.Where(w => w.SupplierId == item.SupplierId).Select(s => s.SupplierName).FirstOrDefault();
                            ObjItemsProductViewModel.ItemName = item.ItemName;
                            ObjItemsProductViewModel.Discount = item.Discount;
                            ObjItemsProductViewModel.Barcode = item.Barcode;
                            ObjItemsProductViewModel.ItemId = item.ItemId;
                            ObjItemsProductViewModel.MinimumStock = item.MinimumStockValue == null ? 0 : item.MinimumStockValue.Value;
                            ObjItemsProductViewModel.security = item.Security == null ? 0 : item.Security.Value;
                            ObjItemsProductViewModel.ProductLogo = item.ProductLogo;
                            ObjListItemsProductViewModel.Add(ObjItemsProductViewModel);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListItemsProductViewModel;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }


        [HttpGet]
        [Route("GetAllItemsProducts")]
        public IActionResult GetAllItemsProducts(int FranchiseId)
        {
            try
            {
                List<ItemsProductViewModel> ObjListItemsProductViewModel = new List<ItemsProductViewModel>();
                if (FranchiseId == 0)
                {
                    using (var db = new POSRentingContext())
                    {
                        var itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.IsGroup == false).ToList();
                        //var itemsproduct = db.Item.Where(w =>  w.IsDeleted == false && w.IsActive == true).ToList();
                        foreach (var item in itemsproduct)
                        {
                            ItemsProductViewModel ObjItemsProductViewModel = new ItemsProductViewModel();
                            ObjItemsProductViewModel.CategoryId = item.CategoryId;
                            ObjItemsProductViewModel.CategoryName = db.Category.Where(w => w.CategoryId == item.CategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            ObjItemsProductViewModel.SubCategoryId = item.SubCategoryId == 0 ? 0 : item.SubCategoryId.Value;
                            ObjItemsProductViewModel.SubCategoryName = db.Category.Where(w => w.CategoryId == item.SubCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            ObjItemsProductViewModel.FranchiseId = item.FranchiseId;
                            ObjItemsProductViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                            ObjItemsProductViewModel.ItemSalePrice = item.ItemSalePrice;
                            ObjItemsProductViewModel.ManufacturedDate = item.ManufacturedDate;
                            ObjItemsProductViewModel.PackingDate = item.PackingDate;
                            ObjItemsProductViewModel.Discount = item.Discount;
                            ObjItemsProductViewModel.QuantityStock = item.QuantityStock;
                            ObjItemsProductViewModel.Sku = item.Sku;
                            ObjItemsProductViewModel.Barcode = item.Barcode;
                            ObjItemsProductViewModel.Tax = item.Tax;
                            ObjItemsProductViewModel.ExpirationDate = item.ExpirationDate;
                            ObjItemsProductViewModel.IsDeleted = item.IsDeleted;
                            ObjItemsProductViewModel.IsActive = item.IsActive;
                            ObjItemsProductViewModel.UnitCategoryId = item.UnitCategoryId;
                            ObjItemsProductViewModel.UnitCategoryName = db.UnitCategory.Where(w => w.UnitCategoryId == item.UnitCategoryId).Select(s => s.UnitCategoryName).FirstOrDefault();
                            ObjItemsProductViewModel.UnitMeasurementId = item.UnitMeasurementId;
                            ObjItemsProductViewModel.UnitMeasurementName = db.UnitMeasurement.Where(w => w.UnitMeasurementId == item.UnitMeasurementId).Select(s => s.UnitMeasurementName).FirstOrDefault();
                            ObjItemsProductViewModel.IsRented = item.IsRented;
                            ObjItemsProductViewModel.ItemRentPrice = item.ItemRentPrice;
                            ObjItemsProductViewModel.Description = item.Description;
                            ObjItemsProductViewModel.SupplierId = item.SupplierId;
                            ObjItemsProductViewModel.SupplierName = db.SupplierDetails.Where(w => w.SupplierId == item.SupplierId).Select(s => s.SupplierName).FirstOrDefault();
                            ObjItemsProductViewModel.ItemName = item.ItemName;
                            ObjItemsProductViewModel.Tax = item.Tax;
                            ObjItemsProductViewModel.Discount = item.Discount;
                            ObjItemsProductViewModel.Barcode = item.Barcode;
                            ObjItemsProductViewModel.ItemId = item.ItemId;
                            ObjItemsProductViewModel.returnDate = null;
                            ObjItemsProductViewModel.ProductLogo = item.ProductLogo;
                            ObjItemsProductViewModel.MinimumStock = item.MinimumStockValue == null ? 0 : item.MinimumStockValue.Value;
                            ObjItemsProductViewModel.security = item.Security == null ? 0 : item.Security.Value;
                            ObjListItemsProductViewModel.Add(ObjItemsProductViewModel);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListItemsProductViewModel;
                        return Ok(aPIResponse);
                    }
                }
                else
                {
                    using (var db = new POSRentingContext())
                    {
                        var itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.FranchiseId == FranchiseId && w.IsGroup == false).ToList();
                        //var itemsproduct = db.Item.Where(w => w.IsDeleted == false && w.FranchiseId == FranchiseId).ToList();
                        foreach (var item in itemsproduct)
                        {
                            ItemsProductViewModel ObjItemsProductViewModel = new ItemsProductViewModel();
                            ObjItemsProductViewModel.CategoryId = item.CategoryId;
                            ObjItemsProductViewModel.CategoryName = db.Category.Where(w => w.CategoryId == item.CategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            ObjItemsProductViewModel.SubCategoryId = item.SubCategoryId == 0 ? 0 : item.SubCategoryId.Value;
                            ObjItemsProductViewModel.SubCategoryName = db.Category.Where(w => w.CategoryId == item.SubCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            ObjItemsProductViewModel.FranchiseId = item.FranchiseId;
                            ObjItemsProductViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                            ObjItemsProductViewModel.ItemSalePrice = item.ItemSalePrice;
                            ObjItemsProductViewModel.ManufacturedDate = item.ManufacturedDate;
                            ObjItemsProductViewModel.PackingDate = item.PackingDate;
                            ObjItemsProductViewModel.Discount = item.Discount;
                            ObjItemsProductViewModel.QuantityStock = item.QuantityStock;
                            ObjItemsProductViewModel.Sku = item.Sku;
                            ObjItemsProductViewModel.Barcode = item.Barcode;
                            ObjItemsProductViewModel.Tax = item.Tax;
                            ObjItemsProductViewModel.ExpirationDate = item.ExpirationDate;
                            ObjItemsProductViewModel.IsDeleted = item.IsDeleted;
                            ObjItemsProductViewModel.IsActive = item.IsActive;
                            ObjItemsProductViewModel.UnitCategoryId = item.UnitCategoryId;
                            ObjItemsProductViewModel.UnitCategoryName = db.UnitCategory.Where(w => w.UnitCategoryId == item.UnitCategoryId).Select(s => s.UnitCategoryName).FirstOrDefault();
                            ObjItemsProductViewModel.UnitMeasurementId = item.UnitMeasurementId;
                            ObjItemsProductViewModel.UnitMeasurementName = db.UnitMeasurement.Where(w => w.UnitMeasurementId == item.UnitMeasurementId).Select(s => s.UnitMeasurementName).FirstOrDefault();
                            ObjItemsProductViewModel.IsRented = item.IsRented;
                            ObjItemsProductViewModel.ItemRentPrice = item.ItemRentPrice;
                            ObjItemsProductViewModel.Description = item.Description;
                            ObjItemsProductViewModel.SupplierId = item.SupplierId;
                            ObjItemsProductViewModel.SupplierName = db.SupplierDetails.Where(w => w.SupplierId == item.SupplierId).Select(s => s.SupplierName).FirstOrDefault();
                            ObjItemsProductViewModel.ItemName = item.ItemName;
                            ObjItemsProductViewModel.Discount = item.Discount;
                            ObjItemsProductViewModel.Barcode = item.Barcode;
                            ObjItemsProductViewModel.ItemId = item.ItemId;
                            ObjItemsProductViewModel.MinimumStock = item.MinimumStockValue == null ? 0 : item.MinimumStockValue.Value;
                            ObjItemsProductViewModel.security = item.Security == null ? 0 : item.Security.Value;
                            ObjItemsProductViewModel.ProductLogo = item.ProductLogo;
                            ObjListItemsProductViewModel.Add(ObjItemsProductViewModel);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListItemsProductViewModel;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }



        [HttpGet]
        [Route("GetStockAlert")]
        public IActionResult GetStockAlerts(int FranchiseId)
        {
            try
            {
                List<ItemsProductViewModel> ObjListItemsProductViewModel = new List<ItemsProductViewModel>();
                if (FranchiseId == 0)
                {
                    using (var db = new POSRentingContext())
                    {
                        var itemsstock = (from p in db.Item
                                          join q in db.Franchise on p.FranchiseId equals q.FranchiseId
                                          where p.IsActive == true && p.IsDeleted == false && p.QuantityStock < p.MinimumStockValue
                                          select new ItemsProductViewModel()
                                          {
                                              ItemId = p.ItemId,
                                              ItemName = p.ItemName,
                                              MinimumStock = p.QuantityStock.Value, //(items.MinimumStockValue - items.QuantityStock) == null ? 0 : (items.MinimumStockValue - items.QuantityStock).Value;
                                              FranchiseName = q.FranchiseName
                                          }).ToList();
                        //foreach (var items in itemsstock)
                        //{
                        //    ItemsProductViewModel ObjItemsProductViewModel = new ItemsProductViewModel();
                        //    ObjItemsProductViewModel.ItemName = items.ItemName;
                        //    ObjItemsProductViewModel.MinimumStock = items.QuantityStock.Value; //(items.MinimumStockValue - items.QuantityStock) == null ? 0 : (items.MinimumStockValue - items.QuantityStock).Value;
                        //    ObjListItemsProductViewModel.Add(ObjItemsProductViewModel);
                        //}
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = itemsstock.OrderBy(o => o.MinimumStock).Take(10).ToList();
                        return Ok(aPIResponse);
                    }
                }
                else
                {
                    using (var db = new POSRentingContext())
                    {

                        var itemsstock = (from p in db.Item
                                          join q in db.Franchise on p.FranchiseId equals q.FranchiseId
                                          where p.FranchiseId == FranchiseId && p.IsActive == true && p.IsDeleted == false && p.QuantityStock < p.MinimumStockValue
                                          select new ItemsProductViewModel()
                                          {
                                              ItemId = p.ItemId,
                                              ItemName = p.ItemName,
                                              MinimumStock = p.QuantityStock.Value, //(items.MinimumStockValue - items.QuantityStock) == null ? 0 : (items.MinimumStockValue - items.QuantityStock).Value;
                                              FranchiseName = q.FranchiseName
                                          }).ToList();
                        //var itemsstock = db.Item.Where(w => w.FranchiseId == FranchiseId && w.IsActive == true && w.IsDeleted == false && w.QuantityStock < w.MinimumStockValue).ToList();
                        //foreach (var items in itemsstock)
                        //{
                        //    ItemsProductViewModel ObjItemsProductViewModel = new ItemsProductViewModel();
                        //    ObjItemsProductViewModel.ItemName = items.ItemName;
                        //    ObjItemsProductViewModel.QuantityStock = items.QuantityStock;
                        //    ObjItemsProductViewModel.MinimumStock = items.QuantityStock.Value; //(items.MinimumStockValue - items.QuantityStock) == null ? 0 : (items.MinimumStockValue - items.QuantityStock).Value;
                        //    ObjListItemsProductViewModel.Add(ObjItemsProductViewModel);
                        //}
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = itemsstock.OrderBy(o => o.MinimumStock).Take(10).ToList();
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception)
            {

                throw;
            }
        }


        [HttpGet]
        [Route("GetAllStockAlerts")]
        public IActionResult GetAllStockAlerts(int FranchiseId)
        {
            try
            {
                List<ItemsProductViewModel> ObjListItemsProductViewModel = new List<ItemsProductViewModel>();
                if (FranchiseId == 0)
                {
                    using (var db = new POSRentingContext())
                    {
                        List<ItemsProductViewModelList> ObjListItemsProductViewModelList = new List<ItemsProductViewModelList>();
                        var franchise = db.Franchise.Where(w => w.IsActive == true && w.IsDeleted == false).ToList();
                        foreach (var item in franchise)
                        {
                            ItemsProductViewModelList itemsProductViewModel = new ItemsProductViewModelList();
                            var itemsstock = (from p in db.Item
                                              join q in db.Franchise on p.FranchiseId equals q.FranchiseId
                                              where p.IsActive == true && p.IsDeleted == false && p.QuantityStock < p.MinimumStockValue && p.FranchiseId == item.FranchiseId
                                              select new ItemsProductViewModel()
                                              {
                                                  ItemId = p.ItemId,
                                                  ItemName = p.ItemName,
                                                  MinimumStock = p.QuantityStock.Value,
                                                  ProductLogo = p.ProductLogo,
                                                  Sku = p.Sku
                                              }).OrderBy(o => o.MinimumStock).ToList();
                            itemsProductViewModel.FranchiseId = item.FranchiseId;
                            itemsProductViewModel.FranchiseName = item.FranchiseName;
                            itemsProductViewModel.ItemsViewlist = itemsstock;
                            ObjListItemsProductViewModelList.Add(itemsProductViewModel);
                            ObjListItemsProductViewModelList = ObjListItemsProductViewModelList.ToList();
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListItemsProductViewModelList.ToList();
                        return Ok(aPIResponse);
                    }
                }
                else
                {
                    using (var db = new POSRentingContext())
                    {
                        List<ItemsProductViewModelList> ObjListItemsProductViewModelList = new List<ItemsProductViewModelList>();
                        ItemsProductViewModelList itemsProductViewModel = new ItemsProductViewModelList();
                        var itemsstock = (from p in db.Item
                                          join q in db.Franchise on p.FranchiseId equals q.FranchiseId
                                          where p.IsActive == true && p.IsDeleted == false && p.QuantityStock < p.MinimumStockValue && p.FranchiseId == FranchiseId
                                          select new ItemsProductViewModel()
                                          {
                                              ItemId = p.ItemId,
                                              ItemName = p.ItemName,
                                              MinimumStock = p.QuantityStock.Value,
                                              ProductLogo = p.ProductLogo,
                                              Sku = p.Sku
                                          }).OrderBy(o => o.MinimumStock).ToList();
                        itemsProductViewModel.FranchiseId = FranchiseId;
                        itemsProductViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        itemsProductViewModel.ItemsViewlist = itemsstock;
                        ObjListItemsProductViewModelList.Add(itemsProductViewModel);
                        ObjListItemsProductViewModelList = ObjListItemsProductViewModelList.ToList();
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListItemsProductViewModelList;
                        return Ok(aPIResponse);
                    }
                }
                //return Ok(aPIResponse);
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString(); ;
                return Ok(aPIResponse);
            }
        }

        [HttpGet]
        [Route("GetUnitCategory")]
        public IActionResult GetUnitCategory()
        {
            try
            {
                List<UnitCategoryViewModel> ObjListUnitcategoryviewmodel = new List<UnitCategoryViewModel>();
                using (var db = new POSRentingContext())
                {
                    var unitcategory = db.UnitCategory.Where(w => w.IsActive == true && w.IsDeleted == false).ToList();
                    foreach (var item in unitcategory)
                    {
                        UnitCategoryViewModel ObjUnitCategoryViewModel = new UnitCategoryViewModel();
                        ObjUnitCategoryViewModel.UnitCategoryId = item.UnitCategoryId;
                        ObjUnitCategoryViewModel.UnitCategoryName = item.UnitCategoryName;
                        ObjUnitCategoryViewModel.IsActive = item.IsActive;
                        ObjListUnitcategoryviewmodel.Add(ObjUnitCategoryViewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjListUnitcategoryviewmodel;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }


        [HttpGet]
        [Route("GetAllUnitCategory")]
        public IActionResult GetAllUnitCategory()
        {
            try
            {
                List<UnitCategoryViewModel> ObjListUnitcategoryviewmodel = new List<UnitCategoryViewModel>();
                using (var db = new POSRentingContext())
                {
                    var unitcategory = db.UnitCategory.Where(w => w.IsDeleted == false).ToList();
                    foreach (var item in unitcategory)
                    {
                        UnitCategoryViewModel ObjUnitCategoryViewModel = new UnitCategoryViewModel();
                        ObjUnitCategoryViewModel.UnitCategoryId = item.UnitCategoryId;
                        ObjUnitCategoryViewModel.UnitCategoryName = item.UnitCategoryName;
                        ObjUnitCategoryViewModel.IsActive = item.IsActive;
                        ObjListUnitcategoryviewmodel.Add(ObjUnitCategoryViewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjListUnitcategoryviewmodel;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }

        [HttpGet]
        [Route("GetUnitCategoryMeasurement")]
        public IActionResult GetUnitCategoryMeasurement(int UnitCategoryId)
        {
            try
            {
                List<UnitMeasurementViewModel> ObjListUnitMeasurementViewModel = new List<UnitMeasurementViewModel>();
                using (var db = new POSRentingContext())
                {
                    List<UnitMeasurement> unitcategory = new List<UnitMeasurement>();
                    if (UnitCategoryId > 0)
                    {
                        unitcategory = db.UnitMeasurement.Where(w => w.IsActive == true && w.IsDeleted == false && w.UnitCategoryId == UnitCategoryId).ToList();
                    }
                    else
                    {
                        unitcategory = db.UnitMeasurement.Where(w => w.IsActive == true && w.IsDeleted == false).ToList();
                    }
                    foreach (var item in unitcategory)
                    {
                        UnitMeasurementViewModel ObjUnitCategoryViewModel = new UnitMeasurementViewModel();
                        ObjUnitCategoryViewModel.UnitCategoryId = item.UnitCategoryId;
                        ObjUnitCategoryViewModel.UnitMeasurementName = item.UnitMeasurementName;
                        ObjUnitCategoryViewModel.UnitMeasurementId = item.UnitMeasurementId;
                        ObjUnitCategoryViewModel.IsActive = item.IsActive;
                        ObjUnitCategoryViewModel.UnitCategoryName = db.UnitCategory.Where(w => w.UnitCategoryId == item.UnitCategoryId).Select(s => s.UnitCategoryName).FirstOrDefault();
                        ObjListUnitMeasurementViewModel.Add(ObjUnitCategoryViewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjListUnitMeasurementViewModel;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }


        [HttpGet]
        [Route("GetAllUnitCategoryMeasurement")]
        public IActionResult GetAllUnitCategoryMeasurement(int UnitCategoryId)
        {
            try
            {
                List<UnitMeasurementViewModel> ObjListUnitMeasurementViewModel = new List<UnitMeasurementViewModel>();
                using (var db = new POSRentingContext())
                {
                    List<UnitMeasurement> unitcategory = new List<UnitMeasurement>();
                    if (UnitCategoryId > 0)
                    {
                        unitcategory = db.UnitMeasurement.Where(w => w.IsDeleted == false && w.UnitCategoryId == UnitCategoryId).ToList();
                    }
                    else
                    {
                        unitcategory = db.UnitMeasurement.Where(w => w.IsDeleted == false).ToList();
                    }
                    foreach (var item in unitcategory)
                    {
                        UnitMeasurementViewModel ObjUnitCategoryViewModel = new UnitMeasurementViewModel();
                        ObjUnitCategoryViewModel.UnitCategoryId = item.UnitCategoryId;
                        ObjUnitCategoryViewModel.UnitMeasurementName = item.UnitMeasurementName;
                        ObjUnitCategoryViewModel.UnitMeasurementId = item.UnitMeasurementId;
                        ObjUnitCategoryViewModel.IsActive = item.IsActive;
                        ObjUnitCategoryViewModel.UnitCategoryName = db.UnitCategory.Where(w => w.UnitCategoryId == item.UnitCategoryId).Select(s => s.UnitCategoryName).FirstOrDefault();
                        ObjListUnitMeasurementViewModel.Add(ObjUnitCategoryViewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjListUnitMeasurementViewModel;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }
        /// <summary>
        /// for get all the suppliers
        /// </summary>
        /// <returns></returns>

        [HttpGet]
        [Route("GetSupplier")]
        public IActionResult GetSupplier(int franchiseId = 0)
        {
            try
            {
                List<SupplierViewModel> ObjListSupplierViewModel = new List<SupplierViewModel>();
                using (var db = new POSRentingContext())
                {
                    List<SupplierDetails> supplier = new List<SupplierDetails>();
                    if (franchiseId == 0)
                        supplier = db.SupplierDetails.Where(s => s.IsDelete != true && s.IsActive == true).ToList();
                    else
                        supplier = db.SupplierDetails.Where(s => s.FranchiseId == franchiseId && s.IsDelete != true && s.IsActive == true).ToList();

                    foreach (var items in supplier)
                    {
                        SupplierViewModel ObjSupplierViewModel = new SupplierViewModel();
                        ObjSupplierViewModel.SupplierId = items.SupplierId;
                        ObjSupplierViewModel.SupplierName = items.SupplierName;
                        ObjSupplierViewModel.SupplierAddress = items.SupplierAddress;
                        ObjSupplierViewModel.SupplierCity = items.SupplierCity;
                        ObjSupplierViewModel.SupplierContactNo = items.SupplierContactNo;
                        ObjSupplierViewModel.FranchiseId = items.FranchiseId; //added
                        ObjSupplierViewModel.IsActive = items.IsActive;
                        ObjListSupplierViewModel.Add(ObjSupplierViewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjListSupplierViewModel;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }


        [HttpGet]
        [Route("GetALLSupplier")]
        public IActionResult GetALLSupplier(int franchiseId = 0)
        {
            try
            {
                List<SupplierViewModel> ObjListSupplierViewModel = new List<SupplierViewModel>();
                using (var db = new POSRentingContext())
                {
                    List<SupplierDetails> supplier = new List<SupplierDetails>();
                    if (franchiseId == 0)
                        supplier = db.SupplierDetails.Where(s => s.IsDelete != true).ToList();
                    else
                        supplier = db.SupplierDetails.Where(s => s.FranchiseId == franchiseId && s.IsDelete != true).ToList();

                    foreach (var items in supplier)
                    {
                        SupplierViewModel ObjSupplierViewModel = new SupplierViewModel();
                        ObjSupplierViewModel.SupplierId = items.SupplierId;
                        ObjSupplierViewModel.SupplierName = items.SupplierName;
                        ObjSupplierViewModel.SupplierAddress = items.SupplierAddress;
                        ObjSupplierViewModel.SupplierCity = items.SupplierCity;
                        ObjSupplierViewModel.SupplierContactNo = items.SupplierContactNo;
                        ObjSupplierViewModel.Cellphone = items.Cellphone;
                        ObjSupplierViewModel.CompanyName = items.CompanyName;
                        ObjSupplierViewModel.Email = items.Email;
                        ObjSupplierViewModel.FranchiseId = items.FranchiseId; //added
                        ObjSupplierViewModel.IsActive = items.IsActive;
                        ObjListSupplierViewModel.Add(ObjSupplierViewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjListSupplierViewModel;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }

        /// <summary>
        ///  for insert/update the Item
        /// </summary>
        /// <param name="itemsProductViewModel"></param>
        /// <returns>Item Detials with API Response</returns>

        [HttpPost]
        [Route("AddEditItemProduct")]
        public IActionResult AddEditItemProduct(ItemsProductViewModel itemsProductViewModel)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var itemproduct = db.Item.Where(w => w.ItemId == itemsProductViewModel.ItemId).FirstOrDefault();

                    if (itemproduct != null)
                    {
                        var skuProduct = db.Item.Where(w => w.Sku == itemsProductViewModel.Sku && w.ItemId != itemsProductViewModel.ItemId).FirstOrDefault();
                        var skuProduct1 = db.Item.Where(w => w.Sku == itemsProductViewModel.Sku && w.ItemId == itemsProductViewModel.ItemId).FirstOrDefault();
                        var barcodeProduct = db.Item.Where(w => w.Barcode == itemsProductViewModel.Barcode && w.ItemId != itemsProductViewModel.ItemId).FirstOrDefault();
                        var barcodeProduct1 = db.Item.Where(w => w.Barcode == itemsProductViewModel.Barcode && w.ItemId == itemsProductViewModel.ItemId).FirstOrDefault();
                        if (skuProduct1 == null)
                        {
                            if (skuProduct != null)
                            {
                                aPIResponse.StatusCode = 10001;
                                aPIResponse.Message = "Item with same SKU already exists, Please enter unique SKU.";
                                aPIResponse.Result = itemsProductViewModel;
                                return Ok(aPIResponse);
                            }
                        }
                        else if (barcodeProduct1 == null)
                        {
                            if (barcodeProduct != null)
                            {
                                aPIResponse.StatusCode = 10001;
                                aPIResponse.Message = "Item with same BarCode already exists, Please enter unique BarCode.";
                                aPIResponse.Result = itemsProductViewModel;
                                return Ok(aPIResponse);
                            }
                        }
                        itemproduct.CategoryId = itemsProductViewModel.CategoryId;
                        itemproduct.SubCategoryId = itemsProductViewModel.SubCategoryId;
                        itemproduct.FranchiseId = itemsProductViewModel.FranchiseId;
                        itemproduct.ItemName = itemsProductViewModel.ItemName;
                        itemproduct.ItemSalePrice = itemsProductViewModel.ItemSalePrice;
                        itemproduct.ItemRentPrice = itemsProductViewModel.ItemRentPrice;
                        itemproduct.ManufacturedDate = itemsProductViewModel.ManufacturedDate;
                        itemproduct.PackingDate = itemsProductViewModel.PackingDate;
                        itemproduct.Discount = itemsProductViewModel.Discount;
                        itemproduct.QuantityStock = itemsProductViewModel.QuantityStock;
                        itemproduct.Sku = itemsProductViewModel.Sku;
                        itemproduct.Barcode = itemsProductViewModel.Barcode;
                        itemproduct.Tax = itemsProductViewModel.Tax;
                        itemproduct.IsGroup = false;
                        itemproduct.IsDeleted = false;
                        itemproduct.ExpirationDate = itemsProductViewModel.ExpirationDate;
                        itemproduct.UnitMeasurementId = itemsProductViewModel.UnitMeasurementId;
                        itemproduct.UnitCategoryId = itemsProductViewModel.UnitCategoryId;
                        itemproduct.IsRented = itemsProductViewModel.IsRented;
                        itemproduct.ItemRentPrice = itemsProductViewModel.ItemRentPrice;
                        itemproduct.Description = itemsProductViewModel.Description;
                        itemproduct.SupplierId = itemsProductViewModel.SupplierId;
                        itemproduct.Security = itemsProductViewModel.IsRented != true ? 0 : itemsProductViewModel.security;
                        itemproduct.MinimumStockValue = itemsProductViewModel.MinimumStock;
                        itemproduct.ProductLogo = itemsProductViewModel.ProductLogo == null ? "data:image/jpeg;base64,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" : itemsProductViewModel.ProductLogo;
                        db.SaveChanges();
                        // itemsProductViewModel.IsActive = true;
                        itemsProductViewModel.IsActive = itemproduct.IsActive == null ? false : itemproduct.IsActive;
                        itemsProductViewModel.ProductLogo = itemsProductViewModel.ProductLogo == null ? "data:image/jpeg;base64,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" : itemsProductViewModel.ProductLogo;
                        itemsProductViewModel.ItemId = itemsProductViewModel.ItemId;
                        itemsProductViewModel.CategoryName = db.Category.Where(w => w.CategoryId == itemsProductViewModel.CategoryId).Select(s => s.CategoryName).FirstOrDefault();
                        itemsProductViewModel.SubCategoryName = db.Category.Where(w => w.CategoryId == itemsProductViewModel.SubCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                        itemsProductViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == itemsProductViewModel.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        itemsProductViewModel.SupplierName = db.SupplierDetails.Where(w => w.SupplierId == itemsProductViewModel.SupplierId).Select(s => s.SupplierName).FirstOrDefault();
                        itemsProductViewModel.UnitCategoryName = db.UnitCategory.Where(w => w.UnitCategoryId == itemsProductViewModel.UnitCategoryId).Select(s => s.UnitCategoryName).FirstOrDefault();
                        itemsProductViewModel.UnitMeasurementName = db.UnitMeasurement.Where(w => w.UnitMeasurementId == itemsProductViewModel.UnitMeasurementId).Select(s => s.UnitMeasurementName).FirstOrDefault();
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Item Updated Successful";
                        aPIResponse.Result = itemsProductViewModel;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        var skuProduct = db.Item.Where(w => w.Sku == itemsProductViewModel.Sku).FirstOrDefault();
                        if (skuProduct != null)
                        {
                            aPIResponse.StatusCode = 10001;
                            aPIResponse.Message = "Item with same SKU already exists, Please enter unique SKU.";
                            aPIResponse.Result = itemsProductViewModel;
                            return Ok(aPIResponse);
                        }
                        var barcodeProduct = db.Item.Where(w => w.Barcode == itemsProductViewModel.Barcode).FirstOrDefault();
                        if (barcodeProduct != null)
                        {
                            aPIResponse.StatusCode = 10001;
                            aPIResponse.Message = "Item with same Barcode already exists, Please enter unique Barcode.";
                            aPIResponse.Result = itemsProductViewModel;
                            return Ok(aPIResponse);
                        }

                        Item ObjItem = new Item();
                        ObjItem.CategoryId = itemsProductViewModel.CategoryId;
                        ObjItem.SubCategoryId = itemsProductViewModel.SubCategoryId;
                        ObjItem.FranchiseId = itemsProductViewModel.FranchiseId;
                        ObjItem.ItemName = itemsProductViewModel.ItemName;
                        ObjItem.ItemSalePrice = itemsProductViewModel.ItemSalePrice;
                        ObjItem.ItemRentPrice = itemsProductViewModel.ItemRentPrice;
                        ObjItem.ManufacturedDate = itemsProductViewModel.ManufacturedDate;
                        ObjItem.PackingDate = itemsProductViewModel.PackingDate;
                        ObjItem.Discount = itemsProductViewModel.Discount;
                        ObjItem.QuantityStock = itemsProductViewModel.QuantityStock;
                        ObjItem.Sku = itemsProductViewModel.Sku;
                        ObjItem.Barcode = itemsProductViewModel.Barcode;
                        ObjItem.Tax = itemsProductViewModel.Tax;
                        ObjItem.ExpirationDate = itemsProductViewModel.ExpirationDate;
                        ObjItem.UnitMeasurementId = itemsProductViewModel.UnitMeasurementId;
                        ObjItem.UnitCategoryId = itemsProductViewModel.UnitCategoryId;
                        ObjItem.IsRented = itemsProductViewModel.IsRented;
                        ObjItem.ItemRentPrice = itemsProductViewModel.ItemRentPrice;
                        ObjItem.Description = itemsProductViewModel.Description;
                        ObjItem.SupplierId = itemsProductViewModel.SupplierId;
                        ObjItem.Security = itemsProductViewModel.IsRented != true ? 0 : itemsProductViewModel.security;
                        ObjItem.MinimumStockValue = itemsProductViewModel.MinimumStock;
                        ObjItem.ProductLogo = itemsProductViewModel.ProductLogo == null ? "data:image/jpeg;base64,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" : itemsProductViewModel.ProductLogo;
                        ObjItem.CreatedDate = DateTime.Now;
                        ObjItem.IsActive = true;
                        ObjItem.IsDeleted = false;
                        ObjItem.IsGroup = false;
                        ObjItem.IsGroup = false;
                        db.Item.Add(ObjItem);
                        db.SaveChanges();
                        itemsProductViewModel.IsActive = true;
                        itemsProductViewModel.ProductLogo = itemsProductViewModel.ProductLogo == null ? "data:image/jpeg;base64,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" : itemsProductViewModel.ProductLogo;
                        itemsProductViewModel.ItemId = ObjItem.ItemId;
                        itemsProductViewModel.CategoryName = db.Category.Where(w => w.CategoryId == itemsProductViewModel.CategoryId).Select(s => s.CategoryName).FirstOrDefault();
                        itemsProductViewModel.SubCategoryName = db.Category.Where(w => w.CategoryId == itemsProductViewModel.SubCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                        itemsProductViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == itemsProductViewModel.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        itemsProductViewModel.SupplierName = db.SupplierDetails.Where(w => w.SupplierId == itemsProductViewModel.SupplierId).Select(s => s.SupplierName).FirstOrDefault();
                        itemsProductViewModel.UnitCategoryName = db.UnitCategory.Where(w => w.UnitCategoryId == itemsProductViewModel.UnitCategoryId).Select(s => s.UnitCategoryName).FirstOrDefault();
                        itemsProductViewModel.UnitMeasurementName = db.UnitMeasurement.Where(w => w.UnitMeasurementId == itemsProductViewModel.UnitMeasurementId).Select(s => s.UnitMeasurementName).FirstOrDefault();
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Item Inserted Successfully";
                        aPIResponse.Result = itemsProductViewModel;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
            }
        }
        public void EditItemQuantity(int? ItemId, int? quantity)
        {
            using (var db = new POSRentingContext())
            {
                var items = db.Item.Where(w => w.ItemId == ItemId).FirstOrDefault();
                int? qty = items.QuantityStock;
                items.QuantityStock = qty - quantity;
                db.SaveChanges();
            }
        }

        [HttpGet]
        [Route("GetItemsProductsBySupplyName")]
        public IActionResult GetItemsProductsBySupplyName(string supplyName, DateTime From, DateTime To)
        {
            try
            {
                List<ItemImportViewModel> ObjListItemsProductViewModel = new List<ItemImportViewModel>();
                using (var db = new POSRentingContext())
                {
                    var itemsproduct = db.ItemImport.Where(w => w.SupplyName == supplyName && w.CreatedDate >= From && w.CreatedDate <= To).ToList();
                    foreach (var item in itemsproduct)
                    {
                        ItemImportViewModel ObjItemsProductViewModel = new ItemImportViewModel();
                        ObjItemsProductViewModel.CreatedDate = item.CreatedDate;
                        ObjItemsProductViewModel.FileName = item.FileName;
                        ObjItemsProductViewModel.SupplyName = item.SupplyName;
                        ObjItemsProductViewModel.CreatedBy = item.CreatedBy;
                        ObjItemsProductViewModel.FranchiseId = item.FranchiseId;
                        ObjItemsProductViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        ObjItemsProductViewModel.CreatedName = db.User.Where(w => w.UserId == item.CreatedBy).Select(s => s.UserName).FirstOrDefault();
                        ObjItemsProductViewModel.SupplierId = item.SupplierId;
                        ObjItemsProductViewModel.SupplierName = db.SupplierDetails.Where(w => w.SupplierId == item.SupplierId).Select(s => s.SupplierName).FirstOrDefault();
                        ObjListItemsProductViewModel.Add(ObjItemsProductViewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjListItemsProductViewModel;
                    return Ok(aPIResponse);
                }

            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }
        [HttpDelete]
        [Route("DeleteItem")]
        public IActionResult DeleteItem(int ItemId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var items = db.Item.Where(w => w.ItemId == ItemId).FirstOrDefault();
                    items.IsDeleted = true;
                    items.DeletedDate = DateTime.Now;
                    db.SaveChanges();
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Deleted Successfully";
                    aPIResponse.Result = items;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
            }
        }

        [HttpPut]
        [Route("ActivateItem")]
        public IActionResult ActivateItem(int ItemId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var item = db.Item.Where(w => w.ItemId == ItemId).FirstOrDefault();
                    if (item.IsActive == true)
                    {
                        item.IsActive = false;
                        aPIResponse.Message = "Item Deactivated Successfully";
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Result = item;
                    }
                    else
                    {
                        item.IsActive = true;
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Item Activated Successfully";
                        aPIResponse.Result = item;
                    }
                    db.SaveChanges();
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }

        #endregion


        #region Category
        [HttpPost]
        [Route("AddEditCategory")]
        public IActionResult AddEditCategory(CategoryViewModel categoryViewModel)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    if (categoryViewModel.CategoryId > 0)
                    {
                        // var category = db.Category.Where(w => w.IsActive == true && w.IsDeleted == false && w.CategoryId == categoryViewModel.CategoryId).FirstOrDefault();
                        var category = db.Category.Where(w => w.IsDeleted == false && w.CategoryId == categoryViewModel.CategoryId).FirstOrDefault();
                        //category.CategoryId = categoryViewModel.CategoryId;
                        category.CategoryName = categoryViewModel.CategoryName;
                        category.CategoryDescription = categoryViewModel.CategoryDescription;
                        db.SaveChanges();
                        if (categoryViewModel.ParentCategoryId > 0)
                        {
                            categoryViewModel.SubCategoryId = categoryViewModel.CategoryId;
                            categoryViewModel.SubCategoryName = categoryViewModel.CategoryName;
                            categoryViewModel.CategoryId = db.Category.Where(w => w.CategoryId == categoryViewModel.ParentCategoryId).Select(s => s.CategoryId).FirstOrDefault();
                            categoryViewModel.CategoryName = db.Category.Where(w => w.CategoryId == categoryViewModel.ParentCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            categoryViewModel.IsActive = category.IsActive == null ? false : category.IsActive;
                            aPIResponse.Message = "SubCategory Updated Successfully";
                            //categoryViewModel.SubCategoryName = categoryViewModel.CategoryName; 
                        }
                        else
                        {
                            categoryViewModel.IsActive = category.IsActive == null ? false : category.IsActive;
                            aPIResponse.Message = "Category Updated Successfully";
                        }
                        //categoryViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == categoryViewModel.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        aPIResponse.StatusCode = 200;
                        // categoryViewModel.IsActive = true;
                        aPIResponse.Result = categoryViewModel;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        Category Objcategory = new Category();
                        Objcategory.CategoryName = categoryViewModel.CategoryName;
                        Objcategory.CategoryDescription = categoryViewModel.CategoryDescription;
                        Objcategory.ParentCategoryId = categoryViewModel.ParentCategoryId;
                        Objcategory.IsActive = true;
                        Objcategory.IsDeleted = false;
                        Objcategory.CreatedDate = DateTime.Now;
                        //Objcategory.FranchiseId = categoryViewModel.FranchiseId;
                        db.Category.Add(Objcategory);
                        db.SaveChanges();
                        if (categoryViewModel.ParentCategoryId > 0)
                        {
                            categoryViewModel.SubCategoryId = Objcategory.CategoryId;
                            categoryViewModel.SubCategoryName = categoryViewModel.CategoryName;
                            categoryViewModel.CategoryId = db.Category.Where(w => w.CategoryId == categoryViewModel.ParentCategoryId).Select(s => s.CategoryId).FirstOrDefault();
                            categoryViewModel.CategoryName = db.Category.Where(w => w.CategoryId == categoryViewModel.ParentCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            aPIResponse.Message = "SubCategory Inserted Successfully";
                        }
                        else
                        {
                            aPIResponse.Message = "Category Inserted Successfully";
                        }
                        categoryViewModel.IsActive = true;
                        categoryViewModel.CategoryId = Objcategory.CategoryId;
                        //categoryViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == categoryViewModel.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Category Inserted Successfully";
                        aPIResponse.Result = categoryViewModel;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }

        [HttpDelete]
        [Route("DeleteCategory")]
        public IActionResult DeleteCategory(int CategoryId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var category = db.Category.Where(w => w.CategoryId == CategoryId).FirstOrDefault();
                    category.IsDeleted = true;
                    category.IsActive = false;
                    category.DeletedDate = DateTime.Now;
                    db.SaveChanges();

                    //for delete the items for particular category
                    var items = db.Item.Where(w => w.CategoryId == CategoryId && w.IsActive == true && w.IsDeleted == false).ToList();
                    foreach (var item in items)
                    {
                        item.IsDeleted = true;
                        item.DeletedDate = DateTime.Now;
                        item.IsActive = false;
                        db.SaveChanges();
                    }

                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Deleted Successful";
                    aPIResponse.Result = category;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
            }
        }

        [HttpGet]
        [Route("AllCategoryDetails")]
        public IActionResult GetCategory(int CategoryId, int FranchiseId, int ItemId)
        {
            List<CategoryViewModel> lst = new List<CategoryViewModel>();
            try
            {
                var data = new List<Category>();
                using (var db = new POSRentingContext())
                {
                    if (CategoryId == 0)
                    {
                        if (FranchiseId == 0)
                        {
                            data = db.Category.Where(w => w.ParentCategoryId == 0 && w.IsActive == true && w.IsDeleted == false).ToList();
                        }
                        else
                        {
                            //data = db.Category.Where(w => w.ParentCategoryId == 0 && w.FranchiseId == FranchiseId && w.IsActive == true && w.IsDeleted == false).ToList();
                            data = db.Category.Where(w => w.ParentCategoryId == 0 && w.IsActive == true && w.IsDeleted == false).ToList();
                        }

                        foreach (var item in data)
                        {
                            CategoryViewModel objc = new CategoryViewModel();
                            objc.CategoryId = item.CategoryId;
                            objc.CategoryName = item.CategoryName;
                            objc.CreatedDate = item.CreatedDate;
                            objc.CategoryDescription = item.CategoryDescription;
                            objc.IsActive = item.IsActive;
                            objc.SubCategoryId = item.CategoryId;
                            //objc.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                            //objc.FranchiseId = item.FranchiseId;
                            lst.Add(objc);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = lst;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        if (FranchiseId == 0)
                        {
                            if (ItemId == 0)
                            {
                                data = db.Category.Where(w => w.ParentCategoryId == CategoryId && w.IsActive == true && w.IsDeleted == false).ToList();
                            }
                            else
                            {
                                data = db.Category.Where(w => w.CategoryId == CategoryId && w.IsActive == true && w.IsDeleted == false).ToList();
                            }
                        }
                        else
                        {
                            if (ItemId == 0)
                            {
                                //data = db.Category.Where(w => w.ParentCategoryId == CategoryId && w.FranchiseId == FranchiseId && w.IsActive == true && w.IsDeleted == false).ToList();
                                data = db.Category.Where(w => w.ParentCategoryId == CategoryId && w.IsActive == true && w.IsDeleted == false).ToList();
                            }
                            else
                            {
                                data = db.Category.Where(w => w.CategoryId == CategoryId && w.IsActive == true && w.IsDeleted == false).ToList();
                                //data = db.Category.Where(w => w.CategoryId == CategoryId && w.FranchiseId == FranchiseId && w.IsActive == true && w.IsDeleted == false).ToList();
                            }

                        }
                        foreach (var item in data)
                        {
                            CategoryViewModel objc = new CategoryViewModel();
                            objc.CategoryId = item.CategoryId;
                            objc.CategoryName = item.CategoryName;
                            //if (ItemId == 0)
                            //{
                            //    objc.SubCategoryId = item.
                            //}
                            objc.IsActive = item.IsActive;
                            objc.CreatedDate = item.CreatedDate;
                            objc.CategoryDescription = item.CategoryDescription;
                            objc.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                            objc.FranchiseId = item.FranchiseId;
                            objc.SubCategoryId = item.CategoryId;
                            lst.Add(objc);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = lst;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }



        [HttpGet]
        [Route("GetCategoryList")]
        public IActionResult GetCategoryList(int CategoryId, int FranchiseId, int ItemId)
        {
            List<CategoryViewModel> lst = new List<CategoryViewModel>();
            try
            {
                var data = new List<Category>();
                using (var db = new POSRentingContext())
                {
                    if (CategoryId == 0)
                    {
                        if (FranchiseId == 0)
                        {
                            data = db.Category.Where(w => w.ParentCategoryId == 0 && w.IsDeleted == false).ToList();
                        }
                        else
                        {
                            //data = db.Category.Where(w => w.ParentCategoryId == 0 && w.FranchiseId == FranchiseId && w.IsActive == true && w.IsDeleted == false).ToList();
                            data = db.Category.Where(w => w.ParentCategoryId == 0 && w.IsDeleted == false).ToList();
                        }

                        foreach (var item in data)
                        {
                            CategoryViewModel objc = new CategoryViewModel();
                            objc.CategoryId = item.CategoryId;
                            objc.CategoryName = item.CategoryName;
                            objc.CreatedDate = item.CreatedDate;
                            objc.CategoryDescription = item.CategoryDescription;
                            objc.IsActive = item.IsActive;
                            objc.SubCategoryId = item.CategoryId;
                            //objc.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                            //objc.FranchiseId = item.FranchiseId;
                            lst.Add(objc);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = lst;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        if (FranchiseId == 0)
                        {
                            if (ItemId == 0)
                            {
                                data = db.Category.Where(w => w.ParentCategoryId == CategoryId && w.IsDeleted == false).ToList();
                            }
                            else
                            {
                                data = db.Category.Where(w => w.CategoryId == CategoryId && w.IsDeleted == false).ToList();
                            }
                        }
                        else
                        {
                            if (ItemId == 0)
                            {
                                //data = db.Category.Where(w => w.ParentCategoryId == CategoryId && w.FranchiseId == FranchiseId && w.IsActive == true && w.IsDeleted == false).ToList();
                                data = db.Category.Where(w => w.ParentCategoryId == CategoryId && w.IsActive == true && w.IsDeleted == false).ToList();
                            }
                            else
                            {
                                data = db.Category.Where(w => w.CategoryId == CategoryId && w.IsActive == true && w.IsDeleted == false).ToList();
                                //data = db.Category.Where(w => w.CategoryId == CategoryId && w.FranchiseId == FranchiseId && w.IsActive == true && w.IsDeleted == false).ToList();
                            }

                        }
                        foreach (var item in data)
                        {
                            CategoryViewModel objc = new CategoryViewModel();
                            objc.CategoryId = item.CategoryId;
                            objc.CategoryName = item.CategoryName;
                            //if (ItemId == 0)
                            //{
                            //    objc.SubCategoryId = item.
                            //}
                            objc.IsActive = item.IsActive;
                            objc.CreatedDate = item.CreatedDate;
                            objc.CategoryDescription = item.CategoryDescription;
                            objc.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                            objc.FranchiseId = item.FranchiseId;
                            objc.SubCategoryId = item.CategoryId;
                            lst.Add(objc);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = lst;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }


        [HttpGet]
        [Route("GetCategorySubCategory")]
        public IActionResult GetCategorySubCategory(int CategoryId, int FranchiseId)
        {
            List<CategoryViewModel> lst = new List<CategoryViewModel>();
            try
            {
                var data = new List<Category>();
                using (var db = new POSRentingContext())
                {
                    if (CategoryId == 0)
                    {
                        if (FranchiseId == 0)
                        {
                            data = db.Category.Where(w => w.ParentCategoryId == 0 && w.IsActive == true && w.IsDeleted == false).ToList();
                        }
                        else
                        {
                            //data = db.Category.Where(w => w.ParentCategoryId == 0 && w.FranchiseId == FranchiseId && w.IsActive == true && w.IsDeleted == false).ToList();
                            data = db.Category.Where(w => w.ParentCategoryId == 0 && w.IsActive == true && w.IsDeleted == false).ToList();
                        }

                        foreach (var item in data)
                        {
                            CategoryViewModel objc = new CategoryViewModel();
                            objc.CategoryId = item.CategoryId;
                            objc.CategoryName = item.CategoryName;
                            objc.CreatedDate = item.CreatedDate;
                            objc.IsActive = item.IsActive;
                            objc.CategoryDescription = item.CategoryDescription;
                            //objc.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                            //objc.FranchiseId = item.FranchiseId;
                            lst.Add(objc);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = lst;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        if (FranchiseId == 0)
                        {
                            data = db.Category.Where(w => w.ParentCategoryId == CategoryId && w.IsActive == true && w.IsDeleted == false).ToList();
                        }
                        else
                        {
                            //data = db.Category.Where(w => w.ParentCategoryId == CategoryId && w.FranchiseId == FranchiseId && w.IsActive == true && w.IsDeleted == false).ToList();
                            data = db.Category.Where(w => w.ParentCategoryId == CategoryId && w.IsActive == true && w.IsDeleted == false).ToList();
                        }
                        foreach (var item in data)
                        {
                            CategoryViewModel objc = new CategoryViewModel();
                            objc.CategoryId = item.CategoryId;
                            objc.CategoryName = db.Category.Where(w => w.CategoryId == item.ParentCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            objc.SubCategoryName = item.CategoryName;
                            objc.CreatedDate = item.CreatedDate;
                            objc.IsActive = item.IsActive;
                            objc.CategoryDescription = item.CategoryDescription;
                            //objc.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                            //objc.FranchiseId = item.FranchiseId;
                            lst.Add(objc);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = lst;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }


        [HttpGet]
        [Route("GetSubCategory")]
        public IActionResult GetSubCategory(int CategoryId, int FranchiseId)
        {
            List<CategoryViewModel> lst = new List<CategoryViewModel>();
            try
            {
                var data = new List<Category>();
                using (var db = new POSRentingContext())
                {
                    if (CategoryId == 0)
                    {
                        if (FranchiseId == 0)
                        {
                            data = db.Category.Where(w => w.ParentCategoryId > 0 && w.IsActive == true && w.IsDeleted == false).ToList();
                        }
                        else
                        {
                            //data = db.Category.Where(w => w.ParentCategoryId > 0 && w.FranchiseId == FranchiseId && w.IsActive == true && w.IsDeleted == false).ToList();
                            data = db.Category.Where(w => w.ParentCategoryId > 0 && w.IsActive == true && w.IsDeleted == false).ToList();
                        }

                        foreach (var item in data)
                        {
                            CategoryViewModel objc = new CategoryViewModel();
                            objc.CategoryId = db.Category.Where(w => w.CategoryId == item.ParentCategoryId).Select(s => s.CategoryId).FirstOrDefault();
                            objc.CategoryName = db.Category.Where(w => w.CategoryId == item.ParentCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            objc.SubCategoryId = item.CategoryId;
                            objc.SubCategoryName = item.CategoryName;
                            objc.CreatedDate = item.CreatedDate;
                            objc.CategoryDescription = item.CategoryDescription;
                            objc.ParentCategoryId = item.ParentCategoryId;
                            objc.IsActive = item.IsActive;
                            //objc.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                            //objc.FranchiseId = item.FranchiseId;
                            lst.Add(objc);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = lst;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        if (FranchiseId == 0)
                        {
                            data = db.Category.Where(w => w.CategoryId == CategoryId && w.IsActive == true && w.IsDeleted == false).ToList();
                        }
                        else
                        {
                            //data = db.Category.Where(w => w.CategoryId == CategoryId && w.FranchiseId == FranchiseId && w.IsActive == true && w.IsDeleted == false).ToList();
                            data = db.Category.Where(w => w.CategoryId == CategoryId && w.IsActive == true && w.IsDeleted == false).ToList();
                        }
                        foreach (var item in data)
                        {
                            CategoryViewModel objc = new CategoryViewModel();
                            objc.CategoryId = db.Category.Where(w => w.CategoryId == item.ParentCategoryId).Select(s => s.CategoryId).FirstOrDefault();
                            objc.CategoryName = db.Category.Where(w => w.CategoryId == item.ParentCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            objc.SubCategoryId = item.CategoryId;
                            objc.SubCategoryName = item.CategoryName;
                            objc.CreatedDate = item.CreatedDate;
                            objc.CategoryDescription = item.CategoryDescription;
                            objc.ParentCategoryId = item.ParentCategoryId;
                            objc.IsActive = item.IsActive;
                            //objc.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                            //objc.FranchiseId = item.FranchiseId;
                            lst.Add(objc);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = lst;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }


        [HttpGet]
        [Route("GetListingSubCategory")]
        public IActionResult GetListingSubCategory(int CategoryId, int FranchiseId)
        {
            List<CategoryViewModel> lst = new List<CategoryViewModel>();
            try
            {
                var data = new List<Category>();
                using (var db = new POSRentingContext())
                {
                    if (CategoryId == 0)
                    {
                        if (FranchiseId == 0)
                        {
                            data = db.Category.Where(w => w.ParentCategoryId > 0 && w.IsDeleted == false).ToList();
                        }
                        else
                        {
                            //data = db.Category.Where(w => w.ParentCategoryId > 0 && w.FranchiseId == FranchiseId && w.IsActive == true && w.IsDeleted == false).ToList();
                            data = db.Category.Where(w => w.ParentCategoryId > 0 && w.IsDeleted == false).ToList();
                        }

                        foreach (var item in data)
                        {
                            CategoryViewModel objc = new CategoryViewModel();
                            objc.CategoryId = db.Category.Where(w => w.CategoryId == item.ParentCategoryId).Select(s => s.CategoryId).FirstOrDefault();
                            objc.CategoryName = db.Category.Where(w => w.CategoryId == item.ParentCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            objc.SubCategoryId = item.CategoryId;
                            objc.SubCategoryName = item.CategoryName;
                            objc.CreatedDate = item.CreatedDate;
                            objc.CategoryDescription = item.CategoryDescription;
                            objc.ParentCategoryId = item.ParentCategoryId;
                            objc.IsActive = item.IsActive;
                            //objc.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                            //objc.FranchiseId = item.FranchiseId;
                            lst.Add(objc);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = lst;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        if (FranchiseId == 0)
                        {
                            data = db.Category.Where(w => w.CategoryId == CategoryId && w.IsDeleted == false).ToList();
                        }
                        else
                        {
                            //data = db.Category.Where(w => w.CategoryId == CategoryId && w.FranchiseId == FranchiseId && w.IsActive == true && w.IsDeleted == false).ToList();
                            data = db.Category.Where(w => w.CategoryId == CategoryId && w.IsDeleted == false).ToList();
                        }
                        foreach (var item in data)
                        {
                            CategoryViewModel objc = new CategoryViewModel();
                            objc.CategoryId = db.Category.Where(w => w.CategoryId == item.ParentCategoryId).Select(s => s.CategoryId).FirstOrDefault();
                            objc.CategoryName = db.Category.Where(w => w.CategoryId == item.ParentCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                            objc.SubCategoryId = item.CategoryId;
                            objc.SubCategoryName = item.CategoryName;
                            objc.CreatedDate = item.CreatedDate;
                            objc.CategoryDescription = item.CategoryDescription;
                            objc.ParentCategoryId = item.ParentCategoryId;
                            objc.IsActive = item.IsActive;
                            //objc.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                            //objc.FranchiseId = item.FranchiseId;
                            lst.Add(objc);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = lst;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }

        #endregion


        #region UnitCategory
        [HttpPost]
        [Route("AddEditUnitCategory")]
        public IActionResult AddEditUnitCategory(UnitCategoryViewModel unitCategoryViewModel)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var unitcategory = db.UnitCategory.Where(w => w.UnitCategoryId == unitCategoryViewModel.UnitCategoryId).FirstOrDefault();
                    if (unitCategoryViewModel.UnitCategoryId > 0)
                    {
                        unitcategory.UnitCategoryName = unitCategoryViewModel.UnitCategoryName;
                        db.SaveChanges();
                        //  unitCategoryViewModel.IsActive = true;
                        unitCategoryViewModel.IsActive = unitcategory.IsActive == null ? false : unitcategory.IsActive;
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Unit Category Updated Successfully";
                        aPIResponse.Result = unitCategoryViewModel;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        UnitCategory ObjUnitCategory = new UnitCategory();
                        ObjUnitCategory.UnitCategoryName = unitCategoryViewModel.UnitCategoryName;
                        ObjUnitCategory.IsActive = true;
                        ObjUnitCategory.IsDeleted = false;
                        ObjUnitCategory.CreatedDate = DateTime.Now;
                        db.UnitCategory.Add(ObjUnitCategory);
                        db.SaveChanges();
                        unitCategoryViewModel.IsActive = true;
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Unit Category Inserted Successfully";
                        aPIResponse.Result = ObjUnitCategory;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
            }
        }

        [HttpDelete]
        [Route("DeleteUnitCategory")]
        public IActionResult DeleteUnitCategory(int UnitCategoryId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var unitcategory = db.UnitCategory.Where(w => w.UnitCategoryId == UnitCategoryId).FirstOrDefault();
                    unitcategory.IsDeleted = true;
                    unitcategory.DeletedDate = DateTime.Now;
                    unitcategory.IsActive = false;
                    db.SaveChanges();
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Deleted Successfully";
                    aPIResponse.Result = unitcategory;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }
        #endregion


        #region UnitMeasurement
        [HttpPost]
        [Route("AddEditUnitMeasurement")]
        public IActionResult AddEditUnitMeasurement(UnitMeasurementViewModel unitMeasurementViewModel)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var unitcategory = db.UnitMeasurement.Where(w => w.UnitMeasurementId == unitMeasurementViewModel.UnitMeasurementId).FirstOrDefault();
                    if (unitMeasurementViewModel.UnitMeasurementId > 0)
                    {
                        unitcategory.UnitMeasurementName = unitMeasurementViewModel.UnitMeasurementName;
                        unitcategory.UnitCategoryId = unitMeasurementViewModel.UnitCategoryId;
                        db.SaveChanges();
                        // unitMeasurementViewModel.IsActive = true;
                        unitMeasurementViewModel.IsActive = unitcategory.IsActive == null ? false : unitcategory.IsActive;
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "UnitMeasurement Updated Successfully";
                        aPIResponse.Result = unitMeasurementViewModel;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        UnitMeasurement ObjUnitMeasurement = new UnitMeasurement();
                        ObjUnitMeasurement.UnitMeasurementName = unitMeasurementViewModel.UnitMeasurementName;
                        ObjUnitMeasurement.UnitCategoryId = unitMeasurementViewModel.UnitCategoryId;
                        ObjUnitMeasurement.IsActive = true;
                        ObjUnitMeasurement.IsDeleted = false;
                        ObjUnitMeasurement.CreatedDate = DateTime.Now;
                        db.UnitMeasurement.Add(ObjUnitMeasurement);
                        db.SaveChanges();
                        aPIResponse.StatusCode = 200;
                        ObjUnitMeasurement.IsActive = true;
                        aPIResponse.Message = "UnitMeasurement Inserted Successfully";
                        aPIResponse.Result = ObjUnitMeasurement;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
            }
        }


        [HttpDelete]
        [Route("DeleteUnitMeasurement")]
        public IActionResult DeleteUnitMeasurement(int unitMeasurementId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var unitcategory = db.UnitMeasurement.Where(w => w.UnitMeasurementId == unitMeasurementId).FirstOrDefault();
                    unitcategory.IsDeleted = true;
                    unitcategory.IsActive = false;
                    unitcategory.DeletedDate = DateTime.Now;
                    db.SaveChanges();
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Deleted Successfully";
                    aPIResponse.Result = unitcategory;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }
        #endregion


        #region Supplier
        //[HttpGet]
        //[Route("GetSupplier")]

        //public IActionResult GetSupplier(int franchiseId = 0)
        //{
        //    try
        //    {
        //        List<SupplierViewModel> ObjListSupplierViewModel = new List<SupplierViewModel>();
        //        using (var db = new POSRentingContext())
        //        {
        //            List<SupplierDetails> supplier = new List<SupplierDetails>();
        //            if (franchiseId == 0)
        //                supplier = db.SupplierDetails.Where(s => s.IsDelete != true && s.IsActive == true).ToList();
        //            else
        //                supplier = db.SupplierDetails.Where(s => s.FranchiseId == franchiseId && s.IsDelete != true && s.IsActive == true).ToList();

        //            foreach (var items in supplier)
        //            {
        //                SupplierViewModel ObjSupplierViewModel = new SupplierViewModel();
        //                ObjSupplierViewModel.SupplierId = items.SupplierId;
        //                ObjSupplierViewModel.SupplierName = items.SupplierName;
        //                ObjSupplierViewModel.SupplierAddress = items.SupplierAddress;
        //                ObjSupplierViewModel.SupplierCity = items.SupplierCity;
        //                ObjSupplierViewModel.SupplierContactNo = items.SupplierContactNo;
        //                ObjSupplierViewModel.FranchiseId = items.FranchiseId; //added
        //                ObjListSupplierViewModel.Add(ObjSupplierViewModel);
        //            }
        //            aPIResponse.StatusCode = 200;
        //            aPIResponse.Message = "Request Successful";
        //            aPIResponse.Result = ObjListSupplierViewModel;
        //            return Ok(aPIResponse);
        //        }
        //    }
        //    catch (Exception exception)
        //    {
        //        aPIResponse.StatusCode = 10001;
        //        aPIResponse.Message = exception.ToString();
        //        return Ok(aPIResponse);
        //        throw;
        //    }
        //}
        [HttpPost]
        [Route("AddEditSupplier")]
        public IActionResult AddEditSupplier(SupplierViewModel supplierViewModel)
        {
            try
            {
                using (var db = new POSRentingContext())
                {

                    if (supplierViewModel.SupplierId > 0)
                    {
                        var supplierDetails = db.SupplierDetails.Where(w => w.SupplierId == supplierViewModel.SupplierId).FirstOrDefault();
                        if (supplierDetails != null)
                        {
                            supplierDetails.SupplierName = supplierViewModel.SupplierName;
                            supplierDetails.FranchiseId = supplierViewModel.FranchiseId;
                            supplierDetails.SupplierAddress = supplierViewModel.SupplierAddress;
                            supplierDetails.SupplierCity = supplierViewModel.SupplierCity;
                            supplierDetails.SupplierContactNo = supplierViewModel.SupplierContactNo;
                            supplierDetails.CompanyName = supplierViewModel.CompanyName;
                            supplierDetails.Cellphone = supplierViewModel.Cellphone;
                            supplierDetails.Email = supplierViewModel.Email;
                            db.SaveChanges();
                            // supplierDetails.IsActive = true;
                            supplierViewModel.IsActive = supplierDetails.IsActive == null ? false : supplierDetails.IsActive;
                            aPIResponse.StatusCode = 200;
                            aPIResponse.Message = "Supplier Updated Successfully";
                            aPIResponse.Result = supplierDetails;
                            return Ok(aPIResponse);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Supplier Record not found.";
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        SupplierDetails ObjSupplierDetails = new SupplierDetails();
                        ObjSupplierDetails.SupplierName = supplierViewModel.SupplierName;
                        //ObjSupplierDetails.SupplierId = supplierViewModel.SupplierId;
                        ObjSupplierDetails.IsActive = true;
                        ObjSupplierDetails.IsDelete = false;
                        ObjSupplierDetails.CreatedDate = DateTime.Now;
                        ObjSupplierDetails.FranchiseId = supplierViewModel.FranchiseId;
                        ObjSupplierDetails.SupplierAddress = supplierViewModel.SupplierAddress;
                        ObjSupplierDetails.SupplierCity = supplierViewModel.SupplierCity;
                        ObjSupplierDetails.SupplierContactNo = supplierViewModel.SupplierContactNo;
                        ObjSupplierDetails.CompanyName = supplierViewModel.CompanyName;
                        ObjSupplierDetails.Cellphone = supplierViewModel.Cellphone;
                        ObjSupplierDetails.Email = supplierViewModel.Email;
                        db.SupplierDetails.Add(ObjSupplierDetails);
                        db.SaveChanges();
                        ObjSupplierDetails.IsActive = true;
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Supplier Inserted Successfully";
                        aPIResponse.Result = ObjSupplierDetails;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
            }
        }

        [HttpDelete]
        [Route("DeleteSupplier")]
        public IActionResult DeleteSupplier(int SupplierId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var supplierDetails = db.SupplierDetails.Where(w => w.SupplierId == SupplierId).FirstOrDefault();
                    supplierDetails.IsDelete = true;
                    supplierDetails.IsActive = false;
                    supplierDetails.DeletedDate = DateTime.Now;
                    db.SaveChanges();
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Deleted Successfully";
                    aPIResponse.Result = supplierDetails;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }

        #endregion

        public void AddItemExcel(ItemsProductViewModel itemsProductViewModel)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var itemproduct = db.Item.Where(w => w.Sku == itemsProductViewModel.Sku && w.IsDeleted == false && w.IsActive == true).FirstOrDefault();
                    if (itemproduct != null)
                    {
                        itemproduct.CategoryId = itemsProductViewModel.CategoryId == 0 ? itemproduct.CategoryId : itemsProductViewModel.CategoryId;
                        itemproduct.SubCategoryId = itemsProductViewModel.SubCategoryId == 0 ? itemproduct.SubCategoryId : itemsProductViewModel.SubCategoryId;
                        itemproduct.FranchiseId = itemsProductViewModel.FranchiseId;
                        itemproduct.ItemName = itemsProductViewModel.ItemName == null ? itemproduct.ItemName : itemsProductViewModel.ItemName;
                        itemproduct.ItemSalePrice = itemsProductViewModel.ItemSalePrice == null ? itemproduct.ItemSalePrice : itemsProductViewModel.ItemSalePrice;
                        itemproduct.ItemRentPrice = itemsProductViewModel.ItemRentPrice == null ? itemproduct.ItemRentPrice : itemsProductViewModel.ItemRentPrice;
                        itemproduct.ManufacturedDate = itemsProductViewModel.ManufacturedDate == null ? itemproduct.ManufacturedDate : itemsProductViewModel.ManufacturedDate;
                        itemproduct.PackingDate = itemsProductViewModel.PackingDate == null ? itemproduct.PackingDate : itemsProductViewModel.PackingDate;
                        itemproduct.Discount = itemsProductViewModel.Discount == null ? itemproduct.Discount : itemsProductViewModel.Discount;
                        itemproduct.QuantityStock = itemsProductViewModel.QuantityStock == null ? itemproduct.QuantityStock : itemsProductViewModel.QuantityStock;
                        itemproduct.Sku = itemsProductViewModel.Sku == null ? itemproduct.Sku : itemsProductViewModel.Sku;
                        itemproduct.Barcode = itemsProductViewModel.Barcode == null ? itemproduct.Barcode : itemsProductViewModel.Barcode;
                        itemproduct.Tax = itemsProductViewModel.Tax == null ? itemproduct.Tax : itemsProductViewModel.Tax;
                        itemproduct.ExpirationDate = itemsProductViewModel.ExpirationDate == null ? itemproduct.ExpirationDate : itemsProductViewModel.ExpirationDate;
                        itemproduct.UnitMeasurementId = itemsProductViewModel.UnitMeasurementId == null ? itemproduct.UnitMeasurementId : itemsProductViewModel.UnitMeasurementId;
                        itemproduct.UnitCategoryId = itemsProductViewModel.UnitCategoryId == null ? itemproduct.UnitCategoryId : itemsProductViewModel.UnitCategoryId;
                        itemproduct.IsRented = itemsProductViewModel.IsRented == null ? itemproduct.IsRented : itemsProductViewModel.IsRented;
                        itemproduct.ItemRentPrice = itemsProductViewModel.ItemRentPrice == null ? itemproduct.ItemRentPrice : itemsProductViewModel.ItemRentPrice;
                        itemproduct.Description = itemsProductViewModel.Description == null ? itemproduct.Description : itemsProductViewModel.Description;
                        itemproduct.SupplierId = itemsProductViewModel.SupplierId == null ? itemproduct.SupplierId : itemsProductViewModel.SupplierId;
                        itemproduct.ProductLogo = itemsProductViewModel.ProductLogo == null ? itemproduct.ProductLogo : "data:image/jpeg;base64,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";
                        itemproduct.IsGroup = false;
                        itemproduct.MinimumStockValue = itemsProductViewModel.MinimumStock;
                        db.SaveChanges();
                    }
                    else
                    {
                        Item ObjItem = new Item();
                        ObjItem.CategoryId = itemsProductViewModel.CategoryId;
                        ObjItem.CreatedDate = DateTime.Now;
                        ObjItem.IsDeleted = false;
                        ObjItem.IsActive = true;
                        ObjItem.SubCategoryId = itemsProductViewModel.SubCategoryId;
                        ObjItem.FranchiseId = itemsProductViewModel.FranchiseId;
                        ObjItem.ItemName = itemsProductViewModel.ItemName;
                        ObjItem.ItemSalePrice = itemsProductViewModel.ItemSalePrice;
                        ObjItem.ItemRentPrice = itemsProductViewModel.ItemRentPrice;
                        ObjItem.ManufacturedDate = itemsProductViewModel.ManufacturedDate;
                        ObjItem.PackingDate = itemsProductViewModel.PackingDate;
                        ObjItem.Discount = itemsProductViewModel.Discount;
                        ObjItem.QuantityStock = itemsProductViewModel.QuantityStock;
                        ObjItem.Sku = itemsProductViewModel.Sku;
                        ObjItem.Barcode = itemsProductViewModel.Barcode;
                        ObjItem.Tax = itemsProductViewModel.Tax;
                        ObjItem.ExpirationDate = itemsProductViewModel.ExpirationDate;
                        ObjItem.UnitMeasurementId = itemsProductViewModel.UnitMeasurementId;
                        ObjItem.UnitCategoryId = itemsProductViewModel.UnitCategoryId;
                        ObjItem.IsRented = itemsProductViewModel.IsRented;
                        ObjItem.ItemRentPrice = itemsProductViewModel.ItemRentPrice;
                        ObjItem.Description = itemsProductViewModel.Description;
                        ObjItem.SupplierId = itemsProductViewModel.SupplierId;
                        ObjItem.ProductLogo = itemsProductViewModel.ProductLogo == null ? "data:image/jpeg;base64,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" : itemsProductViewModel.ProductLogo;
                        ObjItem.IsGroup = false;
                        ObjItem.IsRented = itemsProductViewModel.IsRented;
                        ObjItem.MinimumStockValue = itemsProductViewModel.MinimumStock;
                        db.Item.Add(ObjItem);
                        db.SaveChanges();
                    }
                }
            }
            catch (Exception exception)
            {

            }

        }

        [HttpPost]
        [Route("UploadExcel")]
        public async Task<IActionResult> ExcelUpload(int franchiseId, int SupplierId, string SupplyName, int CreatedBy)
        {
            try
            {
                string imageName = null;
                int abc = 0;
                int abc1 = 0;
                int abc2 = 0;
                var httpRequest = HttpContext.Request.Form;
                var file = httpRequest.Files[0];
                if (file == null || file.Length == 0)
                {
                    aPIResponse.StatusCode = 404;
                    aPIResponse.Message = "File not selected";
                    return Ok(aPIResponse);
                }
                Guid guid;
                guid = Guid.NewGuid();
                var path = "CSVFiles/" + guid + "-" + DateTime.Now.ToString("dd-MMM-yyyy") + ".xlsx";
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
                using (var stream = new FileStream(path, FileMode.Open, FileAccess.Read))
                {

                    //open file and returns as Stream

                    IExcelDataReader excelReader = ExcelReaderFactory.CreateReader(stream);
                    DataSet result = excelReader.AsDataSet(new ExcelDataSetConfiguration()
                    {
                        ConfigureDataTable = (_) => new ExcelDataTableConfiguration()
                        {
                            UseHeaderRow = true,
                        }
                    });
                    DataTable dt = result.Tables[0];

                    foreach (DataRow item in dt.Rows)
                    {
                        if (item["#"].ToString() != "")
                        {
                            ItemsProductViewModel items = new ItemsProductViewModel();
                            items.Sku = item["SKU"].ToString();
                            items.ItemName = item["NOMBRE (name)"].ToString();
                            items.ItemSalePrice = item["PRECIO (price to buy)"].ToString() == "" ? 0 : Convert.ToDecimal(item["PRECIO (price to buy)"].ToString());
                            items.ItemRentPrice = item["RENTA (price to rent)"].ToString() == "" ? 0 : Convert.ToDecimal(item["RENTA (price to rent)"].ToString());
                            items.QuantityStock = item["CANTIDAD (stock)"].ToString() == "" ? 0 : Convert.ToInt32(item["CANTIDAD (stock)"].ToString());
                            items.Description = item["DESCRIPCION (description)"].ToString();
                            items.FranchiseId = franchiseId;
                            string h = item["CATEGORIAS (categories)"].ToString();
                            if (h != "")
                            {
                                CategoryViewModel cateViewModel = new CategoryViewModel();
                                cateViewModel.CategoryName = h.Split('/')[0].Trim();
                                cateViewModel.CategoryDescription = h.Split('/')[0].Trim();
                                cateViewModel.ParentCategoryId = 0;
                                cateViewModel.FranchiseId = franchiseId;
                                abc = AddEditCategoryExcel(cateViewModel);
                                CategoryViewModel cateViewModel1 = new CategoryViewModel();
                                cateViewModel1.CategoryName = h.Split('/')[1].Trim();
                                cateViewModel1.CategoryId = abc;
                                cateViewModel1.CategoryDescription = h.Split('/')[1].Trim();
                                cateViewModel1.ParentCategoryId = abc;
                                cateViewModel1.FranchiseId = franchiseId;
                                abc1 = AddEditCategoryExcel(cateViewModel1);
                            }
                            items.CategoryId = abc;
                            items.SubCategoryId = abc1;
                            string l = item["ATRIBUTOS (attributes)"].ToString();
                            if (l != "")
                            {
                                UnitCategoryViewModel UnitCategoryViewModel = new UnitCategoryViewModel();
                                UnitCategoryViewModel.UnitCategoryName = l.Split('/')[0].Trim();
                                abc = AddEditUnitCategoryExcel(UnitCategoryViewModel);
                                UnitMeasurementViewModel UnitMeasurementViewModel = new UnitMeasurementViewModel();
                                UnitMeasurementViewModel.UnitMeasurementName = l.Split('/')[1].Trim();
                                UnitMeasurementViewModel.UnitCategoryId = abc;
                                abc1 = AddEditUnitMeasurementExcel(UnitMeasurementViewModel);
                                items.UnitCategoryId = abc;
                                items.UnitMeasurementId = abc1;
                            }
                            items.ManufacturedDate = String.IsNullOrEmpty(item["ManufacturedDate"].ToString()) ? DateTime.Now : Convert.ToDateTime(item["ManufacturedDate"].ToString());
                            items.PackingDate = String.IsNullOrEmpty(item["PackingDate"].ToString()) ? DateTime.Now : Convert.ToDateTime(item["PackingDate"].ToString());
                            items.Discount = Convert.ToDecimal(item["Discount"].ToString());
                            items.ExpirationDate = item["ExpirationDate"].ToString() == "" ? DateTime.Now : Convert.ToDateTime(item["ExpirationDate"].ToString());
                            items.MinimumStock = item["MinimumStockValue"].ToString() == "" ? 0 : Convert.ToInt32(item["MinimumStockValue"].ToString());
                            items.Barcode = item["BarCode"].ToString();
                            string isrented = item["IsRented"].ToString();
                            if (isrented == "Yes")
                                items.IsRented = true;
                            else
                                items.IsRented = false;

                            items.SupplierId = SupplierId;
                            AddItemExcel(items);
                        }
                    }
                    ItemImportViewModel itemimport = new ItemImportViewModel();
                    itemimport.CreatedBy = CreatedBy;
                    itemimport.FranchiseId = franchiseId;
                    itemimport.SupplierId = SupplierId;
                    itemimport.SupplyName = SupplyName;
                    itemimport.FileName = guid + "-" + DateTime.Now.ToString("dd-MMM-yyyy") + ".xlsx";
                    AddItemImport(itemimport);
                    excelReader.Close();
                }

                aPIResponse.StatusCode = 200;
                aPIResponse.Message = "Imported Successfully";
                return Ok(aPIResponse);
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }

        public void AddItemImport(ItemImportViewModel itemImportViewModel)
        {
            using (var db = new POSRentingContext())
            {
                ItemImport ObjItem = new ItemImport();
                ObjItem.CreatedDate = DateTime.Now;
                ObjItem.FranchiseId = itemImportViewModel.FranchiseId;
                ObjItem.CreatedBy = itemImportViewModel.CreatedBy;
                ObjItem.SupplyName = itemImportViewModel.SupplyName;
                ObjItem.SupplierId = itemImportViewModel.SupplierId;
                ObjItem.FileName = itemImportViewModel.FileName;
                db.ItemImport.Add(ObjItem);
                db.SaveChanges();
            }

        }

        public int AddEditCategoryExcel(CategoryViewModel categoryViewModel)
        {
            try
            {
                using (var db = new POSRentingContext())
                {

                    var category = db.Category.Where(w => w.IsActive == true && w.IsDeleted == false && w.CategoryName == categoryViewModel.CategoryName && w.FranchiseId == categoryViewModel.FranchiseId).FirstOrDefault();
                    if (category != null && category.CategoryId > 0)
                    {
                        category.CategoryName = categoryViewModel.CategoryName;
                        category.CategoryDescription = categoryViewModel.CategoryDescription;
                        category.ParentCategoryId = categoryViewModel.ParentCategoryId;
                        category.FranchiseId = categoryViewModel.FranchiseId;
                        db.SaveChanges();
                        return category.CategoryId;
                    }
                    else
                    {
                        Category Objcategory = new Category();
                        Objcategory.CategoryName = categoryViewModel.CategoryName;
                        Objcategory.CategoryDescription = categoryViewModel.CategoryDescription;
                        Objcategory.ParentCategoryId = categoryViewModel.CategoryId;
                        Objcategory.IsActive = true;
                        Objcategory.IsDeleted = false;
                        Objcategory.CreatedDate = DateTime.Now;
                        Objcategory.FranchiseId = categoryViewModel.FranchiseId;
                        db.Category.Add(Objcategory);
                        db.SaveChanges();
                        return Objcategory.CategoryId;
                    }

                }
            }
            catch (Exception exception)
            {
                return 0;
                throw;
            }
        }


        public int AddEditUnitCategoryExcel(UnitCategoryViewModel unitViewModel)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var unitCategory = db.UnitCategory.Where(w => w.IsActive == true && w.IsDeleted == false && w.UnitCategoryName == unitViewModel.UnitCategoryName).FirstOrDefault();
                    if (unitCategory != null && unitCategory.UnitCategoryId > 0)
                    {
                        unitCategory.UnitCategoryName = unitViewModel.UnitCategoryName;
                        db.SaveChanges();
                        return unitCategory.UnitCategoryId;
                    }
                    else
                    {
                        UnitCategory ObjUnitCategory = new UnitCategory();
                        ObjUnitCategory.UnitCategoryName = unitViewModel.UnitCategoryName;
                        ObjUnitCategory.IsActive = true;
                        ObjUnitCategory.IsDeleted = false;
                        ObjUnitCategory.CreatedDate = DateTime.Now;
                        db.UnitCategory.Add(ObjUnitCategory);
                        db.SaveChanges();
                        return ObjUnitCategory.UnitCategoryId;
                    }
                }
            }
            catch (Exception exception)
            {
                return 0;
                throw;
            }
        }

        public int AddEditUnitMeasurementExcel(UnitMeasurementViewModel unitViewModel)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var unitCategory = db.UnitMeasurement.Where(w => w.IsActive == true && w.IsDeleted == false && w.UnitMeasurementName == unitViewModel.UnitMeasurementName && w.UnitCategoryId == unitViewModel.UnitCategoryId).FirstOrDefault();
                    if (unitCategory != null && unitCategory.UnitCategoryId > 0)
                    {
                        unitCategory.UnitMeasurementName = unitViewModel.UnitMeasurementName;
                        unitCategory.UnitCategoryId = unitViewModel.UnitCategoryId;
                        db.SaveChanges();
                        return unitCategory.UnitMeasurementId;
                    }
                    else
                    {
                        UnitMeasurement ObjUnitMeasurement = new UnitMeasurement();
                        ObjUnitMeasurement.UnitMeasurementName = unitViewModel.UnitMeasurementName;
                        ObjUnitMeasurement.UnitCategoryId = unitViewModel.UnitCategoryId;
                        ObjUnitMeasurement.IsActive = true;
                        ObjUnitMeasurement.IsDeleted = false;
                        ObjUnitMeasurement.CreatedDate = DateTime.Now;
                        db.UnitMeasurement.Add(ObjUnitMeasurement);
                        db.SaveChanges();
                        return ObjUnitMeasurement.UnitMeasurementId;
                    }
                }
            }
            catch (Exception exception)
            {
                return 0;
                throw;
            }
        }

        public int getBySupplierName(string Name)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var supplierDetails = db.SupplierDetails.Where(w => w.SupplierName == Name).FirstOrDefault();
                    return supplierDetails.SupplierId;
                }
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        private IActionResult AddGuestCustomers(CustomerViewModel customerViewModel)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    Customer ObjCustomerviewModel = new Customer();
                    ObjCustomerviewModel.CustomerName = customerViewModel.CustomerName;
                    ObjCustomerviewModel.IsActive = false;
                    ObjCustomerviewModel.IsDeleted = false;
                    ObjCustomerviewModel.CreatedDate = DateTime.Now;
                    ObjCustomerviewModel.DeletedDate = DateTime.Now;
                    ObjCustomerviewModel.IsGuest = true;
                    ObjCustomerviewModel.FranchiseId = customerViewModel.FranchiseId;
                    ObjCustomerviewModel.CustomerContactNo = customerViewModel.CustomerContactNo;
                    db.Customer.Add(ObjCustomerviewModel);
                    db.SaveChanges();
                    aPIResponse.StatusCode = 10001;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjCustomerviewModel;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }

        #region Customer
        [HttpGet]
        [Route("GetCustomers")]
        public IActionResult GetCustomers(int FranchiseId)
        {
            try
            {
                List<CustomerViewModel> ObjListCustomerViewModel = new List<CustomerViewModel>();
                using (var db = new POSRentingContext())
                {
                    List<Customer> customers = new List<Customer>();
                    if (FranchiseId > 0)
                    {
                        customers = db.Customer.Where(w => w.FranchiseId == FranchiseId && w.IsActive == true && w.IsDeleted == false && w.IsGuest == false).ToList();
                    }
                    else
                    {
                        customers = db.Customer.Where(w => w.IsActive == true && w.IsDeleted == false && w.IsGuest == false).ToList();
                    }
                    foreach (var item in customers)
                    {
                        CustomerViewModel ObjCustomerviewModel = new CustomerViewModel();
                        ObjCustomerviewModel.CustomerName = item.CustomerName;
                        ObjCustomerviewModel.CustomerContactNo = item.CustomerContactNo;
                        ObjCustomerviewModel.CustomerAddress = item.CustomerAddress;
                        ObjCustomerviewModel.CustomerId = item.CustomerId;
                        ObjCustomerviewModel.DateOfBirth = item.DateOfBirth;
                        ObjCustomerviewModel.FranchiseId = item.FranchiseId == null ? 0 : item.FranchiseId.Value;
                        ObjCustomerviewModel.IsActive = item.IsActive;
                        if (ObjCustomerviewModel.FranchiseId > 0)
                        {
                            ObjCustomerviewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == ObjCustomerviewModel.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        }
                        else
                        {
                            ObjCustomerviewModel.FranchiseName = "";
                        }
                        ObjCustomerviewModel.NickName = item.NickName;
                        ObjCustomerviewModel.ContactName = item.ContactName;
                        ObjCustomerviewModel.ContactTitle = item.ContactTitle;
                        ObjCustomerviewModel.City = item.City;
                        ObjCustomerviewModel.Region = item.Region;
                        ObjCustomerviewModel.PostalCode = item.PostalCode;
                        ObjCustomerviewModel.Country = item.Country;
                        ObjCustomerviewModel.Fax = item.Fax;
                        ObjListCustomerViewModel.Add(ObjCustomerviewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successfully";
                    aPIResponse.Result = ObjListCustomerViewModel;
                    return Ok(aPIResponse);
                };
                //}
            }
            catch (Exception)
            {

                throw;
            }
        }


        [HttpGet]
        [Route("GetSelectedCustomers")]
        public IActionResult GetSelectedCustomers(int CustomerId)
        {
            try
            {
                List<CustomerViewModel> ObjListCustomerViewModel = new List<CustomerViewModel>();
                using (var db = new POSRentingContext())
                {
                    List<Customer> customers = db.Customer.Where(w => w.IsActive == true && w.IsDeleted == false && w.IsGuest == false && w.CustomerId == CustomerId).ToList();
                    foreach (var item in customers)
                    {
                        CustomerViewModel ObjCustomerviewModel = new CustomerViewModel();
                        ObjCustomerviewModel.CustomerName = item.CustomerName;
                        ObjCustomerviewModel.CustomerContactNo = item.CustomerContactNo;
                        ObjCustomerviewModel.CustomerAddress = item.CustomerAddress;
                        ObjCustomerviewModel.CustomerId = item.CustomerId;
                        ObjCustomerviewModel.DateOfBirth = item.DateOfBirth;
                        ObjCustomerviewModel.FranchiseId = item.FranchiseId == null ? 0 : item.FranchiseId.Value;
                        ObjCustomerviewModel.IsActive = item.IsActive;
                        if (ObjCustomerviewModel.FranchiseId > 0)
                        {
                            ObjCustomerviewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == ObjCustomerviewModel.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        }
                        else
                        {
                            ObjCustomerviewModel.FranchiseName = "";
                        }
                        ObjCustomerviewModel.NickName = item.NickName;
                        ObjCustomerviewModel.ContactName = item.ContactName;
                        ObjCustomerviewModel.ContactTitle = item.ContactTitle;
                        ObjCustomerviewModel.City = item.City;
                        ObjCustomerviewModel.Region = item.Region;
                        ObjCustomerviewModel.PostalCode = item.PostalCode;
                        ObjCustomerviewModel.Country = item.Country;
                        ObjCustomerviewModel.Fax = item.Fax;
                        ObjListCustomerViewModel.Add(ObjCustomerviewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successfully";
                    aPIResponse.Result = ObjListCustomerViewModel;
                    return Ok(aPIResponse);
                };
                //}
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpGet]
        [Route("GetAllCustomers")]
        public IActionResult GetAllCustomers(int FranchiseId)
        {
            try
            {
                List<CustomerViewModel> ObjListCustomerViewModel = new List<CustomerViewModel>();
                using (var db = new POSRentingContext())
                {
                    List<Customer> customers = new List<Customer>();
                    if (FranchiseId > 0)
                    {
                        customers = db.Customer.Where(w => w.FranchiseId == FranchiseId && w.IsDeleted == false && w.IsGuest == false).ToList();
                    }
                    else
                    {
                        customers = db.Customer.Where(w => w.IsDeleted == false && w.IsGuest == false).ToList();
                    }
                    foreach (var item in customers)
                    {
                        CustomerViewModel ObjCustomerviewModel = new CustomerViewModel();
                        ObjCustomerviewModel.CustomerName = item.CustomerName;
                        ObjCustomerviewModel.CustomerContactNo = item.CustomerContactNo;
                        ObjCustomerviewModel.CustomerAddress = item.CustomerAddress;
                        ObjCustomerviewModel.CustomerId = item.CustomerId;
                        ObjCustomerviewModel.DateOfBirth = item.DateOfBirth;
                        ObjCustomerviewModel.FranchiseId = item.FranchiseId == null ? 0 : item.FranchiseId.Value;
                        ObjCustomerviewModel.IsActive = item.IsActive;
                        if (ObjCustomerviewModel.FranchiseId > 0)
                        {
                            ObjCustomerviewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == ObjCustomerviewModel.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        }
                        else
                        {
                            ObjCustomerviewModel.FranchiseName = "";
                        }
                        ObjListCustomerViewModel.Add(ObjCustomerviewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successfully";
                    aPIResponse.Result = ObjListCustomerViewModel;
                    return Ok(aPIResponse);
                };
                //}
            }
            catch (Exception)
            {

                throw;
            }
        }

        [HttpPost]
        [Route("AddEditCustomers")]
        public IActionResult AddEditCustomers(CustomerViewModel customerViewModel)
        {
            try
            {
                if (customerViewModel.CustomerId > 0)
                {

                    using (var db = new POSRentingContext())
                    {
                        // var customers = db.Customer.Where(w => w.CustomerId == customerViewModel.CustomerId && w.IsActive == true && w.IsDeleted == false).FirstOrDefault();
                        var customers = db.Customer.Where(w => w.CustomerId == customerViewModel.CustomerId && w.IsDeleted == false).FirstOrDefault();

                        //var duplicateusr = db.User.Where(w => w.UserName == userViewModel.UserName && w.UserId != userViewModel.UserId).Any();
                        if (customers != null)
                        {
                            var duplicatecustomer = db.Customer.Where(w => w.CustomerContactNo == customerViewModel.CustomerContactNo && w.CustomerId != customerViewModel.CustomerId && w.FranchiseId == customerViewModel.FranchiseId).Any();
                            if (!duplicatecustomer)
                            {

                                CustomerViewModel ObjCustomerviewModel = new CustomerViewModel();
                                customers.CustomerName = customerViewModel.CustomerName;
                                customers.CustomerContactNo = customerViewModel.CustomerContactNo;
                                customers.CustomerAddress = customerViewModel.CustomerAddress;
                                customers.DateOfBirth = customerViewModel.DateOfBirth;
                                customers.CustomerId = customerViewModel.CustomerId;
                                customers.FranchiseId = customerViewModel.FranchiseId;
                                customers.ContactName = customerViewModel.ContactName;
                                customers.ContactTitle = customerViewModel.ContactTitle;
                                customers.Country = customerViewModel.Country;
                                customers.City = customerViewModel.City;
                                customers.Region = customerViewModel.Region;
                                customers.PostalCode = customerViewModel.PostalCode;
                                customers.Fax = customerViewModel.Fax;
                                customers.NickName = customerViewModel.NickName;
                                customers.IsGuest = false;
                                db.SaveChanges();
                                customerViewModel.CustomerId = customers.CustomerId;
                                customerViewModel.FranchiseName = customerViewModel.FranchiseId == 0 ? "" : db.Franchise.Where(w => w.FranchiseId == customerViewModel.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                                aPIResponse.StatusCode = 200;
                                // customerViewModel.IsActive = true;
                                customerViewModel.IsActive = customers.IsActive == null ? false : customers.IsActive;
                                aPIResponse.Message = "Customer Updated Successfully";
                                aPIResponse.Result = customerViewModel;
                            }
                            else
                            {
                                aPIResponse.StatusCode = 100001;
                                aPIResponse.Message = "Customer already registered with" + customerViewModel.CustomerContactNo + " Number";
                                aPIResponse.Result = customerViewModel;
                            }
                        }
                        return Ok(aPIResponse);
                    };
                }
                else
                {

                    using (var db = new POSRentingContext())
                    {
                        var customers = db.Customer.Where(w => w.CustomerContactNo == customerViewModel.CustomerContactNo && w.FranchiseId == customerViewModel.FranchiseId).Any();
                        if (!customers)
                        {
                            Customer ObjCustomerviewModel = new Customer();
                            ObjCustomerviewModel.CustomerName = customerViewModel.CustomerName;
                            ObjCustomerviewModel.CustomerContactNo = customerViewModel.CustomerContactNo;
                            ObjCustomerviewModel.CustomerAddress = customerViewModel.CustomerAddress;
                            ObjCustomerviewModel.CustomerId = customerViewModel.CustomerId;
                            ObjCustomerviewModel.DateOfBirth = customerViewModel.DateOfBirth;
                            ObjCustomerviewModel.IsActive = true;
                            ObjCustomerviewModel.IsDeleted = false;
                            ObjCustomerviewModel.IsGuest = false;
                            ObjCustomerviewModel.CreatedDate = DateTime.Now;
                            ObjCustomerviewModel.DeletedDate = DateTime.Now;
                            ObjCustomerviewModel.FranchiseId = customerViewModel.FranchiseId;
                            ObjCustomerviewModel.ContactName = customerViewModel.ContactName;
                            ObjCustomerviewModel.ContactTitle = customerViewModel.ContactTitle;
                            ObjCustomerviewModel.Country = customerViewModel.Country;
                            ObjCustomerviewModel.City = customerViewModel.City;
                            ObjCustomerviewModel.Region = customerViewModel.Region;
                            ObjCustomerviewModel.PostalCode = customerViewModel.PostalCode;
                            ObjCustomerviewModel.Fax = customerViewModel.Fax;
                            ObjCustomerviewModel.NickName = customerViewModel.NickName;
                            db.Customer.Add(ObjCustomerviewModel);
                            db.SaveChanges();
                            customerViewModel.CustomerId = ObjCustomerviewModel.CustomerId;
                            customerViewModel.FranchiseName = customerViewModel.FranchiseId == 0 ? "" : db.Franchise.Where(w => w.FranchiseId == customerViewModel.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                            aPIResponse.StatusCode = 200;
                            customerViewModel.IsActive = true;
                            aPIResponse.Message = "Customer Inserted Successfully";
                            aPIResponse.Result = customerViewModel;
                            return Ok(aPIResponse);
                        }
                        else
                        {
                            aPIResponse.StatusCode = 100001;
                            aPIResponse.Message = "Customer already registered with" + customerViewModel.CustomerContactNo + " Number";
                            aPIResponse.Result = customerViewModel;
                            return Ok(aPIResponse);
                        }
                    };
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }


        [HttpDelete]
        [Route("DeleteCustomer")]
        public IActionResult DeleteCustomer(int CustomerId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var customer = db.Customer.Where(w => w.CustomerId == CustomerId).FirstOrDefault();
                    customer.IsDeleted = true;
                    customer.IsActive = false;
                    customer.DeletedDate = DateTime.Now;
                    db.SaveChanges();

                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Deleted Successfully";
                    aPIResponse.Result = customer;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }


        #endregion

        [HttpGet]
        [Route("GetReturnableProduct")]
        public IActionResult ReturnableProduct(int FranchiseId)
        {
            DateTime dt = DateTime.Now.Date;
            var list = new List<RentViewModel>();
            try
            {
                using (var db = new POSRentingContext())
                {
                    if (FranchiseId == 0)
                    {
                        list = (from p in db.Rent
                                join q in db.RentDetails on p.RentId equals q.RentId
                                join r in db.Item on q.ItemId equals r.ItemId
                                join s in db.Franchise on p.FranchiseId equals s.FranchiseId
                                where p.ReturnDate >= dt && p.ReturnDate <= dt.AddDays(7) && p.IsDeleted == false && p.IsActive == true && p.IsReturned == "false"
                                select new RentViewModel
                                {
                                    RentID = q.RentId.Value,
                                    ItemName = r.ItemName,
                                    ProductLogo = r.ProductLogo,
                                    RentedOn = p.RentedOn,
                                    FranchiseName = s.FranchiseName,
                                    ReturnDate = p.ReturnDate,
                                    SKU = r.Sku,
                                    IssuedName = db.Customer.Where(w => w.CustomerId == p.CustomerId).Select(s => s.CustomerName).FirstOrDefault()
                                }).OrderBy(o => o.FranchiseName).ToList();



                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successfully";
                        aPIResponse.Result = list;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        list = (from p in db.Rent
                                join q in db.RentDetails on p.RentId equals q.RentId
                                join r in db.Item on q.ItemId equals r.ItemId
                                join s in db.Franchise on p.FranchiseId equals s.FranchiseId
                                where p.ReturnDate >= dt && p.ReturnDate <= dt.AddDays(7) && p.FranchiseId == FranchiseId && p.IsDeleted == false && p.IsActive == true && p.IsReturned == "false"
                                select new RentViewModel
                                {
                                    RentID = q.RentId.Value,
                                    ItemName = r.ItemName,
                                    ProductLogo = r.ProductLogo,
                                    RentedOn = p.RentedOn,
                                    FranchiseName = s.FranchiseName,
                                    ReturnDate = p.ReturnDate,
                                    SKU = r.Sku,
                                    IssuedName = db.User.Where(w => w.UserId == p.IssuedBy).Select(s => s.FirstName).FirstOrDefault()
                                }).OrderBy(o => o.FranchiseName).ToList();

                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successfully";
                        aPIResponse.Result = list;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 200;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }

        [HttpGet]
        [Route("GetALLReturnableProduct")]
        public IActionResult AllReturnableProduct(int FranchiseId)
        {
            DateTime dt = DateTime.Now;
            var list = new List<RentViewModel>();
            try
            {
                using (var db = new POSRentingContext())
                {
                    if (FranchiseId == 0)
                    {
                        List<RentFranchiseViewModel> RentFranchiseViewModelList = new List<RentFranchiseViewModel>();
                        var franchise = db.Franchise.Where(w => w.IsActive == true && w.IsDeleted == false).ToList();
                        foreach (var item in franchise)
                        {
                            RentFranchiseViewModel ObjRentFranchiseViewModel = new RentFranchiseViewModel();
                            list = (from p in db.Rent
                                    join q in db.RentDetails on p.RentId equals q.RentId
                                    join r in db.Item on q.ItemId equals r.ItemId
                                    join s in db.Franchise on p.FranchiseId equals s.FranchiseId
                                    where p.ReturnDate >= dt && p.ReturnDate <= dt.AddDays(7) && p.FranchiseId == item.FranchiseId && p.IsDeleted == false && p.IsActive == true && p.IsReturned == "false"
                                    select new RentViewModel
                                    {
                                        RentID = q.RentId.Value,
                                        ItemName = r.ItemName,
                                        ProductLogo = r.ProductLogo,
                                        RentedOn = p.RentedOn,
                                        FranchiseName = s.FranchiseName,
                                        ReturnDate = p.ReturnDate,
                                        SKU = r.Sku,
                                        IssuedName = db.Customer.Where(w => w.CustomerId == p.CustomerId).Select(s => s.CustomerName).FirstOrDefault()
                                    }).ToList();

                            ObjRentFranchiseViewModel.FranchiseId = item.FranchiseId;
                            ObjRentFranchiseViewModel.FranchiseName = item.FranchiseName;
                            ObjRentFranchiseViewModel.RentViewlist = list;
                            RentFranchiseViewModelList.Add(ObjRentFranchiseViewModel);
                            RentFranchiseViewModelList = RentFranchiseViewModelList.OrderBy(o => o.FranchiseName).ToList();
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successfully";
                        aPIResponse.Result = RentFranchiseViewModelList;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        List<RentFranchiseViewModel> RentFranchiseViewModelList = new List<RentFranchiseViewModel>();
                        RentFranchiseViewModel ObjRentFranchiseViewModel = new RentFranchiseViewModel();
                        list = (from p in db.Rent
                                join q in db.RentDetails on p.RentId equals q.RentId
                                join r in db.Item on q.ItemId equals r.ItemId
                                join s in db.Franchise on p.FranchiseId equals s.FranchiseId
                                where p.ReturnDate >= dt && p.ReturnDate <= dt.AddDays(7) && p.FranchiseId == FranchiseId && p.IsDeleted == false && p.IsActive == true && p.IsReturned == "false"
                                select new RentViewModel
                                {
                                    RentID = q.RentId.Value,
                                    ItemName = r.ItemName,
                                    ProductLogo = r.ProductLogo,
                                    RentedOn = p.RentedOn,
                                    FranchiseName = s.FranchiseName,
                                    SKU = r.Sku,
                                    ReturnDate = p.ReturnDate,
                                    IssuedName = db.User.Where(w => w.UserId == p.IssuedBy).Select(s => s.FirstName).FirstOrDefault()
                                }).ToList();
                        ObjRentFranchiseViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        ObjRentFranchiseViewModel.FranchiseId = FranchiseId;
                        ObjRentFranchiseViewModel.RentViewlist = list;
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successfully";
                        aPIResponse.Result = ObjRentFranchiseViewModel;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 200;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }

        #region Sale
        [HttpPost]
        [Route("AddSale")]
        public IActionResult AddSale(Sale sale)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    string billno = "";
                    List<SaleDetails> saleList = sale.SaleDetails;
                    var saleLast = db.Sale.DefaultIfEmpty().Last();
                    if (saleLast != null)
                    {
                        if (saleLast.BillNumber != "")
                        {
                            long bill = Convert.ToInt64(saleLast.BillNumber.Split('-')[1]) + 1;
                            billno = "MR-" + bill;
                        }
                    }
                    else
                    {
                        billno = "MR-" + "1000001";
                    }
                    Sale saleinfo = new Sale();

                    saleinfo.CustomerId = sale.CustomerId;
                    saleinfo.BillNumber = billno;
                    saleinfo.SaleDate = DateTime.Now;
                    saleinfo.SaleTotalPrice = sale.SaleTotalPrice;
                    saleinfo.FranchiseId = sale.FranchiseId;
                    saleinfo.IsActive = true;
                    saleinfo.IsDeleted = false;
                    saleinfo.CreatedDate = DateTime.Now;
                    saleinfo.Quantity = sale.Quantity;
                    saleinfo.Amount = sale.Amount;
                    saleinfo.Discount = sale.Discount;
                    saleinfo.ReceivedAmount = sale.ReceivedAmount;
                    saleinfo.BalanceAmount = sale.BalanceAmount;
                    saleinfo.CreditCardReceiptNo = sale.CreditCardReceiptNo;
                    saleinfo.TotalCreditAmount = sale.TotalCreditAmount;
                    saleinfo.RequestedbyCard = sale.RequestedbyCard;
                    saleinfo.CreditCardNo = sale.CreditCardNo;
                    saleinfo.Remark = sale.Remark;
                    saleinfo.PaymentCardType = sale.PaymentCardType;
                    saleinfo.Notes = sale.Notes;
                    saleinfo.CreatedBy = sale.CreatedBy;
                    saleinfo.CouponCode = sale.CouponCode;
                    saleinfo.CouponValue = sale.CouponValue;
                    saleinfo.ShippingAmount = sale.ShippingAmount;
                    if (saleinfo.CustomerId == null)
                    {
                        saleinfo.CustomerId = GetGuestCustomerByFranchiseIdd(saleinfo.FranchiseId);
                    }
                    db.Sale.Add(saleinfo);
                    db.SaveChanges();
                    AddSaleDetails(saleList, billno);
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Sale Inserted Successfully";
                    aPIResponse.Result = saleinfo;
                    return Ok(aPIResponse);

                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
            }
        }
        public void AddSaleDetails(List<SaleDetails> details, string billno)
        {
            using (var db = new POSRentingContext())
            {
                long saleId = 0;
                var saleLast = db.Sale.Where(w => w.IsActive == true && w.IsDeleted == false).DefaultIfEmpty().Last();
                if (saleLast != null)
                {
                    saleId = saleLast.SaleId;
                }

                foreach (var item in details)
                {
                    SaleDetails details1 = new SaleDetails();
                    details1.SaleId = saleId;
                    details1.BillNumber = billno;
                    details1.ItemId = item.ItemId;
                    details1.Quantity = item.Quantity;
                    details1.UnitPrice = item.UnitPrice;
                    details1.TotalPrice = item.TotalPrice;
                    db.SaleDetails.Add(details1);
                    db.SaveChanges();
                    EditItemQuantity(item.ItemId, item.Quantity);
                }
            }

        }
        #endregion

        #region Tax

        [HttpPost]
        [Route("AddEditTaxes")]
        public IActionResult AddEditTaxes(TaxViewModel TaxviewModel)
        {
            try
            {
                if (TaxviewModel.TaxId > 0)
                {
                    using (var db = new POSRentingContext())
                    {
                        // var tax = db.MasterTax.Where(w => w.TaxId == TaxviewModel.TaxId && w.IsActive == true && w.IsDeleted == false).FirstOrDefault();
                        var tax = db.MasterTax.Where(w => w.TaxId == TaxviewModel.TaxId && w.IsDeleted == false).FirstOrDefault();
                        if (tax != null)
                        {
                            tax.TaxName = TaxviewModel.TaxName;
                            tax.TaxType = TaxviewModel.TaxType;
                            tax.TaxDescription = TaxviewModel.TaxDescription;
                            tax.TaxValues = TaxviewModel.TaxValues;
                            tax.FranchiseId = TaxviewModel.FranchiseId;
                            tax.IsDeleted = false;
                            // tax.IsActive = true;
                            db.SaveChanges();
                            TaxviewModel.IsActive = tax.IsActive == null ? false : tax.IsActive;
                            TaxviewModel.TaxId = tax.TaxId;
                            TaxviewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == TaxviewModel.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                            aPIResponse.StatusCode = 200;

                            aPIResponse.Message = "Tax Updated Successfully!";
                            aPIResponse.Result = TaxviewModel;
                            return Ok(aPIResponse);
                        }
                        else
                        {
                            aPIResponse.StatusCode = 10001;
                            aPIResponse.Message = "Selected Tax Not Found!";
                            aPIResponse.Result = TaxviewModel;
                            return Ok(aPIResponse);
                        }
                    }
                }
                else
                {
                    using (var db = new POSRentingContext())
                    {
                        MasterTax tax = new MasterTax();
                        tax.TaxName = TaxviewModel.TaxName;
                        tax.TaxType = TaxviewModel.TaxType;
                        tax.TaxDescription = TaxviewModel.TaxDescription;
                        tax.TaxValues = TaxviewModel.TaxValues;
                        tax.FranchiseId = TaxviewModel.FranchiseId;
                        tax.IsDeleted = false;
                        tax.IsActive = true;
                        tax.CreatedDate = DateTime.Now;
                        db.MasterTax.Add(tax);
                        db.SaveChanges();
                        TaxviewModel.IsActive = true;
                        TaxviewModel.TaxId = tax.TaxId;
                        TaxviewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == TaxviewModel.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Tax Inserted Successfully!";
                        aPIResponse.Result = TaxviewModel;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }

        [HttpGet]
        [Route("GetTaxes")]
        public IActionResult GetTaxes(int FranchiseId)
        {
            try
            {
                List<TaxViewModel> ObjListTaxViewModel = new List<TaxViewModel>();
                using (var db = new POSRentingContext())
                {
                    List<MasterTax> ObjListMasterTax = new List<MasterTax>();
                    if (FranchiseId > 0)
                    {
                        ObjListMasterTax = db.MasterTax.Where(w => w.FranchiseId == FranchiseId && w.IsActive == true && w.IsDeleted == false).ToList();
                    }
                    else
                    {
                        ObjListMasterTax = db.MasterTax.Where(w => w.IsActive == true && w.IsDeleted == false).ToList();
                    }
                    foreach (var item in ObjListMasterTax)
                    {
                        TaxViewModel taxviewModel = new TaxViewModel();
                        taxviewModel.TaxId = item.TaxId;
                        taxviewModel.TaxName = item.TaxName;
                        taxviewModel.TaxType = item.TaxType;
                        taxviewModel.TaxDescription = item.TaxDescription;
                        taxviewModel.TaxValues = item.TaxValues;
                        taxviewModel.FranchiseId = item.FranchiseId.Value;
                        taxviewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        taxviewModel.IsActive = item.IsActive;
                        ObjListTaxViewModel.Add(taxviewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successfully";
                    aPIResponse.Result = ObjListTaxViewModel;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }


        [HttpGet]
        [Route("GetAllTaxes")]
        public IActionResult GetAllTaxes(int FranchiseId)
        {
            try
            {
                List<TaxViewModel> ObjListTaxViewModel = new List<TaxViewModel>();
                using (var db = new POSRentingContext())
                {
                    List<MasterTax> ObjListMasterTax = new List<MasterTax>();
                    if (FranchiseId > 0)
                    {
                        ObjListMasterTax = db.MasterTax.Where(w => w.FranchiseId == FranchiseId && w.IsDeleted == false).ToList();
                    }
                    else
                    {
                        ObjListMasterTax = db.MasterTax.Where(w => w.IsDeleted == false).ToList();
                    }
                    foreach (var item in ObjListMasterTax)
                    {
                        TaxViewModel taxviewModel = new TaxViewModel();
                        taxviewModel.TaxId = item.TaxId;
                        taxviewModel.TaxName = item.TaxName;
                        taxviewModel.TaxType = item.TaxType;
                        taxviewModel.TaxDescription = item.TaxDescription;
                        taxviewModel.TaxValues = item.TaxValues;
                        taxviewModel.FranchiseId = item.FranchiseId.Value;
                        taxviewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        taxviewModel.IsActive = item.IsActive;
                        ObjListTaxViewModel.Add(taxviewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successfully";
                    aPIResponse.Result = ObjListTaxViewModel;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }

        [HttpDelete]
        [Route("DeleteTax")]
        public IActionResult DeleteTax(int TaxId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var tax = db.MasterTax.Where(w => w.TaxId == TaxId).FirstOrDefault();
                    tax.IsDeleted = true;
                    tax.DeletedDate = DateTime.Now;
                    tax.IsActive = false;
                    db.SaveChanges();
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Deleted Successfully";
                    aPIResponse.Result = tax;
                    return Ok(aPIResponse);
                }

            }
            catch (Exception ex)
            {

                throw;
            }
        }


        #endregion

        [HttpGet]
        [Route("GetAllItems")]
        public List<ItemListViewModel> GetAllItems()
        {
            var itm = new List<ItemListViewModel>();
            using (var db = new POSRentingContext())
            {
                itm = (from e in db.Item
                       where e.IsDeleted == false && e.IsActive == true && e.IsGroup == false
                       select new ItemListViewModel
                       {
                           ItemId = e.ItemId,
                           ItemName = e.ItemName,
                       }).ToList();
            }
            return itm;
        }

        [HttpPost]
        [Route("AddEditCoupon")]
        public IActionResult AddEditCoupon(CouponViewModel cm)
        {

            try
            {
                cm.ExpirationDate = Convert.ToDateTime(cm.ExpirationDate).AddDays(1).AddMinutes(-1);
                using (var db = new POSRentingContext())
                {
                    // var ccode = db.Coupon.Where(w => w.CouponId == cm.CouponId && w.IsActive == true && w.IsDeleted == false).FirstOrDefault();
                    var ccode = db.Coupon.Where(w => w.CouponId == cm.CouponId && w.IsDeleted == false).FirstOrDefault();

                    if (ccode != null && ccode.CouponId > 0)
                    {
                        // var data = db.Coupon.SingleOrDefault(s => s.CouponCode == cm.CouponCode && s.CouponId != ccode.CouponId && s.IsActive == true && s.IsDeleted == false);
                        var data = db.Coupon.SingleOrDefault(s => s.CouponCode == cm.CouponCode && s.CouponId != ccode.CouponId && s.IsDeleted == false);
                        if (data != null)
                        {
                            aPIResponse.StatusCode = 4001;
                            aPIResponse.Message = "Coupon Code Already Exists";
                        }
                        else
                        {
                            ccode.CouponType = cm.CouponType;
                            ccode.CouponCode = cm.CouponCode;
                            ccode.ExpirationDate = cm.ExpirationDate;
                            ccode.StartDate = cm.StartDate;
                            ccode.ProductId = cm.ProductId;
                            ccode.Description = cm.Description;
                            ccode.Value = cm.Value;
                            ccode.IsActive = cm.IsActive;
                            ccode.FranchiseId = cm.FranchiseId; //added
                            db.SaveChanges();
                            cm.IsActive = ccode.IsActive == null ? false : ccode.IsActive;
                            // cm.IsActive = true;
                            aPIResponse.Result = cm;
                            aPIResponse.StatusCode = 200;
                            aPIResponse.Message = "Coupon Updated Successfully";
                        }
                    }
                    else
                    {
                        // var data = db.Coupon.SingleOrDefault(s => s.CouponCode == cm.CouponCode && s.IsActive == true && s.IsDeleted == false);
                        var data = db.Coupon.SingleOrDefault(s => s.CouponCode == cm.CouponCode && s.IsDeleted == false);
                        if (data != null)
                        {
                            aPIResponse.StatusCode = 4001;
                            aPIResponse.Message = "Coupon Code Already Exists";
                        }
                        else
                        {
                            Coupon cp = new Coupon();
                            cp.CouponCode = cm.CouponCode;
                            cp.CouponType = cm.CouponType;
                            cp.ExpirationDate = cm.ExpirationDate;
                            cp.StartDate = cm.StartDate;
                            cp.ProductId = cm.ProductId;
                            cp.Description = cm.Description;
                            cp.Value = cm.Value;
                            cp.FranchiseId = cm.FranchiseId;
                            cp.CreatedDate = DateTime.Now;
                            cp.CreatedBy = cm.CreatedBy;
                            cp.IsActive = cm.IsActive;
                            cp.IsDeleted = false;
                            cp.IsConsumed = false;
                            db.Coupon.Add(cp);
                            db.SaveChanges();
                            cm.IsActive = true;
                            aPIResponse.Result = cm;
                            aPIResponse.StatusCode = 200;
                            aPIResponse.Message = "Coupon Inserted Successfully";
                        }
                    }
                }
                return Ok(aPIResponse);
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
            }
        }

        [HttpDelete]
        [Route("DeleteCoupon")]
        public IActionResult DeleteCoupon(int couponId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var coupon = db.Coupon.Where(w => w.CouponId == couponId).FirstOrDefault();
                    coupon.IsDeleted = true;
                    coupon.IsActive = false;
                    coupon.IsConsumed = true;
                    coupon.DeletedDate = DateTime.Now;
                    db.SaveChanges();
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Coupon Deleted Successfully";
                    aPIResponse.Result = coupon;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }

        [HttpPut]
        [Route("ActivateCoupon")]
        public IActionResult ActivateCoupon(string couponCode)
        {

            try
            {
                using (var db = new POSRentingContext())
                {
                    var coupon = db.Coupon.Where(w => w.CouponCode == couponCode).FirstOrDefault();

                    if (coupon.IsActive == true)
                    {
                        coupon.IsActive = false;
                        aPIResponse.Message = "Coupon Dactivated";
                        aPIResponse.StatusCode = 200;

                        aPIResponse.Result = coupon;
                    }

                    else
                    {

                        coupon.IsActive = true;

                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Coupon Activated Successfully";
                        aPIResponse.Result = coupon;
                    }

                    db.SaveChanges();
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }


        }

        [HttpPost]
        [Route("GetCoupon")]
        public IActionResult GetCoupon(CouponItemviewModel couponviewModel)
        {
            try
            {
                var itm = new List<ShowCouponModel>();
                if (string.IsNullOrEmpty(couponviewModel.ProductId))
                {
                    if (string.IsNullOrEmpty(couponviewModel.CouponCode))
                    {
                        using (var db = new POSRentingContext())
                        {
                            itm = (from e in db.Coupon
                                   where e.IsDeleted == false && e.IsConsumed == false
                                   select new ShowCouponModel
                                   {
                                       CouponId = e.CouponId,
                                       CouponCode = e.CouponCode,
                                       Value = e.Value,
                                       Products = getProductList(e.ProductId),
                                       ExpirationDate = e.ExpirationDate,
                                       StartDate = e.StartDate,
                                       IsConsumed = e.IsConsumed,
                                       IsActive = e.IsActive,
                                       CouponType = e.CouponType,
                                       ProductId = e.ProductId,
                                       Description = e.Description,
                                       CreatedDate = e.CreatedDate,
                                       DeletedDate = e.DeletedDate,
                                       IsDeleted = e.IsDeleted,
                                       CreatedBy = e.CreatedBy
                                   }).ToList();
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = itm;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        using (var db = new POSRentingContext())
                        {
                            itm = (from e in db.Coupon
                                   where e.IsDeleted == false && e.IsConsumed == false
                                   select new ShowCouponModel
                                   {
                                       CouponId = e.CouponId,
                                       CouponCode = e.CouponCode,
                                       Value = e.Value,
                                       Products = getProductList(e.ProductId),
                                       ExpirationDate = e.ExpirationDate,
                                       StartDate = e.StartDate,
                                       IsConsumed = e.IsConsumed,
                                       IsActive = e.IsActive,
                                       CouponType = e.CouponType,
                                       ProductId = e.ProductId,
                                       Description = e.Description,
                                       CreatedDate = e.CreatedDate,
                                       DeletedDate = e.DeletedDate,
                                       IsDeleted = e.IsDeleted,
                                       CreatedBy = e.CreatedBy
                                   }).Where(w => w.CouponCode == couponviewModel.CouponCode).ToList();
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = itm;
                        return Ok(aPIResponse);
                    }
                }
                else
                {
                    using (var db = new POSRentingContext())
                    {
                        string[] ProductIdList = couponviewModel.ProductId.Split(",");
                        foreach (var item in ProductIdList)
                        {
                            itm = (from e in db.Coupon
                                   where e.IsDeleted == false && e.IsConsumed == false
                                   select new ShowCouponModel
                                   {
                                       CouponId = e.CouponId,
                                       CouponCode = e.CouponCode,
                                       Value = e.Value,
                                       Products = getProductList(e.ProductId),
                                       ExpirationDate = e.ExpirationDate,
                                       StartDate = e.StartDate,
                                       IsConsumed = e.IsConsumed,
                                       IsActive = e.IsActive,
                                       CouponType = e.CouponType,
                                       ProductId = e.ProductId,
                                       Description = e.Description,
                                       CreatedDate = e.CreatedDate,
                                       DeletedDate = e.DeletedDate,
                                       IsDeleted = e.IsDeleted,
                                       CreatedBy = e.CreatedBy
                                   }).Where(w => w.ProductId.Contains(item) && (w.CouponCode == couponviewModel.CouponCode) && (w.StartDate<=DateTime.Now) && (w.ExpirationDate >= DateTime.Now)).ToList();
                            if (itm.Count() > 0)
                            {
                                aPIResponse.StatusCode = 200;
                                aPIResponse.Message = "Request Successful";
                                aPIResponse.Result = itm;
                                return Ok(aPIResponse);
                            }
                        }

                        if (itm.Count() == 0)
                        {
                            aPIResponse.StatusCode = 200;
                            aPIResponse.Message = "Selected Coupon not valid or Expired!";
                            aPIResponse.Result = itm;
                            return Ok(aPIResponse);
                        }
                    }
                }
                return Ok(aPIResponse);
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 200;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }

        }

        [HttpGet]
        [Route("GetCouponRec")]
        public IActionResult GetCouponRec(int FranchiseId)
        {
            try
            {
                var itm = new List<ShowCouponModel>();
                if (FranchiseId == 0)
                {
                    using (var db = new POSRentingContext())
                    {
                        itm = (from e in db.Coupon
                               where e.IsDeleted == false && e.IsConsumed == false
                               select new ShowCouponModel
                               {
                                   CouponId = e.CouponId,
                                   CouponCode = e.CouponCode,
                                   Value = e.Value,
                                   Products = getProductList(e.ProductId),
                                   ExpirationDate = e.ExpirationDate,
                                   StartDate=e.StartDate,
                                   IsConsumed = e.IsConsumed,
                                   IsActive = e.IsActive,
                                   CouponType = e.CouponType,
                                   ProductId = e.ProductId,
                                   Description = e.Description,
                                   CreatedDate = e.CreatedDate,
                                   DeletedDate = e.DeletedDate,
                                   IsDeleted = e.IsDeleted,
                                   CreatedBy = e.CreatedBy,
                                   FranchiseId = e.FranchiseId
                               }).ToList();
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = itm;
                    return Ok(aPIResponse);
                }
                else
                {
                    using (var db = new POSRentingContext())
                    {
                        itm = (from e in db.Coupon
                               where e.IsDeleted == false && e.IsConsumed == false
                               select new ShowCouponModel
                               {
                                   CouponId = e.CouponId,
                                   CouponCode = e.CouponCode,
                                   Value = e.Value,
                                   Products = getProductList(e.ProductId),
                                   ExpirationDate = e.ExpirationDate,
                                   StartDate = e.StartDate,
                                   IsConsumed = e.IsConsumed,
                                   IsActive = e.IsActive,
                                   CouponType = e.CouponType,
                                   ProductId = e.ProductId,
                                   Description = e.Description,
                                   CreatedDate = e.CreatedDate,
                                   DeletedDate = e.DeletedDate,
                                   IsDeleted = e.IsDeleted,
                                   CreatedBy = e.CreatedBy,
                                   FranchiseId = e.FranchiseId
                               }).Where(w => w.FranchiseId == FranchiseId).ToList();
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = itm;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 200;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }

        }

        [HttpDelete]
        [Route("ExpirationCoupon")]
        public IActionResult ExpirationCoupon(int CouponId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var selectedcoupon = db.Coupon.Where(w => w.CouponId == CouponId).FirstOrDefault();
                    if (selectedcoupon != null)
                    {
                        selectedcoupon.IsConsumed = true;
                        db.SaveChanges();
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Coupon Expired Successfully!";
                        aPIResponse.Result = selectedcoupon;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Coupon Not Found!";
                        aPIResponse.Result = selectedcoupon;
                        return Ok(aPIResponse);
                    }

                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }

        private string getProductList(string prd)
        {
            string p = "";

            // Split authors separated by a comma followed by space 
            if (prd != null)
            {

                string[] ProductIdList = prd.Split(",");
                foreach (string v in ProductIdList)
                {

                    if (!String.IsNullOrWhiteSpace(v))
                    {
                        using (var db = new POSRentingContext())
                        {
                            var query = (from c in db.Item
                                         where c.IsDeleted == false && c.IsActive == true
                                         where c.ItemId == Int32.Parse(v)

                                         select c.ItemName).FirstOrDefault();
                            p = p + query + ",";

                        }
                    }

                }

                if (!String.IsNullOrWhiteSpace(p))
                    p = p.Remove(p.Length - 1, 1);
            }

            return (p);
        }

        #region Rent
        [HttpPost]
        [Route("AddRent")]
        public IActionResult AddRent(RentViewModel rentView)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    string billno = "";
                    List<RentDetailsViewModel> rentList = rentView.rentDetails;
                    var rentLast = db.Rent.DefaultIfEmpty().Last();
                    if (rentLast != null)
                    {
                        if (rentLast.BillNumber != "" && rentLast.BillNumber != null)
                        {
                            long bill = Convert.ToInt64(rentLast.BillNumber.Split('-')[1]) + 1;
                            billno = "MR-" + bill;
                        }
                        else
                        {
                            billno = "MR-" + "1000001";
                        }
                    }
                    else
                    {
                        billno = "MR-" + "1000001";
                    }
                    Rent rentinfo = new Rent();
                    rentinfo.IssuedBy = rentView.IssuedBy;
                    rentinfo.BillNumber = billno;
                    rentinfo.IsReturned = "false";
                    rentinfo.RentedOn = rentView.RentedOn;
                    rentinfo.ReturnDate = rentView.ReturnDate;
                    rentinfo.FranchiseId = rentView.FranchiseId;
                    rentinfo.Amount = rentView.Amount;
                    rentinfo.Quantity = rentView.Quantity;
                    rentinfo.Discount = rentView.Discount;
                    rentinfo.Hips = rentView.Hips;
                    rentinfo.SkirtLength = rentView.SkirtLength;
                    rentinfo.Waist = rentView.Waist;
                    rentinfo.Bust = rentView.Bust;
                    rentinfo.RentTotalPrice = rentView.RentTotalPrice;
                    rentinfo.ReceivedAmount = rentView.ReceivedAmount;
                    rentinfo.BalanceAmount = rentView.BalanceAmount;
                    rentinfo.Notes = rentView.Notes;
                    if (rentinfo.CustomerId == null)
                    {
                        rentinfo.CustomerId = GetGuestCustomerByFranchiseIdd(Convert.ToInt32(rentinfo.FranchiseId));
                    }
                    rentinfo.CouponCode = rentView.CouponCode;
                    rentinfo.CouponValue = rentView.CouponValue;
                    rentinfo.ShippingAmount = rentView.ShippingAmount;
                    rentinfo.Security = rentView.Security;
                    rentinfo.IsActive = true;
                    rentinfo.IsDeleted = false;
                    rentinfo.CreatedDate = DateTime.Now;
                    db.Rent.Add(rentinfo);
                    db.SaveChanges();
                    AddRentDetails(rentList, billno, rentView.RentedOn, rentView.ReturnDate);
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Rent Inserted Successfully";
                    aPIResponse.Result = rentinfo;
                    return Ok(aPIResponse);

                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
            }
        }
        public void AddRentDetails(List<RentDetailsViewModel> details, string billno, DateTime? RentedOn, DateTime? ReturnDate)
        {
            using (var db = new POSRentingContext())
            {
                long rentId = 0;
                var saleLast = db.Rent.DefaultIfEmpty().Last();
                if (saleLast != null)
                {
                    rentId = saleLast.RentId;
                }

                foreach (var item in details)
                {
                    RentDetails details1 = new RentDetails();
                    details1.RentId = rentId;
                    details1.BillNumber = billno;
                    details1.ItemId = item.ItemId;
                    details1.Quantity = item.Quantity;
                    details1.UnitPrice = item.UnitPrice;
                    details1.TotalPrice = item.TotalPrice;
                    details1.Security = item.Security;
                    details1.TotalSecurity = item.TotalSecurity;
                    
                    details1.RentedOn = RentedOn;
                    details1.ReturnDate = RentedOn;
                    details1.IsReturned = "false";
                    db.RentDetails.Add(details1);
                    db.SaveChanges();
                }
            }

        }
        [HttpGet]
        [Route("GetRentDetails")]
        public IActionResult GetRentDetails()
        {
            try
            {

                List<RentDetailsViewModel> ObjListrentViewModel = new List<RentDetailsViewModel>();
                using (var db = new POSRentingContext())
                {
                    List<RentDetails> rentDetails = new List<RentDetails>();
                    rentDetails = db.RentDetails.ToList();
                    foreach (var item in rentDetails)
                    {
                        RentDetailsViewModel ObjCustomerviewModel = new RentDetailsViewModel();
                        ObjCustomerviewModel.Id = item.Id;
                        ObjCustomerviewModel.ItemId = item.ItemId;
                        ObjCustomerviewModel.Quantity = item.Quantity;
                        ObjCustomerviewModel.RentId = item.RentId;
                        ObjCustomerviewModel.TotalPrice = item.TotalPrice;
                        ObjCustomerviewModel.UnitPrice = item.UnitPrice;
                        ObjCustomerviewModel.BillNumber = item.BillNumber;
                        ObjCustomerviewModel.UnitPrice = item.UnitPrice;
                        ObjListrentViewModel.Add(ObjCustomerviewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successfully";
                    aPIResponse.Result = ObjListrentViewModel;
                    return Ok(aPIResponse);
                };
                //}
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpGet]
        [Route("GetRentGroupByDetails")]
        public IActionResult GetRentGroupByDetails()
        {
            try
            {

                List<RentDetailsViewModel> ObjListrentViewModel = new List<RentDetailsViewModel>();
                using (var db = new POSRentingContext())
                {
                    List<RentDetails> rentDetails = new List<RentDetails>();
                    rentDetails = db.RentDetails.Where(i => i.IsReturned == "False").GroupBy(n => n.ItemId).Select(r => new RentDetails { ItemId = r.Key, Quantity = r.Sum(x => x.Quantity), ReturnDate = r.Max(y => y.ReturnDate) }).ToList();
                    foreach (var item in rentDetails)
                    {
                        RentDetailsViewModel ObjCustomerviewModel = new RentDetailsViewModel();
                        ObjCustomerviewModel.ItemId = item.ItemId;
                        ObjCustomerviewModel.Quantity = item.Quantity;
                        ObjCustomerviewModel.ReturnDate = item.ReturnDate;
                        ObjListrentViewModel.Add(ObjCustomerviewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successfully";
                    aPIResponse.Result = ObjListrentViewModel;
                    return Ok(aPIResponse);
                };
                //}
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        [HttpGet]
        [Route("GetRentDataByBillNumber")]
        public IActionResult GetRentDataByBillNumber(string billnumber)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    List<RentDetails> rentDetailsViewModels = db.RentDetails.Where(w => w.BillNumber == billnumber && (w.IsReturned == "false" || w.IsReturned == "")).ToList();

                    List<RentDetailsViewModel> rentList = new List<RentDetailsViewModel>();
                    foreach (var item in rentDetailsViewModels)
                    {
                        RentDetailsViewModel rent = new RentDetailsViewModel();
                        rent.ItemName = db.Item.Where(w => w.ItemId == item.ItemId).Select(s => s.ItemName).FirstOrDefault();
                        rent.BillNumber = item.BillNumber;
                        rent.ItemId = item.ItemId;
                        rent.Quantity = item.Quantity;
                        rent.RentedOn = item.RentedOn;
                        rent.RentId = item.RentId;
                        rent.Security = item.Security;
                        rent.TotalSecurity = item.TotalSecurity;
                        rent.UnitPrice = item.UnitPrice;
                        rent.TotalPrice = item.TotalPrice;
                        rent.ReturnDate = item.ReturnDate;
                        rent.IsReturned = item.IsReturned;
                        rentList.Add(rent);
                    }
                    var list = new List<RentViewModel>();
                    list = (from p in db.Rent
                                //join q in db.RentDetails on p.RentId equals q.RentId
                            where p.BillNumber == billnumber && (p.IsReturned == "false" || p.IsReturned == "")
                            select new RentViewModel
                            {
                                RentID = p.RentId,
                                ReceivedAmount = p.ReceivedAmount,
                                RentedOn = p.RentedOn,
                                RentTotalPrice = p.RentTotalPrice,
                                Discount = p.Discount,
                                FranchiseId = Convert.ToInt32(p.FranchiseId),
                                BillNumber = p.BillNumber,
                                Quantity = p.Quantity,
                                BalanceAmount = p.BalanceAmount,
                                Amount = p.Amount,
                                Notes = p.Notes,
                                Security = p.Security,
                                ShippingAmount = p.ShippingAmount,
                                CustomerId = p.CustomerId,
                                CouponCode = p.CouponCode,
                                Hips=p.Hips,
                                Waist=p.Waist,
                                SkirtLength=p.SkirtLength,
                                Bust=p.Bust,
                                CouponValue = p.CouponValue,
                                ReturnDate = p.ReturnDate,
                                IssuedName = db.User.Where(w => w.UserId == p.IssuedBy).Select(s => s.FirstName).FirstOrDefault(),
                                //rentItems = db.RentDetails.Where(w => w.RentId == p.RentId).Select(s => new RentDetailslistViewModel { ItemName = db.Item.Where(w => w.ItemId == s.ItemId).Select(z => z.ItemName).FirstOrDefault() }).ToList(),
                                rentDetails = rentList
                            }).ToList();

                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successfully";
                    aPIResponse.Result = list;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        [HttpGet]
        [Route("EditRentDetailsQuantity")]
        public void EditRentDetailsQuantity(string billnumber, string reason, string charges, string latecharges)
        {
            using (var db = new POSRentingContext())
            {
                var rent = db.Rent.Where(w => w.BillNumber == billnumber).FirstOrDefault();
                rent.Reason = reason;
                rent.AdditionalCharges = Convert.ToDecimal(charges);
                rent.LateCharges = Convert.ToDecimal(latecharges);
                rent.IsReturned = "true";
                db.SaveChanges();
            }
        }
        #endregion

        #region Hold
        [HttpPost]
        [Route("AddEditHoldOrder")]
        public IActionResult AddHoldOrder(HoldOrderViewModel holdorderviewmodel)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    if (holdorderviewmodel.OrderId > 0)
                    {
                        var holdorder = db.HoldOrderDetails.Where(w => w.OrderId == holdorderviewmodel.OrderId).ToList();
                        foreach (var item in holdorder)
                        {
                            var itemholdorder = db.HoldOrderDetails.Where(w => w.ItemId == item.ItemId).FirstOrDefault();
                            var holdorderitemlist = holdorderviewmodel.HoldOrderDetailList.Where(w => w.ItemId == item.ItemId && w.OrderId == holdorderviewmodel.OrderId).FirstOrDefault();
                            if (itemholdorder != null)
                            {
                                itemholdorder.Quantity = holdorderitemlist.Quantity;
                                itemholdorder.SubTotal = holdorderitemlist.SubTotal;
                                itemholdorder.UnitPrice = holdorderitemlist.UnitPrice;
                                itemholdorder.Discount = holdorderitemlist.Discount;
                                itemholdorder.SecurityAmount = holdorderitemlist.SecurityAmount;
                                db.SaveChanges();

                                //return Ok(aPIResponse);
                            }
                            else
                            {
                                HoldOrderDetails itemholdorderd = new HoldOrderDetails();
                                itemholdorderd.ItemId = holdorderitemlist.ItemId;
                                itemholdorderd.Quantity = holdorderitemlist.Quantity;
                                itemholdorderd.SubTotal = holdorderitemlist.SubTotal;
                                itemholdorderd.UnitPrice = holdorderitemlist.UnitPrice;
                                itemholdorderd.Discount = holdorderitemlist.Discount;
                                itemholdorderd.OrderId = holdorderitemlist.OrderId;
                                itemholdorder.SecurityAmount = holdorderitemlist.SecurityAmount;
                                db.HoldOrderDetails.Add(itemholdorderd);
                                db.SaveChanges();
                                holdorderitemlist.HoldOrderId = itemholdorderd.OrderDetailId;
                                //return Ok(aPIResponse);
                            }
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Order On Hold Successfully!";
                        aPIResponse.Result = holdorderviewmodel;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        string ordercode = string.Empty;
                        var HoldOrder = db.HoldOrder.DefaultIfEmpty().Last();
                        if (HoldOrder != null)
                        {
                            if (!String.IsNullOrWhiteSpace(HoldOrder.OrderCode))
                            {
                                long bill = Convert.ToInt64(HoldOrder.OrderCode.Split('-')[1]) + 1;
                                ordercode = "ORD-" + bill;
                            }
                            else { ordercode = "ORD-" + "1000001"; }
                        }
                        else
                        {
                            ordercode = "ORD-" + "1000001";
                        }
                        HoldOrder ObjHoldOrder = new HoldOrder();
                        ObjHoldOrder.CustomerId = holdorderviewmodel.CustomerId;
                        ObjHoldOrder.Amount = holdorderviewmodel.Amount;
                        ObjHoldOrder.FranchiseId = holdorderviewmodel.FranchiseId;
                        ObjHoldOrder.OrderDate = DateTime.Now;
                        ObjHoldOrder.OrderCode = ordercode;
                        ObjHoldOrder.OrderName = holdorderviewmodel.OrderName;
                        ObjHoldOrder.HoldBy = holdorderviewmodel.HoldBy;
                        ObjHoldOrder.IsActive = true;
                        ObjHoldOrder.IsHold = false;
                        ObjHoldOrder.Discount = holdorderviewmodel.Discount;
                        ObjHoldOrder.DiscountType = holdorderviewmodel.DiscountType;
                        ObjHoldOrder.ShippingCharges = holdorderviewmodel.ShippingCharges;
                        ObjHoldOrder.IsRent = holdorderviewmodel.IsRent;
                        ObjHoldOrder.ReturnDate = holdorderviewmodel.ReturnDate;
                        ObjHoldOrder.RentedOn = holdorderviewmodel.RentedOn;
                        ObjHoldOrder.Notes = holdorderviewmodel.Notes;
                        db.HoldOrder.Add(ObjHoldOrder);
                        db.SaveChanges();
                        holdorderviewmodel.OrderId = ObjHoldOrder.OrderId;
                        foreach (var items in holdorderviewmodel.HoldOrderDetailList)
                        {
                            HoldOrderDetails ObjHoldOrderDetails = new HoldOrderDetails();
                            ObjHoldOrderDetails.OrderId = ObjHoldOrder.OrderId;
                            ObjHoldOrderDetails.ItemId = items.ItemId;
                            ObjHoldOrderDetails.UnitPrice = items.UnitPrice;
                            ObjHoldOrderDetails.Quantity = items.Quantity;
                            ObjHoldOrderDetails.Discount = items.Discount;
                            ObjHoldOrderDetails.SubTotal = items.SubTotal;
                            ObjHoldOrderDetails.SecurityAmount = items.SecurityAmount;
                            db.HoldOrderDetails.Add(ObjHoldOrderDetails);
                            db.SaveChanges();
                            ObjHoldOrderDetails.OrderDetailId = ObjHoldOrderDetails.OrderDetailId;
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Order On Hold Successfully!";
                        aPIResponse.Result = holdorderviewmodel;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }

        [HttpGet]
        [Route("GetHoldOrder")]
        public IActionResult GetHoldOrder(int FranchiseId, int HoldBy, bool IsRent)
        {
            try
            {
                List<HoldOrderViewModel> ObjHoldOrderList = new List<HoldOrderViewModel>();
                using (var db = new POSRentingContext())
                {

                    var holdorder = db.HoldOrder.Where(w => w.FranchiseId == FranchiseId && w.HoldBy == HoldBy && w.IsHold == false && w.IsActive == true && w.IsRent == IsRent).ToList();
                    foreach (var item in holdorder)
                    {
                        HoldOrderViewModel ObjHoldOrderViewModel = new HoldOrderViewModel();
                        ObjHoldOrderViewModel.OrderId = item.OrderId;
                        ObjHoldOrderViewModel.OrderName = item.OrderName;
                        ObjHoldOrderViewModel.OrderCode = item.OrderCode;
                        ObjHoldOrderViewModel.OrderDate = item.OrderDate == null ? DateTime.Now : item.OrderDate.Value;
                        ObjHoldOrderViewModel.Amount = item.Amount == null ? 0 : item.Amount.Value;
                        ObjHoldOrderViewModel.CustomerId = item.CustomerId == 0 ? 0 : item.CustomerId.Value;
                        ObjHoldOrderViewModel.IsRent = item.IsRent == null ? false : item.IsRent.Value;
                        ObjHoldOrderViewModel.ShippingCharges = item.ShippingCharges == null ? 0 : item.ShippingCharges.Value;
                        ObjHoldOrderViewModel.FranchiseId = item.FranchiseId;
                        ObjHoldOrderViewModel.HoldBy = item.HoldBy == null ? 0 : item.HoldBy.Value;
                        ObjHoldOrderViewModel.Discount = item.Discount == null ? 0 : item.Discount.Value;
                        ObjHoldOrderViewModel.DiscountType = item.DiscountType == null ? 0 : item.DiscountType.Value;
                        ObjHoldOrderViewModel.RentedOn = item.RentedOn;
                        ObjHoldOrderViewModel.ReturnDate = item.ReturnDate;
                        ObjHoldOrderViewModel.Notes = item.Notes == null ? null : item.Notes;
                        ObjHoldOrderViewModel.CustomerNumber = db.Customer.Where(w => w.CustomerId == item.CustomerId.Value).Select(s => s.CustomerContactNo).FirstOrDefault();
                        var holdorderdetail = db.HoldOrderDetails.Where(w => w.OrderId == item.OrderId).ToList();
                        List<HoldOrderDetailsViewModel> ObjHoldOrderDetailsViewModelList = new List<HoldOrderDetailsViewModel>();
                        ObjHoldOrderViewModel.HoldOrderDetailList = ObjHoldOrderDetailsViewModelList;
                        foreach (var itemss in holdorderdetail)
                        {
                            var itemdetail = db.Item.Where(w => w.ItemId == itemss.ItemId).FirstOrDefault();
                            HoldOrderDetailsViewModel ObjHoldOrderDetailsViewModel = new HoldOrderDetailsViewModel();
                            ObjHoldOrderDetailsViewModel.HoldOrderId = itemss.OrderDetailId;
                            ObjHoldOrderDetailsViewModel.ItemId = itemss.ItemId == 0 ? 0 : itemss.ItemId.Value;
                            ObjHoldOrderDetailsViewModel.SecurityAmount = itemss.SecurityAmount == null ? 0 : itemss.SecurityAmount.Value;
                            if (itemdetail != null)
                            {
                                ObjHoldOrderDetailsViewModel.RemainingItem = itemdetail.QuantityStock.Value;
                                ObjHoldOrderDetailsViewModel.ItemName = itemdetail.ItemName;
                                ObjHoldOrderDetailsViewModel.ItemLogo = itemdetail.ProductLogo;
                            }
                            ObjHoldOrderDetailsViewModel.OrderId = itemss.OrderId == 0 ? 0 : itemss.OrderId.Value;
                            ObjHoldOrderDetailsViewModel.UnitPrice = itemss.UnitPrice == null ? 0 : itemss.UnitPrice.Value;
                            ObjHoldOrderDetailsViewModel.SubTotal = itemss.SubTotal == null ? 0 : itemss.SubTotal.Value;
                            ObjHoldOrderDetailsViewModel.Discount = itemss.Discount == null ? 0 : itemss.Discount.Value;
                            ObjHoldOrderDetailsViewModel.Quantity = itemss.Quantity == null ? 0 : itemss.Quantity.Value;
                            ObjHoldOrderDetailsViewModelList.Add(ObjHoldOrderDetailsViewModel);
                        }
                        ObjHoldOrderList.Add(ObjHoldOrderViewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjHoldOrderList;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }


        [HttpGet]
        [Route("UnHoldOrder")]
        public IActionResult UnHoldOrder(int OrderId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var holdorder = db.HoldOrder.Where(w => w.OrderId == OrderId).FirstOrDefault();
                    if (holdorder != null)
                    {
                        holdorder.IsHold = true;
                        holdorder.IsActive = false;
                        db.SaveChanges();
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = holdorder;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }
        #endregion

        #region DateWiseReport
        //[HttpGet]
        //[Route("DateWiseReport")]
        //public IActionResult DateWiseReport(DateTime From, DateTime To, int FranchiseId)
        //{
        //    try
        //    {
        //        To = To.AddDays(1).AddMinutes(-1);
        //        using (var db = new POSRentingContext())
        //        {
        //            List<SaleViewModel> ObjListSaleViewModel = new List<SaleViewModel>();
        //            if (FranchiseId > 0)
        //            {
        //                List<DateSaleViewModel> ObjListSaleDateWiseReport = new List<DateSaleViewModel>();
        //                var franchise = db.Franchise.Where(w => w.IsActive == true && w.IsDeleted == false).ToList();
        //                List<SaleDateWiseReport> ObjListSaleDateWiseReportr = new List<SaleDateWiseReport>();
        //                SaleDateWiseReport objSaleDateWiseReport = new SaleDateWiseReport();
        //                var result = db.Sale.Where(w => w.SaleDate >= From && w.SaleDate <= To && w.FranchiseId == FranchiseId).ToList();
        //                foreach (var item in result)
        //                {
        //                    DateSaleViewModel ObjSaleViewModel = new DateSaleViewModel();
        //                    List<SaleDetailViewModel> ObjlistSaleDetailViewModel = new List<SaleDetailViewModel>();
        //                    var saleorderdetails = db.SaleDetails.Where(w => w.SaleId == item.SaleId).ToList();
        //                    foreach (var items in saleorderdetails)
        //                    {
        //                        SaleDetailViewModel ObjSaleDetailViewModel = new SaleDetailViewModel();
        //                        ObjSaleDetailViewModel.ItemId = items.ItemId;
        //                        ObjSaleDetailViewModel.ItemName = db.Item.Where(w => w.ItemId == items.ItemId).Select(s => s.ItemName).FirstOrDefault();
        //                        ObjSaleDetailViewModel.Quantity = items.Quantity;
        //                        ObjSaleDetailViewModel.TotalPrice = items.TotalPrice;
        //                        ObjlistSaleDetailViewModel.Add(ObjSaleDetailViewModel);
        //                    }
        //                    ObjSaleViewModel.BillNumber = item.BillNumber;
        //                    ObjSaleViewModel.Discount = item.Discount;
        //                    ObjSaleViewModel.SaleDate = item.SaleDate;
        //                    ObjSaleViewModel.Quantity = item.Quantity;
        //                    ObjSaleViewModel.BalanceAmount = item.ReceivedAmount;
        //                    ObjSaleViewModel.CouponValue = item.CouponValue == null ? 0 : item.CouponValue.Value;
        //                    ObjSaleViewModel.SaleDetails = ObjlistSaleDetailViewModel;
        //                    ObjListSaleDateWiseReport.Add(ObjSaleViewModel);
        //                }
        //                objSaleDateWiseReport.FranchiseId = FranchiseId;
        //                objSaleDateWiseReport.FranchiseName = db.Franchise.Where(w => w.FranchiseId == FranchiseId).Select(s => s.FranchiseName).FirstOrDefault(); ;
        //                objSaleDateWiseReport.Salelist = ObjListSaleDateWiseReport;
        //                ObjListSaleDateWiseReportr.Add(objSaleDateWiseReport);
        //                aPIResponse.StatusCode = 200;
        //                aPIResponse.Message = "Request Successful";
        //                aPIResponse.Result = ObjListSaleDateWiseReportr;
        //                return Ok(aPIResponse);
        //            }
        //            else
        //            {
        //                var franchise = db.Franchise.Where(w => w.IsActive == true && w.IsDeleted == false).ToList();
        //                List<SaleDateWiseReport> ObjListSaleDateWiseReportr = new List<SaleDateWiseReport>();
        //                foreach (var itemss in franchise)
        //                {
        //                    List<DateSaleViewModel> ObjListSaleDateWiseReport = new List<DateSaleViewModel>();
        //                    SaleDateWiseReport objSaleDateWiseReport = new SaleDateWiseReport();
        //                    var result = db.Sale.Where(w => w.SaleDate >= From && w.SaleDate <= To && w.FranchiseId == itemss.FranchiseId).ToList();
        //                    foreach (var item in result)
        //                    {
        //                        DateSaleViewModel ObjSaleViewModel = new DateSaleViewModel();
        //                        List<SaleDetailViewModel> ObjlistSaleDetailViewModel = new List<SaleDetailViewModel>();
        //                        var saleorderdetails = db.SaleDetails.Where(w => w.SaleId == item.SaleId).ToList();
        //                        foreach (var items in saleorderdetails)
        //                        {
        //                            SaleDetailViewModel ObjSaleDetailViewModel = new SaleDetailViewModel();
        //                            ObjSaleDetailViewModel.ItemId = items.ItemId;
        //                            ObjSaleDetailViewModel.ItemName = db.Item.Where(w => w.ItemId == items.ItemId).Select(s => s.ItemName).FirstOrDefault();
        //                            ObjSaleDetailViewModel.Quantity = items.Quantity;
        //                            ObjSaleDetailViewModel.TotalPrice = items.TotalPrice;
        //                            ObjlistSaleDetailViewModel.Add(ObjSaleDetailViewModel);
        //                        }
        //                        ObjSaleViewModel.BillNumber = item.BillNumber;
        //                        ObjSaleViewModel.Discount = item.Discount;
        //                        ObjSaleViewModel.Quantity = item.Quantity;
        //                        ObjSaleViewModel.SaleDate = item.SaleDate;
        //                        ObjSaleViewModel.BalanceAmount = item.Amount;
        //                        ObjSaleViewModel.CouponValue = item.CouponValue == null ? 0 : item.CouponValue.Value;
        //                        ObjSaleViewModel.SaleDetails = ObjlistSaleDetailViewModel;
        //                        ObjListSaleDateWiseReport.Add(ObjSaleViewModel);
        //                    }
        //                    objSaleDateWiseReport.FranchiseId = itemss.FranchiseId;
        //                    objSaleDateWiseReport.FranchiseName = itemss.FranchiseName;
        //                    objSaleDateWiseReport.Salelist = ObjListSaleDateWiseReport;
        //                    ObjListSaleDateWiseReportr.Add(objSaleDateWiseReport);
        //                }
        //                aPIResponse.StatusCode = 200;
        //                aPIResponse.Message = "Request Successful";
        //                aPIResponse.Result = ObjListSaleDateWiseReportr;
        //                return Ok(aPIResponse);
        //            }
        //        }
        //        return Ok(aPIResponse);
        //    }
        //    catch (Exception ex)
        //    {
        //        aPIResponse.StatusCode = 200;
        //        aPIResponse.Message = ex.ToString();
        //        return Ok(aPIResponse);
        //        throw;
        //    }
        //}




        [HttpGet]
        [Route("DateWiseReport")]
        public IActionResult DateWiseReport1(DateTime From, DateTime To, int FranchiseId)
        {
            try
            {
                To = To.AddDays(1).AddMinutes(-1);
                using (var db = new POSRentingContext())
                {
                    List<SaleViewModel> ObjListSaleViewModel = new List<SaleViewModel>();
                    if (FranchiseId > 0)
                    {
                        var franchise = db.Franchise.Where(w => w.IsActive == true && w.IsDeleted == false).OrderBy(o => o.FranchiseName).ToList();
                        List<SaleDateWiseReport> ObjListSaleDateWiseReportr = new List<SaleDateWiseReport>();
                        SaleDateWiseReport objSaleDateWiseReport = new SaleDateWiseReport();
                        var salesagent = (from p in db.Sale
                                          join q in db.User on p.CreatedBy equals q.UserId
                                          where p.SaleDate >= From && p.SaleDate <= To && p.FranchiseId == FranchiseId && q.IsActive == true
                                          select new SaleAgentDateWiseReport()
                                          {
                                              AgentId = p.CreatedBy,
                                              AgentName = q.FirstName
                                          }).Distinct().OrderBy(o => o.AgentName).ToList();
                        List<SaleAgentDateWiseReport> ObjListSaleAgentDateWiseReport = new List<SaleAgentDateWiseReport>();
                        foreach (var itemagent in salesagent)
                        {
                            List<DateSaleViewModel> ObjListSaleDateWiseReport = new List<DateSaleViewModel>();
                            SaleAgentDateWiseReport ObjSaleAgentDateWiseReport = new SaleAgentDateWiseReport();
                            var result = db.Sale.Where(w => w.SaleDate >= From && w.SaleDate <= To && w.CreatedBy == itemagent.AgentId && w.FranchiseId == FranchiseId && w.IsActive == true && w.IsDeleted == false).OrderBy(o => o.SaleDate).ToList();
                            foreach (var item in result)
                            {
                                DateSaleViewModel ObjSaleViewModel = new DateSaleViewModel();
                                List<SaleDetailViewModel> ObjlistSaleDetailViewModel = new List<SaleDetailViewModel>();
                                var saleorderdetails = db.SaleDetails.Where(w => w.SaleId == item.SaleId).ToList();
                                foreach (var items in saleorderdetails)
                                {
                                    SaleDetailViewModel ObjSaleDetailViewModel = new SaleDetailViewModel();
                                    ObjSaleDetailViewModel.ItemId = items.ItemId;
                                    ObjSaleDetailViewModel.ItemName = db.Item.Where(w => w.ItemId == items.ItemId).Select(s => s.ItemName).FirstOrDefault();
                                    ObjSaleDetailViewModel.Quantity = items.Quantity;
                                    ObjSaleDetailViewModel.UnitPrice = items.UnitPrice;
                                    ObjSaleDetailViewModel.TotalPrice = items.TotalPrice;
                                    ObjlistSaleDetailViewModel.Add(ObjSaleDetailViewModel);
                                }
                                ObjSaleViewModel.BillNumber = item.BillNumber;
                                ObjSaleViewModel.Discount = item.Discount;
                                ObjSaleViewModel.Quantity = item.Quantity;
                                ObjSaleViewModel.SaleDate = item.SaleDate;
                                ObjSaleViewModel.BalanceAmount = item.Amount;
                                ObjSaleViewModel.CouponValue = item.CouponValue == null ? 0 : item.CouponValue.Value;
                                ObjSaleViewModel.ShippingAmount = item.ShippingAmount;
                                ObjSaleViewModel.Notes = item.Notes;
                                var customer = db.Customer.Where(w => w.CustomerId == item.CustomerId).Select(s => new { s.CustomerName, s.CustomerContactNo }).FirstOrDefault();
                                if (customer != null)
                                {
                                    ObjSaleViewModel.CustomerNumber = customer.CustomerContactNo;
                                    ObjSaleViewModel.CustomerName = customer.CustomerName;
                                }
                                else
                                {
                                    ObjSaleViewModel.CustomerNumber = "";
                                    ObjSaleViewModel.CustomerName = "Guest";
                                }
                                ObjSaleViewModel.SaleDetails = ObjlistSaleDetailViewModel;
                                ObjListSaleDateWiseReport.Add(ObjSaleViewModel);
                            }
                            ObjSaleAgentDateWiseReport.AgentId = itemagent.AgentId;
                            ObjSaleAgentDateWiseReport.AgentName = itemagent.AgentName;
                            ObjSaleAgentDateWiseReport.Salelist = ObjListSaleDateWiseReport;
                            ObjListSaleAgentDateWiseReport.Add(ObjSaleAgentDateWiseReport);
                        }
                        objSaleDateWiseReport.FranchiseId = FranchiseId;
                        objSaleDateWiseReport.FranchiseName = db.Franchise.Where(w => w.FranchiseId == FranchiseId).Select(s => s.FranchiseName).FirstOrDefault(); ;
                        objSaleDateWiseReport.SaleAgentlist = ObjListSaleAgentDateWiseReport;
                        ObjListSaleDateWiseReportr.Add(objSaleDateWiseReport);
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListSaleDateWiseReportr;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        var franchise = db.Franchise.Where(w => w.IsActive == true && w.IsDeleted == false).ToList();
                        List<SaleDateWiseReport> ObjListSaleDateWiseReportr = new List<SaleDateWiseReport>();
                        foreach (var itemss in franchise)
                        {
                            SaleDateWiseReport objSaleDateWiseReport = new SaleDateWiseReport();

                            var salesagent = (from p in db.Sale
                                              join q in db.User on p.CreatedBy equals q.UserId
                                              where p.SaleDate >= From && p.SaleDate <= To && p.FranchiseId == itemss.FranchiseId && q.IsActive == true
                                              select new SaleAgentDateWiseReport()
                                              {
                                                  AgentId = p.CreatedBy,
                                                  AgentName = q.FirstName
                                              }).OrderBy(o => o.AgentName).Distinct().ToList();
                            List<SaleAgentDateWiseReport> ObjListSaleAgentDateWiseReport = new List<SaleAgentDateWiseReport>();
                            foreach (var itemagent in salesagent)
                            {
                                List<DateSaleViewModel> ObjListSaleDateWiseReport = new List<DateSaleViewModel>();
                                SaleAgentDateWiseReport ObjSaleAgentDateWiseReport = new SaleAgentDateWiseReport();
                                var result = db.Sale.Where(w => w.SaleDate >= From && w.SaleDate <= To && w.CreatedBy == itemagent.AgentId && w.FranchiseId == itemss.FranchiseId && w.IsActive == true && w.IsDeleted == false).OrderBy(o => o.SaleDate).ToList();
                                foreach (var item in result)
                                {
                                    DateSaleViewModel ObjSaleViewModel = new DateSaleViewModel();
                                    List<SaleDetailViewModel> ObjlistSaleDetailViewModel = new List<SaleDetailViewModel>();
                                    var saleorderdetails = db.SaleDetails.Where(w => w.SaleId == item.SaleId).ToList();
                                    foreach (var items in saleorderdetails)
                                    {
                                        SaleDetailViewModel ObjSaleDetailViewModel = new SaleDetailViewModel();
                                        ObjSaleDetailViewModel.ItemId = items.ItemId;
                                        ObjSaleDetailViewModel.ItemName = db.Item.Where(w => w.ItemId == items.ItemId).Select(s => s.ItemName).FirstOrDefault();
                                        ObjSaleDetailViewModel.Quantity = items.Quantity;
                                        ObjSaleDetailViewModel.TotalPrice = items.TotalPrice;
                                        ObjSaleDetailViewModel.UnitPrice = items.UnitPrice;
                                        ObjlistSaleDetailViewModel.Add(ObjSaleDetailViewModel);
                                    }
                                    ObjSaleViewModel.BillNumber = item.BillNumber;
                                    ObjSaleViewModel.Discount = item.Discount;
                                    ObjSaleViewModel.Quantity = item.Quantity;
                                    ObjSaleViewModel.SaleDate = item.SaleDate;
                                    ObjSaleViewModel.BalanceAmount = item.Amount;
                                    ObjSaleViewModel.CouponValue = item.CouponValue == null ? 0 : item.CouponValue.Value;
                                    ObjSaleViewModel.ShippingAmount = item.ShippingAmount;
                                    ObjSaleViewModel.Notes = item.Notes;
                                    var customer = db.Customer.Where(w => w.CustomerId == item.CustomerId).Select(s => new { s.CustomerName, s.CustomerContactNo }).FirstOrDefault();
                                    if (customer != null)
                                    {
                                        ObjSaleViewModel.CustomerNumber = customer.CustomerContactNo;
                                        ObjSaleViewModel.CustomerName = customer.CustomerName;
                                    }
                                    else
                                    {
                                        ObjSaleViewModel.CustomerNumber = "";
                                        ObjSaleViewModel.CustomerName = "Guest";
                                    }
                                    ObjSaleViewModel.SaleDetails = ObjlistSaleDetailViewModel;
                                    ObjListSaleDateWiseReport.Add(ObjSaleViewModel);
                                }
                                ObjSaleAgentDateWiseReport.AgentId = itemagent.AgentId;
                                ObjSaleAgentDateWiseReport.AgentName = itemagent.AgentName;
                                ObjSaleAgentDateWiseReport.Salelist = ObjListSaleDateWiseReport;
                                ObjListSaleAgentDateWiseReport.Add(ObjSaleAgentDateWiseReport);
                            }
                            objSaleDateWiseReport.FranchiseId = itemss.FranchiseId;
                            objSaleDateWiseReport.FranchiseName = itemss.FranchiseName;
                            objSaleDateWiseReport.SaleAgentlist = ObjListSaleAgentDateWiseReport;
                            ObjListSaleDateWiseReportr.Add(objSaleDateWiseReport);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListSaleDateWiseReportr;
                        return Ok(aPIResponse);
                    }
                }
                return Ok(aPIResponse);
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 200;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }


        [HttpGet]
        [Route("DateWiseRentReport")]
        public IActionResult DateWiseRentReport(DateTime From, DateTime To, int FranchiseId)
        {
            try
            {
                To = To.AddDays(1).AddMinutes(-1);
                using (var db = new POSRentingContext())
                {
                    List<RentViewModel> ObjListSaleViewModel = new List<RentViewModel>();
                    if (FranchiseId > 0)
                    {
                        var franchise = db.Franchise.Where(w => w.IsActive == true && w.IsDeleted == false).ToList();
                        List<RentDateWiseReport> ObjListSaleDateWiseReportr = new List<RentDateWiseReport>();
                        RentDateWiseReport objSaleDateWiseReport = new RentDateWiseReport();
                        var salesagent = (from p in db.Rent
                                          join q in db.User on p.IssuedBy equals q.UserId
                                          where p.RentedOn >= From && p.RentedOn <= To && p.FranchiseId == FranchiseId && q.IsActive == true && q.IsDeleted == false
                                          select new RentAgentDateWiseReport()
                                          {
                                              AgentId = Convert.ToInt32(q.UserId),
                                              AgentName = q.FirstName
                                          }).Distinct().ToList();
                        //salesagent = salesagent.Distinct().ToList();
                        List<RentAgentDateWiseReport> ObjListSaleAgentDateWiseReport = new List<RentAgentDateWiseReport>();
                        foreach (var itemagent in salesagent)
                        {
                            List<DateRentViewModel> ObjListSaleDateWiseReport = new List<DateRentViewModel>();
                            RentAgentDateWiseReport ObjSaleAgentDateWiseReport = new RentAgentDateWiseReport();
                            var result = db.Rent.Where(w => w.RentedOn >= From && w.RentedOn <= To && w.IssuedBy == itemagent.AgentId && w.FranchiseId == FranchiseId && w.IsDeleted == false && w.IsActive == true).ToList();
                            foreach (var item in result)
                            {
                                DateRentViewModel ObjSaleViewModel = new DateRentViewModel();
                                List<RentDetailsViewModel> ObjlistSaleDetailViewModel = new List<RentDetailsViewModel>();
                                var saleorderdetails = db.RentDetails.Where(w => w.RentId == item.RentId).ToList();
                                foreach (var items in saleorderdetails)
                                {
                                    RentDetailsViewModel ObjSaleDetailViewModel = new RentDetailsViewModel();
                                    ObjSaleDetailViewModel.ItemId = items.ItemId;
                                    ObjSaleDetailViewModel.ItemName = db.Item.Where(w => w.ItemId == items.ItemId).Select(s => s.ItemName).FirstOrDefault();
                                    ObjSaleDetailViewModel.Quantity = items.Quantity;
                                    ObjSaleDetailViewModel.Security = items.Security;
                                    ObjSaleDetailViewModel.UnitPrice = items.UnitPrice;
                                    ObjSaleDetailViewModel.TotalPrice = items.TotalPrice;
                                    ObjlistSaleDetailViewModel.Add(ObjSaleDetailViewModel);
                                }
                                ObjSaleViewModel.BillNumber = item.BillNumber;
                                ObjSaleViewModel.Discount = item.Discount;
                                ObjSaleViewModel.Quantity = item.Quantity;
                                ObjSaleViewModel.RentedOn = item.RentedOn;
                                ObjSaleViewModel.RentedDate = item.ReturnDate;
                                ObjSaleViewModel.LateCharges = item.AdditionalCharges;
                                ObjSaleViewModel.BalanceAmount = item.Amount;
                                ObjSaleViewModel.CouponValue = item.CouponValue == null ? 0 : item.CouponValue.Value;
                                ObjSaleViewModel.Notes = item.Notes;
                                ObjSaleViewModel.Security = item.Security;
                                ObjSaleViewModel.CreatedDate = item.CreatedDate;
                                ObjSaleViewModel.ReturnDate = item.ReturnDate;
                                ObjSaleViewModel.Hips = item.Hips;
                                ObjSaleViewModel.SkirtLength = item.SkirtLength;
                                ObjSaleViewModel.Waist = item.Waist;
                                ObjSaleViewModel.Bust = item.Bust;
                                ObjSaleViewModel.ShippingAmount = item.ShippingAmount;
                                var customer = db.Customer.Where(w => w.CustomerId == item.CustomerId).Select(s => new { s.CustomerName, s.CustomerContactNo,s.CustomerAddress }).FirstOrDefault();
                                if (customer != null)
                                {
                                    ObjSaleViewModel.CustomerNumber = customer.CustomerContactNo;
                                    ObjSaleViewModel.CustomerName = customer.CustomerName;
                                    ObjSaleViewModel.CustomerAddress = customer.CustomerAddress;
                                }
                                else
                                {
                                    ObjSaleViewModel.CustomerNumber = "";
                                    ObjSaleViewModel.CustomerName = "Guest";
                                    ObjSaleViewModel.CustomerAddress = "";
                                }
                                ObjSaleViewModel.RentDetails = ObjlistSaleDetailViewModel;
                                ObjListSaleDateWiseReport.Add(ObjSaleViewModel);
                            }
                            ObjSaleAgentDateWiseReport.AgentId = itemagent.AgentId;
                            ObjSaleAgentDateWiseReport.AgentName = itemagent.AgentName;
                            ObjSaleAgentDateWiseReport.Rentlist = ObjListSaleDateWiseReport;
                            ObjListSaleAgentDateWiseReport.Add(ObjSaleAgentDateWiseReport);
                        }
                        objSaleDateWiseReport.FranchiseId = FranchiseId;
                        objSaleDateWiseReport.FranchiseName = db.Franchise.Where(w => w.FranchiseId == FranchiseId).Select(s => s.FranchiseName).FirstOrDefault(); ;
                        objSaleDateWiseReport.RentAgentlist = ObjListSaleAgentDateWiseReport;
                        ObjListSaleDateWiseReportr.Add(objSaleDateWiseReport);
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListSaleDateWiseReportr;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        var franchise = db.Franchise.Where(w => w.IsActive == true && w.IsDeleted == false).ToList();
                        List<RentDateWiseReport> ObjListSaleDateWiseReportr = new List<RentDateWiseReport>();
                        foreach (var itemss in franchise)
                        {
                            RentDateWiseReport objSaleDateWiseReport = new RentDateWiseReport();

                            var salesagent = (from p in db.Rent
                                              join q in db.User on p.IssuedBy equals q.UserId
                                              where p.RentedOn >= From && p.RentedOn <= To && p.FranchiseId == itemss.FranchiseId && q.IsActive == true && q.IsDeleted == false
                                              select new RentAgentDateWiseReport()
                                              {
                                                  AgentId = Convert.ToInt32(q.UserId),
                                                  AgentName = q.FirstName
                                              }).Distinct().ToList();
                            List<RentAgentDateWiseReport> ObjListSaleAgentDateWiseReport = new List<RentAgentDateWiseReport>();
                            foreach (var itemagent in salesagent)
                            {
                                List<DateRentViewModel> ObjListSaleDateWiseReport = new List<DateRentViewModel>();
                                RentAgentDateWiseReport ObjSaleAgentDateWiseReport = new RentAgentDateWiseReport();
                                var result = db.Rent.Where(w => w.RentedOn >= From && w.RentedOn <= To && w.IssuedBy == itemagent.AgentId && w.FranchiseId == itemss.FranchiseId && w.IsDeleted == false && w.IsActive == true).ToList();
                                foreach (var item in result)
                                {
                                    DateRentViewModel ObjSaleViewModel = new DateRentViewModel();
                                    List<RentDetailsViewModel> ObjlistSaleDetailViewModel = new List<RentDetailsViewModel>();
                                    var saleorderdetails = db.RentDetails.Where(w => w.RentId == item.RentId).ToList();
                                    foreach (var items in saleorderdetails)
                                    {
                                        RentDetailsViewModel ObjSaleDetailViewModel = new RentDetailsViewModel();
                                        ObjSaleDetailViewModel.ItemId = items.ItemId;
                                        ObjSaleDetailViewModel.ItemName = db.Item.Where(w => w.ItemId == items.ItemId).Select(s => s.ItemName).FirstOrDefault();
                                        ObjSaleDetailViewModel.Quantity = items.Quantity;
                                        ObjSaleDetailViewModel.TotalPrice = items.TotalPrice;
                                        ObjSaleDetailViewModel.UnitPrice = items.UnitPrice;
                                        ObjSaleDetailViewModel.Security = items.Security;
                                        ObjlistSaleDetailViewModel.Add(ObjSaleDetailViewModel);
                                    }
                                    ObjSaleViewModel.BillNumber = item.BillNumber;
                                    ObjSaleViewModel.Discount = item.Discount;
                                    ObjSaleViewModel.Quantity = item.Quantity;
                                    ObjSaleViewModel.RentedOn = item.RentedOn;
                                    ObjSaleViewModel.LateCharges = item.AdditionalCharges;
                                    ObjSaleViewModel.BalanceAmount = item.Amount;
                                    ObjSaleViewModel.CouponValue = item.CouponValue == null ? 0 : item.CouponValue.Value;
                                    ObjSaleViewModel.Notes = item.Notes;
                                    ObjSaleViewModel.Security = item.Security;
                                    ObjSaleViewModel.CreatedDate = item.CreatedDate;
                                    ObjSaleViewModel.ReturnDate = item.ReturnDate;
                                    ObjSaleViewModel.ShippingAmount = item.ShippingAmount;
                                    var customer = db.Customer.Where(w => w.CustomerId == item.CustomerId).Select(s => new { s.CustomerName, s.CustomerContactNo }).FirstOrDefault();
                                    if (customer != null)
                                    {
                                        ObjSaleViewModel.CustomerNumber = customer.CustomerContactNo;
                                        ObjSaleViewModel.CustomerName = customer.CustomerName;
                                    }
                                    else
                                    {
                                        ObjSaleViewModel.CustomerNumber = "";
                                        ObjSaleViewModel.CustomerName = "Guest";
                                    }
                                    ObjSaleViewModel.RentDetails = ObjlistSaleDetailViewModel;
                                    ObjListSaleDateWiseReport.Add(ObjSaleViewModel);
                                }
                                ObjSaleAgentDateWiseReport.AgentId = itemagent.AgentId;
                                ObjSaleAgentDateWiseReport.AgentName = itemagent.AgentName;
                                ObjSaleAgentDateWiseReport.Rentlist = ObjListSaleDateWiseReport;
                                ObjListSaleAgentDateWiseReport.Add(ObjSaleAgentDateWiseReport);
                            }
                            objSaleDateWiseReport.FranchiseId = itemss.FranchiseId;
                            objSaleDateWiseReport.FranchiseName = itemss.FranchiseName;
                            objSaleDateWiseReport.RentAgentlist = ObjListSaleAgentDateWiseReport;
                            ObjListSaleDateWiseReportr.Add(objSaleDateWiseReport);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListSaleDateWiseReportr;
                        return Ok(aPIResponse);
                    }
                }
                return Ok(aPIResponse);
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 200;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
                throw;
            }
            return Ok(aPIResponse);
        }

        [HttpGet]
        [Route("GetRentInventories")]
        public ActionResult GetRentInventories(int FranchiseId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    if (FranchiseId == 0)
                    {
                        var franchise = db.Franchise.Where(w => w.IsActive == true && w.IsDeleted == false).ToList();
                        List<GetInventoryRentViewModel> ObjListGetInventoryRentViewModel = new List<GetInventoryRentViewModel>();
                        foreach (var item in franchise)
                        {
                            GetInventoryRentViewModel ObjGetInventoryRentViewModel = new GetInventoryRentViewModel();
                            ObjGetInventoryRentViewModel.FranchiseId = item.FranchiseId;
                            ObjGetInventoryRentViewModel.FranchiseName = item.FranchiseName;
                            List<GetInventoryViewModel> ObjlistGetInventoryViewModel = new List<GetInventoryViewModel>();
                            var inventory = (from p in db.Item
                                             join q in db.RentDetails on p.ItemId equals q.ItemId
                                             join s in db.UnitCategory on p.UnitCategoryId equals s.UnitCategoryId
                                             join r in db.UnitMeasurement on p.UnitMeasurementId equals r.UnitMeasurementId
                                             where q.IsReturned == "false" && p.IsActive == true && p.IsDeleted == false && p.FranchiseId == item.FranchiseId
                                             select new GetInventoryViewModel()
                                             {
                                                 ItemId = p.ItemId,
                                                 ItemName = p.ItemName,
                                                 QuantityStock = p.QuantityStock.Value - q.Quantity.Value,
                                                 SKU = p.Sku,
                                                 UnitCategoryName = s.UnitCategoryName,
                                                 UnitMeasurementName = r.UnitMeasurementName,
                                                 RentedQuantityStock = q.Quantity.Value,
                                                 TotalQuantity = p.QuantityStock.Value
                                             }).ToList();
                            ObjGetInventoryRentViewModel.InventoryRentList = inventory;
                            ObjListGetInventoryRentViewModel.Add(ObjGetInventoryRentViewModel);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListGetInventoryRentViewModel;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        List<GetInventoryRentViewModel> ObjListGetInventoryRentViewModel = new List<GetInventoryRentViewModel>();
                        GetInventoryRentViewModel ObjGetInventoryRentViewModel = new GetInventoryRentViewModel();
                        ObjGetInventoryRentViewModel.FranchiseId = FranchiseId;
                        ObjGetInventoryRentViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == FranchiseId).Select(s => s.FranchiseName).FirstOrDefault(); ;
                        List<GetInventoryViewModel> ObjlistGetInventoryViewModel = new List<GetInventoryViewModel>();
                        var inventory = (from p in db.Item
                                         join q in db.RentDetails on p.ItemId equals q.ItemId
                                         join s in db.UnitCategory on p.UnitCategoryId equals s.UnitCategoryId
                                         join r in db.UnitMeasurement on p.UnitMeasurementId equals r.UnitMeasurementId
                                         where q.IsReturned == "false" && p.IsActive == true && p.IsDeleted == false && p.FranchiseId == FranchiseId
                                         select new GetInventoryViewModel()
                                         {
                                             ItemId = p.ItemId,
                                             ItemName = p.ItemName,
                                             QuantityStock = p.QuantityStock.Value - q.Quantity.Value,
                                             SKU = p.Sku,
                                             UnitCategoryName = s.UnitCategoryName,
                                             UnitMeasurementName = r.UnitMeasurementName,
                                             RentedQuantityStock = q.Quantity.Value,
                                             TotalQuantity = p.QuantityStock.Value
                                         }).ToList();
                        foreach (var itemaa in inventory)
                        {
                            GetInventoryViewModel ObjItemsProductViewModel = new GetInventoryViewModel();
                            ObjItemsProductViewModel.ItemId = itemaa.ItemId;
                            ObjItemsProductViewModel.ItemName = itemaa.ItemName;
                            ObjItemsProductViewModel.SKU = itemaa.SKU;
                            ObjItemsProductViewModel.QuantityStock = itemaa.QuantityStock;
                            ObjItemsProductViewModel.TotalQuantity = itemaa.TotalQuantity;
                            ObjItemsProductViewModel.RentedQuantityStock = itemaa.RentedQuantityStock;
                            ObjlistGetInventoryViewModel.Add(ObjItemsProductViewModel);
                        }
                        ObjGetInventoryRentViewModel.InventoryRentList = inventory;
                        ObjListGetInventoryRentViewModel.Add(ObjGetInventoryRentViewModel);
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListGetInventoryRentViewModel;
                        return Ok(aPIResponse);
                    }
                }
                return Ok(aPIResponse);
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 200;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }



        [HttpGet]
        [Route("GetInventories")]
        public ActionResult GetSaleInventories(int FranchiseId)
        {
            try
            {
                if (FranchiseId == 0)
                {
                    using (var db = new POSRentingContext())
                    {
                        var franchise = db.Franchise.Where(w => w.IsActive == true && w.IsDeleted == false).ToList();
                        List<GetInventorySaleViewModel> ObjListGetInventoryRentViewModel = new List<GetInventorySaleViewModel>();
                        foreach (var item in franchise)
                        {
                            GetInventorySaleViewModel ObjGetInventorySaleViewModel = new GetInventorySaleViewModel();
                            List<GetInventoryViewModel> ObjListGetInventoryViewModel = new List<GetInventoryViewModel>();
                            var inventory = (from p in db.Item
                                             join q in db.UnitCategory on p.UnitCategoryId equals q.UnitCategoryId
                                             join r in db.UnitMeasurement on p.UnitMeasurementId equals r.UnitMeasurementId
                                             where p.FranchiseId == item.FranchiseId && p.IsActive == true && p.IsDeleted == false
                                             select new GetInventoryViewModel()
                                             {
                                                 ItemId = p.ItemId,
                                                 ItemName = p.ItemName,
                                                 SKU = p.Sku,
                                                 UnitCategoryName = q.UnitCategoryName,
                                                 UnitMeasurementName = r.UnitMeasurementName,
                                                 QuantityStock = p.QuantityStock,
                                                 MinimumStockValue = p.MinimumStockValue
                                             }).ToList();
                            ObjGetInventorySaleViewModel.InventorySaleList = inventory;
                            ObjGetInventorySaleViewModel.FranchiseName = item.FranchiseName;
                            ObjGetInventorySaleViewModel.FranchiseId = item.FranchiseId;
                            ObjListGetInventoryRentViewModel.Add(ObjGetInventorySaleViewModel);
                        }

                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListGetInventoryRentViewModel;
                        return Ok(aPIResponse);
                    }
                }
                else
                {
                    using (var db = new POSRentingContext())
                    {
                        List<GetInventorySaleViewModel> ObjListGetInventoryRentViewModel = new List<GetInventorySaleViewModel>();

                        GetInventorySaleViewModel ObjGetInventorySaleViewModel = new GetInventorySaleViewModel();
                        List<GetInventoryViewModel> ObjListGetInventoryViewModel = new List<GetInventoryViewModel>();
                        var inventory = (from p in db.Item
                                         join q in db.UnitCategory on p.UnitCategoryId equals q.UnitCategoryId
                                         join r in db.UnitMeasurement on p.UnitMeasurementId equals r.UnitMeasurementId
                                         where p.FranchiseId == FranchiseId && p.IsActive == true && p.IsDeleted == false
                                         select new GetInventoryViewModel()
                                         {
                                             ItemId = p.ItemId,
                                             ItemName = p.ItemName,
                                             SKU = p.Sku,
                                             QuantityStock = p.QuantityStock,
                                             UnitCategoryName = q.UnitCategoryName,
                                             UnitMeasurementName = r.UnitMeasurementName,
                                             MinimumStockValue = p.MinimumStockValue,

                                         }).ToList();
                        ObjGetInventorySaleViewModel.InventorySaleList = inventory;
                        ObjGetInventorySaleViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        ObjGetInventorySaleViewModel.FranchiseId = FranchiseId;
                        ObjListGetInventoryRentViewModel.Add(ObjGetInventorySaleViewModel);
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListGetInventoryRentViewModel;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 200;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }


        [HttpGet]
        [Route("GetDashSaleReport")]
        public IActionResult GetDashSaleReport(int FranchiseId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {

                    //var connection = (SqlConnection)db.Database.AsSqlServer().Connection.DbConnection;
                    var connection = (SqlConnection)db.Database.GetDbConnection();
                    var command = connection.CreateCommand();
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "SpGetSummeryOfSale";

                    command.Parameters.AddWithValue("@FranchiseId", FranchiseId);
                    connection.Open();
                    command.Connection = connection;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = command;
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;



                    DataSet ds = new DataSet();
                    da.Fill(ds);
                    SaleSummaryViewModel ObjSaleSummaryViewModel = new SaleSummaryViewModel();
                    ObjSaleSummaryViewModel.DailySales = Convert.ToDecimal(ds.Tables[0].Rows[0]["TodaysSale"]);
                    ObjSaleSummaryViewModel.WeeklySales = Convert.ToDecimal(ds.Tables[0].Rows[0]["WeeklySale"]);
                    ObjSaleSummaryViewModel.MonthlySales = Convert.ToDecimal(ds.Tables[0].Rows[0]["MonthlySale"]);
                    ObjSaleSummaryViewModel.YearlySales = Convert.ToDecimal(ds.Tables[0].Rows[0]["YearlySale"]);
                    ObjSaleSummaryViewModel.DailyRent = Convert.ToDecimal(ds.Tables[0].Rows[0]["TodaysRent"]);
                    ObjSaleSummaryViewModel.WeeklyRent = Convert.ToDecimal(ds.Tables[0].Rows[0]["WeeklyRent"]);
                    ObjSaleSummaryViewModel.MonthlyRent = Convert.ToDecimal(ds.Tables[0].Rows[0]["MonthlyRent"]);
                    ObjSaleSummaryViewModel.YearlyRent = Convert.ToDecimal(ds.Tables[0].Rows[0]["YearlyRent"]);
                    connection.Close();

                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjSaleSummaryViewModel;


                }

            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 200;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }


            return Ok(aPIResponse);
        }



        [HttpGet]
        [Route("GetMonthlySaleReport")]
        public IActionResult GetMonthlySaleReport(int FranchiseId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    //var connection = (SqlConnection)db.Database.AsSqlServer().Connection.DbConnection;
                    var connection = (SqlConnection)db.Database.GetDbConnection();
                    var command = connection.CreateCommand();
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "spGetMonthlySales";

                    command.Parameters.AddWithValue("@FranchiseId", FranchiseId);
                    connection.Open();
                    command.Connection = connection;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = command;
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;
                    DataSet ds = new DataSet();
                    da.Fill(ds);
                    //   List<SaleSummaryMonthlyvViewModel> ObjListSaleSummaryMonthlyvViewModel = new List<SaleSummaryMonthlyvViewModel>();
                    var franchise = db.Franchise.Where(w => w.IsDeleted == false && w.IsActive == true).ToList();
                    List<SaleSummaryMonthlyViewModel> ObjlistSaleSummaryMonthlyViewModel = new List<SaleSummaryMonthlyViewModel>();
                    SaleSummaryMonthlyViewModel ObjSaleSummaryViewModel;
                    foreach (var item in franchise)
                    {
                        List<MonSalesdata> objListMonSalesdata = new List<MonSalesdata>();
                        DataView dv1 = ds.Tables[0].DefaultView;
                        dv1.RowFilter = "FranchiseName = '" + item.FranchiseName + "'";
                        DataTable dtNew = dv1.ToTable();

                        foreach (DataRow dtnewRow in dtNew.Rows)
                        {
                            ObjSaleSummaryViewModel = new SaleSummaryMonthlyViewModel();
                            ObjSaleSummaryViewModel.FranchiseName = Convert.ToString(item.FranchiseName);

                            for (Int32 i = 1; i < 13; i++)
                            {

                                MonSalesdata objMonSalesdata = new MonSalesdata();

                                DataView dvgetSales = ds.Tables[0].DefaultView;
                                if (i.ToString().Length < 2)
                                {
                                    dvgetSales.RowFilter = "MonthNumber = '0" + i + "' and FranchiseName ='" + Convert.ToString(item.FranchiseName) + "'";
                                }
                                else
                                {
                                    dvgetSales.RowFilter = "MonthNumber = '" + i + "'and FranchiseName ='" + Convert.ToString(item.FranchiseName) + "'";
                                }
                                DataTable dtNewgetSales = dvgetSales.ToTable();

                                if (dtNewgetSales.Rows.Count > 0)
                                {
                                    objMonSalesdata.Salesdata = Convert.ToString(dtNewgetSales.Rows[0]["MonthlySales"]);
                                }
                                else
                                {
                                    objMonSalesdata.Salesdata = string.Empty;
                                }
                                objListMonSalesdata.Add(objMonSalesdata);

                            }
                            ObjSaleSummaryViewModel.Data = objListMonSalesdata;
                            ObjlistSaleSummaryMonthlyViewModel.Add(ObjSaleSummaryViewModel);
                            break;
                        }



                    }


                    //  SaleSummaryMonthlyvViewModel ObjSaleSummaryMonthlyvViewModel = new SaleSummaryMonthlyvViewModel();
                    // ObjSaleSummaryMonthlyvViewModel.FranchiseName = item.FranchiseName;
                    //  ObjSaleSummaryMonthlyvViewModel.SaleSummaryDetails = ObjlistSaleSummaryMonthlyViewModel;
                    // ObjListSaleSummaryMonthlyvViewModel.Add(ObjSaleSummaryMonthlyvViewModel);

                    connection.Close();

                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjlistSaleSummaryMonthlyViewModel;
                }

            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 200;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
            return Ok(aPIResponse);
        }



        [HttpGet]
        [Route("GetMonthlyRentReport")]
        public IActionResult GetMonthlyRentReport(int FranchiseId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    //var connection = (SqlConnection)db.Database.AsSqlServer().Connection.DbConnection;
                    var connection = (SqlConnection)db.Database.GetDbConnection();
                    var command = connection.CreateCommand();
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "spGetMonthlyRent";

                    command.Parameters.AddWithValue("@FranchiseId", FranchiseId);
                    connection.Open();
                    command.Connection = connection;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = command;
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;
                    DataSet ds = new DataSet();
                    da.Fill(ds);
                    //   List<SaleSummaryMonthlyvViewModel> ObjListSaleSummaryMonthlyvViewModel = new List<SaleSummaryMonthlyvViewModel>();
                    var franchise = db.Franchise.Where(w => w.IsDeleted == false && w.IsActive == true).ToList();
                    List<SaleSummaryMonthlyViewModel> ObjlistSaleSummaryMonthlyViewModel = new List<SaleSummaryMonthlyViewModel>();
                    SaleSummaryMonthlyViewModel ObjSaleSummaryViewModel;
                    foreach (var item in franchise)
                    {
                        List<MonSalesdata> objListMonSalesdata = new List<MonSalesdata>();
                        DataView dv1 = ds.Tables[0].DefaultView;
                        dv1.RowFilter = "FranchiseName = '" + item.FranchiseName + "'";
                        DataTable dtNew = dv1.ToTable();

                        foreach (DataRow dtnewRow in dtNew.Rows)
                        {
                            ObjSaleSummaryViewModel = new SaleSummaryMonthlyViewModel();
                            ObjSaleSummaryViewModel.FranchiseName = Convert.ToString(item.FranchiseName);

                            for (Int32 i = 1; i < 13; i++)
                            {

                                MonSalesdata objMonSalesdata = new MonSalesdata();

                                DataView dvgetSales = ds.Tables[0].DefaultView;
                                if (i.ToString().Length < 2)
                                {
                                    dvgetSales.RowFilter = "MonthNumber = '0" + i + "' and FranchiseName ='" + Convert.ToString(item.FranchiseName) + "'";
                                }
                                else
                                {
                                    dvgetSales.RowFilter = "MonthNumber = '" + i + "'and FranchiseName ='" + Convert.ToString(item.FranchiseName) + "'";
                                }
                                DataTable dtNewgetSales = dvgetSales.ToTable();

                                if (dtNewgetSales.Rows.Count > 0)
                                {
                                    objMonSalesdata.Salesdata = Convert.ToString(dtNewgetSales.Rows[0]["MonthlySales"]);
                                }
                                else
                                {
                                    objMonSalesdata.Salesdata = string.Empty;
                                }
                                objListMonSalesdata.Add(objMonSalesdata);

                            }
                            ObjSaleSummaryViewModel.Data = objListMonSalesdata;
                            ObjlistSaleSummaryMonthlyViewModel.Add(ObjSaleSummaryViewModel);
                            break;
                        }
                    }
                    connection.Close();
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjlistSaleSummaryMonthlyViewModel;
                }

            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 200;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
            return Ok(aPIResponse);
        }






        [HttpGet]
        [Route("GetMonthlySaleofFranchiseandSalesAgentReport")]
        public IActionResult GetMonthlySaleofFranchiseandSalesAgentReport(int FranchiseId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    //var connection = (SqlConnection)db.Database.AsSqlServer().Connection.DbConnection;
                    var connection = (SqlConnection)db.Database.GetDbConnection();
                    var command = connection.CreateCommand();
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "spMonthlySalesOfFranchisesAndSalesAgent";

                    command.Parameters.AddWithValue("@FranchiseId", FranchiseId);
                    connection.Open();
                    command.Connection = connection;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = command;
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;
                    DataSet ds = new DataSet();
                    da.Fill(ds);
                    List<SaleSummaryMonthlyViewModel> ObjlistSaleSummaryMonthlyViewModel = new List<SaleSummaryMonthlyViewModel>();
                    foreach (DataRow item in ds.Tables[0].Rows)
                    {
                        SaleSummaryMonthlyViewModel ObjSaleSummaryViewModel = new SaleSummaryMonthlyViewModel();
                        ObjSaleSummaryViewModel.MonthlySales = Convert.ToDecimal(item["MonthlySales"]);
                        ObjSaleSummaryViewModel.MonthName = Convert.ToString(item["MName"]);
                        ObjSaleSummaryViewModel.MonthNumber = Convert.ToInt32(item["MonthNumber"]);
                        ObjSaleSummaryViewModel.FranchiseName = Convert.ToString(item["FranchiseName"]);
                        ObjlistSaleSummaryMonthlyViewModel.Add(ObjSaleSummaryViewModel);
                    }
                    connection.Close();

                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjlistSaleSummaryMonthlyViewModel;
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 200;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
            return Ok(aPIResponse);
        }


        [HttpGet]
        [Route("GetMonthlyRentofFranchiseandRentAgentReport")]
        public IActionResult GetMonthlyRentofFranchiseandRentAgentReport(int FranchiseId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    //var connection = (SqlConnection)db.Database.AsSqlServer().Connection.DbConnection;
                    var connection = (SqlConnection)db.Database.GetDbConnection();
                    var command = connection.CreateCommand();
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "spMonthlyRentOfFranchisesAndRentAgent";

                    command.Parameters.AddWithValue("@FranchiseId", FranchiseId);
                    connection.Open();
                    command.Connection = connection;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = command;
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;
                    DataSet ds = new DataSet();
                    da.Fill(ds);
                    List<SaleSummaryMonthlyViewModel> ObjlistSaleSummaryMonthlyViewModel = new List<SaleSummaryMonthlyViewModel>();
                    foreach (DataRow item in ds.Tables[0].Rows)
                    {
                        SaleSummaryMonthlyViewModel ObjSaleSummaryViewModel = new SaleSummaryMonthlyViewModel();
                        ObjSaleSummaryViewModel.MonthlySales = Convert.ToDecimal(item["MonthlySales"]);
                        ObjSaleSummaryViewModel.MonthName = Convert.ToString(item["MName"]);
                        ObjSaleSummaryViewModel.MonthNumber = Convert.ToInt32(item["MonthNumber"]);
                        ObjSaleSummaryViewModel.FranchiseName = Convert.ToString(item["FranchiseName"]);
                        ObjlistSaleSummaryMonthlyViewModel.Add(ObjSaleSummaryViewModel);
                    }
                    connection.Close();

                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjlistSaleSummaryMonthlyViewModel;
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 200;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
            return Ok(aPIResponse);
        }


        [HttpGet]
        [Route("GetHighestSellingProduct")]
        public IActionResult GetHighestSellingProduct(int FranchiseId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    //var connection = (SqlConnection)db.Database.AsSqlServer().Connection.DbConnection;
                    var connection = (SqlConnection)db.Database.GetDbConnection();
                    var command = connection.CreateCommand();
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "spgetHighestSellingProduct";
                    command.Parameters.AddWithValue("@FranchiseId", FranchiseId);
                    connection.Open();
                    command.Connection = connection;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = command;
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    DataSet ds = new DataSet();
                    da.Fill(ds);
                    List<HighestSellingProductViewModel> ObjlisthighestSellingProductViewModel = new List<HighestSellingProductViewModel>();
                    foreach (DataTable table in ds.Tables)
                    {
                        foreach (DataRow dr in table.Rows)
                        {
                            HighestSellingProductViewModel highestSellingProductViewModel = new HighestSellingProductViewModel();
                            highestSellingProductViewModel.ItemName = dr["ItemName"].ToString();
                            highestSellingProductViewModel.Quantity = Int32.Parse(dr["QTY"].ToString());
                            highestSellingProductViewModel.TotalPrice = Convert.ToDecimal(dr["TotalPrice"].ToString());
                            highestSellingProductViewModel.SKU = dr["SKU"].ToString();
                            ObjlisthighestSellingProductViewModel.Add(highestSellingProductViewModel);
                        }
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjlisthighestSellingProductViewModel;
                }
            }
            catch (Exception ex)
            {

                aPIResponse.StatusCode = 401;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }

            return Ok(aPIResponse);
        }


        [HttpGet]
        [Route("GetHighestSellingReportProduct")]
        public IActionResult GetHighestSellingReportProduct(int FranchiseId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    //var connection = (SqlConnection)db.Database.AsSqlServer().Connection.DbConnection;
                    var connection = (SqlConnection)db.Database.GetDbConnection();
                    var command = connection.CreateCommand();
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "spgetHighestSellingProduct";
                    command.Parameters.AddWithValue("@FranchiseId", FranchiseId);
                    connection.Open();
                    command.Connection = connection;
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = command;
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    DataSet ds = new DataSet();
                    da.Fill(ds);
                    List<HighestSellingProductByFranchiseViewModel> ObjListHighestSellingProductByFranchiseViewModel = new List<HighestSellingProductByFranchiseViewModel>();
                    foreach (DataTable table in ds.Tables)
                    {
                        List<Franchise> Objlistfranchise = new List<Franchise>();
                        if (FranchiseId != 0)
                        {
                            Objlistfranchise = db.Franchise.Where(w => w.FranchiseId == FranchiseId && w.IsActive == true && w.IsDeleted == false).ToList();
                        }
                        else
                        {
                            Objlistfranchise = db.Franchise.Where(w => w.IsActive == true && w.IsDeleted == false).ToList();
                        }
                        foreach (var item in Objlistfranchise)
                        {
                            List<HighestSellingProductViewModel> ObjlisthighestSellingProductViewModel = new List<HighestSellingProductViewModel>();
                            HighestSellingProductByFranchiseViewModel ObjHighestSellingProductByFranchiseViewModel = new HighestSellingProductByFranchiseViewModel();
                            foreach (DataRow dr in table.Rows)
                            {
                                if (item.FranchiseName == dr["FranchiseName"].ToString())
                                {
                                    HighestSellingProductViewModel highestSellingProductViewModel = new HighestSellingProductViewModel();
                                    highestSellingProductViewModel.ItemId = Convert.ToInt32(dr["ItemId"].ToString());
                                    highestSellingProductViewModel.ItemName = dr["ItemName"].ToString();
                                    highestSellingProductViewModel.Quantity = Int32.Parse(dr["QTY"].ToString());
                                    highestSellingProductViewModel.TotalPrice = Convert.ToDecimal(dr["TotalPrice"].ToString());
                                    highestSellingProductViewModel.SKU = dr["SKU"].ToString();
                                    highestSellingProductViewModel.ProductLogo = dr["ProductLogo"].ToString();
                                    ObjlisthighestSellingProductViewModel.Add(highestSellingProductViewModel);
                                }
                                ObjHighestSellingProductByFranchiseViewModel.FranchiseId = item.FranchiseId;
                                ObjHighestSellingProductByFranchiseViewModel.FranchiseName = item.FranchiseName;
                                ObjHighestSellingProductByFranchiseViewModel.HighestSellingProductViewModellst = ObjlisthighestSellingProductViewModel;
                            }
                            ObjListHighestSellingProductByFranchiseViewModel.Add(ObjHighestSellingProductByFranchiseViewModel);
                        }
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjListHighestSellingProductByFranchiseViewModel;
                }
            }
            catch (Exception ex)
            {

                aPIResponse.StatusCode = 401;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }

            return Ok(aPIResponse);
        }

        #endregion

        #region UserRegion
        [HttpGet]
        [Route("GetUserRec")]
        public IActionResult GetUserRec(int userId)
        {
            List<UserViewModel> ObjListUserViewModel = new List<UserViewModel>();
            try
            {

                using (var db = new POSRentingContext())
                {
                    Common common = new Common();
                    var userlist = db.User.Where(w => w.IsDeleted == false && w.IsActive == true && w.UserId == userId).ToList();
                    foreach (var item in userlist)
                    {
                        UserViewModel userViewModel = new UserViewModel();
                        userViewModel.UserName = item.UserName;
                        userViewModel.FirstName = item.FirstName;
                        userViewModel.FranchiseId = item.FranchiseId.Value;
                        userViewModel.LastName = item.LastName;
                        userViewModel.UserId = item.UserId;
                        userViewModel.Password = common.Decrypt(item.Password);  //Added
                        userViewModel.UserRoleName = db.UserRole.Where(w => w.RoleId == item.UserRole).Select(s => s.RoleName).FirstOrDefault();
                        var franchise = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).FirstOrDefault();
                        userViewModel.UserRole = item.UserRole;
                        userViewModel.FranchiseName = franchise.FranchiseCode + " " + franchise.FranchiseName;
                        ObjListUserViewModel.Add(userViewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjListUserViewModel;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }

        [HttpPost]
        [Route("EditProfileDetail")]
        public IActionResult EditProfileDetail(UserViewModel userViewModel)
        {
            Common common = new Common();

            try
            {
                using (var db = new POSRentingContext())
                {
                    var userrecord = db.User.Where(w => w.UserId == userViewModel.UserId).FirstOrDefault();


                    if (userViewModel.UserId > 0)
                    {
                        var duplicateusr = db.User.Where(w => w.UserName == userViewModel.UserName && w.UserId != userViewModel.UserId).Any();
                        if (!duplicateusr)
                        {
                            // userrecord.FranchiseId = userViewModel.FranchiseId;
                            userrecord.UserName = userViewModel.UserName;
                            userrecord.Password = userViewModel.Password == null ? null : common.Encrypt(userViewModel.Password);
                            //  userrecord.IsActive = userViewModel.IsActive;
                            //  userrecord.IsDeleted = userViewModel.UserRole;
                            userrecord.FirstName = userViewModel.FirstName;
                            userrecord.LastName = userViewModel.LastName;
                            //  userrecord.UserRole = userViewModel.UserRole;//Role for Franchise
                            db.SaveChanges();
                            userViewModel.UserRoleName = db.UserRole.Where(w => w.RoleId == userViewModel.UserRole).Select(s => s.RoleName).FirstOrDefault();
                            aPIResponse.StatusCode = 200;
                            aPIResponse.Message = "User Updated Successfully";
                            aPIResponse.Result = userViewModel;

                        }
                        else
                        {

                            aPIResponse.StatusCode = 4001;
                            aPIResponse.Message = "Duplicate User";



                        }
                    }
                    else
                    {
                        aPIResponse.StatusCode = 4001;
                        aPIResponse.Message = "User Not Found";
                    }

                    return Ok(aPIResponse);
                }


            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }
        #endregion

        #region CustomerReport
        [HttpGet]
        [Route("GetCustomerReport")]
        public IActionResult GetCustomerReport(int CustomerId, DateTime From, DateTime To, int FranchiseId)
        {
            try
            {
                To = To.AddDays(1).AddMinutes(-1);
                using (var db = new POSRentingContext())
                {
                    List<SaleViewModel> ObjListSaleViewModel = new List<SaleViewModel>();
                    if (FranchiseId > 0)
                    {
                        var franchise = db.Franchise.Where(w => w.IsActive == true && w.IsDeleted == false).OrderBy(o => o.FranchiseName).ToList();
                        List<SaleDateWiseReport1> ObjListSaleDateWiseReportr = new List<SaleDateWiseReport1>();
                        SaleDateWiseReport1 objSaleDateWiseReport = new SaleDateWiseReport1();
                        var salesagent = (from p in db.Sale
                                          join q in db.Customer on p.CustomerId equals q.CustomerId
                                          where p.SaleDate >= From && p.SaleDate <= To && p.FranchiseId == FranchiseId && p.IsActive == true && p.IsDeleted == false
                                          select new SaleCustomerDateWiseReport()
                                          {
                                              CustomerId = q.CustomerId,
                                              CustomerName = q.CustomerName
                                          }).Distinct().OrderBy(o => o.CustomerName).ToList();
                        List<SaleCustomerDateWiseReport> ObjListSaleAgentDateWiseReport = new List<SaleCustomerDateWiseReport>();
                        foreach (var itemagent in salesagent)
                        {
                            List<DateSaleViewModel> ObjListSaleDateWiseReport = new List<DateSaleViewModel>();
                            SaleCustomerDateWiseReport ObjSaleAgentDateWiseReport = new SaleCustomerDateWiseReport();
                            var result = db.Sale.Where(w => w.SaleDate >= From && w.SaleDate <= To && w.CustomerId == itemagent.CustomerId).OrderBy(o => o.SaleDate).ToList();
                            foreach (var item in result)
                            {
                                DateSaleViewModel ObjSaleViewModel = new DateSaleViewModel();
                                List<SaleDetailViewModel> ObjlistSaleDetailViewModel = new List<SaleDetailViewModel>();
                                var saleorderdetails = db.SaleDetails.Where(w => w.SaleId == item.SaleId).ToList();
                                foreach (var items in saleorderdetails)
                                {
                                    SaleDetailViewModel ObjSaleDetailViewModel = new SaleDetailViewModel();
                                    ObjSaleDetailViewModel.ItemId = items.ItemId;
                                    ObjSaleDetailViewModel.ItemName = db.Item.Where(w => w.ItemId == items.ItemId).Select(s => s.ItemName).FirstOrDefault();
                                    ObjSaleDetailViewModel.Quantity = items.Quantity;
                                    ObjSaleDetailViewModel.UnitPrice = items.UnitPrice;
                                    ObjSaleDetailViewModel.TotalPrice = items.TotalPrice;
                                    ObjlistSaleDetailViewModel.Add(ObjSaleDetailViewModel);
                                }
                                ObjSaleViewModel.BillNumber = item.BillNumber;
                                ObjSaleViewModel.Discount = item.Discount;
                                ObjSaleViewModel.Quantity = item.Quantity;
                                ObjSaleViewModel.SaleDate = item.SaleDate;
                                ObjSaleViewModel.BalanceAmount = item.Amount;
                                ObjSaleViewModel.CouponValue = item.CouponValue == null ? 0 : item.CouponValue.Value;
                                ObjSaleViewModel.SaleDetails = ObjlistSaleDetailViewModel;
                                ObjListSaleDateWiseReport.Add(ObjSaleViewModel);
                            }
                            ObjSaleAgentDateWiseReport.CustomerId = itemagent.CustomerId;
                            ObjSaleAgentDateWiseReport.CustomerName = itemagent.CustomerName;
                            ObjSaleAgentDateWiseReport.CustomerAddress= itemagent.CustomerAddress;
                            ObjSaleAgentDateWiseReport.Salelist = ObjListSaleDateWiseReport;
                            ObjListSaleAgentDateWiseReport.Add(ObjSaleAgentDateWiseReport);
                        }
                        objSaleDateWiseReport.FranchiseId = FranchiseId;
                        objSaleDateWiseReport.FranchiseName = db.Franchise.Where(w => w.FranchiseId == FranchiseId).Select(s => s.FranchiseName).FirstOrDefault(); ;
                        objSaleDateWiseReport.SaleAgentlist = ObjListSaleAgentDateWiseReport;
                        ObjListSaleDateWiseReportr.Add(objSaleDateWiseReport);
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListSaleDateWiseReportr;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        var franchise = db.Franchise.Where(w => w.IsActive == true && w.IsDeleted == false).ToList();
                        List<SaleDateWiseReport1> ObjListSaleDateWiseReportr = new List<SaleDateWiseReport1>();
                        foreach (var itemss in franchise)
                        {
                            SaleDateWiseReport1 objSaleDateWiseReport = new SaleDateWiseReport1();

                            var salesagent = (from p in db.Sale
                                              join q in db.Customer on p.CustomerId equals q.CustomerId
                                              where p.SaleDate >= From && p.SaleDate <= To && p.FranchiseId == itemss.FranchiseId && p.IsActive == true && p.IsDeleted == false
                                              select new SaleCustomerDateWiseReport()
                                              {
                                                  CustomerId = q.CustomerId,
                                                  CustomerName = q.CustomerName
                                              }).Distinct().OrderBy(o => o.CustomerName).ToList();
                            List<SaleCustomerDateWiseReport> ObjListSaleAgentDateWiseReport = new List<SaleCustomerDateWiseReport>();
                            foreach (var itemagent in salesagent)
                            {
                                List<DateSaleViewModel> ObjListSaleDateWiseReport = new List<DateSaleViewModel>();
                                SaleCustomerDateWiseReport ObjSaleAgentDateWiseReport = new SaleCustomerDateWiseReport();
                                var result = db.Sale.Where(w => w.SaleDate >= From && w.SaleDate <= To && (w.CustomerId == itemagent.CustomerId)).OrderBy(o => o.SaleDate).ToList();
                                foreach (var item in result)
                                {
                                    DateSaleViewModel ObjSaleViewModel = new DateSaleViewModel();
                                    List<SaleDetailViewModel> ObjlistSaleDetailViewModel = new List<SaleDetailViewModel>();
                                    var saleorderdetails = db.SaleDetails.Where(w => w.SaleId == item.SaleId).ToList();
                                    foreach (var items in saleorderdetails)
                                    {
                                        SaleDetailViewModel ObjSaleDetailViewModel = new SaleDetailViewModel();
                                        ObjSaleDetailViewModel.ItemId = items.ItemId;
                                        ObjSaleDetailViewModel.ItemName = db.Item.Where(w => w.ItemId == items.ItemId).Select(s => s.ItemName).FirstOrDefault();
                                        ObjSaleDetailViewModel.Quantity = items.Quantity;
                                        ObjSaleDetailViewModel.UnitPrice = items.UnitPrice;
                                        ObjSaleDetailViewModel.TotalPrice = items.TotalPrice;
                                        ObjlistSaleDetailViewModel.Add(ObjSaleDetailViewModel);
                                    }
                                    ObjSaleViewModel.BillNumber = item.BillNumber;
                                    ObjSaleViewModel.Discount = item.Discount;
                                    ObjSaleViewModel.Quantity = item.Quantity;
                                    ObjSaleViewModel.SaleDate = item.SaleDate;
                                    ObjSaleViewModel.BalanceAmount = item.Amount;
                                    ObjSaleViewModel.CouponValue = item.CouponValue == null ? 0 : item.CouponValue.Value;
                                    ObjSaleViewModel.SaleDetails = ObjlistSaleDetailViewModel;
                                    ObjListSaleDateWiseReport.Add(ObjSaleViewModel);
                                }
                                ObjSaleAgentDateWiseReport.CustomerId = itemagent.CustomerId;
                                ObjSaleAgentDateWiseReport.CustomerName = itemagent.CustomerName;
                                ObjSaleAgentDateWiseReport.CustomerAddress = itemagent.CustomerAddress;
                                ObjSaleAgentDateWiseReport.Salelist = ObjListSaleDateWiseReport;
                                ObjListSaleAgentDateWiseReport.Add(ObjSaleAgentDateWiseReport);
                            }
                            objSaleDateWiseReport.FranchiseId = itemss.FranchiseId;
                            objSaleDateWiseReport.FranchiseName = itemss.FranchiseName;
                            objSaleDateWiseReport.SaleAgentlist = ObjListSaleAgentDateWiseReport;
                            ObjListSaleDateWiseReportr.Add(objSaleDateWiseReport);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListSaleDateWiseReportr;
                        return Ok(aPIResponse);
                    }
                }
                return Ok(aPIResponse);
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10003;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }

        [HttpGet]
        [Route("GetCustomerRentReport")]
        public IActionResult GetCustomerRentReport(int CustomerId, DateTime From, DateTime To, int FranchiseId)
        {
            try
            {
                To = To.AddDays(1).AddMinutes(-1);
                using (var db = new POSRentingContext())
                {
                    List<RentViewModel> ObjListSaleViewModel = new List<RentViewModel>();
                    if (FranchiseId > 0)
                    {
                        var franchise = db.Franchise.Where(w => w.IsActive == true && w.IsDeleted == false).ToList();
                        List<RentDateWiseReport1> ObjListSaleDateWiseReportr = new List<RentDateWiseReport1>();
                        RentDateWiseReport1 objSaleDateWiseReport = new RentDateWiseReport1();
                        var salesagent = (from p in db.Rent
                                          join q in db.Customer on p.CustomerId equals q.CustomerId
                                          where p.RentedOn >= From && p.RentedOn <= To && p.FranchiseId == FranchiseId && p.IsActive == true && p.IsDeleted == false
                                          select new RentCustomerDateWiseReport()
                                          {
                                              CustomerId = Convert.ToInt32(q.CustomerId),
                                              CustomerName = q.CustomerName
                                          }).Distinct().ToList();
                        //salesagent = salesagent.Distinct().ToList();
                        List<RentCustomerDateWiseReport> ObjListSaleAgentDateWiseReport = new List<RentCustomerDateWiseReport>();
                        foreach (var itemagent in salesagent)
                        {
                            List<DateRentViewModel> ObjListSaleDateWiseReport = new List<DateRentViewModel>();
                            RentCustomerDateWiseReport ObjSaleAgentDateWiseReport = new RentCustomerDateWiseReport();
                            var result = db.Rent.Where(w => w.RentedOn >= From && w.RentedOn <= To && w.CustomerId == itemagent.CustomerId).ToList();
                            foreach (var item in result)
                            {
                                DateRentViewModel ObjSaleViewModel = new DateRentViewModel();
                                List<RentDetailsViewModel> ObjlistSaleDetailViewModel = new List<RentDetailsViewModel>();
                                var saleorderdetails = db.RentDetails.Where(w => w.RentId == item.RentId).ToList();
                                foreach (var items in saleorderdetails)
                                {
                                    RentDetailsViewModel ObjSaleDetailViewModel = new RentDetailsViewModel();
                                    ObjSaleDetailViewModel.ItemId = items.ItemId;
                                    ObjSaleDetailViewModel.ItemName = db.Item.Where(w => w.ItemId == items.ItemId).Select(s => s.ItemName).FirstOrDefault();
                                    ObjSaleDetailViewModel.Quantity = items.Quantity;
                                    ObjSaleDetailViewModel.Security = items.Security;
                                    ObjSaleDetailViewModel.UnitPrice = items.UnitPrice;
                                    ObjSaleDetailViewModel.TotalPrice = items.TotalPrice;
                                    ObjlistSaleDetailViewModel.Add(ObjSaleDetailViewModel);
                                }
                                ObjSaleViewModel.BillNumber = item.BillNumber;
                                ObjSaleViewModel.Discount = item.Discount;
                                ObjSaleViewModel.Quantity = item.Quantity;
                                ObjSaleViewModel.RentedOn = item.RentedOn;
                                ObjSaleViewModel.RentedDate = item.ReturnDate;
                                ObjSaleViewModel.LateCharges = item.AdditionalCharges;
                                ObjSaleViewModel.Hips = item.Hips;
                                ObjSaleViewModel.Bust = item.Bust;
                                ObjSaleViewModel.SkirtLength = item.SkirtLength;
                                ObjSaleViewModel.Waist = item.Waist;
                                ObjSaleViewModel.BalanceAmount = item.Amount;
                                ObjSaleViewModel.CouponValue = item.CouponValue == null ? 0 : item.CouponValue.Value;
                                ObjSaleViewModel.RentDetails = ObjlistSaleDetailViewModel;
                                ObjListSaleDateWiseReport.Add(ObjSaleViewModel);
                            }
                            ObjSaleAgentDateWiseReport.AgentId = itemagent.AgentId;
                            ObjSaleAgentDateWiseReport.AgentName = itemagent.AgentName;
                            ObjSaleAgentDateWiseReport.CustomerId = itemagent.CustomerId;
                            ObjSaleAgentDateWiseReport.CustomerName = itemagent.CustomerName;
                            ObjSaleAgentDateWiseReport.Rentlist = ObjListSaleDateWiseReport;
                            ObjListSaleAgentDateWiseReport.Add(ObjSaleAgentDateWiseReport);
                        }
                       
                        objSaleDateWiseReport.FranchiseId = FranchiseId;
                        objSaleDateWiseReport.FranchiseName = db.Franchise.Where(w => w.FranchiseId == FranchiseId).Select(s => s.FranchiseName).FirstOrDefault(); ;
                        objSaleDateWiseReport.RentAgentlist = ObjListSaleAgentDateWiseReport;
                        ObjListSaleDateWiseReportr.Add(objSaleDateWiseReport);
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListSaleDateWiseReportr;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        var franchise = db.Franchise.Where(w => w.IsActive == true && w.IsDeleted == false).ToList();
                        List<RentDateWiseReport1> ObjListSaleDateWiseReportr = new List<RentDateWiseReport1>();
                        foreach (var itemss in franchise)
                        {
                            RentDateWiseReport1 objSaleDateWiseReport = new RentDateWiseReport1();

                            var salesagent = (from p in db.Rent
                                              join q in db.Customer on p.CustomerId equals q.CustomerId
                                              where p.RentedOn >= From && p.RentedOn <= To && p.FranchiseId == itemss.FranchiseId && p.IsActive == true && p.IsDeleted == false
                                              select new RentCustomerDateWiseReport()
                                              {
                                                  CustomerId = Convert.ToInt32(q.CustomerId),
                                                  CustomerName = q.CustomerName
                                              }).Distinct().ToList();
                            List<RentCustomerDateWiseReport> ObjListSaleAgentDateWiseReport = new List<RentCustomerDateWiseReport>();
                            foreach (var itemagent in salesagent)
                            {
                                List<DateRentViewModel> ObjListSaleDateWiseReport = new List<DateRentViewModel>();
                                RentCustomerDateWiseReport ObjSaleAgentDateWiseReport = new RentCustomerDateWiseReport();
                                var result = db.Rent.Where(w => w.RentedOn >= From && w.RentedOn <= To && w.CustomerId == itemagent.CustomerId).ToList();
                                foreach (var item in result)
                                {
                                    DateRentViewModel ObjSaleViewModel = new DateRentViewModel();
                                    List<RentDetailsViewModel> ObjlistSaleDetailViewModel = new List<RentDetailsViewModel>();
                                    var saleorderdetails = db.RentDetails.Where(w => w.RentId == item.RentId).ToList();
                                    foreach (var items in saleorderdetails)
                                    {
                                        RentDetailsViewModel ObjSaleDetailViewModel = new RentDetailsViewModel();
                                        ObjSaleDetailViewModel.ItemId = items.ItemId;
                                        ObjSaleDetailViewModel.ItemName = db.Item.Where(w => w.ItemId == items.ItemId).Select(s => s.ItemName).FirstOrDefault();
                                        ObjSaleDetailViewModel.Quantity = items.Quantity;
                                        ObjSaleDetailViewModel.UnitPrice = items.UnitPrice;
                                        ObjSaleDetailViewModel.TotalPrice = items.TotalPrice;
                                        ObjSaleDetailViewModel.Security = items.Security;
                                        ObjlistSaleDetailViewModel.Add(ObjSaleDetailViewModel);
                                    }
                                    ObjSaleViewModel.BillNumber = item.BillNumber;
                                    ObjSaleViewModel.Discount = item.Discount;
                                    ObjSaleViewModel.Quantity = item.Quantity;
                                    ObjSaleViewModel.RentedOn = item.RentedOn;
                                    ObjSaleViewModel.Hips = item.Hips;
                                    ObjSaleViewModel.Bust = item.Bust;
                                    ObjSaleViewModel.SkirtLength = item.SkirtLength;
                                    ObjSaleViewModel.Waist = item.Waist;
                                    ObjSaleViewModel.LateCharges = item.AdditionalCharges;
                                    ObjSaleViewModel.BalanceAmount = item.Amount;
                                    ObjSaleViewModel.CouponValue = item.CouponValue == null ? 0 : item.CouponValue.Value;
                                    ObjSaleViewModel.RentDetails = ObjlistSaleDetailViewModel;
                                    ObjListSaleDateWiseReport.Add(ObjSaleViewModel);
                                }
                                ObjSaleAgentDateWiseReport.AgentId = itemagent.AgentId;
                                ObjSaleAgentDateWiseReport.AgentName = itemagent.AgentName;
                                ObjSaleAgentDateWiseReport.CustomerId = itemagent.CustomerId;
                                ObjSaleAgentDateWiseReport.CustomerName = itemagent.CustomerName;
                                ObjSaleAgentDateWiseReport.Rentlist = ObjListSaleDateWiseReport;
                                ObjListSaleAgentDateWiseReport.Add(ObjSaleAgentDateWiseReport);
                            }
                            objSaleDateWiseReport.FranchiseId = itemss.FranchiseId;
                            objSaleDateWiseReport.FranchiseName = itemss.FranchiseName;
                            objSaleDateWiseReport.RentAgentlist = ObjListSaleAgentDateWiseReport;
                            ObjListSaleDateWiseReportr.Add(objSaleDateWiseReport);
                        }
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Request Successful";
                        aPIResponse.Result = ObjListSaleDateWiseReportr;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10003;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }

        [HttpGet]
        [Route("GetGuestCustomerByFranchiseId")]
        public IActionResult GetGuestCustomerByFranchiseId(string FranchiseId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var customer = db.Customer.Where(w => w.FranchiseId == Convert.ToInt32(FranchiseId) && w.CustomerName.Contains("Guest")).FirstOrDefault();
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successfully";
                    aPIResponse.Result = customer;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                aPIResponse.Result = 0;
                return Ok(aPIResponse);
            }
        }


        public int GetGuestCustomerByFranchiseIdd(int? FranchiseId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var customer = db.Customer.Where(w => w.FranchiseId == Convert.ToInt32(FranchiseId) && w.CustomerName.Contains("Guest")).FirstOrDefault();
                    return customer.CustomerId;
                }
            }
            catch (Exception ex)
            {
                return 0;
            }
        }
        #endregion

        #region GroupedItems

        [HttpPost]
        [Route("AddEditGroupedItems")]
        public IActionResult AddEditGroupedItems(ItemsProductViewModel itemsProductViewModel)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var itemproduct = db.Item.Where(w => w.ItemId == itemsProductViewModel.ItemId).FirstOrDefault();
                    if (itemproduct != null)
                    {
                        var skuProduct = db.Item.Where(w => w.Sku == itemsProductViewModel.Sku && w.ItemId != itemsProductViewModel.ItemId).FirstOrDefault();
                        var skuProduct1 = db.Item.Where(w => w.Sku == itemsProductViewModel.Sku && w.ItemId == itemsProductViewModel.ItemId).FirstOrDefault();
                        var barcodeProduct = db.Item.Where(w => w.Barcode == itemsProductViewModel.Barcode && w.ItemId != itemsProductViewModel.ItemId).FirstOrDefault();
                        var barcodeProduct1 = db.Item.Where(w => w.Barcode == itemsProductViewModel.Barcode && w.ItemId == itemsProductViewModel.ItemId).FirstOrDefault();
                        if (skuProduct1 == null)
                        {
                            if (skuProduct != null)
                            {
                                aPIResponse.StatusCode = 10001;
                                aPIResponse.Message = "Item with same SKU already exists, Please enter unique SKU.";
                                aPIResponse.Result = itemsProductViewModel;
                                return Ok(aPIResponse);
                            }
                        }
                        if (barcodeProduct1 == null)
                        {
                            if (barcodeProduct != null)
                            {
                                aPIResponse.StatusCode = 10001;
                                aPIResponse.Message = "Item with same Barcode already exists, Please enter unique Barcode.";
                                aPIResponse.Result = itemsProductViewModel;
                                return Ok(aPIResponse);
                            }
                        }

                        itemproduct.CategoryId = itemsProductViewModel.CategoryId;
                        itemproduct.SubCategoryId = itemsProductViewModel.SubCategoryId;
                        itemproduct.FranchiseId = itemsProductViewModel.FranchiseId;
                        itemproduct.ItemName = itemsProductViewModel.ItemName;
                        itemproduct.ItemSalePrice = itemsProductViewModel.ItemSalePrice;
                        itemproduct.Sku = itemsProductViewModel.Sku;
                        itemproduct.Barcode = itemsProductViewModel.Barcode;
                        itemproduct.ItemId = itemsProductViewModel.ItemId;
                        itemproduct.CreatedDate = DateTime.Now;
                        itemproduct.IsActive = true;
                        itemproduct.IsDeleted = false;
                        itemproduct.Tax = itemsProductViewModel.Tax;
                        itemproduct.Discount = itemsProductViewModel.Discount;
                        itemproduct.ExpirationDate = itemsProductViewModel.ExpirationDate;
                        itemproduct.ManufacturedDate = itemsProductViewModel.ManufacturedDate;
                        itemproduct.PackingDate = itemsProductViewModel.PackingDate;
                        itemproduct.ItemRentPrice = itemsProductViewModel.ItemRentPrice;
                        itemproduct.ItemTotalPrice = itemsProductViewModel.ItemTotalPrice;
                        itemproduct.IsRented = itemsProductViewModel.IsRented;
                        itemproduct.ProductLogo = itemsProductViewModel.ProductLogo == null ? "data:image/jpeg;base64,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" : itemsProductViewModel.ProductLogo;
                        itemproduct.UnitCategoryId = itemsProductViewModel.UnitCategoryId;
                        itemproduct.UnitMeasurementId = itemsProductViewModel.UnitMeasurementId;
                        itemproduct.Security = itemsProductViewModel.security;
                        itemproduct.ItemTotalPrice = itemsProductViewModel.ItemTotalPrice;
                        itemproduct.MinimumStockValue = itemsProductViewModel.MinimumStock;
                        itemproduct.QuantityStock = itemsProductViewModel.QuantityStock;
                        itemproduct.LateCharges = itemsProductViewModel.LateCharges;
                        itemproduct.SupplierId = itemsProductViewModel.SupplierId;
                        itemproduct.Description = itemsProductViewModel.Description;
                        itemproduct.IsGroup = true;
                        db.SaveChanges();
                        List<GroupItem> lstgrpitem = new List<GroupItem>();
                        var grpItems = db.GroupItem.Where(w => w.ItemId == itemsProductViewModel.ItemId).ToList();
                        lstgrpitem = grpItems;
                        db.GroupItem.RemoveRange(grpItems);
                        db.SaveChanges();

                        foreach (var item in itemsProductViewModel.GroupItemViewModelList)
                        {
                            var qtystock = item.QuantityStock;
                            var itemgrprec = lstgrpitem.Where(w => w.ItemId == itemsProductViewModel.ItemId).FirstOrDefault();
                            var itemgrp = db.Item.Where(w => w.ItemId == item.ItemGrpId).FirstOrDefault();
                            if (itemgrprec != null)
                            {
                                if (item.QuantityStock > itemgrprec.QuantityStock)
                                {
                                    item.QuantityStock = item.QuantityStock - itemgrprec.QuantityStock;
                                }
                                else
                                {
                                    item.QuantityStock = itemgrprec.QuantityStock - item.QuantityStock;
                                }
                            }
                            itemgrp.QuantityStock = itemgrp.QuantityStock - item.QuantityStock;
                            if (itemgrp.QuantityStock == null)
                            {
                                itemgrp.QuantityStock = 0;
                            }
                            db.SaveChanges();
                            GroupItem ObjGroupItem = new GroupItem();
                            ObjGroupItem.ItemGrpId = item.ItemGrpId;
                            ObjGroupItem.ItemId = itemsProductViewModel.ItemId;
                            ObjGroupItem.CategoryId = item.CategoryId;
                            ObjGroupItem.SubCategoryId = item.SubCategoryId;
                            ObjGroupItem.FranchiseId = item.FranchiseId;
                            ObjGroupItem.ItemGroupName = item.ItemGroupName;
                            ObjGroupItem.ItemSalePrice = item.ItemSalePrice;
                            ObjGroupItem.Sku = item.Sku;
                            ObjGroupItem.Barcode = item.Barcode;
                            ObjGroupItem.Tax = item.Tax;
                            ObjGroupItem.Discount = item.Discount;
                            ObjGroupItem.ExpirationDate = item.ExpirationDate;
                            ObjGroupItem.IsRented = item.IsRented;
                            ObjGroupItem.ItemRentPrice = item.ItemRentPrice;
                            ObjGroupItem.ProductLogo = item.ProductLogo;
                            ObjGroupItem.Security = item.security;
                            ObjGroupItem.ManufacturedDate = item.ManufacturedDate;
                            ObjGroupItem.PackingDate = item.PackingDate;
                            ObjGroupItem.UnitCategoryId = itemgrp.UnitCategoryId;
                            ObjGroupItem.UnitMeasurementId = itemgrp.UnitMeasurementId;
                            ObjGroupItem.QuantityStock = qtystock;
                            ObjGroupItem.MinimumStockValue = item.MinimumStock;
                            db.GroupItem.Add(ObjGroupItem);
                            db.SaveChanges();
                        }


                        itemsProductViewModel.IsActive = true;
                        itemsProductViewModel.CategoryName = db.Category.Where(w => w.CategoryId == itemsProductViewModel.CategoryId).Select(s => s.CategoryName).FirstOrDefault();
                        itemsProductViewModel.SubCategoryName = db.Category.Where(w => w.CategoryId == itemsProductViewModel.SubCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                        itemsProductViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == itemsProductViewModel.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        itemsProductViewModel.UnitCategoryName = db.UnitCategory.Where(w => w.UnitCategoryId == itemsProductViewModel.UnitCategoryId).Select(s => s.UnitCategoryName).FirstOrDefault();
                        itemsProductViewModel.UnitMeasurementName = db.UnitMeasurement.Where(w => w.UnitMeasurementId == itemsProductViewModel.UnitMeasurementId).Select(s => s.UnitMeasurementName).FirstOrDefault();
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Group Item Updated Successful";
                        aPIResponse.Result = itemsProductViewModel;
                        return Ok(aPIResponse);
                    }
                    else
                    {
                        var skuProduct = db.Item.Where(w => w.Sku == itemsProductViewModel.Sku).FirstOrDefault();
                        if (skuProduct != null)
                        {
                            aPIResponse.StatusCode = 10001;
                            aPIResponse.Message = "Item with same SKU already exists, Please enter unique SKU.";
                            aPIResponse.Result = itemsProductViewModel;
                            return Ok(aPIResponse);
                        }

                        var barcodeProduct = db.Item.Where(w => w.Barcode == itemsProductViewModel.Barcode).FirstOrDefault();
                        if (barcodeProduct != null)
                        {
                            aPIResponse.StatusCode = 10001;
                            aPIResponse.Message = "Item with same Barcode already exists, Please enter unique Barcode.";
                            aPIResponse.Result = itemsProductViewModel;
                            return Ok(aPIResponse);
                        }
                        Item ObjItem = new Item();
                        ObjItem.CategoryId = itemsProductViewModel.CategoryId;
                        ObjItem.SubCategoryId = itemsProductViewModel.SubCategoryId;
                        ObjItem.FranchiseId = itemsProductViewModel.FranchiseId;
                        ObjItem.ItemName = itemsProductViewModel.ItemName;
                        ObjItem.ItemSalePrice = itemsProductViewModel.ItemSalePrice;
                        ObjItem.Sku = itemsProductViewModel.Sku;
                        ObjItem.Barcode = itemsProductViewModel.Barcode;
                        ObjItem.IsActive = true;
                        ObjItem.IsDeleted = false;
                        ObjItem.ItemId = itemsProductViewModel.ItemId;
                        ObjItem.CreatedDate = DateTime.Now;
                        ObjItem.IsActive = true;
                        ObjItem.IsDeleted = false;
                        ObjItem.Tax = itemsProductViewModel.Tax;
                        ObjItem.Discount = itemsProductViewModel.Discount;
                        ObjItem.ExpirationDate = itemsProductViewModel.ExpirationDate;
                        ObjItem.ManufacturedDate = itemsProductViewModel.ManufacturedDate;
                        ObjItem.PackingDate = itemsProductViewModel.PackingDate;
                        ObjItem.ItemRentPrice = itemsProductViewModel.ItemRentPrice;
                        ObjItem.ItemTotalPrice = itemsProductViewModel.ItemTotalPrice;
                        ObjItem.IsRented = itemsProductViewModel.IsRented;
                        ObjItem.ProductLogo = itemsProductViewModel.ProductLogo == null ? "data:image/jpeg;base64,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" : itemsProductViewModel.ProductLogo;
                        ObjItem.UnitCategoryId = itemsProductViewModel.UnitCategoryId;
                        ObjItem.UnitMeasurementId = itemsProductViewModel.UnitMeasurementId;
                        ObjItem.Security = itemsProductViewModel.security;
                        ObjItem.IsGroup = true;
                        ObjItem.QuantityStock = itemsProductViewModel.QuantityStock;
                        ObjItem.MinimumStockValue = itemsProductViewModel.MinimumStock;
                        ObjItem.ItemTotalPrice = itemsProductViewModel.ItemTotalPrice;
                        ObjItem.LateCharges = itemsProductViewModel.LateCharges;
                        ObjItem.SupplierId = itemsProductViewModel.SupplierId;
                        ObjItem.Description = itemsProductViewModel.Description;
                        db.Item.Add(ObjItem);
                        db.SaveChanges();
                        itemsProductViewModel.ItemId = itemsProductViewModel.ItemId;
                        foreach (var item in itemsProductViewModel.GroupItemViewModelList)
                        {
                            var itemgrp = db.Item.Where(w => w.ItemId == item.ItemGrpId).FirstOrDefault();
                            itemgrp.QuantityStock = itemgrp.QuantityStock - item.QuantityStock;
                            db.SaveChanges();
                            GroupItem ObjGroupItem = new GroupItem();
                            ObjGroupItem.ItemGrpId = item.ItemGrpId;
                            ObjGroupItem.ItemId = ObjItem.ItemId;
                            ObjGroupItem.CategoryId = item.CategoryId;
                            ObjGroupItem.SubCategoryId = item.SubCategoryId;
                            ObjGroupItem.FranchiseId = item.FranchiseId;
                            ObjGroupItem.ItemGroupName = item.ItemGroupName;
                            ObjGroupItem.ItemSalePrice = item.ItemSalePrice;
                            ObjGroupItem.ItemRentPrice = item.ItemRentPrice;
                            ObjGroupItem.Sku = item.Sku;
                            ObjGroupItem.Barcode = item.Barcode;
                            ObjGroupItem.IsActive = true;
                            ObjGroupItem.IsDeleted = false;
                            ObjGroupItem.CreatedDate = DateTime.Now;
                            ObjGroupItem.Tax = item.Tax;
                            ObjGroupItem.Discount = item.Discount;
                            ObjGroupItem.ExpirationDate = item.ExpirationDate;
                            ObjGroupItem.IsRented = false;
                            ObjGroupItem.ItemRentPrice = item.ItemRentPrice;
                            ObjGroupItem.ProductLogo = item.ProductLogo;
                            ObjGroupItem.Security = item.security;
                            ObjGroupItem.ManufacturedDate = item.ManufacturedDate;
                            ObjGroupItem.PackingDate = item.PackingDate;
                            ObjGroupItem.UnitCategoryId = item.UnitCategoryId;
                            ObjGroupItem.UnitMeasurementId = item.UnitMeasurementId;
                            ObjGroupItem.QuantityStock = item.QuantityStock;
                            ObjGroupItem.MinimumStockValue = item.MinimumStock;
                            db.GroupItem.Add(ObjGroupItem);
                            db.SaveChanges();
                        }
                        itemsProductViewModel.IsActive = true;
                        itemsProductViewModel.CategoryName = db.Category.Where(w => w.CategoryId == itemsProductViewModel.CategoryId).Select(s => s.CategoryName).FirstOrDefault();
                        itemsProductViewModel.SubCategoryName = db.Category.Where(w => w.CategoryId == itemsProductViewModel.SubCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                        itemsProductViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == itemsProductViewModel.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        itemsProductViewModel.UnitCategoryName = db.UnitCategory.Where(w => w.UnitCategoryId == itemsProductViewModel.UnitCategoryId).Select(s => s.UnitCategoryName).FirstOrDefault();
                        itemsProductViewModel.UnitMeasurementName = db.UnitMeasurement.Where(w => w.UnitMeasurementId == itemsProductViewModel.UnitMeasurementId).Select(s => s.UnitMeasurementName).FirstOrDefault();
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Group Item Inserted Successfully";
                        aPIResponse.Result = itemsProductViewModel;
                        return Ok(aPIResponse);
                    }
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 200;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }

        [HttpGet]
        [Route("GetGroupItems")]
        public IActionResult GetGroupItems(int FranchiseId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var itemproduct = new List<Item>();
                    if (FranchiseId == 0)
                    {
                        itemproduct = db.Item.Where(w => w.IsActive == true && w.IsDeleted == false && w.IsGroup == true).ToList();
                    }
                    else
                    {
                        itemproduct = db.Item.Where(w => w.IsActive == true && w.IsDeleted == false && w.FranchiseId == FranchiseId && w.IsGroup == true).ToList();
                    }
                    List<ItemsProductViewModel> ObjItemsProductViewModelist = new List<ItemsProductViewModel>();
                    foreach (var item in itemproduct)
                    {
                        ItemsProductViewModel ObjItemsProductViewModel = new ItemsProductViewModel();
                        List<GroupItemViewModel> ItemsProductViewModellist = new List<GroupItemViewModel>();
                        var grpitemlist = db.GroupItem.Where(w => w.ItemId == item.ItemId).ToList();
                        foreach (var items in grpitemlist)
                        {
                            if (items.ItemGroupId > 0)
                            {
                                GroupItemViewModel ObjGroupItemViewModel = new GroupItemViewModel();
                                ObjGroupItemViewModel.ItemGroupId = items.ItemGroupId;
                                ObjGroupItemViewModel.ItemId = items.ItemId;
                                ObjGroupItemViewModel.CategoryId = items.CategoryId;
                                ObjGroupItemViewModel.SubCategoryId = items.SubCategoryId;
                                ObjGroupItemViewModel.FranchiseId = items.FranchiseId;
                                ObjGroupItemViewModel.ItemGroupName = items.ItemGroupName;
                                ObjGroupItemViewModel.ItemSalePrice = items.ItemSalePrice;
                                ObjGroupItemViewModel.ItemRentPrice = items.ItemRentPrice;
                                ObjGroupItemViewModel.Sku = items.Sku;
                                ObjGroupItemViewModel.Barcode = items.Barcode;
                                ObjGroupItemViewModel.Tax = items.Tax;
                                ObjGroupItemViewModel.Discount = items.Discount;
                                ObjGroupItemViewModel.ExpirationDate = items.ExpirationDate;
                                ObjGroupItemViewModel.IsRented = items.IsRented;
                                ObjGroupItemViewModel.ProductLogo = items.ProductLogo;
                                ObjGroupItemViewModel.security = items.Security;
                                ObjGroupItemViewModel.ManufacturedDate = items.ManufacturedDate;
                                ObjGroupItemViewModel.PackingDate = items.PackingDate;
                                ObjGroupItemViewModel.UnitCategoryId = items.UnitCategoryId;
                                ObjGroupItemViewModel.UnitMeasurementId = items.UnitMeasurementId;
                                ObjGroupItemViewModel.CategoryName = db.Category.Where(w => w.CategoryId == items.CategoryId).Select(s => s.CategoryName).FirstOrDefault();
                                ObjGroupItemViewModel.SubCategoryName = db.Category.Where(w => w.CategoryId == items.SubCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                                ObjGroupItemViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == items.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                                ObjGroupItemViewModel.UnitMeasurementName = db.UnitMeasurement.Where(w => w.UnitMeasurementId == items.UnitMeasurementId).Select(s => s.UnitMeasurementName).FirstOrDefault();
                                ObjGroupItemViewModel.UnitCategoryName = db.UnitCategory.Where(w => w.UnitCategoryId == items.UnitCategoryId).Select(s => s.UnitCategoryName).FirstOrDefault();
                                ObjGroupItemViewModel.QuantityStock = items.QuantityStock;
                                ObjGroupItemViewModel.MinimumStock = items.MinimumStockValue;
                                ItemsProductViewModellist.Add(ObjGroupItemViewModel);
                            }
                        }
                        ObjItemsProductViewModel.GroupItemViewModelList = ItemsProductViewModellist;
                        ObjItemsProductViewModel.ItemId = item.ItemId;
                        ObjItemsProductViewModel.CategoryId = item.CategoryId;
                        ObjItemsProductViewModel.SubCategoryId = item.SubCategoryId;
                        ObjItemsProductViewModel.FranchiseId = item.FranchiseId;
                        ObjItemsProductViewModel.ItemName = item.ItemName;
                        ObjItemsProductViewModel.ManufacturedDate = item.ManufacturedDate;
                        ObjItemsProductViewModel.PackingDate = item.PackingDate;
                        ObjItemsProductViewModel.QuantityStock = item.QuantityStock;
                        ObjItemsProductViewModel.Discount = item.Discount;
                        ObjItemsProductViewModel.ItemRentPrice = item.ItemRentPrice;
                        ObjItemsProductViewModel.ItemSalePrice = item.ItemSalePrice;
                        ObjItemsProductViewModel.IsRented = item.IsRented;
                        ObjItemsProductViewModel.Sku = item.Sku;
                        ObjItemsProductViewModel.Tax = item.Tax;
                        ObjItemsProductViewModel.ExpirationDate = item.ExpirationDate;
                        ObjItemsProductViewModel.Barcode = item.Barcode;
                        ObjItemsProductViewModel.Discount = item.Discount;
                        ObjItemsProductViewModel.UnitCategoryId = item.UnitCategoryId;
                        ObjItemsProductViewModel.UnitCategoryName = db.UnitCategory.Where(w => w.UnitCategoryId == item.UnitCategoryId).Select(s => s.UnitCategoryName).FirstOrDefault();
                        ObjItemsProductViewModel.UnitMeasurementId = item.UnitMeasurementId;
                        ObjItemsProductViewModel.UnitMeasurementName = db.UnitMeasurement.Where(w => w.UnitMeasurementId == item.UnitMeasurementId).Select(s => s.UnitMeasurementName).FirstOrDefault();
                        ObjItemsProductViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == item.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        ObjItemsProductViewModel.CategoryName = db.Category.Where(w => w.CategoryId == item.CategoryId).Select(s => s.CategoryName).FirstOrDefault();
                        ObjItemsProductViewModel.SubCategoryName = db.Category.Where(w => w.CategoryId == item.SubCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                        ObjItemsProductViewModel.ProductLogo = item.ProductLogo == null ? "data:image/jpeg;base64,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" : item.ProductLogo;
                        ObjItemsProductViewModel.MinimumStock = item.MinimumStockValue;
                        ObjItemsProductViewModel.security = item.Security;
                        ObjItemsProductViewModel.IsGroup = item.IsGroup;
                        ObjItemsProductViewModel.ItemTotalPrice = item.ItemTotalPrice;
                        ObjItemsProductViewModel.Description = item.Description;
                        ObjItemsProductViewModel.security = item.Security;
                        ObjItemsProductViewModel.SupplierId = item.SupplierId;
                        ObjItemsProductViewModel.SupplierName = db.SupplierDetails.Where(w => w.SupplierId == item.SupplierId).Select(s => s.SupplierName).FirstOrDefault();
                        ObjItemsProductViewModelist.Add(ObjItemsProductViewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjItemsProductViewModelist;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }



        [HttpGet]
        [Route("GetGroupEditItems")]
        public IActionResult GetGroupEditItems(int ItemId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    // var itemproduct = new List<Item>();
                    var itemproduct = db.Item.Where(w => w.IsActive == true && w.IsDeleted == false && w.ItemId == ItemId && w.IsGroup == true).FirstOrDefault();
                    List<ItemsProductViewModel> ObjItemsProductViewModelist = new List<ItemsProductViewModel>();

                    ItemsProductViewModel ObjItemsProductViewModel = new ItemsProductViewModel();
                    List<GroupItemViewModel> ItemsProductViewModellist = new List<GroupItemViewModel>();
                    if (itemproduct != null)
                    {

                        var grpitemlist = db.GroupItem.Where(w => w.ItemId == itemproduct.ItemId).ToList();
                        foreach (var items in grpitemlist)
                        {
                            if (items.ItemGroupId > 0)
                            {
                                GroupItemViewModel ObjGroupItemViewModel = new GroupItemViewModel();
                                ObjGroupItemViewModel.ItemGrpId = items.ItemGrpId;
                                ObjGroupItemViewModel.ItemGroupId = items.ItemGroupId;
                                ObjGroupItemViewModel.ItemId = items.ItemId;
                                ObjGroupItemViewModel.CategoryId = items.CategoryId;
                                ObjGroupItemViewModel.SubCategoryId = items.SubCategoryId;
                                ObjGroupItemViewModel.FranchiseId = items.FranchiseId;
                                ObjGroupItemViewModel.ItemGroupName = items.ItemGroupName;
                                ObjGroupItemViewModel.ItemSalePrice = items.ItemSalePrice;
                                ObjGroupItemViewModel.ItemRentPrice = items.ItemRentPrice;
                                ObjGroupItemViewModel.Sku = items.Sku;
                                ObjGroupItemViewModel.Barcode = items.Barcode;
                                ObjGroupItemViewModel.Tax = items.Tax;
                                ObjGroupItemViewModel.Discount = items.Discount;
                                ObjGroupItemViewModel.ExpirationDate = items.ExpirationDate;
                                ObjGroupItemViewModel.IsRented = items.IsRented;
                                ObjGroupItemViewModel.ProductLogo = items.ProductLogo;
                                ObjGroupItemViewModel.security = items.Security;
                                ObjGroupItemViewModel.ManufacturedDate = items.ManufacturedDate;
                                ObjGroupItemViewModel.PackingDate = items.PackingDate;
                                ObjGroupItemViewModel.UnitCategoryId = items.UnitCategoryId;
                                ObjGroupItemViewModel.UnitMeasurementId = items.UnitMeasurementId;
                                ObjGroupItemViewModel.CategoryName = db.Category.Where(w => w.CategoryId == items.CategoryId).Select(s => s.CategoryName).FirstOrDefault();
                                ObjGroupItemViewModel.SubCategoryName = db.Category.Where(w => w.CategoryId == items.SubCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                                ObjGroupItemViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == items.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                                ObjGroupItemViewModel.UnitMeasurementName = db.UnitMeasurement.Where(w => w.UnitMeasurementId == items.UnitMeasurementId).Select(s => s.UnitMeasurementName).FirstOrDefault();
                                ObjGroupItemViewModel.UnitCategoryName = db.UnitCategory.Where(w => w.UnitCategoryId == items.UnitCategoryId).Select(s => s.UnitCategoryName).FirstOrDefault();
                                ObjGroupItemViewModel.QuantityStock = items.QuantityStock;
                                ObjGroupItemViewModel.MinimumStock = items.MinimumStockValue;
                                var stcok = db.Item.Where(w => w.ItemId == items.ItemGrpId).Select(s => s.QuantityStock).FirstOrDefault();
                                if (stcok != null)
                                {
                                    ObjGroupItemViewModel.QuantityStockValue = stcok;
                                }
                                ItemsProductViewModellist.Add(ObjGroupItemViewModel);
                            }
                        }
                        ObjItemsProductViewModel.GroupItemViewModelList = ItemsProductViewModellist;
                        ObjItemsProductViewModel.ItemId = itemproduct.ItemId;
                        ObjItemsProductViewModel.CategoryId = itemproduct.CategoryId;
                        ObjItemsProductViewModel.SubCategoryId = itemproduct.SubCategoryId;
                        ObjItemsProductViewModel.FranchiseId = itemproduct.FranchiseId;
                        ObjItemsProductViewModel.ItemName = itemproduct.ItemName;
                        ObjItemsProductViewModel.ManufacturedDate = itemproduct.ManufacturedDate;
                        ObjItemsProductViewModel.PackingDate = itemproduct.PackingDate;
                        ObjItemsProductViewModel.QuantityStock = itemproduct.QuantityStock;
                        ObjItemsProductViewModel.Discount = itemproduct.Discount;
                        ObjItemsProductViewModel.ItemRentPrice = itemproduct.ItemRentPrice;
                        ObjItemsProductViewModel.ItemSalePrice = itemproduct.ItemSalePrice;
                        ObjItemsProductViewModel.IsRented = itemproduct.IsRented;
                        ObjItemsProductViewModel.Sku = itemproduct.Sku;
                        ObjItemsProductViewModel.Tax = itemproduct.Tax;
                        ObjItemsProductViewModel.ExpirationDate = itemproduct.ExpirationDate;
                        ObjItemsProductViewModel.Barcode = itemproduct.Barcode;
                        ObjItemsProductViewModel.Discount = itemproduct.Discount;
                        ObjItemsProductViewModel.UnitCategoryId = itemproduct.UnitCategoryId;
                        ObjItemsProductViewModel.UnitCategoryName = db.UnitCategory.Where(w => w.UnitCategoryId == itemproduct.UnitCategoryId).Select(s => s.UnitCategoryName).FirstOrDefault();
                        ObjItemsProductViewModel.UnitMeasurementId = itemproduct.UnitMeasurementId;
                        ObjItemsProductViewModel.UnitMeasurementName = db.UnitMeasurement.Where(w => w.UnitMeasurementId == itemproduct.UnitMeasurementId).Select(s => s.UnitMeasurementName).FirstOrDefault();
                        ObjItemsProductViewModel.FranchiseName = db.Franchise.Where(w => w.FranchiseId == itemproduct.FranchiseId).Select(s => s.FranchiseName).FirstOrDefault();
                        ObjItemsProductViewModel.CategoryName = db.Category.Where(w => w.CategoryId == itemproduct.CategoryId).Select(s => s.CategoryName).FirstOrDefault();
                        ObjItemsProductViewModel.SubCategoryName = db.Category.Where(w => w.CategoryId == itemproduct.SubCategoryId).Select(s => s.CategoryName).FirstOrDefault();
                        ObjItemsProductViewModel.ProductLogo = itemproduct.ProductLogo == null ? "data:image/jpeg;base64,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" : itemproduct.ProductLogo;
                        ObjItemsProductViewModel.MinimumStock = itemproduct.MinimumStockValue;
                        ObjItemsProductViewModel.security = itemproduct.Security;
                        ObjItemsProductViewModel.IsGroup = itemproduct.IsGroup;
                        ObjItemsProductViewModel.ItemTotalPrice = itemproduct.ItemTotalPrice;
                        ObjItemsProductViewModel.Description = itemproduct.Description;
                        ObjItemsProductViewModel.security = itemproduct.Security;
                        ObjItemsProductViewModel.SupplierId = itemproduct.SupplierId;
                        ObjItemsProductViewModel.SupplierName = db.SupplierDetails.Where(w => w.SupplierId == itemproduct.SupplierId).Select(s => s.SupplierName).FirstOrDefault();
                        ObjItemsProductViewModelist.Add(ObjItemsProductViewModel);
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Message = "Request Successful";
                    aPIResponse.Result = ObjItemsProductViewModelist;
                    return Ok(aPIResponse);
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }


        [HttpDelete]
        [Route("DeleteGroupItem")]
        public IActionResult DeleteGroupItem(int ItemId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var item = db.Item.Where(w => w.ItemId == ItemId).FirstOrDefault();
                    item.IsDeleted = true;
                    item.DeletedDate = DateTime.Now;
                    item.IsActive = false;
                    db.SaveChanges();
                    var groupitems = db.GroupItem.Where(w => w.ItemId == ItemId).ToList();
                    foreach (var items in groupitems)
                    {
                        items.IsDeleted = true;
                        items.DeletedDate = DateTime.Now;
                        items.IsActive = false;
                        db.SaveChanges();
                    }
                    aPIResponse.StatusCode = 200;
                    aPIResponse.Result = item;
                    aPIResponse.Message = "Group Item Deleted Successfully";
                    return Ok(aPIResponse);
                }
            }
            catch (Exception ex)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = ex.ToString();
                return Ok(aPIResponse);
            }
        }
        #endregion

        #region ActivateModule
        [HttpPut]
        [Route("ActivateCustomer")]
        public IActionResult ActivateCustomer(int CustomerId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var customer = db.Customer.Where(w => w.CustomerId == CustomerId).FirstOrDefault();
                    if (customer.IsActive == true)
                    {
                        customer.IsActive = false;
                        aPIResponse.Message = "Customer Deactivated Successfully";
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Result = customer;
                    }
                    else
                    {
                        customer.IsActive = true;
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Customer Activated Successfully";
                        aPIResponse.Result = customer;
                    }
                    db.SaveChanges();
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }

        [HttpPut]
        [Route("ActivateCategoryOrSubCategory")]
        public IActionResult ActivateCategorySubCategory(int CategoryId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var customer = db.Category.Where(w => w.CategoryId == CategoryId).FirstOrDefault();
                    if (customer.IsActive == true)
                    {
                        customer.IsActive = false;
                        aPIResponse.Message = "Category Deactivated Successfully";
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Result = customer;
                    }
                    else
                    {
                        customer.IsActive = true;
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Category Activated Successfully";
                        aPIResponse.Result = customer;
                    }
                    db.SaveChanges();
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
            }
        }

        [HttpPut]
        [Route("ActivateSupplier")]
        public IActionResult ActivateSupplier(int SupplierId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var supplier = db.SupplierDetails.Where(w => w.SupplierId == SupplierId).FirstOrDefault();
                    if (supplier.IsActive == true)
                    {
                        supplier.IsActive = false;
                        aPIResponse.Message = "Supplier Deactivated Successfully";
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Result = supplier;
                    }
                    else
                    {
                        supplier.IsActive = true;
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Supplier Activated Successfully";
                        aPIResponse.Result = supplier;
                    }
                    db.SaveChanges();
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }




        [HttpPut]
        [Route("ActivateUnitCategory")]
        public IActionResult ActivateUnitCategory(int UnitCategoryId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var unit = db.UnitCategory.Where(w => w.UnitCategoryId == UnitCategoryId).FirstOrDefault();
                    if (unit.IsActive == true)
                    {
                        unit.IsActive = false;
                        aPIResponse.Message = "Unit Category Deactivated Successfully";
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Result = unit;
                    }
                    else
                    {
                        unit.IsActive = true;
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Unit Category Activated Successfully";
                        aPIResponse.Result = unit;
                    }
                    db.SaveChanges();
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }



        [HttpPut]
        [Route("ActivateUnitCategoryMeasure")]
        public IActionResult ActivateUnitCategoryMeasure(int UnitMeasurementId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var unitmeasure = db.UnitMeasurement.Where(w => w.UnitMeasurementId == UnitMeasurementId).FirstOrDefault();
                    if (unitmeasure.IsActive == true)
                    {
                        unitmeasure.IsActive = false;
                        aPIResponse.Message = "Unit Measurement Deactivated Successfully";
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Result = unitmeasure;
                    }
                    else
                    {
                        unitmeasure.IsActive = true;
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Unit Measurement Activated Successfully";
                        aPIResponse.Result = unitmeasure;
                    }
                    db.SaveChanges();
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }

        [HttpPut]
        [Route("ActivateTax")]
        public IActionResult ActivateTax(int TaxId)
        {
            try
            {
                using (var db = new POSRentingContext())
                {
                    var tax = db.MasterTax.Where(w => w.TaxId == TaxId).FirstOrDefault();
                    if (tax.IsActive == true)
                    {
                        tax.IsActive = false;
                        aPIResponse.Message = "Tax Deactivated Successfully";
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Result = tax;
                    }
                    else
                    {
                        tax.IsActive = true;
                        aPIResponse.StatusCode = 200;
                        aPIResponse.Message = "Tax Activated Successfully";
                        aPIResponse.Result = tax;
                    }
                    db.SaveChanges();
                    return Ok(aPIResponse);
                }
            }
            catch (Exception exception)
            {
                aPIResponse.StatusCode = 10001;
                aPIResponse.Message = exception.ToString();
                return Ok(aPIResponse);
                throw;
            }
        }
        #endregion
    }
}

