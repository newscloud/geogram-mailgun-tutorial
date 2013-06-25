// Example of command processing
// First part of message body scanned for !-command-strings
$msgLead = substr($body,0,200);
if (stripos($msgLead,'!nomail')!==false) {
  $this->log_item('nomail request'.$sender->id.' '.$sender->email);
  // set nomail
  $sender->no_mail = true;
  $sender->save();
  $commandRequest=true;
}
