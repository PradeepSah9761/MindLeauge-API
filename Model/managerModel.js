import mongoose from 'mongoose';

const managerSchema = new mongoose.Schema(
    {
        fullName:
        {
            type: String,
            required: true
        },
        phoneNo:
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
            requierd: true,
            validate: {
                validator: function (email) {
                  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
                },
                message: props => `This is not a valid email! Please enter a valid email`
              }

        },
        country:
        {
            type: String,
            enum: ['Australia', 'United States', 'Isrsel', 'United Kingdom', 'Canada', 'France', 'South Africa'],
            required: true
        },
        city:
        {
            type: String, required: true


        },
        logo:
        {
            type: String,
            required: true



        },
        boardSkin:
        {

            type: String,
            required: true
        },
        schoolName:
        {
            type: String, required: true
        },
        schoolClub:
        {
            type: String, required: true
        },
        schoolAddress:
        {
            type: String, required: true
        },
        payPalId:
        {
            type: String, required: true
        },
        backupManager:
        {
            type: Object,
            required: true,
            
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

    }, { timestamps: true }
)
const managerModel = mongoose.model("managerDetails", managerSchema);
export default managerModel;