// Render create form and create new message via the website
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