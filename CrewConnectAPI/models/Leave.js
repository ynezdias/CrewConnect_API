const mongoose=require('mongoose');
const bcrypt=require('bcrypt')

const leaveSchema=new mongoose.Schema({

    leaveRequest:{
        type:Array,
        default:[]
    },

    wfhRequest:{
        type:Array,
        default:[]
    },
    meetingdate:{
        type:String,
        default:""
    },

    meetingtime:{
        type:String,
        default:""
    },

    holidaydate:{
        type:String,
        default:""
    },

    notices:{
        type:Array,
        default:[]
    },

    fileuploads:{
        type:Array,
        default:[]
    },

})

leaveSchema.pre('save', function(next) {
    if (this.notices && this.notices.length > 0) {
      // Move the last element to the 0th position
      const lastNotice = this.notices.pop();
      this.notices.unshift(lastNotice);
    }

    if (this.fileuploads && this.fileuploads.length > 0) {
        // Move the last element to the 0th position
        const lastFile = this.fileuploads.pop();
        this.fileuploads.unshift(lastFile);
      }
    next();
  });


mongoose.model('Leave',leaveSchema)