// determine recipient list for outbound messages
public function process($count=100) {
	  // Determine recipient lists to deliver to Mailgun
    $criteria = new CDbCriteria();
    $criteria->limit = $count;
    $criteria->order = "created_at ASC";
    $items = Outbox::model()->pending()->findAll($criteria);
    foreach ($items as $i) {
	    $message = Yii::app()->db->createCommand()
        ->select('*')
        ->from(Yii::app()->getDb()->tablePrefix.'post p')
        ->where('id=:id', array(':id'=>$i['post_id']))
        ->queryRow();

      // create new outboundmail record
      $ob = new OutboundMail;
  		$ob->post_id=$i['post_id'];
      $ob->status=OutboundMail::STATUS_HOLD;
      $ob->created_at =new CDbExpression('NOW()'); 
      $ob->modified_at =new CDbExpression('NOW()');

      $ob->save();      
      // look up recipients for $message->place_id
      // - find members
      $p = new Place();
  		$r = $p->listMembers($message['place_id']);
  		// create new outbound mail recipient list entries
  		foreach ($r as $recipient) {
		        // ensure sender is not blocked by each recipient
		        if (!Block::model()->isBlocked($message['author_id'],$recipient->user_id)) {
  		          $delivery_mode = $recipient->delivery_post;
	            if ($message['author_id']==$recipient->user_id) {
	              // don't send message to the sender / but include it in their recipient log
	              $delivery_mode = Member::DELIVER_NONE;  		            
	            }
          	  $outbox = Yii::app()->db->createCommand()->insert(Yii::app()->getDb()->tablePrefix.'outbound_mail_recipient',array('outbound_mail_id'=>$ob->id,'user_id'=>$recipient->user_id,'delivery_mode'=>$delivery_mode,'post_id'=>$i['post_id'],'status'=>OutboundMail::STATUS_PENDING));  		    		          
		        }
  		}
  	 
  		// change status of outbox item
  		// set xfer datetime
  	  $outbox = Yii::app()->db->createCommand()->update(Yii::app()->getDb()->tablePrefix.'outbox',array('status'=>Outbox::STATUS_SENT,'xfer_at'=>new CDbExpression('NOW()')),'id=:id', array(':id'=>$i['id']));

  	  // change status of outbound_mail item to PENDING
  		$cc = Yii::app()->db->createCommand()->update(Yii::app()->getDb()->tablePrefix.'outbound_mail',array('status'=>OutboundMail::STATUS_PENDING),'post_id=:post_id', array(':post_id'=>$i['post_id']));
    }
	}
