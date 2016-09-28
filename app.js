var request = require('request');
var async = require('async');
var MailChimpAPI = require('mailchimp').MailChimpAPI;




var MailChimpAPI = require('mailchimp').MailChimpAPI;

var apiKey = 'a89579ecf1f5194ec2af432eda4840c8-us14';

try {
    var api = new MailChimpAPI(apiKey, { version : '2.0' });
} catch (error) {
    console.log(error.message);
}

api.call('lists', 'list', { start: 0, limit: 25 }, function (error, data) 
{
  if (error)
        console.log(error.message);
  else
  {
		async.eachSeries(data.data, function (listdata, callback) 
		{
			if(listdata.name == "Writers_portal")
			{
				console.log("------------------------------Start----------------------------------------------------------------");
        			console.log(JSON.stringify(listdata)); // Do something with your data!
				var listid = listdata.id;
				api.call('templates', 'list', { start: 0, limit: 25 }, function (error, templatedata) 
				{
					if(error) console.log("Template feting error")
					else
					{
						console.log(JSON.stringify(templatedata));
						var optionparams = {
              "apikey": apiKey,
              "type": "regular",
              "options": {
                "list_id": listid,
                "subject": "example subject",
                "from_email": "test@test.com",
                "from_name": "unipaper",
                "template_id": 11307,
                "gallery_template_id": 11307,
                "base_template_id":11307,
                "tracking": {
                  "opens": true,
                  "html_clicks": true,
                  "text_clicks": true
                },
                "title": "example title",
                "authenticate": true,       
                "auto_footer": true,
                "inline_css": true,
                "generate_text": true,        
              },
              "content": {
                "html": "example html",             
                "text": "example text",             
              }
            }

            api.call('campaigns', 'create', optionparams, function (error, campaigndata) 
            {
                if(error)
                  console.log("Campaing Creating Error = "+error);
                else
                {
                  console.log("Campaign created data = "+JSON.stringify(campaigndata));
                  var cid = campaigndata.id;
                  console.log("cid = "+cid);
                  var campaignsoptions = {
                  "apikey": apiKey,
                  "cid":cid
                  }

                  api.call('campaigns', 'send', campaignsoptions, function (error, campaign_send_data) 
                  {
                      if(error)
                        console.log("Campaing Sending Error = "+error);
                      else
                      {
                          console.log("Campign successful send = "+JSON.stringify(campaign_send_data));
                      }
                  });
                }
            });  
					  console.log("-------------------------------END---------------------------------------------------------------");
					}			

				});
			}
   		callback();
  	});
	}
});




