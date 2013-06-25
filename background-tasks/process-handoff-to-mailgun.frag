/*
 Takes pre-processed outbound messages and hands them off to Mailgun via the Mailgun API
 - Builds recipient variables as JSON string
 - Calls send broadcast message
*/
public function process($count=100) {
   // Fetch message and recipient list & Send with Mailgun
   // Fetch msgs pending in Outbound
   $criteria = new CDbCriteria();
   $criteria->limit = $count;
   $criteria->order = "created_at ASC";
   $items = OutboundMail::model()->pending()->findAll($criteria);   
   foreach ($items as $i) {
     // fetch single message
    $message = Yii::app()->db->createCommand()
       ->select('p.*,q.slug,q.prefix,u.eid')
       ->from(Yii::app()->getDb()->tablePrefix.'post p')
       ->where('p.id=:id', array(':id'=>$i['post_id']))
       ->queryRow();
     // get the recipient list
 	  $rxList = Yii::app()->db->createCommand()
->select('*')->from(Yii::app()->getDb()->tablePrefix.'outbound_mail_rx_list o') ->where('delivery_mode = '.Member::DELIVER_EACH,array(':outbound_mail_id'=>$i['id']))->queryAll();
     $rx_var ='{';
       $to_list = '';
     foreach ($rxList as $rx) {
       $rx_var = $rx_var.'"'.$rx['email'].'": {"id":'.$rx['id'].'}, ';
       $to_list = $to_list.$rx['email'].', ';
     }      
     $rx_var =trim($rx_var,', ').'}';
     $mg = new Mailgun();
     $fromAddr = getUserFullName($message['author_id']).' <u_'.$message['eid'].'+'.$message['slug'].'@'.Yii::app()->params['mail_domain'].'>';     
     $result = $mg->send_broadcast_message($fromAddr,$message['subject'],$message['body'].$this->mail_footer.$place_url,$to_list,$rx_var,$i['post_id']);
     $mg->recordId($result,$i['id']);
 	  // change status of outbound_mail item to SENT
 	  $outbox = Yii::app()->db->createCommand()->update(Yii::app()->getDb()->tablePrefix.'outbound_mail',array('status'=>OutboundMail::STATUS_SENT,'sent_at'=>new CDbExpression('NOW()')),'id=:id', array(':id'=>$i['id']));
   }
}
