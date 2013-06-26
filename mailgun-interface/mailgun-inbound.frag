/* 
  Controller called when Mailgun posts data from inbound mail
    - Places data into inbox table in serialized form
*/
public function actionInbound()
{	  
  $mg = new Mailgun;
   // verify post made by Mailgun
    if ($mg->verifyWebHook($_POST['timestamp'],$_POST['token'],$_POST['signature'])) {
  	  $bundle = serialize($_POST);
  	  $inboxItem = new Inbox;
  	  $inboxItem->addBundle($bundle);
    }	    
}

