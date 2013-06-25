/*
Example of sending a private message to a user
- check that they aren't blocked
- handoff to mailgun via send_simple_message
*/
public function sendPrivateMessage($from,$subject,$body,$to) {
  $this->init();
  $mg = new Mailgun();
  // check that either user is not blocked
  if (!Block::model()->isBlocked($to->id,$from['id'])) {
    // remove !private command if present
	  $body= ltrim(str_ireplace('!private','',$body)).$this->private_mail_footer;
	  // anonymize the from address
    $fromAddr = getUserFullName($from['id']).' <u_'.$from['eid'].'@'.Yii::app()->params['mail_domain'].'>';
    $mg->send_simple_message($to->email,$subject,$body,$fromAddr);	        
  } else {
    // send error message
    $mg->send_simple_message($from['email'],'Sorry, we\'re not able to deliver that message.','We are unable to deliver private messages to this recipient. If you have any questions, please contact us '.Yii::app()->baseUrl.'/site/contact');      
  }
}
