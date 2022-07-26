/*
RESTFUL SERVICE by NODE js
Author: RM_Innovation
Update : 3/29/2019
*/
 
var crypto = require('crypto');
var uuid = require('uuid');
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
 
//Connect to MySQL
var con = mysql.createConnection({
 
    host:'localhost',  // Replace your HOST IP
    user: 'root',
    password:'',
    database:'bakery'
 
    });
 
 
 
//Password ultil
var genRandomString = function(length){
 
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /*Convert to hexa format */
        .slice(0,length);  /* requireed number of characters */
 
};
 
 
var sha512 = function (password,salt){
    var hash = crypto.createHmac('sha512',salt); //Use SHA512
    hash.update(password);
    var value = hash.digest('hex');
    return{
        salt:salt,
        passwordHash:value 
 
    };
 
 
};
 
 
function saltHashPassword(userPassword){
 
    var salt = genRandomString(16);  // Gen random string with 16 char to salt
    var passwordData = sha512(userPassword,salt);
 
    return passwordData;
}
 
function checkHashPassword(userPassword,salt){
    var passwordData = sha512(userPassword,salt);
    return passwordData;
}
 
 
 
 
 
var app=express();
app.use(bodyParser.json()); //Accept JSON Params
app.use(bodyParser.urlencoded({extended: true})); //Accept URL Encoded params
 
 
app.post('/register/',(req,res,next)=>{
 
    var post_data = req.body;  //Get POST params
 
    var uid = uuid.v4(); //  Get UUID v4 like '110abas'
 
    var plaint_password = post_data.password;  // Get password from post params
 
    var hash_data = saltHashPassword(plaint_password);
 
    var password = hash_data.passwordHash;  //Get hash value
 
    var salt = hash_data.salt;  // Get salt
 
    var name = post_data.name;
 
    var email = post_data.email; 
 
    con.query('SELECT * From User where email=?',[email],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
 
        if(result && result.length)
            res.json('User hai');
        else
        {
           con.query('INSERT INTO `user`(`unique_id`, `name`, `email`, `encrypted_password`, `salt`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,NOW(),NOW())',[uid,name,email,password,salt],function(err,result,fields){
           con.on('error',function(err){
                console.log('[MySQL ERROR]',err);
                res.json('Register error: ' ,err);
            }); 
            res.json('Register successful');
 
 
            }) 
        }
 
    });
  
 
})
 
 
 
app.post('/addItem/',(req,res,next)=>{
 
    var post_data = req.body;  //Get POST params
 
     
    var name = post_data.name;
 
 
    var type = post_data.type;
 
    var quantity = post_data.quantity;
 
    var category_id = post_data.category_id;
 
    var current_sale_price = post_data.current_sale_price;
 
    var category_name = post_data.category_name;
 
    var current_purchase_price = post_data.current_purchase_price;
 
 
 
    con.query('SELECT * From item where name=?',[name],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
 
        if(result && result.length)
            res.json('Item hai jahil');
        else
        {
            con.query('INSERT INTO `item`(`name`, `type`, `quantity`, `category_id`, `current_sale_price`, `category_name`,`current_purchase_price`) VALUES (?,?,?,?,?,?,?)',[name,type,quantity,category_id,current_sale_price,category_name,current_purchase_price],function(err,result,fields){
            con.on('error',function(err){
                console.log('[MySQL ERROR]',err);
                res.json('Register error: ' ,err);
            }); 
 
 
            con.query('INSERT INTO item_purchase_price_history (`item_id`, `purchase_price`, `purchase_quantity`, `start_date`)  VALUES ((SELECT item_id FROM item WHERE name = ?),?,?,NOW())',[name,current_purchase_price,quantity],function(err,result,fields){
            con.on('error',function(err){
                console.log('[MySQL ERROR]',err);
                res.json('Register error: ' ,err);
            });     
 
            }) 
 
            con.query('INSERT INTO item_sale_price_history (`item_id`, `sale_price`,`sale_quantity`, `start_date`)  VALUES ((SELECT item_id FROM item WHERE name = ?),?,0,NOW())',[name,current_sale_price],function(err,result,fields){
            con.on('error',function(err){
                console.log('[MySQL ERROR]',err);
                res.json('Register error: ' ,err);
            });     
 
            }) 
 
 
 
 
            res.json('Item daal dia mubarak');
 
 
            }) 
        }
 
    });
  
 
})
 
 
app.post('/addSupplier/',(req,res,next)=>{
  
    var post_data = req.body;  //Get POST params
  
      
    var supplier_name = post_data.supplier_name;
  
  
    var supplier_company_name = post_data.supplier_company_name;
  
    var phone_no_1 = post_data.phone_no_1;
  
    var phone_no_2 = post_data.phone_no_2;
  
  
  
    con.query('SELECT * From supplier where supplier_name=?',[supplier_name],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
  
        if(result && result.length)
            res.json('Item hai jahil');
        else
        {
            con.query('INSERT INTO `supplier`(`supplier_name`, `supplier_company_name`, `phone_no_1`, `phone_no_2`) VALUES (?,?,?,?)',[supplier_name,supplier_company_name,phone_no_1,phone_no_2],function(err,result,fields){
            con.on('error',function(err){
                console.log('[MySQL ERROR]',err);
                res.json('Register error: ' ,err);
            }); 
            res.json('Item daal dia mubarak');
  
  
            }) 
        }
  
    });
   
  
})
 
 
 
app.post('/addCategory/',(req,res,next)=>{
  
    var post_data = req.body;  //Get POST params
  
      
    var category_name = post_data.category_name;
  
  
    var category_image = post_data.category_image;
  
  
  
    con.query('SELECT * From category where category_name=?',[category_name],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
  
        if(result && result.length)
            res.json('Category hai jahil');
        else
        {
            con.query('INSERT INTO `category`(`category_name`, `category_image`) VALUES (?,?)',[category_name,category_image],function(err,result,fields){
            con.on('error',function(err){
                console.log('[MySQL ERROR]',err);
                res.json('Register error: ' ,err);
            }); 
            res.json('Category daal dia mubarak');
  
  
            }) 
        }
  
    });
   
  
})
 
  
  
 
 
 
app.post('/updateUser/',(req,res,next)=>{
 
    var post_data = req.body;  //Get POST params
 
     
    var name = post_data.name;
 
    var email = post_data.email; 
 
    con.query('SELECT * From User where email=?',[email],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
 
        if(result && result.length){
 
 
            con.query('UPDATE user SET name = ? WHERE email = ?',[name,email],function(err,result,fields){con.on('error',function(err){
                console.log('[MySQL ERROR]',err);
                res.json('Register error: ' ,err);
            }); 
            res.json('Name changes');
 
            })
             
        }
        else
        {
              
 
            res.json('User ni hai');
        }
 
    });
  
 
})
 
 
 
app.post('/updateSellPrice/',(req,res,next)=>{
 
    var post_data = req.body;  //Get POST params


    var saleprice_id = post_data.saleprice_id;

    var item_id = post_data.item_id;
 

    var sale_price = post_data.sale_price;

    
 
    con.query('SELECT * From item_sale_price_history where saleprice_id=?',[saleprice_id],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
 
        if(result && result.length){
 
 
            con.query('UPDATE item_sale_price_history SET  end_date = NOW() WHERE saleprice_id = ?',[saleprice_id],function(err,result,fields){con.on('error',function(err){
                console.log('[MySQL ERROR]',err);
                res.json('Register error: ' ,err);

  				
 



            }); 
            res.json('Updated');

            con.query('INSERT INTO item_sale_price_history (`item_id`, `sale_price`,`sale_quantity`,`start_date`)  VALUES (?,?,0,NOW())',[item_id,sale_price],function(err,result,fields){
            con.on('error',function(err){
                console.log('[MySQL ERROR]',err);
                res.json('Register error: ' ,err);
            }); 

            con.query('UPDATE item SET  current_sale_price = ? WHERE item_id = ?',[sale_price,item_id],function(err,result,fields){
            con.on('error',function(err){
                console.log('[MySQL ERROR]',err);
                res.json('Register error: ' ,err);
            });     
 
            })     
 
            }) 


 
            })






            
             
        }
        else
        {
              
 
            res.json('Item ni hai');
        }
 
    });
  
 
})
   
 
app.post('/updatePurchasePrice/',(req,res,next)=>{
 
    var post_data = req.body;  //Get POST params


    var purchaseprice_id = post_data.purchaseprice_id;

    var item_id = post_data.item_id;
 

    var purchase_price = post_data.purchase_price;


    var purchase_quantity = post_data.purchase_quantity;

    var updated_quantity =  post_data.updated_quantity;

    
 
    con.query('SELECT * From item_purchase_price_history where purchaseprice_id=?',[purchaseprice_id],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
 
        if(result && result.length){
 
 
           
            con.query('INSERT INTO item_purchase_price_history (`item_id`, `purchase_price`,`purchase_quantity`,`start_date`)  VALUES (?,?,?,NOW())',[item_id,purchase_price,purchase_quantity],function(err,result,fields){
            con.on('error',function(err){
                console.log('[MySQL ERROR]',err);
                res.json('Register error: ' ,err);
            }); 

            con.query('UPDATE item SET  current_purchase_price = ?,quantity=? WHERE item_id = ?',[purchase_price,updated_quantity,item_id],function(err,result,fields){
            con.on('error',function(err){
                console.log('[MySQL ERROR]',err);
                res.json('Register error: ' ,err);
            });     
 
            })

            res.json('Price and quantity changed');     
 
            }) 


 
           






            
             
        }
        else
        {
              
 
            res.json('Item ni hai');
        }
 
    });
  
 
})

 
 
app.post('/updatesupplier/',(req,res,next)=>{
 
    var post_data = req.body;  //Get POST params
 
     
    var supplier_name = post_data.supplier_name;

    var supplier_company_name = post_data.supplier_company_name;

    var phone_no_1 = post_data.phone_no_1;

    var phone_no_2 = post_data.phone_no_2;

   
 
    con.query('SELECT * From supplier where supplier_name=?',[supplier_name],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
 
        if(result && result.length){
 
 
            con.query('UPDATE supplier SET supplier_company_name = ?, phone_no_1= ?, phone_no_2 = ? WHERE supplier_name = ?',[supplier_company_name,phone_no_1,phone_no_2,supplier_name],function(err,result,fields){con.on('error',function(err){
                console.log('[MySQL ERROR]',err);
                res.json('Register error: ' ,err);
            }); 
            res.json('Updated');
 
            })
             
        }
        else
        {
              
 
            res.json('Supplier ni hai');
        }
 
    });
  
 
})
   


 
app.post('/userList/',(req,res,next)=>{
 
    var post_data = req.body;
 
    var a = post_data.a
 
    con.query('SELECT * From user WHERE ?',[a],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
 
    res.end(JSON.stringify(result))
 
         
 
    });
 
 
     
 
         
 
})
 
 
app.post('/categoryList/',(req,res,next)=>{
 
    var post_data = req.body;
 
    var a = post_data.a
 
    con.query('SELECT * From category WHERE ?',[a],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
 
    res.end(JSON.stringify(result))
 
         
 
    });
 
 
     
 
         
 
})
 
 
app.post('/itemList/',(req,res,next)=>{
 
    var post_data = req.body;
 
    var a = post_data.a
 
    con.query('SELECT * From item WHERE ?',[a],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
 
    res.end(JSON.stringify(result))
 
         
 
    });
 
 
     
 
         
 
})
 
 


app.post('/categoryitemList/',(req,res,next)=>{
 
    var post_data = req.body;
 
    var a = post_data.a
 
    con.query('SELECT * From item WHERE category_id= ?',[a],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
 
    res.end(JSON.stringify(result))
 
         
 
    });
 
 
     
 
         
 
})
  
app.post('/supplierList/',(req,res,next)=>{
  
    var post_data = req.body;
  
    var a = post_data.a
  
    con.query('SELECT * From supplier WHERE ?',[a],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
  
    res.end(JSON.stringify(result))
  
          
  
    });
  
  
      
  
          
  
})
 
 
  
app.post('/paidbillList/',(req,res,next)=>{
  
    var post_data = req.body;
  
    var a = post_data.a
  
    con.query('SELECT * From bill_list WHERE paid_unpaid = "paid"',[a],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
  
    res.end(JSON.stringify(result))
  
          
  
    });
  
  
      
  
          
  
})
  

app.post('/unpaidbillList/',(req,res,next)=>{
  
    var post_data = req.body;
  
    var a = post_data.a
  
    con.query('SELECT * From bill_list WHERE paid_unpaid = "unpaid"',[a],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
  
    res.end(JSON.stringify(result))
  
          
  
    });
  
  
      
  
          
  
})


  
 
app.post('/sellpriceList/',(req,res,next)=>{
 
    var post_data = req.body;
 
    var item_id  = post_data.item_id
 
    con.query('SELECT * From item_sale_price_history WHERE item_id = ?',[item_id],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
 
    res.end(JSON.stringify(result))
 
         
 
    });
 
 
     
 
         
 
})
 
 
app.post('/purchasepriceList/',(req,res,next)=>{
 
    var post_data = req.body;
 
    var item_id  = post_data.item_id
 
    con.query('SELECT * From item_purchase_price_history WHERE item_id = ?',[item_id],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
 
    res.end(JSON.stringify(result))
 
         
 
    });
 
 
     
 
         
 
})
 
 
 
 
 
 
 
 
 
 
 
 
app.post('/login/',(req,res,next)=>{
 
    var post_data = req.body;
 
    //Extract email and password from request
    var user_password = post_data.password;
    var email = post_data.email;
 
    con.query('SELECT * From User where email=?',[email],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
 
        if(result && result.length){
            var salt = result[0].salt;  //Get salt of result if account exists
 
            var encrypted_password = result[0].encrypted_password;
 
            //Hash password from Login request with salt in Database
            var hashed_password = checkHashPassword(user_password,salt).passwordHash;
            if(encrypted_password == hashed_password)
                res.end(JSON.stringify(result[0])) //If password is true, return all info of user
 
            else
                res.end(JSON.stringify('Wrong Password'));
             
 
        }
        else
        {
            res.json('User ni  hai');
        }
 
    });
 
 
     
 
         
 
})
 
 
app.post('/itemProfile/',(req,res,next)=>{
 
    var post_data = req.body;
 
    //Extract email and password from request
     
    var item_id = post_data.item_id;
 
    con.query('SELECT * From item where item_id=?',[item_id],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
 
        if(result && result.length)
        {
                    res.end(JSON.stringify(result[0])) //If password is true, return all info of user
 
             
 
        }
        else
        {
            res.json('Item ni  hai');
        }
 
    });
 
 
     
 
         
 
})
 
  
app.post('/supplierProfile/',(req,res,next)=>{
  
    var post_data = req.body;
  
    //Extract email and password from request
      
    var supplier_id = post_data.supplier_id;
  
    con.query('SELECT * From supplier where supplier_id=?',[supplier_id],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
  
        if(result && result.length)
        {
                    res.end(JSON.stringify(result[0])) //If password is true, return all info of user
  
              
  
        }
        else
        {
            res.json('Supplier ni  hai');
        }
  
    });
  
  
      
  
          
  
})
  
  // search function for supplier list
app.post('/searchSupplier/',(req,res,next)=>{
  
    var post_data = req.body;
  
    //Extract email and password from request
      
    var supplier_name = post_data.supplier_name;
  
    con.query('SELECT * From supplier where supplier_name=?',[supplier_name],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
  
        if(result && result.length)
        {
                    res.end(JSON.stringify(result)); //If password is true, return all info of user
  
              
  
        }
        else
        {
            res.json('Supplier ni  hai');
        }
  
    });
  
  
      
  
          
  
})
 
 
/*
app.get("/",(req,res,next)=>{
    console.log('Password: 123456');
    var encrypt = saltHashPassword("123456");
    console.log('Encrypt: '+encrypt.passwordHash);
 
    console.log('Salt: '+encrypt.salt);
})*/
 
 
//Start Server
app.listen(3000,()=>{
 
    console.log('RM_Innovation RESTFUL running on port 3000');
})



