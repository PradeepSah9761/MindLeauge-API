import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
    {
        userType:
        {
            type:String,
            enum:['student','alumni']
        },
        firstName:
        {
            type: String,
            required: true
        },
        lastName:
        {
            type: String,
            required: true
        },
        phoneNumber:
        {
            type: String,
            required: true,
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
            required: true,
            validate: {
                validator: function (email) {
                  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
                },
                message: props => `This is not a valid email! Please enter a valid email`
              }
        },
        age:
        {
            type: Number,
            required: true
        },
        country:
        {
            type: String,
            enum: ['Australia', 'United States', 'Isrsel', 'United Kingdom', 'Canada', 'France', 'South Africa']
        },
        city:
        {
            type: String,
            require:true

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
                message: props => `This is not a valid email of father! Please enter a valid email`
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

        schoolName:
        {
            type: String, required: true
        },
        clubName:
        {
            type: String, required: true
        },

        payPalId:
        {
            type: String
        },

        password:
        {
            type: String,
            required: true
        },
        confirmPassword:
        {
            type: String,

        }
    },{timestaps:true}
);

const StudentAndAlumniModel=mongoose.model("studentDatails",studentSchema);
export  {StudentAndAlumniModel};
