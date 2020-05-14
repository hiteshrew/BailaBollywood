const express = require('express');
const router = express.Router();
const axios = require('axios');



router.get('/social-handles',(req,res)=>{
    axios.get('https://graph.instagram.com/me/media?fields=id,media_type,media_url,username,timestamp&access_token=IGQVJYSjFxeEtldlFON0V2dGJMZAG1lcEJYQmRhTks3eFpEVk5ING5GRUxtVWpHWU91VVF6STFtbDUyT3liSzI2MmxNelVXSDRIN2x4UUh2VHRXSW5Uc2lXeTU1QzZAkLWMxWllpMDF4OVZAVWDdBZAXJaUgZDZD')
    .then(function (response) {
      
      let data = response.data.data;
      let toSendData = [];
      for(i=0;i<data.length;i++){
        if(i===12)
        break;
        let type=data[i].media_type;
        let url = data[i].media_url;
        let index = (i+1)%4;
        index=index===0?4:index;
        console.log(index);
        const obj = {type:type,url:url,index:index};
        toSendData.push(obj);
      }
      //console.log(toSendData.length);
      res.render('./socialHandle/index',{insta:toSendData});
      })
    .catch(function (error) {
      // handle error
      console.log("Error in axios:"+error.message);
    })
    .finally(function () {
      // always executed
      console.log("Executed Finally")
    });
   
  })





module.exports=router;