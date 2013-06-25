/*
How Geogram configures Mailgun with private API key 
*/
public function configMailgun() {
  //set the project identifier based on GET input request variables
  $this->_api_key = Yii::app()->params['mailgun']['api_key'];
  $this->_api_url = Yii::app()->params['mailgun']['api_url'];	  
}

/*
 Curl setup shortcuts for most Mailgun Messaging API calls
 - note: some API calls have different arguments
*/	
private function setup_curl($command = 'messages') {
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
  curl_setopt($ch, CURLOPT_USERPWD, 'api:'.Yii::app()->params['mailgun']['api_key']);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
  curl_setopt($ch, CURLOPT_URL, Yii::app()->params['mailgun']['api_url'].'/yourdomain.com/'.$command);  
  return $ch;   
}
