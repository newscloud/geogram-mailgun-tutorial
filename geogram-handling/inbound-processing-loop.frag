/*
  This is the outer processing loop Geogram uses for Inbound messages
  - we unserialize the post from Mailgun (previously serialized & stored in the database)
*/
public function process($count=100) {
  // processes commands in the inbox
  $this->configMailgun();
  $criteria = new CDbCriteria();
  $criteria->limit = $count;
  $criteria->order = "created_at ASC";
  $inboxItems = Inbox::model()->pending()->findAll($criteria);
  foreach ($inboxItems as $i) {
    echo 'inbox item id: '.$i['id'].'<br />';
    $commandRequest=false;
    $cmd = unserialize($i['bundle']);
    // Lookup sender from $cmd['sender']
    $sender_email = $cmd['sender'];
    $sender = User::model()->findByAttributes(array('email'=>$sender_email));
    if ($sender === null) {
      // send alert - we don't know that address
      OutboundMail::alertUnknownSender($sender_email);
    } else {
      // do all of our processing per message (described below)
    }
  	// change status of inbox item  
      Inbox::model()->updateAll(array( 'status' => self::STATUS_PROCESSED,'processed_at'=> new CDbExpression('NOW()') ), 'id = '.$i['id'] );      	    
    // end of loop thru inbox items
  	} 
}



