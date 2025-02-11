import mongoose from 'mongoose';

const registerSchema = new mongoose.Schema(
    {
        fullName:
        {
            type: String,
            
        },
        phoneNo:
        {
            type: String,
           
            validate: {
                validator: function (phone) {
                  return /^\+\d{1,3}\d[0-9]{7,10}$/.test(phone); 
                },
                message: `This is not a valid mobile number! Please enter a valid mobile number with country code`
              }
          
            
        },
        email:
        {
            type: String,
           
            validate: {
                validator: function (email) {
                  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
                },
                message: `This is not a valid email! Please enter a valid email`
              }

        },
        country:
        {
            type: String,
            enum: ['Australia', 'United States', 'Isrsel', 'United Kingdom', 'Canada', 'France', 'South Africa'],
            
        },
        city:
        {
            type: String, 


        },
        logo:
        {
        //    filename:String,
        //    filepath:String,
        type:String,
         
        },
        boardSkin:
        {

            type: String,
            
        },
        schoolName:
        {
            type: String, 
        },
        schoolClub:
        {
            type: String, 
        },
        schoolAddress:
        {
            type: String, 
        },
        payPalId:
        {
            type: String, 
        },
        backupManager:
        {
            type: Object,
            
           
            
        },
      
        userType:
        {
            type:String,
            enum:['student','alumni','manager','coach']
        },
        firstName:
        {
            type: String,
            
        },
        lastName:
        {
            type: String,
           
        },
       
        age:
        {
            type: Number,
            
        },
        
       
        fatherName:
        {
            type: String
        },
        fatherEmail:
        {
            type: String,
            validate: {
                validator: function (email) {
                  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
                },
                message:  `This is not a valid email of father! Please enter a valid email`
              }
        },
        fatherPhone:
        {
            type: Number,
            validate: {
                validator: function (phone) {
                  return /^\+\d{1,3}\d[0-9]{7,10}$/.test(phone); 
                },
                message: `This is not a valid mobile number of father! Please enter a valid mobile number with country code`
              }
        }, motherName:
        {
            type: String
        },
        motherEmail:
        {
            type: String,
            validate: {
                validator: function (email) {
                  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
                },
                message:  `This is not a valid email of mother! Please enter a valid email`
              }
        },
        motherPhone:
        {
            type: Number,
            validate: {
                validator: function (phone) {
                  return /^\+\d{1,3}\d[0-9]{7,10}$/.test(phone); 
                },
                message: `This is not a valid mobile number of mother! Please enter a valid mobile number with country code`
              }
        },

        
        password:
        {
            type:String
            
        },

        yearOfExperience:
        {
            type:Number
        }
        ,
        rating:
        {
            type:String
        },
        commissions:
        {
            type:Number
        },
        otp: 
        { 
            type: String 
        },
        otpExpires: 
        {
             type: Date 
       },
    
        isVerified:
         {
             type: Boolean,
              default: false
             },
    },{timestamps:true}
);

const userModel=mongoose.model("userRegistrationDetail",registerSchema);
export  {userModel};
