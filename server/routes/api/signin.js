const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

module.exports = (app) => {
  // app.get('/api/counters', (req, res, next) => {
  //   Counter.find()
  //     .exec()
  //     .then((counter) => res.json(counter))
  //     .catch((err) => next(err));
  // });

  // app.post('/api/counters', function (req, res, next) {
  //   const counter = new Counter();

  //   counter.save()
  //     .then(() => res.json(counter))
  //     .catch((err) => next(err));
  // });
  
  //SIGN UP

  app.post('/api/accounts/signup', (req, res, next) => {
    const { body } = req;
    const { 
      firstName,
      lastName,
      password
    } = body;
    let{ email } = body;
    

  if(!firstName){
    return res.send({
      success: false,
      message: 'Error: firstName cannot be blank'
    });
  }

  if(!lastName){
    return res.send({
      success: false,
      message: 'Error: lastName cannot be blank'
    });
  }

  if(!email){
    return res.send({
      success: false,
      message: 'Error: email cannot be blank'
    });
  }

  if(!password){
    return res.send({
      success: false,
      message: 'Error: password cannot be blank'
    });
  }


  email = email.toLowerCase();
  //Steps for signing up

  User.find({ email: email }, (err, previousUsers) =>{
    if(err){
      return res.send({
      success: false,
      message: 'Error: Server Error'
    });
    }
    else if(previousUsers.length > 0){
      return res.send({
      success: false,
      message: 'Error: Invalid'
    });
    }
    //SIGN UP
    const newUser = new User();
    newUser.email = email;
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.password = newUser.generateHash(password);
    newUser.save(function(err, user){
      if(err){
        return res.send({
        success: false,
        message: 'Error: Server Error'
        });
      }
      return res.send({
        success: true,
        message: 'Signed Up'
      });
    });
  });
});



app.post('/api/accounts/signin', (req, res, next) =>{
    const { body } = req;
    const { 
      password
    } = body;
    let{ email } = body;

    if(!email){
    return res.send({
      success: false,
      message: 'Error: email cannot be blank'
      });
    }

    if(!password){
      return res.send({
      success: false,
      message: 'Error: password cannot be blank'
      });
    }

    email = email.toLowerCase();

    User.find({ email: email },(err, users) =>{
      if (err) {
        return res.send({
          success: false,
          message: "Error: server error"
        });
      }

      if(users.length != 1){
        return res.send({
          success: false,
          message: "Error: Invalid"
        });
      }

      const user = users[0];
      if(!user.validPassword(password)){
        return res.send({
          success: false,
          message: "Error: Invalid"
        });
      }

      const userSession = new UserSession;
      userSession.userId = user._id;
      userSession.save(function(err, doc){
           if (err) {
        return res.send({
          success: false,
          message: "Error: server error"
        });
      }

      return res.send({
        success: true,
        message: 'Valid sign in',
        token: doc._id
      });
      });     

    });
    });
  

  app.get('/api/accounts/verify', (req, res, next) => {
    // Get the token
    const { query } = req;
    const { token } = query;
    // ?token=test
    // Verify the token is one of a kind and it's not deleted.
    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      } else {
        // DO ACTION
        return res.send({
          success: true,
          message: 'Good'
        });
      }
    });
  });

app.get('/api/accounts/logout', (req, res, next) => {
    // Get the token
    const { query } = req;
    const { token } = query;
    // ?token=test
    // Verify the token is one of a kind and it's not deleted.
    UserSession.findOneAndUpdate({
      _id: token,
      isDeleted: false
    },{$set:{isDeleted:true}}, null, (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
       else {
        // DO ACTION
        return res.send({
          success: true,
          message: 'Good'
        });
      }
    });
  });

};