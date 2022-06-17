const mongoose = require("mongoose");

function connectDb() {
    return mongoose.connect(
      "mongodb+srv://xoxokss:test@cluster0.dkb77.mongodb.net/carrot?retryWrites=true&w=majority",
      // "mongodb+srv://test:sparta@cluster0.rx7dw.mongodb.net/minipjt?retryWrites=true&w=majority",
      {
       ignoreUndefined: true,
       useNewUrlParser: true,
       useUnifiedTopology: true,
      }
    )
};
module.exports = connectDb;
//----------------------------------------------//