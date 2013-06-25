/*
 Render create form and create new message via the website
 - saves new posts to the outbox table, status = pending
*/
public function actionCreate($place_id = 0)
{
	$model=new Post;
	$model->place_id = $place_id;
	if(isset($_POST['Post']))
	{
		$model->attributes=$_POST['Post'];
		if($model->save()) {
	    Yii::app()->user->setFlash('postSubmitted','Thank you, your message has been posted.'); 
			$this->redirect(array('/post/view','id'=>$model->id));		  
		}
	}
	$this->render('create',array(
		'model'=>$model,
	));
}

// create an entry for sending this message in the outbox
protected function afterSave()
{
  // add new item to outbox table
   $outbox=new Outbox;
		$outbox->post_id=$this->id;
   $outbox->status=Outbox::STATUS_PENDING;
   $outbox->created_at =new CDbExpression('NOW()'); 
   $outbox->modified_at =new CDbExpression('NOW()');          
		$outbox->save();      		
  return parent::afterSave();
}
